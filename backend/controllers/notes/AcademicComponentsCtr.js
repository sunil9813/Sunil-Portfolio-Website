const asyncHandler = require("express-async-handler");
const { UniversityModel, FacultyModel, ProgramModel, SemesterModel, SubjectModel } = require("../../models/notes/AcademicComponentsModel");
const { isValidObjectId } = require("mongoose");
const cloudinary = require("cloudinary").v2;

const createUniversity = asyncHandler(async (req, res) => {
  const { name, description, location, edate } = req.body;

  const isNameExists = await UniversityModel.findOne({ name });
  if (isNameExists) {
    res.status(400);
    throw new Error("University with the same name already exists.");
  }

  let fileData = {};

  if (req.file) {
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Sunil Portfolio/Academic/University",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      url: uploadedFile.secure_url,
      publicId: uploadedFile.public_id,
    };
  }

  const universityData = await UniversityModel.create({
    user: req.user._id,
    name: name,
    edate: edate,
    description: description,
    location: location,
    logo: fileData,
  });
  res.status(201).json({
    message: "University created successfully.",
    university: universityData,
  });
});
const getAllUniversities = asyncHandler(async (req, res) => {
  const universities = await UniversityModel.find().sort("createdAt").populate({
    path: "user",
    select: "avatar name email",
  });

  if (!universities) {
    res.status(500);
    throw new Error("An unexpected error occurred. Please try again later or contact our support team for assistance.");
  }

  res.status(200).json({ total: universities?.length, universityList: universities });
});
const getUniversity = asyncHandler(async (req, res) => {
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

  const university = await UniversityModel.findOne({ _id: universityId }).populate({
    path: "user",
    select: "avatar name email",
  });

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
  const { name, description, location, edate } = req.body;
  const userId = req.user.id;

  let fileData = {};

  if (req.file) {
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Sunil Portfolio/Academic/University",
        resource_type: "image",
      });
    } catch (error) {
      return res.status(500).json({ message: "Image could not be uploaded." });
    }

    fileData = {
      url: uploadedFile.secure_url,
      publicId: uploadedFile.public_id,
    };
  }

  try {
    const universityToUpdate = await UniversityModel.findById(id);

    if (!universityToUpdate) {
      return res.status(404).json({ message: "University not found." });
    }

    // Create an object to store the updated fields
    const updatedFields = {
      user: userId,
      ...(name && { name }),
      ...(description && { description }),
      ...(edate && { edate }),
      ...(location && { location }),
    };

    // Delete the previous image from Cloudinary only if a new file is provided
    if (fileData && fileData.url) {
      if (universityToUpdate.logo && universityToUpdate.logo.publicId) {
        try {
          await cloudinary.uploader.destroy(universityToUpdate.logo.publicId);
        } catch (error) {
          return res.status(500).json({ message: "Error deleting previous image from Cloudinary." });
        }
      }
      updatedFields.logo = fileData;
    } else if (!fileData && universityToUpdate.logo) {
      // Keep the previous logo if no new file is provided
      updatedFields.logo = universityToUpdate.logo;
    }

    const updatedUniversity = await UniversityModel.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedUniversity) {
      res.status(404).json({ message: "University not found." });
      return;
    }

    res.status(200).json({ message: "University updated successfully", data: updatedUniversity });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while updating the University." });
  }
});

