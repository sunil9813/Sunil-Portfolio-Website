const express = require("express");
const { protect, optionalProtect, admin } = require("../../middleware/authMiddleware");
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
  downloadProjectResource,
  reportProjectIssue,
  getProjectReports,
  updateProjectReportStatus,
  getProjectAdminAnalytics,
  getProjectPendingReportCount,
  getProjectBuyers,
  getProjectDownloadLogs,
  getProjectAccess,
  verifyProjectLicense,
  updateProjectDownloadAccess,
  checkProjectDemoLink,
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
router.get("/user/posts", protect, getallProjectofUser);
router.post("/", protect, uploadAssetsandThumbnail, validation(createProjectValidation), createProject);

router.delete("/remove/:id", protect, deleteProject);
router.delete("/remove", protect, deleteProject);

router.get("/detail/:slug", protect, getProjectPrivate);
router.get("/admin/reports", protect, admin, getProjectReports);
router.patch("/admin/reports/:id", protect, admin, updateProjectReportStatus);
router.get("/admin/analytics", protect, admin, getProjectAdminAnalytics);
router.get("/admin/reports-count", protect, admin, getProjectPendingReportCount);
router.get("/admin/:id/buyers", protect, admin, getProjectBuyers);
router.get("/admin/:id/downloads", protect, admin, getProjectDownloadLogs);
router.post("/admin/:id/check-demo", protect, admin, checkProjectDemoLink);
router.patch("/admin/:id/access/:userId", protect, admin, updateProjectDownloadAccess);
router.get("/access/:id", protect, getProjectAccess);
router.get("/license/verify/:licenseId", verifyProjectLicense);
router.get("/download/:id", protect, downloadProjectResource);
router.post("/report/:id", optionalProtect, reportProjectIssue);
router.patch("/featured/:projectId", protect, updateProjectFeaturedStatus);
router.patch("/visibility/:projectId", protect, updateProjectVisibility);
router.put("/:slug", protect, uploadAssetsandThumbnail, updateProject);
router.get("/:slug", getProject);

module.exports = router;
