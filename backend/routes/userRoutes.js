import express from "express";
import { upload } from "../middleware/upload.js";
import {
  userProfile,
  updateProfile,
  userLogout,
  getStudentBadges,
  getFeaturedStudents,
  getPlatformStats,
  getMentorRegistrationStats,
  getUserProfile,
  getUserProfileStats,
  getAllFAQs,
  getStudentDashboard,
  getStudentAnalytics,
  getAllCourses,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/logout", protect, userLogout);
router.get("/userProfile", protect, userProfile);
router.put("/updateProfile", protect, upload.single("profileImage"), updateProfile );
router.get("/badges", protect, getStudentBadges);
router.get("/featured-students", getFeaturedStudents);
router.get("/platform-stats",protect, getPlatformStats);
router.get("/registration-stats", getMentorRegistrationStats);
router.get("/profile", protect, getUserProfile);
router.get("/profile/stats", protect, getUserProfileStats);
router.get("/dashboard", protect, getStudentDashboard);
router.get("/student-analytics", protect, getStudentAnalytics);
router.get("/", getAllCourses);


//FAQ's
router.get("/allfaq", getAllFAQs);

export default router;
