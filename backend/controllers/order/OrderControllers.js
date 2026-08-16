const OrderModel = require("../../models/order/OrderModel");
const asyncHandler = require("express-async-handler");
const PriceLimitConfigModel = require("../../models/order/PriceLimitConfigModel");
const SubjectModel = require("../../models/educationModel/SubjectModel");
const ProjectModel = require("../../models/project/ProjectModel");
const CouponModel = require("../../models/order/CouponModel");
const UserModel = require("../../models/users/UserModel");
const NotificationModel = require("../../models/product/NotificationModel");
const CartAbandonmentModel = require("../../models/product/CartAbandonmentModel");
const { sendAutomatedEmailTrs } = require("../../utils/helpers/mail");
const { validateCouponForOrder } = require("../../utils/order/coupon");

const getAssetUrl = (asset) => {
  if (!asset) return "";
  if (typeof asset === "string") return asset;
  return asset.filePath || asset.url || "";
};

const isDiscountActive = (item) => {
  if (!item?.discountShow || !item?.discount) return false;
  if (!item.discountDate) return true;

  return new Date(item.discountDate).getTime() >= Date.now();
};

const getFinalPrice = (item) => {
  const originalPrice = Number(item?.price || 0);
  const discount = isDiscountActive(item) ? Number(item.discount || 0) : 0;
  const finalPrice = discount > 0 ? originalPrice - (originalPrice * discount) / 100 : originalPrice;

  return Math.max(Number(finalPrice.toFixed(2)), 0);
};

const getProductModel = (type = "") => {
  const normalizedType = String(type).toLowerCase();

  if (["course", "courses", "subject"].includes(normalizedType)) {
    return { name: "Subject", model: SubjectModel };
  }

  if (normalizedType === "project") {
    return { name: "Project", model: ProjectModel };
  }

  return null;
};

const buildOrderItems = async (items = []) => {
  const uniqueItems = Array.from(
    new Map(
      items
        .filter((item) => item?.product || item?.id)
        .map((item) => [`${item.productType || item.type || "course"}-${item.product || item.id}`, item]),
    ).values(),
  );

  const orderItems = [];

  for (const item of uniqueItems) {
    const productConfig = getProductModel(item.productType || item.type);

    if (!productConfig) continue;

    const productId = item.product || item.id;
    const product = await productConfig.model.findById(productId);

    if (!product || product.visibility !== "public") continue;

    const quantity = Math.max(Number.parseInt(item.quantity, 10) || 1, 1);
    const price = getFinalPrice(product);
    const originalPrice = Number(product.price || 0);

    if (price <= 0) continue;

    orderItems.push({
      product: product._id,
      productModel: productConfig.name,
      title: product.title || product.name,
      slug: product.slug,
      image: getAssetUrl(product.thumbnail) || getAssetUrl(product.logo) || getAssetUrl(product.assets?.[0]),
      quantity,
      price,
      originalPrice,
      discount: isDiscountActive(product) ? Number(product.discount || 0) : 0,
    });
  }

  return orderItems;
};

/* const newOrder = asyncHandler(async (req, res) => {
  const priceConfig = await PriceLimitConfigModel.findOne({});
  const price = priceConfig ? priceConfig.priceLimit : null;

  if (price === null) {
    return res.status(400).json({
      success: false,
      error: "Price configuration not found. Cannot create the order.",
    });
  }

  const { shippingInfo, paymentInfo, items = [] } = req.body;
  const orderItems = await buildOrderItems(items);
  const orderAmount = orderItems.length > 0 ? orderItems.reduce((total, item) => total + item.price * item.quantity, 0) : price;

  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  const isFreeOrder = orderAmount <= 0;
  const paidAt = isFreeOrder ? new Date() : undefined;

  const data = await OrderModel.create({
    shippingInfo,
    orderItems,
    amount: Number(orderAmount.toFixed(2)),
    paymentInfo,
    paidAt,
    expiresAt: expirationDate,
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    data,
  });
});
 */
