const express = require("express");
const { protect, admin } = require("../../middleware/authMiddleware");
const { createTestimonial, updateTestimonial, deleteTestimonial, getAllTestimonials, getAllTestimonialsByAdmin } = require("../../controllers/about/testimonialCtr");
const { uploadAvatarandProjectDoc } = require("../../utils/uploadImg");

const router = express.Router();

router.post("/", protect, uploadAvatarandProjectDoc, createTestimonial);
router.get("/", getAllTestimonials);
router.get("/admin", protect, admin, getAllTestimonialsByAdmin);
router.put("/:id", protect, admin, uploadAvatarandProjectDoc, updateTestimonial);
router.delete("/", protect, admin, deleteTestimonial);

module.exports = router;
