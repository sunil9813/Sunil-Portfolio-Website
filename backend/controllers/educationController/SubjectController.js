const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2;
const Filter = require("bad-words");
const axios = require("axios");
const { mongoose } = require("mongoose");

require("../../models/users/UserModel");

const SubjectModel = require("../../models/educationModel/SubjectModel");
const ChapterModel = require("../../models/educationModel/ChapterModel");
const OrderModel = require("../../models/order/OrderModel");

const MAX_RESOURCE_SIZE = 10 * 1024 * 1024;

const ALLOWED_RESOURCE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
];

const getResourceType = (mimeType = "") => {
  if (mimeType === "application/pdf") return "pdf";

  if (mimeType === "application/msword" || mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return "word";
  }

  if (mimeType === "application/vnd.ms-excel" || mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    return "excel";
  }

  if (mimeType === "application/vnd.ms-powerpoint" || mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
    return "ppt";
  }

  if (mimeType.startsWith("image/")) {
    return "image";
  }

  return "other";
};

const getCourseResourceFiles = (req) => {
  const newFiles = req.files?.resourceFiles || [];
  const oldFiles = req.files?.resourceFile || [];

  return [...newFiles, ...oldFiles];
};

const parseResourceMetadata = (resourceMetadata) => {
  if (!resourceMetadata) {
    return [];
  }

  if (typeof resourceMetadata === "string") {
    try {
      return JSON.parse(resourceMetadata);
    } catch (error) {
      return [];
    }
  }

  return Array.isArray(resourceMetadata) ? resourceMetadata : [];
};

// helper for course resource upload
const getFileExtension = (fileName = "") => {
  const match = fileName.match(/\.[0-9a-z]+$/i);
  return match ? match[0].toLowerCase() : "";
};

const sanitizePublicIdName = (fileName = "resource") => {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
};

const isImageType = (mime = "") => mime.startsWith("image/");

const uploadBufferToCloudinary = (fileBuffer, uploadOptions) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    uploadStream.end(fileBuffer);
  });
};

const uploadCourseResourceFile = async (resourceFile, metadata = {}, index = 0) => {
  if (!resourceFile) {
    throw new Error("Resource file is missing.");
  }

  if (!resourceFile.buffer && !resourceFile.path) {
    throw new Error("Resource file data is missing. Please upload the file again.");
  }

  const extension = getFileExtension(resourceFile.originalname);
  const displayName = metadata.displayName?.trim() || resourceFile.originalname.replace(/\.[^/.]+$/, "");
  const safeBaseName = sanitizePublicIdName(displayName);
  const uniqueId = `${Date.now()}-${index}`;

  const uploadOptions = {
    folder: "Sunil Portfolio/Courses/Resources",

    // Only real images use Cloudinary image.
    // PDF, Word, Excel, PPT must use raw.
    resource_type: isImageType(resourceFile.mimetype) ? "image" : "raw",
  };

  // Keep extension for PDF, Word, Excel, PPT.
  // This allows browser/Office preview to understand the real file type.
  if (!isImageType(resourceFile.mimetype)) {
    uploadOptions.public_id = `${safeBaseName}-${uniqueId}${extension}`;
  }

  const result = resourceFile.buffer ? await uploadBufferToCloudinary(resourceFile.buffer, uploadOptions) : await cloudinary.uploader.upload(resourceFile.path, uploadOptions);

  return {
    fileName: resourceFile.originalname,
    displayName,
    filePath: result.secure_url,
    fileType: resourceFile.mimetype,
    publicId: result.public_id,
    size: resourceFile.size,
    order: Number(metadata.order || index + 1),
    resourceType: getResourceType(resourceFile.mimetype),
    cloudinaryResourceType: result.resource_type || uploadOptions.resource_type,
  };
};

const deleteCloudinaryResourceFiles = async (resourceFiles = []) => {
  const uniqueFiles = [];
  const seenPublicIds = new Set();

  resourceFiles.forEach((file) => {
    if (!file?.publicId || seenPublicIds.has(file.publicId)) {
      return;
    }

    seenPublicIds.add(file.publicId);
    uniqueFiles.push(file);
  });

  await Promise.all(
    uniqueFiles.map((file) =>
      cloudinary.uploader.destroy(file.publicId, {
        resource_type: file.cloudinaryResourceType || (file.resourceType === "image" ? "image" : "raw"),
      }),
    ),
  );
};

const findSubheadingById = (subheadings = [], subheadingId) => {
  for (const subheading of subheadings) {
    if (String(subheading?._id) === String(subheadingId)) {
      return subheading;
    }

    const nestedSubheading = findSubheadingById(subheading?.children || [], subheadingId);

    if (nestedSubheading) {
      return nestedSubheading;
    }
  }

  return null;
};

