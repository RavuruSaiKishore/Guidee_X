import express from "express";

import { getMyReviews } from "../controllers/mentorReviewController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/reviews", protect, getMyReviews);

export default router;
