const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getAllImages, uploadImageToEditorDes, updateImage, deleteImage } = require("../controllers/CloudinaryImgUploadCtrForEditor");
const { upload, uploadFile } = require("../utils/uploadImg");

const router = express.Router();

// Upload a new image
router.post("/upload", protect, upload.array("image"), uploadImageToEditorDes);
router.delete("/:imageId", protect, deleteImage);
// Get all images
router.get("/:folder/:subfolder?", protect, getAllImages); // :subfolder is optional

router.put("/:imageId", protect, uploadFile.single("image"), updateImage); // Only allows a single file upload

module.exports = router;
