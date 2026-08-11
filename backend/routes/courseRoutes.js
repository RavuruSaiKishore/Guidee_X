import express from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  enrollCourse,
  getMyEnrolledCourses,
  getCourseLearningDetails,
  toggleLessonCompletion,
  getManagedCourses,
  deleteCourse,
  getCourseDetailsWithStudents,
  updateCourse,
  getEnrollmentByCourseId,
  getStudentEnrolledCourses,
} from "../controllers/courseController.js";
import { protect } from "../middleware/authMiddleware.js"; 
import { upload } from "../middleware/upload.js";


const router = express.Router();

router.get("/", getAllCourses);
router.get("/my-enrollments", protect, getMyEnrolledCourses);
router.get("/:id", protect,getCourseById);
router.get("/:id/learn", protect, getCourseLearningDetails);
router.post("/", protect, upload.any(), createCourse);
router.put("/:id", protect, upload.any(), updateCourse);
router.post("/:id/enroll", protect, enrollCourse);
router.put("/:id/progress", protect, toggleLessonCompletion);
router.get("/manage/all", protect, getManagedCourses);
router.delete("/:id", protect, deleteCourse);
router.get("/:id/details-with-students", protect, getCourseDetailsWithStudents);
router.get("/:id/enroll", protect, getEnrollmentByCourseId);
router.get("/student/enrolled", protect, getStudentEnrolledCourses);


export default router;
