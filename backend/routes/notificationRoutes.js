import express from "express";
import {
  getNotificationCount,
  markNotificationsRead,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/count", protect, getNotificationCount);
router.put("/read", protect, markNotificationsRead);


export default router;
