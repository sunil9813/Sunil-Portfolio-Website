const express = require("express");
const {
  createService,
  getallService,
  getService,
  deleteService,
  updateService,
} = require("../../controllers/about/serviceCtr");
const { createServiceValidation } = require("../../utils/validations");
const validation = require("../../middleware/Validation");
const { protect, admin } = require("../../middleware/authMiddleware");
const { upload } = require("../../utils/uploadImg");
const router = express.Router();

router.post("/", protect, admin, upload.single("cover"), validation(createServiceValidation), createService);

router.get("/", getallService);
router.get("/:slug", getService);

router.delete("/", protect, admin, deleteService);
router.put("/:id", protect, admin, upload.single("cover"), updateService);

module.exports = router;
