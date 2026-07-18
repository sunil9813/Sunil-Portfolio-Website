const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["blog", "project", "course"],
    },
    cover: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true },
);
CategorySchema.index({ title: 1, type: 1 }, { unique: true });
const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
