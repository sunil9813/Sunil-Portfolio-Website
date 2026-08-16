const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2;
const Filter = require("bad-words");

require("../../models/users/UserModel");

const ChapterModel = require("../../models/educationModel/ChapterModel");
const SubjectModel = require("../../models/educationModel/SubjectModel");

const createSlug = (value = "") => slugify(value, { lower: true, remove: /[*+~.()'"!:@]/g, strict: true });

const parseTags = (tags) => {
  if (!tags) return [];

  let parsedTags = [];

  if (typeof tags === "string") {
    parsedTags = JSON.parse(tags);
  } else if (Array.isArray(tags)) {
    parsedTags = tags;
  } else {
    throw new Error("Tags must be an array of objects.");
  }

  const tagsArray = parsedTags.map((tagObj) => {
    if (typeof tagObj.tag !== "string" || tagObj.tag.trim() === "") {
      throw new Error("Each tag must be a valid non-empty string inside an object.");
    }

    if (tagObj.tag.length > 50) {
      throw new Error("Each tag cannot exceed 50 characters.");
    }

    return { tag: tagObj.tag.trim() };
  });

  const tagValues = tagsArray.map((tag) => tag.tag.toLowerCase());

  if (new Set(tagValues).size !== tagValues.length) {
    throw new Error("Duplicate tags are not allowed.");
  }

  return tagsArray;
};

const uploadChapterThumbnail = async (thumbnailFile) => {
  if (!thumbnailFile) return {};

  const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

  if (!allowedImageTypes.includes(thumbnailFile.mimetype)) {
    throw new Error("Invalid thumbnail format. Supported formats: JPEG, PNG, JPG, WEBP.");
  }

  if (thumbnailFile.size > 10 * 1024 * 1024) {
    throw new Error("Thumbnail size should not exceed 10 MB.");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder: "Sunil Portfolio/Chapter/Thumbnails", resource_type: "image" }, (error, result) => {
      if (error) return reject(new Error("Thumbnail upload failed."));

      resolve({
        fileName: thumbnailFile.originalname,
        filePath: result.secure_url,
        fileType: thumbnailFile.mimetype,
        publicId: result.public_id,
      });
    });

    uploadStream.end(thumbnailFile.buffer);
  });
};

const uploadChapterVideo = async (videoFile) => {
  if (!videoFile) return {};

  const allowedVideoTypes = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/webm"];

  if (!allowedVideoTypes.includes(videoFile.mimetype)) {
    throw new Error("Invalid video format. Supported formats: MP4, MOV, AVI, MKV, WEBM.");
  }

  if (videoFile.size > 10 * 1024 * 1024 * 1024) {
    throw new Error("Video size should not exceed 10 GB.");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "Sunil Portfolio/Chapter/Videos",
        resource_type: "video",
        chunk_size: 6000000,
        eager: [
          { width: 300, height: 300, crop: "pad", audio_codec: "none" },
          { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" },
        ],
        eager_async: true,
      },
      (error, result) => {
        if (error) return reject(new Error("Video upload failed."));

        resolve({
          fileName: videoFile.originalname,
          filePath: result.secure_url,
          fileType: videoFile.mimetype,
          publicId: result.public_id,
          duration: result.duration,
          resolution: `${result.width}x${result.height}`,
          size: result.bytes,
        });
      },
    );

    uploadStream.end(videoFile.buffer);
  });
};

const buildSubheadingItem = (item, index = 0) => {
  const headingTitle = typeof item === "string" ? item : item?.title;

  if (!headingTitle || typeof headingTitle !== "string" || headingTitle.trim() === "") {
    return null;
  }

  const trimmedTitle = headingTitle.trim();

  return {
    title: trimmedTitle,
    metaTitle: item?.metaTitle || trimmedTitle,
    metaDescription: item?.metaDescription || "",
    description: item?.description || "",
    slug: item?.slug || createSlug(trimmedTitle),
    order: Number.isFinite(Number(item?.order)) ? Number(item.order) : index + 1,
    tags: Array.isArray(item?.tags) ? item.tags : [],
    thumbnail: item?.thumbnail || {},
    video: item?.video || {},
    children: Array.isArray(item?.children) ? item.children.map((child, childIndex) => buildSubheadingItem(child, childIndex)).filter(Boolean) : [],
  };
};

