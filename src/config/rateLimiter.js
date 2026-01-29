import rateLimit from "express-rate-limit";
import {
  ADMIN_RATE_MAX,
  ADMIN_RATE_WINDOW,
  AUTH_RATE_MAX,
  AUTH_RATE_WINDOW,
  USER_RATE_MAX,
  USER_RATE_WINDOW,
} from "./env.js";

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs: Number(windowMs),
    max: Number(max),
    message: {
      success: false,
      message,
    },
  });

export const authLimiter = createLimiter(
  AUTH_RATE_WINDOW || 15 * 60 * 1000,
  AUTH_RATE_MAX || 5,
  "Too many authentication attempts. Try again later.",
);

export const userLimiter = createLimiter(
  USER_RATE_WINDOW || 15 * 60 * 1000,
  USER_RATE_MAX || 60,
  "Too many requests. Slow down.",
);

export const adminLimiter = createLimiter(
  ADMIN_RATE_WINDOW || 15 * 60 * 1000,
  ADMIN_RATE_MAX || 20,
  "Admin rate limit exceeded.",
);
