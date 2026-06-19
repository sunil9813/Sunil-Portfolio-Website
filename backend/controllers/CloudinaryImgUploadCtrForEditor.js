const cloudinary = require("cloudinary").v2;
const asyncHandler = require("express-async-handler");
const { default: ImageModel } = require("../models/ImageModel");

const uploadImageToEditorDes = asyncHandler(async (req, res) => {
  console.log("=== UPLOAD REQUEST ===");
  console.log("Body:", req.body);
  console.log("Files:", req.files ? req.files.length : 0, "files");
  console.log("=====================");

  // Validate required fields
  const { folder, groupId } = req.body;

  if (!groupId) {
    return res.status(400).json({
      success: false,
      error: "groupId is required in the request body",
    });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      error: "At least one image is required.",
    });
  }

  const uploadFolder = folder ? `Sunil Portfolio/${folder}` : "Sunil Portfolio/Gallary";

  const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  try {
    // Validate all files before uploading to Cloudinary
    for (const file of req.files) {
      if (!allowedImageTypes.includes(file.mimetype)) {
        throw new Error("Invalid image format. Supported formats: JPEG, PNG, JPG, WEBP.");
      }
      if (file.size > maxSize) {
        throw new Error("Image size should not exceed 5 MB.");
      }
    }

    // Create an array to hold the data of the uploaded images
    const uploadedImages = [];

    for (const file of req.files) {
      // Convert buffer to base64 for Cloudinary upload
      const b64 = Buffer.from(file.buffer).toString("base64");
      let dataURI = "data:" + file.mimetype + ";base64," + b64;

      // Upload to Cloudinary
      const uploadedFile = await cloudinary.uploader.upload(dataURI, {
        folder: uploadFolder,
        resource_type: "auto",
      });

      // Extract only the unique public ID from the Cloudinary response
      const publicIdParts = uploadedFile.public_id.split("/");
      const uniquePublicId = publicIdParts[publicIdParts.length - 1];

      // Validate user is authenticated
      if (!req.user || !req.user._id) {
        throw new Error("User authentication required");
      }

      const imageData = {
        fileName: file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: file.mimetype,
        publicId: uniquePublicId,
        folder: uploadFolder,
        user: req.user._id,
        groupId: groupId, // This should now be validated
      };

      console.log("Saving image data:", {
        fileName: imageData.fileName,
        folder: imageData.folder,
        groupId: imageData.groupId,
        user: imageData.user,
      });

      const image = new ImageModel(imageData);
      await image.save(); // Save to MongoDB

      uploadedImages.push({
        _id: image._id,
        filePath: image.filePath,
        fileName: image.fileName,
        folder: image.folder,
        createdAt: image.createdAt,
      });
    }

    res.status(201).json({
      success: true,
      message: "Images uploaded successfully",
      images: uploadedImages,
    });
  } catch (error) {
    console.error("Upload error:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = {};
      for (const field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors,
      });
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const getAllImages = asyncHandler(async (req, res) => {
  try {
    const { folder, subfolder } = req.params;

    if (!folder) {
      return res.status(400).json({ error: "Folder name is required." });
    }

    const folderPath = subfolder ? `Sunil Portfolio/${folder}/${subfolder}` : `Sunil Portfolio/${folder}`;

    // Get today's start and end time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch images
    const images = await ImageModel.find({
      folder: { $regex: `^${folderPath}` },
      user: req.user._id,
    }).populate("user", "name email");

    if (!images || images.length === 0) {
      return res.status(404).json({ error: "No images found in the specified folder." });
    }

    // Separate recent (uploaded today) and older images
    const recentImages = images.filter((img) => new Date(img.createdAt) >= today && new Date(img.createdAt) < tomorrow);
    const olderImages = images.filter((img) => new Date(img.createdAt) < today);

    res.status(200).json({
      recentImages,
      olderImages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const deleteImage = asyncHandler(async (req, res) => {
  try {
    const { imageId } = req.params; // Get image ID from request parameters

    // Find the image by its ID in MongoDB
    const image = await ImageModel.findById(imageId);

    if (!image) {
      return res.status(404).json({ error: "Image not found." });
    }

    // Log the publicId before calling Cloudinary
    // console.log("Attempting to delete image with publicId:", image.publicId);

    // Check if the logged-in user is the owner of the image or an admin
    if (image.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ error: "You are not authorized to delete this image." });
    }

    // Construct the Cloudinary publicId using folder name and publicId
    const fullPublicId = image.folder ? `${image.folder}/${image.publicId}` : image.publicId;
    // console.log("Full Public ID for Cloudinary:", fullPublicId); // Log the full public ID for verification

    // Delete the image from Cloudinary using the full publicId
    const result = await cloudinary.uploader.destroy(fullPublicId);
    // console.log("Cloudinary Response:", result); // Log the full response from Cloudinary for debugging

    if (result.result !== "ok") {
      return res.status(500).json({ message: "Error deleting image from Cloudinary", result });
    }

    // Delete the image from MongoDB
    await image.deleteOne();

    res.status(200).json({ message: "Image deleted successfully." });
  } catch (error) {
    // console.error("Error in deleteImage controller:", error); // Log the error for debugging
    res.status(500).json({ error: error.message });
  }
});

const updateImage = asyncHandler(async (req, res) => {
  const { imageId } = req.params; // Get image ID from request parameters
  const file = req.file; // Get new file information from the request

  try {
    // Find the existing image by its ID
    const image = await ImageModel.findById(imageId);

    if (!image) {
      return res.status(404).json({ error: "Image not found." });
    }

    // Ensure the logged-in user is the owner or an admin
    if (image.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ error: "You are not authorized to update this image." });
    }

    // If a new image is provided, delete the old one from Cloudinary
    if (file) {
      const existingFolder = image.folder || "Sunil Portfolio/Gallary"; // Use the existing folder or default folder if missing
      const fullPublicId = `${existingFolder}/${image.publicId}`; // Full public ID with folder

      // Delete the old image from Cloudinary
      const deleteResult = await cloudinary.uploader.destroy(fullPublicId);
      if (deleteResult.result !== "ok") {
        return res.status(500).json({ message: "Error deleting old image from Cloudinary." });
      }

      // Upload the new image to the same folder (existingFolder)
      const uploadedFile = await cloudinary.uploader.upload(file.path, {
        folder: existingFolder, // Ensure the same folder is used for the upload
      });

      // Extract the new public ID from Cloudinary response
      const publicIdParts = uploadedFile.public_id.split("/");
      const uniquePublicId = publicIdParts[publicIdParts.length - 1];

      // Prepare the new image data to update in MongoDB
      const updatedImageData = {
        fileName: file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: file.mimetype,
        publicId: uniquePublicId,
        folder: existingFolder, // Ensure the same folder
      };

      // Update the image details in MongoDB
      image.fileName = updatedImageData.fileName;
      image.filePath = updatedImageData.filePath;
      image.fileType = updatedImageData.fileType;
      image.publicId = updatedImageData.publicId;
      image.folder = updatedImageData.folder;

      await image.save(); // Save the updated image details to MongoDB
    }

    res.status(200).json({ message: "Image updated successfully.", image });
  } catch (error) {
    console.error("Error in updateImage controller:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = { uploadImageToEditorDes, getAllImages, updateImage, deleteImage };
