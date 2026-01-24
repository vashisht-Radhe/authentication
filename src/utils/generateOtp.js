import crypto from "crypto";
import { OTP_EXPIRY } from "../constants/otp.constants.js";

export const generateOtp = () => {
  const otp = crypto.randomInt(100000, 999999).toString();

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  const expiresAt = new Date(Date.now() + OTP_EXPIRY); 

  return {
    otp,
    hashedOtp,
    expiresAt,
  };
};
