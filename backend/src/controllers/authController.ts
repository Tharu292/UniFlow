import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { isValidSLIITEmail } from "../utils/validateEmail";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";

/* ===========================
   TEMP STORAGE
=========================== */
let otpStore: { [key: string]: any } = {};
let resetTokens: { [key: string]: string } = {};
let changePasswordOTPStore: {
  [email: string]: { otp: string; expiresAt: number };
} = {};

/* ===========================
   REGISTER → SEND OTP
=========================== */
export const register = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      contactNumber,
      password,
      confirmPassword,
      role = "student",
      address,
      faculty,
      semester,
      year,
    } = req.body;

    // ❗ ONLY validate SLIIT email for STUDENTS
    if (role === "student" && !isValidSLIITEmail(email)) {
      return res.status(400).json({ message: "Only SLIIT emails allowed" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    /* ===========================
       ✅ ADMIN → DIRECT CREATE
    =========================== */
    if (role === "admin") {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "admin",
        verified: true, // ✅ NO OTP
      });

      return res.json({
        message: "Admin registered successfully",
        user,
      });
    }

    /* ===========================
       STUDENT → OTP FLOW
    =========================== */
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      userData: req.body,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);

    res.json({ message: "OTP sent to your email" });

  } catch (error: any) {
    console.error("🔥 Register Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ===========================
   VERIFY OTP → CREATE USER
=========================== */
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const record = otpStore[email];
    if (!record) {
      return res.status(400).json({ message: "No OTP request found" });
    }

    // ✅ CHECK EXPIRY
    if (record.expiresAt < Date.now()) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired" });
    }

    const cleanOtp = otp.trim();

    if (record.otp !== cleanOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const data = record.userData;
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      ...data,
      password: hashedPassword,
      verified: true,
    });

    delete otpStore[email];

    res.json({ message: "Registration successful" });
  } catch (error: any) {
    console.error("🔥 OTP Verify Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ===========================
   LOGIN
=========================== */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.firstLogin) {
      user.firstLogin = new Date();
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.json({ token, user });
  } catch (error: any) {
    console.error("🔥 Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ===========================
   FORGOT PASSWORD
=========================== */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!isValidSLIITEmail(email)) {
      return res.status(400).json({ message: "Only SLIIT emails allowed" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    resetTokens[token] = email;

    const link = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await sendEmail(email, "Reset Password", `Click here: ${link}`);

    res.json({ message: "Reset link sent" });
  } catch (error: any) {
    console.error("🔥 Forgot Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ===========================
   RESET PASSWORD
=========================== */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    const email = resetTokens[token];
    if (!email)
      return res.status(400).json({ message: "Invalid token" });

    const hashed = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate({ email }, { password: hashed });

    delete resetTokens[token];

    res.json({ message: "Password reset successful" });
  } catch (error: any) {
    console.error("🔥 Reset Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ===========================
   RESEND OTP
=========================== */
export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const record = otpStore[email];
    if (!record) {
      return res.status(400).json({ message: "No OTP request found" });
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email].otp = newOtp;
    otpStore[email].expiresAt = Date.now() + 5 * 60 * 1000;

    await sendEmail(email, "Resent OTP", `Your new OTP is: ${newOtp}`);

    res.json({ message: "OTP resent successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ===========================
   REQUEST CHANGE PASSWORD OTP
=========================== */
export const requestChangePasswordOTP = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    changePasswordOTPStore[user.email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    await sendEmail(user.email, "Change Password OTP", `Your OTP is: ${otp}`);

    res.json({ message: "OTP sent", email: user.email });
  } catch (err: any) {
    console.error("🔥 Change Password OTP Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/* ===========================
   VERIFY CHANGE PASSWORD OTP
=========================== */
export const verifyChangePasswordOTP = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const record = changePasswordOTPStore[email];
    if (!record) {
      return res.status(400).json({ message: "No OTP request found" });
    }

    // ✅ EXPIRE CHECK
    if (record.expiresAt < Date.now()) {
      delete changePasswordOTPStore[email];
      return res.status(400).json({ message: "OTP expired" });
    }

    // ✅ TRIM FIX (IMPORTANT)
    const cleanOtp = otp.trim();

    if (record.otp !== cleanOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate({ email }, { password: hashed });

    delete changePasswordOTPStore[email];

    res.json({ message: "Password updated successfully" });
  } catch (err: any) {
    console.error("🔥 Verify Change Password OTP Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
/* ===========================
   CHANGE PASSWORD (DIRECT)
=========================== */
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
