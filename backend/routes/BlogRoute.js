const express = require("express");
const {
  createBlog,
  getAllBlog,
  getBlog,
  deleteBlog,
  updateBlog,
  getBlogsByTag,
  updateFeaturedStatus,
  updateVisibility,
  getBlogPrivate,
  getBlogsByCategoryAndTag,
  subscribeNewsletter,
  submitHelpfulFeedback,
  trackBlogShare,
  submitBlogIssue,
  trackReadingHistory,
  getBlogEngagementAnalytics,
  getNewsletterSubscribers,
  getBlogReports,
  updateBlogReportStatus,
  getMyBlogReadingHistory,
} = require("../controllers/BlogController");
const { protect, optionalProtect, admin } = require("../middleware/authMiddleware");
const validation = require("../middleware/Validation");
const { createBlogValidation } = require("../utils/validations/PostsValidation");
const { upload } = require("../middleware/imageMiddleware");

const router = express.Router();

router.post("/", protect, upload.single("cover"), validation(createBlogValidation), createBlog);

router.get("/all", getAllBlog);

router.get("/search", getBlogsByCategoryAndTag);

router.get("/deatil/:slug", protect, getBlogPrivate);

router.post("/newsletter/subscribe", subscribeNewsletter);
router.get("/admin/analytics", protect, admin, getBlogEngagementAnalytics);
router.get("/admin/newsletter", protect, admin, getNewsletterSubscribers);
router.get("/admin/reports", protect, admin, getBlogReports);
router.patch("/admin/reports/:id", protect, admin, updateBlogReportStatus);
router.get("/reading-history/me", protect, getMyBlogReadingHistory);
router.get("/preview/:slug", protect, getBlogPrivate);
router.post("/:slug/helpful", optionalProtect, submitHelpfulFeedback);
router.post("/:slug/share", optionalProtect, trackBlogShare);
router.post("/:slug/report", optionalProtect, submitBlogIssue);
router.post("/:slug/read-history", optionalProtect, trackReadingHistory);

// public
router.get("/:slug", getBlog);

router.delete("/:id", protect, deleteBlog);
router.delete("/", protect, deleteBlog);

router.patch("/featured/:blogId", protect, updateFeaturedStatus);
router.patch("/visibility/:blogId", protect, updateVisibility);

router.patch("/:slug", protect, upload.single("cover"), updateBlog);
module.exports = router;