const getSubheadingFromChapter = async (chapterId, subheadingId) => {
  if (!mongoose.Types.ObjectId.isValid(chapterId) || !mongoose.Types.ObjectId.isValid(subheadingId)) {
    return { error: "Invalid chapter or subheading id.", status: 422 };
  }

  const chapter = await ChapterModel.findById(chapterId);

  if (!chapter) {
    return { error: "Chapter not found.", status: 404 };
  }

  const subheading = findSubheadingById(chapter.subheadings || [], subheadingId);

  if (!subheading) {
    return { error: "Subheading not found.", status: 404 };
  }

  return { chapter, subheading };
};

const isPremiumSubject = (subject = {}) => {
  const normalizedAccessType = String(subject.accessType || "").toLowerCase();

  return ["paid", "pro"].includes(normalizedAccessType) || Number(subject.price || 0) > 0;
};

const hasSubjectLessonAccess = async (subject, user) => {
  if (!subject) return false;

  const isPremium = isPremiumSubject(subject);

  if (!isPremium) {
    return Boolean(user?._id);
  }

  if (!user?._id) {
    return false;
  }

  const order = await OrderModel.exists({
    user: user._id,
    status: "paid",
    amount: { $gt: 0 },
    expiresAt: { $gte: new Date() },
    orderItems: {
      $elemMatch: {
        product: subject._id,
        productModel: "Subject",
        price: { $gt: 0 },
      },
    },
  });

  return Boolean(order);
};

const getLockedSubheadings = (subheadings = []) =>
  subheadings.map((subheading) => {
    const item = subheading?.toObject?.() || subheading || {};

    return {
      _id: item._id,
      title: item.title,
      metaTitle: item.metaTitle,
      metaDescription: item.metaDescription,
      slug: item.slug,
      order: item.order,
      likesCount: item.likesCount || item.likes?.length || 0,
      bookmarksCount: item.bookmarksCount || item.bookmarks?.length || 0,
      numOfViews: item.numOfViews || 0,
      children: getLockedSubheadings(item.children || []),
    };
  });

const getLockedChapter = (chapter) => {
  const item = chapter?.toObject?.() || chapter || {};

  return {
    _id: item._id,
    subject: item.subject,
    title: item.title,
    metaTitle: item.metaTitle,
    metaDescription: item.metaDescription,
    slug: item.slug,
    order: item.order,
    user: item.user,
    likesCount: item.likesCount || item.likes?.length || 0,
    bookmarksCount: item.bookmarksCount || item.bookmarks?.length || 0,
    numOfViews: item.numOfViews || 0,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    subheadings: getLockedSubheadings(item.subheadings || []),
  };
};

