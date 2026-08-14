import Mentor from "../models/Mentor.js";
import createAuditLog from "../utils/createAuditLog.js";
import Student from "../models/Student.js";
import Booking from "../models/Bookings.js";
import Review from "../models/Reviews.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Meeting from "../models/Meeting.js";
import axios from "axios";
import {createMeeting} from "./meetingController.js";



export const applyMentor = async (req, res) => {
  try {
    const userId = req.user.id;
    const body = req.body;

    // =====================================================
    // DUPLICATE CHECK
    // =====================================================
    const existingMentor = await Mentor.findOne({ student: userId });

    if (existingMentor) {
      return res.status(400).json({
        success: false,
        message: "Mentor application already exists.",
      });
    }

    // =====================================================
    // HELPER FUNCTIONS
    // =====================================================

    const safeNumber = (value, fallback = 0) => {
      const num = Number(value);
      return Number.isNaN(num) ? fallback : num;
    };

    const parseJSON = (value, fallback = []) => {
      try {
        return value ? JSON.parse(value) : fallback;
      } catch {
        return fallback;
      }
    };

    const getFilePath = (field) => {
      return req.files?.[field]?.[0]?.path || "";
    };

    // =====================================================
    // PARSE ARRAYS
    // =====================================================

    const primarySkill = parseJSON(body.primarySkill)
      .map((item) => String(item).trim())
      .filter(Boolean);

    const languages = parseJSON(body.languages)
      .map((item) => String(item).trim())
      .filter(Boolean);

    const certifications = parseJSON(body.certifications)
      .map((item) => String(item).trim())
      .filter(Boolean);

    // =====================================================
    // AVAILABILITY DAYS
    // =====================================================

    const availableDays = parseJSON(body.availableDays)
      .map((day) => String(day).trim())
      .filter(Boolean);

    const sessionTypes = parseJSON(body.sessionTypes)
      .map((item) => String(item).trim())
      .filter(Boolean);

    // =====================================================
    // NUMERIC VALUES
    // =====================================================

    const experience = safeNumber(body.experience);

    const skillExperience = safeNumber(body.skillExperience);

    const sessionPrice = safeNumber(body.sessionPrice);

    const graduationYear = safeNumber(body.graduationYear);

    const sessionDuration = safeNumber(body.sessionDuration);

    // =====================================================
    // REQUIRED FIELD VALIDATION
    // =====================================================

    if (
      !body.firstName ||
      !body.lastName ||
      !body.email ||
      !body.phone ||
      !body.profession ||
      primarySkill.length === 0 ||
      !body.degree ||
      !body.college ||
      !body.headline ||
      !body.about ||
      sessionTypes.length === 0 ||
      body.agreement !== "true"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // =====================================================
    // EMAIL VALIDATION
    // =====================================================

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(body.email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

    // =====================================================
    // PHONE VALIDATION
    // =====================================================

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(body.phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must contain exactly 10 digits.",
      });
    }

    // =====================================================
    // EXPERIENCE VALIDATION
    // =====================================================

    if (experience < 0) {
      return res.status(400).json({
        success: false,
        message: "Experience cannot be negative.",
      });
    }

    if (experience > 60) {
      return res.status(400).json({
        success: false,
        message: "Experience is too high.",
      });
    }

    // =====================================================
    // SKILL EXPERIENCE VALIDATION
    // =====================================================

    if (skillExperience < 0) {
      return res.status(400).json({
        success: false,
        message: "Skill experience cannot be negative.",
      });
    }

    if (skillExperience > 60) {
      return res.status(400).json({
        success: false,
        message: "Skill experience is too high.",
      });
    }

    // =====================================================
    // SESSION PRICE VALIDATION
    // =====================================================

    if (sessionPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Session price cannot be negative.",
      });
    }

    // =====================================================
    // GRADUATION YEAR VALIDATION
    // =====================================================

    if (graduationYear && (graduationYear < 1950 || graduationYear > 2100)) {
      return res.status(400).json({
        success: false,
        message: "Invalid graduation year.",
      });
    }

    // =====================================================
    // TIME VALIDATION
    // =====================================================

    if (body.startTime && body.endTime && body.startTime >= body.endTime) {
      return res.status(400).json({
        success: false,
        message: "End time must be later than start time.",
      });
    }

    // =====================================================
    // AVAILABLE DAYS VALIDATION
    // =====================================================

    if (availableDays.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one available day.",
      });
    }

    // =====================================================
    // SESSION DURATION VALIDATION
    // =====================================================

    const allowedDurations = [15, 30, 45, 60, 90, 120];

    if (sessionDuration && !allowedDurations.includes(sessionDuration)) {
      return res.status(400).json({
        success: false,
        message: "Invalid session duration.",
      });
    }

    // =====================================================
    // FILE VALIDATION
    // =====================================================

    if (!req.files?.profileImage?.length) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required.",
      });
    }

    if (!req.files?.resume?.length) {
      return res.status(400).json({
        success: false,
        message: "Resume is required.",
      });
    }

    if (!req.files?.governmentId?.length) {
      return res.status(400).json({
        success: false,
        message: "Government ID is required.",
      });
    }

    if (!req.files?.degreeCertificate?.length) {
      return res.status(400).json({
        success: false,
        message: "Degree certificate is required.",
      });
    }

    // =====================================================
    // CREATE MENTOR
    // =====================================================

    const mentor = await Mentor.create({
      // ================= USER =================
      student: userId,

      // ================= PERSONAL =================
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      dob: body.dob || null,
      gender: body.gender,

      location: {
        city: body.city?.trim() || "",
        state: body.state?.trim() || "",
        country: body.country?.trim() || "",
      },

      // ================= PROFESSIONAL =================
      profession: body.profession.trim(),
      company: body.company?.trim() || "",
      experience,
      industry: body.industry?.trim() || "",
      linkedin: body.linkedin?.trim() || "",

      // ================= EXPERTISE =================
      primarySkill,
      category: body.category?.trim() || "",
      languages,
      skillExperience,
      skillLevel: body.skillLevel?.trim() || "",

      // ================= EDUCATION =================
      education: {
        degree: body.degree.trim(),
        college: body.college.trim(),
        graduationYear,
        cgpa: body.cgpa?.trim() || "",
      },

      certifications,

      // ================= ABOUT =================
      headline: body.headline.trim(),
      about: body.about.trim(),
      teachingStyle: body.teachingStyle?.trim() || "",

      // ================= AVAILABILITY =================
      availability: {
        availableDays,
        preferredTime: body.preferredTime || "",
        startTime: body.startTime || "",
        endTime: body.endTime || "",
        timezone: body.timezone || "Asia/Kolkata",
        sessionDuration,
      },

      // ================= PRICING =================
      pricing: {
        sessionTypes,
        sessionPrice,
        currency: body.currency || "INR",
        freeTrial: body.freeTrial === "true",
        pricingNote: body.pricingNote?.trim() || "",
      },

      // ================= FILES =================
      profileImage: getFilePath("profileImage"),
      resume: getFilePath("resume"),
      governmentId: getFilePath("governmentId"),
      degreeCertificate: getFilePath("degreeCertificate"),

      // ================= REVIEWS =================
      reviews: [],
      averageRating: 0,
      totalReviews: 0,

      // ================= VERIFICATION =================
      agreement: body.agreement === "true",

      verificationStatus: "Pending",

      isVerified: false,

      accountStatus: "Active",

      rejectionReason: "",

      suspensionReason: "",

      suspendedBy: null,

      suspendedAt: null,

      approvedBy: null,

      approvedAt: null,
    });

    const student = await Student.findById(userId).select("-password");
    // =====================================================
    // AUDIT LOG
    // =====================================================

    await createAuditLog({
      req,
      user: {
        ...student.toObject(),
        role: "Student",
      },
      action: "Apply Mentor",
      module: "Mentor",
      description: `Submitted mentor application as ${mentor.profession}.`,
      targetId: mentor._id,
      targetType: "Mentor",
    });

  

     const response = await fetch("https://api.brevo.com/v3/smtp/email", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         "api-key": process.env.BREVO_API_KEY,
       },
       body: JSON.stringify({
         sender: {
           name: "GuideX",
           email: process.env.BREVO_SENDER_EMAIL,
         },
         to: [
           {
             email: registration.student.email,
             name: registration.student.name,
           },
         ],
         subject: `Registration Cancelled - ${registration.event.title}`,
         htmlContent: `...your existing HTML...`,
         textContent: `...your existing text...`,
       }),
     });

     if (!response.ok) {
       return res.status(500).json({
         success: false,
         message: "Failed to send email",
       });
     }
    // =====================================================
    // SUCCESS RESPONSE
    // =====================================================

    return res.status(201).json({
      success: true,
      message: "Mentor application submitted successfully.",
      mentor,
    });
  } catch (error) {
    console.error("======================================");
    console.error("Apply Mentor Error");
    console.error(error);
    console.error("======================================");

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A mentor application already exists.",
      });
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);

      return res.status(400).json({
        success: false,
        message: errors.join(", "),
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// get Mentor Profile
export const getMyMentorProfile = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ student: req.user.id });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      mentor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllMentors = async (req, res) => {
  try {
    const { category, skill, company, verified } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (skill) filter.primarySkill = skill;
    if (company) filter.company = company;
    if (verified === "true") filter.isVerified = true;

    const mentors = await Mentor.find(filter)
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: mentors.length,
      mentors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id).populate(
      "student",
      "name email"
    );

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    // Fetch only reviews the mentor/student have chosen to keep visible
    const reviews = await Review.find({
      mentorId: mentor._id,
      isVisible: true,
    })
      .populate("studentId", "firstName lastName profileImage")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    return res.status(200).json({
      success: true,
      mentor,
      reviews,
      ratingSummary: {
        average: Number(avgRating.toFixed(1)),
        total: totalReviews,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMentorProfile = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({
      student: req.user.id,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    res.status(200).json({
      success: true,
      mentor: {
        ...mentor.toObject(),
        role: "mentor", // ✅ Add role
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================================
// Helper Functions
// =======================================================

const getMonthName = (monthIndex) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return months[monthIndex];
};



// =======================================================
// GET MENTOR DASHBOARD
// GET /api/mentor/dashboard
// Private
// =======================================================

// Helper function to calculate profile completion percentage
const calculateProfileCompletion = (mentor) => {
  let fields = [
    mentor.firstName,
    mentor.lastName,
    mentor.profession,
    mentor.bio,
    mentor.profileImage,
    mentor.skills && mentor.skills.length > 0,
    mentor.experience && mentor.experience.length > 0,
    mentor.education && mentor.education.length > 0,
    mentor.hourlyRate,
  ];

  const completed = fields.filter(Boolean).length;
  return Math.round((completed / fields.length) * 100);
};

export const getMentorDashboard = async (req, res) => {
  try {
    // Logged in student id
    const studentId = req.user.id;

    // Mentor profile
    const mentor = await Mentor.findOne({
      student: studentId,
    });

    if (!mentor) {
      return res.status(404).json({
        message: "Mentor profile not found",
      });
    }

    // ===================================================
    // ALL BOOKINGS
    // ===================================================

    const bookings = await Booking.find({
      mentor: mentor._id,
    })
      .populate("student", "firstName lastName email profileImage")
      .sort({ createdAt: -1 });

    // ===================================================
    // STATS & FINANCIALS
    // ===================================================

    const completedBookings = bookings.filter(
      (b) => b.bookingStatus === "Completed"
    );

    const upcomingBookings = bookings.filter(
      (b) =>
        b.bookingStatus === "Confirmed" && new Date(b.sessionDate) >= new Date()
    );

    const totalStudents = new Set(
      completedBookings.map((b) => b.student?._id?.toString())
    ).size;

    // Net earnings for the mentor (after platform fees & commissions)
    const totalEarnings = completedBookings.reduce(
      (sum, booking) => sum + (booking.mentorEarnings || booking.amount),
      0
    );

    // Gross earnings (total paid by students)
    const grossEarnings = completedBookings.reduce(
      (sum, booking) => sum + booking.amount,
      0
    );

    // Total platform and admin fees deducted from mentor sessions
    const totalCommissionsPaid = completedBookings.reduce(
      (sum, booking) => sum + (booking.adminCommission || 0) + (booking.platformFee || 0),
      0
    );

    const stats = {
      totalEarnings,         // Net earnings
      grossEarnings,         // Gross volume
      totalCommissionsPaid,  // Total fees/commissions deducted
      totalStudents,
      completedSessions: completedBookings.length,
      upcomingSessions: upcomingBookings.length,
    };

    // ===================================================
    // MONTHLY EARNINGS (NET)
    // ===================================================

    const earningsByMonth = [];

    for (let month = 0; month < 12; month++) {
      const monthBookings = completedBookings.filter((booking) => {
        const bookingDate = new Date(booking.sessionDate);

        return bookingDate.getMonth() === month;
      });

      const earnings = monthBookings.reduce(
        (sum, booking) => sum + (booking.mentorEarnings || booking.amount),
        0
      );

      earningsByMonth.push({
        month: getMonthName(month),
        earnings,
      });
    }

    // ===================================================
    // SESSION ANALYTICS
    // ===================================================

    const sessionAnalytics = {
      completed: bookings.filter((b) => b.bookingStatus === "Completed").length,

      upcoming: bookings.filter(
        (b) =>
          b.bookingStatus === "Confirmed" &&
          new Date(b.sessionDate) >= new Date()
      ).length,

      pending: bookings.filter((b) => b.bookingStatus === "Pending").length,

      cancelled: bookings.filter((b) => b.bookingStatus === "Cancelled").length,

      rejected: bookings.filter((b) => b.bookingStatus === "Rejected").length,
    };

    // ===================================================
    // UPCOMING BOOKINGS
    // ===================================================

    const upcomingBookingsList = bookings
      .filter(
        (booking) =>
          booking.bookingStatus === "Confirmed" &&
          new Date(booking.sessionDate) >= new Date()
      )
      .sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate))
      .slice(0, 5);

    // ===================================================
    // TODAY'S BOOKINGS
    // ===================================================

    const today = new Date();

    const todayBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.sessionDate);

      return (
        bookingDate.getDate() === today.getDate() &&
        bookingDate.getMonth() === today.getMonth() &&
        bookingDate.getFullYear() === today.getFullYear() &&
        booking.bookingStatus === "Confirmed"
      );
    });

    // ===================================================
    // RECENT REVIEWS
    // ===================================================

    const recentReviews = await Review.find({
      mentorId: mentor._id,
    })
      .populate("studentId", "firstName lastName email profileImage")
      .sort({ createdAt: -1 })
      .limit(4);

    const formattedReviews = recentReviews.map((review) => ({
      _id: review._id,
      rating: review.rating,
      comment: review.review,
      createdAt: review.createdAt,
      student: review.studentId,
    }));

    // ===================================================
    // RECENT STUDENTS
    // ===================================================

    const studentMap = new Map();

    completedBookings.forEach((booking) => {
      const id = booking.student?._id?.toString();

      if (!id) return;

      if (!studentMap.has(id)) {
        studentMap.set(id, {
          _id: booking.student._id,
          firstName: booking.student.firstName,
          lastName: booking.student.lastName,
          email: booking.student.email,
          profileImage: booking.student.profileImage,
          totalSessions: 1,
          lastSession: booking.sessionDate,
        });
      } else {
        const student = studentMap.get(id);

        student.totalSessions++;

        if (new Date(booking.sessionDate) > new Date(student.lastSession)) {
          student.lastSession = booking.sessionDate;
        }
      }
    });

    const recentStudents = [...studentMap.values()]
      .sort((a, b) => new Date(b.lastSession) - new Date(a.lastSession))
      .slice(0, 4);

    // ===================================================
    // PROFILE COMPLETION
    // ===================================================

    const profileCompletion = calculateProfileCompletion(mentor);

    // ===================================================
    // RECENT ACTIVITY
    // ===================================================

    const activities = [];

    // BOOKING ACTIVITIES
    bookings.slice(0, 5).forEach((booking) => {
      activities.push({
        _id: booking._id,
        type:
          booking.bookingStatus === "Completed"
            ? "completed"
            : booking.bookingStatus === "Cancelled"
            ? "cancelled"
            : "booking",
        title: `${booking.bookingStatus} Session`,
        description: `${booking.sessionType} session with ${
          booking.student?.firstName || "Student"
        } ${booking.student?.lastName || ""}`,
        createdAt: booking.updatedAt,
      });
    });

    // REVIEW ACTIVITIES
    recentReviews.forEach((review) => {
      activities.push({
        _id: review._id,
        type: "review",
        title: "New Review Received",
        description: `${review.studentId?.firstName} rated you ${review.rating}/5 stars.`,
        createdAt: review.createdAt,
      });
    });

    // PAYMENT ACTIVITIES
    completedBookings.slice(0, 3).forEach((booking) => {
      const earningsToShow = booking.mentorEarnings || booking.amount;
      activities.push({
        _id: `${booking._id}-payment`,
        type: "payment",
        title: "Earnings Credited",
        description: `₹${earningsToShow} earned (Net) for ${booking.sessionType}.`,
        createdAt: booking.updatedAt,
      });
    });

    // PROFILE ACTIVITY
    activities.push({
      _id: "profile",
      type: "profile",
      title: "Profile Updated",
      description: `Your profile is ${profileCompletion}% complete.`,
      createdAt: mentor.updatedAt,
    });

    // SORT ACTIVITIES
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // ===================================================
    // FINAL RESPONSE
    // ===================================================

    return res.status(200).json({
      mentor,
      stats,
      earningsByMonth,
      sessionAnalytics,
      upcomingBookings: upcomingBookingsList,
      todayBookings,
      recentReviews: formattedReviews,
      recentStudents,
      profileCompletion,
      activities: activities.slice(0, 10),
    });
  } catch (error) {
    console.error("Mentor Dashboard Error:", error);

    return res.status(500).json({
      message: "Failed to load mentor dashboard.",
      error: error.message,
    });
  }
};

export const getMentorAvailability = async (req, res) => {
  try {
    const studentId = req.user.id;

    const mentor = await Mentor.findOne({ student: studentId }).select(
      "availability firstName lastName profileImage"
    );

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    res.status(200).json({
      success: true,
      mentor,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch availability",
    });
  }
};

export const getPendingBookings = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({
      student: req.user.id,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    const bookings = await Booking.find({
      mentor: mentor._id,
      bookingStatus: "Pending",
    })
      .populate("student", "firstName lastName email profileImage phone")
      .sort({
        sessionDate: 1,
      });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// APPROVE BOOKING
// =====================================================
export const approveBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const mentor = await Mentor.findOne({ student: req.user.id });
    if (!mentor) {
      return res
        .status(404)
        .json({ success: false, message: "Mentor not found" });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      mentor: mentor._id,
    });
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (booking.bookingStatus === "Confirmed") {
      return res
        .status(400)
        .json({ success: false, message: "Booking is already approved" });
    }

    booking.bookingStatus = "Confirmed";
    booking.cancellationReason = null;
    booking.cancelledBy = null;
    await booking.save();

    // Automatically generate the Meeting room & Google Meet link
    const meeting = await createMeeting(booking._id);

    return res.status(200).json({
      success: true,
      message: "Booking approved successfully",
      booking,
      meeting,
    });
  } catch (error) {
    console.error("Approve Booking Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// =====================================================
// REJECT BOOKING
// =====================================================
export const rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const mentor = await Mentor.findOne({
      student: req.user.id,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      mentor: mentor._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Prevent rejecting an already processed booking
    if (
      booking.bookingStatus !== "Pending" &&
      booking.bookingStatus !== "Confirmed" &&
      booking.bookingStatus !== "Approved"
    ) {
      return res.status(400).json({
        success: false,
        message: "Only pending or approved bookings can be cancelled.",
      });
    }

    // Ensure a reason is provided
    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required.",
      });
    }

    booking.bookingStatus = "Cancelled";
    booking.cancelledBy = "Mentor";
    booking.cancellationReason = reason.trim();

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking rejected successfully.",
      booking,
    });
  } catch (error) {
    console.error("Reject Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getRejectedBookings = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({
      student: req.user.id,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    const bookings = await Booking.find({
      mentor: mentor._id,
      bookingStatus: "Rejected",
    })
      .populate("student", "firstName lastName email phone profileImage")
      .sort({
        updatedAt: -1,
      });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getCancelledBookings = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({
      student: req.user.id,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    const bookings = await Booking.find({
      mentor: mentor._id,
      bookingStatus: "Cancelled",
    })
      .populate("student", "firstName lastName email phone profileImage")
      .sort({
        updatedAt: -1,
      });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const getCompletedBookings = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({
      student: req.user.id,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    const bookings = await Booking.find({
      mentor: mentor._id,
      bookingStatus: "Completed",
    })
      .populate("student", "firstName lastName email phone profileImage")
      .sort({ updatedAt: -1 });

    const bookingIds = bookings.map((b) => b._id);

    const reviews = await Review.find({
      bookingId: { $in: bookingIds },
      isVisible: true,
    });

    // map bookingId -> review for O(1) lookup
    const reviewMap = {};
    reviews.forEach((r) => {
      reviewMap[r.bookingId.toString()] = r;
    });

    const bookingsWithReviews = bookings.map((b) => ({
      ...b.toObject(),
      review: reviewMap[b._id.toString()] || null,
    }));

    res.status(200).json({
      success: true,
      count: bookingsWithReviews.length,
      bookings: bookingsWithReviews,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getAvailability = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({
      student: req.user.id,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    res.status(200).json({
      success: true,
      availability: mentor.availability,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({
      student: req.user.id,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    mentor.availability = req.body;

    await mentor.save();

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      availability: mentor.availability,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};




export const getMentorReviews = async (req, res) => {
  try {
    const mentorId = req.user.id;

    const reviews = await Review.find({
      mentor: mentorId,
    })
      .populate("firstName lastName email profileImage")
      .populate("bookingId", "sessionDate startTime endTime duration")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching mentor reviews:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch mentor reviews",
      error: error.message,
    });
  }
};


export const updateMentorProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const student = await Student.findById(userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      });
    }

    // =========================================================
    // FIND MENTOR
    // =========================================================

    const mentor = await Mentor.findOne({
      student: userId,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found.",
      });
    }

    // =========================================================
    // JSON PARSER
    // =========================================================

    const parseJSON = (value, fallback) => {
      if (value === undefined || value === null || value === "") {
        return fallback;
      }

      if (typeof value === "object") {
        return value;
      }

      try {
        return JSON.parse(value);
      } catch (error) {
        console.error("JSON parsing error:", error.message);

        return fallback;
      }
    };

    // =========================================================
    // PARSE NESTED DATA
    // =========================================================

    const location = parseJSON(req.body.location, {});

    const education = parseJSON(req.body.education, {});

    const pricing = parseJSON(req.body.pricing, {});

    const availability = parseJSON(req.body.availability, {});

    const primarySkill = parseJSON(req.body.primarySkill, []);

    const languages = parseJSON(req.body.languages, []);

    const certifications = parseJSON(req.body.certifications, []);

    // =========================================================
    // STUDENT INFORMATION
    // =========================================================

    if (req.body.firstName !== undefined) {
      student.firstName = req.body.firstName;
    }

    if (req.body.lastName !== undefined) {
      student.lastName = req.body.lastName;
    }

    if (req.body.email !== undefined) {
      student.email = req.body.email;
    }

    if (req.body.phone !== undefined) {
      student.phone = req.body.phone;
    }

    // =========================================================
    // PROFILE IMAGE
    // =========================================================

    if (req.file) {
      const profileImagePath = `/uploads/${req.file.filename}`;


      // Save image in Mentor document
      mentor.profileImage = profileImagePath;

      // Optional:
      // Keep Student profile image synchronized
      student.profileImage = profileImagePath;
    }

    // =========================================================
    // SAVE STUDENT
    // =========================================================

    await student.save();

    // =========================================================
    // PERSONAL INFORMATION
    // =========================================================

    if (req.body.firstName !== undefined) {
      mentor.firstName = req.body.firstName;
    }

    if (req.body.lastName !== undefined) {
      mentor.lastName = req.body.lastName;
    }

    if (req.body.phone !== undefined) {
      mentor.phone = req.body.phone;
    }

    if (req.body.dob !== undefined) {
      mentor.dob = req.body.dob === "" ? null : req.body.dob;
    }

    if (req.body.gender !== undefined) {
      mentor.gender = req.body.gender === "" ? undefined : req.body.gender;
    }

    // =========================================================
    // LOCATION
    // =========================================================

    if (req.body.location !== undefined) {
      mentor.location = {
        city: location.city ?? mentor.location?.city ?? "",

        state: location.state ?? mentor.location?.state ?? "",

        country: location.country ?? mentor.location?.country ?? "",
      };
    }

    // =========================================================
    // PROFESSIONAL INFORMATION
    // =========================================================

    if (req.body.profession !== undefined) {
      mentor.profession = req.body.profession;
    }

    if (req.body.company !== undefined) {
      mentor.company = req.body.company;
    }

    if (req.body.experience !== undefined) {
      mentor.experience =
        req.body.experience === "" ? undefined : Number(req.body.experience);
    }

    if (req.body.industry !== undefined) {
      mentor.industry = req.body.industry;
    }

    if (req.body.linkedin !== undefined) {
      mentor.linkedin = req.body.linkedin;
    }

    // =========================================================
    // EXPERTISE
    // =========================================================

    if (req.body.primarySkill !== undefined) {
      mentor.primarySkill = Array.isArray(primarySkill) ? primarySkill : [];
    }

    if (req.body.category !== undefined) {
      mentor.category = req.body.category;
    }

    if (req.body.languages !== undefined) {
      mentor.languages = Array.isArray(languages) ? languages : [];
    }

    if (req.body.skillExperience !== undefined) {
      mentor.skillExperience =
        req.body.skillExperience === ""
          ? undefined
          : Number(req.body.skillExperience);
    }

    if (req.body.skillLevel !== undefined) {
      mentor.skillLevel = req.body.skillLevel;
    }

    // =========================================================
    // EDUCATION
    // =========================================================

    if (req.body.education !== undefined) {
      mentor.education = {
        degree: education.degree ?? mentor.education?.degree ?? "",

        college: education.college ?? mentor.education?.college ?? "",

        graduationYear:
          education.graduationYear ??
          mentor.education?.graduationYear ??
          undefined,

        cgpa: education.cgpa ?? mentor.education?.cgpa ?? "",
      };
    }

    // =========================================================
    // CERTIFICATIONS
    // =========================================================

    if (req.body.certifications !== undefined) {
      mentor.certifications = Array.isArray(certifications)
        ? certifications
        : [];
    }

    // =========================================================
    // ABOUT
    // =========================================================

    if (req.body.headline !== undefined) {
      mentor.headline = req.body.headline;
    }

    if (req.body.about !== undefined) {
      mentor.about = req.body.about;
    }

    if (req.body.teachingStyle !== undefined) {
      mentor.teachingStyle = req.body.teachingStyle;
    }

    // =========================================================
    // AVAILABILITY
    // =========================================================

    if (req.body.availability !== undefined) {
      mentor.availability = {
        availableDays: Array.isArray(availability.availableDays)
          ? availability.availableDays
          : mentor.availability?.availableDays || [],

        preferredTime:
          availability.preferredTime ??
          mentor.availability?.preferredTime ??
          "",

        startTime:
          availability.startTime ?? mentor.availability?.startTime ?? "",

        endTime: availability.endTime ?? mentor.availability?.endTime ?? "",

        timezone:
          availability.timezone ??
          mentor.availability?.timezone ??
          "Asia/Kolkata",

        sessionDuration:
          availability.sessionDuration ??
          mentor.availability?.sessionDuration ??
          undefined,
      };
    }

    // =========================================================
    // PRICING
    // =========================================================

    if (req.body.pricing !== undefined) {
      mentor.pricing = {
        sessionTypes: Array.isArray(pricing.sessionTypes)
          ? pricing.sessionTypes
          : mentor.pricing?.sessionTypes || [],

        sessionPrice: pricing.sessionPrice ?? mentor.pricing?.sessionPrice,

        currency: pricing.currency ?? mentor.pricing?.currency ?? "INR",

        freeTrial: pricing.freeTrial ?? mentor.pricing?.freeTrial ?? false,

        pricingNote: pricing.pricingNote ?? mentor.pricing?.pricingNote ?? "",
      };
    }

    // =========================================================
    // AGREEMENT
    // =========================================================

    if (req.body.agreement !== undefined) {
      mentor.agreement =
        req.body.agreement === "true" || req.body.agreement === true;
    }

    // =========================================================
    // SAVE MENTOR
    // =========================================================

    await mentor.save();

    // =========================================================
    // FETCH UPDATED MENTOR
    // =========================================================

    const populatedMentor = await Mentor.findById(mentor._id)
      .populate({
        path: "student",
        select:
          "firstName lastName email phone profileImage isVerified isActive isBlocked",
      })
      .populate({
        path: "reviews",
        options: {
          sort: {
            createdAt: -1,
          },
        },
      });

    // =========================================================
    // RESPONSE
    // =========================================================

    return res.status(200).json({
      success: true,
      message: "Mentor profile updated successfully.",

      mentor: populatedMentor,
    });
  } catch (error) {
    console.error("Update mentor profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update mentor profile.",
      error: error.message,
    });
  }
};