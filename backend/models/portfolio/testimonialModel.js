const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    type: {
      type: String,
      required: true,
      enum: ["contact", "inquiry", "feedback"],
      default: "contact",
    },
    reply: {
      type: Boolean,
      default: false,
    },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    cost: String,

    position: String,
    company: String,
    link: String,
    fullname: String,
    email: String,
    phone: String,
    location: String,
    avatar: { type: Object },
    projectDoc: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
