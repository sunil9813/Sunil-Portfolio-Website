const mongoose = require("mongoose");

const projectDownloadLogSchema = mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    resourceType: {
      type: String,
      enum: ["url", "file", "unknown"],
      default: "unknown",
    },
    resourceLabel: {
      type: String,
      trim: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.models.ProjectDownloadLog || mongoose.model("ProjectDownloadLog", projectDownloadLogSchema);
