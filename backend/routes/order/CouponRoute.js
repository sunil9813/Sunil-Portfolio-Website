const express = require("express");
const { protect, admin } = require("../../middleware/authMiddleware");
const { createCoupon, deleteCoupon, getCoupons, updateCoupon, validateCoupon } = require("../../controllers/order/CouponController");

const router = express.Router();

router.post("/validate", protect, validateCoupon);
router.get("/admin", protect, admin, getCoupons);
router.post("/admin", protect, admin, createCoupon);
router.put("/admin/:id", protect, admin, updateCoupon);
router.delete("/admin/:id", protect, admin, deleteCoupon);

module.exports = router;
