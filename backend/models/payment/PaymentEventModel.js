const mongoose = require("mongoose");

const paymentEventSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["stripe", "esewa"],
      required: true,
      index: true,
    },
    eventId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      default: "",
      index: true,
    },
    status: {
      type: String,
      enum: ["received", "processed", "failed", "warning"],
      default: "received",
      index: true,
    },
    message: {
      type: String,
      default: "",
      trim: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
      index: true,
    },
    processedAt: {
      type: Date,
      default: Date.now,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

paymentEventSchema.index({ provider: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.models.PaymentEvent || mongoose.model("PaymentEvent", paymentEventSchema);
