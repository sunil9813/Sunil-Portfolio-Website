const asyncHandler = require("express-async-handler");
const Testimonial = require("../../models/portfolio/testimonialModel");
const Filter = require("bad-words");
const testimonialModel = require("../../models/portfolio/testimonialModel");
const cloudinary = require("cloudinary").v2;

const createTestimonial = asyncHandler(async (req, res) => {
  const { fullname, position, company, location, content, email, phone, rating, link, cost, type } = req.body;

  // Validate type
  if (!type || !["contact", "feedback", "inquiry"].includes(type)) {
    return res.status(400).json({ error: "Invalid or missing type. Must be 'contact', 'feedback', or 'inquiry'." });
  }

  // Validate common required fields
  const commonFields = { fullname, email, phone, location, content };
  for (const [key, value] of Object.entries(commonFields)) {
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: `Missing or invalid ${key}.` });
    }
  }

  // Profanity check for provided fields
  const filter = new Filter();
  const fieldsToCheck = [fullname, email, phone, location, content];
  if (position) fieldsToCheck.push(position);
  if (company) fieldsToCheck.push(company);
  if (link) fieldsToCheck.push(link);
  if (cost) fieldsToCheck.push(cost);

  for (const field of fieldsToCheck) {
    if (filter.isProfane(field)) {
      return res.status(400).json({
        error: "Content contains profane words, and your submission cannot be posted due to content guidelines.",
      });
    }
  }

  // Type-specific validations
  let avatarData = {};
  let projectFileDoc = {};

  if (type === "contact") {
    // No avatar or projectDoc allowed
    if (req.files && (req.files["avatar"] || req.files["projectDoc"])) {
      return res.status(400).json({ error: "Avatar and project document uploads are not allowed for contact type." });
    }
    if (rating || position || company || link || cost) {
      return res.status(400).json({ error: "Fields rating, position, company, link, and cost are not allowed for contact type." });
    }
  } else if (type === "feedback") {
    // Validate feedback-specific fields
    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating is required for feedback and must be a number between 1 and 5." });
    }
    if (!position || !company || !link) {
      return res.status(400).json({ error: "Position, company, and link are required for feedback." });
    }
    if (cost) {
      return res.status(400).json({ error: "Cost is not allowed for feedback type." });
    }
    if (req.files && req.files["projectDoc"]) {
      return res.status(400).json({ error: "Project document upload is not allowed for feedback type." });
    }

    // Handle avatar (use user's avatar if not uploaded)
    if (!req.files || !req.files["avatar"] || !req.files["avatar"][0]) {
      if (!req.user.avatar) {
        return res.status(400).json({ error: "Avatar is required for feedback and no user avatar is available." });
      }
      avatarData = req.user.avatar; // Assume user.avatar is an object with fileName, filePath, fileType, publicId
    } else {
      const avatarFile = req.files["avatar"][0];
      try {
        await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "Sunil Portfolio/Portfolio/Testimonial/Avatar",
              resource_type: "image",
            },
            (error, result) => {
              if (error) return reject(new Error("Avatar upload failed: " + error.message));
              avatarData = {
                fileName: avatarFile.originalname,
                filePath: result.secure_url,
                fileType: avatarFile.mimetype,
                publicId: result.public_id,
              };
              resolve();
            }
          );
          uploadStream.end(avatarFile.buffer);
        });
      } catch (error) {
        return res.status(500).json({ error: "Avatar could not be uploaded: " + error.message });
      }
    }
  } else if (type === "inquiry") {
    // Validate inquiry-specific fields
    if (!position || !company || !link) {
      return res.status(400).json({ error: "Position, company, and link are required for inquiry." });
    }
    if (!cost) {
      return res.status(400).json({ error: "Cost is required for inquiry." });
    }
    if (rating) {
      return res.status(400).json({ error: "Rating is not allowed for inquiry type." });
    }
    if (!req.files || !req.files["projectDoc"] || !req.files["projectDoc"][0]) {
      return res.status(400).json({ error: "Project document is required for inquiry." });
    }

    // Handle avatar (use user's avatar if not uploaded)
    if (!req.files || !req.files["avatar"] || !req.files["avatar"][0]) {
      if (!req.user.avatar) {
        return res.status(400).json({ error: "Avatar is required for inquiry and no user avatar is available." });
      }
      avatarData = req.user.avatar;
    } else {
      const avatarFile = req.files["avatar"][0];
      try {
        await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "Sunil Portfolio/Portfolio/Testimonial/Avatar",
              resource_type: "image",
            },
            (error, result) => {
              if (error) return reject(new Error("Avatar upload failed: " + error.message));
              avatarData = {
                fileName: avatarFile.originalname,
                filePath: result.secure_url,
                fileType: avatarFile.mimetype,
                publicId: result.public_id,
              };
              resolve();
            }
          );
          uploadStream.end(avatarFile.buffer);
        });
      } catch (error) {
        return res.status(500).json({ error: "Avatar could not be uploaded: " + error.message });
      }
    }

    // Handle project document
    const projectFile = req.files["projectDoc"][0];
    try {
      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "Sunil Portfolio/Portfolio/Testimonial/Project Documentation",
            resource_type: "raw",
          },
          (error, result) => {
            if (error) return reject(new Error("Project document upload failed: " + error.message));
            projectFileDoc = {
              fileName: projectFile.originalname,
              filePath: result.secure_url,
              fileType: projectFile.mimetype,
              publicId: result.public_id,
            };
            resolve();
          }
        );
        uploadStream.end(projectFile.buffer);
      });
    } catch (error) {
      // Clean up avatar if projectDoc upload fails
      if (avatarData.publicId) {
        await cloudinary.uploader.destroy(avatarData.publicId, { resource_type: "image" });
      }
      return res.status(500).json({ error: "Project document could not be uploaded: " + error.message });
    }
  }

  // Create the testimonial
  try {
    const introduction = await testimonialModel.create({
      user: type === "contact" ? null : req.user._id, // No user for contact
      fullname,
      position,
      company,
      location,
      content,
      email,
      phone,
      rating,
      link,
      cost,
      type,
      avatar: avatarData,
      projectDoc: projectFileDoc,
    });

    res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: introduction,
    });
  } catch (error) {
    // Clean up uploaded files if creation fails
    if (avatarData.publicId) {
      await cloudinary.uploader.destroy(avatarData.publicId, { resource_type: "image" });
    }
    if (projectFileDoc.publicId) {
      await cloudinary.uploader.destroy(projectFileDoc.publicId, { resource_type: "raw" });
    }
    res.status(500).json({
      error: "Failed to create testimonial",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Only for Admin
const getAllTestimonialsByAdmin = asyncHandler(async (req, res) => {
  const testimonialList = await testimonialModel.find().sort("-createdAt").populate({
    path: "user",
    select: "avatar name email",
  });
  res.status(200).json({
    totalTestimonial: testimonialList?.length,
    testimonialList,
  });
});

const getTestimonialsByAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400);
    throw new Error("Testimonial id is required");
  }

  const testimonial = await testimonialModel.findById(id).populate({
    path: "user",
    select: "avatar name email",
  });

  if (!testimonial) {
    res.status(404);
    throw new Error("Testimonial not found");
  }

  res.status(200).json(testimonial);
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  // Get testimonial ID from either body or params
  let testimonialId;

  if (req.body?.id) {
    testimonialId = req.body.id;
  } else if (req.params?.id) {
    testimonialId = req.params.id;
  }

  // Validate testimonial ID
  if (!testimonialId) {
    res.status(400);
    throw new Error("Testimonial ID is required in the request.");
  }

  // Find the testimonial
  const testimonial = await testimonialModel.findById(testimonialId);

  if (!testimonial) {
    res.status(404);
    throw new Error("Testimonial not found. Please check the provided information.");
  }

  // Delete associated files from Cloudinary
  try {
    // Delete avatar if it exists
    if (testimonial.avatar?.publicId) {
      await cloudinary.uploader.destroy(testimonial.avatar.publicId, {
        resource_type: "image",
      });
    }

    // Delete project document if it exists (for inquiry type)
    if (testimonial.type === "inquiry" && testimonial.projectDoc?.publicId) {
      await cloudinary.uploader.destroy(testimonial.projectDoc.publicId, {
        resource_type: "raw",
      });
    }

    // Delete the testimonial from database
    await testimonial.deleteOne();

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
      deletedId: testimonial._id,
    });
  } catch (error) {
    // Handle errors during deletion
    res.status(500).json({
      success: false,
      message: "Failed to delete testimonial",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

const updateTestimonial = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;

  // Validate input
  if (!id) {
    res.status(400);
    throw new Error("Testimonial ID is required");
  }

  if (!content || typeof content !== "string" || content.trim() === "") {
    res.status(400);
    throw new Error("Valid content is required");
  }

  // Profanity check
  const filter = new Filter();
  if (filter.isProfane(content)) {
    res.status(400);
    throw new Error("Content contains inappropriate language");
  }

  try {
    // Find and update the testimonial
    const testimonial = await testimonialModel.findByIdAndUpdate(id, { content }, { new: true, runValidators: true });

    if (!testimonial) {
      res.status(404);
      throw new Error("Testimonial not found");
    }

    res.status(200).json({
      success: true,
      message: "Testimonial content updated successfully",
      data: {
        _id: testimonial._id,
        content: testimonial.content,
        updatedAt: testimonial.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update testimonial content",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getAllTestimonialsByAdmin,
  getTestimonialsByAdmin,
};
