import express from "express";
import {
  applyMentor,
  getAllMentors,
  getMentorById,
  getMentorProfile,
  getMentorDashboard,
  getMentorAvailability,
  getPendingBookings,
  approveBooking,
  rejectBooking,
  getRejectedBookings,
  getCompletedBookings,
  getCancelledBookings,
  getAvailability,
  updateAvailability,
  getMentorReviews,
  updateMentorProfile,
} from "../controllers/mentorController.js";
import {protect} from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/profile", protect, getMentorProfile);
router.get("/dashboard", protect, getMentorDashboard);
router.get("/availability", protect, getMentorAvailability);
router.get("/pending", protect, getPendingBookings);
router.put("/approve/:bookingId", protect, approveBooking);
router.put("/reject/:bookingId", protect, rejectBooking);;
router.get("/rejected", protect, getRejectedBookings);
router.get("/cancelBookings", protect, getCancelledBookings);
router.get("/completeBookings", protect, getCompletedBookings);
router.get("/availability", protect, getAvailability);
router.put("/editavailability", protect, updateAvailability);
router.get("/reviews", protect, getMentorReviews);
router.patch(
  "/editprofile",
  protect,
  upload.single("profileImage"),
  updateMentorProfile
);
router.post(
  "/apply",
  protect,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "governmentId", maxCount: 1 },
    { name: "degreeCertificate", maxCount: 1 },
  ]),
  applyMentor
);
router.get("/allMentors",  getAllMentors);
router.get("/:id", protect, getMentorById);




export default router;
