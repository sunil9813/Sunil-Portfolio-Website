const express = require("express");
const { createCategory, getAllCategory, getCategory, deleteCategory, updateCategory } = require("../../controllers/posts/CategoryController");
const { admin, protect } = require("../../middleware/authMiddleware");
const validation = require("../../middleware/Validation");
const { createCategoryValidation } = require("../../utils/validations/PostsValidation");
const { upload } = require("../../utils/uploadImg");
const router = express.Router();

router.post("/", protect, admin, upload.single("cover"), validation(createCategoryValidation), createCategory);
router.get("/", getAllCategory);
router.get("/single/:id", protect, admin, getCategory);
router.post("/single", protect, admin, getCategory);
router.delete("/delete", protect, admin, deleteCategory);
router.delete("/delete/:id", protect, admin, deleteCategory);
router.patch("/update/:id", upload.single("cover"), protect, admin, updateCategory);

module.exports = router;
