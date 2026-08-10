import express from "express";
import {
  joinMeeting,
  endMeeting,
  completeMeetingSession,
} from "../controllers/meetingController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Join Meeting
router.get("/:roomId", protect, joinMeeting);

// End Meeting
router.put("/:roomId/end", protect, endMeeting);

router.put("/:roomId/complete", protect, completeMeetingSession);

export default router;
