import express from "express";

import {
  createEventOrder,
  verifyEventPayment,
} from "../controllers/eventPaymentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order/:eventId", protect, createEventOrder);

router.post("/verify", protect, verifyEventPayment);

export default router;
