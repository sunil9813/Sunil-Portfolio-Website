const express = require("express");
const { createIntro, getIntro } = require("../../controllers/about/introductionCtr");
const { upload } = require("../../utils/uploadImg");
const { protect, admin } = require("../../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, admin, upload.single("avatar"), createIntro);
router.get("/:id", getIntro);

module.exports = router;
