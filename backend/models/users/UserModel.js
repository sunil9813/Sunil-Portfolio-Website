const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    fullname: { type: String },
    email: { type: String, required: true },
    password: {
      type: String,
      require: [true, "Password should contain at least 8 characters, including at least one lowercase letter, one uppercase letter, and one number"],
    },
    avatar: {
      type: Object,
      url: String,
      publicId: String,
      default: "https://cdn-icons-png.flaticon.com/512/3940/3940417.png",
    },
    cover: {
      type: Object,
      default: "",
    },
    phone: { type: Number },
    bio: { type: String, default: "Wellcome to Photo Idol" },
    address: { type: String },
    role: { type: String, default: "guest", require: true, enum: ["guest", "author", "admin", "super admin"] },
    isVerified: { type: Boolean, default: false },
    userAgent: { type: Array, required: true, default: [] },
    socialMedia: [
      {
        link: {
          type: String,
        },
      },
    ],
    paid: { type: Boolean, default: false },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users following this user
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users whom this user is following
  },
  {
    timestamps: true,
    minimize: false,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

module.exports = mongoose.model("User", userSchema);
