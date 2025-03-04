const mongoose = require("mongoose");

const projectSchema = mongoose.Schema(
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
    layout: { type: String, require: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    numOfViews: {
      type: Number,
      default: 0,
    },
    assets: {
      type: Object,
      default: {},
    },
    features: [
      {
        title: {
          type: String,
          required: true,
        },
      },
    ],
    tags: [
      {
        name: {
          type: String,
          required: true,
        },
      },
    ],
    format: [
      {
        name: {
          type: String,
          required: true,
        },
        icon: {
          type: String,
          required: true,
        },
      },
    ],
    ratings: {
      type: Number,
      default: 0,
    },
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
    price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Project", projectSchema);
