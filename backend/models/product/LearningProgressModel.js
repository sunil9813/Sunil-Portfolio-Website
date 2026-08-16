const mongoose = require("mongoose");

const learningProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },
    completedChapters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
      },
    ],
    completedLessons: [
      {
        type: String,
        trim: true,
      },
    ],
    lastChapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      default: null,
    },
    lastLessonKey: {
      type: String,
      default: "",
      trim: true,
    },
    percent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

learningProgressSchema.index({ user: 1, subject: 1 }, { unique: true });

module.exports = mongoose.models.LearningProgress || mongoose.model("LearningProgress", learningProgressSchema);
