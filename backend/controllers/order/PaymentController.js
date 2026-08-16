const axios = require("axios");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const OrderModel = require("../../models/order/OrderModel");
const User = require("../../models/users/UserModel");
const CouponModel = require("../../models/order/CouponModel");
const NotificationModel = require("../../models/product/NotificationModel");
const PaymentEventModel = require("../../models/payment/PaymentEventModel");
const { sendAutomatedEmailTrs } = require("../../utils/helpers/mail");
const { generateEsewaSignature, safeCompare } = require("../../utils/helpers");

const SIGNED_REQUEST_FIELDS = "total_amount,transaction_uuid,product_code";
const COMPLETE_STATUS = "COMPLETE";

const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");

const toEsewaAmount = (value = 0) => {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount < 0) {
    return "0";
  }

  return Number(amount.toFixed(2)).toString();
};

const toEsewaWholeAmount = (value = 0) => {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount < 0) {
    return "0";
  }

  return String(Math.max(Math.round(amount), 0));
};

const parseEsewaAmount = (value = 0) => Number(String(value).replace(/,/g, ""));

const getEsewaConfig = () => {
  const isProduction = process.env.ESEWA_MODE === "production";
  const version = String(process.env.ESEWA_VERSION || "v2").toLowerCase();
  const productCode = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
  const secretKey = process.env.ESEWA_SECRET_KEY || (productCode === "EPAYTEST" ? "8gBm/:&EnhH.1/q" : "");
  const paymentUrl =
    process.env.ESEWA_PAYMENT_URL ||
    (isProduction ? "https://epay.esewa.com.np/api/epay/main/v2/form" : "https://rc-epay.esewa.com.np/api/epay/main/v2/form");
  const statusUrl =
    process.env.ESEWA_STATUS_URL ||
    (isProduction ? "https://esewa.com.np/api/epay/transaction/status/" : "https://rc.esewa.com.np/api/epay/transaction/status/");

  if (!secretKey) {
    throw new Error("Missing ESEWA_SECRET_KEY. Add your merchant secret key to the backend environment.");
  }

  return {
    version: version === "v1" ? "v2" : version,
    productCode,
    secretKey,
    paymentUrl,
    statusUrl,
  };
};

const getStripeConfig = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY || "";
  const currency = (process.env.STRIPE_CURRENCY || "usd").toLowerCase();
  const amountMultiplier = Number(process.env.STRIPE_AMOUNT_MULTIPLIER || 100);

  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY. Add your Stripe secret key to the backend environment.");
  }

  return {
    secretKey,
    currency,
    amountMultiplier: Number.isFinite(amountMultiplier) && amountMultiplier > 0 ? amountMultiplier : 100,
  };
};

const getBackendBaseUrl = () => {
  return trimTrailingSlash(process.env.BACKEND_URL || process.env.API_URL || `http://localhost:${process.env.PORT || 5001}`);
};

const getFrontendBaseUrl = () => {
  return trimTrailingSlash(process.env.FRONTEND_URL || process.env.FORNTEND_URL || "http://localhost:5173");
};

const getEsewaSuccessUrl = () => {
  return trimTrailingSlash(process.env.ESEWA_SUCCESS_URL || `${getBackendBaseUrl()}/api/v1/payment/success`);
};

const getEsewaFailureUrl = (orderId) => {
  if (process.env.ESEWA_FAILURE_URL) {
    const failureUrl = new URL(process.env.ESEWA_FAILURE_URL);
    failureUrl.searchParams.set("orderId", String(orderId));
    return failureUrl.toString();
  }

  return `${getBackendBaseUrl()}/api/v1/payment/failure/${orderId}`;
};

const buildSignatureMessage = (data, signedFieldNames = SIGNED_REQUEST_FIELDS) => {
  return signedFieldNames
    .split(",")
    .map((fieldName) => `${fieldName}=${data[fieldName]}`)
    .join(",");
};

