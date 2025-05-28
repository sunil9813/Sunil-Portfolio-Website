const multer = require("multer");
const AssetLimitConfigModel = require("../models/project/AssetLimitConfigModel");

// Use memory storage for Cloudinary uploads
const storage = multer.memoryStorage(); // for multiple filed image upload

// File filter to enforce file type and size limits based on field name
function fileFilter(req, file, cb) {
  const imageMimeTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (file.fieldname === "thumbnail") {
    if (!imageMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type for thumbnail. Supported types are jpg, png, and jpeg."), false);
    }
    if (file.size > 10 * 1024 * 1024) {
      return cb(new Error(`File ${file.originalname} exceeds 10MB limit for thumbnail.`), false);
    }
    cb(null, true);
  } else if (file.fieldname === "resourceFile") {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Resource file must be a PDF."), false);
    }
    if (file.size > 5 * 1024 * 1024) {
      return cb(new Error(`File ${file.originalname} exceeds 5MB limit for resourceFile.`), false);
    }
    cb(null, true);
  } else {
    cb(new Error(`Unexpected field: ${file.fieldname}`), false);
  }
}

const storageSingleFile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname); // 23/08/2022
  },
});

function fileFilterSingleFile(req, file, cb) {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Supported types are jpg, png, and jpeg."), false);
  }
}
const upload = multer({ storageSingleFile, fileFilterSingleFile });

// General upload middleware for any file type (100MB limit)
const uploadFile = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

/* ---------------- Project ---------------- */
const getUploadAssetsandThumbnail = async () => {
  try {
    const assetLimitConfig = await AssetLimitConfigModel.findOne();
    const maxAssets = assetLimitConfig ? assetLimitConfig.assetLimit : 5; // Fallback to 5

    // Single Multer instance for all project-related uploads
    const uploadProject = multer({
      storage,
      fileFilter,
    });

    return uploadProject.fields([
      { name: "assets", maxCount: maxAssets },
      { name: "thumbnail", maxCount: 1 },
      { name: "resourceFileUpload", maxCount: 1 }, // Changed from resourceFile
    ]);
  } catch (error) {
    throw new Error("Failed to fetch asset limit configuration: " + error.message);
  }
};
/* ---------------- End Project ---------------- */

/* ---------------- Courses / Subject ---------------- */
const getUploadFileandThumbnail = async () => {
  try {
    const uploadCourse = multer({
      storage,
      fileFilter,
    });

    return uploadCourse.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "resourceFile", maxCount: 1 },
    ]);
  } catch (error) {
    throw new Error("Failed to configure upload middleware: " + error.message);
  }
};
/* ---------------- End Courses / Subject  ---------------- */

/* ---------------- Chapter ---------------- */
const uploadChapter = multer({ storage });
const uploadCoverandMedia = uploadChapter.fields([
  { name: "cover", maxCount: 1 },
  { name: "media", maxCount: 1 },
]);
/* ---------------- End Chapter ---------------- */

const uploadTestimonial = multer({ storage });
const uploadAvatarandProjectDoc = uploadTestimonial.fields([
  { name: "projectDoc", maxCount: 1 },
  { name: "avatar", maxCount: 1 },
]);

module.exports = { upload, uploadFile, getUploadAssetsandThumbnail, getUploadFileandThumbnail, uploadAvatarandProjectDoc, uploadCoverandMedia };
