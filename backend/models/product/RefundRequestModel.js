const mongoose = require("mongoose");

const refundRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1200,
    },
    category: {
      type: String,
      enum: ["duplicate", "wrong_purchase", "technical_issue", "not_as_expected", "other"],
      default: "other",
    },
    refundMethod: {
      type: String,
      enum: ["original_payment", "bank_transfer", "esewa", "other"],
      default: "original_payment",
    },
    refundContact: {
      type: String,
      trim: true,
      default: "",
      maxLength: 250,
    },
    status: {
      type: String,
      enum: ["requested", "approved", "rejected", "refunded"],
      default: "requested",
      index: true,
    },
    adminNote: {
      type: String,
      trim: true,
      default: "",
      maxLength: 1200,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

refundRequestSchema.index({ user: 1, order: 1 }, { unique: true });

module.exports = mongoose.models.RefundRequest || mongoose.model("RefundRequest", refundRequestSchema);
