import User from "../models/Student.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import OTP from "../models/Otp.js";
import nodemailer from "nodemailer";
import createAuditLog from "../utils/createAuditLog.js";
import { Resend } from "resend";
import axios from "axios";


export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // Store OTP
    await OTP.findOneAndUpdate(
      { email },
      {
        email,
        otp: hashedOtp,
        expiresAt: Date.now() + 10 * 60 * 1000,
        userData: {
          firstName,
          lastName,
          email,
          password,
          role,
          phone,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    // ==========================
    // SEND OTP USING BREVO API
    // ==========================

    if (!process.env.BREVO_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "BREVO_API_KEY is missing.",
      });
    }

    try {
      await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            name: "GuideX",
            email: "ravurusaikishore@gmail.com",
          },

          to: [
            {
              email: email,
              name: `${firstName} ${lastName}`,
            },
          ],

          subject: "Verify Your GuideX Account",

          htmlContent: `
      <div style="
        max-width:500px;
        margin:30px auto;
        padding:30px;
        font-family:Arial,sans-serif;
        background:#ffffff;
        border-radius:12px;
        border:1px solid #e5e7eb;
        text-align:center;
      ">

        <h1 style="color:#4f46e5;">GuideX</h1>

        <p>Learn. Connect. Grow.</p>

        <h2>Verify Your Account</h2>

        <p>Hello <strong>${firstName}</strong>,</p>

        <p>Your verification OTP is:</p>

        <div style="
          font-size:34px;
          font-weight:bold;
          letter-spacing:8px;
          color:#4f46e5;
          margin:20px 0;
        ">
          ${otp}
        </div>

        <p>
          This OTP is valid for
          <strong>10 minutes</strong>.
        </p>

        <p>
          If you didn't request this,
          please ignore this email.
        </p>

        <hr>

        <small>
          © ${new Date().getFullYear()} GuideX
        </small>

      </div>
      `,

          textContent: `Hello ${firstName},

Your GuideX verification OTP is: ${otp}

This OTP is valid for 10 minutes.

If you did not create this account, please ignore this email.

Regards,
GuideX Team`,
        },
        {
          headers: {
            accept: "application/json",
            "api-key": process.env.BREVO_API_KEY,
            "content-type": "application/json",
          },
        }
      );

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
        error: error.response?.data || error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOtpAndRegisterUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (hashedOtp !== otpRecord.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const { firstName, lastName, password, role, phone } = otpRecord.userData;

    // 🔐 HASH PASSWORD HERE
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || "student",
      phone,
      isVerified: true,
    });

    await createAuditLog({
      req,
      user: {
        ...user.toObject(),
        role: "Student",
      },
      action: "Register",
      module: "Authentication",
      description: "Student account registered successfully.",
      targetId: user._id,
      targetType: "Student",
    });

    // 🔐 GENERATE TOKEN
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // DELETE OTP AFTER SUCCESS
    await OTP.deleteOne({ email });

    res.status(201).json({
      success: true,
      message: "User verified & registered successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Forget password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    await OTP.findOneAndUpdate(
      { email },
      {
        email,
        otp: hashedOtp,
        expiresAt: Date.now() + 10 * 60 * 1000,
        type: "reset", // 🔥 important differentiate
      },
      { upsert: true }
    );
    

    if (!process.env.BREVO_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "BREVO_API_KEY is missing.",
      });
    }


     const response = await axios.post(
       "https://api.brevo.com/v3/smtp/email",
       {
         sender: {
           name: "GuideX",
           email: "ravurusaikishore@gmail.com",
         },
         to: [
           {
             email,
             name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
           },
         ],
         subject: "Reset Your GuideX Password",

         textContent: `Hello ${user.firstName || "there"},

Your GuideX password reset OTP is: ${otp}

This OTP is valid for 10 minutes.

If you did not request this, please ignore this email.

Regards,
The GuideX Team`,

         htmlContent: `
        <div style="
          max-width:500px;
          margin:30px auto;
          padding:30px;
          background:#ffffff;
          border-radius:12px;
          font-family:Arial,sans-serif;
          color:#374151;
          text-align:center;
          border:1px solid #e5e7eb;
        ">

          <h1 style="
            margin:0;
            color:#059669;
            font-size:28px;
          ">
            GuideX
          </h1>

          <p style="
            color:#6b7280;
            margin:8px 0 25px;
          ">
            Learn. Connect. Grow.
          </p>

          <h2 style="
            color:#111827;
            margin-bottom:10px;
          ">
            Reset Your Password
          </h2>

          <p style="
            font-size:15px;
            line-height:1.6;
          ">
            Hello <strong>${user.firstName || "there"}</strong>,
          </p>

          <p style="
            font-size:15px;
            line-height:1.6;
          ">
            Use the OTP below to reset your GuideX password.
          </p>

          <div style="
            margin:25px auto;
            padding:15px;
            background:#ecfdf5;
            border:2px dashed #10b981;
            border-radius:10px;
            font-size:30px;
            font-weight:bold;
            letter-spacing:8px;
            color:#047857;
          ">
            ${otp}
          </div>

          <p style="
            color:#92400e;
            font-size:14px;
            background:#fffbeb;
            padding:10px;
            border-radius:6px;
          ">
            This OTP is valid for <strong>10 minutes</strong>.
          </p>

          <p style="
            margin-top:25px;
            color:#6b7280;
            font-size:13px;
            line-height:1.6;
          ">
            If you did not request a password reset, you can safely ignore this email.
          </p>

          <hr style="
            border:none;
            border-top:1px solid #e5e7eb;
            margin:25px 0;
          ">

          <p style="
            margin:0;
            color:#9ca3af;
            font-size:12px;
          ">
            © ${new Date().getFullYear()} GuideX · The GuideX Team
          </p>

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

     if (response.status !== 201) {
       return res.status(500).json({
         success: false,
         message: "Failed to send reset OTP email",
       });
     }

    await createAuditLog({
      req,
      user: {
        ...user.toObject(),
        role: "Student",
      },
      action: "Forgot Password",
      module: "Authentication",
      description: "Password reset OTP requested.",
      targetId: user._id,
      targetType: "Student",
    });

    res.json({ message: "Reset OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// verify the password
export const verifyForgotOtpAndResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const record = await OTP.findOne({ email });

    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (record.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (hashedOtp !== record.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    // Audit logging system
    const user = await User.findOne({ email }).select("-password");

    await createAuditLog({
      req,
      user: {
        ...user.toObject(),
        role: "Student",
      },
      action: "Reset Password",
      module: "Authentication",
      description: "Student reset account password.",
      targetId: user._id,
      targetType: "Student",
    });

    await OTP.deleteOne({ email });

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login code
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    user.lastLogin = new Date();
    user.isActive = true;
    await user.save();

    const token = generateToken(user._id, user.role);

    // Fetch complete user without password
    const loggedInUser = await User.findById(user._id).select("-password");

    //Audit logging System
    await createAuditLog({
      req,
      user: {
        ...loggedInUser.toObject(),
        role: "Student",
      },
      action: "Login",
      module: "Authentication",
      description: "Student logged into the system.",
      targetId: loggedInUser._id,
      targetType: "Student",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: loggedInUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