/* ----------------------- Faculty ------------------------ */
const createFaculty = asyncHandler(async (req, res) => {
  const { name, universityId } = req.body;

  if (!isValidObjectId(universityId)) {
    res.status(400);
    throw new Error("University ID not found!.");
  }

  const isNameExists = await FacultyModel.findOne({ name });
  if (isNameExists) {
    res.status(400);
    throw new Error("Faculty with the same name already exists.");
  }

  try {
    const faculty = await FacultyModel.create({
      user: req.user._id,
      name,
      university: universityId,
    });

    res.status(201).json({ message: "Faculty created successfully", faculty });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the faculty", error });
  }
});
const getAllFaculties = asyncHandler(async (req, res) => {
  try {
    const faculties = await FacultyModel.find().populate("university");

    res.status(200).json(faculties);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching faculties", error });
  }
});
const deleteFaculty = asyncHandler(async (req, res) => {
  let facultyId;

  if (req.body && req.body.id) {
    facultyId = req.body.id;
  } else if (req.params && req.params.id) {
    facultyId = req.params.id;
  }

  if (!facultyId) {
    res.status(400);
    throw new Error("University ID is required in the request.");
  }
  const faculty = await FacultyModel.findOne({ _id: facultyId });

  if (!faculty) {
    res.status(404);
    throw new Error("Faculty not found. Please check the provided information.");
  }

  await faculty.deleteOne();
  res.status(200).json({ message: "Faculty deleted successfully" });
});
/* ----------------------- Faculty ------------------------ */

/* ----------------------- Program ------------------------ */
const createProgram = asyncHandler(async (req, res) => {
  const { name, facultyId } = req.body;

  if (!isValidObjectId(facultyId)) {
    res.status(400);
    throw new Error("Faculty ID not found!.");
  }

  const isNameExists = await ProgramModel.findOne({ name });
  if (isNameExists) {
    res.status(400);
    throw new Error("Program with the same name already exists.");
  }

  try {
    const program = await ProgramModel.create({
      user: req.user._id,
      name,
      faculty: facultyId,
    });

    res.status(201).json({ message: "Program created successfully", program });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the program", error });
  }
});
const getAllPrograms = asyncHandler(async (req, res) => {
  try {
    const programs = await ProgramModel.find().populate({
      path: "faculty",
      populate: {
        path: "university",
      },
    });

    res.status(200).json(programs);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching programs", error });
  }
});
const deleteProgram = asyncHandler(async (req, res) => {
  let programId;

  if (req.body && req.body.id) {
    programId = req.body.id;
  } else if (req.params && req.params.id) {
    programId = req.params.id;
  }

  if (!programId) {
    res.status(400);
    throw new Error("Program ID is required in the request.");
  }
  const program = await ProgramModel.findOne({ _id: programId });

  if (!program) {
    res.status(404);
    throw new Error("Program not found. Please check the provided information.");
  }

  await program.deleteOne();
  res.status(200).json({ message: "Program deleted successfully" });
});
/* ----------------------- Program ------------------------ */

