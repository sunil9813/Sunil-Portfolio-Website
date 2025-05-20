const multer = require("multer");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname); // 23/08/2022
  },
});

function fileFilter(req, file, cb) {
  // File type validation with error message
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, JPEG, and PNG files are allowed."), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB size limit
  },
});

// Error handling middleware
const handleUploadErrors = (err, req, res, next) => {
  if (err) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File too large. Maximum size is 2MB.",
      });
    }
    return res.status(400).json({
      success: false,
      error: err.message || "File upload failed",
    });
  }
  next();
};

module.exports = { upload, handleUploadErrors };
