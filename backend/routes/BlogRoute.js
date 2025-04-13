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
} = require("../controllers/BlogController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../utils/uploadImg");
const validation = require("../middleware/Validation");
const { createBlogValidation } = require("../utils/validations/PostsValidation");

const router = express.Router();

router.post("/", protect, upload.single("cover"), validation(createBlogValidation), createBlog);

router.get("/all", getAllBlog);

router.get("/search", getBlogsByCategoryAndTag);

router.get("/deatil/:slug", protect, getBlogPrivate);

// public
router.get("/:slug", getBlog);

router.delete("/:id", protect, deleteBlog);
router.delete("/", protect, deleteBlog);

router.patch("/:blogId/featured", protect, updateFeaturedStatus);
router.patch("/:blogId/visibility", protect, updateVisibility);

router.patch("/:slug", protect, upload.single("cover"), updateBlog);
module.exports = router;
