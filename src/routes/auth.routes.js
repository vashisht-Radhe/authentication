import express from "express";
import {
  forgetPassword,
  login,
  logout,
  register,
  resendOtp,
  resetPassword,
  verifyEmailOtp,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/verify-otp", protect, verifyEmailOtp);
authRoutes.post("/resend-otp", protect, resendOtp);
authRoutes.post("/logout", protect, logout);
authRoutes.post("/forgot-password", forgetPassword);
authRoutes.post("/reset-password", resetPassword);
export default authRoutes;
