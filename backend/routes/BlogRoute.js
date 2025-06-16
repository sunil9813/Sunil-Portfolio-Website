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
const validation = require("../middleware/Validation");
const { createBlogValidation } = require("../utils/validations/PostsValidation");
const { upload } = require("../middleware/imageMiddleware");

const router = express.Router();

router.post("/", protect, upload.single("cover"), validation(createBlogValidation), createBlog);

router.get("/all", getAllBlog);

router.get("/search", getBlogsByCategoryAndTag);

router.get("/deatil/:slug", protect, getBlogPrivate);

// public
router.get("/:slug", getBlog);

router.delete("/:id", protect, deleteBlog);
router.delete("/", protect, deleteBlog);

router.patch("/featured/:blogId", protect, updateFeaturedStatus);
router.patch("/visibility/:blogId", protect, updateVisibility);

router.patch("/:slug", protect, upload.single("cover"), updateBlog);
module.exports = router;
