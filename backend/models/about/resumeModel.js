const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    education: [
      {
        schoolName: {
          type: String,
          required: true,
        },
        degree: String,
        university: String,
        address: String,
        startDate: Date,
        endDate: Date,
      },
    ],
    experience: [
      {
        companyName: {
          type: String,
          required: true,
        },
        position: String,
        address: String,
        description: String,
        startDate: Date,
        endDate: Date,
      },
    ],
    skills: [
      {
        name: {
          type: String,
          required: true,
        },
        progress: Number,
      },
    ],
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
