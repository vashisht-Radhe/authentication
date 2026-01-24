import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { JWT_EXPIRE_IN, JWT_SECRET, PORT } from "../config/env.js";
import { throwError } from "../utils/errorHandler.js";
import {
  forgetPasswordService,
  loginService,
  registerService,
  resetPasswordService,
} from "../services/auth.service.js";
import {
  sendForgetPassword,
  sendOtp,
  sendWelcome,
} from "../services/email.service.js";
import {
  resendEmailOtpService,
  verifyEmailOtpService,
} from "../services/otp.service.js";

export const register = async (req, res, next) => {
  try {
    const { user, token, otp } = await registerService(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { token, user },
    });

    const expiresText = "in 10 minutes";

    sendOtp({
      name: user.firstName,
      email: user.email,
      otp,
      expiresText,
    }).catch(console.error);

    sendWelcome({
      name: user.firstName,
      email: user.email,
    }).catch(console.error);
  } catch (error) {
    next(error);
  }
};

export const verifyEmailOtp = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const { _id: userId } = req.user;

    if (!otp) {
      throwError("OTP is required", 400);
    }

    const user = await User.findById(userId);

    if (!user) throwError("User not found", 404);

    await verifyEmailOtpService(user, otp);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const resendOtp = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const user = await User.findById(userId);

    if (!user) throwError("User not found", 404);

    const { otp } = await resendEmailOtpService(user);

    const expiresText = "in 10 minutes";

    sendOtp({
      name: user.firstName,
      email,
      otp,
      expiresText,
    }).catch(console.error);

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { user, token } = await loginService(req.body);

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        token,
        user: user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await forgetPasswordService(email);

    return res.status(200).json({
      message:
        "If the email exists, a reset link has been sent (check console)",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    await resetPasswordService(token, newPassword);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};
