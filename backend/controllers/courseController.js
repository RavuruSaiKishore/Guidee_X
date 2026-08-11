import { Course, Enrollment } from "../models/Course.js";
import path from "path";

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
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "firstName lastName profileImage"
    );
    
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    let isEnrolled = false;
    let paymentStatus = null;

    // Check enrollment if user is logged in
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
      paymentStatus 
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
        return mod;
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
      price,
      compareAtPrice,
      isPublished,
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
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Optional authorization check: ensure mentor owns it or user is admin
    if (req.user.role === "mentor" && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this course" });
    }

    await Course.findByIdAndDelete(courseId);
    await Enrollment.deleteMany({ course: courseId });

    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    let course = await Course.findById(id);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const {
      title,
      subtitle,
      description,
      previewVideoUrl,
      category,
      subCategory,
      level,
      language,
      price,
      compareAtPrice,
      isPublished,
      modules,
    } = req.body;

    // 1. Handle course thumbnail image update
    let thumbnailUrl = course.thumbnail;
    if (req.files && req.files.length > 0) {
      const thumbFile = req.files.find(
        (file) => file.fieldname === "thumbnail"
      );
      if (thumbFile) {
        thumbnailUrl = `/uploads/${thumbFile.filename}`;
      }
    } else if (req.body.thumbnail && typeof req.body.thumbnail === "string") {
      thumbnailUrl = req.body.thumbnail;
    }

    // 2. Parse modules JSON string
    let parsedModules =
      typeof modules === "string" ? JSON.parse(modules) : modules;

    // 3. Handle module PDF note uploads and ensure existing notes/duration are preserved safely
    if (parsedModules) {
      parsedModules = parsedModules.map((mod, index) => {
        // 🔑 Capture the existing module reference FIRST before modifying `mod`
        const existingMod = course.modules[index];

        // Check if a new file was uploaded for this specific module index
        const pdfFile =
          req.files && req.files.length > 0
            ? req.files.find((file) => file.fieldname === `module_pdf_${index}`)
            : null;

        if (pdfFile) {
          // If a new PDF is uploaded, assign the new file path
          mod.notes = [
            {
              title: `${mod.title} Notes`,
              fileUrl: `/uploads/${pdfFile.filename}`,
            },
          ];
        } else {
          // If no new file is uploaded, retain existing notes securely
          if (!mod.notes || mod.notes.length === 0) {
            if (existingMod && existingMod.notes) {
              mod.notes = existingMod.notes;
            }
          }
        }

        // Ensure lesson durations are preserved or defaulted properly if undefined
        if (mod.lessons) {
          mod.lessons = mod.lessons.map((lesson, lIdx) => {
            const existingLesson =
              existingMod && existingMod.lessons
                ? existingMod.lessons[lIdx]
                : null;
            return {
              ...lesson,
              duration:
                lesson.duration ??
                (existingLesson ? existingLesson.duration : 10),
            };
          });
        }

        return mod;
      });
    }

    // 4. Update database record
    course = await Course.findByIdAndUpdate(
      id,
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
        price,
        compareAtPrice,
        isPublished,
        modules: parsedModules || course.modules,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getCourseDetailsWithStudents = async (req, res) => {
  try {
    const { id } = req.params;

    // Find course by ID
    const course = await Course.findById(id);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Find all students enrolled in this course and populate student details (name, email)
    const enrollments = await Enrollment.find({ course: id })
      .populate("student", "firstName lastName email avatar createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      course,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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