const newOrder = asyncHandler(async (req, res) => {
  const { shippingInfo, paymentInfo, items = [], couponCode } = req.body;
  const orderItems = await buildOrderItems(items);
  const hasCartItems = Array.isArray(items) && items.length > 0;

  if (hasCartItems && orderItems.length === 0) {
    return res.status(400).json({
      success: false,
      error: "No payable cart items were found. Please refresh your cart and try again.",
    });
  }

  const priceConfig = hasCartItems ? null : await PriceLimitConfigModel.findOne({});
  const price = priceConfig ? priceConfig.priceLimit : null;

  if (!hasCartItems && price === null) {
    return res.status(400).json({
      success: false,
      error: "Price configuration not found. Cannot create the order.",
    });
  }

  const subtotal = orderItems.length > 0 ? orderItems.reduce((total, item) => total + item.price * item.quantity, 0) : price;
  const { coupon, discountAmount } = await validateCouponForOrder({ code: couponCode, subtotal });
  const orderAmount = Math.max(Number((subtotal - discountAmount).toFixed(2)), 0);
  const isFreeOrder = orderAmount <= 0;
  const paidAt = isFreeOrder ? new Date() : undefined;
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  // Check if the user already has an active (unpaid) order
  const existingOrder = await OrderModel.findOne({
    user: req.user._id,
    status: { $in: ["unpaid", "pending", "failed"] },
  });

  if (existingOrder) {
    // User has an active order, so delete or update it (choose one of the options below)

    // Option 1: Delete the existing order
    await existingOrder.deleteOne();

    // Option 2: Update the existing order
    // existingOrder.shippingInfo = shippingInfo;
    // existingOrder.amount = price;
    // existingOrder.paymentInfo = paymentInfo;
    // existingOrder.paidAt = paidAt;
    // existingOrder.expiresAt = expirationDate;
    // await existingOrder.save();
  }

  await CartAbandonmentModel.updateMany({ user: req.user._id, status: "open" }, { status: "converted" });

  // Create the new order
  const data = await OrderModel.create({
    shippingInfo,
    orderItems,
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount,
    coupon: coupon
      ? {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
        }
      : undefined,
    amount: Number(orderAmount.toFixed(2)),
    paymentInfo,
    paidAt,
    expiresAt: expirationDate,
    status: isFreeOrder ? "paid" : "unpaid",
    user: req.user._id,
  });

  if (isFreeOrder) {
    data.paymentInfo = {
      ...(data.paymentInfo?.toObject?.() || data.paymentInfo || {}),
      status: "paid",
      method: "coupon",
      id: `coupon-${data._id}`,
      totalAmount: 0,
      verifiedAt: paidAt,
    };
    await data.save();

    await UserModel.findByIdAndUpdate(req.user._id, {
      paid: true,
      paymentExpiresAt: expirationDate,
    });

    await NotificationModel.create({
      user: req.user._id,
      type: "payment",
      title: "Free order activated",
      message: "Your coupon covered the full order amount and your paid access is active.",
      link: "/account?tab=orders",
    });

    try {
      await sendAutomatedEmailTrs({
        email: req.user.email,
        subject: "Free order activated",
        title: "Your access is active",
        message: `Hi ${req.user.name || ""}, your coupon covered the full order amount and your paid access is now active.`,
        btnTitle: "View Order",
      });
    } catch (error) {
      // Email delivery must not break order creation.
    }

    if (coupon) {
      await CouponModel.updateOne({ _id: coupon._id }, { $inc: { usedCount: 1 } });
    }
  }

  res.status(200).json({
    success: true,
    data,
  });
});

//Get login user Order
const loggedInUserOrders = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find({ user: req.user.id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders,
  });
});

/*--------------Access only for --Admin ---------- */
//Get All Order  --By Admin
const getAllOrderByAdmin = asyncHandler(async (req, res) => {
  const { status, search, gateway, refundStatus, dateFrom, dateTo } = req.query;
  const query = {};

  if (status && status !== "all") {
    query.status = status;
  }

  if (gateway && gateway !== "all") {
    query["paymentInfo.method"] = gateway;
  }

  if (refundStatus && refundStatus !== "all") {
    query["refund.status"] = refundStatus === "none" ? { $in: [null, "none"] } : refundStatus;
  }

  if (dateFrom || dateTo) {
    query.createdAt = {};
    if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      query.createdAt.$lte = endDate;
    }
  }

  let orders = await OrderModel.find(query)
    .populate({
    path: "user",
    select: "name email avatar role",
    // select: "name email avatar role isVerified address paid paymentExpiresAt phone",
    })
    .sort({ createdAt: -1 });

  if (search) {
    const normalizedSearch = String(search).toLowerCase();
    orders = orders.filter((order) => {
      return (
        String(order._id).toLowerCase().includes(normalizedSearch) ||
        String(order.paymentInfo?.id || "").toLowerCase().includes(normalizedSearch) ||
        String(order.paymentInfo?.transactionUuid || "").toLowerCase().includes(normalizedSearch) ||
        String(order.coupon?.code || "").toLowerCase().includes(normalizedSearch) ||
        String(order.user?.email || "").toLowerCase().includes(normalizedSearch) ||
        String(order.user?.name || "").toLowerCase().includes(normalizedSearch) ||
        (order.orderItems || []).some((item) => String(item.title || "").toLowerCase().includes(normalizedSearch))
      );
    });
  }

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.amount;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});
//Get Single Order
const getSingleOrder = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id).populate({
    path: "user",
    select: "name",
  });

  if (!order) {
    return next(new ErrorHandler("No order Found withh this ID", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//Delete Order --By Admin
const deleteOrderByAdmin = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const order = await OrderModel.findById(id);

  if (!order) {
    res.status(404);
    return new Error("No order Found withh this ID");
  }

  await order.deleteOne();

  res.status(200).json({ message: "Order Delete Successfully." });
});

const getOrderReceipt = asyncHandler(async (req, res) => {
  const query = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, user: req.user._id };
  const order = await OrderModel.findOne(query).populate({ path: "user", select: "name email phone address" });

  if (!order) {
    return res.status(404).json({ success: false, error: "Order not found." });
  }

  res.status(200).json({
    success: true,
    receipt: {
      orderId: order._id,
      status: order.status,
      user: order.user,
      items: order.orderItems,
      subtotal: order.subtotal || order.amount,
      discountAmount: order.discountAmount || 0,
      coupon: order.coupon,
      total: order.amount,
      paymentInfo: order.paymentInfo,
      paidAt: order.paidAt,
      expiresAt: order.expiresAt,
      createdAt: order.createdAt,
      shippingInfo: order.shippingInfo,
    },
  });
});

