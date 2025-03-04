const mongoose = require("mongoose");

const postsSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, require: true },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: { type: String, require: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    numOfViews: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        tag: {
          type: String,
          maxLength: 250,
          unique: false,
        },
      },
    ],
    features: [
      {
        feature: {
          type: String,
          maxLength: 250,
          unique: false,
        },
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
    layout: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    totalLikes: {
      type: Number,
      default: 0,
    },
    assets: {
      type: Array,
    },
    // assets: {
    //   type: Object,
    //   default: {},
    // },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Posts", postsSchema);
