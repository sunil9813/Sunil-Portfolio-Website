const mongoose = require("mongoose");

const productQuestionSchema = new mongoose.Schema(
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
    question: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1200,
    },
    answer: {
      type: String,
      trim: true,
      default: "",
      maxLength: 2000,
    },
    answeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    answeredAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "answered", "hidden"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.models.ProductQuestion || mongoose.model("ProductQuestion", productQuestionSchema);
