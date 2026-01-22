import crypto from "crypto";

export const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  return {
    otp,
    hashedOtp,
    expiresAt,
  };
};
