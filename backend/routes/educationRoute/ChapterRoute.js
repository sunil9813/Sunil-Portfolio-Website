const express = require("express");
const { protect, admin } = require("../../middleware/authMiddleware");
const { upload } = require("../../middleware/imageMiddleware");
const { createChapter, getAllChapter, getChapter, deleteChapter } = require("../../controllers/educationController/ChapterController");
const router = express.Router();

router.post("/", protect, admin, upload.single("thumbnail"), createChapter);
router.get("/", getAllChapter);
router.get("/details/:slug", getChapter);
router.delete("/", protect, admin, deleteChapter);
router.delete("/:id", protect, admin, deleteChapter);
// router.patch("/:id", protect, admin, upload.single("logo"), updateUniversity);
module.exports = router;
