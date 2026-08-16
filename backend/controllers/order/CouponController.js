const asyncHandler = require("express-async-handler");
const CouponModel = require("../../models/order/CouponModel");
const { normalizeCouponCode, validateCouponForOrder } = require("../../utils/order/coupon");

const createCoupon = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    code: normalizeCouponCode(req.body.code),
  };

  if (!payload.code) {
    return res.status(400).json({ success: false, error: "Coupon code is required." });
  }

  const coupon = await CouponModel.create(payload);

  res.status(201).json({
    success: true,
    coupon,
  });
});

const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await CouponModel.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    coupons,
  });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  if (payload.code) {
    payload.code = normalizeCouponCode(payload.code);
  }

  const coupon = await CouponModel.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!coupon) {
    return res.status(404).json({ success: false, error: "Coupon not found." });
  }

  res.status(200).json({
    success: true,
    coupon,
  });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await CouponModel.findById(req.params.id);

  if (!coupon) {
    return res.status(404).json({ success: false, error: "Coupon not found." });
  }

  await coupon.deleteOne();

  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully.",
  });
});

const validateCoupon = asyncHandler(async (req, res) => {
  const subtotal = Number(req.body.subtotal || 0);
  const { coupon, discountAmount } = await validateCouponForOrder({ code: req.body.code, subtotal });

  res.status(200).json({
    success: true,
    coupon: coupon
      ? {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discountAmount,
        }
      : null,
    subtotal,
    discountAmount,
    total: Math.max(Number((subtotal - discountAmount).toFixed(2)), 0),
  });
});

module.exports = {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
};
