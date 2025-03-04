const mongoose = require("mongoose");

const socialMediaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  links: [
    {
      link: {
        type: String,
        required: true,
      },
      visibility: {
        type: String,
        enum: ["public", "private"],
        default: "public",
      },
    },
  ],
});

module.exports = mongoose.model("SocialMediaLink", socialMediaSchema);
