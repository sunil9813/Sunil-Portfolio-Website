const mongoose = require("mongoose");

const contactFormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  replied: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("ContactForm", contactFormSchema);
