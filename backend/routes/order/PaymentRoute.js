const express = require("express");
const {
  initiatePayment,
  initiateStripePayment,
  handlePaymentSuccess,
  handlePaymentFailure,
  handlePaymentConfirmation,
  handleStripePaymentSuccess,
  handleStripePaymentCancel,
  handleStripeWebhook,
  handleEsewaIpn,
} = require("../../controllers/order/PaymentController");
const { protect } = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/initiate-payment", protect, initiatePayment);
router.post("/stripe/initiate-payment", protect, initiateStripePayment);
router.get("/success", handlePaymentSuccess);
router.get("/failure/:orderId?", handlePaymentFailure);
router.post("/payment-confirmation", handlePaymentConfirmation);
router.post("/esewa/ipn", handleEsewaIpn);
router.get("/stripe/success", handleStripePaymentSuccess);
router.get("/stripe/cancel/:orderId?", handleStripePaymentCancel);
router.post("/stripe/webhook", handleStripeWebhook);

module.exports = router;