const createPaymentSignature = (data, secretKey, signedFieldNames = SIGNED_REQUEST_FIELDS) => {
  return generateEsewaSignature(buildSignatureMessage(data, signedFieldNames), secretKey);
};

const verifyEsewaSignature = (data, secretKey) => {
  if (!data?.signature || !data?.signed_field_names) {
    return false;
  }

  const expectedSignature = createPaymentSignature(data, secretKey, data.signed_field_names);

  return safeCompare(expectedSignature, data.signature);
};

const verifyStripeWebhookSignature = (rawBody, signatureHeader) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  if (!webhookSecret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET.");
  }

  const parts = Object.fromEntries(
    String(signatureHeader || "")
      .split(",")
      .map((part) => part.split("="))
      .filter(([key, value]) => key && value),
  );
  const timestamp = parts.t;
  const signature = parts.v1;

  if (!timestamp || !signature) {
    throw new Error("Invalid Stripe signature header.");
  }

  const ageSeconds = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp));

  if (ageSeconds > 300) {
    throw new Error("Stripe webhook signature is too old.");
  }

  const payload = Buffer.isBuffer(rawBody) ? rawBody.toString("utf8") : JSON.stringify(rawBody);
  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(signedPayload).digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    throw new Error("Invalid Stripe webhook signature.");
  }

  return JSON.parse(payload);
};

const decodeEsewaResponseData = (encodedData) => {
  if (!encodedData) {
    throw new Error("Missing eSewa response data.");
  }

  const normalizedData = String(encodedData).replace(/ /g, "+").replace(/-/g, "+").replace(/_/g, "/");
  const paddedData = normalizedData.padEnd(normalizedData.length + ((4 - (normalizedData.length % 4)) % 4), "=");
  const decodedData = Buffer.from(paddedData, "base64").toString("utf8");

  return JSON.parse(decodedData);
};

const getPaymentRedirectUrl = (status, query = {}) => {
  const redirectUrl = new URL(`/payment/${status}`, getFrontendBaseUrl());

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      redirectUrl.searchParams.set(key, String(value));
    }
  });

  return redirectUrl.toString();
};

const getInvoiceUrl = (orderId) => `${getBackendBaseUrl()}/api/v1/business/invoice/${orderId}`;
const getInvoiceVerifyUrl = (orderId) => `${getBackendBaseUrl()}/api/v1/business/invoice/verify/${orderId}`;

