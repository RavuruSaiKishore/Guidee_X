import { Course, Enrollment } from "../models/Course.js";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Get all courses catalog
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate(
      "instructor",
      "firstName lastName profileImage"
    );
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "firstName lastName profileImage")
      .populate({
        path: "reviews.student",
        select: "_id firstName lastName", // Explicitly include _id for comparison
      });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    let isEnrolled = false;
    let paymentStatus = null;

    if (req.user) {
      const enrollment = await Enrollment.findOne({
        student: req.user.id,
        course: req.params.id,
      });

      if (enrollment) {
        isEnrolled = true;
        paymentStatus = enrollment.paymentStatus;
      }
    }

    res.status(200).json({
      success: true,
      course,
      isEnrolled,
      paymentStatus,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new course (Mentor / Admin)
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      previewVideoUrl,
      category,
      subCategory,
      level,
      language,
      isPaid,
      price,
      compareAtPrice,
      isPublished,
      modules,
    } = req.body;

    // When using upload.any(), req.files is a flat array of all uploaded files
    let thumbnailUrl = "";
    if (req.files && req.files.length > 0) {
      const thumbFile = req.files.find(
        (file) => file.fieldname === "thumbnail"
      );
      if (thumbFile) {
        thumbnailUrl = `/uploads/${thumbFile.filename}`;
      }
    }

    if (!thumbnailUrl) {
      return res.status(400).json({
        success: false,
        message: "Course thumbnail image is required",
      });
    }

    let parsedModules =
      typeof modules === "string" ? JSON.parse(modules) : modules;

    // Match uploaded PDF files (fieldnames like module_pdf_0, module_pdf_1, etc.) to modules
    if (req.files && req.files.length > 0 && parsedModules) {
      parsedModules = parsedModules.map((mod, index) => {
        const pdfFile = req.files.find(
          (file) => file.fieldname === `module_pdf_${index}`
        );
        if (pdfFile) {
          mod.notes = [
            {
              title: `${mod.title} Notes`,
              fileUrl: `/uploads/${pdfFile.filename}`,
            },
          ];
        }

        // Ensure assignment and codingProblem structures are mapped cleanly
        return {
          title: mod.title,
          notes: mod.notes || [],
          lessons: mod.lessons || [],
          assignment: mod.assignment || {
            title: "Module Assessment",
            questions: [],
          },
          codingProblem:
            mod.codingProblem && mod.codingProblem.title
              ? mod.codingProblem
              : undefined,
        };
      });
    }

    const course = await Course.create({
      title,
      subtitle,
      description,
      thumbnail: thumbnailUrl,
      previewVideoUrl,
      category,
      subCategory,
      level,
      language,
      isPaid: isPaid === "true" || isPaid === true,
      price: isPaid === "false" || isPaid === false ? 0 : Number(price) || 0,
      compareAtPrice:
        isPaid === "false" || isPaid === false
          ? 0
          : Number(compareAtPrice) || 0,
      isPublished: isPublished === "true" || isPublished === true,
      modules: parsedModules || [],
    });

    res
      .status(201)
      .json({ success: true, message: "Course created successfully!", course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Enroll student in a course
export const enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const studentId = req.user.id;

    let enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });
    if (enrollment) {
      return res
        .status(400)
        .json({ success: false, message: "Already enrolled in this course" });
    }

    enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
    });
    res
      .status(201)
      .json({ success: true, message: "Successfully enrolled", enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get student's enrolled courses list
export const getMyEnrolledCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id,
    }).populate({
      path: "course",
      populate: {
        path: "instructor",
        select: "firstName lastName profileImage",
      },
    });

    res.status(200).json({ success: true, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get course learning workspace info & student progress
export const getCourseLearningDetails = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "firstName lastName profileImage"
    );
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.id,
    });

    res.status(200).json({
      success: true,
      course,
      completedLessons: enrollment ? enrollment.completedLessons : [],
      progressPercentage: enrollment ? enrollment.progressPercentage : 0,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleLessonCompletion = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const { id: courseId } = req.params; // Matches /api/courses/:id/progress
    const studentId = req.user.id;

    let enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      return res
        .status(404)
        .json({ success: false, message: "Enrollment not found" });
    }

    // Toggle completion logic
    const isCompleted = enrollment.completedLessons.some(
      (id) => id.toString() === lessonId
    );

    if (isCompleted) {
      enrollment.completedLessons = enrollment.completedLessons.filter(
        (id) => id.toString() !== lessonId
      );
    } else {
      enrollment.completedLessons.push(lessonId);
    }

    // Recalculate Course Progress Percentage
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const totalLessons = course.modules.reduce(
      (acc, mod) => acc + (mod.lessons?.length || 0),
      0
    );

    if (totalLessons > 0) {
      enrollment.progressPercentage = Math.round(
        (enrollment.completedLessons.length / totalLessons) * 100
      );
    } else {
      enrollment.progressPercentage = 0;
    }

    enrollment.isCompleted = enrollment.progressPercentage >= 100;
    if (enrollment.isCompleted && !enrollment.certificateIssuedAt) {
      enrollment.certificateIssuedAt = new Date();
    }

    await enrollment.save();

    return res.status(200).json({
      success: true,
      message: isCompleted
        ? "Lesson marked incomplete"
        : "Lesson marked complete",
      enrollment,
    });
  } catch (error) {
    console.error("Toggle Progress Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all courses created by the logged-in admin or mentor (or all courses if admin)
export const getManagedCourses = async (req, res) => {
  try {
    let query = {};
    // If user is a mentor, filter by their instructor name or ID if stored as string
    if (req.user && req.user.role === "mentor") {
      query.instructor = req.user.firstName || "appwat";
    }

    const courses = await Course.find(query).sort({ createdAt: -1 });

    // Attach enrollment counts for each course
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const studentCount = await Enrollment.countDocuments({
          course: course._id,
        });
        return {
          ...course.toObject(),
          studentCount,
        };
      })
    );

    res.status(200).json({ success: true, courses: coursesWithStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a course and its associated enrollments
export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Optional authorization check: ensure mentor owns it or user is admin
    if (
      req.user.role === "mentor" &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Unauthorized to delete this course",
        });
    }

    await Course.findByIdAndDelete(courseId);
    await Enrollment.deleteMany({ course: courseId });

    res
      .status(200)
      .json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      previewVideoUrl,
      category,
      subCategory,
      level,
      language,
      isPaid,
      price,
      compareAtPrice,
      isPublished,
      modules,
    } = req.body;

    const courseId = req.params.id;
    const existingCourse = await Course.findById(courseId);

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Handle thumbnail update or keep existing thumbnail
    let thumbnailUrl = existingCourse.thumbnail;
    if (req.files && req.files.length > 0) {
      const thumbFile = req.files.find(
        (file) => file.fieldname === "thumbnail"
      );
      if (thumbFile) {
        thumbnailUrl = `/uploads/${thumbFile.filename}`;
      }
    }

    let parsedModules =
      typeof modules === "string" ? JSON.parse(modules) : modules;

    // Match uploaded PDF files (fieldnames like module_pdf_0, module_pdf_1, etc.) to modules
    if (req.files && req.files.length > 0 && parsedModules) {
      parsedModules = parsedModules.map((mod, index) => {
        const pdfFile = req.files.find(
          (file) => file.fieldname === `module_pdf_${index}`
        );
        if (pdfFile) {
          mod.notes = [
            {
              title: `${mod.title} Notes`,
              fileUrl: `/uploads/${pdfFile.filename}`,
            },
          ];
        }

        // Ensure assignment and codingProblem structures are mapped cleanly
        return {
          title: mod.title,
          notes: mod.notes || [],
          lessons: mod.lessons || [],
          assignment: mod.assignment || {
            title: "Module Assessment",
            questions: [],
          },
          codingProblem:
            mod.codingProblem && mod.codingProblem.title
              ? mod.codingProblem
              : undefined,
        };
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        title,
        subtitle,
        description,
        thumbnail: thumbnailUrl,
        previewVideoUrl,
        category,
        subCategory,
        level,
        language,
        isPaid: isPaid === "true" || isPaid === true,
        price: isPaid === "false" || isPaid === false ? 0 : Number(price) || 0,
        compareAtPrice:
          isPaid === "false" || isPaid === false
            ? 0
            : Number(compareAtPrice) || 0,
        isPublished: isPublished === "true" || isPublished === true,
        modules: parsedModules || [],
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Course updated successfully!",
      course: updatedCourse,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCourseDetailsWithStudents = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Fetch the course with modules to calculate total lessons if needed
    const course = await Course.findById(id).lean();
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // 2. Fetch all enrollments for this course and populate student + progress details
    const enrollments = await Enrollment.find({ course: id })
      .populate({
        path: "student",
        model: "Student",
        select: "firstName lastName email profileImage phone",
      })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      course,
      enrollments, // Includes payment status, progressPercentage, completedLessons, etc.
    });
  } catch (error) {
    console.error("Admin Course Details Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEnrollmentByCourseId = async (req, res) => {
  try {
    const courseId = req.params.id;
    const studentId = req.user.id;

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    }).populate("course");

    if (!enrollment) {
      res.status(404).json({
        success: false,
        message: "Enrollment record not found for this course",
      });
    }

    res.status(200).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    console.error("Get Enrollment Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user.id; // Extracted securely from token middleware

    const enrollments = await Enrollment.find({ student: studentId }).populate({
      path: "course",
      populate: {
        path: "instructor",
        select: "firstName lastName profileImage",
      },
    });

    return res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    console.error("Fetch Student Enrollments Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const submitAssessmentScore = async (req, res) => {
  try {
    const courseId = req.params.id; // This is the Course ID from the URL (/api/courses/:id/assessment)
    const { moduleIndex, score, totalQuestions } = req.body;

    // Catch whichever property your auth middleware uses for the user id
    const studentId = req.user?.id || req.user?._id;

    console.log("Debugging Enrollment Lookup:");
    console.log("Student ID from Token:", studentId);
    console.log("Course ID from URL:", courseId);

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated properly.",
      });
    }

    // Query using course and student
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: `Enrollment not found for student ${studentId} and course ${courseId}`,
      });
    }

    // Update or push assessment submission score
    if (!enrollment.assessmentSubmissions) {
      enrollment.assessmentSubmissions = [];
    }

    const existingIndex = enrollment.assessmentSubmissions.findIndex(
      (sub) => sub.moduleIndex === Number(moduleIndex)
    );

    if (existingIndex > -1) {
      enrollment.assessmentSubmissions[existingIndex].score = score;
      enrollment.assessmentSubmissions[existingIndex].submittedAt = Date.now();
    } else {
      enrollment.assessmentSubmissions.push({
        moduleIndex: Number(moduleIndex),
        score,
        totalQuestions,
      });
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: "Assessment score saved successfully!",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const solveCodingProblem = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { problemSlug } = req.body;
    const studentId = req.user?.id || req.user?._id;
    // console.log(courseId);
    // console.log(studentId);

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      return res
        .status(404)
        .json({ success: false, message: "Enrollment not found." });
    }

    if (!enrollment.solvedCodingProblems) {
      enrollment.solvedCodingProblems = [];
    }

    // Add problemSlug if not already recorded as solved
    if (!enrollment.solvedCodingProblems.includes(problemSlug)) {
      enrollment.solvedCodingProblems.push(problemSlug);
      await enrollment.save();
    }

    res.status(200).json({
      success: true,
      message: "Coding problem marked as solved!",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addOrUpdateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const courseId = req.params.id;
    const studentId = req.user.id;

    if (!rating || !comment) {
      return res
        .status(400)
        .json({ success: false, message: "Rating and comment are required." });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    }

    // Check if student has already reviewed this course
    const existingReviewIndex = course.reviews.findIndex(
      (rev) => rev.student.toString() === studentId.toString()
    );

    if (existingReviewIndex > -1) {
      // Update existing review
      course.reviews[existingReviewIndex].rating = Number(rating);
      course.reviews[existingReviewIndex].comment = comment;
    } else {
      // Push new review
      course.reviews.push({
        student: studentId,
        rating: Number(rating),
        comment,
      });
    }

    // Recalculate average rating
    const totalRating = course.reviews.reduce(
      (acc, item) => acc + item.rating,
      0
    );
    course.averageRating = totalRating / course.reviews.length;

    await course.save();

    res.status(200).json({
      success: true,
      message:
        existingReviewIndex > -1
          ? "Review updated successfully!"
          : "Review submitted successfully!",
      reviews: course.reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCourseCertificate = async (req, res) => {
  try {
    const courseId = req.params.id;
    const studentId = req.user?.id || req.user?._id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated properly.",
      });
    }

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    })
      .populate("student", "firstName lastName email")
      .populate("course", "title instructor createdAt");

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment record not found.",
      });
    }

    if (!enrollment.isCompleted) {
      return res.status(400).json({
        success: false,
        message:
          "Course is not yet completed. Finish all lessons, module assessments, and coding challenges to unlock your certificate.",
      });
    }

    res.status(200).json({
      success: true,
      certificate: {
        studentName: `${enrollment.student.firstName || ""} ${
          enrollment.student.lastName || "Student"
        }`,
        courseTitle: enrollment.course.title,
        instructor: enrollment.course.instructor || "Lead Instructor",
        issuedAt: enrollment.certificateIssuedAt || enrollment.updatedAt,
        certificateId: enrollment._id,
      },
    });
  } catch (error) {
    console.error("Get Certificate Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askAI = async (req, res) => {
  try {
    const { question } = req.body;
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Safely map modules in case they are undefined or missing titles
    const moduleTitles =
      course.modules && course.modules.length > 0
        ? course.modules.map((m) => m.title).join(", ")
        : "General Course";

    const context = `You are a helpful teaching assistant for the course titled "${
      course.title
    }". 
    Course Description: ${course.description || "N/A"}. 
    Modules: ${moduleTitles}.
    Answer the student's question based on this context.`;

    // Change the model string from "gemini-1.5-flash" to "gemini-pro"
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(
      `${context} \n\n Student Question: ${question}`
    );
    const answer = result.response.text();

    res.status(200).json({ success: true, answer });
  } catch (error) {
    // 🔥 Prints the exact error stack trace in your backend terminal
    console.error("AI Doubt Generation Error:", error);
    res
      .status(500)
      .json({ success: false, message: error.message || "AI Error" });
  }
};
