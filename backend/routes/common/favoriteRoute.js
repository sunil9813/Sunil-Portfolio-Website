const express = require("express");
const { toggleFavorite, getUserFavorite } = require("../../controllers/common/favoriteController");
const { protect, verified } = require("../../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, verified, toggleFavorite);
router.get("/", protect, verified, getUserFavorite);

module.exports = router;