const createChapter = asyncHandler(async (req, res) => {
  const { title, metaTitle, description, metaDescription, subject, groupId, tags, subheadings, order } = req.body;
  const userId = req.user.id;

  // Profanity check
  const filter = new Filter();
  const fieldsToCheck = [title, metaTitle, metaDescription];
  for (const field of fieldsToCheck) {
    if (field && filter.isProfane(field)) {
      return res.status(400).json({
        error: "Creation failed because the content contains profane words.",
      });
    }
  }

  // Required fields validation
  if (!title) return res.status(400).json({ error: "Chapter title is required." });
  if (!description) return res.status(400).json({ error: "Description is required." });
  if (!metaDescription) return res.status(400).json({ error: "Meta description is required." });
  if (!subject) return res.status(400).json({ error: "Subject is required." });
  if (metaDescription.length > 160) {
    return res.status(400).json({ error: "Meta description cannot exceed 160 characters." });
  }

  // Check if the subject exists and was created by the same user
  const existingSubject = await SubjectModel.findOne({ _id: subject, user: userId });
  if (!existingSubject) {
    return res.status(403).json({
      error: "You can only create chapters for subjects you created or the subject doesn't exist",
    });
  }
  const hasCourseResourceFiles = Array.isArray(existingSubject?.resourceFiles) && existingSubject.resourceFiles.some((resourceFile) => resourceFile?.filePath || resourceFile?.url);
  const hasLegacyCourseResource = Boolean(existingSubject?.resourceFile?.file?.filePath || existingSubject?.resourceFile?.url);

  if (hasCourseResourceFiles || hasLegacyCourseResource) {
    return res.status(400).json({
      error: "This course has a PDF resource file, so chapters cannot be created for it.",
    });
  }

  // Generate unique slug
  const originalSlug = slugify(title, { lower: true, remove: /[*+~.()'"!:@]/g, strict: true });
  let slug = originalSlug;
  let suffix = 1;
  while (await ChapterModel.findOne({ slug })) {
    slug = `${suffix}-${originalSlug}`;
    suffix++;
  }

  // Handle thumbnail (optional)
  let thumbnailData = {};
  if (req.files && req.files["thumbnail"] && req.files["thumbnail"][0]) {
    const thumbnailFile = req.files["thumbnail"][0];
    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedImageTypes.includes(thumbnailFile.mimetype)) {
      return res.status(400).json({ error: "Invalid thumbnail format. Supported formats: JPEG, PNG, JPG, WEBP." });
    }
    if (thumbnailFile.size > 10 * 1024 * 1024) {
      return res.status(400).json({ error: "Thumbnail size should not exceed 10 MB." });
    }

    try {
      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: "Sunil Portfolio/Chapter/Thumbnails", resource_type: "image" }, (error, result) => {
          if (error) return reject(new Error("Thumbnail upload failed."));
          thumbnailData = {
            fileName: thumbnailFile.originalname,
            filePath: result.secure_url,
            fileType: thumbnailFile.mimetype,
            publicId: result.public_id,
          };
          resolve();
        });
        uploadStream.end(thumbnailFile.buffer);
      });
    } catch (error) {
      return res.status(500).json({ error: "Thumbnail could not be uploaded." });
    }
  }

  // Handle video (optional)
  let videoData = {};
  if (req.files && req.files["video"] && req.files["video"][0]) {
    const videoFile = req.files["video"][0];
    const allowedVideoTypes = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/webm"];
    if (!allowedVideoTypes.includes(videoFile.mimetype)) {
      return res.status(400).json({
        error: "Invalid video format. Supported formats: MP4, MOV, AVI, MKV, WEBM.",
      });
    }
    if (videoFile.size > 10 * 1024 * 1024 * 1024) {
      return res.status(400).json({ error: "Video size should not exceed 10 GB." });
    }

    try {
      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "Sunil Portfolio/Chapter/Videos",
            resource_type: "video",
            chunk_size: 6000000,
            eager: [
              { width: 300, height: 300, crop: "pad", audio_codec: "none" },
              { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" },
            ],
            eager_async: true,
          },
          (error, result) => {
            if (error) return reject(new Error("Video upload failed."));
            videoData = {
              fileName: videoFile.originalname,
              filePath: result.secure_url,
              fileType: videoFile.mimetype,
              publicId: result.public_id,
              duration: result.duration,
              resolution: `${result.width}x${result.height}`,
              size: result.bytes,
            };
            resolve();
          },
        );
        uploadStream.end(videoFile.buffer);
      });
    } catch (error) {
      // Clean up thumbnail if video upload fails
      if (thumbnailData.publicId) {
        await cloudinary.uploader.destroy(thumbnailData.publicId, { resource_type: "image" });
      }
      return res.status(500).json({ error: "Video could not be uploaded." });
    }
  }

  // Handle tags
  let tagsArray = [];
  if (tags) {
    let parsedTags = [];
    if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags);
      } catch (error) {
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
      // Check for duplicates
      const tagValues = tagsArray.map((t) => t.tag);
      if (new Set(tagValues).size !== tagValues.length) {
        throw new Error("Duplicate tags are not allowed.");
      }
    } catch (error) {
      // Clean up uploads if tags validation fails
      if (thumbnailData.publicId) {
        await cloudinary.uploader.destroy(thumbnailData.publicId, { resource_type: "image" });
      }
      if (videoData.publicId) {
        await cloudinary.uploader.destroy(videoData.publicId, { resource_type: "video" });
      }
      return res.status(400).json({ error: error.message });
    }
  }

  let subheadingsArray = [];
  if (subheadings) {
    let parsedSubheadings = [];
    if (typeof subheadings === "string") {
      try {
        parsedSubheadings = JSON.parse(subheadings);
      } catch (error) {
        return res.status(400).json({ error: "Invalid subheadings format. Subheadings must be a valid JSON array." });
      }
    } else if (Array.isArray(subheadings)) {
      parsedSubheadings = subheadings;
    } else {
      return res.status(400).json({ error: "Subheadings must be an array." });
    }

    subheadingsArray = parsedSubheadings.map((item, index) => buildSubheadingItem(item, index)).filter(Boolean);
  }

  // Create the chapter
  try {
    const data = await ChapterModel.create({
      user: userId,
      subject,
      title,
      metaTitle,
      slug,
      order: Number.isFinite(Number(order)) ? Number(order) : 0,
      description,
      metaDescription,
      groupId,
      tags: tagsArray,
      subheadings: subheadingsArray,
      thumbnail: thumbnailData,
      video: videoData,
    });

    res.status(201).json({
      success: true,
      message: "Chapter created successfully",
      data,
    });
  } catch (error) {
    // Clean up Cloudinary uploads
    if (thumbnailData.publicId) {
      await cloudinary.uploader.destroy(thumbnailData.publicId, { resource_type: "image" });
    }
    if (videoData.publicId) {
      await cloudinary.uploader.destroy(videoData.publicId, { resource_type: "video" });
    }
    res.status(500).json({
      error: "Failed to create chapter",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

const getAllChapter = asyncHandler(async (req, res) => {
  try {
    // Get all chapters and populate user + subject details
    const chapters = await ChapterModel.find()
      .sort("createdAt")
      .populate({
        path: "user",
        select: "avatar name email",
      })
      .populate({
        path: "subject", // Ensure this matches your schema field name (case-sensitive)
        select: "name",
      });

    if (!chapters || chapters.length === 0) {
      res.status(404);
      throw new Error("No chapters found.");
    }

    // Group chapters by subject
    const chaptersBySubject = chapters.reduce((acc, chapter) => {
      const subjectName = chapter.subject?.name || "Uncategorized";
      if (!acc[subjectName]) {
        acc[subjectName] = [];
      }
      acc[subjectName].push(chapter);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      total: chapters.length,
      chaptersBySubject, // Returns structured data like: { "Math": [chapters...], "Physics": [chapters...] }
    });
  } catch (err) {
    res.status(err.statusCode || 500);
    throw new Error(err.message || "Failed to fetch chapters.");
  }
});

const getChapter = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    res.status(400);
    throw new Error("Faculty slug is required");
  }

  const chapter = await ChapterModel.findOne({ slug })
    .populate({
      path: "user",
      select: "avatar name email",
    })
    .populate({
      path: "subject",
      select: "name university program faculty",
    });

  if (!chapter) {
    res.status(404);
    throw new Error("Faculty not found");
  }

  res.status(200).json(chapter);
});

