import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRE_IN,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
  AUTH_RATE_WINDOW,
  AUTH_RATE_MAX,
  USER_RATE_WINDOW,
  USER_RATE_MAX,
  ADMIN_RATE_WINDOW,
  ADMIN_RATE_MAX,
} = process.env;

export const SALT_ROUNDS = Number(process.env.SALT);
