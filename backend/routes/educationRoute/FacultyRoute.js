const express = require("express");
const router = express.Router();
const { createFaculty, getAllFaculties, getFaculty, deleteFaculty, updateFaculty } = require("../../controllers/educationController/FacultyController");
const { protect, admin } = require("../../middleware/authMiddleware");

// Faculty Routes
router.post("/", protect, admin, createFaculty);
router.get("/", getAllFaculties);
router.get("/details/:slug", getFaculty);
router.delete("/", protect, admin, deleteFaculty);
router.delete("/:id", protect, admin, deleteFaculty);
router.patch("/:id", protect, admin, updateFaculty);

module.exports = router;
