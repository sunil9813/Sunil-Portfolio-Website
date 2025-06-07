const express = require("express");
const { protect, admin } = require("../../middleware/authMiddleware");
const { getResume, updateResume, deleteResumeFields, getAllResume, createResume, deleteResume } = require("../../controllers/portfolio/resumeCtr");
const router = express.Router();

router.post("/", protect, createResume);
router.delete("/field", protect, deleteResumeFields); // to do
router.delete("/", protect, deleteResume);
router.delete("/:id", protect, deleteResume);
router.get("/:id", getResume);
router.get("/", protect, admin, getAllResume);
router.patch("/:id", protect, updateResume);

module.exports = router;
