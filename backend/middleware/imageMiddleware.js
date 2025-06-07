const multer = require("multer");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname); // 23/08/2022
  },
});

function fileFilter(req, file, cb) {
  // Supported file types with friendly descriptions
  const supportedTypes = {
    "image/jpeg": "JPEG images",
    "image/png": "PNG images",
    "image/jpg": "JPG images",
  };

  if (supportedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    // More helpful error message that lists supported types
    const allowedTypes = Object.keys(supportedTypes)
      .map((ext) => ext.split("/")[1])
      .join(", ");
    cb(new Error(`Unsupported file format. Please upload one of these image types: ${allowedTypes}.`), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB size limit
  },
});

// Enhanced error handling middleware with user-friendly messages
const handleUploadErrors = (err, req, res, next) => {
  if (err) {
    let userMessage = "We encountered an issue with your file upload.";

    if (err.code === "LIMIT_FILE_SIZE") {
      userMessage = "The file you uploaded is too large. Please ensure it's under 2MB.";
    } else if (err.message.includes("Unsupported file format")) {
      userMessage = err.message; // Use our custom message from fileFilter
    } else {
      userMessage = "Sorry, we couldn't process your upload. Please try again with a different file.";
    }

    return res.status(400).json({
      success: false,
      error: userMessage,
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
  next();
};

module.exports = { upload, handleUploadErrors };
