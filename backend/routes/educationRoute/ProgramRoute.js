const express = require("express");
const router = express.Router();
const { createProgram, getAllPrograms, getProgram, deleteProgram, updateProgram } = require("../../controllers/educationController/ProgramController");
const { protect, admin } = require("../../middleware/authMiddleware");
const { upload } = require("../../middleware/imageMiddleware");

// Program Routes
router.post("/", protect, admin, upload.single("thumbnail"), createProgram);

router.get("/", getAllPrograms);
router.get("/details/:slug", getProgram);
router.delete("/", protect, admin, deleteProgram);
router.delete("/:id", protect, admin, deleteProgram);
router.patch("/:id", protect, admin, upload.single("thumbnail"), updateProgram);

module.exports = router;
