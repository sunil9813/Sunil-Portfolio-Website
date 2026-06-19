import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupId: {
      type: String,
      required: false,
    },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileType: { type: String, required: true },
    publicId: { type: String, required: true },
    folder: { type: String, required: true }, // New field to store the folder name
  },
  { timestamps: true },
);

const ImageModel = mongoose.model("Image", imageSchema);
export default ImageModel;
