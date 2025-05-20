const express = require("express");
const { protect, verified } = require("../../middleware/authMiddleware");
const { addRatingOrComment, getComments, getCommentsandRatings } = require("../../controllers/common/commentsController");
const router = express.Router();

router.post("/", protect, verified, addRatingOrComment);
router.get("/:id", getComments);
router.get("/ratings/:resourceType/:resourceId", getCommentsandRatings);

module.exports = router;