/* ----------------------- Semester ------------------------ */
const createSemester = asyncHandler(async (req, res) => {
  const { sem, programId } = req.body;

  if (!isValidObjectId(programId)) {
    res.status(400);
    throw new Error("Program ID not found!.");
  }

  const isNameExists = await SemesterModel.findOne({ sem });
  if (isNameExists) {
    res.status(400);
    throw new Error("Semester with the same name already exists.");
  }

  try {
    const semester = await SemesterModel.create({
      user: req.user._id,
      sem,
      program: programId,
    });

    res.status(201).json({ message: "Semester created successfully", semester });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the semester", error });
  }
});
const getAllSemesters = asyncHandler(async (req, res) => {
  try {
    const semesters = await SemesterModel.find().populate({
      path: "program",
      populate: {
        path: "faculty",
        populate: {
          path: "university",
        },
      },
    });

    res.status(200).json({
      totalSemesters: semesters.length,
      semesters,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching semesters", error });
  }
});
const deleteSemester = asyncHandler(async (req, res) => {
  let semesterId;

  if (req.body && req.body.id) {
    semesterId = req.body.id;
  } else if (req.params && req.params.id) {
    semesterId = req.params.id;
  }

  if (!semesterId) {
    res.status(400);
    throw new Error("Semester ID is required in the request.");
  }
  const semester = await SemesterModel.findOne({ _id: semesterId });

  if (!semester) {
    res.status(404);
    throw new Error("Semester not found. Please check the provided information.");
  }

  await semester.deleteOne();
  res.status(200).json({ message: "Semester deleted successfully" });
});
/* ----------------------- Semester ------------------------ */

/* ----------------------- Subject ------------------------ */
const createSubject = asyncHandler(async (req, res) => {
  const { name, semesterId } = req.body;

  if (!isValidObjectId(semesterId)) {
    res.status(400);
    throw new Error("Semester ID not found!.");
  }
  const isNameExists = await SubjectModel.findOne({ name });
  if (isNameExists) {
    res.status(400);
    throw new Error("Subject with the same name already exists.");
  }

  let fileData = {};

  if (req.file) {
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Sunil Portfolio/Academic/Subjects",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      url: uploadedFile.secure_url,
      publicId: uploadedFile.public_id,
    };
  }

  const universityData = await SubjectModel.create({
    user: req.user._id,
    name: name,
    semester: semesterId,
    logo: fileData,
  });
  res.status(201).json({
    message: "Subject created successfully.",
    university: universityData,
  });
});
const getAllSubjects = asyncHandler(async (req, res) => {
  try {
    const subjects = await SubjectModel.find().populate({
      path: "semester",
      populate: {
        path: "program",
        populate: {
          path: "faculty",
          populate: {
            path: "university",
          },
        },
      },
    });

    res.status(200).json({
      totalSubjects: subjects.length,
      subjects,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching subjects", error });
  }
});
const deleteSubject = asyncHandler(async (req, res) => {
  let subjectId;

  if (req.body && req.body.id) {
    subjectId = req.body.id;
  } else if (req.params && req.params.id) {
    subjectId = req.params.id;
  }

  if (!subjectId) {
    res.status(400);
    throw new Error("Subject ID is required in the request.");
  }
  const subject = await SubjectModel.findOne({ _id: subjectId });

  if (!subject) {
    res.status(404);
    throw new Error("Subject not found. Please check the provided information.");
  }

  if (subject.logo && subject.logo.publicId) {
    try {
      const result = await cloudinary.uploader.destroy(subject.logo.publicId);
      if (result.result !== "ok") {
        res.status(500).json({ message: "Error deleting logo from Cloudinary" });
        return;
      }
    } catch (error) {
      res.status(500).json({ message: "An error occurred while deleting the logo image from Cloudinary." });
      return;
    }
  }

  await subject.deleteOne();
  res.status(200).json({ message: "Subject deleted successfully" });
});
const updateSubject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const userId = req.user.id;

  let fileData = {};

  if (req.file) {
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Sunil Portfolio/Academic/Subjects",
        resource_type: "image",
      });
    } catch (error) {
      return res.status(500).json({ message: "Image could not be uploaded." });
    }

    fileData = {
      url: uploadedFile.secure_url,
      publicId: uploadedFile.public_id,
    };
  }

  try {
    const subjectToUpdate = await SubjectModel.findById(id);

    if (!subjectToUpdate) {
      return res.status(404).json({ message: "Subject not found." });
    }

    // Update the name if provided in the request
    if (name) {
      subjectToUpdate.name = name;
    }

    // Update the image if a new file is provided
    if (fileData && fileData.url) {
      if (subjectToUpdate.logo && subjectToUpdate.logo.publicId) {
        try {
          await cloudinary.uploader.destroy(subjectToUpdate.logo.publicId);
        } catch (error) {
          return res.status(500).json({ message: "Error deleting previous image from Cloudinary." });
        }
      }
      subjectToUpdate.logo = fileData;
    }

    const updatedSubject = await subjectToUpdate.save();

    res.status(200).json({ message: "Subject updated successfully", data: updatedSubject });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while updating the Subject." });
  }
});
/* ----------------------- Subject ------------------------ */

module.exports = {
  createUniversity,
  getAllUniversities,
  getUniversity,
  deleteUniversity,
  updateUniversity,
  createFaculty,
  getAllFaculties,
  deleteFaculty,
  createProgram,
  getAllPrograms,
  deleteProgram,
  createSemester,
  getAllSemesters,
  deleteSemester,
  createSubject,
  getAllSubjects,
  deleteSubject,
  updateSubject,
};
