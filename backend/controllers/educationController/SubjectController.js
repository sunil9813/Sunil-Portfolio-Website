const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2;
const Filter = require("bad-words");
const SubjectModel = require("../../models/educationModel/SubjectModel");
const ChapterModel = require("../../models/educationModel/ChapterModel");

const createSubject = asyncHandler(async (req, res) => {
  const { name, description, metaDescription, university, faculty, program, accessType, groupId, visibility, scheduledPublish, tags, highlights, price, discount, discountDate } = req.body;
  const userId = req.user.id;

  // Profanity check
  const filter = new Filter();
  const fieldsToCheck = [name, metaDescription];
  for (const field of fieldsToCheck) {
    if (field && filter.isProfane(field)) {
      return res.status(400).json({
        error: "Creation failed because the content contains profane words.",
      });
    }
  }

  // Required fields validation
  if (!name) return res.status(400).json({ error: "Subject name is required." });
  if (!description) return res.status(400).json({ error: "Description is required." });
  if (!metaDescription) return res.status(400).json({ error: "Meta description is required." });
  if (metaDescription.length > 160) {
    return res.status(400).json({ error: "Meta description cannot exceed 160 characters." });
  }

  // Validate scheduled publish
  if (visibility === "scheduled") {
    if (!scheduledPublish) {
      return res.status(400).json({ error: "Scheduled publish date is required when visibility is set to scheduled." });
    }
    if (new Date(scheduledPublish) <= new Date()) {
      return res.status(400).json({ error: "Scheduled publish date must be in the future." });
    }
  }

  // Generate unique slug
  const originalSlug = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g, strict: true });
  let slug = originalSlug;
  let suffix = 1;
  while (await SubjectModel.findOne({ slug })) {
    slug = `${suffix}-${originalSlug}`;
    suffix++;
  }

  // Handle thumbnail
  if (!req.files || !req.files["thumbnail"] || !req.files["thumbnail"][0]) {
    return res.status(400).json({ error: "Thumbnail is required." });
  }
  const thumbnailFile = req.files["thumbnail"][0];
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
      const uploadStream = cloudinary.uploader.upload_stream({ folder: "Sunil Portfolio/Courses/Thumbnails", resource_type: "image" }, (error, result) => {
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

  // Handle resourceFile
  let resourceFileData = {};
  if (req.files && req.files["resourceFile"] && req.files["resourceFile"][0]) {
    const resourceFile = req.files["resourceFile"][0];
    if (resourceFile.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Resource file must be a PDF." });
    }
    if (resourceFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "Resource file size should not exceed 5 MB." });
    }
    try {
      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: "Sunil Portfolio/Courses/Resources", resource_type: "raw", format: "pdf" }, (error, result) => {
          if (error) return reject(new Error("Resource file upload failed."));
          resourceFileData = {
            type: "file",
            file: {
              fileName: resourceFile.originalname,
              filePath: result.secure_url,
              fileType: resourceFile.mimetype,
              publicId: result.public_id,
              size: resourceFile.size,
            },
          };
          resolve();
        });
        uploadStream.end(resourceFile.buffer);
      });
    } catch (error) {
      // Clean up thumbnail if resource file upload fails
      if (thumbnailData.publicId) {
        await cloudinary.uploader.destroy(thumbnailData.publicId, { resource_type: "image" });
      }
      return res.status(500).json({ error: "Resource file could not be uploaded." });
    }
  }

  // Handle tags
  let tagsArray = [];
  if (tags) {
    let parsedTags = [];
    if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags); // Expecting [{ tag: 'css' }, { tag: 'js' }]
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
      return res.status(400).json({ error: error.message });
    }
  }

  // Handle highlights
  let highlightsArray = [];
  if (highlights) {
    let parsedHighlights = [];
    if (typeof highlights === "string") {
      try {
        parsedHighlights = JSON.parse(highlights); // Expecting [{ highlight: 'feature1' }, { highlight: 'feature2' }]
      } catch (error) {
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
      // Check for duplicates
      const highlightValues = highlightsArray.map((h) => h.highlight);
      if (new Set(highlightValues).size !== highlightValues.length) {
        throw new Error("Duplicate highlights are not allowed.");
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Handle price and discount
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

  // Check if discountDate is in the past
  if (finalDiscountDate && finalDiscountDate <= new Date()) {
    finalDiscount = 0;
    finalDiscountDate = null;
    finalDiscountShow = false;
  }

  // Create the subject
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
      resourceFile: resourceFileData,
    });

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data,
    });
  } catch (error) {
    // Clean up Cloudinary uploads
    if (thumbnailData.publicId) {
      await cloudinary.uploader.destroy(thumbnailData.publicId, { resource_type: "image" });
    }
    if (resourceFileData.file?.publicId) {
      await cloudinary.uploader.destroy(resourceFileData.file.publicId, { resource_type: "raw" });
    }
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
    throw new Error(err.message || "Failed to fetch chapters.");
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

  // Get all chapters for this subject
  const chapters = await ChapterModel.find({ subject: subject._id }).sort("createdAt");

  res.status(200).json({
    ...subject.toObject(),
    chapters, // Add chapters array to the response
    chapterCount: chapters.length, // Total number of chapters
  });
});

