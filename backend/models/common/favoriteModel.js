const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "itemType",
      },
    ],
    itemType: {
      type: String,
      required: true,
      enum: ["Posts", "Blog", "Courses", "Chapter"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Favorite", FavoriteSchema);
