import User from "../models/Student.js";
import crypto from "crypto";
import Booking from "../models/Bookings.js";
import createAuditLog from "../utils/createAuditLog.js";
import Student from "../models/Student.js";
import Mentor from "../models/Mentor.js";
import Blog from "../models/Blogs/Blog.js";
import Review from "../models/Reviews.js";
import Meeting from "../models/Meeting.js";
import Contact from "../models/Contact.js";
import mongoose from "mongoose";
import FAQ from "../models/FAQ.js";
import EventRegistration from "../models/EventRegistration.js";
import Event from "../models/Event.js";
import RescheduleRequest from "../models/RescheduleRequest.js";
import Badge from "../models/Badges.js";
import { Course, Enrollment } from "../models/Course.js";

export const userProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // ============================================
    // GET LOGGED-IN USER ID
    // ============================================

    const userId = req.user.id || req.user._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication failed.",
      });
    }

    // ============================================
    // GET DATA FROM FRONTEND
    // ============================================

    const { firstName, lastName, phone, education, careerGoal } = req.body;

    // ============================================
    // PROFILE IMAGE
    // ============================================

    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    // ============================================
    // BUILD UPDATE OBJECT
    // ============================================

    const updateData = {
      firstName: firstName?.trim() || "",
      lastName: lastName?.trim() || "",
      phone: phone?.trim() || "",
      education: education?.trim() || "",
      careerGoal: careerGoal?.trim() || "",
    };

    // ============================================
    // ONLY UPDATE IMAGE IF NEW IMAGE IS UPLOADED
    // ============================================

    if (imagePath) {
      updateData.profileImage = imagePath;
    }

    // ============================================
    // UPDATE USER
    // ============================================

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    // ============================================
    // USER NOT FOUND
    // ============================================

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ============================================
    // CREATE AUDIT LOG
    // ============================================

    await createAuditLog({
      req,
      user: {
        ...updatedUser.toObject(),
        role: "Student",
      },
      action: "Update Profile",
      module: "Profile",
      description:
        "Student updated profile information including personal, education, and career details.",
      targetId: updatedUser._id,
      targetType: "Student",
    });

    // ============================================
    // SUCCESS RESPONSE
    // ============================================

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      profile: updatedUser,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update Profile Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Unable to update profile.",
    });
  }
};


export const userLogout = async (req, res) => {
  try {
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, {
      isActive: false,
    });

    const student = await User.findById(userId);

    await createAuditLog({
      req,
      user: {
        ...student.toObject(),
        role: "Student",
      },
      action: "Logout",
      module: "Authentication",
      description: "Student logged out.",
      targetId: student._id,
      targetType: "Student",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getStudentBadges = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findById(studentId);

    const completedSessions = await Booking.countDocuments({
      student: studentId,

      bookingStatus: "Completed",
    });

    const badges = [
      {
        id: 1,
        title: "First Step",
        description: "Complete your first mentorship session.",
        required: 1,
        unlocked: completedSessions >= 1,
        progress: Math.min(completedSessions, 1),
      },

      {
        id: 2,
        title: "Consistent Learner",
        description: "Complete 5 mentorship sessions.",
        required: 5,
        unlocked: completedSessions >= 5,
        progress: Math.min(completedSessions, 5),
      },

      {
        id: 3,
        title: "Dedicated Learner",
        description: "Complete 10 mentorship sessions.",
        required: 10,
        unlocked: completedSessions >= 10,
        progress: Math.min(completedSessions, 10),
      },

      {
        id: 4,
        title: "Knowledge Explorer",
        description: "Complete 20 mentorship sessions.",
        required: 20,
        unlocked: completedSessions >= 20,
        progress: Math.min(completedSessions, 20),
      },

      {
        id: 5,
        title: "Mentorship Champion",
        description: "Complete 50 mentorship sessions.",
        required: 50,
        unlocked: completedSessions >= 50,
        progress: Math.min(completedSessions, 50),
      },
    ];

    res.json({
      success: true,

      completedSessions,

      badges,

      gamification: {
        xp: student.learningStats.xp,

        level: student.learningStats.level,

        streak: student.learningStats.streak,
      },

      xpHistory: student.xpHistory.slice(-5).reverse(),
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
    });
  }
};

export const getFeaturedMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find()
      .select(
        "firstName lastName profession company profileImage averageRating yearsOfExperience skills pricing"
      )
      .sort({ averageRating: -1 })
      .limit(6);

    res.json({
      success: true,
      mentors,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch mentors.",
    });
  }
};

