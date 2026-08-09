import express from "express";

import {
  registerUser,
  loginUser,
  verifyOtpAndRegisterUser,
  forgotPassword,
  verifyForgotOtpAndResetPassword,
} from "../controllers/authController.js";
import { authLimiter } from "../middleware/rateLimiter.js";
const router = express.Router();


router.post("/register", authLimiter, registerUser);
router.post("/verify-otp", authLimiter, verifyOtpAndRegisterUser);
router.post("/login", authLimiter, loginUser);

//FORGOT PASSWORD AND RESET PASSWORD
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, verifyForgotOtpAndResetPassword);

export default router;
