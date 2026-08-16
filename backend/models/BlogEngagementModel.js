const mongoose = require("mongoose");

const blogEngagementSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    eventType: {
      type: String,
      enum: ["helpful", "share", "report", "read"],
      required: true,
      index: true,
    },
    value: {
      type: String,
      trim: true,
      default: "",
    },
    platform: {
      type: String,
      trim: true,
      default: "",
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ["new", "reviewing", "fixed", "ignored"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true },
);

blogEngagementSchema.index({ blog: 1, user: 1, eventType: 1 });

module.exports = mongoose.models.BlogEngagement || mongoose.model("BlogEngagement", blogEngagementSchema);
