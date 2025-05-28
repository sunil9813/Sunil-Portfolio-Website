const { mongoose } = require("mongoose");

// eg : TU ==> Management, Science and technology, Art
const facultySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

const FacultyModel = mongoose.model("Faculty", facultySchema);

module.exports = FacultyModel;
