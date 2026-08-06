import express from "express";

import {
  getChatMentors,
  startMentorChat,
  createMentorContact,
  getMyMentorContacts,
  getMentorContactById,
  mentorReply,
  getAllMentorContacts,
  getAdminMentorContactById,
  replyToMentor,
  updateMentorContactStatus,
  deleteMentorContact,
} from "../controllers/mentorContactController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================
// Mentor Routes
// ==========================



router.post("/", protect, createMentorContact);

router.get("/my", protect, getMyMentorContacts);

router.get("/my/:id", protect, getMentorContactById);

router.post("/:id/reply", protect, mentorReply);

// ==========================
// Admin Routes
// ==========================

router.get("/admin/mentors", protect, getChatMentors);

router.post("/admin/start-chat", protect, startMentorChat);

router.get("/admin/all", protect, getAllMentorContacts);

router.get("/admin/:id", protect, getAdminMentorContactById);

router.put("/admin/:id/reply", protect, replyToMentor);

router.put("/admin/:id/status", protect, updateMentorContactStatus);

router.delete("/admin/:id", protect, deleteMentorContact);
router.delete("/admin/:id", protect, deleteMentorContact);

export default router;