const writePaymentEvent = async ({ provider, eventId, type, order = null, status = "received", message = "", payload = {} }) => {
  try {
    await PaymentEventModel.create({
      provider,
      eventId: eventId || `${provider}-${type}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
      type,
      order: order?._id || order || null,
      status,
      message,
      payload,
    });

    if (status === "failed") {
      await NotificationModel.create({
        audience: "all",
        type: "warning",
        title: `${String(provider).toUpperCase()} payment alert`,
        message: message || `${provider} payment event failed verification.`,
        link: "/dashboard/orders",
      });
    }
  } catch (error) {
    // Payment audit logging must never break checkout/verification flows.
  }
};

const redirectOrJson = (req, res, status, statusCode, payload) => {
  const wantsJson = req.headers.accept?.includes("application/json") || req.xhr;

  if (wantsJson) {
    return res.status(statusCode).json(payload);
  }

  return res.redirect(getPaymentRedirectUrl(status, payload));
};

const verifyEsewaTransactionStatus = async ({ statusUrl, productCode, totalAmount, transactionUuid }) => {
  const response = await axios.get(statusUrl, {
    params: {
      product_code: productCode,
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
    },
  });

  return response.data;
};

const verifyLegacyEsewaTransactionStatus = async ({ statusUrl, productCode, totalAmount, transactionUuid, referenceId }) => {
  const response = await axios.get(statusUrl, {
    params: {
      amt: totalAmount,
      rid: referenceId,
      pid: transactionUuid,
      scd: productCode,
    },
  });

  const responseText = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
  const isComplete = /<response_code>\s*success\s*<\/response_code>/i.test(responseText) || /success/i.test(responseText);

  return {
    raw: response.data,
    status: isComplete ? COMPLETE_STATUS : "FAILED",
    ref_id: referenceId,
  };
};

const markOrderAsPaid = async ({ order, method = "esewa", responseData, statusData }) => {
  if (order.status === "paid") {
    return order;
  }

  const paidAt = new Date();
  const expirationDate = new Date(paidAt);
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  const paymentId = method === "stripe" ? responseData.id || responseData.payment_intent : responseData.transaction_code || statusData?.ref_id;
  const totalAmount = method === "stripe" ? Number(responseData.amount_total || 0) / Number(process.env.STRIPE_AMOUNT_MULTIPLIER || 100) : parseEsewaAmount(responseData.total_amount);
  const transactionUuid = method === "stripe" ? responseData.id : responseData.transaction_uuid;
  const productCode = method === "stripe" ? responseData.client_reference_id : responseData.product_code;

  order.paymentInfo = {
    ...(order.paymentInfo?.toObject?.() || order.paymentInfo || {}),
    id: paymentId,
    status: "paid",
    method,
    transactionUuid,
    productCode,
    totalAmount,
    verifiedAt: paidAt,
    responseData: {
      redirect: responseData,
      status: statusData,
    },
  };
  order.status = "paid";
  order.paidAt = paidAt;
  order.expiresAt = expirationDate;

  await order.save();

  if (order.coupon?.code) {
    await CouponModel.updateOne({ code: order.coupon.code }, { $inc: { usedCount: 1 } });
  }

  const user = await User.findById(order.user);

  if (user) {
    user.paid = true;
    user.paymentExpiresAt = expirationDate;
    await user.save();

    await NotificationModel.create({
      user: user._id,
      type: "payment",
      title: "Payment successful",
      message: `Your ${method} payment was verified and your access is active until ${expirationDate.toDateString()}.`,
      link: "/account?tab=orders",
    });

    try {
      const invoiceUrl = getInvoiceUrl(order._id);
      const invoiceVerifyUrl = getInvoiceVerifyUrl(order._id);
      await sendAutomatedEmailTrs({
        email: user.email,
        subject: "Payment successful - invoice ready",
        title: "Payment verified — invoice ready",
        message: `Hi ${user.name || ""}, your ${method.toUpperCase()} payment was verified successfully. Your access is active until ${expirationDate.toDateString()}. You can open your private invoice here: ${invoiceUrl}. For public proof, use this verification link: ${invoiceVerifyUrl}`,
        btnTitle: "Open Invoice",
        link: invoiceUrl,
      });
    } catch (error) {
      // Email delivery must not break payment verification.
    }
  }

  return order;
};

const failOrderPayment = async (order, failureReason) => {
  if (!order || order.status === "paid") {
    return;
  }

  order.status = "failed";
  order.paymentInfo = {
    ...(order.paymentInfo?.toObject?.() || order.paymentInfo || {}),
    status: "failed",
    method: order.paymentInfo?.method || "esewa",
    failedAt: new Date(),
    failureReason,
  };

  await order.save();
  await writePaymentEvent({
    provider: order.paymentInfo?.method === "stripe" ? "stripe" : "esewa",
    type: "payment.failed",
    order,
    status: "failed",
    message: failureReason,
    payload: { orderId: order._id, paymentInfo: order.paymentInfo },
  });
};

const getPayableOrder = async ({ userId, orderId }) => {
  const query = orderId ? { _id: orderId, user: userId } : { user: userId, status: { $in: ["unpaid", "pending", "failed"] } };
  const order = await OrderModel.findOne(query).sort({ createdAt: -1 });

  if (!order) {
    return null;
  }

  if (order.status === "paid") {
    const error = new Error("This order has already been paid.");
    error.statusCode = 400;
    throw error;
  }

  return order;
};

const initiatePayment = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;

  if (!userId) {
    return res.status(400).json({ success: false, error: "User ID not found." });
  }

  const order = await getPayableOrder({ userId, orderId: req.body?.orderId });

  if (!order) {
    return res.status(404).json({ success: false, error: "No unpaid order found for this user." });
  }

  const { version, productCode, secretKey, paymentUrl } = getEsewaConfig();
  const taxAmount = toEsewaWholeAmount(order.taxPrice || 0);
  const serviceCharge = toEsewaWholeAmount(order.serviceCharge || 0);
  const deliveryCharge = toEsewaWholeAmount(order.deliveryCharge || 0);
  const amount = toEsewaWholeAmount(order.amount);
  const totalAmount = toEsewaWholeAmount(parseEsewaAmount(amount) + parseEsewaAmount(taxAmount) + parseEsewaAmount(serviceCharge) + parseEsewaAmount(deliveryCharge));
  const transactionUuid = `${order._id}-${Date.now()}`;

  if (parseEsewaAmount(totalAmount) < 1) {
    return res.status(400).json({ success: false, error: "eSewa payment amount must be at least Rs. 1." });
  }

  const formData = {
    amount,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    transaction_uuid: transactionUuid,
    product_code: productCode,
    product_service_charge: serviceCharge,
    product_delivery_charge: deliveryCharge,
    success_url: getEsewaSuccessUrl(),
    failure_url: getEsewaFailureUrl(order._id),
    signed_field_names: SIGNED_REQUEST_FIELDS,
  };

  formData.signature = createPaymentSignature(formData, secretKey);

  order.status = "pending";
  order.paymentInfo = {
    ...(order.paymentInfo?.toObject?.() || order.paymentInfo || {}),
    status: "pending",
    method: "esewa",
    version,
    transactionUuid,
    productCode,
    totalAmount: parseEsewaAmount(totalAmount),
    initiatedAt: new Date(),
  };

  await order.save();

  return res.status(200).json({
    success: true,
    gateway: "esewa",
    version,
    paymentUrl,
    formData,
    debug:
      process.env.NODE_ENV !== "production"
        ? {
            signatureMessage: buildSignatureMessage(formData),
            callbackHost: new URL(formData.success_url).host,
          }
        : undefined,
    order,
  });
});

const appendStripeLineItems = (params, order, { currency, amountMultiplier }) => {
  const payableAmount = Math.max(Number(order.amount || 0), 0);
  const subtotal = Number(order.subtotal || 0);
  const discountAmount = Number(order.discountAmount || 0);
  const itemCount = Array.isArray(order.orderItems) ? order.orderItems.reduce((total, item) => total + (Number.parseInt(item.quantity, 10) || 1), 0) : 1;
  const unitAmount = Math.max(Math.round(payableAmount * amountMultiplier), 1);
  const productName = discountAmount > 0 ? `Order ${order._id} - discount applied` : `Order ${order._id}`;
  const description = discountAmount > 0 ? `Subtotal: ${subtotal}; Discount: ${discountAmount}; Items: ${itemCount}` : `Items: ${itemCount}`;

  params.append("line_items[0][price_data][currency]", currency);
  params.append("line_items[0][price_data][unit_amount]", String(unitAmount));
  params.append("line_items[0][price_data][product_data][name]", productName.slice(0, 250));
  params.append("line_items[0][price_data][product_data][description]", description.slice(0, 500));
  params.append("line_items[0][quantity]", "1");
};

const getStripeExpectedAmountTotal = (order, amountMultiplier) => {
  return Math.max(Math.round(Number(order.amount || 0) * amountMultiplier), 1);
};

const initiateStripePayment = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;

  if (!userId) {
    return res.status(400).json({ success: false, error: "User ID not found." });
  }

  const order = await getPayableOrder({ userId, orderId: req.body?.orderId });

  if (!order) {
    return res.status(404).json({ success: false, error: "No unpaid order found for this user." });
  }

  const stripeConfig = getStripeConfig();
  const params = new URLSearchParams();

  params.append("mode", "payment");
  params.append("client_reference_id", String(order._id));
  params.append("success_url", `${getBackendBaseUrl()}/api/v1/payment/stripe/success?session_id={CHECKOUT_SESSION_ID}`);
  params.append("cancel_url", `${getBackendBaseUrl()}/api/v1/payment/stripe/cancel/${order._id}`);
  params.append("metadata[orderId]", String(order._id));
  params.append("metadata[userId]", String(order.user));
  params.append("metadata[subtotal]", String(order.subtotal || 0));
  params.append("metadata[discountAmount]", String(order.discountAmount || 0));
  params.append("metadata[couponCode]", String(order.coupon?.code || ""));
  appendStripeLineItems(params, order, stripeConfig);

  const response = await axios.post("https://api.stripe.com/v1/checkout/sessions", params, {
    headers: {
      Authorization: `Bearer ${stripeConfig.secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const session = response.data;

  order.status = "pending";
  order.paymentInfo = {
    ...(order.paymentInfo?.toObject?.() || order.paymentInfo || {}),
    id: session.id,
    status: "pending",
    method: "stripe",
    transactionUuid: session.id,
    productCode: String(order._id),
    totalAmount: Number(order.amount || 0),
    initiatedAt: new Date(),
    responseData: {
      checkoutSession: session,
    },
  };

  await order.save();

  return res.status(200).json({
    success: true,
    gateway: "stripe",
    paymentUrl: session.url,
    sessionId: session.id,
    order,
  });
});

const handlePaymentSuccess = asyncHandler(async (req, res) => {
  const { version, productCode, secretKey, statusUrl } = getEsewaConfig();

  let responseData;

  if (req.query.data) {
    try {
      responseData = decodeEsewaResponseData(req.query.data);
    } catch (error) {
      await writePaymentEvent({
        provider: "esewa",
        type: "esewa.response.decode_failed",
        status: "failed",
        message: error.message,
        payload: { query: req.query },
      });
      return redirectOrJson(req, res, "failure", 400, {
        error: "Invalid payment response.",
      });
    }
  } else if (req.query.oid && req.query.amt && req.query.refId) {
    responseData = {
      status: COMPLETE_STATUS,
      signature: "",
      transaction_code: req.query.refId,
      total_amount: req.query.amt,
      transaction_uuid: req.query.oid,
      product_code: productCode,
      signed_field_names: "",
    };
  } else {
    return redirectOrJson(req, res, "failure", 400, {
      error: "Missing eSewa payment response.",
    });
  }

  const order = await OrderModel.findOne({ "paymentInfo.transactionUuid": responseData.transaction_uuid });

  if (!order) {
    await writePaymentEvent({
      provider: "esewa",
      eventId: responseData.transaction_uuid ? `esewa-missing-order-${responseData.transaction_uuid}` : undefined,
      type: "esewa.order_not_found",
      status: "failed",
      message: "Payment order not found.",
      payload: responseData,
    });
    return redirectOrJson(req, res, "failure", 404, {
      error: "Payment order not found.",
      transactionUuid: responseData.transaction_uuid,
    });
  }

  if (order.status === "paid") {
    return redirectOrJson(req, res, "success", 200, {
      orderId: order._id,
      transactionCode: order.paymentInfo?.id,
    });
  }

  const isLegacyResponse = !req.query.data;

  if (!isLegacyResponse && !verifyEsewaSignature(responseData, secretKey)) {
    await failOrderPayment(order, "Invalid eSewa response signature.");
    return redirectOrJson(req, res, "failure", 400, {
      error: "Invalid payment signature.",
      orderId: order._id,
    });
  }

  const expectedAmount = Number(order.paymentInfo?.totalAmount || order.amount);
  const receivedAmount = parseEsewaAmount(responseData.total_amount);

  if (
    responseData.product_code !== productCode ||
    responseData.status !== COMPLETE_STATUS ||
    responseData.transaction_uuid !== order.paymentInfo?.transactionUuid ||
    Math.abs(expectedAmount - receivedAmount) > 0.01
  ) {
    await failOrderPayment(order, "Payment response did not match the order.");
    return redirectOrJson(req, res, "failure", 400, {
      error: "Payment response did not match the order.",
      orderId: order._id,
    });
  }

  let statusData;

  try {
    statusData = isLegacyResponse || order.paymentInfo?.version === "v1" || version === "v1"
      ? await verifyLegacyEsewaTransactionStatus({
          statusUrl,
          productCode,
          totalAmount: toEsewaAmount(receivedAmount),
          transactionUuid: responseData.transaction_uuid,
          referenceId: responseData.transaction_code,
        })
      : await verifyEsewaTransactionStatus({
          statusUrl,
          productCode,
          totalAmount: toEsewaAmount(receivedAmount),
          transactionUuid: responseData.transaction_uuid,
        });
  } catch (error) {
    await writePaymentEvent({
      provider: "esewa",
      type: "esewa.status_check_failed",
      order,
      status: "failed",
      message: error.message || "Unable to verify payment status with eSewa.",
      payload: { responseData },
    });
    return redirectOrJson(req, res, "failure", 502, {
      error: "Unable to verify payment status with eSewa.",
      orderId: order._id,
    });
  }

  if (statusData?.status !== COMPLETE_STATUS) {
    await failOrderPayment(order, `eSewa status check returned ${statusData?.status || "unknown"}.`);
    return redirectOrJson(req, res, "failure", 400, {
      error: "Payment was not completed.",
      orderId: order._id,
      status: statusData?.status,
    });
  }

  const paidOrder = await markOrderAsPaid({ order, method: "esewa", responseData, statusData });

  return redirectOrJson(req, res, "success", 200, {
    orderId: paidOrder._id,
    transactionCode: paidOrder.paymentInfo?.id,
  });
});

const handleStripePaymentSuccess = asyncHandler(async (req, res) => {
  const sessionId = req.query.session_id;

  if (!sessionId) {
    return redirectOrJson(req, res, "failure", 400, {
      error: "Missing Stripe Checkout session.",
    });
  }

  const stripeConfig = getStripeConfig();
  const response = await axios.get(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: {
      Authorization: `Bearer ${stripeConfig.secretKey}`,
    },
  });
  const session = response.data;
  const order = await OrderModel.findById(session.client_reference_id || session.metadata?.orderId);

  if (!order) {
    return redirectOrJson(req, res, "failure", 404, {
      error: "Payment order not found.",
      sessionId,
    });
  }

  const expectedAmount = getStripeExpectedAmountTotal(order, stripeConfig.amountMultiplier);

  if (session.payment_status !== "paid" || String(session.client_reference_id) !== String(order._id) || Number(session.amount_total || 0) !== expectedAmount) {
    await failOrderPayment(order, "Stripe payment response did not match the order.");
    return redirectOrJson(req, res, "failure", 400, {
      error: "Stripe payment could not be verified.",
      orderId: order._id,
      sessionId,
    });
  }

  const paidOrder = await markOrderAsPaid({ order, method: "stripe", responseData: session, statusData: { status: session.payment_status } });

  return redirectOrJson(req, res, "success", 200, {
    orderId: paidOrder._id,
    transactionCode: paidOrder.paymentInfo?.id,
    gateway: "stripe",
  });
});

const handleStripePaymentCancel = asyncHandler(async (req, res) => {
  const order = req.params.orderId ? await OrderModel.findById(req.params.orderId) : null;

  await failOrderPayment(order, "Payment was cancelled in Stripe Checkout.");

  return redirectOrJson(req, res, "failure", 400, {
    error: "Stripe payment was cancelled.",
    orderId: order?._id,
    gateway: "stripe",
  });
});

const handleStripeWebhook = asyncHandler(async (req, res) => {
  let event;

  try {
    event = verifyStripeWebhookSignature(req.body, req.headers["stripe-signature"]);
  } catch (error) {
    await writePaymentEvent({
      provider: "stripe",
      type: "stripe.webhook.signature_failed",
      status: "failed",
      message: error.message,
      payload: {
        signature: req.headers["stripe-signature"] ? "present" : "missing",
        receivedAt: new Date(),
      },
    });
    return res.status(400).json({ success: false, error: error.message });
  }

  const existingEvent = await PaymentEventModel.findOne({ provider: "stripe", eventId: event.id });

  if (existingEvent) {
    return res.status(200).json({ success: true, duplicate: true });
  }

  const session = event.data?.object || {};
  const orderId = session.client_reference_id || session.metadata?.orderId;
  let order = orderId ? await OrderModel.findById(orderId) : null;

  await PaymentEventModel.create({
    provider: "stripe",
    eventId: event.id,
    type: event.type,
    order: order?._id || null,
    status: "received",
    message: "Stripe webhook received.",
    payload: event,
  });

  if (event.type === "checkout.session.completed" && order) {
    const stripeConfig = getStripeConfig();
    const expectedAmount = getStripeExpectedAmountTotal(order, stripeConfig.amountMultiplier);

    if (session.payment_status === "paid" && Number(session.amount_total || 0) === expectedAmount) {
      await markOrderAsPaid({ order, method: "stripe", responseData: session, statusData: { status: session.payment_status, source: "webhook" } });
      await PaymentEventModel.updateOne({ provider: "stripe", eventId: event.id }, { status: "processed", message: "Stripe checkout session verified and order marked paid." });
    } else {
      await PaymentEventModel.updateOne({ provider: "stripe", eventId: event.id }, { status: "failed", message: "Stripe checkout session amount/status did not match the order." });
    }
  }

  if (["checkout.session.expired", "payment_intent.payment_failed"].includes(event.type) && order) {
    await failOrderPayment(order, `Stripe webhook received ${event.type}.`);
    await PaymentEventModel.updateOne({ provider: "stripe", eventId: event.id }, { status: "failed", message: `Stripe webhook received ${event.type}.` });
  }

  res.status(200).json({ success: true, received: true });
});

const handleEsewaIpn = asyncHandler(async (req, res) => {
  req.query.data = req.query.data || req.body?.data;

  if (!req.query.data) {
    return res.status(400).json({ success: false, error: "Missing eSewa confirmation data." });
  }

  return handlePaymentSuccess(req, res);
});

const handlePaymentFailure = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId || req.query.orderId;
  const order = orderId ? await OrderModel.findById(orderId) : null;

  await failOrderPayment(order, "Payment was cancelled or failed in eSewa.");

  return redirectOrJson(req, res, "failure", 400, {
    error: "Payment was cancelled or failed.",
    orderId: order?._id,
  });
});

const handlePaymentConfirmation = asyncHandler(async (req, res) => {
  req.query.data = req.query.data || req.body?.data;

  if (req.query.data) {
    return handlePaymentSuccess(req, res);
  }

  return res.status(400).json({
    success: false,
    error: "Missing eSewa confirmation data.",
  });
});

module.exports = {
  initiatePayment,
  initiateStripePayment,
  handlePaymentSuccess,
  handlePaymentFailure,
  handlePaymentConfirmation,
  handleStripePaymentSuccess,
  handleStripePaymentCancel,
  handleStripeWebhook,
  handleEsewaIpn,
};
