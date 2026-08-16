const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 140,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxLength: 600,
    },
    type: {
      type: String,
      enum: ["info", "success", "warning", "payment", "support", "course", "system"],
      default: "info",
    },
    link: {
      type: String,
      trim: true,
      default: "",
    },
    readAt: {
      type: Date,
      default: null,
    },
    audience: {
      type: String,
      enum: ["user", "all"],
      default: "user",
      index: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
