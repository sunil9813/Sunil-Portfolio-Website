const express = require("express");
const { getIntro, deleteIntro, createIntro, updateIntro, getAllIntro, downloadCV } = require("../../controllers/portfolio/introductionCtr");
const { protect, admin } = require("../../middleware/authMiddleware");
const { getUploadCVandAvatar } = require("../../utils/uploadImg");
const router = express.Router();

const uploadCVandAvatar = async (req, res, next) => {
  try {
    const uploadMiddleware = await getUploadCVandAvatar();
    uploadMiddleware(req, res, next);
  } catch (error) {
    res.status(500).json({ error: `Failed to initialize upload middleware: ${error.message}` });
  }
};

router.post("/", protect, uploadCVandAvatar, createIntro);
router.patch("/:id", protect, uploadCVandAvatar, updateIntro);
router.get("/all", protect, admin, getAllIntro);
router.get("/:id", protect, getIntro);
router.delete("/", protect, deleteIntro);
router.delete("/:id", protect, deleteIntro);
router.get("/:id/download-cv", downloadCV);

module.exports = router;
