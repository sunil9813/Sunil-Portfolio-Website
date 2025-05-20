const express = require("express");
const { toggleFavorite, getUserFavorite } = require("../../controllers/common/favoriteController");
const { protect, verified } = require("../../middleware/authMiddleware");
const router = express.Router();

router.get("/", protect, getUserFavorite);
router.post("/", protect, toggleFavorite);

module.exports = router;
