const express = require("express");
const { protect, admin } = require("../../middleware/authMiddleware");
const { createOrUpdateResume, getResume, updateResumeFields, deleteResumeFields, getAllResume } = require("../../controllers/about/resumeCtr");
const router = express.Router();

router.post("/", protect, createOrUpdateResume);
router.put("/", protect, updateResumeFields);
router.delete("/", protect, deleteResumeFields);
router.get("/:id", getResume);
router.get("/", protect, admin, getAllResume);
module.exports = router;
