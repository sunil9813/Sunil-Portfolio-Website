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
module.exports = mongoose.model("Project", projectSchema);
