const express = require("express");
const { submitContactForm, getContactForms, replyToContactForm, getContactForm } = require("../controllers/ContactControllers");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", submitContactForm);
router.get("/:id", protect, admin, getContactForm);
router.get("/", protect, admin, getContactForms);
router.put("/:id", protect, admin, replyToContactForm);

module.exports = router;
