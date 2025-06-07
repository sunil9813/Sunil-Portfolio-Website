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
        school: String,
        degree: String,
        university: String,
        city: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    experience: [
      {
        company: String,
        position: String,
        city: String,
        description: String,
        startDate: Date,
        endDate: Date,
      },
    ],
    skills: [
      {
        name: String,
        progress: Number,
      },
    ],
    achievements: [
      {
        title: String,
        description: String,
      },
    ],
    training: [
      {
        title: String,
        company: String,
        city: String,
        description: String,
        startDate: Date,
        endDate: Date,
      },
    ],
    award: [
      {
        title: String,
        company: String,
        city: String,
        description: String,
        recievedYear: Date,
      },
    ],
    reference: [
      {
        fullname: String,
        company: String,
        city: String,
        designation: String,
        phone: String,
        email: String,
        website: String,
      },
    ],
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
