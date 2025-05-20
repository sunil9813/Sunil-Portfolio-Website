const { mongoose } = require("mongoose");

// eg : TU (Uin) ==> Management (Fac) =>  BIT (Program) => C, C+, JAVA

const subjectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    university: { type: mongoose.Schema.Types.ObjectId, ref: "University" },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
    program: { type: mongoose.Schema.Types.ObjectId, ref: "Program" },

    name: { type: String, required: true },
    slug: { type: String, unique: true },
    premium: { type: Boolean, default: false },
    groupId: { type: String },

    description: { type: String, require: true },
    metaDescription: { type: String, required: true, trim: true, maxLength: 160 },

    totalpage: { type: Number, default: 0 }, // count chapter
    likesCount: { type: Number, default: 0 }, // count total like of all chapter
    numOfViews: { type: Number, default: 0 }, // count total views of all chapter

    visibility: { type: String, enum: ["public", "private", "scheduled"], default: "private" },
    scheduledPublish: {
      type: Date,
      required: function () {
        return this.visibility === "scheduled";
      },
    },
    featured: { type: Boolean, default: false }, // showing in home page or not
    tags: [{ tag: { type: String, maxLength: 500, trim: true } }],

    price: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    discountDate: { type: Date, default: null },
    discountShow: { type: Boolean, default: false },

    thumbnail: { type: Object, required: true },
  },
  { timestamps: true }
);

const SubjectModel = mongoose.model("Subject", subjectSchema);

module.exports = SubjectModel;
