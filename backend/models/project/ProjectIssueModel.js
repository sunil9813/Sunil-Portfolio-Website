const mongoose = require("mongoose");

const projectIssueSchema = mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    issueType: {
      type: String,
      enum: ["broken-link", "wrong-files", "payment-access", "other"],
      default: "other",
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxLength: 2000,
    },
    pageUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "dismissed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.models.ProjectIssue || mongoose.model("ProjectIssue", projectIssueSchema);
