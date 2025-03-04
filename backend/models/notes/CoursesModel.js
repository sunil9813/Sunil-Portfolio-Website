const mongoose = require("mongoose");

const coursesSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    totalpage: {
      type: Number,
      default: 0,
    },
    premium: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        tag: {
          type: String,
          unique: true,
          maxLength: 250,
        },
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    totalViews: {
      type: Number,
      default: 0,
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
    cover: {
      type: Object,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Courses", coursesSchema);
