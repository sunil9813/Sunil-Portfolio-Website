const express = require("express");
const router = express.Router();
const validation = require("../../middleware/Validation");
const { CreateUser, UserPassword, changePasswordVld } = require("../../utils/validations/UserValidation");
const {
  register,
  login,
  logout,
  getUserProfile,
  updateUserProfile,
  loginStatus,
  sendVerificationEmail,
  verifiedToUser,
  forgotPassword,
  resetPassword,
  changePassword,
  sendOTPctr,
  loginWithOTP,
  loginWithGoogle,
  deleteAccount,
  getAllAccounts,
  getAccount,
  deleteAccountByAdmin,
  updateRole,
  adminLogin,
  profileCoverUpload,
  sendAutomatedEmail,
  createLinks,
  getLinks,
  deleteLink,
  updateLink,
  getUserLinks,
  toggleFollow,
  getUserFollowers,
  getUserFollowing,
  getUserProfileforPublicUser,
} = require("../../controllers/users/UserControllers");
const { protect, admin, verified } = require("../../middleware/authMiddleware");
const { upload, uploadProfileImage } = require("../../utils/uploadImg");

/* ----------- Public User Access ------------ */
router.post("/register", validation(CreateUser), register);
router.post("/login", login);
router.post("/admin/login", adminLogin);
router.post("/google/callback", loginWithGoogle);
/* ----------- Public User Access ------------ */

/* ######### Private User Access ######### */
router.get("/logout", logout);
router.get("/profile", protect, getUserProfile);
router.put("/profile/update", protect, uploadProfileImage.single("avatar"), updateUserProfile);

router.put("/profile/cover", protect, uploadProfileImage.single("cover"), profileCoverUpload);

router.get("/login-status", loginStatus);

router.post("/send-email", protect, sendAutomatedEmail);
router.post("/send-verification-email", protect, sendVerificationEmail);
router.patch("/verify-account/:verificationToken", verifiedToUser);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:resetToken", validation(UserPassword), resetPassword);
router.patch("/change-password", protect, validation(changePasswordVld), changePassword);
router.post("/send-otp/:email", sendOTPctr);
router.post("/loginwith-otp/:email", loginWithOTP);
router.delete("/profile", deleteAccount);

router.post("/toggleFollow/:userId", protect, verified, toggleFollow);
router.get("/followers/:userId", protect, verified, getUserFollowers);
router.get("/following/:userId", protect, verified, getUserFollowing);
router.get("/public-profile/:username", getUserProfileforPublicUser);

/* ######### Private User Access ######### */

/* --- ****** Admin User Access ****** --- */
router.get("/admin/users", protect, verified, admin, getAllAccounts);
router.post("/admin/user", protect, verified, admin, getAccount);
router.get("/admin/user/:id", protect, verified, admin, getAccount);
router.delete("/admin/user/delete/:id", protect, verified, admin, deleteAccountByAdmin);
router.delete("/admin/user/delete", protect, verified, admin, deleteAccountByAdmin);
router.patch("/admin/user", protect, verified, admin, updateRole);
/* --- ****** Admin User Access ****** --- */

/* --- ****** Soical Media Link ****** --- */
router.post("/user/link", protect, verified, createLinks);
router.get("/user/link", protect, verified, getLinks);
router.delete("/user/link/:id", protect, verified, deleteLink);
router.put("/user/link/:id", protect, verified, updateLink);
router.get("/user/link/:id", getUserLinks);

/* --- ****** Soical Media Link ****** --- */
module.exports = router;
