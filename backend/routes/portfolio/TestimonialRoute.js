const express = require("express");
const { protect, admin } = require("../../middleware/authMiddleware");
const { createTestimonial, updateTestimonial, deleteTestimonial, getAllTestimonialsByAdmin, getTestimonialsByAdmin } = require("../../controllers/portfolio/testimonialCtr");
const { getuploadAvatarandProjectDoc } = require("../../utils/uploadImg");

const uploadAssetsandAvatar = async (req, res, next) => {
  try {
    const uploadMiddleware = await getuploadAvatarandProjectDoc();
    uploadMiddleware(req, res, next);
  } catch (error) {
    res.status(500).json({ error: `Failed to initialize upload middleware: ${error.message}` });
  }
};

const router = express.Router();

// router.post("/", protect, uploadAssetsandAvatar, createTestimonial);
// Middleware to conditionally apply protection
const conditionalProtect = (req, res, next) => {
  const { type } = req.body;

  // Skip protection for contact type
  if (type === "contact") {
    return next();
  }

  // Apply protection for feedback and inquiry
  protect(req, res, next);
};

router.post(
  "/",
  conditionalProtect, // Conditionally applies auth
  uploadAssetsandAvatar, // Always apply upload middleware
  createTestimonial
);

router.get("/admin", protect, admin, getAllTestimonialsByAdmin);
router.get("/admin/:id", protect, admin, getTestimonialsByAdmin);
router.delete("/", protect, admin, deleteTestimonial);
router.put("/:id", protect, admin, updateTestimonial);

module.exports = router;