export const getFeaturedStudents = async (req, res) => {
  try {
    // Fetch students
    const students = await User.find({ role: "student" })
      .select("firstName lastName email profileImage createdAt country")
      .sort({ createdAt: -1 })
      .lean()
      .limit(5);

    // Add completed sessions & rating
    const featuredStudents = await Promise.all(
      students.map(async (student) => {
        const completedSessions = await Booking.countDocuments({
          student: student._id,
          status: "completed",
        });

        const completedBookings = await Booking.find({
          student: student._id,
          status: "completed",
        }).select("rating");

        const ratings = completedBookings
          .map((b) => b.rating)
          .filter((r) => r !== undefined && r !== null);

        const averageRating =
          ratings.length > 0
            ? (
                ratings.reduce((sum, rating) => sum + rating, 0) /
                ratings.length
              ).toFixed(1)
            : 5;

        return {
          ...student,
          completedSessions,
          averageRating,
        };
      })
    );

    res.status(200).json({
      success: true,
      students: featuredStudents,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getPlatformStats = async (req, res) => {
  try {
    const [students, mentors, sessions] = await Promise.all([
      Student.countDocuments({ role: "student" }),
      Mentor.countDocuments({
        verificationStatus: "Approved",
      }),
      Booking.countDocuments({
        bookingStatus: "Completed",
      }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        students,
        mentors,
        sessions,
      },
    });
  } catch (error) {
    console.error("Platform Stats Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch platform statistics",
    });
  }
};


export const getMentorRegistrationStats = async (req, res) => {
  try {
    const [
      totalMentors,
      activeMentors,
      verifiedMentors,
      totalStudents,
      totalBookings,
      completedSessions,
      totalReviews,
      ratingResult,
      companyResult,
      categoryResult,
    ] = await Promise.all([
      // ==========================================
      // TOTAL MENTORS
      // ==========================================
      Mentor.countDocuments(),

      // ==========================================
      // ACTIVE MENTORS
      // Approved + Active
      // ==========================================
      Mentor.countDocuments({
        verificationStatus: "Approved",
        accountStatus: "Active",
      }),

      // ==========================================
      // VERIFIED MENTORS
      // ==========================================
      Mentor.countDocuments({
        isVerified: true,
      }),

      // ==========================================
      // TOTAL STUDENTS
      // ==========================================
      Student.countDocuments({
        role: "student",
      }),

      // ==========================================
      // TOTAL BOOKINGS
      // ==========================================
      Booking.countDocuments(),

      // ==========================================
      // COMPLETED SESSIONS
      // ==========================================
      Booking.countDocuments({
        bookingStatus: "Completed",
      }),

      // ==========================================
      // TOTAL VISIBLE REVIEWS
      // ==========================================
      Review.countDocuments({
        isVisible: true,
      }),

      // ==========================================
      // AVERAGE RATING
      // ==========================================
      Review.aggregate([
        {
          $match: {
            isVisible: true,
          },
        },
        {
          $group: {
            _id: null,
            averageRating: {
              $avg: "$rating",
            },
          },
        },
      ]),

      // ==========================================
      // UNIQUE COMPANIES
      // Ignore empty/null companies
      // ==========================================
      Mentor.aggregate([
        {
          $match: {
            company: {
              $exists: true,
              $nin: ["", null],
            },
          },
        },
        {
          $group: {
            _id: "$company",
          },
        },
        {
          $count: "totalCompanies",
        },
      ]),

      // ==========================================
      // UNIQUE MENTOR CATEGORIES
      // Ignore empty/null categories
      // ==========================================
      Mentor.aggregate([
        {
          $match: {
            category: {
              $exists: true,
              $nin: ["", null],
            },
          },
        },
        {
          $group: {
            _id: "$category",
          },
        },
        {
          $count: "totalCategories",
        },
      ]),
    ]);

    // ==========================================
    // CALCULATE AVERAGE RATING
    // ==========================================

    const averageRating =
      ratingResult.length > 0
        ? Number(ratingResult[0].averageRating.toFixed(1))
        : 0;

    // ==========================================
    // EXTRACT COMPANY COUNT
    // ==========================================

    const totalCompanies =
      companyResult.length > 0 ? companyResult[0].totalCompanies : 0;

    // ==========================================
    // EXTRACT CATEGORY COUNT
    // ==========================================

    const totalCategories =
      categoryResult.length > 0 ? categoryResult[0].totalCategories : 0;

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      stats: {
        totalMentors,
        activeMentors,
        verifiedMentors,
        totalStudents,
        totalBookings,
        completedSessions,
        averageRating,
        totalReviews,
        totalCompanies,
        totalCategories,
      },
    });
  } catch (error) {
    console.error("Get mentor registration statistics error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch mentor registration statistics",
      error: error.message,
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // =====================================================
    // GET STUDENT
    // =====================================================

    const user = await Student.findById(userId)
      .select("-password")
      .populate({
        path: "achievementHistory.badgeId",
        select: "title description requiredSessions color",
      })
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // =====================================================
    // BOOKING STATISTICS
    // =====================================================

    const [
      completedSessions,
      upcomingSessions,
      totalBookings,
      cancelledSessions,
    ] = await Promise.all([
      Booking.countDocuments({
        student: userId,
        bookingStatus: "Completed",
      }),

      Booking.countDocuments({
        student: userId,
        bookingStatus: "Confirmed",
        sessionDate: {
          $gte: new Date(),
        },
      }),

      Booking.countDocuments({
        student: userId,
      }),

      Booking.countDocuments({
        student: userId,
        bookingStatus: "Cancelled",
      }),
    ]);

    // =====================================================
    // REVIEW STATISTICS
    // =====================================================

    const reviewStats = await Review.aggregate([
      {
        $match: {
          studentId: userId,
        },
      },

      {
        $group: {
          _id: null,

          totalReviews: {
            $sum: 1,
          },

          averageRating: {
            $avg: "$rating",
          },
        },
      },
    ]);

    const totalReviews =
      reviewStats.length > 0 ? reviewStats[0].totalReviews : 0;

    const averageRating =
      reviewStats.length > 0
        ? Number((reviewStats[0].averageRating || 0).toFixed(1))
        : 0;

    // =====================================================
    // PROFILE COMPLETION
    // =====================================================

    const profileFields = [
      user.firstName,
      user.lastName,
      user.email,
      user.phone,
      user.profileImage,
    ];

    const completedFields = profileFields.filter(Boolean).length;

    const profileCompletion = Math.round(
      (completedFields / profileFields.length) * 100
    );

    // =====================================================
    // LEARNING DATA
    // =====================================================

    const learningStats = {
      xp: user.learningStats?.xp || 0,

      level: user.learningStats?.level || 1,

      currentStreak: user.learningStats?.streak?.current || 0,

      longestStreak: user.learningStats?.streak?.longest || 0,
    };

    // =====================================================
    // BADGES
    // =====================================================

    const badges = (user.achievementHistory || [])
      .map((achievement) => ({
        id: achievement.badgeId?._id || achievement.badgeId || null,

        title: achievement.badgeId?.title || achievement.title || "Achievement",

        description:
          achievement.badgeId?.description || "Achievement unlocked.",

        requiredSessions: achievement.badgeId?.requiredSessions || 0,

        color: achievement.badgeId?.color || "indigo",

        unlockedAt: achievement.unlockedAt,
      }))
      .sort(
        (a, b) => new Date(b.unlockedAt || 0) - new Date(a.unlockedAt || 0)
      );

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      profile: {
        ...user,

        profileCompletion,

        statistics: {
          completedSessions,
          upcomingSessions,
          totalBookings,
          cancelledSessions,
          totalReviews,
          averageRating,
        },

        learningStats,

        badges,
      },
    });
  } catch (error) {
    console.error("Get User Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user profile.",
      error: error.message,
    });
  }
};


