const mongoose = require("mongoose");

const introductionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    description: String,
    name: String,
    position: String,
    email: String,
    phone: String,
    address: String,
    links: [
      {
        link: {
          type: String,
        },
      },
    ],
    avatar: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Introduction", introductionSchema);
