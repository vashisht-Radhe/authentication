export const template = {
  welcome: ({ name }) => ({
    subject: "Welcome to Our Platform 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1>Welcome, ${name} 👋</h1>
        <p>
          We're excited to have you on board. Your account has been
          successfully created.
        </p>
        <p>
          If you have any questions, feel free to reply to this email.
        </p>
        <br />
        <p>Cheers,<br /><strong>The Team</strong></p>
      </div>
    `,
  }),

  otp: ({ name, otp, expiresText }) => ({
    subject: "Your One-Time Password (OTP)",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello ${name},</h2>
        <p>
          Use the OTP below to continue.
          This code will expire <strong>${expiresText}</strong>.
        </p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>If you did not request this code, please ignore this email.</p>
        <br />
        <p><strong>Security Team</strong></p>
      </div>
    `,
  }),

  resendOtp: ({ name, otp, expiresText }) => ({
    subject: "Your New OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello ${name} 👋</h2>

        <p>You requested a new verification code.</p>

        <h1 style="letter-spacing: 4px; text-align: center;">
          ${otp}
        </h1>

        <p>
          This OTP will expire <strong>${expiresText}</strong>.
        </p>

        <p style="color: #555;">
          ⚠️ Any previously sent OTPs are no longer valid.
        </p>

        <br />
        <p><strong>Security Team</strong></p>
      </div>
    `,
  }),
};