export const getUserProfileStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Convert string ID to MongoDB ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const [
      completedSessions,
      upcomingSessions,
      totalBookings,
      cancelledSessions,
    ] = await Promise.all([
      Booking.countDocuments({
        student: userObjectId,
        bookingStatus: "Completed",
      }),

      Booking.countDocuments({
        student: userObjectId,
        bookingStatus: "Confirmed",
        sessionDate: {
          $gte: new Date(),
        },
      }),

      Booking.countDocuments({
        student: userObjectId,
      }),

      Booking.countDocuments({
        student: userObjectId,
        bookingStatus: "Cancelled",
      }),
    ]);

    // ==========================================
    // REVIEW STATISTICS
    // ==========================================

    const reviewStats = await Review.aggregate([
      {
        $match: {
          studentId: userObjectId,
        },
      },

      {
        $group: {
          _id: null,

          totalReviews: {
            $sum: 1,
          },

          averageRating: {
            $avg: "$rating",
          },
        },
      },
    ]);


    const totalReviews =
      reviewStats.length > 0 ? reviewStats[0].totalReviews : 0;

    const averageRating =
      reviewStats.length > 0
        ? Number((reviewStats[0].averageRating || 0).toFixed(1))
        : 0;

    // ==========================================
    // USER LEARNING DATA
    // ==========================================

    const user = await Student.findById(userObjectId)
      .select("learningStats achievementHistory")
      .lean();

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      stats: {
        completedSessions,
        upcomingSessions,
        totalBookings,
        cancelledSessions,

        totalReviews,
        averageRating,

        xp: user?.learningStats?.xp || 0,

        level: user?.learningStats?.level || 1,

        currentStreak: user?.learningStats?.streak?.current || 0,

        longestStreak: user?.learningStats?.streak?.longest || 0,

        badges: user?.achievementHistory?.length || 0,
      },
    });
  } catch (error) {
    console.error("Get Profile Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile statistics.",
      error: error.message,
    });
  }
};


export const getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      count: faqs.length,
      faqs,
    });
  } catch (error) {
    console.error("Get FAQs Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQs",
      error: error.message,
    });
  }
};


