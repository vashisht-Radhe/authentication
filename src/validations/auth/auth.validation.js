import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).trim(),
    lastName: z.string().trim().optional(),
    email: z.string().email().toLowerCase(),
    password: z.string().min(8),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email().toLowerCase(),
    password: z.string().min(1, "Password is required"),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    otp: z.string().length(6).regex(/^\d+$/, "OTP must contain only numbers"),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email().toLowerCase(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1),
    newPassword: z.string().min(8),
  }),
});
