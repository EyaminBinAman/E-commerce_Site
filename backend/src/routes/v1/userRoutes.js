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
  updateProfile,
  updatePhone,
  changePassword,
  uploadProfileImage,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  deleteAccount,
  logout,
  getCurrentUser,
} = require("../../controllers/v1/authController.js");
const { admin } = require("../../middleware/auth.middleware.js");

const userImageUpload = createImageUpload({ folder: "users", maxSizeKB: 2048 });


router.post("/signup", signup);
router.post("/login", login);
router.post("/admin-login", adminLogin);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
router.post("/request-update-otp", protect, requestUpdateOtp);
router.patch("/profile", protect, updateProfile);
router.patch("/update-phone", protect, updatePhone);
router.patch("/change-password", protect, changePassword);
router.patch("/profile-image",protect,userImageUpload.single("image"),uploadProfileImage);
router.post("/addresses", protect, addAddress);
router.patch("/addresses/:addressId", protect, updateAddress);
router.patch("/addresses/:addressId/default", protect, setDefaultAddress);
router.delete("/addresses/:addressId", protect, deleteAddress);
router.delete("/account", protect, deleteAccount);
router.post("/logout", protect, logout);
router.get("/me", protect, getCurrentUser);


module.exports = router;
