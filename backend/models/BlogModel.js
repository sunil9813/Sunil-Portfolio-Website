const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    groupId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true, // Removes unnecessary whitespace
      maxLength: 250, // Limits the title length
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      required: true,
      trim: true,
      maxLength: 160, // Recommended length for SEO
    },
    seo: {
      title: {
        type: String,
        trim: true,
        maxLength: 250,
        default: "",
      },
      canonicalUrl: {
        type: String,
        trim: true,
        default: "",
      },
      keywords: [
        {
          type: String,
          trim: true,
        },
      ],
      ogImage: {
        type: String,
        trim: true,
        default: "",
      },
    },
    tags: [
      {
        tag: {
          type: String,
          maxLength: 500,
          trim: true,
        },
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    numOfViews: {
      type: Number,
      default: 0,
    },
    cover: {
      type: Object,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    relatedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    analytics: {
      shares: {
        type: Number,
        default: 0,
      },
      helpfulYes: {
        type: Number,
        default: 0,
      },
      helpfulNo: {
        type: Number,
        default: 0,
      },
      reports: {
        type: Number,
        default: 0,
      },
      reads: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