const createSubject = asyncHandler(async (req, res) => {
  const { name, description, metaDescription, university, faculty, program, accessType, groupId, visibility, scheduledPublish, tags, highlights, price, discount, discountDate, resourceMetadata } =
    req.body;
  const userId = req.user.id;

  const filter = new Filter();
  const fieldsToCheck = [name, metaDescription];

  for (const field of fieldsToCheck) {
    if (field && filter.isProfane(field)) {
      return res.status(400).json({
        error: "Creation failed because the content contains profane words.",
      });
    }
  }

  if (!name) return res.status(400).json({ error: "Subject name is required." });
  if (!description) return res.status(400).json({ error: "Description is required." });
  if (!metaDescription) return res.status(400).json({ error: "Meta description is required." });

  if (metaDescription.length > 160) {
    return res.status(400).json({ error: "Meta description cannot exceed 160 characters." });
  }

  if (visibility === "scheduled") {
    if (!scheduledPublish) {
      return res.status(400).json({ error: "Scheduled publish date is required when visibility is set to scheduled." });
    }

    if (new Date(scheduledPublish) <= new Date()) {
      return res.status(400).json({ error: "Scheduled publish date must be in the future." });
    }
  }

  const originalSlug = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g, strict: true });

  let slug = originalSlug;
  let suffix = 1;

  while (await SubjectModel.findOne({ slug })) {
    slug = `${suffix}-${originalSlug}`;
    suffix++;
  }

  if (!req.files || !req.files.thumbnail || !req.files.thumbnail[0]) {
    return res.status(400).json({ error: "Thumbnail is required." });
  }

  const thumbnailFile = req.files.thumbnail[0];
  const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (!allowedImageTypes.includes(thumbnailFile.mimetype)) {
    return res.status(400).json({ error: "Invalid thumbnail format. Supported formats: JPEG, PNG, JPG." });
  }

  if (thumbnailFile.size > 10 * 1024 * 1024) {
    return res.status(400).json({ error: "Thumbnail size should not exceed 10 MB." });
  }

  let thumbnailData = {};

  try {
    await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "Sunil Portfolio/Courses/Thumbnails",
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(new Error("Thumbnail upload failed."));

          thumbnailData = {
            fileName: thumbnailFile.originalname,
            filePath: result.secure_url,
            fileType: thumbnailFile.mimetype,
            publicId: result.public_id,
          };

          resolve();
        },
      );

      uploadStream.end(thumbnailFile.buffer);
    });
  } catch (error) {
    return res.status(500).json({ error: "Thumbnail could not be uploaded." });
  }

  let resourceFilesData = [];

  const incomingResourceFiles = getCourseResourceFiles(req);
  const parsedResourceMetadata = parseResourceMetadata(resourceMetadata);

  if (incomingResourceFiles.length > 0) {
    try {
      resourceFilesData = await Promise.all(incomingResourceFiles.map((resourceFile, index) => uploadCourseResourceFile(resourceFile, parsedResourceMetadata[index] || {}, index)));
      resourceFilesData = resourceFilesData.sort((a, b) => a.order - b.order);
    } catch (error) {
      if (thumbnailData.publicId) {
        await cloudinary.uploader.destroy(thumbnailData.publicId, { resource_type: "image" });
      }

      return res.status(400).json({
        error: error.message || "Resource files could not be uploaded.",
      });
    }
  }

  const legacyResourceFileData = resourceFilesData[0]
    ? {
        type: "file",
        file: resourceFilesData[0],
      }
    : {};

  let tagsArray = [];

  if (tags) {
    let parsedTags = [];

    if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags);
      } catch (error) {
        await deleteCloudinaryResourceFiles(resourceFilesData);

        if (thumbnailData.publicId) {
          await cloudinary.uploader.destroy(thumbnailData.publicId, { resource_type: "image" });
        }

        return res.status(400).json({ error: "Invalid tags format. Tags must be a valid JSON array of objects." });
      }
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    } else {
      return res.status(400).json({ error: "Tags must be an array of objects." });
    }

    try {
      tagsArray = parsedTags.map((tagObj) => {
        if (typeof tagObj.tag !== "string" || tagObj.tag.trim() === "") {
          throw new Error("Each tag must be a valid non-empty string inside an object.");
        }

        if (tagObj.tag.length > 50) {
          throw new Error("Each tag cannot exceed 50 characters.");
        }

        return { tag: tagObj.tag.trim() };
      });

      const tagValues = tagsArray.map((item) => item.tag);

      if (new Set(tagValues).size !== tagValues.length) {
        throw new Error("Duplicate tags are not allowed.");
      }
    } catch (error) {
      await deleteCloudinaryResourceFiles(resourceFilesData);

      if (thumbnailData.publicId) {
        await cloudinary.uploader.destroy(thumbnailData.publicId, { resource_type: "image" });
      }

      return res.status(400).json({ error: error.message });
    }
  }

  let highlightsArray = [];

  if (highlights) {
    let parsedHighlights = [];

    if (typeof highlights === "string") {
      try {
        parsedHighlights = JSON.parse(highlights);
      } catch (error) {
        await deleteCloudinaryResourceFiles(resourceFilesData);

        if (thumbnailData.publicId) {
          await cloudinary.uploader.destroy(thumbnailData.publicId, { resource_type: "image" });
        }

        return res.status(400).json({ error: "Invalid highlights format. Highlights must be a valid JSON array of objects." });
      }
    } else if (Array.isArray(highlights)) {
      parsedHighlights = highlights;
    } else {
      return res.status(400).json({ error: "Highlights must be an array of objects." });
    }

    try {
      highlightsArray = parsedHighlights.map((highlightObj) => {
        if (typeof highlightObj.highlight !== "string" || highlightObj.highlight.trim() === "") {
          throw new Error("Each highlight must be a valid non-empty string inside an object.");
        }

        if (highlightObj.highlight.length > 100) {
          throw new Error("Each highlight cannot exceed 100 characters.");
        }

        return { highlight: highlightObj.highlight.trim() };
      });

      const highlightValues = highlightsArray.map((item) => item.highlight);

      if (new Set(highlightValues).size !== highlightValues.length) {
        throw new Error("Duplicate highlights are not allowed.");
      }
    } catch (error) {
      await deleteCloudinaryResourceFiles(resourceFilesData);

      if (thumbnailData.publicId) {
        await cloudinary.uploader.destroy(thumbnailData.publicId, { resource_type: "image" });
      }

      return res.status(400).json({ error: error.message });
    }
  }

  let finalPrice = price ? parseFloat(price) : 0;
  let finalDiscount = discount ? parseFloat(discount) : 0;
  let finalDiscountDate = discountDate ? new Date(discountDate) : null;
  let finalDiscountShow = false;

  if (finalDiscount > 0) {
    if (!discountDate) {
      return res.status(400).json({ error: "Discount date is required when a discount is provided." });
    }

    if (isNaN(finalDiscountDate) || finalDiscountDate <= new Date()) {
      return res.status(400).json({ error: "Discount date must be a valid future date." });
    }

    if (finalDiscount >= finalPrice) {
      return res.status(400).json({ error: "Discount cannot be greater than or equal to the price." });
    }

    finalDiscountShow = true;
  } else {
    finalDiscount = 0;
    finalDiscountDate = null;
    finalDiscountShow = false;
  }

  if (finalDiscountDate && finalDiscountDate <= new Date()) {
    finalDiscount = 0;
    finalDiscountDate = null;
    finalDiscountShow = false;
  }

  try {
    const data = await SubjectModel.create({
      user: userId,
      university,
      faculty,
      program,
      name,
      slug,
      description,
      metaDescription,
      accessType: accessType || "unpaid",
      groupId,
      visibility,
      scheduledPublish: visibility === "scheduled" ? new Date(scheduledPublish) : null,
      tags: tagsArray,
      highlights: highlightsArray,
      price: finalPrice,
      discount: finalDiscount,
      discountDate: finalDiscountDate,
      discountShow: finalDiscountShow,
      thumbnail: thumbnailData,
      resourceFiles: resourceFilesData,
      resourceFile: legacyResourceFileData,
    });

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data,
    });
  } catch (error) {
    if (thumbnailData.publicId) {
      await cloudinary.uploader.destroy(thumbnailData.publicId, { resource_type: "image" });
    }

    await deleteCloudinaryResourceFiles(resourceFilesData);

    res.status(500).json({
      error: "Failed to create subject",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

const getAllSubject = asyncHandler(async (req, res) => {
  try {
    const subject = await SubjectModel.find().sort("-createdAt").populate({
      path: "user",
      select: "avatar name email",
    });

    if (!subject || subject.length === 0) {
      res.status(404);
      throw new Error("No subject found.");
    }

    res.status(200).json({
      success: true,
      total: subject.length,
      subject,
    });
  } catch (err) {
    res.status(err.statusCode || 500);
    throw new Error(err.message || "Failed to fetch subjects.");
  }
});

const getUserSubjects = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    const subjects = await SubjectModel.find({ user: userId }).sort("-createdAt").populate({
      path: "user",
      select: "avatar name email",
    });

    if (!subjects || subjects.length === 0) {
      res.status(404);
      throw new Error("No subjects found for this user.");
    }

    res.status(200).json({
      success: true,
      total: subjects.length,
      subjects,
    });
  } catch (err) {
    res.status(err.statusCode || 500);
    throw new Error(err.message || "Failed to fetch user's subjects.");
  }
});

