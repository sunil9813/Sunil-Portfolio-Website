const express = require("express");
const { admin, protect } = require("../../middleware/authMiddleware");
const validation = require("../../middleware/Validation");
const { upload } = require("../../utils/uploadImg");
const { createHomeSlider, getAllhomeSlider, deletehomeSlider, updatehomeSlider, toggleHomeFeature, getFeaturesLists, createOrUpdateContactInfo, getContactInfo, gethomeSlider } = require("../../controllers/settings/SettingCtr");
const { createHomeSliderValidation } = require("../../utils/validations");
const router = express.Router();

router.post("/homeslider", protect, admin, upload.single("cover"), validation(createHomeSliderValidation), createHomeSlider);
router.get("/homeslider", getAllhomeSlider);
router.get("/homeslider/:id", protect, admin, gethomeSlider);
router.delete("/homeslider", protect, admin, deletehomeSlider);
router.put("/homeslider/:id", upload.single("cover"), protect, admin, updatehomeSlider);

// Posts freatures list
router.post("/feature", protect, admin, toggleHomeFeature);
router.get("/feature", getFeaturesLists);

//Contact Information
router.post("/contactinfo", protect, admin, createOrUpdateContactInfo);
router.get("/contactinfo", getContactInfo);
module.exports = router;
