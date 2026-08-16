const assert = require("node:assert/strict");
const test = require("node:test");

const businessRoute = require("../routes/product/BusinessRoute");
const paymentRoute = require("../routes/order/PaymentRoute");
const PaymentEventModel = require("../models/payment/PaymentEventModel");
const OrderModel = require("../models/order/OrderModel");
const QRCode = require("qrcode");

const routeExists = (router, method, path) =>
  router.stack.some((layer) => {
    const route = layer.route;
    return route?.path === path && Boolean(route.methods?.[method]);
  });

test("business invoice, preview, export, and verification routes are registered", () => {
  assert.equal(routeExists(businessRoute, "get", "/invoice/:orderId"), true);
  assert.equal(routeExists(businessRoute, "get", "/invoice/verify/:orderId"), true);
  assert.equal(routeExists(businessRoute, "post", "/invoice/:orderId/resend"), true);
  assert.equal(routeExists(businessRoute, "get", "/admin/payment-events"), true);
  assert.equal(routeExists(businessRoute, "get", "/admin/export/payment-events.csv"), true);
  assert.equal(routeExists(businessRoute, "get", "/admin/email-preview/:template"), true);
});

test("payment gateway routes are registered", () => {
  assert.equal(routeExists(paymentRoute, "post", "/stripe/initiate-payment"), true);
  assert.equal(routeExists(paymentRoute, "post", "/stripe/webhook"), true);
  assert.equal(routeExists(paymentRoute, "get", "/stripe/success"), true);
  assert.equal(routeExists(paymentRoute, "post", "/esewa/ipn"), true);
  assert.equal(routeExists(paymentRoute, "get", "/success"), true);
  assert.equal(routeExists(paymentRoute, "get", "/failure/:orderId?"), true);
});

test("payment audit model keeps provider, status, message, and idempotency fields", () => {
  const paths = PaymentEventModel.schema.paths;
  assert.ok(paths.provider);
  assert.ok(paths.eventId);
  assert.ok(paths.type);
  assert.ok(paths.status);
  assert.ok(paths.message);
  assert.deepEqual(paths.status.enumValues, ["received", "processed", "failed", "warning"]);
});

test("order model keeps invoice tracking and void/refund status support", () => {
  const paths = OrderModel.schema.paths;
  assert.ok(paths["paymentInfo.invoiceOpenedAt"]);
  assert.ok(paths["paymentInfo.invoiceDownloadedAt"]);
  assert.ok(paths["paymentInfo.invoiceEmailSentAt"]);
  assert.ok(paths["paymentInfo.invoiceEmailSentCount"]);
  assert.ok(paths.status.enumValues.includes("cancelled"));
  assert.ok(paths.status.enumValues.includes("refunded"));
});

test("local QR generator can create an invoice verification data URL", async () => {
  const dataUrl = await QRCode.toDataURL("https://gorkcoder.com/invoice/verify/test");
  assert.equal(dataUrl.startsWith("data:image/png;base64,"), true);
});
