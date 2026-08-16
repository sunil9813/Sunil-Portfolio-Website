const mongoose = require("mongoose");

const projectLicenseSchema = mongoose.Schema(
  {
    licenseId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
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
    status: {
      type: String,
      enum: ["active", "revoked"],
      default: "active",
    },
    usageTerms: {
      type: String,
      trim: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    revokedReason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

projectLicenseSchema.index({ project: 1, user: 1, order: 1 }, { unique: true });

module.exports = mongoose.models.ProjectLicense || mongoose.model("ProjectLicense", projectLicenseSchema);
