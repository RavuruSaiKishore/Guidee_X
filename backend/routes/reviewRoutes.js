import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getReviewDetails,
  submitReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/:bookingId", protect, getReviewDetails);

router.post("/", protect, submitReview);

export default router;
