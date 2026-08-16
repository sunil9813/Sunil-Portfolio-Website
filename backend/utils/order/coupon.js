const CouponModel = require("../../models/order/CouponModel");

const normalizeCouponCode = (code = "") => String(code || "").trim().toUpperCase();

const getCouponDiscount = (coupon, subtotal) => {
  if (!coupon) return 0;

  const amount = Number(subtotal || 0);
  const rawDiscount =
    coupon.discountType === "fixed"
      ? Number(coupon.discountValue || 0)
      : (amount * Number(coupon.discountValue || 0)) / 100;

  const cappedDiscount = coupon.maxDiscountAmount > 0 ? Math.min(rawDiscount, Number(coupon.maxDiscountAmount)) : rawDiscount;

  return Math.max(Number(Math.min(cappedDiscount, amount).toFixed(2)), 0);
};

const validateCouponForOrder = async ({ code, subtotal }) => {
  const normalizedCode = normalizeCouponCode(code);

  if (!normalizedCode) {
    return {
      coupon: null,
      discountAmount: 0,
    };
  }

  const coupon = await CouponModel.findOne({ code: normalizedCode });

  if (!coupon) {
    const error = new Error("Invalid coupon code.");
    error.statusCode = 400;
    throw error;
  }

  const now = Date.now();

  if (!coupon.isActive) {
    const error = new Error("This coupon is not active.");
    error.statusCode = 400;
    throw error;
  }

  if (coupon.startsAt && new Date(coupon.startsAt).getTime() > now) {
    const error = new Error("This coupon is not active yet.");
    error.statusCode = 400;
    throw error;
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < now) {
    const error = new Error("This coupon has expired.");
    error.statusCode = 400;
    throw error;
  }

  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    const error = new Error("This coupon usage limit has been reached.");
    error.statusCode = 400;
    throw error;
  }

  if (Number(subtotal || 0) < Number(coupon.minOrderAmount || 0)) {
    const error = new Error(`This coupon requires a minimum order amount of ${coupon.minOrderAmount}.`);
    error.statusCode = 400;
    throw error;
  }

  return {
    coupon,
    discountAmount: getCouponDiscount(coupon, subtotal),
  };
};

module.exports = {
  normalizeCouponCode,
  getCouponDiscount,
  validateCouponForOrder,
};
