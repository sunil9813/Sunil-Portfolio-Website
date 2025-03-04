const express = require("express");
const { admin, protect } = require("../../middleware/authMiddleware");
const validation = require("../../middleware/Validation");
const { createUniValidation } = require("../../utils/validations/PostsValidation");
const {
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
} = require("../../controllers/notes/AcademicComponentsCtr");
const { upload } = require("../../utils/uploadImg");
const router = express.Router();

// University
router.post("/university", protect, admin, upload.single("logo"), validation(createUniValidation), createUniversity);
router.get("/university", getAllUniversities);
router.get("/university/:id", getUniversity);
router.post("/university", protect, admin, getUniversity);
router.delete("/university/delete", protect, admin, deleteUniversity);
router.delete("/university/:id", protect, admin, deleteUniversity);
router.patch("/university/:id", upload.single("logo"), protect, admin, updateUniversity);
// End University

// Faculty
router.post("/faculty", protect, admin, createFaculty);
router.get("/faculty", getAllFaculties);
router.delete("/faculty/delete", protect, admin, deleteFaculty);
router.delete("/faculty/:id", protect, admin, deleteFaculty);
//End Faculty

// Program
router.post("/program", protect, admin, createProgram);
router.get("/program", getAllPrograms);
router.delete("/program/delete", protect, admin, deleteProgram);
router.delete("/program/:id", protect, admin, deleteProgram);
//End Program

// Semester
router.post("/semester", protect, admin, createSemester);
router.get("/semester", getAllSemesters);
router.delete("/semester/delete", protect, admin, deleteSemester);
router.delete("/semester/:id", protect, admin, deleteSemester);
//End Semester

// Semester
router.post("/subject", protect, admin, upload.single("logo"), createSubject);
router.get("/subject", getAllSubjects);
router.delete("/subject/delete", protect, admin, deleteSubject);
router.delete("/subject/:id", protect, admin, deleteSubject);
router.patch("/subject/:id", upload.single("logo"), protect, admin, updateSubject);

//End Semester
module.exports = router;
