import express from "express";
import {
  getAllStudents,
  deleteStudent,
  createStudent,
  getDashboard,
  // getAdminProfileForSidebar,
  getAllMentors,
  deleteMentor,
  pendingMentors,
  approveMentor,
  getAllBookings,
  deleteBooking,
  getAuditLogs,
  getAdminProfile,
  updateAdminProfile,
  changePassword,
  getAnalytics,
  deleteAuditLog,
  suspendMentor,
  activateMentor,
  deleteFilteredAuditLogs,
  getAllContacts,
  getContactById,
  replyToContact,
  updateContactStatus,
  deleteContact,
  updateStudent,
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getMentorDetails,
  getStudentFullDetails,
  getStudentById,
  updateMentor,
  getMentorById,
  getAllAdminReviews,
  getAdminBookingById,
} from "../controllers/adminController.js";
import { upload } from "../middleware/upload.js";
// import { applyMentor } from "../controllers/mentorController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// USERS
router.get("/allstudents", protect, getAllStudents);
router.post("/addstudent", protect, createStudent);
router.get("/dashboard", protect, getDashboard);
// router.get("/profile", protect, getAdminProfileForSidebar);
router.get("/students/:id/details", protect, getStudentFullDetails);
router.delete("/students/:id", protect, deleteStudent);
router.put(
  "/students/:id",
  protect,
  upload.single("profileImage"),
  updateStudent
);
router.get("/students/:id", protect, getStudentById);

router.get("/contact-requests", protect, getAllContacts);
router.get("/contact-requests/:id", protect, getContactById);
router.put("/contact-requests/:id/reply", protect, replyToContact);
router.put("/contact-requests/:id/status", protect, updateContactStatus);
router.delete("/contact-requests/:id", protect, deleteContact);

//MENTORS
router.get("/mentors/:mentorId", protect, getMentorDetails);
router.get("/allmentors", protect, getAllMentors);
router.delete("/mentors/:id", protect, deleteMentor);
router.get("/pendingmentors", protect, pendingMentors);
router.patch("/approve-mentor/:mentorId", protect, approveMentor);
router.get("/mentors/:id", protect, getMentorById);

router.put(
  "/mentors/:id",
  protect,
  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
    {
      name: "resume",
      maxCount: 1,
    },
    {
      name: "governmentId",
      maxCount: 1,
    },
    {
      name: "degreeCertificate",
      maxCount: 1,
    },
  ]),
  updateMentor
);
// router.post(
//   "/mentor/create",
//   protect,
//   upload.fields([
//     { name: "profileImage", maxCount: 1 },
//     { name: "resume", maxCount: 1 },
//     { name: "governmentId", maxCount: 1 },
//     { name: "degreeCertificate", maxCount: 1 },
//   ]),
//   applyMentor
// );
router.patch("/mentors/:mentorId/suspend", protect, suspendMentor);
router.patch("/mentors/:mentorId/activate", protect, activateMentor);

//BOOOKING
router.get("/bookings", protect, getAllBookings);
router.delete("/bookings/:id", protect, deleteBooking);
router.put("/change-password", protect, changePassword);
router.get("/bookings/:id", protect, getAdminBookingById);

//AUDITlOGS
router.get("/audit-logs", protect, getAuditLogs);
router.delete("/auditlogs/:id", protect, deleteAuditLog);
router.delete("/deleteFilterLogs", protect, deleteFilteredAuditLogs);

//PROFILE
router.get("/profile", protect, getAdminProfile);
router.put(
  "/updateprofile",
  protect,
  upload.single("profileImage"),
  updateAdminProfile
);

// REVIEWS
router.get("/reviews", protect, getAllAdminReviews);

// ANALYTICS
router.get("/analytics", protect, getAnalytics);

//Blogs
router.post("/createblogs", upload.single("coverImage"), createBlog);
router.get("/blogs", protect, getAllBlogs);
router.get("/blogs/:id", getBlogById);
router.put("/blogs/update/:id", protect, updateBlog);
router.delete("/blogs/delete/:id", protect, deleteBlog);

export default router;
