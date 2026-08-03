import express from "express";

import {
  registerUser,
  loginUser,
  verifyOtpAndRegisterUser,
  forgotPassword,
  verifyForgotOtpAndResetPassword,
} from "../controllers/authController.js";

const router = express.Router();


router.post("/register", registerUser);
router.post("/verify-otp", verifyOtpAndRegisterUser);
router.post("/login", loginUser);

//FORGOT PASSWORD AND RESET PASSWORD
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", verifyForgotOtpAndResetPassword);

export default router;
