const express = require("express");
const {
  updatePostTags,
  updateCourseTags,
  updateChapterTags,
  DeletePostTags,
  DeleteCourseTags,
  DeleteChapterTags,
  updateBlogTags,
  getItemsByTagOfPosts,
  getItemsByTagOfCourses,
  getItemsByTagOfChapter,
  getItemsByTagOfBlog,
  getPostsofMostMatchTagsPost,
  getPostsofMostMatchTagsCourses,
  getPostsofMostMatchTagsChapter,
  getPostsofMostMatchTagsBlog,
} = require("../../controllers/common/updateAndRemoveTags");
const BlogModel = require("../../models/BlogModel");
const router = express.Router();

router.put("/posts/:id", updatePostTags);
router.put("/courses/:id", updateCourseTags);
router.put("/chapters/:id", updateChapterTags);
router.put("/blog/:id", updateBlogTags);

router.delete("/posts/:id", DeletePostTags);
router.delete("/courses/:id", DeleteCourseTags);
router.delete("/chapters/:id", DeleteChapterTags);
router.delete("/blog/:id", BlogModel);

router.get("/posts/:tag", getItemsByTagOfPosts);
router.get("/courses/:tag", getItemsByTagOfCourses);
router.get("/chapters/:tag", getItemsByTagOfChapter);
router.get("/blog/:tag", getItemsByTagOfBlog);

router.get("/posts/recommend/:id", getPostsofMostMatchTagsPost);
router.get("/courses/recommend/:id", getPostsofMostMatchTagsCourses);
router.get("/chapters/recommend/:id", getPostsofMostMatchTagsChapter);
router.get("/blog/recommend/:id", getPostsofMostMatchTagsBlog);
module.exports = router;
