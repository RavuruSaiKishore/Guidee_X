import express from "express";
import {
  createOrder,
  verifyPayment,
} from "../controllers/CoursePaymentController.js";
import { protect } from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.post("/verify-payment", protect, verifyPayment);

export default router;
