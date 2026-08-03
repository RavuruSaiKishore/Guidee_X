import express from "express";

import {
  getMentorStudents,
  getMentorStudentProfile,
  addMentorStudentNote,
  deleteMentorStudentNote,
} from "../controllers/mentorStudentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/students", protect, getMentorStudents);

router.get("/students/:studentId", protect, getMentorStudentProfile);

router.post("/students/:studentId/notes", protect, addMentorStudentNote);

router.delete(
  "/students/:studentId/notes/:noteId",
  protect,
  deleteMentorStudentNote
);

export default router;