const deleteSubject = asyncHandler(async (req, res) => {
  let subjectId;

  if (req.body && req.body.id) {
    subjectId = req.body.id;
  } else if (req.params && req.params.id) {
    subjectId = req.params.id;
  }

  const userId = req.user.id; // Authenticated user ID

  if (!subjectId) {
    res.status(400);
    throw new Error("Subject ID is required in the request.");
  }

  // Find the subject
  const subject = await SubjectModel.findOne({ _id: subjectId });
  if (!subject) {
    return res.status(404).json({ error: "Subject not found." });
  }

  // Check if the user is authorized to delete the subject
  if (subject.user.toString() !== userId) {
    return res.status(403).json({ error: "You are not authorized to delete this subject." });
  }

  // Prepare to delete Cloudinary assets
  const cloudinaryDeletions = [];

  // Delete thumbnail from Cloudinary
  if (subject.thumbnail?.publicId) {
    cloudinaryDeletions.push(cloudinary.uploader.destroy(subject.thumbnail.publicId, { resource_type: "image" }));
  }

  // Delete resource file from Cloudinary (if it exists and is a file type)
  if (subject.resourceFile?.file?.publicId) {
    cloudinaryDeletions.push(cloudinary.uploader.destroy(subject.resourceFile.file.publicId, { resource_type: "raw" }));
  }

  // Execute Cloudinary deletions
  try {
    await Promise.all(cloudinaryDeletions);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete associated files from Cloudinary.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }

  // Delete the subject from the database
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

  try {
    // Step 1: Find the subject by slug
    const subject = await SubjectModel.findOne({ slug });

    if (!subject) {
      res.status(404);
      throw new Error("Subject not found");
    }

    const subjectData = {
      name: subject.name,
      logo: subject?.thumbnail,
    };
    // Step 2: Find chapters with that subject
    const chapters = await ChapterModel.find({ subject: subject._id }).sort({ createdAt: 1 }).populate({
      path: "user",
      select: "avatar name email",
    });

    res.status(200).json({
      success: true,
      total: chapters.length,
      subject: subjectData,
      chapters,
    });
  } catch (err) {
    res.status(err.statusCode || 500);
    throw new Error(err.message || "Failed to fetch chapters for the subject.");
  }
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
      res.status(404);
      throw new Error("No subjects found.");
    }

    // Fetch all chapters at once
    const chapters = await ChapterModel.find()
      .sort("createdAt")
      .populate({
        path: "user",
        select: "avatar name email",
      })
      .populate({
        path: "subject",
        select: "_id",
      })
      .lean();

    // Group chapters by subject id
    const chaptersBySubject = {};
    chapters.forEach((chapter) => {
      const subjectId = chapter.subject?._id?.toString();
      if (!subjectId) return;

      if (!chaptersBySubject[subjectId]) {
        chaptersBySubject[subjectId] = [];
      }
      chaptersBySubject[subjectId].push(chapter);
    });

    // Attach chapters to each subject
    const result = subjects.map((subject) => ({
      ...subject,
      chapters: chaptersBySubject[subject._id.toString()] || [],
    }));

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

// remain to test
const updateSubject = asyncHandler(async (req, res) => {
  const { id } = req.params; // Subject ID from URL
  const { name, description, metaDescription, university, faculty, program, accessType, groupId, visibility, scheduledPublish, tags, highlights, price, discount, discountDate } = req.body;
  const userId = req.user.id; // Authenticated user ID

  // Find the subject
  const subject = await SubjectModel.findById(id);
  if (!subject) {
    return res.status(404).json({ error: "Subject not found." });
  }

  // Check if the user is authorized to update the subject
  if (subject.user.toString() !== userId) {
    return res.status(403).json({ error: "You are not authorized to update this subject." });
  }

  // Profanity check for updated text fields
  const filter = new Filter();
  const fieldsToCheck = [name, description, metaDescription].filter(Boolean);
  for (const field of fieldsToCheck) {
    if (field && filter.isProfane(field)) {
      return res.status(400).json({
        error: "Update failed because the content contains profane words.",
      });
    }
  }

  // Required fields validation (only if provided)
  if (name && !name.trim()) {
    return res.status(400).json({ error: "Subject name cannot be empty." });
  }
  if (description && !description.trim()) {
    return res.status(400).json({ error: "Description cannot be empty." });
  }
  if (metaDescription && !metaDescription.trim()) {
    return res.status(400).json({ error: "Meta description cannot be empty." });
  }
  if (metaDescription && metaDescription.length > 160) {
    return res.status(400).json({ error: "Meta description cannot exceed 160 characters." });
  }

  // Validate scheduled publish if visibility is updated to "scheduled"
  if (visibility === "scheduled") {
    if (!scheduledPublish) {
      return res.status(400).json({ error: "Scheduled publish date is required when visibility is set to scheduled." });
    }
    if (new Date(scheduledPublish) <= new Date()) {
      return res.status(400).json({ error: "Scheduled publish date must be in the future." });
    }
  }

  // Generate unique slug if name is updated
  let slug = subject.slug;
  if (name && name !== subject.name) {
    const originalSlug = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g, strict: true });
    slug = originalSlug;
    let suffix = 1;
    while (await SubjectModel.findOne({ slug, _id: { $ne: id } })) {
      slug = `${suffix}-${originalSlug}`;
      suffix++;
    }
  }

  // Handle thumbnail update
  let thumbnailData = subject.thumbnail;
  let oldThumbnailPublicId = subject.thumbnail?.publicId;
  if (req.files && req.files["thumbnail"] && req.files["thumbnail"][0]) {
    const thumbnailFile = req.files["thumbnail"][0];
    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedImageTypes.includes(thumbnailFile.mimetype)) {
      return res.status(400).json({ error: "Invalid thumbnail format. Supported formats: JPEG, PNG, JPG." });
    }
    if (thumbnailFile.size > 10 * 1024 * 1024) {
      return res.status(400).json({ error: "Thumbnail size should not exceed 10 MB." });
    }
    try {
      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: "Sunil Portfolio/Courses/Thumbnails", resource_type: "image" }, (error, result) => {
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

  // Handle resourceFile update
  let resourceFileData = subject.resourceFile;
  let oldResourceFilePublicId = subject.resourceFile?.file?.publicId;
  if (req.files && req.files["resourceFile"] && req.files["resourceFile"][0]) {
    const resourceFile = req.files["resourceFile"][0];
    if (resourceFile.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Resource file must be a PDF." });
    }
    if (resourceFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "Resource file size should not exceed 5 MB." });
    }
    try {
      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: "Sunil Portfolio/Subjects/Resources", resource_type: "raw", format: "pdf" }, (error, result) => {
          if (error) return reject(new Error("Resource file upload failed."));
          resourceFileData = {
            type: "file",
            file: {
              fileName: resourceFile.originalname,
              filePath: result.secure_url,
              fileType: resourceFile.mimetype,
              publicId: result.public_id,
              size: resourceFile.size,
            },
          };
          resolve();
        });
        uploadStream.end(resourceFile.buffer);
      });
    } catch (error) {
      // Clean up new thumbnail if resource file upload fails
      if (thumbnailData.publicId && thumbnailData.publicId !== oldThumbnailPublicId) {
        await cloudinary.uploader.destroy(thumbnailData.publicId, { resource_type: "image" });
      }
      return res.status(500).json({ error: "Resource file could not be uploaded." });
    }
  }

  // Handle tags
  let tagsArray = subject.tags;
  if (tags) {
    let parsedTags = [];
    if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags); // Expecting [{ tag: 'java' }, { tag: 'programming' }]
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
      return res.status(400).json({ error: error.message });
    }
  }

  // Handle highlights
  let highlightsArray = subject.highlights;
  if (highlights) {
    let parsedHighlights = [];
    if (typeof highlights === "string") {
      try {
        parsedHighlights = JSON.parse(highlights); // Expecting [{ highlight: 'Learn OOP' }, { highlight: 'Build projects' }]
      } catch (error) {
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
      // Check for duplicates
      const highlightValues = highlightsArray.map((h) => h.highlight);
      if (new Set(highlightValues).size !== highlightValues.length) {
        throw new Error("Duplicate highlights are not allowed.");
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Handle price and discount
  let finalPrice = price !== undefined ? parseFloat(price) : subject.price;
  let finalDiscount = discount !== undefined ? parseFloat(discount) : subject.discount;
  let finalDiscountDate = discountDate ? new Date(discountDate) : subject.discountDate;
  let finalDiscountShow = subject.discountShow;

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

  // Check if discountDate is in the past
  if (finalDiscountDate && finalDiscountDate <= new Date()) {
    finalDiscount = 0;
    finalDiscountDate = null;
    finalDiscountShow = false;
  }

  // Prepare update object
  const updateData = {
    name: name || subject.name,
    slug,
    description: description || subject.description,
    metaDescription: metaDescription || subject.metaDescription,
    university: university !== undefined ? university : subject.university,
    faculty: faculty !== undefined ? faculty : subject.faculty,
    program: program !== undefined ? program : subject.program,
    accessType: accessType || subject.accessType,
    groupId: groupId !== undefined ? groupId : subject.groupId,
    visibility: visibility || subject.visibility,
    scheduledPublish: visibility === "scheduled" ? new Date(scheduledPublish) : subject.scheduledPublish,
    tags: tagsArray,
    highlights: highlightsArray,
    price: finalPrice,
    discount: finalDiscount,
    discountDate: finalDiscountDate,
    discountShow: finalDiscountShow,
    thumbnail: thumbnailData,
    resourceFile: resourceFileData,
  };

  // Update the subject
  try {
    const updatedSubject = await SubjectModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    // Delete old Cloudinary assets if they were replaced
    const cloudinaryDeletions = [];
    if (oldThumbnailPublicId && thumbnailData.publicId !== oldThumbnailPublicId) {
      cloudinaryDeletions.push(cloudinary.uploader.destroy(oldThumbnailPublicId, { resource_type: "image" }));
    }
    if (oldResourceFilePublicId && resourceFileData.file?.publicId !== oldResourceFilePublicId) {
      cloudinaryDeletions.push(cloudinary.uploader.destroy(oldResourceFilePublicId, { resource_type: "raw" }));
    }
    await Promise.all(cloudinaryDeletions);

    res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      data: updatedSubject,
    });
  } catch (error) {
    // Clean up new Cloudinary uploads if update fails
    const cleanupDeletions = [];
    if (thumbnailData.publicId && thumbnailData.publicId !== oldThumbnailPublicId) {
      cleanupDeletions.push(cloudinary.uploader.destroy(thumbnailData.publicId, { resource_type: "image" }));
    }
    if (resourceFileData.file?.publicId && resourceFileData.file.publicId !== oldResourceFilePublicId) {
      cleanupDeletions.push(cloudinary.uploader.destroy(resourceFileData.file.publicId, { resource_type: "raw" }));
    }
    await Promise.all(cleanupDeletions);

    res.status(500).json({
      error: "Failed to update subject",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = {
  createSubject,
  getAllSubject,
  getSubject,
  deleteSubject,
  getUserSubjects,
  getChaptersBySubjectSlug,
  getAllSubjectsWithChapters,
};
