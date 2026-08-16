const express = require("express");
const { protect, verified } = require("../../middleware/authMiddleware");
const { addRatingOrComment, getMyComments, getComments, updateComment, deleteComment, getCommentsandRatings, toggleCommentLike } = require("../../controllers/common/commentsController");

const router = express.Router();

router.post("/", protect, verified, addRatingOrComment);
router.get("/ratings/:resourceType/:resourceId", getCommentsandRatings);
router.get("/my", protect, getMyComments);
router.patch("/:commentId/like", protect, verified, toggleCommentLike);
router.put("/:commentId", protect, verified, updateComment);
router.delete("/:commentId", protect, verified, deleteComment);
router.get("/:id", getComments);

module.exports = router;
