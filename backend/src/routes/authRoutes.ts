import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyOTP,
  resendOTP,
  changePassword

} from "../controllers/authController";
import { verifyToken } from "../middleware/authMiddleware";
import {
  requestChangePasswordOTP,
  verifyChangePasswordOTP,
} from "../controllers/authController";

const router = express.Router();

// ==========================
// AUTH ROUTES
// ==========================
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/change-password", verifyToken,changePassword);
// request OTP after current password verification
router.post("/change-password/request-otp", verifyToken, requestChangePasswordOTP);

// verify OTP & update password
router.post("/change-password/verify", verifyChangePasswordOTP);

export default router;