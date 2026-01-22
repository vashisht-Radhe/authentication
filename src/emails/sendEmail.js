import { EMAIL_USERNAME } from "../config/env.js";
import transporter from "../config/nodemiler.config.js";

const sendEmail = async ({ to, subject, html }) => {
  return await transporter.sendMail({
    from: EMAIL_USERNAME,
    to,
    subject,
    html,
  });
};

export default sendEmail;
