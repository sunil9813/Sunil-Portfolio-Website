const express = require("express");
const { protect, verified } = require("../../middleware/authMiddleware");
const { likeBlog, likeCourse, likeProject, likeChapter } = require("../../controllers/common/likeController");
const router = express.Router();

router.post("/blog/:id", protect, verified, likeBlog);
router.post("/course/:id", protect, verified, likeCourse);
router.post("/project/:id", protect, verified, likeProject);
router.post("/chapter/:id", protect, verified, likeChapter);

module.exports = router;
