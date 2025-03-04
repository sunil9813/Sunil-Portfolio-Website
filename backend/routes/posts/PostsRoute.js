const express = require("express");
const { protect } = require("../../middleware/authMiddleware");
const { createPosts, getallPosts, getPost, deletePosts, updatePosts, getallPost, getallPostofUser } = require("../../controllers/posts/PostsControllers");
const { upload } = require("../../utils/uploadImg");
const { createProjectValidation } = require("../../utils/validations/PostsValidation");
const validation = require("../../middleware/Validation");
const router = express.Router();

router.get("/", getallPosts);
router.get("/all", getallPost);
router.get("/:slug", getPost);

router.get("/user/posts", protect, getallPostofUser);
router.post("/", protect, upload.array("assets"), validation(createProjectValidation), createPosts);
router.delete("/remove/:id", protect, deletePosts);
router.delete("/remove", protect, deletePosts);
router.put("/:id", protect, upload.array("assets"), updatePosts);

module.exports = router;
