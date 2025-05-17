/* const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, unique: true },
    university: { type: mongoose.Schema.Types.ObjectId, ref: "University", required: true },
  },
  { timestamps: true }
);
const programSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, unique: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
  },
  {
    timestamps: true,
  }
);

const semesterSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sem: { type: Number, required: true, unique: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
  },
  { timestamps: true }
);

const subjectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, unique: true },
    logo: { type: Object, default: "" },
    semester: { type: mongoose.Schema.Types.ObjectId, ref: "Semester", required: true },
  },
  { timestamps: true }
);

const chapterSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Courses", required: true },
    title: { type: String, required: true },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    tags: [
      {
        tag: {
          type: String,
          required: true,
          maxLength: 250,
        },
      },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    numOfViews: { type: Number, default: 0 },
    cover: { type: Object },
    media: { type: Object },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const FacultyModel = mongoose.model("Faculty", facultySchema);
const ProgramModel = mongoose.model("Program", programSchema);
const SemesterModel = mongoose.model("Semester", semesterSchema);
const SubjectModel = mongoose.model("Subject", subjectSchema);
const ChapterModel = mongoose.model("Chapter", chapterSchema);

module.exports = { FacultyModel, ProgramModel, SemesterModel, SubjectModel, ChapterModel };
 */
