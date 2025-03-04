const express = require("express");
const { createBlog, getAllBlog, getBlog, deleteBlog, updateBlog, getBlogsByTag, updateFeaturedStatus, updateVisibility, getBlogPrivate } = require("../controllers/BlogController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../utils/uploadImg");
const validation = require("../middleware/Validation");
const { createBlogValidation } = require("../utils/validations/PostsValidation");

const router = express.Router();

router.post("/", protect, upload.single("cover"), validation(createBlogValidation), createBlog);
router.patch("/:id", protect, upload.single("cover"), updateBlog);
router.get("/all", getAllBlog);
router.get("/deatil/:slug", protect, getBlogPrivate);

// public
router.get("/:slug", getBlog);

router.delete("/:id", protect, deleteBlog);
router.delete("/", protect, deleteBlog);
router.get("/tags/:tag", getBlogsByTag);

router.patch("/:blogId/featured", protect, updateFeaturedStatus);
router.patch("/:blogId/visibility", protect, updateVisibility);

module.exports = router;
