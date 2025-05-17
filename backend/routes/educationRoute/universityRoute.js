const express = require("express");
const { createUniversityValidation } = require("../../utils/validations/academicValidation");
const validation = require("../../middleware/Validation");
const { protect, admin } = require("../../middleware/authMiddleware");
const { createUniversity } = require("../../controllers/educationController/universityController");
const { upload } = require("../../middleware/imageMiddleware");
const router = express.Router();

router.post("/", protect, admin, upload.single("logo"), validation(createUniversityValidation), createUniversity);
module.exports = router;
