const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  verifyEmail,
  logout,
} = require("../../controllers/v1/authController.js");


router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/logout", logout);

module.exports = router;
