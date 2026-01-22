import express from "express";
import {
  login,
  logout,
  register,
  resendOtp,
  verifyEmailOtp,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/verify-otp", protect, verifyEmailOtp);
authRoutes.post("/resend-otp", protect, resendOtp);
authRoutes.post("/logout", protect, logout);
export default authRoutes;
