import express from "express";

import {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
  getEventById,
  completeEvent,
  getEventDetails,
  updateEventStatus,
} from "../controllers/eventController.js";
import { upload } from "../middleware/upload.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  protect,
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "speakerImage", maxCount: 1 },
  ]),
  createEvent
);
router.get("/upcomingEvents", protect, getUpcomingEvents);

router.get("/all", protect, getAllEvents);

router.get(
  "/details/:id",
  protect,
  getEventDetails
);

router.put("/update-status/:id", protect, updateEventStatus);

router.get("/eventDetails/:id", protect, getEventById);

router.put("/:id/complete", protect, completeEvent);


router.put(
  "/update/:id",
  protect,
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "speakerImage", maxCount: 1 },
  ]),
  updateEvent
);

router.delete("/delete/:id", protect, deleteEvent);

export default router;
