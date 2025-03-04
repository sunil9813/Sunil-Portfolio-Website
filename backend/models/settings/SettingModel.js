const mongoose = require("mongoose");

const homeSchema = mongoose.Schema(
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
    subtitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cover: {
      type: Object,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Home Slider", "Creatives"],
    },
  },
  { timestamps: true }
);
const HomeSlider = mongoose.model("HomeSlider", homeSchema);

const homeFeatureSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Posts",
      },
    ],
  },
  { timestamps: true }
);
const HomeFeature = mongoose.model("HomeFeature", homeFeatureSchema);

const contactInfoSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    socialMedia: [
      {
        link: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);
const ContactInfo = mongoose.model("ContactInfo", contactInfoSchema);

module.exports = { HomeSlider, HomeFeature, ContactInfo };
