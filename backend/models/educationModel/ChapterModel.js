const { mongoose } = require("mongoose");

// eg : TU (Uin) ==> Management (Fac) =>  BIT (Program) => C => 1.Data Type, 2. Introducation of Syntax

const childSubheadingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    metaTitle: { type: String, trim: true, maxLength: 250 },
    metaDescription: { type: String, trim: true, maxLength: 160 },
    description: { type: String, default: "" },
    slug: { type: String, trim: true },
    order: { type: Number, default: 0 },
    tags: [{ tag: { type: String, maxLength: 500, trim: true } }],
    thumbnail: { type: Object, required: false },
    video: { type: Object, required: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarksCount: { type: Number, default: 0 },
    numOfViews: { type: Number, default: 0 },
  },
  { _id: true },
);

const subheadingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    metaTitle: { type: String, trim: true, maxLength: 250 },
    metaDescription: { type: String, trim: true, maxLength: 160 },
    description: { type: String, default: "" },
    slug: { type: String, trim: true },
    order: { type: Number, default: 0 },
    tags: [{ tag: { type: String, maxLength: 500, trim: true } }],
    thumbnail: { type: Object, required: false },
    video: { type: Object, required: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarksCount: { type: Number, default: 0 },
    numOfViews: { type: Number, default: 0 },
    children: [childSubheadingSchema],
  },
  { _id: true },
);

const subjectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },

    title: { type: String, required: true, trim: true, maxLength: 100 }, // chapter name
    metaTitle: { type: String, required: true, trim: true, maxLength: 250 }, // title
    slug: { type: String, unique: true },
    order: { type: Number, default: 0 },
    description: { type: String, require: true },
    metaDescription: { type: String, required: true, trim: true, maxLength: 160 },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    numOfViews: { type: Number, default: 0 },

    tags: [{ tag: { type: String, maxLength: 500, trim: true } }],
    subheadings: [subheadingSchema],

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
