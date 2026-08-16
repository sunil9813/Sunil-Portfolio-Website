const mongoose = require("mongoose");

const projectSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupId: { type: String },
    title: { type: String, required: true, trim: true, maxLength: 250 },
    slug: { type: String, unique: true },
    description: { type: String, require: true },
    metaDescription: { type: String, required: true, trim: true, maxLength: 160 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downloadCount: { type: Number, default: 0 },
    numOfViews: { type: Number, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    layout: { type: String, require: true },
    urllink: { type: String },
    demoStatus: {
      status: { type: String, enum: ["unknown", "online", "broken", "timeout"], default: "unknown" },
      statusCode: { type: Number },
      message: { type: String, trim: true },
      checkedAt: { type: Date },
    },
    visibility: { type: String, enum: ["public", "private", "scheduled"], default: "private" },
    scheduledPublish: {
      type: Date,
      required: function () {
        return this.visibility === "scheduled";
      },
    },
    featured: { type: Boolean, default: false },
    tags: [{ tag: { type: String, maxLength: 500, trim: true } }],
    // code that are use here
    formats: [{ format: { type: String, trim: true } }],
    highlights: [{ highlight: { type: String, trim: true } }],

    version: { type: String, trim: true, default: "v1.0" },
    supportEmail: { type: String, trim: true, lowercase: true },
    previewVideoUrl: { type: String, trim: true },
    maxDownloadsPerUser: { type: Number, default: 20, min: 1 },
    downloadAccessRevokedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    seoTitle: { type: String, trim: true, maxLength: 70 },
    seoDescription: { type: String, trim: true, maxLength: 170 },
    canonicalUrl: { type: String, trim: true },
    ogImage: { type: String, trim: true },
    license: {
      type: String,
      trim: true,
      default: "Use this project for learning, portfolio practice, and personal/client implementation. Do not resell, redistribute, or repackage the original files as your own template.",
    },
    refundPolicy: {
      type: String,
      trim: true,
      default: "Refund requests are reviewed when files are inaccessible, incorrect, duplicated, or the delivered project is not as described.",
    },
    notifyBuyersOnUpdate: { type: Boolean, default: false },
    includedFiles: [
      {
        title: { type: String, trim: true },
        text: { type: String, trim: true },
      },
    ],
    demoCredentials: {
      adminEmail: { type: String, trim: true },
      adminPassword: { type: String, trim: true },
      userEmail: { type: String, trim: true },
      userPassword: { type: String, trim: true },
    },
    showDemoCredentials: { type: Boolean, default: false },
    changelog: [
      {
        version: { type: String, trim: true },
        title: { type: String, trim: true },
        text: { type: String, trim: true },
        date: { type: Date },
      },
    ],

    price: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    discountDate: { type: Date, default: null },
    discountShow: { type: Boolean, default: false },

    assets: { type: Object, default: {} },
    thumbnail: { type: Object },
    resourceFile: {
      type: {
        type: String,
        enum: ["url", "file", null],
        default: null,
      },
      url: {
        type: String,
        trim: true,
        match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, "Please provide a valid URL"],
        required: function () {
          return this.resourceFile?.type === "url";
        },
      },
      file: {
        type: Object,
        required: function () {
          return this.resourceFile?.type === "file";
        },
      },
    },

    ratings: { type: Number, default: 0 },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.models.Project || mongoose.model("Project", projectSchema);
