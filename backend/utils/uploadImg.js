// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname); // 23/08/2022
//   },
// });

// function fileFilter(req, file, cb) {
//   if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type. Supported types are jpg, png, and jpeg."), false);
//   }
// }

// const upload = multer({ storage, fileFilter });
// const uploadFile = multer({ storage });

// /* ---------------- Project ---------------- */
// const uploadProject = multer({ storage, fileFilter });
// const uploadAssetsandThumbnail = uploadProject.fields([
//   { name: "assets", maxCount: 10 }, // Adjust maxCount based on assetLimitConfig
//   { name: "thumbnail", maxCount: 1 },
// ]);

// /* ---------------- End Project ---------------- */

// /*  ----------------  Testimonial  ----------------*/
// const uploadTestimonial = multer({ storage });

// const uploadAvatarandProjectDoc = uploadTestimonial.fields([
//   { name: "projectDoc", maxCount: 1 },
//   { name: "avatar", maxCount: 1 },
// ]);

// /*  ---------------- End Testimonial  ----------------*/
// /*  ----------------  Chapter   ----------------*/
// const uploadChapter = multer({ storage });

// const uploadCoverandMedia = uploadChapter.fields([
//   { name: "cover", maxCount: 1 },
//   { name: "media", maxCount: 1 },
// ]);

// /*  ---------------- End Chapter  ----------------*/

// module.exports = { upload, uploadFile, uploadAvatarandProjectDoc, uploadCoverandMedia };

/** ------------ this is second verison  ------------------  */
/*
const multer = require("multer");
const AssetLimitConfigModel = require("../models/project/AssetLimitConfigModel");

// Use memory storage for Cloudinary uploads
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Supported types are jpg, png, and jpeg."), false);
  }
}

// General upload middleware for single image files
const upload = multer({ storage, fileFilter });

// General upload middleware for any file type (no filter)
const uploadFile = multer({ storage });

/* ---------------- Project ----------------  
// Factory function to create uploadAssetsandThumbnail middleware with dynamic maxCount
const getUploadAssetsandThumbnail = async () => {
  try {
    const assetLimitConfig = await AssetLimitConfigModel.findOne();
    const maxAssets = assetLimitConfig;
    const uploadProject = multer({ storage, fileFilter });
    return uploadProject.fields([
      { name: "assets", maxCount: maxAssets },
      { name: "thumbnail", maxCount: 1 },
    ]);
  } catch (error) {
    throw new Error("Failed to fetch asset limit configuration: " + error.message);
  }
};

/* ---------------- End Project ---------------- */

/* ---------------- Testimonial ----------------  
const uploadTestimonial = multer({ storage });
const uploadAvatarandProjectDoc = uploadTestimonial.fields([
  { name: "projectDoc", maxCount: 1 },
  { name: "avatar", maxCount: 1 },
]);
/* ---------------- End Testimonial ---------------- */

/* ---------------- Chapter ---------------- 
const uploadChapter = multer({ storage });
const uploadCoverandMedia = uploadChapter.fields([
  { name: "cover", maxCount: 1 },
  { name: "media", maxCount: 1 },
]);
/* ---------------- End Chapter ----------------  

module.exports = { upload, uploadFile, getUploadAssetsandThumbnail, uploadAvatarandProjectDoc, uploadCoverandMedia };
*/
const multer = require("multer");
const AssetLimitConfigModel = require("../models/project/AssetLimitConfigModel");

// Use memory storage for Cloudinary uploads
const storage = multer.memoryStorage();

// File filter to enforce file type and size limits based on field name
function fileFilter(req, file, cb) {
  const imageMimeTypes = ["image/png", "image/jpg", "image/jpeg"];

  if (file.fieldname === "assets" || file.fieldname === "thumbnail") {
    // Restrict assets and thumbnail to images (10MB limit)
    if (!imageMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type for assets/thumbnail. Supported types are jpg, png, and jpeg."), false);
    }
    if (file.size > 10 * 1024 * 1024) {
      return cb(new Error(`File ${file.originalname} exceeds 10MB limit for ${file.fieldname}.`), false);
    }
    cb(null, true);
  } else if (file.fieldname === "resourceFileUpload") {
    // Allow any file type for resourceFileUpload (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      return cb(new Error(`File ${file.originalname} exceeds 100MB limit for resourceFileUpload.`), false);
    }
    cb(null, true);
  } else {
    // Reject unexpected fields
    cb(new Error(`Unexpected field: ${file.fieldname}`), false);
  }
}

// General upload middleware for single image files (10MB limit)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

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

/* ---------------- Testimonial ---------------- */
const uploadTestimonial = multer({ storage });
const uploadAvatarandProjectDoc = uploadTestimonial.fields([
  { name: "projectDoc", maxCount: 1 },
  { name: "avatar", maxCount: 1 },
]);

/* ---------------- End Testimonial ---------------- */

/* ---------------- Chapter ---------------- */
const uploadChapter = multer({ storage });
const uploadCoverandMedia = uploadChapter.fields([
  { name: "cover", maxCount: 1 },
  { name: "media", maxCount: 1 },
]);

/* ---------------- End Chapter ---------------- */

module.exports = { upload, uploadFile, getUploadAssetsandThumbnail, uploadAvatarandProjectDoc, uploadCoverandMedia };
