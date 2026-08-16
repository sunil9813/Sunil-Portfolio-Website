const { mongoose } = require("mongoose");

// eg : TU (Uin) ==> Management (Fac) => BIT (Program) => C, C+, JAVA

const resourceFileSchema = new mongoose.Schema(
  {
    fileName: { type: String },
    displayName: { type: String },
    filePath: { type: String },
    fileType: { type: String },
    publicId: { type: String },
    size: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    resourceType: {
      type: String,
      enum: ["pdf", "word", "excel", "ppt", "image", "other"],
      default: "other",
    },
    cloudinaryResourceType: {
      type: String,
      enum: ["image", "raw", "video", "auto"],
      default: "raw",
    },
  },
  { _id: false },
);

const subjectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    university: { type: mongoose.Schema.Types.ObjectId, ref: "University" },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
    program: { type: mongoose.Schema.Types.ObjectId, ref: "Program" },

    name: { type: String, required: true },
    slug: { type: String, unique: true },
    groupId: { type: String },

    description: { type: String, require: true },
    metaDescription: { type: String, required: true, trim: true, maxLength: 160 },

    totalpage: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },
    bookmarksCount: { type: Number, default: 0 },
    numOfViews: { type: Number, default: 0 },

    visibility: { type: String, enum: ["public", "private", "scheduled"], default: "private" },
    scheduledPublish: {
      type: Date,
      required: function () {
        return this.visibility === "scheduled";
      },
    },

    accessType: {
      type: String,
      enum: ["paid", "unpaid", "pro"],
      default: "unpaid",
    },

    featured: { type: Boolean, default: false },
    tags: [{ tag: { type: String, maxLength: 500, trim: true } }],
    highlights: [{ highlight: { type: String, trim: true } }],

    price: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    discountDate: { type: Date, default: null },
    discountShow: { type: Boolean, default: false },

    thumbnail: { type: Object },

    resourceFiles: [resourceFileSchema],

    // Old field kept for compatibility.
    resourceFile: { type: Object },
  },
  { timestamps: true },
);

const SubjectModel = mongoose.model("Subject", subjectSchema);

module.exports = SubjectModel;
