const express = require("express");
const { protect, admin } = require("../../middleware/authMiddleware");
const { upload } = require("../../middleware/imageMiddleware");
const { createChapter, createSubheading, getAllChapter, getChapter, deleteChapter } = require("../../controllers/educationController/ChapterController");
const { getUploadVideoandThumbnail } = require("../../utils/uploadImg");
const router = express.Router();

// Async wrapper for dynamic Project upload middleware
const uploadVideoandThumbnail = async (req, res, next) => {
  try {
    const uploadMiddleware = await getUploadVideoandThumbnail();
    uploadMiddleware(req, res, next);
  } catch (error) {
    res.status(500).json({ error: `Failed to initialize upload middleware: ${error.message}` });
  }
};

router.post("/", protect, uploadVideoandThumbnail, createChapter);
router.post("/:chapterId/subheadings", protect, uploadVideoandThumbnail, createSubheading);
router.get("/", getAllChapter);
router.get("/details/:slug", getChapter);
router.delete("/", protect, admin, deleteChapter);
router.delete("/:id", protect, admin, deleteChapter);
// router.patch("/:id", protect, admin, upload.single("logo"), updateUniversity);
module.exports = router;
