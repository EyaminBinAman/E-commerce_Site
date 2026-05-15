const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createMailTransporter = require("../../config/mail");
const User = require("../../models/User");

// Utility functions
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Token generation functions
const createAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  });
};

// Refresh token generation function
const createRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });
};

// Cookie options function
const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge,
});

// Function to send verification email

const sendVerificationEmail = async (email, code) => {
  const transporter = createMailTransporter();

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Verify your email",
    text: `Your verification code is ${code}. This code will expire in 10 minutes.`,
    html: `<p>Your verification code is <strong>${code}</strong>.</p><p>This code will expire in 10 minutes.</p>`,
  });
};

const sendPasswordResetEmail = async (email, code) => {
  const transporter = createMailTransporter();

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Reset your password",
    text: `Your password reset code is ${code}. This code will expire in 10 minutes.`,
    html: `<p>Your password reset code is <strong>${code}</strong>.</p><p>This code will expire in 10 minutes.</p>`,
  });
};

const sendAccountUpdateEmail = async (email, code) => {
  const transporter = createMailTransporter();

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Confirm your account update",
    text: `Your account update code is ${code}. This code will expire in 10 minutes.`,
    html: `<p>Your account update code is <strong>${code}</strong>.</p><p>This code will expire in 10 minutes.</p>`,
  });
};

// Common function to handle authentication responses
const handleAuthResponse = async (res, user, statusCode, message) => {
  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie(
    "accessToken",
    accessToken,
    cookieOptions(15 * 60 * 1000)
  );

  res.cookie(
    "refreshToken",
    refreshToken,
    cookieOptions(7 * 24 * 60 * 60 * 1000)
  );

  return res.status(statusCode).json({
    success: true,
    message,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
    },
  });
};

// Signup controller
const signup = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone, and password are required",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode();

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      otp: verificationCode,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendVerificationEmail(user.email, verificationCode);

    return handleAuthResponse(res, user, 201, "User registered successfully");
  } catch (error) {
    next(error);
  }
};

 // Login controller
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return handleAuthResponse(res, user, 200, "Login successful");
  } catch (error) {
    next(error);
  }
};

const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can log in to the admin site",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return handleAuthResponse(res, user, 200, "Admin login successful");
  } catch (error) {
    next(error);
  }
};
 // Verify email controller
const verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Email is already verified",
      });
    }

    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "No verification code found for this user",
      });
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired",
      });
    }

    if (user.otp !== code) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before resetting your password",
      });
    }

    const resetCode = generateVerificationCode();

    user.otp = resetCode;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendPasswordResetEmail(user.email, resetCode);

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email",
    });
  } catch (error) {
    next(error);
  }
};

const verifyResetOtp = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and reset code are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "No password reset OTP found for this user",
      });
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Password reset OTP has expired",
      });
    }

    if (user.otp !== code) {
      return res.status(400).json({
        success: false,
        message: "Invalid password reset OTP",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password reset OTP verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, reset code, and new password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "No password reset OTP found for this user",
      });
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Password reset OTP has expired",
      });
    }

    if (user.otp !== code) {
      return res.status(400).json({
        success: false,
        message: "Invalid password reset OTP",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiresAt = null;
    user.refreshToken = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

const requestUpdateOtp = async (req, res, next) => {
  try {
    const { type } = req.body;

    if (!type || !["phone", "password"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "A valid update type is required",
      });
    }

    const user = req.user;

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before requesting account updates",
      });
    }

    const updateCode = generateVerificationCode();
    user.otp = updateCode;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendAccountUpdateEmail(user.email, updateCode);

    return res.status(200).json({
      success: true,
      message: `OTP sent to your email for ${type} update`,
    });
  } catch (error) {
    next(error);
  }
};

const updatePhone = async (req, res, next) => {
  try {
    const { code, phone } = req.body;

    if (!code || !phone) {
      return res.status(400).json({
        success: false,
        message: "OTP code and phone are required",
      });
    }

    const user = req.user;

    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "No OTP found for this request",
      });
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    if (user.otp !== code) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.phone = phone;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Phone updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { code, currentPassword, newPassword } = req.body;

    if (!code || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "OTP code, current password, and new password are required",
      });
    }

    const user = req.user;

    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "No OTP found for this request",
      });
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    if (user.otp !== code) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const isPasswordMatched = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiresAt = null;
    user.refreshToken = null;
    await user.save();

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully. Please log in again.",
    });
  } catch (error) {
    next(error);
  }
};

const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const user = req.user;
    user.profilePic = `/uploads/users/${req.file.filename}`;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      profilePic: user.profilePic,
    });
  } catch (error) {
    next(error);
  }
};

// Logout controller
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      const user = await User.findOne({ refreshToken });

      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};



module.exports = {
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
};
