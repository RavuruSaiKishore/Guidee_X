import express from "express";

import {
  registerUser,
  loginUser,
  verifyOtpAndRegisterUser,
  forgotPassword,
  verifyForgotOtpAndResetPassword,
  resendOtp,
} from "../controllers/authController.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { googleAuth } from "../controllers/authController.js";

const router = express.Router();

router.post("/google", googleAuth);
router.post("/register", authLimiter, registerUser);
router.post("/verify-otp", authLimiter, verifyOtpAndRegisterUser);
router.post("/login", authLimiter, loginUser);
router.post("/resend-otp", authLimiter, resendOtp);

//FORGOT PASSWORD AND RESET PASSWORD
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, verifyForgotOtpAndResetPassword);

export default router;
