import nodemailer from "nodemailer";
import { EMAIL_USERNAME, EMAIL_PASSWORD } from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD,
  },
});

export default transporter;