const getSubject = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    res.status(400);
    throw new Error("Subject slug is required");
  }

  const subject = await SubjectModel.findOne({ slug })
    .populate({
      path: "user",
      select: "avatar name email",
    })
    .populate({
      path: "university",
      select: "name logo",
    })
    .populate({
      path: "faculty",
      select: "name",
    })
    .populate({
      path: "program",
      select: "name",
    });

  if (!subject) {
    res.status(404);
    throw new Error("Subject not found");
  }

  const chapters = await ChapterModel.find({ subject: subject._id }).sort({ order: 1, createdAt: 1 });

  res.status(200).json({
    ...subject.toObject(),
    chapters,
    chapterCount: chapters.length,
  });
});

const deleteSubject = asyncHandler(async (req, res) => {
  let subjectId;

  if (req.body && req.body.id) {
    subjectId = req.body.id;
  } else if (req.params && req.params.id) {
    subjectId = req.params.id;
  }

  const userId = req.user.id;

  if (!subjectId) {
    res.status(400);
    throw new Error("Subject ID is required in the request.");
  }

  const subject = await SubjectModel.findOne({ _id: subjectId });

  if (!subject) {
    return res.status(404).json({ error: "Subject not found." });
  }

  if (subject.user.toString() !== userId) {
    return res.status(403).json({ error: "You are not authorized to delete this subject." });
  }

  const cloudinaryDeletions = [];

  if (subject.thumbnail?.publicId) {
    cloudinaryDeletions.push(cloudinary.uploader.destroy(subject.thumbnail.publicId, { resource_type: "image" }));
  }

  const resourceFilesToDelete = [];

  if (Array.isArray(subject.resourceFiles)) {
    resourceFilesToDelete.push(...subject.resourceFiles);
  }

  if (subject.resourceFile?.file) {
    resourceFilesToDelete.push(subject.resourceFile.file);
  }

  try {
    await Promise.all(cloudinaryDeletions);
    await deleteCloudinaryResourceFiles(resourceFilesToDelete);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete associated files from Cloudinary.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }

  try {
    await SubjectModel.findByIdAndDelete(subjectId);

    res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete subject from database.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

const getChaptersBySubjectSlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const subject = await SubjectModel.findOne({ slug });

  if (!subject) {
    res.status(404);
    throw new Error("Subject not found");
  }

  const resourceFiles = Array.isArray(subject.resourceFiles) ? subject.resourceFiles.sort((a, b) => (a.order || 0) - (b.order || 0)) : [];

  const subjectData = {
    _id: subject._id,
    name: subject.name,
    slug: subject.slug,
    description: subject.description,
    metaDescription: subject.metaDescription,
    logo: subject?.thumbnail,
    thumbnail: subject?.thumbnail,
    accessType: subject.accessType || "unpaid",
    price: subject.price || 0,
    discount: subject.discount || 0,
    discountDate: subject.discountDate || null,
    discountShow: Boolean(subject.discountShow),
    visibility: subject.visibility,
    likes: subject.likes || [],
    likesCount: subject.likesCount || subject.likes?.length || 0,
    bookmarksCount: subject.bookmarksCount || 0,
    numOfViews: subject.numOfViews || 0,
    resourceFile: subject.resourceFile || null,
    resourceFiles,
  };

  const chapters = await ChapterModel.find({ subject: subject._id }).sort({ order: 1, createdAt: 1 }).populate({
    path: "user",
    select: "avatar name email",
  });

  const requiresPayment = isPremiumSubject(subject);
  const canAccessChapters = await hasSubjectLessonAccess(subject, req.user);
  const responseChapters = canAccessChapters ? chapters : chapters.map(getLockedChapter);

  res.status(200).json({
    success: true,
    total: chapters.length,
    isPdfCourse: false,
    hasResources: resourceFiles.length > 0 || Boolean(subject.resourceFile?.file?.filePath || subject.resourceFile?.url),
    requiresPayment,
    canAccessChapters,
    subject: subjectData,
    chapters: responseChapters,
  });
});

const trackSubjectView = asyncHandler(async (req, res) => {
  const subject = await SubjectModel.findOneAndUpdate({ slug: req.params.slug }, { $inc: { numOfViews: 1 } }, { new: true }).select("numOfViews likes likesCount bookmarksCount");

  if (!subject) {
    return res.status(404).json({ success: false, error: "Subject not found." });
  }

  res.status(200).json({
    success: true,
    numOfViews: subject.numOfViews || 0,
    likesCount: subject.likesCount || subject.likes?.length || 0,
    bookmarksCount: subject.bookmarksCount || 0,
  });
});

const trackChapterView = asyncHandler(async (req, res) => {
  const chapter = await ChapterModel.findByIdAndUpdate(req.params.chapterId, { $inc: { numOfViews: 1 } }, { new: true }).select("numOfViews likes likesCount");

  if (!chapter) {
    return res.status(404).json({ success: false, error: "Chapter not found." });
  }

  res.status(200).json({
    success: true,
    numOfViews: chapter.numOfViews || 0,
    likesCount: chapter.likesCount || chapter.likes?.length || 0,
  });
});

const trackSubheadingView = asyncHandler(async (req, res) => {
  const { chapter, subheading, error, status } = await getSubheadingFromChapter(req.params.chapterId, req.params.subheadingId);

  if (error) {
    return res.status(status).json({ success: false, error });
  }

  subheading.numOfViews = Number(subheading.numOfViews || 0) + 1;
  await chapter.save();

  res.status(200).json({
    success: true,
    subheadingId: subheading._id,
    numOfViews: subheading.numOfViews || 0,
    likesCount: subheading.likesCount || subheading.likes?.length || 0,
    bookmarksCount: subheading.bookmarksCount || subheading.bookmarks?.length || 0,
  });
});

const toggleSubheadingLike = asyncHandler(async (req, res) => {
  const { chapter, subheading, error, status } = await getSubheadingFromChapter(req.params.chapterId, req.params.subheadingId);

  if (error) {
    return res.status(status).json({ success: false, error });
  }

  const userId = req.user._id;
  const likes = Array.isArray(subheading.likes) ? subheading.likes : [];
  const hasLiked = likes.some((likedUserId) => String(likedUserId) === String(userId));

  if (hasLiked) {
    subheading.likes = likes.filter((likedUserId) => String(likedUserId) !== String(userId));
  } else {
    subheading.likes = [...likes, userId];
  }

  subheading.likesCount = subheading.likes.length;
  await chapter.save();

  res.status(200).json({
    success: true,
    status: hasLiked ? "removed" : "added",
    subheadingId: subheading._id,
    likesCount: subheading.likesCount,
  });
});

const toggleSubheadingBookmark = asyncHandler(async (req, res) => {
  const { chapter, subheading, error, status } = await getSubheadingFromChapter(req.params.chapterId, req.params.subheadingId);

  if (error) {
    return res.status(status).json({ success: false, error });
  }

  const userId = req.user._id;
  const bookmarks = Array.isArray(subheading.bookmarks) ? subheading.bookmarks : [];
  const hasBookmarked = bookmarks.some((bookmarkedUserId) => String(bookmarkedUserId) === String(userId));

  if (hasBookmarked) {
    subheading.bookmarks = bookmarks.filter((bookmarkedUserId) => String(bookmarkedUserId) !== String(userId));
  } else {
    subheading.bookmarks = [...bookmarks, userId];
  }

  subheading.bookmarksCount = subheading.bookmarks.length;
  await chapter.save();

  res.status(200).json({
    success: true,
    status: hasBookmarked ? "removed" : "added",
    subheadingId: subheading._id,
    bookmarksCount: subheading.bookmarksCount,
  });
});

const getSubjectResourceSummary = (subject = {}) => {
  const resourceFiles = Array.isArray(subject.resourceFiles) ? subject.resourceFiles.filter((resource) => resource?.filePath || resource?.url) : [];
  const hasLegacyResource = Boolean(subject.resourceFile?.file?.filePath || subject.resourceFile?.url);

  return {
    hasResources: resourceFiles.length > 0 || hasLegacyResource,
    resourceCount: resourceFiles.length + (hasLegacyResource ? 1 : 0),
  };
};

const getSubjectsWithChapterData = async (subjects = []) => {
  if (!subjects.length) {
    return [];
  }

  const subjectIds = subjects.map((subject) => subject._id);

  const chapters = await ChapterModel.find({ subject: { $in: subjectIds } })
    .sort({ order: 1, createdAt: 1 })
    .populate({
      path: "user",
      select: "avatar name email",
    })
    .populate({
      path: "subject",
      select: "_id",
    })
    .lean();

  const chaptersBySubject = {};

  chapters.forEach((chapter) => {
    const subjectId = chapter.subject?._id?.toString() || chapter.subject?.toString();

    if (!subjectId) return;

    if (!chaptersBySubject[subjectId]) {
      chaptersBySubject[subjectId] = [];
    }

    chaptersBySubject[subjectId].push(chapter);
  });

  return subjects.map((subject) => {
    const subjectChapters = chaptersBySubject[subject._id.toString()] || [];
    const resourceSummary = getSubjectResourceSummary(subject);

    return {
      ...subject,
      chapters: subjectChapters,
      chapterCount: subjectChapters.length,
      ...resourceSummary,
    };
  });
};

const getCourseSubjects = asyncHandler(async (req, res) => {
  const subjects = await SubjectModel.find()
    .sort("-createdAt")
    .populate({
      path: "user",
      select: "avatar name email",
    })
    .lean();

  const courseSubjects = subjects.filter((subject) => !getSubjectResourceSummary(subject).hasResources);
  const data = await getSubjectsWithChapterData(courseSubjects);

  res.status(200).json({
    success: true,
    total: data.length,
    totalSubjects: data.length,
    data,
  });
});

const getNoteSubjects = asyncHandler(async (req, res) => {
  const subjects = await SubjectModel.find()
    .sort("-createdAt")
    .populate({
      path: "user",
      select: "avatar name email",
    })
    .lean();

  const noteSubjects = subjects
    .filter((subject) => getSubjectResourceSummary(subject).hasResources)
    .map((subject) => ({
      ...subject,
      chapters: [],
      chapterCount: 0,
      ...getSubjectResourceSummary(subject),
    }));

  res.status(200).json({
    success: true,
    total: noteSubjects.length,
    totalSubjects: noteSubjects.length,
    data: noteSubjects,
  });
});

const getAllSubjectsWithChapters = asyncHandler(async (req, res) => {
  try {
    const subjects = await SubjectModel.find()
      .sort("-createdAt")
      .populate({
        path: "user",
        select: "avatar name email",
      })
      .lean();

    if (!subjects.length) {
      return res.status(200).json({
        success: true,
        totalSubjects: 0,
        data: [],
      });
    }

    const result = await getSubjectsWithChapterData(subjects);

    res.status(200).json({
      success: true,
      totalSubjects: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "Failed to fetch subjects with chapters");
  }
});

const updateSubject = asyncHandler(async (req, res) => {
  const { id, slug: slugParam } = req.params;
  const { name, description, metaDescription, university, faculty, program, accessType, groupId, visibility, scheduledPublish, tags, highlights, price, discount, discountDate, resourceMetadata } =
    req.body;
  const userId = req.user.id;

  const subject = id ? await SubjectModel.findById(id) : await SubjectModel.findOne({ slug: slugParam });

  if (!subject) {
    return res.status(404).json({ error: "Subject not found." });
  }

  if (subject.user.toString() !== userId) {
    return res.status(403).json({ error: "You are not authorized to update this subject." });
  }

  const filter = new Filter();
  const fieldsToCheck = [name, description, metaDescription].filter(Boolean);

  for (const field of fieldsToCheck) {
    if (field && filter.isProfane(field)) {
      return res.status(400).json({
        error: "Update failed because the content contains profane words.",
      });
    }
  }

  let nextSlug = subject.slug;

  if (name && name !== subject.name) {
    const originalSlug = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g, strict: true });

    nextSlug = originalSlug;

    let suffix = 1;

    while (await SubjectModel.findOne({ slug: nextSlug, _id: { $ne: subject._id } })) {
      nextSlug = `${suffix}-${originalSlug}`;
      suffix++;
    }
  }

  let thumbnailData = subject.thumbnail || {};
  const oldThumbnailPublicId = subject.thumbnail?.publicId;

  if (req.files?.thumbnail?.[0]) {
    const thumbnailFile = req.files.thumbnail[0];

    thumbnailData = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "Sunil Portfolio/Courses/Thumbnails",
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(new Error("Thumbnail upload failed."));

          resolve({
            fileName: thumbnailFile.originalname,
            filePath: result.secure_url,
            fileType: thumbnailFile.mimetype,
            publicId: result.public_id,
          });
        },
      );

      uploadStream.end(thumbnailFile.buffer);
    });
  }

  let resourceFilesData = Array.isArray(subject.resourceFiles) ? [...subject.resourceFiles] : [];
  const incomingResourceFiles = getCourseResourceFiles(req);
  const parsedResourceMetadata = parseResourceMetadata(resourceMetadata);

  if (incomingResourceFiles.length > 0) {
    const uploadedResources = await Promise.all(incomingResourceFiles.map((resourceFile, index) => uploadCourseResourceFile(resourceFile, parsedResourceMetadata[index] || {}, index)));

    resourceFilesData = [...resourceFilesData, ...uploadedResources].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  const legacyResourceFileData = resourceFilesData[0]
    ? {
        type: "file",
        file: resourceFilesData[0],
      }
    : {};

  const updateData = {
    name: name || subject.name,
    slug: nextSlug,
    description: description || subject.description,
    metaDescription: metaDescription || subject.metaDescription,
    university: university !== undefined ? university : subject.university,
    faculty: faculty !== undefined ? faculty : subject.faculty,
    program: program !== undefined ? program : subject.program,
    accessType: accessType || subject.accessType,
    groupId: groupId !== undefined ? groupId : subject.groupId,
    visibility: visibility || subject.visibility,
    scheduledPublish: visibility === "scheduled" ? new Date(scheduledPublish) : subject.scheduledPublish,
    tags: tags ? JSON.parse(tags) : subject.tags,
    highlights: highlights ? JSON.parse(highlights) : subject.highlights,
    price: price !== undefined ? parseFloat(price) : subject.price,
    discount: discount !== undefined ? parseFloat(discount) : subject.discount,
    discountDate: discountDate ? new Date(discountDate) : subject.discountDate,
    thumbnail: thumbnailData,
    resourceFiles: resourceFilesData,
    resourceFile: legacyResourceFileData,
  };

  const updatedSubject = await SubjectModel.findByIdAndUpdate(subject._id, updateData, {
    new: true,
    runValidators: true,
  });

  if (oldThumbnailPublicId && thumbnailData.publicId !== oldThumbnailPublicId) {
    await cloudinary.uploader.destroy(oldThumbnailPublicId, { resource_type: "image" });
  }

  res.status(200).json({
    success: true,
    message: "Subject updated successfully",
    data: updatedSubject,
  });
});

