const OrderModel = require("../../models/order/OrderModel");
const asyncHandler = require("express-async-handler");
const PriceLimitConfigModel = require("../../models/order/PriceLimitConfigModel");

/* const newOrder = asyncHandler(async (req, res) => {
  const priceConfig = await PriceLimitConfigModel.findOne({});
  const price = priceConfig ? priceConfig.priceLimit : null;

  if (price === null) {
    return res.status(400).json({
      success: false,
      error: "Price configuration not found. Cannot create the order.",
    });
  }

  const { shippingInfo, paymentInfo } = req.body;

  const paidAt = Date.now();
  const expirationDate = new Date(paidAt);
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  const data = await OrderModel.create({
    shippingInfo,
    amount: price,
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
  const priceConfig = await PriceLimitConfigModel.findOne({});
  const price = priceConfig ? priceConfig.priceLimit : null;

  if (price === null) {
    return res.status(400).json({
      success: false,
      error: "Price configuration not found. Cannot create the order.",
    });
  }

  const { shippingInfo, paymentInfo } = req.body;

  const paidAt = Date.now();
  const expirationDate = new Date(paidAt);
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  // Check if the user already has an active (unpaid) order
  const existingOrder = await OrderModel.findOne({
    user: req.user._id,
    status: "unpaid",
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

  // Create the new order
  const data = await OrderModel.create({
    shippingInfo,
    amount: price,
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

//Get login user Order
const loggedInUserOrders = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders,
  });
});

/*--------------Access only for --Admin ---------- */
//Get All Order  --By Admin
const getAllOrderByAdmin = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find().populate({
    path: "user",
    select: "name email avatar role",
    // select: "name email avatar role isVerified address paid paymentExpiresAt phone",
  });

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

module.exports = {
  newOrder,
  loggedInUserOrders,
  getAllOrderByAdmin,
  getSingleOrder,
  deleteOrderByAdmin,
};
