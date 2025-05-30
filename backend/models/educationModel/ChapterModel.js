const { mongoose } = require("mongoose");

// eg : TU (Uin) ==> Management (Fac) =>  BIT (Program) => C => 1.Data Type, 2. Introducation of Syntax

const subjectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },

    title: { type: String, required: true, trim: true, maxLength: 100 }, // chapter name
    metaTitle: { type: String, required: true, trim: true, maxLength: 250 }, // title
    slug: { type: String, unique: true },
    description: { type: String, require: true },
    metaDescription: { type: String, required: true, trim: true, maxLength: 160 },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    numOfViews: { type: Number, default: 0 },

    tags: [{ tag: { type: String, maxLength: 500, trim: true } }],

    thumbnail: { type: Object, required: false },
    video: { type: Object, required: false },
    ratings: { type: Number, default: 0 },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const SubjectModel = mongoose.model("Chapter", subjectSchema);

module.exports = SubjectModel;
