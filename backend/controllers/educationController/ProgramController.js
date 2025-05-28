const asyncHandler = require("express-async-handler");
const ProgramModel = require("../../models/educationModel/ProgramModel");
const FacultyModel = require("../../models/educationModel/FacultyModel");
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2;

// @desc    Create a new program
// @route   POST /api/programs
// @access  Private/Admin
const createProgram = asyncHandler(async (req, res) => {
  const { name, description, university, faculty, groupId } = req.body;
  const userId = req.user.id;

  // Validate input
  if (!name || !description || !university || !faculty) {
    res.status(400);
    throw new Error("Please provide all required fields: name, description, university, faculty");
  }

  // Validate thumbnail
  if (!req.file) {
    res.status(400);
    throw new Error("Thumbnail image is required");
  }

  const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedImageTypes.includes(req.file.mimetype)) {
    res.status(400);
    throw new Error("Invalid image format. Supported formats: JPEG, PNG");
  }

  if (req.file.size > 2 * 1024 * 1024) {
    res.status(400);
    throw new Error("Thumbnail size should not exceed 2 MB");
  }

  // Check if faculty belongs to the specified university
  const facultyData = await FacultyModel.findOne({
    _id: faculty,
    university: university,
  });

  if (!facultyData) {
    res.status(400);
    throw new Error("The selected faculty does not belong to the specified university");
  }

  // Check if program with same name already exists in the university
  const existingProgram = await ProgramModel.findOne({
    name: name,
    university: university,
  });

  if (existingProgram) {
    res.status(400);
    throw new Error("A program with this name already exists in the specified university");
  }

  // Generate slug
  const originalSlug = slugify(name, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });

  let slug = originalSlug;
  let suffix = 1;

  while (await ProgramModel.findOne({ slug })) {
    slug = `${suffix}-${originalSlug}`;
    suffix++;
  }

  // Upload thumbnail
  let thumbnailData = {};
  try {
    const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
      folder: "Sunil Portfolio/programs",
    });

    thumbnailData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      publicId: uploadedFile.public_id,
    };
  } catch (error) {
    res.status(500);
    throw new Error("Thumbnail could not be uploaded");
  }

  // Create program
  const program = await ProgramModel.create({
    user: userId,
    university: university,
    faculty: faculty,
    name: name,
    description: description,
    slug: slug,
    groupId: groupId,
    thumbnail: thumbnailData,
  });

  res.status(201).json({
    message: "Program created successfully",
    data: program,
  });
});

// @desc    Get all programs
// @route   GET /api/programs
// @access  Public
const getAllPrograms = asyncHandler(async (req, res) => {
  const programs = await ProgramModel.find()
    .sort("-createdAt")
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
    });

  if (!programs) {
    res.status(500);
    throw new Error("An unexpected error occurred while fetching programs");
  }

  res.status(200).json({
    total: programs.length,
    programList: programs,
  });
});

// @desc    Get single program by slug
// @route   GET /api/programs/:slug
// @access  Public
const getProgram = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    res.status(400);
    throw new Error("Program slug is required");
  }

  const program = await ProgramModel.findOne({ slug })
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
    });

  if (!program) {
    res.status(404);
    throw new Error("Program not found");
  }

  res.status(200).json(program);
});

// @desc    Delete program
// @route   DELETE /api/programs/:id
// @access  Private/Admin
const deleteProgram = asyncHandler(async (req, res) => {
  const programId = req.body.id || req.params.id;

  if (!programId) {
    res.status(400);
    throw new Error("Program ID is required");
  }

  const program = await ProgramModel.findById(programId);

  if (!program) {
    res.status(404);
    throw new Error("Program not found");
  }

  // Delete thumbnail from Cloudinary
  if (program.thumbnail && program.thumbnail.publicId) {
    try {
      await cloudinary.uploader.destroy(program.thumbnail.publicId);
    } catch (error) {
      res.status(500);
      throw new Error("Error deleting thumbnail from Cloudinary");
    }
  }

  await program.deleteOne();
  res.status(200).json({ message: "Program deleted successfully" });
});

// @desc    Update program
// @route   PATCH /api/programs/:id
// @access  Private/Admin

const updateProgram = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { name, description, university, faculty } = req.body;

  const program = await ProgramModel.findOne({ slug });

  if (!program) {
    res.status(404);
    throw new Error("Program not found");
  }

  // Validate faculty belongs to university if either is being updated
  if (university || faculty) {
    const targetUniversity = university || program.university;
    const targetFaculty = faculty || program.faculty;

    const facultyBelongsToUni = await FacultyModel.findOne({
      _id: targetFaculty,
      university: targetUniversity,
    });

    if (!facultyBelongsToUni) {
      res.status(400);
      throw new Error("The selected faculty does not belong to the specified university");
    }
  }

  // Handle thumbnail update if provided
  if (req.file) {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedImageTypes.includes(req.file.mimetype)) {
      res.status(400);
      throw new Error("Invalid image format. Supported formats: JPEG, PNG");
    }

    if (req.file.size > 2 * 1024 * 1024) {
      res.status(400);
      throw new Error("Thumbnail size should not exceed 2 MB");
    }

    // Upload new thumbnail
    try {
      const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Sunil Portfolio/programs",
      });

      // Delete old thumbnail
      if (program.thumbnail && program.thumbnail.publicId) {
        try {
          await cloudinary.uploader.destroy(program.thumbnail.publicId);
        } catch (error) {
          res.status(500);
          throw new Error("Error deleting old thumbnail from Cloudinary");
        }
      }

      program.thumbnail = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        publicId: uploadedFile.public_id,
      };
    } catch (error) {
      res.status(500);
      throw new Error("Thumbnail could not be uploaded");
    }
  }

  // Update fields
  if (name) {
    program.name = name;
    // Regenerate slug if name changes
    const originalSlug = slugify(name, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
      strict: true,
    });

    let newSlug = originalSlug;
    let suffix = 1;

    while (await ProgramModel.findOne({ slug: newSlug, _id: { $ne: program._id } })) {
      newSlug = `${suffix}-${originalSlug}`;
      suffix++;
    }
    program.slug = newSlug;
  }

  if (description) program.description = description;
  if (university) program.university = university;
  if (faculty) program.faculty = faculty;

  const updatedProgram = await program.save();

  res.status(200).json({
    message: "Program updated successfully",
    data: updatedProgram,
  });
});

module.exports = {
  createProgram,
  getAllPrograms,
  getProgram,
  deleteProgram,
  updateProgram,
};
