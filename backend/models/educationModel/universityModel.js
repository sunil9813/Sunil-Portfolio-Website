const mongoose = require("mongoose");

const UniversitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, unique: true },
    slug: {
      type: String,
      unique: true,
    },
    description: { type: String, required: true },
    edate: { type: String, required: true },
    location: { type: String, required: true },
    website: { type: String, trim: true },
    logo: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);
const UniversityModel = mongoose.model("University", UniversitySchema);

module.exports = UniversityModel;
