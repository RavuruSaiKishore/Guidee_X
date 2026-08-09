// utils/sendSecurityEmail.js
import axios from "axios";

export const sendSecurityEmail = async ({
  email,
  firstName,
  alertType,
  ipAddress,
  userAgent,
}) => {
  if (!process.env.BREVO_API_KEY) return;

  let subject = "Security Alert: New Login Detected";
  let messageBody = "A new login to your GuideX account was detected.";

  if (alertType === "password_reset") {
    subject = "Security Alert: Password Changed";
    messageBody =
      "Your GuideX account password was recently changed. If you did not perform this action, please secure your account immediately.";
  } else if (alertType === "new_device") {
    subject = "Security Alert: Login from a new device/IP";
    messageBody = `We noticed a login to your account from a new IP address: <strong>${
      ipAddress || "Unknown"
    }</strong>.`;
  }

  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "GuideX Security",
          email: "ravurusaikishore@gmail.com",
        },
        to: [{ email, name: firstName }],
        subject,
        htmlContent: `
          <div style="max-width:500px; margin:30px auto; padding:30px; font-family:Arial,sans-serif; background:#ffffff; border-radius:12px; border:1px solid #e5e7eb; color:#374151;">
            <h2 style="color:#4f46e5; text-align:center;">GuideX Security</h2>
            <h3 style="color:#111827;">${subject}</h3>
            <p>Hello <strong>${firstName || "User"}</strong>,</p>
            <p>${messageBody}</p>
            <div style="background:#f3f4f6; padding:12px; border-radius:8px; font-size:13px; margin:20px 0;">
              <p style="margin:0;"><strong>IP Address:</strong> ${
                ipAddress || "N/A"
              }</p>
              <p style="margin:5px 0 0;"><strong>Time:</strong> ${new Date().toUTCString()}</p>
            </div>
            <p style="font-size:13px; color:#6b7280;">If this was you, you can safely ignore this email.</p>
            <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;">
            <p style="text-align:center; font-size:12px; color:#9ca3af;">© ${new Date().getFullYear()} GuideX Security Team</p>
          </div>
        `,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(
      "Failed to send security alert email:",
      error.response?.data || error.message
    );
  }
};
