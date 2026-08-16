const express = require("express");
const { protect, verified } = require("../../middleware/authMiddleware");
const { likeBlog, likeCourse, likeProject, likeChapter, getMyLikes } = require("../../controllers/common/likeController");
const router = express.Router();

router.get("/my", protect, getMyLikes);
router.post("/blog/:id", protect, verified, likeBlog);
router.post("/course/:id", protect, verified, likeCourse);
router.post("/project/:id", protect, verified, likeProject);
router.post("/chapter/:id", protect, verified, likeChapter);

module.exports = router;
