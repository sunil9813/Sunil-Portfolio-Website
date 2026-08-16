const express = require("express");
const { protect, optionalProtect, admin } = require("../../middleware/authMiddleware");
const {
  createSubject,
  getAllSubject,
  getSubject,
  deleteSubject,
  getUserSubjects,
  getChaptersBySubjectSlug,
  getSubjectPdf,
  getSubjectResource,
  updateSubject,
  getCourseSubjects,
  getNoteSubjects,
  getAllSubjectsWithChapters,
  trackSubjectView,
  trackChapterView,
  trackSubheadingView,
  toggleSubheadingLike,
  toggleSubheadingBookmark,
} = require("../../controllers/educationController/SubjectController");
const { getUploadFileandThumbnail } = require("../../utils/uploadImg");

const router = express.Router();

const uploadFileandThumbnail = async (req, res, next) => {
  try {
    const uploadMiddleware = await getUploadFileandThumbnail();
    uploadMiddleware(req, res, next);
  } catch (error) {
    res.status(500).json({ error: `Failed to initialize upload middleware: ${error.message}` });
  }
};

router.post("/", protect, admin, uploadFileandThumbnail, createSubject);
router.get("/", getAllSubject);
router.get("/my-subjects", protect, getUserSubjects);
router.get("/courses", getCourseSubjects);
router.get("/notes", getNoteSubjects);
router.get("/subject-with-chapter", getAllSubjectsWithChapters);
router.get("/details/:slug", getSubject);

router.get("/:slug/pdf", getSubjectPdf);
router.get("/:slug/resource/:index", getSubjectResource);
router.get("/:slug/chapters", optionalProtect, getChaptersBySubjectSlug);
router.post("/:slug/view", trackSubjectView);
router.post("/chapter/:chapterId/view", trackChapterView);
router.post("/chapter/:chapterId/subheading/:subheadingId/view", trackSubheadingView);
router.post("/chapter/:chapterId/subheading/:subheadingId/like", protect, toggleSubheadingLike);
router.post("/chapter/:chapterId/subheading/:subheadingId/bookmark", protect, toggleSubheadingBookmark);

router.delete("/", protect, admin, deleteSubject);
router.delete("/:id", protect, admin, deleteSubject);

router.patch("/:slug", protect, admin, uploadFileandThumbnail, updateSubject);

module.exports = router;
