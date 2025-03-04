const express = require("express");
const { createOrUpdateAssetLimit, getAssetLimit } = require("../../controllers/posts/AssetLimitConfigCtr");
const { admin, protect } = require("../../middleware/authMiddleware");
const router = express.Router();

// Create or update the asset limit configuration by admin
router.post("/", protect, admin, createOrUpdateAssetLimit);
router.get("/", protect, admin, getAssetLimit);

module.exports = router;
