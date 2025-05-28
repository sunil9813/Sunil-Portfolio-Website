const express = require("express");
const { createUniversity, getAllUniversity, getUniversity, deleteUniversity, updateUniversity } = require("../../controllers/educationController/universityController");
const { protect, admin } = require("../../middleware/authMiddleware");
const { upload } = require("../../middleware/imageMiddleware");
const validation = require("../../middleware/Validation");
const { createUniversityValidation } = require("../../utils/validations/academicValidation");
const router = express.Router();

router.post("/", protect, admin, upload.single("logo"), validation(createUniversityValidation), createUniversity);
router.get("/", getAllUniversity);
router.get("/details/:slug", getUniversity);
router.delete("/", protect, admin, deleteUniversity);
router.delete("/:id", protect, admin, deleteUniversity);
router.patch("/:slug", protect, admin, upload.single("logo"), updateUniversity);
module.exports = router;
