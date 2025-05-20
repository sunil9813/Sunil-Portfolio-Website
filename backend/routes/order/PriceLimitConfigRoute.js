const express = require("express");
const { admin, protect } = require("../../middleware/authMiddleware");
const { createOrUpdatePriceLimit, getPriceLimit } = require("../../controllers/order/PriceLimitConfigCtr");
const router = express.Router();

// Create or update the asset limit configuration by admin
router.post("/", protect, admin, createOrUpdatePriceLimit);
router.get("/", protect, admin, getPriceLimit);

module.exports = router;
