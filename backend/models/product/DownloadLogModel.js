const mongoose = require("mongoose");

const downloadLogSchema = new mongoose.Schema(
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
    title: {
      type: String,
      trim: true,
      default: "",
    },
    fileUrl: {
      type: String,
      trim: true,
      default: "",
    },
    ip: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.models.DownloadLog || mongoose.model("DownloadLog", downloadLogSchema);
