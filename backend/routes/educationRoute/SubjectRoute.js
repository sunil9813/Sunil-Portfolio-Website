const express = require("express");
const { protect, admin } = require("../../middleware/authMiddleware");
const { upload, handleUploadErrors } = require("../../middleware/imageMiddleware");
const { createSubject, getAllSubject, getSubject } = require("../../controllers/educationController/SubjectController");
const router = express.Router();

router.post("/", protect, admin, upload.single("thumbnail"), handleUploadErrors, createSubject);
router.get("/", getAllSubject);
router.get("/details/:slug", getSubject);
// router.delete("/", protect, admin, deleteUniversity);
// router.delete("/:id", protect, admin, deleteUniversity);
// router.patch("/:id", protect, admin, upload.single("logo"), updateUniversity);
module.exports = router;
