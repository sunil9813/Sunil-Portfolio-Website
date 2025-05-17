const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    edate: { type: String, required: true },
    location: { type: String, required: true },
    logo: { type: Object, required: false },
    website: { type: String, trim: true },
  },
  { timestamps: true }
);

const UniversityModel = mongoose.model("University", universitySchema);
module.exports = { UniversityModel };
