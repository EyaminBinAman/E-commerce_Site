const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth.middleware.js");
const { createImageUpload } = require("../../utils/upload.js");
const {
  signup,
  login,
  adminLogin,
  verifyEmail,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  requestUpdateOtp,
  updatePhone,
  changePassword,
  uploadProfileImage,
  logout,
} = require("../../controllers/v1/authController.js");

const userImageUpload = createImageUpload({ folder: "users", maxSizeKB: 500 });


router.post("/signup", signup);
router.post("/login", login);
router.post("/admin-login", adminLogin);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
router.post("/request-update-otp", protect, requestUpdateOtp);
router.patch("/update-phone", protect, updatePhone);
router.patch("/change-password", protect, changePassword);
router.patch("/profile-image",protect,userImageUpload.single("image"),uploadProfileImage);
router.post("/logout", protect, logout);


module.exports = router;
