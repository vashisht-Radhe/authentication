import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { JWT_EXPIRE_IN, JWT_SECRET } from "../config/env.js";
import { throwError } from "../utils/errorHandler.js";
import { sendOtp, sendWelcome } from "../services/email.service.js";
import { generateOtp } from "../utils/generateOtp.js";

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !email || !password) {
      throwError("All fields are required", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      if (existingUser.isDeleted) {
        throwError(
          "This account was permanently deleted and cannot be registered again",
          403,
        );
      }

      if (!existingUser.isActive) {
        throwError(
          "This account is deactivated. Please log in to reactivate it",
          403,
        );
      }

      throwError("User already exists", 409);
    }

    const { otp, hashedOtp, expiresAt } = generateOtp();

    const user = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      password,
      emailOtp: hashedOtp,
      emailOtpExpires: expiresAt,
    });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRE_IN,
    });

    user.password = undefined;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { token, user },
    });

    const expiresText = "in 10 minutes";

    sendOtp({
      name: user.firstName,
      email: normalizedEmail,
      otp,
      expiresText,
    }).catch(console.error);

    sendWelcome({
      name: user.firstName,
      email: normalizedEmail,
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

    if (user.isVerified) {
      throwError("Email already verified", 400);
    }

    if (!user.emailOtp || !user.emailOtpExpires) {
      throwError("Invalid or expired OTP", 400);
    }

    if (user.emailOtpExpires < Date.now()) {
      user.emailOtp = undefined;
      user.emailOtpExpires = undefined;
      await user.save();
      throwError("OTP expired", 400);
    }

    const hashedInputOtp = crypto
      .createHash("sha256")
      .update(String(otp))
      .digest("hex");

    if (hashedInputOtp !== user.emailOtp) {
      throwError("Invalid OTP", 400);
    }

    user.isVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpires = undefined;

    await user.save();

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

    const normalizedEmail = user.email.trim().toLowerCase();
    console.log(normalizedEmail);

    if (!user) throwError("User not found", 404);

    if (user.isVerified) {
      throwError("Email already verified", 400);
    }

    const { otp, hashedOtp, expiresAt } = generateOtp();

    user.emailOtp = hashedOtp;
    user.emailOtpExpires = expiresAt;
    await user.save();

    const expiresText = "in 10 minutes";

    sendOtp({
      name: user.firstName,
      email: normalizedEmail,
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
    const { email, password } = req.body;

    if (!email || !password) {
      throwError("Email and password are required", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );

    if (!user) {
      throwError("Invalid email or password", 401);
    }

    if (user.isDeleted) {
      throwError(
        "This account has been permanently deleted and cannot be recovered",
        403,
      );
    }

    if (!user.isActive && user.deactivatedBy === "admin") {
      throwError(
        "Your account has been deactivated by admin. Please contact support.",
        403,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throwError("Invalid email or password", 401);
    }

    if (!user.isActive) {
      user.isActive = true;
      user.deactivatedAt = null;
      user.deactivatedBy = null;
      await user.save();
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRE_IN,
    });
    user.password = undefined;

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
