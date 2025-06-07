const mongoose = require("mongoose");
const { object } = require("yup");

const introductionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    bio: {
      type: String,
      maxlength: 250,
      minlength: 5,
    },
    description: {
      type: String,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
    },
    emails: [
      {
        email: {
          type: String,
        },
      },
    ],
    phones: [
      {
        phone: {
          type: String,
        },
      },
    ],
    languages: [
      {
        language: {
          type: String,
        },
      },
    ],
    country: {
      type: String,
    },
    address: {
      type: String,
    },
    downloadCount: {
      type: String,
    },
    socialslinks: [
      {
        link: {
          type: String,
          match: [/^https?:\/\/.+/, "Invalid URL format"],
        },
      },
    ],
    avatar: {
      type: Object,
    },
    cv: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Introduction", introductionSchema);
