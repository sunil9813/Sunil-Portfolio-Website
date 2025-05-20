const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2;
const Filter = require("bad-words");
const SubjectModel = require("../../models/educationModel/SubjectModel");
const ChapterModel = require("../../models/educationModel/ChapterModel");

const createSubject = asyncHandler(async (req, res) => {
  const { name, description, metaDescription, university, faculty, program, premium, groupId, visibility, scheduledPublish, tags, price, discount, discountDate } = req.body;
  const userId = req.user.id;

  // Profanity check
  const filter = new Filter();
  const fieldsToCheck = [name, description, metaDescription];
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
  const originalSlug = slugify(name, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });

  let slug = originalSlug;
  let suffix = 1;

  while (await SubjectModel.findOne({ slug })) {
    slug = `${suffix}-${originalSlug}`;
    suffix++;
  }

  // Handle the uploaded Thumbnail
  if (!req.file) {
    console.log("Files received:", req.file); // Debug what files arrived
    return res.status(400).json({ error: "Thumbnail is required." });
  }

  let thumbnailData = {};
  try {
    uploadedFile = await cloudinary.uploader.upload(req.file.path, {
      folder: "Sunil Portfolio/Subject",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Thumbnail could not be uploaded");
  }

  thumbnailData = {
    fileName: req.file.originalname,
    filePath: uploadedFile.secure_url,
    fileType: req.file.mimetype,
    publicId: uploadedFile.public_id,
  };

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

  const data = await SubjectModel.create({
    user: userId,
    university,
    faculty,
    program,
    name,
    slug,
    description,
    metaDescription,
    premium: premium,
    groupId,
    visibility,
    scheduledPublish: visibility === "scheduled" ? scheduledPublish : null,
    tags: tagsArray,
    price: finalPrice,
    discount: finalDiscount,
    discountDate: finalDiscountDate,
    discountShow: finalDiscountShow,
    thumbnail: thumbnailData,
  });

  res.status(201).json({ message: "University created successfully", data });
});

const getAllSubject = asyncHandler(async (req, res) => {
  try {
    const subject = await SubjectModel.find().sort("createdAt").populate({
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

module.exports = {
  createSubject,
  getAllSubject,
  getSubject,
};
