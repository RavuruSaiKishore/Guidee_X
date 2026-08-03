import express from "express";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  deleteBooking,
  getTodaySessions,
  getUpcomingSessions,
  getConfirmedSessions,
  getSessionForRescheduling,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createbooking", protect, createBooking);
router.get("/mybookings", protect, getMyBookings);
router.patch("/cancelbooking/:bookingId", protect, cancelBooking);
router.delete("/delete/:id", protect, deleteBooking);
router.get("/today-sessions", protect, getTodaySessions);
router.get("/upcomingsessions", protect, getUpcomingSessions);
router.get("/confirmed-sessions", protect, getConfirmedSessions);

router.get("/sessionforrescheduling", protect, getSessionForRescheduling);


export default router;
