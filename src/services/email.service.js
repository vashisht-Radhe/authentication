import sendEmail from "../emails/sendEmail.js";
import { template } from "../emails/templates.js";

export const sendWelcome = async ({ name, email }) => {
  if (!email) return;

  try {
    await sendEmail({
      to: email,
      ...template.welcome({ name }),
    });
  } catch (error) {
    console.error("Welcome email failed:", error.message);
  }
};

export const sendOtp = async ({ email, name, otp, expiresText }) => {
  if (!email) return;

  try {
    await sendEmail({
      to: email,
      ...template.otp({ name, otp, expiresText }),
    });
  } catch (error) {
    console.error("OTP email failed:", error.message);
  }
};

export const sendResendOtp = async ({ email, name, otp, expiresText }) => {
  if (!email) return;

  try {
    await sendEmail({
      to: email,
      ...template.resendOtp({ name, otp, expiresText }),
    });
  } catch (error) {
    console.error("Resend OTP email failed:", error.message);
  }
};
