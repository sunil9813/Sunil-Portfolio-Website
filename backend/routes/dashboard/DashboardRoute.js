const express = require("express");
const { getDashboardStats } = require("../../controllers/dashboard/DashboardController");
const { protect, admin } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, admin, getDashboardStats);

module.exports = router;
