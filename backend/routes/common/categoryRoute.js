const express = require("express");
const { protect, admin } = require("../../middleware/authMiddleware");
const { createCategory, getAllCategory, getCategory, deleteCategory, updateCategory, getCategoriesByType } = require("../../controllers/common/categoryControllers");
const validation = require("../../middleware/Validation");
const { createCategoryValidation } = require("../../utils/validations/PostsValidation");
const { upload } = require("../../middleware/imageMiddleware");
const router = express.Router();

router.get("/", getAllCategory);
router.post("/", protect, admin, upload.single("cover"), validation(createCategoryValidation), createCategory);
router.get("/:type", protect, getCategoriesByType);
router.get("/single/:id", protect, admin, getCategory);
router.post("/single", protect, admin, getCategory);
router.delete("/delete", protect, admin, deleteCategory);
router.delete("/delete/:id", protect, admin, deleteCategory);
router.patch("/update/:id", upload.single("cover"), protect, admin, updateCategory);
module.exports = router;
