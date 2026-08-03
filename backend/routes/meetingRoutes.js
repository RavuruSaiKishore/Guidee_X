import express from "express";
import { joinMeeting, endMeeting } from "../controllers/meetingController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Join Meeting
router.get("/:roomId", protect, joinMeeting);

// End Meeting
router.put("/:roomId/end", protect, endMeeting);

export default router;
