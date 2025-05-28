const express = require("express");
const { protect, admin } = require("../../middleware/authMiddleware");
const { createSubject, getAllSubject, getSubject, deleteSubject } = require("../../controllers/educationController/SubjectController");
const { getUploadFileandThumbnail } = require("../../utils/uploadImg");
const router = express.Router();

// Async wrapper for dynamic Project upload middleware
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
router.get("/details/:slug", getSubject);
router.delete("/", protect, admin, deleteSubject);
router.delete("/:id", protect, admin, deleteSubject);
// router.patch("/:id", protect, admin, upload.single("logo"), updateUniversity);
module.exports = router;