const createSubheading = asyncHandler(async (req, res) => {
  const { chapterId } = req.params;
  const { title, metaTitle, metaDescription, description, tags, order, parentSubheadingId } = req.body;
  const userId = req.user.id;

  if (!chapterId) return res.status(400).json({ error: "Chapter ID is required." });
  if (!title?.trim()) return res.status(400).json({ error: "Subheading title is required." });
  if (!description?.trim()) return res.status(400).json({ error: "Subheading content is required." });

  if (title.length > 120) {
    return res.status(400).json({ error: "Subheading title cannot exceed 120 characters." });
  }

  if (metaTitle && metaTitle.length > 250) {
    return res.status(400).json({ error: "Meta title cannot exceed 250 characters." });
  }

  if (metaDescription && metaDescription.length > 160) {
    return res.status(400).json({ error: "Meta description cannot exceed 160 characters." });
  }

  const chapter = await ChapterModel.findById(chapterId).populate("subject", "user name resourceFile resourceFiles");

  if (!chapter) {
    return res.status(404).json({ error: "Chapter not found." });
  }

  const isChapterOwner = String(chapter.user) === String(userId);
  const isCourseOwner = String(chapter.subject?.user) === String(userId);

  if (!isChapterOwner && !isCourseOwner && req.user?.role !== "admin") {
    return res.status(403).json({ error: "You are not allowed to add subheadings to this chapter." });
  }

  let tagsArray = [];

  try {
    tagsArray = parseTags(tags);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  const normalizedTitle = title.trim();
  const subheadingSlug = createSlug(normalizedTitle);
  const parentSubheading = parentSubheadingId ? chapter.subheadings?.id(parentSubheadingId) : null;

  if (parentSubheadingId && !parentSubheading) {
    return res.status(404).json({ error: "Parent subheading not found in the selected chapter." });
  }

  const siblingSubheadings = parentSubheading ? parentSubheading.children || [] : chapter.subheadings || [];
  const hasDuplicate = siblingSubheadings.some((subheading) => subheading?.slug === subheadingSlug || subheading?.title?.trim().toLowerCase() === normalizedTitle.toLowerCase());

  if (hasDuplicate) {
    return res.status(400).json({ error: "This subheading already exists in the selected level." });
  }

  let thumbnailData = {};
  let videoData = {};

  try {
    thumbnailData = await uploadChapterThumbnail(req.files?.thumbnail?.[0]);
    videoData = await uploadChapterVideo(req.files?.video?.[0]);
  } catch (error) {
    if (thumbnailData.publicId) {
      await cloudinary.uploader.destroy(thumbnailData.publicId, { resource_type: "image" });
    }

    return res.status(400).json({ error: error.message || "Subheading assets could not be uploaded." });
  }

  const nextOrder = Number.isFinite(Number(order)) ? Number(order) : siblingSubheadings.length + 1;
  const subheading = {
    title: normalizedTitle,
    metaTitle: metaTitle?.trim() || normalizedTitle,
    metaDescription: metaDescription?.trim() || "",
    description: description.trim(),
    slug: subheadingSlug,
    order: nextOrder,
    tags: tagsArray,
    thumbnail: thumbnailData,
    video: videoData,
    children: [],
  };

  if (parentSubheading) {
    parentSubheading.children.push(subheading);
    parentSubheading.children.sort((firstSubheading, secondSubheading) => Number(firstSubheading?.order || 0) - Number(secondSubheading?.order || 0));
  } else {
    chapter.subheadings.push(subheading);
    chapter.subheadings.sort((firstSubheading, secondSubheading) => Number(firstSubheading?.order || 0) - Number(secondSubheading?.order || 0));
  }

  await chapter.save();

  const savedSubheading = parentSubheading ? parentSubheading.children.find((item) => item.slug === subheadingSlug) : chapter.subheadings.find((item) => item.slug === subheadingSlug);

  res.status(201).json({
    success: true,
    message: "Subheading created successfully",
    data: savedSubheading,
    parentSubheadingId: parentSubheading?._id || null,
    chapter,
  });
});

const deleteChapter = asyncHandler(async (req, res) => {
  let chapterId;

  if (req.body && req.body.id) {
    chapterId = req.body.id;
  } else if (req.params && req.params.id) {
    chapterId = req.params.id;
  }

  if (!chapterId) {
    res.status(400);
    throw new Error("Chapter ID is required in the request.");
  }
  const chapter = await ChapterModel.findOne({ _id: chapterId });

  if (!chapter) {
    res.status(404);
    throw new Error("Chapter not found. Please check the provided information.");
  }

  if (chapter.thumbnail && chapter.thumbnail.publicId) {
    try {
      const result = await cloudinary.uploader.destroy(chapter.thumbnail.publicId);
      if (result.result !== "ok") {
        res.status(500).json({ message: "Error deleting thumbnail from Cloudinary" });
        return;
      }
    } catch (error) {
      res.status(500).json({ message: "An error occurred while deleting the logo image from Cloudinary." });
      return;
    }
  }

  // Delete video if exists
  if (chapter.video && chapter.video.publicId) {
    try {
      // Use resource_type: 'video' for video files
      const result = await cloudinary.uploader.destroy(chapter.video.publicId, {
        resource_type: "video",
      });
      if (result.result !== "ok") {
        console.error("Error deleting video from Cloudinary:", result);
      }
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  }

  await chapter.deleteOne();
  res.status(200).json({ message: "Chapter deleted successfully" });
});

module.exports = {
  createChapter,
  createSubheading,
  getAllChapter,
  getChapter,
  deleteChapter,
};
