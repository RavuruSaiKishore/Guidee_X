import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createEventOrder,
  verifyEventPayment,
} from "../controllers/eventPaymentController.js";

const router = express.Router();

router.post("/create-order", protect, createEventOrder);
router.post("/verify", protect, verifyEventPayment);

export default router;
