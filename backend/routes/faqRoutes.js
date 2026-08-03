import express from "express";

import {
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  toggleFAQStatus,
} from "../controllers/faqController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/allfaq", protect, getAllFAQs);

router.get("/faq/:id", protect, getFAQById);

router.post("/createfaqs", protect, createFAQ);

router.put("/update/:id", protect, updateFAQ);

router.delete("/delete/:id", protect, deleteFAQ);

router.patch("/:id/status", protect, toggleFAQStatus);

export default router;
