const multer = require("multer");
const AssetLimitConfigModel = require("../models/project/AssetLimitConfigModel");
const fs = require("fs");
const path = require("path");

const profileUploadDirectory = path.join(process.cwd(), "uploads");

if (!fs.existsSync(profileUploadDirectory)) {
  fs.mkdirSync(profileUploadDirectory, {
    recursive: true,
  });
}

const storage = multer.memoryStorage();

const imageMimeTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

const courseResourceMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
];

function fileFilter(req, file, cb) {
  if (file.fieldname === "image" || file.fieldname === "thumbnail" || file.fieldname === "avatar" || file.fieldname === "assets" || file.fieldname === "resourceFileUpload") {
    if (!["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
      return cb(new Error("Invalid file type for thumbnail. Supported types are jpg, png, and jpeg."), false);
    }

    return cb(null, true);
  }

  if (file.fieldname === "resourceFiles" || file.fieldname === "resourceFile") {
    if (!courseResourceMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Resource file must be PDF, Word, Excel, PPT, PNG, JPG, JPEG, or WEBP."), false);
    }

    return cb(null, true);
  }

  if (file.fieldname === "cv" || file.fieldname === "projectDoc") {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("File must be a PDF."), false);
    }

    return cb(null, true);
  }

  cb(new Error(`Unexpected field: ${file.fieldname}`), false);
}

const storageSingleFile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname);
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

const uploadFile = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

/* ---------------- Project ---------------- */
const getUploadAssetsandThumbnail = async () => {
  try {
    const assetLimitConfig = await AssetLimitConfigModel.findOne();
    const maxAssets = assetLimitConfig ? assetLimitConfig.assetLimit : 5;

    const uploadProject = multer({
      storage,
      fileFilter,
    });

    return uploadProject.fields([
      { name: "assets", maxCount: maxAssets },
      { name: "thumbnail", maxCount: 1 },
      { name: "resourceFileUpload", maxCount: 1 },
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
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    });

    return uploadCourse.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "resourceFiles", maxCount: 20 },
      { name: "resourceFile", maxCount: 20 },
    ]);
  } catch (error) {
    throw new Error("Failed to configure upload middleware: " + error.message);
  }
};
/* ---------------- End Courses / Subject  ---------------- */

/* ---------------- Chapter ---------------- */
const getUploadVideoandThumbnail = async () => {
  try {
    const uploadCourse = multer({
      storage,
      fileFilter: (req, file, cb) => {
        const fileConfig = {
          thumbnail: {
            mimeTypes: ["image/png", "image/jpg", "image/jpeg", "image/webp"],
            maxSize: 2 * 1024 * 1024,
            error: {
              type: "Thumbnail must be an image (PNG, JPG, JPEG, WEBP)",
              size: "Thumbnail exceeds maximum size of 10MB",
            },
          },
          video: {
            mimeTypes: ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/webm", "video/mpeg"],
            maxSize: 10 * 1024 * 1024 * 1024,
            error: {
              type: "Video must be MP4, MOV, AVI, MKV, WEBM, or MPEG format",
              size: "Video exceeds maximum size of 10GB",
            },
          },
        };

        if (!fileConfig[file.fieldname]) {
          return cb(new Error(`Unexpected field: ${file.fieldname}. Only 'thumbnail' and 'video' are allowed.`), false);
        }

        const config = fileConfig[file.fieldname];

        if (!config.mimeTypes.includes(file.mimetype)) {
          return cb(new Error(config.error.type), false);
        }

        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024 * 1024,
      },
    });

    return uploadCourse.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "video", maxCount: 1 },
    ]);
  } catch (error) {
    throw new Error("Failed to configure upload middleware: " + error.message);
  }
};
/* ---------------- End Chapter ---------------- */

/* ---------------- Portfolio/Intro ---------------- */
const getUploadCVandAvatar = async () => {
  try {
    const uploadCourse = multer({
      storage,
      fileFilter,
    });

    return uploadCourse.fields([
      { name: "avatar", maxCount: 1 },
      { name: "cv", maxCount: 1 },
    ]);
  } catch (error) {
    throw new Error("Failed to configure upload middleware: " + error.message);
  }
};
/* ---------------- End Portfolio/Intro ---------------- */

const getuploadAvatarandProjectDoc = async () => {
  try {
    const uploadCourse = multer({
      storage,
      fileFilter,
    });

    return uploadCourse.fields([
      { name: "avatar", maxCount: 1 },
      { name: "projectDoc", maxCount: 1 },
    ]);
  } catch (error) {
    throw new Error("Failed to configure upload middleware: " + error.message);
  }
};

const profileImageStorage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, profileUploadDirectory);
  },

  filename(req, file, callback) {
    const extension = path.extname(file.originalname);
    const uniqueName = [file.fieldname, Date.now(), Math.round(Math.random() * 1e9)].join("-");

    callback(null, `${uniqueName}${extension}`);
  },
});

const profileImageFilter = (req, file, callback) => {
  const allowedFields = ["avatar", "cover"];
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

  if (!allowedFields.includes(file.fieldname)) {
    return callback(new Error(`Unexpected field: ${file.fieldname}. Only avatar and cover are allowed.`), false);
  }

  if (!allowedTypes.includes(file.mimetype)) {
    return callback(new Error("Only PNG, JPG, JPEG and WEBP images are allowed."), false);
  }

  callback(null, true);
};

const uploadProfileImage = multer({
  storage: profileImageStorage,
  fileFilter: profileImageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

module.exports = {
  upload,
  uploadFile,
  getUploadAssetsandThumbnail,
  getUploadFileandThumbnail,
  getUploadVideoandThumbnail,
  getUploadCVandAvatar,
  getuploadAvatarandProjectDoc,
  profileImageStorage,
  profileImageFilter,
  uploadProfileImage,
};