const getSubjectPdf = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const subject = await SubjectModel.findOne({ slug });

  if (!subject) {
    return res.status(404).json({ message: "Subject not found." });
  }

  const pdfFromNewResources = Array.isArray(subject.resourceFiles) ? subject.resourceFiles.find((file) => file.resourceType === "pdf" || file.fileType === "application/pdf") : null;

  const pdfFile = pdfFromNewResources || subject?.resourceFile?.file;

  if (!pdfFile?.filePath) {
    return res.status(404).json({ message: "PDF resource file not found." });
  }

  const fileName = pdfFile.fileName || "course-resource.pdf";
  const safeFileName = fileName.replace(/["]/g, "");

  try {
    const pdfResponse = await axios.get(pdfFile.filePath, {
      responseType: "stream",
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 300,
      headers: {
        Accept: "application/pdf,application/octet-stream,*/*",
        "User-Agent": "Mozilla/5.0",
      },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${safeFileName}"`);
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");

    return pdfResponse.data.pipe(res);
  } catch (error) {
    return res.status(502).json({
      message: "PDF file could not be loaded from storage.",
      error: error?.response?.status ? `Cloudinary returned ${error.response.status}` : error?.message,
    });
  }
});

const getSortedSubjectResourceFiles = (subject) => {
  const resources = Array.isArray(subject?.resourceFiles) ? [...subject.resourceFiles] : [];

  if (subject?.resourceFile?.file?.filePath) {
    const legacyFile = subject.resourceFile.file;
    const alreadyExists = resources.some((resource) => resource?.publicId && resource.publicId === legacyFile.publicId);

    if (!alreadyExists) {
      resources.push({
        ...legacyFile,
        order: legacyFile.order || resources.length + 1,
      });
    }
  }

  return resources.filter((resource) => resource?.filePath).sort((a, b) => Number(a?.order || 0) - Number(b?.order || 0));
};

const encodeFileName = (fileName = "course-resource") => {
  return encodeURIComponent(fileName).replace(/['()]/g, escape).replace(/\*/g, "%2A");
};

const getCloudinarySignedResourceUrl = (resource) => {
  if (!resource?.publicId) {
    return resource?.filePath;
  }

  const resourceType = resource.cloudinaryResourceType || (resource.resourceType === "image" ? "image" : "raw");

  return cloudinary.url(resource.publicId, {
    resource_type: resourceType,
    type: "upload",
    secure: true,
    sign_url: true,
  });
};

const getSubjectResource = asyncHandler(async (req, res) => {
  const { slug, index } = req.params;

  const subject = await SubjectModel.findOne({ slug });

  if (!subject) {
    return res.status(404).json({ message: "Subject not found." });
  }

  const resourceIndex = Number.parseInt(index, 10);

  if (Number.isNaN(resourceIndex) || resourceIndex < 0) {
    return res.status(400).json({ message: "Invalid resource index." });
  }

  const resources = getSortedSubjectResourceFiles(subject);
  const selectedResource = resources[resourceIndex];

  if (!selectedResource?.filePath) {
    return res.status(404).json({ message: "Resource file not found." });
  }

  const fileName = selectedResource.fileName || selectedResource.displayName || `course-resource-${resourceIndex + 1}`;
  const safeFileName = fileName.replace(/[\r\n"]/g, "");
  const contentType = selectedResource.fileType || "application/octet-stream";

  const signedUrl = getCloudinarySignedResourceUrl(selectedResource);
  const urlsToTry = [...new Set([signedUrl, selectedResource.filePath].filter(Boolean))];

  let lastError = null;

  for (const fileUrl of urlsToTry) {
    try {
      const resourceResponse = await axios.get(fileUrl, {
        responseType: "stream",
        maxRedirects: 5,
        validateStatus: (status) => status >= 200 && status < 300,
        headers: {
          Accept: `${contentType},application/octet-stream,*/*`,
          "User-Agent": "Mozilla/5.0",
        },
      });

      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", `inline; filename="${safeFileName}"; filename*=UTF-8''${encodeFileName(safeFileName)}`);
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");

      return resourceResponse.data.pipe(res);
    } catch (error) {
      lastError = error;
    }
  }

  return res.status(502).json({
    message: "Resource file could not be loaded from storage.",
    error: lastError?.response?.status ? `Storage returned ${lastError.response.status}` : lastError?.message,
    resourceType: selectedResource.resourceType,
    cloudinaryResourceType: selectedResource.cloudinaryResourceType,
    publicId: selectedResource.publicId,
    filePath: selectedResource.filePath,
  });
});
module.exports = {
  createSubject,
  getAllSubject,
  getSubject,
  deleteSubject,
  getUserSubjects,
  getChaptersBySubjectSlug,
  getAllSubjectsWithChapters,
  updateSubject,
  getSubjectPdf,
  getSubjectResource,
  getCourseSubjects,
  getNoteSubjects,
  trackSubjectView,
  trackChapterView,
  trackSubheadingView,
  toggleSubheadingLike,
  toggleSubheadingBookmark,
};
