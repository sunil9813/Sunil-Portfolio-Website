const asyncHandler = require("express-async-handler");
const UniversityModel = require("../../models/educationModel/UniversityModel");
const cloudinary = require("cloudinary").v2;
const slugify = require("slugify");

const createUniversity = asyncHandler(async (req, res) => {
  const { name, description, edate, location, website } = req.body;
  const userId = req.user.id;

  // Generate a unique slug for the blog post
  const originalSlug = slugify(name, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });

  let slug = originalSlug;
  let suffix = 1;

  while (await UniversityModel.findOne({ slug })) {
    slug = `${suffix}-${originalSlug}`;
    suffix++;
  }

  // Handle the uploaded cover image
  if (!req.file) {
    return res.status(400).json({ error: "Image is required." });
  }

  const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedImageTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: "Invalid image format. Supported formats: JPEG, PNG." });
  }

  if (req.file.size > 2 * 1024 * 1024) {
    return res.status(400).json({ error: "Logo size should not exceed 2 MB." });
  }

  let fileData = {};
  try {
    uploadedFile = await cloudinary.uploader.upload(req.file.path, {
      folder: "Sunil Portfolio/university",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Image could not be uploaded");
  }

  fileData = {
    fileName: req.file.originalname,
    filePath: uploadedFile.secure_url,
    fileType: req.file.mimetype,
    publicId: uploadedFile.public_id,
  };

  const data = await UniversityModel.create({
    user: userId,
    name: name,
    description: description,
    edate: edate,
    website: website,
    slug: slug,
    location: location,
    logo: fileData,
  });

  res.status(201).json({ message: "University created successfully", data });
});

const getAllUniversity = asyncHandler(async (req, res) => {
  const universitys = await UniversityModel.find().sort("createdAt").populate({
    path: "user",
    select: "avatar name email",
  });
  if (!universitys) {
    res.status(500);
    throw new Error("An unexpected error occurred. Please try again later or contact our support team for assistance.");
  }
  res.status(200).json({ total: universitys?.length, universityList: universitys });
});

const getUniversity = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    res.status(400);
    throw new Error("University data not found.");
  }

  const university = await UniversityModel.findOne({ slug });

  if (!university) {
    res.status(404);
    throw new Error("University not found. Please check the provided information.");
  }

  res.status(200).json(university);
});

const deleteUniversity = asyncHandler(async (req, res) => {
  let universityId;

  if (req.body && req.body.id) {
    universityId = req.body.id;
  } else if (req.params && req.params.id) {
    universityId = req.params.id;
  }

  if (!universityId) {
    res.status(400);
    throw new Error("University ID is required in the request.");
  }
  const university = await UniversityModel.findOne({ _id: universityId });

  if (!university) {
    res.status(404);
    throw new Error("University not found. Please check the provided information.");
  }

  if (university.logo && university.logo.publicId) {
    try {
      const result = await cloudinary.uploader.destroy(university.logo.publicId);
      if (result.result !== "ok") {
        res.status(500).json({ message: "Error deleting logo from Cloudinary" });
        return;
      }
    } catch (error) {
      res.status(500).json({ message: "An error occurred while deleting the logo image from Cloudinary." });
      return;
    }
  }

  await university.deleteOne();
  res.status(200).json({ message: "University deleted successfully" });
});

const updateUniversity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, edate, location, website } = req.body;

  try {
    // Find the university by its ID
    const universityToUpdate = await UniversityModel.findById(id);

    if (!universityToUpdate) {
      return res.status(404).json({ message: "University not found." });
    }

    // Update the fields if they're provided in the request
    if (name) {
      universityToUpdate.name = name;
      // Regenerate slug if name changes
      const originalSlug = slugify(name, {
        lower: true,
        remove: /[*+~.()'"!:@]/g,
        strict: true,
      });

      let slug = originalSlug;
      let suffix = 1;

      while (await UniversityModel.findOne({ slug, _id: { $ne: id } })) {
        slug = `${suffix}-${originalSlug}`;
        suffix++;
      }
      universityToUpdate.slug = slug;
    }

    if (description) universityToUpdate.description = description;
    if (edate) universityToUpdate.edate = edate;
    if (location) universityToUpdate.location = location;
    if (website) universityToUpdate.website = website;

    // Check if a new logo image is provided
    if (req.file) {
      const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedImageTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          error: "Invalid image format. Supported formats: JPEG, PNG.",
        });
      }

      if (req.file.size > 2 * 1024 * 1024) {
        return res.status(400).json({
          error: "Logo size should not exceed 2 MB.",
        });
      }

      try {
        const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
          folder: "Sunil Portfolio/university",
          resource_type: "image",
        });

        // If a new image is provided, delete the previous logo if it exists
        if (universityToUpdate.logo && universityToUpdate.logo.publicId) {
          try {
            await cloudinary.uploader.destroy(universityToUpdate.logo.publicId);
          } catch (error) {
            return res.status(500).json({
              message: "Error deleting previous logo from Cloudinary.",
            });
          }
        }

        universityToUpdate.logo = {
          fileName: req.file.originalname,
          filePath: uploadedFile.secure_url,
          fileType: req.file.mimetype,
          publicId: uploadedFile.public_id,
        };
      } catch (error) {
        return res.status(500).json({
          message: "Image could not be uploaded.",
        });
      }
    }

    // Save the updated university
    const updatedUniversity = await universityToUpdate.save();

    res.status(200).json({
      message: "University updated successfully",
      data: updatedUniversity,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while updating the University.",
      error: error.message,
    });
  }
});
module.exports = {
  createUniversity,
  getAllUniversity,
  getUniversity,
  deleteUniversity,
  updateUniversity,
};
