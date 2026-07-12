const express = require("express");
const { protect } = require("../../middleware/authMiddleware");
const {
  createProject,
  getallProjectofUser,
  getallProject,
  getallProjects,
  getProject,
  deleteProject,
  updateProject,
  updateProjectFeaturedStatus,
  updateProjectVisibility,
  getProjectPrivate,
} = require("../../controllers/project/ProjectControllers");
const { upload, getUploadAssetsandThumbnail } = require("../../utils/uploadImg");
const { createProjectValidation } = require("../../utils/validations/PostsValidation");
const validation = require("../../middleware/Validation");
const router = express.Router();

// Async wrapper for dynamic Project upload middleware
const uploadAssetsandThumbnail = async (req, res, next) => {
  try {
    const uploadMiddleware = await getUploadAssetsandThumbnail();
    uploadMiddleware(req, res, next);
  } catch (error) {
    res.status(500).json({ error: `Failed to initialize upload middleware: ${error.message}` });
  }
};

router.get("/", getallProjects);
router.get("/all", getallProject);
router.get("/:slug", getProject);
router.get("/detail/:slug", protect, getProjectPrivate);

router.get("/user/posts", protect, getallProjectofUser);
router.post("/", protect, uploadAssetsandThumbnail, validation(createProjectValidation), createProject);

router.delete("/remove/:id", protect, deleteProject);
router.delete("/remove", protect, deleteProject);

router.put("/:slug", protect, uploadAssetsandThumbnail, updateProject);
router.patch("/featured/:projectId", protect, updateProjectFeaturedStatus);
router.patch("/visibility/:projectId", protect, updateProjectVisibility);

module.exports = router;
