const asyncHandler = require("express-async-handler");
const FacultyModel = require("../../models/educationModel/FacultyModel");
const slugify = require("slugify");

// @desc    Create a new faculty
// @route   POST /api/faculties
// @access  Private
const createFaculty = asyncHandler(async (req, res) => {
  const { name, university } = req.body;
  const userId = req.user.id;

  // Validate input
  if (!name || !university) {
    res.status(400);
    throw new Error("Please provide all required fields: name, university");
  }

  // Generate a unique slug
  const originalSlug = slugify(name, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });

  let slug = originalSlug;
  let suffix = 1;

  while (await FacultyModel.findOne({ slug })) {
    slug = `${suffix}-${originalSlug}`;
    suffix++;
  }

  // Check if faculty name already exists for this university
  const existingFaculty = await FacultyModel.findOne({
    name,
    university,
  });

  if (existingFaculty) {
    res.status(400);
    throw new Error("A faculty with this name already exists in the specified university");
  }

  const faculty = await FacultyModel.create({
    user: userId,
    university,
    name,
    slug,
  });

  res.status(201).json({
    message: "Faculty created successfully",
    data: faculty,
  });
});

// @desc    Get all faculties
// @route   GET /api/faculties
// @access  Public
const getAllFaculties = asyncHandler(async (req, res) => {
  const faculties = await FacultyModel.find()
    .sort("-createdAt")
    .populate({
      path: "user",
      select: "avatar name email",
    })
    .populate({
      path: "university",
      select: "name logo",
    });

  if (!faculties) {
    res.status(500);
    throw new Error("An unexpected error occurred while fetching faculties");
  }

  res.status(200).json({
    total: faculties.length,
    facultyList: faculties,
  });
});

// @desc    Get single faculty by slug
// @route   GET /api/faculties/:slug
// @access  Public
const getFaculty = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    res.status(400);
    throw new Error("Faculty slug is required");
  }

  const faculty = await FacultyModel.findOne({ slug })
    .populate({
      path: "user",
      select: "avatar name email",
    })
    .populate({
      path: "university",
      select: "name logo",
    });

  if (!faculty) {
    res.status(404);
    throw new Error("Faculty not found");
  }

  res.status(200).json(faculty);
});

// @desc    Delete a faculty
// @route   DELETE /api/faculties/:id
// @access  Private
const deleteFaculty = asyncHandler(async (req, res) => {
  const facultyId = req.body.id || req.params.id;

  if (!facultyId) {
    res.status(400);
    throw new Error("Faculty ID is required");
  }

  const faculty = await FacultyModel.findById(facultyId);

  if (!faculty) {
    res.status(404);
    throw new Error("Faculty not found");
  }

  // Check if the requesting user is the owner
  if (faculty.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to delete this faculty");
  }

  await faculty.deleteOne();
  res.status(200).json({ message: "Faculty deleted successfully" });
});

// @desc    Update a faculty
// @route   PUT /api/faculties/:id
// @access  Private
const updateFaculty = asyncHandler(async (req, res) => {
  const facultyId = req.params.id;

  const { name, university } = req.body;

  try {
    const facultyToUpdate = await FacultyModel.findById(facultyId);

    if (!facultyToUpdate) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    if (facultyToUpdate.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this faculty" });
    }

    if (name && name !== facultyToUpdate.name) {
      const existingFaculty = await FacultyModel.findOne({
        name,
        university: facultyToUpdate.university,
      });

      if (existingFaculty && existingFaculty._id.toString() !== facultyId) {
        return res.status(400).json({
          message: "A faculty with this name already exists in the specified university",
        });
      }

      facultyToUpdate.name = name;

      const originalSlug = slugify(name, {
        lower: true,
        remove: /[*+~.()'"!:@]/g,
        strict: true,
      });

      let slug = originalSlug;
      let suffix = 1;

      while (await FacultyModel.findOne({ slug, _id: { $ne: facultyId } })) {
        slug = `${suffix}-${originalSlug}`;
        suffix++;
      }

      facultyToUpdate.slug = slug;
    }

    if (university) facultyToUpdate.university = university;

    const updatedFaculty = await facultyToUpdate.save();

    res.status(200).json({
      message: "Faculty updated successfully",
      data: updatedFaculty,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while updating the faculty",
      error: error.message,
    });
  }
});

module.exports = {
  createFaculty,
  getAllFaculties,
  getFaculty,
  deleteFaculty,
  updateFaculty,
};