export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user?._id || req.user?.id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Student authentication required",
      });
    }

    const now = new Date();

    const student = await Student.findById(studentId)
      .select(
        "firstName lastName email phone profileImage education careerGoal learningStats achievementHistory xpHistory"
      )
      .lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // ==========================================================
    // FETCH COURSE ENROLLMENTS & COMPUTE EXACT PERCENTAGES
    // ==========================================================
    const rawEnrollments = await Enrollment.find({ student: studentId })
      .populate({
        path: "course",
        select:
          "title description thumbnail category duration level instructor modules",
      })
      .lean()
      .catch(() => []);

    const enrolledCourses = rawEnrollments.map((item) => {
      const course = item.course || {};

      // Count total lessons dynamically across all modules in the course schema
      let totalLessonsCount = 0;
      if (course.modules && Array.isArray(course.modules)) {
        course.modules.forEach((mod) => {
          if (mod.lessons && Array.isArray(mod.lessons)) {
            totalLessonsCount += mod.lessons.length;
          }
        });
      }

      const completedCount = item.completedLessons?.length || 0;

      // Calculate percentage
      let calculatedPercentage = Number(
        item.progressPercentage ||
          item.progress ||
          item.completionPercentage ||
          0
      );

      if (
        totalLessonsCount > 0 &&
        calculatedPercentage === 0 &&
        completedCount > 0
      ) {
        calculatedPercentage = Math.round(
          (completedCount / totalLessonsCount) * 100
        );
      }

      // Ensure it stays within bounds 0-100
      calculatedPercentage = Math.min(Math.max(calculatedPercentage, 0), 100);

      return {
        ...item,
        // Provide all possible alias properties so frontend components match seamlessly
        progress: calculatedPercentage,
        completionPercentage: calculatedPercentage,
        progressPercentage: calculatedPercentage,
        totalLessonsCount,
      };
    });

    const eventRegistrations = await EventRegistration.find({
      student: studentId,
      status: "Registered",
    })
      .populate(
        "event",
        "title description bannerImage startDateTime endDateTime speaker speakerImage speakerRole speakerCompany status registrationDeadline location"
      )
      .sort({ registeredAt: -1 })
      .lean();

    const upcomingEvents = eventRegistrations.filter((registration) => {
      if (!registration.event || !registration.event.startDateTime) {
        return false;
      }
      return new Date(registration.event.startDateTime) >= now;
    });

    const bookings = await Booking.find({ student: studentId })
      .populate(
        "mentor",
        "firstName lastName profileImage profession experience skills primarySkill averageRating totalReviews pricing"
      )
      .sort({ sessionDate: -1, createdAt: -1 })
      .lean();

    const totalSessions = bookings.length;
    const totalBookings = totalSessions;

    const completedSessions = bookings.filter(
      (booking) => booking.bookingStatus === "Completed"
    ).length;

    const cancelledSessions = bookings.filter(
      (booking) => booking.bookingStatus === "Cancelled"
    ).length;

    const pendingSessions = bookings.filter(
      (booking) => booking.bookingStatus === "Pending"
    ).length;

    const rejectedSessions = bookings.filter(
      (booking) => booking.bookingStatus === "Rejected"
    ).length;

    const confirmedSessions = bookings.filter(
      (booking) => booking.bookingStatus === "Confirmed"
    ).length;

    const upcomingBookings = bookings
      .filter((booking) => {
        if (booking.bookingStatus !== "Confirmed" || !booking.sessionDate) {
          return false;
        }
        return new Date(booking.sessionDate) >= now;
      })
      .sort(
        (a, b) =>
          new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime()
      );

    const upcomingSessionsCount = upcomingBookings.length;

    const recentBookings = bookings
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.sessionDate).getTime() -
          new Date(a.createdAt || a.sessionDate).getTime()
      )
      .slice(0, 5);

    const totalInvestment = bookings
      .filter(
        (booking) =>
          booking.paymentStatus === "Paid" &&
          booking.bookingStatus === "Completed"
      )
      .reduce((sum, booking) => sum + Number(booking.amount || 0), 0);

    const learningMinutes = bookings
      .filter((booking) => booking.bookingStatus === "Completed")
      .reduce((sum, booking) => sum + Number(booking.duration || 0), 0);

    const learningHours = Number((learningMinutes / 60).toFixed(1));

    const completionRate =
      totalSessions === 0
        ? 0
        : Math.round((completedSessions / totalSessions) * 100);

    const averageSessionDuration =
      completedSessions === 0
        ? 0
        : Math.round(learningMinutes / completedSessions);

    const consultedMentorIds = [
      ...new Set(
        bookings
          .filter((booking) => booking.mentor?._id)
          .map((booking) => booking.mentor._id.toString())
      ),
    ];

    const mentorsConsulted = consultedMentorIds.length;

    const ratings = bookings
      .filter(
        (booking) =>
          booking.bookingStatus === "Completed" &&
          booking.mentor?.averageRating !== undefined &&
          booking.mentor?.averageRating !== null
      )
      .map((booking) => Number(booking.mentor.averageRating))
      .filter((rating) => !Number.isNaN(rating));

    const averageRating =
      ratings.length > 0
        ? Number(
            (
              ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
            ).toFixed(1)
          )
        : 0;

    const progress = completionRate;
    const nextMilestoneTarget = 10;
    const nextMilestone = Math.max(0, nextMilestoneTarget - completedSessions);

    const bookingIds = bookings.map((booking) => booking._id);
    let meetings = [];

    if (bookingIds.length > 0) {
      meetings = await Meeting.find({
        booking: { $in: bookingIds },
      })
        .select(
          "booking roomId scheduledStartTime scheduledEndTime status mentorJoined studentJoined"
        )
        .lean();
    }

    const meetingMap = {};
    meetings.forEach((meeting) => {
      if (meeting.booking) {
        meetingMap[meeting.booking.toString()] = meeting;
      }
    });

    const upcomingSessionsWithMeetings = upcomingBookings.map((booking) => ({
      ...booking,
      meeting: meetingMap[booking._id.toString()] || null,
    }));

    const rescheduleRequests = await RescheduleRequest.find({
      student: studentId,
      status: "Pending",
    })
      .populate("mentor", "firstName lastName profileImage profession")
      .populate(
        "booking",
        "sessionType amount duration bookingStatus sessionDate startTime endTime"
      )
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const badges = await Badge.find().sort({ requiredSessions: 1 }).lean();
    const unlockedBadges = student.achievementHistory || [];

    const badgeProgress = badges.map((badge) => {
      const requiredSessions = Number(badge.requiredSessions || 0);
      const unlocked = unlockedBadges.some(
        (item) => item.title?.toLowerCase() === badge.title?.toLowerCase()
      );
      const currentProgress =
        requiredSessions > 0
          ? Math.min(completedSessions, requiredSessions)
          : 0;
      const progressPercentage =
        requiredSessions > 0
          ? Math.min(
              100,
              Math.round((completedSessions / requiredSessions) * 100)
            )
          : 0;

      return {
        ...badge,
        unlocked,
        currentProgress,
        progressPercentage,
      };
    });

    const notifications = [];

    upcomingSessionsWithMeetings.slice(0, 3).forEach((booking) => {
      const mentorName = booking.mentor
        ? `${booking.mentor.firstName || ""} ${
            booking.mentor.lastName || ""
          }`.trim()
        : "your mentor";
      const formattedDate = booking.sessionDate
        ? new Date(booking.sessionDate).toLocaleDateString("en-IN")
        : "an upcoming date";

      notifications.push({
        id: `booking-${booking._id}`,
        type: "session",
        title: "Upcoming Mentorship Session",
        message: `Your session with ${mentorName} is scheduled for ${formattedDate} at ${
          booking.startTime || "the scheduled time"
        }.`,
        time: booking.sessionDate || booking.createdAt || now,
        read: booking.isSeen || false,
        bookingId: booking._id,
      });
    });

    const recommendedMentors = await Mentor.find({
      _id: { $nin: consultedMentorIds },
    })
      .select(
        "firstName lastName profileImage profession experience skills primarySkill averageRating totalReviews pricing"
      )
      .sort({ averageRating: -1, totalReviews: -1 })
      .limit(4)
      .lean();

    const learningAnalytics = {
      totalSessions,
      completedSessions,
      upcomingSessions: upcomingSessionsCount,
      learningMinutes,
      learningHours,
      totalInvestment,
      mentorsConsulted,
      averageRating,
      completionRate,
      averageSessionDuration,
    };

    const stats = {
      totalBookings,
      totalSessions,
      completedSessions,
      cancelledSessions,
      pendingSessions,
      rejectedSessions,
      confirmedSessions,
      upcomingSessions: upcomingSessionsCount,
      totalInvestment,
      learningMinutes,
      learningHours,
      completionRate,
      averageSessionDuration,
      mentorsConsulted,
      averageRating,
    };

    const progressData = {
      percentage: progress,
      completedSessions,
      totalSessions,
      nextMilestone,
      nextMilestoneTarget,
    };

    return res.status(200).json({
      success: true,
      message: "Student dashboard loaded successfully",
      dashboard: {
        student,
        stats,
        progress: progressData,
        upcomingSessions: upcomingSessionsWithMeetings,
        recentBookings,
        enrolledCourses,
        eventRegistrations,
        upcomingEvents,
        learningAnalytics,
        rescheduleRequests,
        badges: {
          unlocked: unlockedBadges,
          available: badgeProgress,
        },
        notifications,
        recommendedMentors,
      },
    });
  } catch (error) {
    console.error("Get student dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load student dashboard",
      error: error.message,
    });
  }
};

