const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2;
const Filter = require("bad-words");
const ChapterModel = require("../../models/educationModel/ChapterModel");

const createChapter = asyncHandler(async (req, res) => {
  const { title, description, metaDescription, university, faculty, program, subject, groupId, visibility, scheduledPublish, tags } = req.body;
  const userId = req.user.id;

  // Profanity check
  const filter = new Filter();
  const fieldsToCheck = [title, description, metaDescription];
  for (const field of fieldsToCheck) {
    if (field && filter.isProfane(field)) {
      return res.status(400).json({
        error: "Creation failed because the content contains profane words.",
      });
    }
  }

  // Validate scheduled publish if visibility is scheduled
  if (visibility === "scheduled" && !scheduledPublish) {
    return res.status(400).json({
      error: "Scheduled publish date is required when visibility is set to scheduled",
    });
  }

  // Generate a unique slug for the blog post
  const originalSlug = slugify(title, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });

  let slug = originalSlug;
  let suffix = 1;

  while (await ChapterModel.findOne({ slug })) {
    slug = `${suffix}-${originalSlug}`;
    suffix++;
  }

  // ===== THUMBNAIL HANDLING (OPTIONAL) =====
  let thumbnailData = null;

  if (req.file) {
    // Validate file type
    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedImageTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        error: "Invalid image format. Supported formats: JPEG, PNG, JPG.",
      });
    }

    // Validate file size (2MB max)
    if (req.file.size > 2 * 1024 * 1024) {
      return res.status(400).json({
        error: "Thumbnail size should not exceed 2MB.",
      });
    }

    // Upload to Cloudinary if file exists
    try {
      const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Sunil Portfolio/Chapter",
      });

      thumbnailData = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        publicId: uploadedFile.public_id,
      };
    } catch (error) {
      return res.status(500).json({
        error: "Thumbnail could not be uploaded",
      });
    }
  }
  // ===== END THUMBNAIL HANDLING =====

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

  const data = await ChapterModel.create({
    user: userId,
    university,
    faculty,
    subject,
    program,
    title,
    slug,
    description,
    metaDescription,
    groupId,
    visibility,
    scheduledPublish: visibility === "scheduled" ? scheduledPublish : null,
    tags: tagsArray,
    thumbnail: thumbnailData,
  });

  res.status(201).json({ message: "Chapter created successfully", data });
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

  const faculty = await ChapterModel.findOne({ slug })
    .populate({
      path: "user",
      select: "avatar name email",
    })
    .populate({
      path: "university",
      select: "name logo",
    })
    .populate({
      path: "subject",
      select: "name",
    });

  if (!faculty) {
    res.status(404);
    throw new Error("Faculty not found");
  }

  res.status(200).json(faculty);
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

  await chapter.deleteOne();
  res.status(200).json({ message: "Chapter deleted successfully" });
});

module.exports = {
  createChapter,
  getAllChapter,
  getChapter,
  deleteChapter,
};
