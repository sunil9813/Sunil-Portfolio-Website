const { mongoose } = require("mongoose");

// eg : TU (Uin) ==> Management (Fac) => BBA, BCA, BIT (Program)
const programSchema = new mongoose.Schema(
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
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    thumbnail: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

const ProgramModel = mongoose.model("Program", programSchema);

module.exports = ProgramModel;