export const getStudentAnalytics = async (req, res) => {
  try {
    // ==========================================================
    // AUTHENTICATED STUDENT
    // ==========================================================

    const studentId = req.user?.id || req.user?._id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Student authentication required",
      });
    }

    // ==========================================================
    // PERIOD
    // ==========================================================

    const { period = "6months", startDate, endDate } = req.query;

    const now = new Date();

    let fromDate = null;
    let toDate = new Date(now);

    // ==========================================================
    // CALCULATE DATE RANGE
    // ==========================================================

    if (period === "30days") {
      fromDate = new Date(now);
      fromDate.setDate(now.getDate() - 30);
      fromDate.setHours(0, 0, 0, 0);
    }

    if (period === "6months") {
      fromDate = new Date(now);
      fromDate.setMonth(now.getMonth() - 6);
      fromDate.setHours(0, 0, 0, 0);
    }

    if (period === "12months") {
      fromDate = new Date(now);
      fromDate.setFullYear(now.getFullYear() - 1);
      fromDate.setHours(0, 0, 0, 0);
    }

    if (period === "all") {
      fromDate = null;
      toDate = null;
    }

    if (period === "custom") {
      if (startDate) {
        fromDate = new Date(startDate);
        fromDate.setHours(0, 0, 0, 0);
      }

      if (endDate) {
        toDate = new Date(endDate);
        toDate.setHours(23, 59, 59, 999);
      }
    }

    // ==========================================================
    // FETCH STUDENT
    // ==========================================================

    const student = await Student.findById(studentId)
      .select(
        "firstName lastName email profileImage education careerGoal learningStats achievementHistory xpHistory"
      )
      .lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // ==========================================================
    // DATE FILTER
    // ==========================================================

    const bookingDateFilter = {};

    if (fromDate || toDate) {
      bookingDateFilter.sessionDate = {};

      if (fromDate) {
        bookingDateFilter.sessionDate.$gte = fromDate;
      }

      if (toDate) {
        bookingDateFilter.sessionDate.$lte = toDate;
      }
    }

    // ==========================================================
    // FETCH BOOKINGS
    // ==========================================================

    const bookings = await Booking.find({
      student: studentId,
      ...bookingDateFilter,
    })
      .populate(
        "mentor",
        "firstName lastName profileImage profession experience skills primarySkill averageRating totalReviews pricing"
      )
      .sort({
        sessionDate: 1,
        createdAt: 1,
      })
      .lean();

    // ==========================================================
    // BASIC COUNTS
    // ==========================================================

    const totalBookings = bookings.length;

    const completedSessions = bookings.filter(
      (booking) => booking.bookingStatus === "Completed"
    ).length;

    const confirmedSessions = bookings.filter(
      (booking) => booking.bookingStatus === "Confirmed"
    ).length;

    const pendingSessions = bookings.filter(
      (booking) => booking.bookingStatus === "Pending"
    ).length;

    const cancelledSessions = bookings.filter(
      (booking) => booking.bookingStatus === "Cancelled"
    ).length;

    const rejectedSessions = bookings.filter(
      (booking) => booking.bookingStatus === "Rejected"
    ).length;

    // ==========================================================
    // UPCOMING SESSIONS
    // ==========================================================

    const upcomingSessions = bookings.filter(
      (booking) =>
        booking.bookingStatus === "Confirmed" &&
        booking.sessionDate &&
        new Date(booking.sessionDate) >= now
    ).length;

    // ==========================================================
    // LEARNING HOURS
    // ==========================================================

    const learningMinutes = bookings
      .filter((booking) => booking.bookingStatus === "Completed")
      .reduce((sum, booking) => sum + Number(booking.duration || 0), 0);

    const learningHours = Number((learningMinutes / 60).toFixed(1));

    // ==========================================================
    // INVESTMENT
    // ==========================================================

    const totalInvestment = bookings
      .filter(
        (booking) =>
          booking.paymentStatus === "Paid" &&
          booking.bookingStatus === "Completed"
      )
      .reduce((sum, booking) => sum + Number(booking.amount || 0), 0);

    // ==========================================================
    // COMPLETION RATE
    // ==========================================================

    const completionRate =
      totalBookings === 0
        ? 0
        : Math.round((completedSessions / totalBookings) * 100);

    // ==========================================================
    // AVERAGE SESSION DURATION
    // ==========================================================

    const averageSessionDuration =
      completedSessions === 0
        ? 0
        : Math.round(learningMinutes / completedSessions);

    // ==========================================================
    // COURSE ENROLMENTS & ANALYTICS
    // ==========================================================

    const enrollments = await Enrollment.find({ student: studentId })
      .populate("course", "title category level")
      .lean()
      .catch(() => []);

    const totalCoursesEnrolled = enrollments.length;

    const completedCourses = enrollments.filter(
      (e) => e.isCompleted || e.progressPercentage === 100
    ).length;

    const courseAnalytics = [
      { status: "Enrolled", count: totalCoursesEnrolled },
      { status: "Completed", count: completedCourses },
      { status: "In Progress", count: totalCoursesEnrolled - completedCourses },
    ];

    // ==========================================================
    // UNIQUE MENTORS
    // ==========================================================

    const mentorMap = new Map();

    bookings.forEach((booking) => {
      if (!booking.mentor?._id) {
        return;
      }

      const id = booking.mentor._id.toString();

      if (!mentorMap.has(id)) {
        mentorMap.set(id, {
          mentorId: id,
          name: `${booking.mentor.firstName || ""} ${
            booking.mentor.lastName || ""
          }`.trim(),
          profession: booking.mentor.profession || "Mentor",
          profileImage: booking.mentor.profileImage || null,
          sessions: 0,
          completed: 0,
          cancelled: 0,
          investment: 0,
          rating: Number(booking.mentor.averageRating || 0),
        });
      }

      const mentor = mentorMap.get(id);

      mentor.sessions += 1;

      if (booking.bookingStatus === "Completed") {
        mentor.completed += 1;
      }

      if (booking.bookingStatus === "Cancelled") {
        mentor.cancelled += 1;
      }

      if (
        booking.paymentStatus === "Paid" &&
        booking.bookingStatus === "Completed"
      ) {
        mentor.investment += Number(booking.amount || 0);
      }
    });

    const mentorPerformance = Array.from(mentorMap.values())
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 10);

    const mentorsConsulted = mentorMap.size;

    // ==========================================================
    // REVIEWS
    // ==========================================================

    const reviewDateFilter = {
      studentId,
    };

    if (fromDate || toDate) {
      reviewDateFilter.createdAt = {};

      if (fromDate) {
        reviewDateFilter.createdAt.$gte = fromDate;
      }

      if (toDate) {
        reviewDateFilter.createdAt.$lte = toDate;
      }
    }

    const reviews = await Review.find(reviewDateFilter)
      .populate("studentId", "firstName lastName profileImage")
      .populate("mentorId", "firstName lastName profileImage profession")
      .lean();

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews === 0
        ? 0
        : Number(
            (
              reviews.reduce(
                (sum, review) => sum + Number(review.rating || 0),
                0
              ) / totalReviews
            ).toFixed(1)
          );

    // ==========================================================
    // SESSION TYPE ANALYTICS
    // ==========================================================

    const sessionTypeMap = {};

    bookings.forEach((booking) => {
      const type = booking.sessionType || "Mentorship Session";

      if (!sessionTypeMap[type]) {
        sessionTypeMap[type] = {
          type,
          count: 0,
        };
      }

      sessionTypeMap[type].count += 1;
    });

    const sessionTypes = Object.values(sessionTypeMap);

    // ==========================================================
    // STATUS ANALYTICS
    // ==========================================================

    const bookingStatus = [
      {
        status: "Completed",
        count: completedSessions,
      },
      {
        status: "Confirmed",
        count: confirmedSessions,
      },
      {
        status: "Pending",
        count: pendingSessions,
      },
      {
        status: "Cancelled",
        count: cancelledSessions,
      },
      {
        status: "Rejected",
        count: rejectedSessions,
      },
    ];

    // ==========================================================
    // MONTHLY / DAILY TREND
    // ==========================================================

    const trendMap = {};

    bookings.forEach((booking) => {
      if (!booking.sessionDate) {
        return;
      }

      const date = new Date(booking.sessionDate);

      let key;

      if (period === "30days") {
        key = date.toISOString().split("T")[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      }

      if (!trendMap[key]) {
        trendMap[key] = {
          period: key,
          bookings: 0,
          completed: 0,
          cancelled: 0,
          learningMinutes: 0,
          investment: 0,
        };
      }

      trendMap[key].bookings += 1;

      if (booking.bookingStatus === "Completed") {
        trendMap[key].completed += 1;

        trendMap[key].learningMinutes += Number(booking.duration || 0);
      }

      if (booking.bookingStatus === "Cancelled") {
        trendMap[key].cancelled += 1;
      }

      if (
        booking.paymentStatus === "Paid" &&
        booking.bookingStatus === "Completed"
      ) {
        trendMap[key].investment += Number(booking.amount || 0);
      }
    });

    const trends = Object.values(trendMap)
      .sort((a, b) => a.period.localeCompare(b.period))
      .map((item) => ({
        ...item,
        learningHours: Number((item.learningMinutes / 60).toFixed(1)),
      }));

    // ==========================================================
    // RESCHEDULE ANALYTICS
    // ==========================================================

    const rescheduleFilter = {
      student: studentId,
    };

    if (fromDate || toDate) {
      rescheduleFilter.createdAt = {};

      if (fromDate) {
        rescheduleFilter.createdAt.$gte = fromDate;
      }

      if (toDate) {
        rescheduleFilter.createdAt.$lte = toDate;
      }
    }

    const rescheduleRequests = await RescheduleRequest.find(
      rescheduleFilter
    ).lean();

    const rescheduleAnalytics = [
      {
        status: "Pending",
        count: rescheduleRequests.filter((item) => item.status === "Pending")
          .length,
      },
      {
        status: "Accepted",
        count: rescheduleRequests.filter((item) => item.status === "Accepted")
          .length,
      },
      {
        status: "Rejected",
        count: rescheduleRequests.filter((item) => item.status === "Rejected")
          .length,
      },
      {
        status: "Cancelled",
        count: rescheduleRequests.filter((item) => item.status === "Cancelled")
          .length,
      },
    ];

    // ==========================================================
    // EVENTS
    // ==========================================================

    // ==========================================================
    // EVENTS
    // ==========================================================

    const eventRegistrationFilter = {
      student: studentId,
      status: "Registered",
    };

    if (fromDate || toDate) {
      eventRegistrationFilter.createdAt = {};

      if (fromDate) {
        eventRegistrationFilter.createdAt.$gte = fromDate;
      }

      if (toDate) {
        eventRegistrationFilter.createdAt.$lte = toDate;
      }
    }

    const eventRegistrations = await EventRegistration.find(
      eventRegistrationFilter
    )
      .populate("event", "title startDateTime status")
      .lean();

    const eventsRegistered = eventRegistrations.length;

    const upcomingEventsCount = eventRegistrations.filter(
      (item) => item.event && new Date(item.event.startDateTime) >= now
    ).length;

    const completedEventsCount = eventRegistrations.filter(
      (item) => item.event && new Date(item.event.startDateTime) < now
    ).length;

    const eventAnalytics = [
      {
        category: "Registered",
        count: eventsRegistered,
      },
      {
        category: "Upcoming",
        count: upcomingEventsCount,
      },
      {
        category: "Completed",
        count: completedEventsCount,
      },
    ];

    // ==========================================================
    // MEETINGS
    // ==========================================================

    const bookingIds = bookings.map((booking) => booking._id);

    const meetings = await Meeting.find({
      booking: {
        $in: bookingIds,
      },
    }).lean();

    const meetingsCompleted = meetings.filter(
      (meeting) => meeting.status === "Completed"
    ).length;

    const meetingsCancelled = meetings.filter(
      (meeting) => meeting.status === "Cancelled"
    ).length;

    const meetingsInProgress = meetings.filter(
      (meeting) => meeting.status === "In Progress"
    ).length;

    const meetingAnalytics = [
      {
        status: "Completed",
        count: meetingsCompleted,
      },
      {
        status: "In Progress",
        count: meetingsInProgress,
      },
      {
        status: "Cancelled",
        count: meetingsCancelled,
      },
    ];

    // ==========================================================
    // BADGE ANALYTICS
    // ==========================================================

    const badges = await Badge.find({})
      .sort({
        requiredSessions: 1,
      })
      .lean();

    const unlockedBadges = student.achievementHistory || [];

    const badgeAnalytics = badges.map((badge) => {
      const unlocked = unlockedBadges.some(
        (item) => item.title?.toLowerCase() === badge.title?.toLowerCase()
      );

      const requiredSessions = Number(badge.requiredSessions || 1);

      const currentProgress = Math.min(completedSessions, requiredSessions);

      const progressPercentage = Math.min(
        100,
        Math.round((currentProgress / requiredSessions) * 100)
      );

      const remaining = Math.max(0, requiredSessions - currentProgress);

      return {
        _id: badge._id,
        id: badge._id,
        title: badge.title,
        description: badge.description || "",
        requiredSessions,
        required: requiredSessions,
        currentProgress,
        progressPercentage,
        unlocked,
        remaining,
      };
    });

    const unlockedBadgeCount = badgeAnalytics.filter(
      (badge) => badge.unlocked
    ).length;

    const totalBadgeCount = badgeAnalytics.length;

    const badgeCompletionPercentage =
      totalBadgeCount === 0
        ? 0
        : Math.round((unlockedBadgeCount / totalBadgeCount) * 100);

    const currentBadge =
      [...badgeAnalytics].reverse().find((badge) => badge.unlocked) ||
      badgeAnalytics[0] ||
      null;

    const nextBadge = badgeAnalytics.find((badge) => !badge.unlocked) || null;

    const badgeSummary = {
      totalBadges: totalBadgeCount,
      unlockedBadges: unlockedBadgeCount,
      overallProgress: badgeCompletionPercentage,
      currentBadge,
      nextBadge,
    };

    // ==========================================================
    // GAMIFICATION
    // ==========================================================

    const xp = Number(student.learningStats?.xp || 0);

    const level = Number(student.learningStats?.level || 1);

    const streak = student.learningStats?.streak || {
      current: 0,
      longest: 0,
    };

    const XP_PER_LEVEL = 500;

    const currentLevelXP = xp % XP_PER_LEVEL;

    const levelProgress = Math.round((currentLevelXP / XP_PER_LEVEL) * 100);

    const titles = [
      "New Learner",
      "Beginner",
      "Explorer",
      "Dedicated",
      "Expert",
      "Champion",
      "Master",
    ];

    const levelTitle = titles[level - 1] || "Legend";

    // ==========================================================
    // RESPONSE
    // ==========================================================

    return res.status(200).json({
      success: true,

      analytics: {
        period,

        dateRange: {
          from: fromDate,
          to: toDate,
        },

        student,

        overview: {
          totalBookings,
          completedSessions,
          confirmedSessions,
          pendingSessions,
          cancelledSessions,
          rejectedSessions,
          upcomingSessions,
          totalInvestment,
          learningMinutes,
          learningHours,
          completionRate,
          averageSessionDuration,
          mentorsConsulted,
          averageRating,
          totalReviews,
          totalReschedules: rescheduleRequests.length,
          eventsRegistered,
          meetingsCompleted,
          totalMeetings: meetings.length,
          totalCoursesEnrolled,
          completedCourses,
        },

        trends,

        bookingStatus,

        sessionTypes,

        mentorPerformance,

        rescheduleAnalytics,

        eventAnalytics,

        courseAnalytics,

        meetingAnalytics,

        badgeSummary,

        badgeAnalytics,

        gamification: {
          xp,

          level,

          levelTitle,

          currentXP: currentLevelXP,

          nextXP: XP_PER_LEVEL,

          levelProgress,

          streak: {
            current: Number(streak.current || 0),

            longest: Number(streak.longest || 0),
          },

          xpHistory: student.xpHistory?.slice(-5).reverse() || [],
        },
      },
    });
  } catch (error) {
    console.error("Get student analytics error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load student analytics",
      error: error.message,
    });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({})
      .select("title category duration mode institution createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};