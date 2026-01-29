import crypto from "crypto";
import { generateOtp } from "../utils/generateOtp.js";
import {
  OTP_BLOCK_TIME,
  OTP_RESEND_COOLDOWN,
  MAX_OTP_ATTEMPTS,
} from "../constants/otp.constants.js";
import { throwError } from "../utils/errorHandler.js";

export const verifyEmailOtpService = async (user, otp) => {
  if (user.isVerified) {
    throwError("Email already verified", 400);
  }

  if (user.otpBlockedUntil && user.otpBlockedUntil > Date.now()) {
    throwError("Too many OTP attempts. Try again after 24 hours.", 429);
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
    user.otpAttempts = (user.otpAttempts || 0) + 1;

    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
      user.otpBlockedUntil = Date.now() + OTP_BLOCK_TIME;
    }

    await user.save();
    throwError("Invalid OTP", 400);
  }

  user.isVerified = true;
  user.emailOtp = undefined;
  user.emailOtpExpires = undefined;
  user.otpAttempts = 0;

  await user.save();

  return true;
};

export const resendEmailOtpService = async (user) => {
  if (user.isVerified) {
    throwError("Email already verified", 400);
  }

  if (user.otpLastSent && Date.now() - user.otpLastSent < OTP_RESEND_COOLDOWN) {
    throwError("Please wait before requesting another OTP", 429);
  }

  const { otp, hashedOtp, expiresAt } = generateOtp();

  user.emailOtp = hashedOtp;
  user.emailOtpExpires = expiresAt;
  user.otpAttempts = 0;
  user.otpBlockedUntil = undefined;
  user.otpLastSent = Date.now();

  await user.save();

  return {
    otp,
    email: user.email,
    name: user.firstName,
  };
};
