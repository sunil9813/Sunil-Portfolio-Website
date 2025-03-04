const express = require("express");
const { uploadFile, uploadCoverandMedia } = require("../../utils/uploadImg");
const { protect, admin } = require("../../middleware/authMiddleware");
const { createNoteBookValidation } = require("../../utils/validations/PostsValidation");
const validation = require("../../middleware/Validation");
const {
  createCourses,
  getAlNote,
  getNote,
  deleteCourse,
  updateNoteCtr,
  getAlNoteofUser,
  createChapter,
  getAllChapterByCourses,
  getBookWithCoursesAndChapters,
  getChapterBySlug,
  getChapterById,
  getCoursesWithAllChapters,
  deleteChapter,
  updateChapter,
} = require("../../controllers/notes/CoursesControllers");
const { getRecommendedCourses } = require("../../controllers/common/profile");
const router = express.Router();

router.post("/", protect, admin, uploadFile.single("cover"), validation(createNoteBookValidation), createCourses);
router.get("/user", protect, getAlNoteofUser);
router.delete("/:id", protect, admin, deleteCourse);
router.put("/:id", protect, admin, uploadFile.single("cover"), updateNoteCtr);

router.get("/", getAlNote);
router.get("/:slug", getNote);

// for courses routes
router.post("/courses", protect, admin, uploadCoverandMedia, createChapter);
router.get("/courses/allchapter", protect, admin, getAllChapterByCourses);

// yo chai get garxa all courses chapters
router.get("/courses/:slug", getBookWithCoursesAndChapters); // public access
router.get("/courses/all/:slug", protect, admin, getCoursesWithAllChapters); // show in user profile
// End here

// get garxa each chapter by slug and Id
router.get("/courses/chapter/:slug", protect, admin, getChapterBySlug);
router.get("/courses/chapter/byid/:id", protect, admin, getChapterById);
// End here
router.delete("/courses/chapter/:id", protect, admin, deleteChapter);
router.patch("/courses/chapter/:id", protect, admin, uploadCoverandMedia, updateChapter);

// AI
router.get("/courses/recommended/:id", getRecommendedCourses);

module.exports = router;