const updateOrderStatusByAdmin = asyncHandler(async (req, res) => {
  const { status, paymentMethod = "manual", note = "" } = req.body;
  const allowedStatuses = ["unpaid", "pending", "paid", "failed", "cancelled", "refunded"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: "Invalid order status." });
  }

  const order = await OrderModel.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, error: "Order not found." });
  }

  const wasPaid = order.status === "paid";
  order.status = status;
  order.paymentInfo = {
    ...(order.paymentInfo?.toObject?.() || order.paymentInfo || {}),
    status,
    method: status === "paid" ? paymentMethod : order.paymentInfo?.method || paymentMethod,
    failureReason: note || order.paymentInfo?.failureReason,
    verifiedAt: status === "paid" ? new Date() : order.paymentInfo?.verifiedAt,
  };

  if (status === "paid" && !order.paidAt) {
    order.paidAt = new Date();
  }

  if (status === "paid") {
    await UserModel.findByIdAndUpdate(order.user, {
      paid: true,
      paymentExpiresAt: order.expiresAt,
    });
  }

  await order.save();

  if (status === "paid" && !wasPaid && order.coupon?.code) {
    await CouponModel.updateOne({ code: order.coupon.code }, { $inc: { usedCount: 1 } });
  }

  res.status(200).json({
    success: true,
    order,
  });
});

const getPurchasedAccess = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find({
    user: req.user._id,
    status: "paid",
    expiresAt: { $gte: new Date() },
  }).select("orderItems expiresAt paidAt paymentInfo amount");

  const purchases = orders.flatMap((order) =>
    (order.orderItems || []).map((item) => ({
      orderId: order._id,
      product: item.product,
      productModel: item.productModel,
      title: item.title,
      slug: item.slug,
      image: item.image,
      paidAt: order.paidAt,
      expiresAt: order.expiresAt,
      paymentMethod: order.paymentInfo?.method,
      amount: order.amount,
    })),
  );

  res.status(200).json({
    success: true,
    purchases,
  });
});

const checkProductAccess = asyncHandler(async (req, res) => {
  const productConfig = getProductModel(req.params.productType);

  if (!productConfig) {
    return res.status(400).json({ success: false, error: "Invalid product type." });
  }

  const product = await productConfig.model.findById(req.params.productId).select("accessType price visibility");

  if (!product) {
    return res.status(404).json({ success: false, error: "Product not found." });
  }

  const normalizedAccessType = String(product.accessType || "").toLowerCase();
  const requiresPayment = productConfig.name === "Subject" ? ["paid", "pro"].includes(normalizedAccessType) || Number(product.price || 0) > 0 : Number(product.price || 0) > 0;

  if (!requiresPayment) {
    return res.status(200).json({
      success: true,
      hasAccess: true,
      orderId: null,
      expiresAt: null,
      accessType: "free",
    });
  }

  const order = await OrderModel.findOne({
    user: req.user._id,
    status: "paid",
    amount: { $gt: 0 },
    expiresAt: { $gte: new Date() },
    orderItems: {
      $elemMatch: {
        product: req.params.productId,
        productModel: productConfig.name,
        price: { $gt: 0 },
      },
    },
  });

  res.status(200).json({
    success: true,
    hasAccess: Boolean(order),
    orderId: order?._id,
    expiresAt: order?.expiresAt,
  });
});

module.exports = {
  newOrder,
  loggedInUserOrders,
  getAllOrderByAdmin,
  getSingleOrder,
  deleteOrderByAdmin,
  getOrderReceipt,
  updateOrderStatusByAdmin,
  getPurchasedAccess,
  checkProductAccess,
};
