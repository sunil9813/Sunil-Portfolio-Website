const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "productModel",
      index: true,
    },
    productModel: {
      type: String,
      enum: ["Subject", "Project"],
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1200,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true },
);

reviewSchema.index({ user: 1, product: 1, productModel: 1 }, { unique: true });

module.exports = mongoose.models.ProductReview || mongoose.model("ProductReview", reviewSchema);
