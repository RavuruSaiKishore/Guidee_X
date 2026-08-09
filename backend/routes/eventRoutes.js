import express from "express";

import {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
  getEventById,
  completeEvent,
  getEventDetailsById,
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
    { name: "speakerImages", maxCount: 10 }, // Allows up to 10 speaker photos
  ]),
  createEvent
);

router.get("/upcomingEvents", protect, getUpcomingEvents);

router.get("/all", protect, getAllEvents);

router.get("/details/:id", protect, getEventDetailsById);

router.put("/update-status/:id", protect, updateEventStatus);

router.get("/eventDetails/:id", protect, getEventById);

router.put("/:id/complete", protect, completeEvent);


router.put(
  "/update/:id",
  protect,
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "speakerImages", maxCount: 10 },
  ]),
  updateEvent
);

router.delete("/delete/:id", protect, deleteEvent);

export default router;
