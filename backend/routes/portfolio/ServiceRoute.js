const express = require("express");
const { createService, getallService, getService, deleteService, updateService } = require("../../controllers/portfolio/serviceCtr");
const validation = require("../../middleware/Validation");
const { protect, admin } = require("../../middleware/authMiddleware");
const { upload, handleUploadErrors } = require("../../middleware/imageMiddleware");
const { createServiceValidation } = require("../../utils/validations");
const router = express.Router();

router.post("/", protect, admin, upload.single("cover"), handleUploadErrors, validation(createServiceValidation), createService);

router.get("/", getallService);
router.get("/:slug", getService);
router.delete("/", protect, admin, deleteService);
router.patch("/:slug", protect, admin, upload.single("cover"), handleUploadErrors, updateService);

module.exports = router;
