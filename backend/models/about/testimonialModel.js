const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },
    position: String,
    company: String,
    location: String,
    link: String,
    content: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    avatar: {
      type: Object,
    },
    projectDoc: {
      type: Object,
    },
    cost: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
