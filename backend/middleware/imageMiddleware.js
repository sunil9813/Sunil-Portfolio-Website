const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname); // 23/08/2022
  },
});

function fileFilter(req, file, cb) {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Supported types are jpg, png, and jpeg."), false);
  }
}

const upload = multer({ storage, fileFilter });
const uploadFile = multer({ storage });

/* ---------------- Project ---------------- */
const uploadProject = multer({ storage, fileFilter });
const uploadAssetsandThumbnail = uploadProject.fields([
  { name: "assets", maxCount: 10 }, // Adjust maxCount based on assetLimitConfig
  { name: "thumbnail", maxCount: 1 },
]);

/* ---------------- End Project ---------------- */

/*  ----------------  Testimonial  ----------------*/
const uploadTestimonial = multer({ storage });

const uploadAvatarandProjectDoc = uploadTestimonial.fields([
  { name: "projectDoc", maxCount: 1 },
  { name: "avatar", maxCount: 1 },
]);

/*  ---------------- End Testimonial  ----------------*/
/*  ----------------  Chapter   ----------------*/
const uploadChapter = multer({ storage });

const uploadCoverandMedia = uploadChapter.fields([
  { name: "cover", maxCount: 1 },
  { name: "media", maxCount: 1 },
]);

/*  ---------------- End Chapter  ----------------*/

module.exports = { upload, uploadFile, uploadAvatarandProjectDoc, uploadCoverandMedia };
