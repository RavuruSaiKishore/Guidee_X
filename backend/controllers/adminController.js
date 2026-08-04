import bcrypt from "bcrypt";
import Booking from "../models/Bookings.js";
import Mentor from "../models/Mentor.js";
import createAuditLog from "../utils/createAuditLog.js";
import AuditLog from "../models/AuditLog.js";
import Review from "../models/Reviews.js";
import nodemailer from "nodemailer";
import Student from "../models/Student.js";
import Contact from "../models/Contact.js";
import Meeting from "../models/Meeting.js";
import Blog from "../models/Blogs/Blog.js";
import BlogLike from "../models/Blogs/BlogLike.js";
import BlogShare from "../models/Blogs/BlogShare.js";
import BlogComment from "../models/Blogs/BlogComment.js";
import mongoose from "mongoose";
import RescheduleRequest from "../models/RescheduleRequest.js";
import EventRegistration from "../models/EventRegistration.js";
import Badge from "../models/Badges.js";
const FRONTEND_URL = process.env.FRONTEND_URL;
import axios from "axios";




export const getAllStudents = async (req, res) => {
  try {
    const users = await Student.find({ role: "student" }).select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createStudent = async (req, res) => {
  try {

    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {

      return res.status(400).json({
        success: false,
        message: "First name, last name, email, and password are required.",
      });
    }


    // Check if email already exists
    const existingUser = await Student.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }


    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    // Create student
    const student = await Student.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: "student",
      isActive: false,
    });

    // ==========================
    // SEND EMAIL USING BREVO
    // ==========================

    if (!process.env.BREVO_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "BREVO_API_KEY is missing.",
      });
    }


    try {
      const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            name: "GuideX",
            email: "ravurusaikishore@gmail.com",
          },

          to: [
            {
              email: student.email,
              name: `${student.firstName} ${student.lastName}`,
            },
          ],

          subject: "Welcome to GuideX - Student Account Created",

          htmlContent: `
      <h2>Welcome to GuideX 🎉</h2>

      <p>Hello <b>${student.firstName}</b>,</p>

      <p>Your account has been created successfully.</p>

      <p><b>Email:</b> ${student.email}</p>

      <p><b>Password:</b> ${password}</p>

      <a href="${process.env.FRONTEND_URL}/login">
        Login
      </a>
    `,

          textContent: `
Welcome to GuideX

Email: ${student.email}
Password: ${password}

Login:
${process.env.FRONTEND_URL}/login
`,
        },
        {
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            "api-key": process.env.BREVO_API_KEY,
          },
        }
      );

    } catch (error) {
      console.error(error.response?.data || error.message);
    }
    


    // ==========================
    // AUDIT LOG
    // ==========================


    const admin = await Student.findById(req.user.id).select("-password");

    await createAuditLog({
      req,
      user: {
        ...admin.toObject(),
        role: "Admin",
      },
      action: "Create Student",
      module: "Admin",
      description: `Created student ${student.firstName} ${student.lastName}.`,
      targetId: student._id,
      targetType: "Student",
    });

  
    return res.status(201).json({
      success: true,
      message: "Student created successfully.",
      student: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        role: student.role,
        isActive: student.isActive,
      },
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalMentors,
      totalBookings,
      revenueResult,
      pendingMentorRequests,
      approvedMentors,
      totalRequests,
      pendingRequests,
      inProgressRequests,
      resolvedRequests,
      repliedRequests,

      recentUsers,
      recentMentors,
      recentBookings,
    ] = await Promise.all([
      // Total Students
      Student.countDocuments({
        role: "student",
      }),

      // Total Mentors
      Mentor.countDocuments(),

      // Total Bookings
      Booking.countDocuments(),

      // Total Revenue
      Booking.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
            bookingStatus: "Completed",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$amount",
            },
          },
        },
      ]),

      // Pending Mentor Requests
      Mentor.countDocuments({
        verificationStatus: "Pending",
        isVerified: false,
      }),

      // ==========================
      // CONTACT REQUEST STATS
      // ==========================

      Contact.countDocuments(),

      Contact.countDocuments({
        status: "Pending",
      }),

      Contact.countDocuments({
        status: "In Progress",
      }),

      Contact.countDocuments({
        status: "Resolved",
      }),

      Contact.countDocuments({
        replied: true,
      }),

      // Approved Mentors
      Mentor.countDocuments({
        verificationStatus: "Approved",
        isVerified: true,
      }),

      // Recent Users
      Student.find({ role: "student" })
        .select("firstName lastName email role createdAt isActive profileImage")
        .sort({ createdAt: -1 })
        .limit(10),

      // Recent Mentors
      Mentor.find()
        .select(
          "firstName lastName email expertise rating createdAt profession profileImage"
        )
        .sort({ createdAt: -1 })
        .limit(7),

      // Recent Bookings
      Booking.find()
        .populate("student", "firstName lastName email profileImage")
        .populate("mentor", "firstName lastName profileImage")
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalMentors,
        totalBookings,
        totalRevenue,

        pendingMentorRequests,
        approvedMentors,

        // Contact Statistics
        totalRequests,
        pendingRequests,
        inProgressRequests,
        resolvedRequests,
        repliedRequests,
      },

      recentUsers,
      recentMentors,
      recentBookings,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAdminProfileForSidebar = async (req, res) => {
  const admin = await Student.findById(req.user.id).select("-password");

  res.json({
    success: true,
    user: admin,
  });
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const admin = await Student.findById(req.user.id).select("-password");
    await Student.findByIdAndDelete(id);

    await createAuditLog({
      req,
      user: {
        ...admin.toObject(),
        role: "Admin",
      },
      action: "Delete Student",
      module: "Admin",
      description: `Deleted student ${student.firstName} ${student.lastName}.`,
      targetId: student._id,
      targetType: "Student",
    });

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({
      verificationStatus: "Approved",
      isVerified: true,
    });

    res.status(200).json({
      success: true,
      mentors,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch mentors.",
    });
  }
};

export const deleteMentor = async (req, res) => {
  try {
    const { id } = req.params;

    const mentor = await Mentor.findOne({
      _id: id,
      role: "mentor",
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found.",
      });
    }

    await Mentor.findByIdAndDelete(id);

    const admin = await Student.findById(req.user.id).select("-password");

    await createAuditLog({
      req,
      user: {
        ...admin.toObject(),
        role: "Admin",
      },
      action: "Delete Mentor",
      module: "Mentor",
      description: `Deleted mentor ${mentor.firstName} ${mentor.lastName}.`,
      targetId: mentor._id,
      targetType: "Mentor",
    });

    res.status(200).json({
      success: true,
      message: "Mentor deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

export const pendingMentors = async (req, res) => {
  try {
    const [mentors, approvedMentorsCount] = await Promise.all([
      Mentor.find({
        verificationStatus: "Pending",
        isVerified: false,
      }).sort({ createdAt: -1 }),

      Mentor.countDocuments({
        verificationStatus: "Approved",
        isVerified: true,
      }),
    ]);

    res.status(200).json({
      success: true,
      mentors,
      approvedMentorsCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const approveMentor = async (req, res) => {
  try {
    const { mentorId } = req.params;

    const mentor = await Mentor.findById(mentorId);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    // Already approved
    if (mentor.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Mentor is already approved",
      });
    }

    mentor.isVerified = true;
    mentor.verificationStatus = "Approved";
    mentor.approvedAt = new Date();
    mentor.approvedBy = req.user.id; // Admin ID from middleware

    await mentor.save();

    // Update student's role to mentor
    const student = await Student.findById(mentor.student);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Associated student not found",
      });
    }

    student.role = "mentor";
    await student.save();

    const admin = await Student.findById(req.user.id).select("-password");

    // ======================================
    // SEND EMAIL USING BREVO EMAIL API
    // ======================================

    if (!process.env.BREVO_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "BREVO_API_KEY is missing.",
      });
    }

    try {
      const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            name: "GuideX",
            email: "ravurusaikishore@gmail.com",
          },

          to: [
            {
              email: mentor.email,
              name: `${mentor.firstName} ${mentor.lastName}`,
            },
          ],

          subject:
            "🎉 Congratulations! Your GuideX Mentor Application Has Been Approved",

          htmlContent: `
      <div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:30px 0;">
          <tr>
            <td align="center">

              <table width="650" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

                <tr>
                  <td align="center" style="background:#2563eb;padding:35px;">
                    <h1 style="margin:0;color:#ffffff;font-size:34px;">
                      GuideX
                    </h1>

                    <p style="margin:10px 0 0;color:#dbeafe;font-size:18px;">
                      Mentor Application Approved
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:40px;">

                    <h2 style="margin-top:0;color:#111827;">
                      Congratulations ${mentor.firstName}! 🎉
                    </h2>

                    <p style="font-size:16px;color:#4b5563;line-height:1.8;">
                      Great news! Your mentor application has been successfully
                      reviewed and approved by the GuideX Admin Team.
                    </p>

                    <p style="font-size:16px;color:#4b5563;line-height:1.8;">
                      Your mentor account is now active and you can start accepting
                      mentoring sessions from students.
                    </p>

                    <table width="100%" cellpadding="12" cellspacing="0"
                      style="margin-top:30px;border-collapse:collapse;border:1px solid #e5e7eb;">

                      <tr style="background:#f9fafb;">
                        <td><strong>Name</strong></td>
                        <td>${mentor.firstName} ${mentor.lastName}</td>
                      </tr>

                      <tr>
                        <td><strong>Email</strong></td>
                        <td>${mentor.email}</td>
                      </tr>

                      <tr style="background:#f9fafb;">
                        <td><strong>Profession</strong></td>
                        <td>${mentor.profession}</td>
                      </tr>

                      <tr>
                        <td><strong>Status</strong></td>
                        <td>
                          <span style="
                            background:#dcfce7;
                            color:#15803d;
                            padding:6px 12px;
                            border-radius:20px;
                            font-weight:bold;">
                            Approved
                          </span>
                        </td>
                      </tr>

                    </table>

                    <div style="margin-top:35px;background:#eff6ff;border-left:5px solid #2563eb;padding:20px;border-radius:8px;">

                      <h3 style="margin-top:0;color:#1d4ed8;">
                        What's Next?
                      </h3>

                      <ul style="padding-left:20px;color:#374151;line-height:2;">
                        <li>Complete your mentor profile if needed.</li>
                        <li>Keep your availability updated.</li>
                        <li>Accept mentoring session requests.</li>
                        <li>Start helping students grow their careers.</li>
                      </ul>

                    </div>

                    <div style="text-align:center;margin-top:40px;">

                      <a
                        href="${process.env.FRONTEND_URL}/login"
                        style="
                          background:#2563eb;
                          color:#ffffff;
                          text-decoration:none;
                          padding:15px 35px;
                          border-radius:8px;
                          font-size:16px;
                          font-weight:bold;
                          display:inline-block;">
                        Login to GuideX
                      </a>

                    </div>

                    <hr style="margin:40px 0;border:none;border-top:1px solid #e5e7eb;">

                    <p style="font-size:14px;color:#6b7280;">
                      Need help? Contact the GuideX support team if you have any questions.
                    </p>

                    <p style="margin-top:25px;font-size:15px;">
                      Best Regards,<br>
                      <strong>GuideX Team</strong>
                    </p>

                  </td>
                </tr>

                <tr>
                  <td align="center"
                    style="padding:20px;background:#f9fafb;color:#6b7280;font-size:13px;">
                    © ${new Date().getFullYear()} GuideX. All Rights Reserved.
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </div>
      `,

          textContent: `Congratulations ${mentor.firstName},

Your GuideX mentor application has been approved.

You can now log in and start accepting mentoring sessions.

Login:
${process.env.FRONTEND_URL}/login

GuideX Team`,
        },
        {
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            "api-key": process.env.BREVO_API_KEY,
          },
        }
      );

     
    } catch (mailError) {
      
      return res.status(500).json({
        success: false,
        message: "Failed to send approval email.",
      });
    }

    if (error) {
      console.error("Resend Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to send welcome email.",
      });
    }

    await createAuditLog({
      req,
      user: {
        ...admin.toObject(),
        role: "Admin",
      },
      action: "Approve Mentor",
      module: "Mentor",
      description: `Approved mentor ${mentor.firstName} ${mentor.lastName}.`,
      targetId: mentor._id,
      targetType: "Mentor",
    });

    res.status(200).json({
      success: true,
      message: "Mentor approved successfully",
      mentor,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    // ==========================================
    // 1. GET ALL BOOKINGS
    // ==========================================
    const bookings = await Booking.find()
      .populate(
        "student",
        "firstName lastName email phone profileImage role isActive lastLogin"
      )
      .populate("mentor", "firstName lastName email profession profileImage")
      .sort({ createdAt: -1 })
      .lean();

    // If no bookings exist
    if (!bookings.length) {
      return res.status(200).json({
        success: true,
        bookings: [],
      });
    }

    // ==========================================
    // 2. GET ALL BOOKING IDS
    // ==========================================
    const bookingIds = bookings.map((booking) => booking._id);

    // ==========================================
    // 3. FETCH MEETINGS
    // ==========================================
    const meetings = await Meeting.find({
      booking: { $in: bookingIds },
    })
      .select(
        "booking mentor meetingLink student roomId scheduledStartTime scheduledEndTime status mentorJoined studentJoined mentorJoinedAt studentJoinedAt createdAt updatedAt"
      )
      .lean();

    // ==========================================
    // 4. CREATE MEETING MAP
    // ==========================================
    const meetingMap = new Map(
      meetings.map((meeting) => [meeting.booking.toString(), meeting])
    );

    // ==========================================
    // 5. FETCH REVIEWS
    // ==========================================
    const reviews = await Review.find({
      bookingId: { $in: bookingIds },
    })
      .select(
        "_id mentorId studentId bookingId rating review isVisible createdAt updatedAt"
      )
      .lean();

    // ==========================================
    // 6. CREATE REVIEW MAP
    // ==========================================
    const reviewMap = new Map(
      reviews.map((review) => [review.bookingId.toString(), review])
    );

    // ==========================================
    // 7. ATTACH MEETING + REVIEW TO BOOKINGS
    // ==========================================
    const bookingsWithDetails = bookings.map((booking) => {
      const bookingId = booking._id.toString();

      const meeting = meetingMap.get(bookingId) || null;
      const review = reviewMap.get(bookingId) || null;

      return {
        ...booking,

        // Meeting information
        meeting,

        // Review information
        review,

        // Easy frontend check
        reviewSubmitted: !!review,
      };
    });

    // ==========================================
    // 8. SEND RESPONSE
    // ==========================================
    return res.status(200).json({
      success: true,
      bookings: bookingsWithDetails,
    });
  } catch (error) {
    console.error("Get all bookings error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================
// DELETE BOOKING
// ===========================

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const mentor = await Mentor.findById(booking.mentor).select(
      "firstName lastName"
    );
    const student = await Student.findById(booking.student).select(
      "firstName lastName"
    );
    const admin = await Student.findById(req.user.id).select("-password");

    await Booking.findByIdAndDelete(id);

    await createAuditLog({
      req,
      user: {
        ...admin.toObject(),
        role: "Admin",
      },
      action: "Delete Booking",
      module: "Booking",
      description: `Deleted booking between student ${student.firstName} ${student.lastName} and mentor ${mentor.firstName} ${mentor.lastName}.`,
      targetId: booking._id,
      targetType: "Booking",
    });

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAuditLogs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;

    const skip = (page - 1) * limit;

    const { search, module, action, date } = req.query;

    let filter = {};

    // Search
    if (search) {
      filter.$or = [
        {
          userName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Module Filter
    if (module) {
      filter.module = module;
    }

    // Action Filter
    if (action) {
      filter.action = action;
    }

    // Date Filter
    if (date) {
      const start = new Date(date);
      const end = new Date(date);

      end.setDate(end.getDate() + 1);

      filter.createdAt = {
        $gte: start,
        $lt: end,
      };
    }

    const totalLogs = await AuditLog.countDocuments(filter);

    const logs = await AuditLog.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    // Today's Logs

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayLogs = await AuditLog.countDocuments({
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    // Authentication Logs

    const authLogs = await AuditLog.countDocuments({
      module: "Authentication",
    });

    // Booking Logs

    const bookingLogs = await AuditLog.countDocuments({
      module: "Booking",
    });

    res.status(200).json({
      success: true,

      logs,

      totalLogs,

      todayLogs,

      authLogs,

      bookingLogs,

      page,

      pages: Math.ceil(totalLogs / limit),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const [
      admin,
      recentLogs,
      totalStudents,
      totalMentors,
      totalBookings,
      revenue,
    ] = await Promise.all([
      Student.findById(req.user.id).select("-password"),

      AuditLog.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(5),

      Student.countDocuments({ role: "student" }),

      Mentor.countDocuments(),

      Booking.countDocuments(),

      Booking.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      admin,
      recentLogs,
      stats: {
        totalStudents,
        totalMentors,
        totalBookings,
        totalRevenue: revenue[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    const admin = await Student.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const existingUser = await Student.findOne({
      email,
      _id: { $ne: req.user.id },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use.",
      });
    }

    admin.firstName = firstName;
    admin.lastName = lastName;
    admin.email = email;
    admin.phone = phone;

    // Save uploaded profile image
    if (req.file) {
      admin.profileImage = `/uploads/${req.file.filename}`;
    }

    await admin.save();

    res.json({
      success: true,
      user: admin,
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from the current password",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+^()_\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain uppercase, lowercase, number and special character",
      });
    }

    const admin = await Student.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    admin.password = await bcrypt.hash(newPassword, 10);

    await admin.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    // ==========================================
    // KPI CARDS
    // ==========================================

    const [
      totalUsers,
      totalMentors,
      totalBookings,
      totalReviews,
      pendingMentors,
      activeMentors,
      revenue,
      avgRating,
      pendingBookings,
      confirmedBookings,
      completedBookings,
    ] = await Promise.all([
      Student.countDocuments({ role: "student" }),

      Mentor.countDocuments(),

      Booking.countDocuments(),

      Review.countDocuments(),

      Mentor.countDocuments({
        verificationStatus: "Pending",
      }),

      Mentor.countDocuments({
        verificationStatus: "Approved",
        isVerified: true,
      }),

      Booking.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
            bookingStatus: "Completed",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      Review.aggregate([
        {
          $group: {
            _id: null,
            average: {
              $avg: "$rating",
            },
          },
        },
      ]),

      // 👇 Add these here
      Booking.countDocuments({
        bookingStatus: "Pending",
      }),

      Booking.countDocuments({
        bookingStatus: "Confirmed",
      }),

      Booking.countDocuments({
        bookingStatus: "Completed",
      }),
    ]);

    // ==========================================
    // USER GROWTH (Last 12 Months)
    // ==========================================

    const currentYear = new Date().getFullYear();

    const monthlyUsers = await Student.aggregate([
      {
        $match: {
          role: "student",
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
          },
        },
      },

      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },

          users: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    const monthNames = [
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

    const userGrowth = monthNames.map((month, index) => {
      const found = monthlyUsers.find((m) => m._id.month === index + 1);

      return {
        month,
        users: found ? found.users : 0,
      };
    });

    // Continue in Part 2...
    // ==========================================
    // BOOKING STATUS
    // ==========================================

    const bookingStatusResult = await Booking.aggregate([
      {
        $group: {
          _id: "$bookingStatus",
          value: {
            $sum: 1,
          },
        },
      },
    ]);

    const bookingStatuses = [
      "Completed",
      "Confirmed",
      "Pending",
      "Cancelled",
      "Rejected",
    ];

    const bookingStatus = bookingStatuses.map((status) => {
      const found = bookingStatusResult.find((item) => item._id === status);

      return {
        status,
        value: found ? found.value : 0,
      };
    });

    // ==========================================
    // MONTHLY REVENUE
    // ==========================================

    const monthlyRevenueResult = await Booking.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
          bookingStatus: "Completed",
        },
      },

      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },

          revenue: {
            $sum: "$amount",
          },
        },
      },

      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    const monthlyRevenue = monthNames.map((month, index) => {
      const found = monthlyRevenueResult.find(
        (item) => item._id.month === index + 1
      );

      return {
        month,
        revenue: found ? found.revenue : 0,
      };
    });

    // ==========================================
    // STATS OBJECT
    // ==========================================

    const stats = {
      totalUsers,
      totalMentors,
      totalBookings,
      totalRevenue: revenue.length ? revenue[0].total : 0,
      totalReviews,
      averageRating: avgRating.length
        ? Number(avgRating[0].average.toFixed(1))
        : 0,
      activeMentors,
      pendingMentors,
    };

    // Continue in Part 3...
    // ==========================================
    // MENTOR PERFORMANCE
    // ==========================================

    const mentorPerformance = await Booking.aggregate([
      {
        $match: {
          bookingStatus: "Completed",
          paymentStatus: "Paid",
        },
      },

      {
        $group: {
          _id: "$mentor",

          bookings: {
            $sum: 1,
          },

          revenue: {
            $sum: "$amount",
          },
        },
      },

      {
        $sort: {
          bookings: -1,
        },
      },

      {
        $limit: 5,
      },

      {
        $lookup: {
          from: "mentors",
          localField: "_id",
          foreignField: "_id",
          as: "mentor",
        },
      },

      {
        $unwind: "$mentor",
      },

      {
        $project: {
          _id: 1,

          name: {
            $concat: ["$mentor.firstName", " ", "$mentor.lastName"],
          },

          bookings: 1,

          revenue: 1,

          rating: {
            $ifNull: ["$mentor.averageRating", 0],
          },

          profession: "$mentor.profession",

          profileImage: "$mentor.profileImage",

          status: {
            $cond: ["$mentor.isVerified", "Active", "Inactive"],
          },
        },
      },
    ]);

    // ==========================================
    // TOP MENTORS TABLE
    // ==========================================

    const topMentors = mentorPerformance.map((mentor) => ({
      _id: mentor._id,

      firstName: mentor.name.split(" ")[0],

      lastName: mentor.name.split(" ").slice(1).join(" "),

      profileImage: mentor.profileImage,

      profession: mentor.profession,

      bookings: mentor.bookings,

      rating: mentor.rating,

      revenue: mentor.revenue,

      status: mentor.status,
    }));

    // Continue in Part 4...
    // ==========================================
    // RATING DISTRIBUTION
    // ==========================================

    const ratingResult = await Review.aggregate([
      {
        $group: {
          _id: "$rating",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // Always return 5 → 1 stars
    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
      const found = ratingResult.find((item) => item._id === rating);

      return {
        rating,
        count: found ? found.count : 0,
      };
    });

    // Average Rating
    const averageRating =
      avgRating.length > 0 ? Number(avgRating[0].average.toFixed(1)) : 0;

    // Total Reviews
    const totalReviewCount = totalReviews;

    // Continue in Part 5...
    // ==========================================
    // POPULAR SKILLS
    // ==========================================

    const popularSkills = await Mentor.aggregate([
      // Only approved mentors
      {
        $match: {
          verificationStatus: "Approved",
          isVerified: true,
        },
      },

      // Convert ["React","Node"] into separate documents
      {
        $unwind: "$primarySkill",
      },

      // Remove empty values
      {
        $match: {
          primarySkill: {
            $ne: "",
          },
        },
      },

      // Group by skill
      {
        $group: {
          _id: "$primarySkill",

          count: {
            $sum: 1,
          },
        },
      },

      // Highest first
      {
        $sort: {
          count: -1,
        },
      },

      // Top 10 skills
      {
        $limit: 10,
      },

      // Final shape
      {
        $project: {
          _id: 0,

          name: "$_id",

          count: 1,
        },
      },
    ]);

    // Continue in Part 6...
    // ==========================================
    // RECENT ACTIVITY
    // ==========================================

    const recentActivity = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("userName userType module action description createdAt")
      .lean();

    // ==========================================
    // SEND RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      stats,
      userGrowth,
      bookingStatus,
      monthlyRevenue,
      mentorPerformance,
      topMentors,
      ratingDistribution,
      popularSkills,
      recentActivity,
      averageRating,
    });
  } catch (error) {
    console.error("Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteAuditLog = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await AuditLog.findById(id);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Audit log not found",
      });
    }

    await AuditLog.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Audit log deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteFilteredAuditLogs = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No audit logs selected.",
      });
    }

    const result = await AuditLog.deleteMany({
      _id: { $in: ids },
    });

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} audit logs deleted successfully.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete Audit Logs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete audit logs.",
    });
  }
};

export const suspendMentor = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { reason } = req.body;

    const mentor = await Mentor.findById(mentorId);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    mentor.accountStatus = "Suspended";
    mentor.suspensionReason = reason || "";
    mentor.suspendedBy = req.user.id;
    mentor.suspendedAt = new Date();

    await mentor.save();

    // ==========================
    // SEND EMAIL USING BREVO API
    // ==========================

    console.log("========== BREVO EMAIL API ==========");

    if (!process.env.BREVO_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "BREVO_API_KEY is missing.",
      });
    }

    try {
      const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            name: "GuideX",
            email: "ravurusaikishore@gmail.com",
          },

          to: [
            {
              email: mentor.email,
              name: `${mentor.firstName} ${mentor.lastName}`,
            },
          ],

          subject: "GuideX - Your Mentor Account Has Been Suspended",

          htmlContent: `
<div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:30px 0;">
    <tr>
      <td align="center">

        <table width="650" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

          <tr>
            <td align="center" style="background:#dc2626;padding:35px;">
              <h1 style="margin:0;color:#ffffff;font-size:34px;">
                GuideX
              </h1>

              <p style="margin:10px 0 0;color:#fee2e2;font-size:18px;">
                Mentor Account Suspended
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:40px;">

              <h2 style="margin-top:0;color:#111827;">
                Hello ${mentor.firstName} ${mentor.lastName},
              </h2>

              <p style="font-size:16px;color:#4b5563;line-height:1.8;">
                We regret to inform you that your
                <strong>GuideX Mentor Account</strong>
                has been temporarily suspended by the administration.
              </p>

              <table width="100%" cellpadding="12" cellspacing="0"
                style="margin-top:30px;border-collapse:collapse;border:1px solid #e5e7eb;">

                <tr style="background:#f9fafb;">
                  <td><strong>Name</strong></td>
                  <td>${mentor.firstName} ${mentor.lastName}</td>
                </tr>

                <tr>
                  <td><strong>Email</strong></td>
                  <td>${mentor.email}</td>
                </tr>

                <tr style="background:#f9fafb;">
                  <td><strong>Account Status</strong></td>
                  <td>
                    <span style="
                      background:#fee2e2;
                      color:#b91c1c;
                      padding:6px 12px;
                      border-radius:20px;
                      font-weight:bold;">
                      Suspended
                    </span>
                  </td>
                </tr>

                <tr>
                  <td><strong>Reason</strong></td>
                  <td>${
                    reason || "No reason provided by the administrator."
                  }</td>
                </tr>

              </table>

              <div style="margin-top:35px;background:#fef2f2;border-left:5px solid #dc2626;padding:20px;border-radius:8px;">

                <h3 style="margin-top:0;color:#b91c1c;">
                  What does this mean?
                </h3>

                <ul style="padding-left:20px;color:#374151;line-height:2;">
                  <li>Your mentor profile is temporarily unavailable.</li>
                  <li>You cannot accept new mentoring sessions.</li>
                  <li>Your existing sessions may be reviewed by the admin.</li>
                  <li>You may contact GuideX Support for clarification.</li>
                </ul>

              </div>

              <div style="text-align:center;margin-top:40px;">

                <a
                  href="${process.env.FRONTEND_URL}/contact"
                  style="
                    background:#dc2626;
                    color:#ffffff;
                    text-decoration:none;
                    padding:15px 35px;
                    border-radius:8px;
                    font-size:16px;
                    font-weight:bold;
                    display:inline-block;">
                  Contact Support
                </a>

              </div>

              <hr style="margin:40px 0;border:none;border-top:1px solid #e5e7eb;">

              <p style="font-size:14px;color:#6b7280;">
                If you believe this suspension was made in error, please contact
                the GuideX Support Team.
              </p>

              <p style="margin-top:25px;font-size:15px;">
                Regards,<br>
                <strong>GuideX Administration</strong>
              </p>

            </td>
          </tr>

          <tr>
            <td align="center"
              style="padding:20px;background:#f9fafb;color:#6b7280;font-size:13px;">
              © ${new Date().getFullYear()} GuideX. All Rights Reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</div>
      `,
        },
        {
          headers: {
            accept: "application/json",
            "api-key": process.env.BREVO_API_KEY,
            "content-type": "application/json",
          },
        }
      );

    } catch (error) {
    
      return res.status(500).json({
        success: false,
        message: "Failed to send suspension email.",
        error: error.response?.data || error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Mentor suspended successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const activateMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.mentorId);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    mentor.accountStatus = "Active";
    mentor.suspensionReason = "";
    mentor.suspendedBy = null;
    mentor.suspendedAt = null;

    await mentor.save();

    // ==========================
    // SEND EMAIL USING BREVO API
    // ==========================

    if (!process.env.BREVO_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "BREVO_API_KEY is missing.",
      });
    }

    try {
      await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            name: "GuideX",
            email: "ravurusaikishore@gmail.com",
          },

          to: [
            {
              email: mentor.email,
              name: `${mentor.firstName} ${mentor.lastName}`,
            },
          ],

          subject: "🎉 GuideX - Your Mentor Account Has Been Reactivated",

          htmlContent: `
<div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:30px 0;">
    <tr>
      <td align="center">

        <table width="650" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

          <tr>
            <td align="center" style="background:#16a34a;padding:35px;">
              <h1 style="margin:0;color:#ffffff;font-size:34px;">
                GuideX
              </h1>

              <p style="margin:10px 0 0;color:#dcfce7;font-size:18px;">
                Mentor Account Reactivated
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:40px;">

              <h2 style="margin-top:0;color:#111827;">
                Welcome Back, ${mentor.firstName} ${mentor.lastName}! 🎉
              </h2>

              <p style="font-size:16px;color:#4b5563;line-height:1.8;">
                We're pleased to inform you that your
                <strong>GuideX Mentor Account</strong>
                has been successfully reactivated.
              </p>

              <p style="font-size:16px;color:#4b5563;line-height:1.8;">
                You can now log in and continue mentoring students, manage your
                availability, and accept new session requests.
              </p>

              <table width="100%" cellpadding="12" cellspacing="0"
                style="margin-top:30px;border-collapse:collapse;border:1px solid #e5e7eb;">

                <tr style="background:#f9fafb;">
                  <td><strong>Name</strong></td>
                  <td>${mentor.firstName} ${mentor.lastName}</td>
                </tr>

                <tr>
                  <td><strong>Email</strong></td>
                  <td>${mentor.email}</td>
                </tr>

                <tr style="background:#f9fafb;">
                  <td><strong>Account Status</strong></td>
                  <td>
                    <span style="
                      background:#dcfce7;
                      color:#15803d;
                      padding:6px 12px;
                      border-radius:20px;
                      font-weight:bold;">
                      Active
                    </span>
                  </td>
                </tr>

              </table>

              <div style="margin-top:35px;background:#ecfdf5;border-left:5px solid #16a34a;padding:20px;border-radius:8px;">

                <h3 style="margin-top:0;color:#15803d;">
                  You can now:
                </h3>

                <ul style="padding-left:20px;color:#374151;line-height:2;">
                  <li>Accept new mentoring session requests.</li>
                  <li>Update your mentor profile and availability.</li>
                  <li>Continue guiding and supporting students.</li>
                  <li>Access all mentor features on GuideX.</li>
                </ul>

              </div>

              <div style="text-align:center;margin-top:40px;">

                <a
                  href="${process.env.FRONTEND_URL}/login"
                  style="
                    background:#16a34a;
                    color:#ffffff;
                    text-decoration:none;
                    padding:15px 35px;
                    border-radius:8px;
                    font-size:16px;
                    font-weight:bold;
                    display:inline-block;">
                  Login to GuideX
                </a>

              </div>

              <hr style="margin:40px 0;border:none;border-top:1px solid #e5e7eb;">

              <p style="font-size:14px;color:#6b7280;">
                Thank you for being a valued member of the GuideX mentor community.
                We look forward to your continued support for students.
              </p>

              <p style="margin-top:25px;font-size:15px;">
                Best Regards,<br>
                <strong>GuideX Team</strong>
              </p>

            </td>
          </tr>

          <tr>
            <td align="center"
              style="padding:20px;background:#f9fafb;color:#6b7280;font-size:13px;">
              © ${new Date().getFullYear()} GuideX. All Rights Reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</div>
      `,
        },
        {
          headers: {
            accept: "application/json",
            "api-key": process.env.BREVO_API_KEY,
            "content-type": "application/json",
          },
        }
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to send reactivation email.",
        error: error.response?.data || error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Mentor activated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate("studentId", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Single Message
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).populate(
      "studentId",
      "firstName lastName email profileImage"
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Reply to Contact
export const replyToContact = async (req, res) => {
  try {
    const { adminReply, status } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    contact.conversation.push({
      sender: "Admin",
      message: adminReply,
      sentAt: new Date(),
    });

    contact.status = status;

    contact.replied = true;

    contact.repliedAt = new Date();

    contact.lastMessageAt = new Date();

    if (status === "Resolved") {
      contact.closedAt = new Date();
    }

    await contact.save();

    res.status(200).json({
      success: true,
      message: "Reply saved successfully.",
      contact,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Status
export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const update = {
      status,
    };

    if (status === "Resolved") {
      update.closedAt = new Date();
    }

    const contact = await Contact.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete Message
export const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      firstName,
      lastName,
      email,
      phone,
      education,
      careerGoal,
      isVerified,
      isActive,
      isBlocked,
      learningStats,
    } = req.body;

    // =====================================================
    // FIND STUDENT
    // =====================================================

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    // =====================================================
    // CHECK DUPLICATE EMAIL
    // =====================================================

    if (email !== undefined && email !== null) {
      const normalizedEmail = email.trim().toLowerCase();

      const currentEmail = (student.email || "").trim().toLowerCase();

      if (normalizedEmail !== currentEmail) {
        const existingStudent = await Student.findOne({
          email: normalizedEmail,
          _id: { $ne: id },
        });

        if (existingStudent) {
          return res.status(400).json({
            success: false,
            message: "Email already exists.",
          });
        }
      }

      student.email = normalizedEmail;
    }

    // =====================================================
    // BASIC INFORMATION
    // =====================================================

    if (firstName !== undefined) {
      student.firstName = String(firstName).trim();
    }

    if (lastName !== undefined) {
      student.lastName = String(lastName).trim();
    }

    if (phone !== undefined) {
      student.phone = String(phone).trim();
    }

    // =====================================================
    // EDUCATION
    // =====================================================

    if (education !== undefined) {
      student.education = String(education).trim();
    }

    // =====================================================
    // CAREER GOAL
    // =====================================================

    if (careerGoal !== undefined) {
      student.careerGoal = String(careerGoal).trim();
    }

    // =====================================================
    // ACCOUNT STATUS
    // =====================================================

    if (isVerified !== undefined) {
      student.isVerified = isVerified === true || isVerified === "true";
    }

    if (isActive !== undefined) {
      student.isActive = isActive === true || isActive === "true";
    }

    if (isBlocked !== undefined) {
      student.isBlocked = isBlocked === true || isBlocked === "true";
    }

    // =====================================================
    // INITIALIZE LEARNING STATS IF MISSING
    // =====================================================

    if (!student.learningStats) {
      student.learningStats = {
        xp: 0,
        level: 1,
        streak: {
          current: 0,
          longest: 0,
          lastActivity: null,
        },
      };
    }

    if (!student.learningStats.streak) {
      student.learningStats.streak = {
        current: 0,
        longest: 0,
        lastActivity: null,
      };
    }

    // =====================================================
    // LEARNING STATS
    // =====================================================

    if (
      learningStats !== undefined &&
      learningStats !== null &&
      learningStats !== ""
    ) {
      let parsedLearningStats = learningStats;

      // FormData sends JSON objects as strings
      if (typeof parsedLearningStats === "string") {
        try {
          parsedLearningStats = JSON.parse(parsedLearningStats);
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: "Invalid learning statistics format.",
          });
        }
      }

      // Make sure the parsed value is an object
      if (
        typeof parsedLearningStats !== "object" ||
        Array.isArray(parsedLearningStats)
      ) {
        return res.status(400).json({
          success: false,
          message: "Learning statistics must be a valid object.",
        });
      }

      // ===================================================
      // XP
      // ===================================================

      if (parsedLearningStats.xp !== undefined) {
        const xp = Number(parsedLearningStats.xp);

        if (!Number.isNaN(xp)) {
          student.learningStats.xp = xp;
        }
      }

      // ===================================================
      // LEVEL
      // ===================================================

      if (parsedLearningStats.level !== undefined) {
        const level = Number(parsedLearningStats.level);

        if (!Number.isNaN(level) && level >= 1) {
          student.learningStats.level = level;
        }
      }

      // ===================================================
      // STREAK
      // ===================================================

      if (
        parsedLearningStats.streak &&
        typeof parsedLearningStats.streak === "object"
      ) {
        // Current streak
        if (parsedLearningStats.streak.current !== undefined) {
          const current = Number(parsedLearningStats.streak.current);

          if (!Number.isNaN(current) && current >= 0) {
            student.learningStats.streak.current = current;
          }
        }

        // Longest streak
        if (parsedLearningStats.streak.longest !== undefined) {
          const longest = Number(parsedLearningStats.streak.longest);

          if (!Number.isNaN(longest) && longest >= 0) {
            student.learningStats.streak.longest = longest;
          }
        }

        // Last activity
        if (parsedLearningStats.streak.lastActivity !== undefined) {
          if (
            parsedLearningStats.streak.lastActivity === null ||
            parsedLearningStats.streak.lastActivity === ""
          ) {
            student.learningStats.streak.lastActivity = null;
          } else {
            const lastActivity = new Date(
              parsedLearningStats.streak.lastActivity
            );

            if (!Number.isNaN(lastActivity.getTime())) {
              student.learningStats.streak.lastActivity = lastActivity;
            }
          }
        }
      }
    }

    // =====================================================
    // PROFILE IMAGE
    // =====================================================

    if (req.file) {
      student.profileImage = `/uploads/${req.file.filename}`;
    }

    // =====================================================
    // SAVE STUDENT
    // =====================================================

    await student.save();

    // =====================================================
    // FETCH UPDATED STUDENT
    // EXCLUDE PASSWORD
    // =====================================================

    const updatedStudent = await Student.findById(id).select("-password");

    // =====================================================
    // SUCCESS RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,
      message: "Student updated successfully.",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Update student error:", error);

    // =====================================================
    // DUPLICATE EMAIL ERROR
    // =====================================================

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // =====================================================
    // VALIDATION ERROR
    // =====================================================

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid student data.",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    // =====================================================
    // GENERAL ERROR
    // =====================================================

    return res.status(500).json({
      success: false,
      message: "Failed to update student.",
      error: error.message,
    });
  }
};

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const createBlog = async (req, res) => {
  try {
    const {
      title,
      slug: requestedSlug,
      excerpt,
      content,
      category,
      tags,
      contentType,
      difficulty,
      status,
      featured,
      commentsEnabled,
      author,
      authorName,
      authorBio,
      coverImageAlt,
      readingTime,
      seoTitle,
      seoDescription,
      seoKeywords,
      scheduledAt,
    } = req.body;

    // ==========================================
    // VALIDATE REQUIRED FIELDS
    // ==========================================

    if (
      !title?.trim() ||
      !excerpt?.trim() ||
      !content?.trim() ||
      !category?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // ==========================================
    // VALIDATE STATUS
    // ==========================================

    const blogStatus = status || "Draft";

    if (!["Draft", "Published", "Scheduled"].includes(blogStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog status.",
      });
    }

    // ==========================================
    // GENERATE SLUG
    // ==========================================

    let slug = requestedSlug?.trim()
      ? generateSlug(requestedSlug)
      : generateSlug(title);

    // ==========================================
    // CHECK DUPLICATE SLUG
    // ==========================================

    const existingBlog = await Blog.findOne({ slug });

    if (existingBlog) {
      slug = `${slug}-${Date.now()}`;
    }

    // ==========================================
    // HANDLE TAGS
    // ==========================================

    let formattedTags = [];

    if (tags) {
      if (Array.isArray(tags)) {
        formattedTags = tags
          .map((tag) => tag.trim().toLowerCase())
          .filter((tag) => tag.length > 0);
      } else {
        formattedTags = tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter((tag) => tag.length > 0);
      }
    }

    // Remove duplicate tags
    formattedTags = [...new Set(formattedTags)];

    // ==========================================
    // HANDLE SEO KEYWORDS
    // ==========================================

    let formattedSeoKeywords = [];

    if (seoKeywords) {
      if (Array.isArray(seoKeywords)) {
        formattedSeoKeywords = seoKeywords
          .map((keyword) => keyword.trim().toLowerCase())
          .filter((keyword) => keyword.length > 0);
      } else {
        formattedSeoKeywords = seoKeywords
          .split(",")
          .map((keyword) => keyword.trim().toLowerCase())
          .filter((keyword) => keyword.length > 0);
      }
    }

    // Remove duplicate SEO keywords
    formattedSeoKeywords = [...new Set(formattedSeoKeywords)];

    // ==========================================
    // HANDLE FEATURED
    // ==========================================

    const isFeatured =
      featured === true ||
      featured === "true" ||
      featured === 1 ||
      featured === "1";

    // ==========================================
    // HANDLE COMMENTS
    // ==========================================

    const isCommentsEnabled =
      commentsEnabled === true ||
      commentsEnabled === "true" ||
      commentsEnabled === 1 ||
      commentsEnabled === "1";

    // ==========================================
    // PUBLISHED DATE
    // ==========================================

    let publishedAt;

    if (blogStatus === "Published") {
      publishedAt = new Date();
    }

    // ==========================================
    // CREATE BLOG
    // ==========================================

    const blog = await Blog.create({
      // ========================================
      // BASIC INFORMATION
      // ========================================

      title: title.trim(),

      slug,

      excerpt: excerpt.trim(),

      content: content.trim(),

      // ========================================
      // MEDIA
      // ========================================

      coverImage: req.file ? `/uploads/${req.file.filename}` : "",

      coverImageAlt: coverImageAlt?.trim() || "",

      // ========================================
      // CATEGORY
      // ========================================

      category: category.trim(),

      tags: formattedTags,

      contentType: contentType || "Article",

      difficulty: difficulty || "Beginner",

      // ========================================
      // AUTHOR
      // ========================================

      author: author?.trim() || "Admin",

      authorName: authorName?.trim() || "GuideX Team",

      authorBio: authorBio?.trim() || "",

      // ========================================
      // PUBLISHING
      // ========================================

      status: blogStatus,

      featured: isFeatured,

      commentsEnabled: isCommentsEnabled,

      publishedAt,

      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,

      // ========================================
      // READING INFORMATION
      // ========================================

      readingTime: readingTime ? Number(readingTime) : 1,

      // ========================================
      // SEO
      // ========================================

      seoTitle: seoTitle?.trim() || "",

      seoDescription: seoDescription?.trim() || "",

      seoKeywords: formattedSeoKeywords,

      views: 0,
    });

    return res.status(201).json({
      success: true,

      message:
        blogStatus === "Published"
          ? "Blog published successfully."
          : blogStatus === "Scheduled"
          ? "Blog scheduled successfully."
          : "Blog saved as draft successfully.",

      blog,
    });
  } catch (error) {
    console.error("Create blog error:", error);

    // ==========================================
    // DUPLICATE SLUG ERROR
    // ==========================================

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A blog with this slug already exists.",
      });
    }

    // ==========================================
    // MONGOOSE VALIDATION ERROR
    // ==========================================

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    // ==========================================
    // SERVER ERROR
    // ==========================================

    return res.status(500).json({
      success: false,
      message: "Failed to create blog.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("Get all blogs error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
    });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id).lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Get likes, shares and comments
    const interactionData = await getBlogInteractionData(id);

    res.status(200).json({
      success: true,
      blog: {
        ...blog,
        interactions: interactionData,
      },
    });
  } catch (error) {
    console.error("Get blog error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      status,
      featured,
      commentsEnabled,
      authorName,
      seoTitle,
      seoDescription,
      seoKeywords,
    } = req.body;

    // ==========================================
    // FIND BLOG
    // ==========================================

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // ==========================================
    // UPDATE BASIC FIELDS
    // ==========================================

    if (title !== undefined) {
      blog.title = title.trim();
    }

    if (slug !== undefined) {
      blog.slug = slug.trim();
    }

    if (excerpt !== undefined) {
      blog.excerpt = excerpt.trim();
    }

    if (content !== undefined) {
      blog.content = content;
    }

    if (category !== undefined) {
      blog.category = category;
    }

    if (tags !== undefined) {
      blog.tags = Array.isArray(tags) ? tags : [tags];
    }

    // ==========================================
    // STATUS
    // ==========================================

    if (status !== undefined) {
      blog.status = status;
    }

    // ==========================================
    // FEATURED
    // ==========================================

    if (featured !== undefined) {
      blog.featured =
        featured === true ||
        featured === "true" ||
        featured === 1 ||
        featured === "1";
    }

    // ==========================================
    // COMMENTS ENABLE / DISABLE
    // ==========================================

    if (commentsEnabled !== undefined) {
      blog.commentsEnabled =
        commentsEnabled === true ||
        commentsEnabled === "true" ||
        commentsEnabled === 1 ||
        commentsEnabled === "1";
    }

    // ==========================================
    // AUTHOR
    // ==========================================

    if (authorName !== undefined) {
      blog.authorName = authorName;
    }

    // ==========================================
    // SEO
    // ==========================================

    if (seoTitle !== undefined) {
      blog.seoTitle = seoTitle;
    }

    if (seoDescription !== undefined) {
      blog.seoDescription = seoDescription;
    }

    if (seoKeywords !== undefined) {
      blog.seoKeywords = Array.isArray(seoKeywords)
        ? seoKeywords
        : [seoKeywords];
    }

    // ==========================================
    // PUBLISH DATE
    // ==========================================

    if (status === "Published" && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }

    // If changed from Published to Draft
    if (status === "Draft") {
      blog.publishedAt = null;
    }

    // ==========================================
    // COVER IMAGE
    // ==========================================

    if (req.file) {
      blog.coverImage = `/uploads/blogs/${req.file.filename}`;
    }

    // ==========================================
    // SAVE
    // ==========================================

    const updatedBlog = await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Update blog error:", error);

    // Duplicate slug
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A blog with this slug already exists.",
      });
    }

    // Validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
      error: error.message,
    });
  }
};

const getBlogInteractionData = async (blogId) => {
  const [likes, shares, comments] = await Promise.all([
    BlogLike.find({ blog: blogId })
      .populate("user", "firstName lastName email profileImage")
      .sort({ createdAt: -1 })
      .lean(),

    BlogShare.find({ blog: blogId })
      .populate("user", "firstName lastName email profileImage")
      .sort({ createdAt: -1 })
      .lean(),

    BlogComment.find({
      blog: blogId,
      status: { $ne: "Deleted" },
    })
      .populate("user", "firstName lastName email profileImage")
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  return {
    likeCount: likes.length,
    shareCount: shares.length,
    commentCount: comments.length,

    likedUsers: likes.map((like) => ({
      _id: like._id,
      user: like.user,
      likedAt: like.createdAt,
    })),

    sharedUsers: shares.map((share) => ({
      _id: share._id,
      user: share.user,
      platform: share.platform,
      sharedAt: share.createdAt,
    })),

    comments: comments.map((comment) => ({
      _id: comment._id,
      comment: comment.comment,
      status: comment.status,
      likes: comment.likes,
      parentComment: comment.parentComment,
      user: comment.user,
      commentedAt: comment.createdAt,
    })),
  };
};

export const getMentorDetails = async (req, res) => {
  try {
    const { mentorId } = req.params;
    // ======================================================
    // 1. GET MENTOR
    // ======================================================

    const mentor = await Mentor.findById(mentorId)
      .populate("student", "firstName lastName email phone profileImage role")
      .lean();

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    // ======================================================
    // 2. GET ALL BOOKINGS FOR THIS MENTOR
    // ======================================================

    const bookings = await Booking.find({
      mentor: mentorId,
    })
      .populate("student", "firstName lastName email phone profileImage role")
      .sort({
        createdAt: -1,
      })
      .lean();

    // ======================================================
    // 3. GET UNIQUE STUDENTS FROM BOOKINGS
    // ======================================================

    const studentsMap = new Map();

    bookings.forEach((booking) => {
      if (booking.student && booking.student._id) {
        const studentId = booking.student._id.toString();

        studentsMap.set(studentId, booking.student);
      }
    });

    const students = Array.from(studentsMap.values());

    // ======================================================
    // 4. GET ALL MEETINGS FOR THIS MENTOR
    // ======================================================

    const meetings = await Meeting.find({
      mentor: mentorId,
    })
      .populate("student", "firstName lastName email phone profileImage role")
      .populate("booking")
      .sort({
        createdAt: -1,
      })
      .lean();

    // ======================================================
    // 5. GET ALL REVIEWS FOR THIS MENTOR
    // ======================================================

    const reviews = await Review.find({
      mentorId: mentorId,
    })
      .populate("studentId", "firstName lastName email phone profileImage role")
      .populate("bookingId")
      .sort({
        createdAt: -1,
      })
      .lean();

    // ======================================================
    // 6. BOOKING STATISTICS
    // ======================================================

    const totalBookings = bookings.length;

    const completedBookings = bookings.filter(
      (booking) => booking.bookingStatus === "Completed"
    ).length;

    const confirmedBookings = bookings.filter(
      (booking) => booking.bookingStatus === "Confirmed"
    ).length;

    const pendingBookings = bookings.filter(
      (booking) => booking.bookingStatus === "Pending"
    ).length;

    const rejectedBookings = bookings.filter(
      (booking) => booking.bookingStatus === "Rejected"
    ).length;

    const cancelledBookings = bookings.filter(
      (booking) => booking.bookingStatus === "Cancelled"
    ).length;

    // ======================================================
    // 7. MEETING STATISTICS
    // ======================================================

    const totalMeetings = meetings.length;

    const completedMeetings = meetings.filter(
      (meeting) => meeting.status === "Completed"
    ).length;

    const inProgressMeetings = meetings.filter(
      (meeting) => meeting.status === "In Progress"
    ).length;

    // ======================================================
    // 8. REVIEW STATISTICS
    // ======================================================

    const totalReviews = reviews.length;

    const visibleReviews = reviews.filter(
      (review) => review.isVisible === true
    ).length;

    const hiddenReviews = reviews.filter(
      (review) => review.isVisible === false
    ).length;

    // ======================================================
    // 9. REVENUE
    // ======================================================

    const totalRevenue = bookings.reduce((total, booking) => {
      if (booking.bookingStatus === "Completed") {
        return total + Number(booking.amount || 0);
      }

      return total;
    }, 0);

    // ======================================================
    // 10. FINAL RESPONSE
    // ======================================================

    return res.status(200).json({
      success: true,

      mentor,

      students,

      bookings,

      meetings,

      reviews,

      statistics: {
        totalStudents: students.length,

        totalBookings,

        completedBookings,

        confirmedBookings,

        pendingBookings,

        rejectedBookings,

        cancelledBookings,

        totalMeetings,

        completedMeetings,

        inProgressMeetings,

        totalReviews,

        visibleReviews,

        hiddenReviews,

        totalRevenue,

        averageRating: mentor.averageRating || 0,
      },
    });
  } catch (error) {
    console.error("\n========================================");

    console.error("❌ GET MENTOR DETAILS ERROR");

    console.error(error);

    console.error("========================================\n");

    return res.status(500).json({
      success: false,

      message: "Failed to fetch mentor details",

      error: error.message,
    });
  }
};

export const getStudentFullDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // =====================================================
    // FIND STUDENT
    // =====================================================

    const student = await Student.findById(id).select("-password").lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    // =====================================================
    // FETCH ALL STUDENT DATA IN PARALLEL
    // =====================================================

    const [
      bookings,
      meetings,
      reviews,
      rescheduleRequests,
      eventRegistrations,
    ] = await Promise.all([
      // =================================================
      // BOOKINGS
      // =================================================

      Booking.find({
        student: id,
      })
        .populate(
          "mentor",
          "firstName lastName profileImage skills averageRating"
        )
        .sort({
          sessionDate: -1,
          createdAt: -1,
        })
        .lean(),

      // =================================================
      // MEETINGS
      // =================================================

      Meeting.find({
        student: id,
      })
        .populate(
          "booking",
          "sessionType sessionDate startTime endTime duration amount bookingStatus"
        )
        .populate("mentor", "firstName lastName profileImage")
        .sort({
          createdAt: -1,
        })
        .lean(),

      // =================================================
      // REVIEWS
      // =================================================

      Review.find({
        studentId: id,
      })
        .populate("mentorId", "firstName lastName profileImage")
        .populate("bookingId", "sessionType sessionDate startTime")
        .sort({
          createdAt: -1,
        })
        .lean(),

      // =================================================
      // RESCHEDULE REQUESTS
      // =================================================

      RescheduleRequest.find({
        student: id,
      })
        .populate("mentor", "firstName lastName profileImage")
        .populate("booking", "sessionType bookingStatus")
        .sort({
          createdAt: -1,
        })
        .lean(),

      // =================================================
      // EVENT REGISTRATIONS
      // =================================================

      EventRegistration.find({
        student: id,
      })
        .populate(
          "event",
          "title description dateTime speaker meetingLink status registrationDeadline"
        )
        .sort({
          registeredAt: -1,
        })
        .lean(),
    ]);

    // =====================================================
    // BOOKING STATISTICS
    // =====================================================

    const totalBookings = bookings.length;

    const completedBookings = bookings.filter(
      (booking) => booking.bookingStatus === "Completed"
    ).length;

    const confirmedBookings = bookings.filter(
      (booking) => booking.bookingStatus === "Confirmed"
    ).length;

    const pendingBookings = bookings.filter(
      (booking) => booking.bookingStatus === "Pending"
    ).length;

    const cancelledBookings = bookings.filter(
      (booking) => booking.bookingStatus === "Cancelled"
    ).length;

    const rejectedBookings = bookings.filter(
      (booking) => booking.bookingStatus === "Rejected"
    ).length;

    // =====================================================
    // PAYMENT STATISTICS
    // =====================================================

    const paidBookings = bookings.filter(
      (booking) => booking.paymentStatus === "Paid"
    );

    const totalAmountPaid = paidBookings.reduce(
      (total, booking) => total + (booking.amount || 0),
      0
    );

    // =====================================================
    // MEETING STATISTICS
    // =====================================================

    const completedMeetings = meetings.filter(
      (meeting) => meeting.status === "Completed"
    ).length;

    const attendedMeetings = meetings.filter(
      (meeting) => meeting.studentJoined === true
    ).length;

    // =====================================================
    // EVENT STATISTICS
    // =====================================================

    const registeredEvents = eventRegistrations.filter(
      (registration) => registration.status === "Registered"
    ).length;

    const attendedEvents = eventRegistrations.filter(
      (registration) => registration.attended === true
    ).length;

    // =====================================================
    // REVIEW STATISTICS
    // =====================================================

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews > 0
        ? (
            reviews.reduce((total, review) => total + review.rating, 0) /
            totalReviews
          ).toFixed(1)
        : 0;

    // =====================================================
    // RESCHEDULE STATISTICS
    // =====================================================

    const pendingReschedules = rescheduleRequests.filter(
      (request) => request.status === "Pending"
    ).length;

    const acceptedReschedules = rescheduleRequests.filter(
      (request) => request.status === "Accepted"
    ).length;

    const rejectedReschedules = rescheduleRequests.filter(
      (request) => request.status === "Rejected"
    ).length;

    // =====================================================
    // BADGE SYSTEM
    // Same logic as getStudentBadges
    // =====================================================

    const completedSessions = completedBookings;

    const achievementHistory = student.achievementHistory || [];

    const badges = [
      {
        id: 1,

        title: "First Step",

        description: "Complete your first mentorship session.",

        required: 1,

        unlocked: completedSessions >= 1,

        progress: Math.min(completedSessions, 1),

        progressPercentage: Math.min((completedSessions / 1) * 100, 100),

        unlockedAt:
          achievementHistory.find((achievement) => achievement.badgeId === 1)
            ?.unlockedAt || null,
      },

      {
        id: 2,

        title: "Consistent Learner",

        description: "Complete 5 mentorship sessions.",

        required: 5,

        unlocked: completedSessions >= 5,

        progress: Math.min(completedSessions, 5),

        progressPercentage: Math.min((completedSessions / 5) * 100, 100),

        unlockedAt:
          achievementHistory.find((achievement) => achievement.badgeId === 2)
            ?.unlockedAt || null,
      },

      {
        id: 3,

        title: "Dedicated Learner",

        description: "Complete 10 mentorship sessions.",

        required: 10,

        unlocked: completedSessions >= 10,

        progress: Math.min(completedSessions, 10),

        progressPercentage: Math.min((completedSessions / 10) * 100, 100),

        unlockedAt:
          achievementHistory.find((achievement) => achievement.badgeId === 3)
            ?.unlockedAt || null,
      },

      {
        id: 4,

        title: "Knowledge Explorer",

        description: "Complete 20 mentorship sessions.",

        required: 20,

        unlocked: completedSessions >= 20,

        progress: Math.min(completedSessions, 20),

        progressPercentage: Math.min((completedSessions / 20) * 100, 100),

        unlockedAt:
          achievementHistory.find((achievement) => achievement.badgeId === 4)
            ?.unlockedAt || null,
      },

      {
        id: 5,

        title: "Mentorship Champion",

        description: "Complete 50 mentorship sessions.",

        required: 50,

        unlocked: completedSessions >= 50,

        progress: Math.min(completedSessions, 50),

        progressPercentage: Math.min((completedSessions / 50) * 100, 100),

        unlockedAt:
          achievementHistory.find((achievement) => achievement.badgeId === 5)
            ?.unlockedAt || null,
      },
    ];

    // =====================================================
    // BADGE STATISTICS
    // =====================================================

    const unlockedBadges = badges.filter((badge) => badge.unlocked).length;

    const lockedBadges = badges.length - unlockedBadges;

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      student,

      // ================================================
      // GAMIFICATION
      // ================================================

      gamification: {
        completedSessions,

        xp: student.learningStats?.xp || 0,

        level: student.learningStats?.level || 1,

        streak: student.learningStats?.streak || {
          current: 0,
          longest: 0,
          lastActivity: null,
        },

        badges,

        badgeStats: {
          total: badges.length,

          unlocked: unlockedBadges,

          locked: lockedBadges,
        },

        achievementHistory,

        xpHistory: (student.xpHistory || []).slice(-10).reverse(),
      },

      // ================================================
      // RELATED DATA
      // ================================================

      bookings,

      meetings,

      reviews,

      rescheduleRequests,

      eventRegistrations,

      // ================================================
      // STATISTICS
      // ================================================

      statistics: {
        bookings: {
          total: totalBookings,

          completed: completedBookings,

          confirmed: confirmedBookings,

          pending: pendingBookings,

          cancelled: cancelledBookings,

          rejected: rejectedBookings,
        },

        payments: {
          paidBookings: paidBookings.length,

          totalAmountPaid,
        },

        meetings: {
          total: meetings.length,

          completed: completedMeetings,

          attended: attendedMeetings,
        },

        events: {
          registered: registeredEvents,

          attended: attendedEvents,
        },

        reviews: {
          total: totalReviews,

          averageRating,
        },

        reschedules: {
          total: rescheduleRequests.length,

          pending: pendingReschedules,

          accepted: acceptedReschedules,

          rejected: rejectedReschedules,
        },
      },
    });
  } catch (error) {
    console.error("Get full student details error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch student details.",

      error: error.message,
    });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    // ========================================================
    // VALIDATE ID
    // ========================================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID.",
      });
    }

    // ========================================================
    // FIND STUDENT
    // PASSWORD IS NOT RETURNED
    // ========================================================

    const student = await Student.findById(id).select("-password").lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    // ========================================================
    // SUCCESS
    // ========================================================

    return res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Get student by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student details.",
      error: error.message,
    });
  }
};

export const getMentorById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mentor ID.",
      });
    }

    const mentor = await Mentor.findById(id).populate(
      "student",
      "firstName lastName email phone profileImage education careerGoal isVerified isActive isBlocked"
    );
    // .populate("approvedBy", "firstName lastName email")
    // .populate("suspendedBy", "firstName lastName email")

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found.",
      });
    }

    return res.status(200).json({
      success: true,
      mentor,
    });
  } catch (error) {
    console.error("Get mentor by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch mentor details.",
      error: error.message,
    });
  }
};

export const updateMentor = async (req, res) => {
  try {
    const { id } = req.params;

    // =====================================================
    // VALIDATE MENTOR ID
    // =====================================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mentor ID.",
      });
    }

    // =====================================================
    // FIND MENTOR
    // =====================================================

    const mentor = await Mentor.findById(id);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found.",
      });
    }

    // =====================================================
    // GET REQUEST BODY
    // =====================================================

    const {
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,

      profession,
      company,
      experience,
      industry,
      linkedin,

      primarySkill,
      category,
      languages,
      skillExperience,
      skillLevel,

      certifications,

      headline,
      about,
      teachingStyle,

      verificationStatus,
      accountStatus,
      agreement,
      isVerified,

      rejectionReason,
      suspensionReason,

      location,
      education,
      availability,
      pricing,
    } = req.body;

    // =====================================================
    // PERSONAL INFORMATION
    // =====================================================

    if (firstName !== undefined) {
      mentor.firstName = String(firstName).trim();
    }

    if (lastName !== undefined) {
      mentor.lastName = String(lastName).trim();
    }

    if (email !== undefined) {
      mentor.email = String(email).trim().toLowerCase();
    }

    if (phone !== undefined) {
      mentor.phone = String(phone).trim();
    }

    if (dob !== undefined) {
      mentor.dob = dob ? new Date(dob) : null;
    }

    if (gender !== undefined) {
      mentor.gender = gender || undefined;
    }

    // =====================================================
    // LOCATION
    // =====================================================

    if (location !== undefined) {
      let parsedLocation = location;

      if (typeof parsedLocation === "string") {
        try {
          parsedLocation = JSON.parse(parsedLocation);
        } catch (error) {
          parsedLocation = {};
        }
      }

      if (!parsedLocation || typeof parsedLocation !== "object") {
        parsedLocation = {};
      }

      mentor.location = {
        city:
          parsedLocation.city !== undefined
            ? parsedLocation.city
            : mentor.location?.city || "",

        state:
          parsedLocation.state !== undefined
            ? parsedLocation.state
            : mentor.location?.state || "",

        country:
          parsedLocation.country !== undefined
            ? parsedLocation.country
            : mentor.location?.country || "",
      };
    }

    // =====================================================
    // PROFESSIONAL INFORMATION
    // =====================================================

    if (profession !== undefined) {
      mentor.profession = String(profession).trim();
    }

    if (company !== undefined) {
      mentor.company = String(company).trim();
    }

    if (experience !== undefined && experience !== "") {
      const parsedExperience = Number(experience);

      if (!Number.isNaN(parsedExperience)) {
        mentor.experience = parsedExperience;
      }
    }

    if (industry !== undefined) {
      mentor.industry = industry;
    }

    if (linkedin !== undefined) {
      mentor.linkedin = linkedin;
    }

    // =====================================================
    // PRIMARY SKILLS
    // =====================================================

    if (primarySkill !== undefined) {
      let parsedPrimarySkill = primarySkill;

      if (typeof parsedPrimarySkill === "string") {
        try {
          parsedPrimarySkill = JSON.parse(parsedPrimarySkill);
        } catch (error) {
          parsedPrimarySkill = parsedPrimarySkill
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
      }

      mentor.primarySkill = Array.isArray(parsedPrimarySkill)
        ? parsedPrimarySkill
        : [];
    }

    // =====================================================
    // CATEGORY
    // =====================================================

    if (category !== undefined) {
      mentor.category = category;
    }

    // =====================================================
    // LANGUAGES
    // =====================================================

    if (languages !== undefined) {
      let parsedLanguages = languages;

      if (typeof parsedLanguages === "string") {
        try {
          parsedLanguages = JSON.parse(parsedLanguages);
        } catch (error) {
          parsedLanguages = parsedLanguages
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
      }

      mentor.languages = Array.isArray(parsedLanguages) ? parsedLanguages : [];
    }

    // =====================================================
    // SKILL EXPERIENCE
    // =====================================================

    if (skillExperience !== undefined && skillExperience !== "") {
      const parsedSkillExperience = Number(skillExperience);

      if (!Number.isNaN(parsedSkillExperience)) {
        mentor.skillExperience = parsedSkillExperience;
      }
    }

    // =====================================================
    // SKILL LEVEL
    // =====================================================

    if (skillLevel !== undefined) {
      mentor.skillLevel = skillLevel;
    }

    // =====================================================
    // EDUCATION
    // =====================================================

    if (education !== undefined) {
      let parsedEducation = education;

      if (typeof parsedEducation === "string") {
        try {
          parsedEducation = JSON.parse(parsedEducation);
        } catch (error) {
          parsedEducation = {};
        }
      }

      if (!parsedEducation || typeof parsedEducation !== "object") {
        parsedEducation = {};
      }

      let graduationYear = mentor.education?.graduationYear;

      if (
        parsedEducation.graduationYear !== undefined &&
        parsedEducation.graduationYear !== ""
      ) {
        const parsedYear = Number(parsedEducation.graduationYear);

        if (!Number.isNaN(parsedYear)) {
          graduationYear = parsedYear;
        }
      }

      mentor.education = {
        degree:
          parsedEducation.degree !== undefined
            ? parsedEducation.degree
            : mentor.education?.degree || "",

        college:
          parsedEducation.college !== undefined
            ? parsedEducation.college
            : mentor.education?.college || "",

        graduationYear,

        cgpa:
          parsedEducation.cgpa !== undefined
            ? parsedEducation.cgpa
            : mentor.education?.cgpa || "",
      };
    }

    // =====================================================
    // CERTIFICATIONS
    // =====================================================

    if (certifications !== undefined) {
      let parsedCertifications = certifications;

      if (typeof parsedCertifications === "string") {
        try {
          parsedCertifications = JSON.parse(parsedCertifications);
        } catch (error) {
          parsedCertifications = parsedCertifications
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
      }

      mentor.certifications = Array.isArray(parsedCertifications)
        ? parsedCertifications
        : [];
    }

    // =====================================================
    // ABOUT MENTOR
    // =====================================================

    if (headline !== undefined) {
      mentor.headline = headline;
    }

    if (about !== undefined) {
      mentor.about = about;
    }

    if (teachingStyle !== undefined) {
      mentor.teachingStyle = teachingStyle;
    }

    // =====================================================
    // AVAILABILITY
    // =====================================================

    if (availability !== undefined) {
      let parsedAvailability = availability;

      if (typeof parsedAvailability === "string") {
        try {
          parsedAvailability = JSON.parse(parsedAvailability);
        } catch (error) {
          parsedAvailability = {};
        }
      }

      if (!parsedAvailability || typeof parsedAvailability !== "object") {
        parsedAvailability = {};
      }

      // -----------------------------
      // AVAILABLE DAYS
      // -----------------------------

      let availableDays = parsedAvailability.availableDays;

      if (typeof availableDays === "string") {
        try {
          availableDays = JSON.parse(availableDays);
        } catch (error) {
          availableDays = availableDays
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
      }

      // -----------------------------
      // SESSION DURATION
      // -----------------------------

      let sessionDuration = mentor.availability?.sessionDuration || 60;

      if (
        parsedAvailability.sessionDuration !== undefined &&
        parsedAvailability.sessionDuration !== ""
      ) {
        const parsedDuration = Number(parsedAvailability.sessionDuration);

        if (!Number.isNaN(parsedDuration)) {
          sessionDuration = parsedDuration;
        }
      }

      // -----------------------------
      // UPDATE AVAILABILITY
      // -----------------------------

      mentor.availability = {
        availableDays:
          availableDays !== undefined
            ? Array.isArray(availableDays)
              ? availableDays
              : []
            : mentor.availability?.availableDays || [],

        preferredTime:
          parsedAvailability.preferredTime !== undefined
            ? parsedAvailability.preferredTime
            : mentor.availability?.preferredTime || "",

        startTime:
          parsedAvailability.startTime !== undefined
            ? parsedAvailability.startTime
            : mentor.availability?.startTime || "",

        endTime:
          parsedAvailability.endTime !== undefined
            ? parsedAvailability.endTime
            : mentor.availability?.endTime || "",

        timezone:
          parsedAvailability.timezone !== undefined
            ? parsedAvailability.timezone
            : mentor.availability?.timezone || "Asia/Kolkata",

        sessionDuration,
      };
    }

    // =====================================================
    // PRICING
    // =====================================================

    if (pricing !== undefined) {
      let parsedPricing = pricing;

      if (typeof parsedPricing === "string") {
        try {
          parsedPricing = JSON.parse(parsedPricing);
        } catch (error) {
          parsedPricing = {};
        }
      }

      if (!parsedPricing || typeof parsedPricing !== "object") {
        parsedPricing = {};
      }

      // -----------------------------
      // SESSION TYPES
      // -----------------------------

      let sessionTypes = parsedPricing.sessionTypes;

      if (typeof sessionTypes === "string") {
        try {
          sessionTypes = JSON.parse(sessionTypes);
        } catch (error) {
          sessionTypes = sessionTypes
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
      }

      // -----------------------------
      // SESSION PRICE
      // -----------------------------

      let sessionPrice = mentor.pricing?.sessionPrice || 0;

      if (
        parsedPricing.sessionPrice !== undefined &&
        parsedPricing.sessionPrice !== ""
      ) {
        const parsedPrice = Number(parsedPricing.sessionPrice);

        if (!Number.isNaN(parsedPrice)) {
          sessionPrice = parsedPrice;
        }
      }

      // -----------------------------
      // FREE TRIAL
      // -----------------------------

      let freeTrial = mentor.pricing?.freeTrial || false;

      if (parsedPricing.freeTrial !== undefined) {
        freeTrial =
          parsedPricing.freeTrial === true ||
          parsedPricing.freeTrial === "true";
      }

      // -----------------------------
      // UPDATE PRICING
      // -----------------------------

      mentor.pricing = {
        sessionTypes:
          sessionTypes !== undefined
            ? Array.isArray(sessionTypes)
              ? sessionTypes
              : []
            : mentor.pricing?.sessionTypes || [],

        sessionPrice,

        currency:
          parsedPricing.currency !== undefined
            ? parsedPricing.currency
            : mentor.pricing?.currency || "INR",

        freeTrial,

        pricingNote:
          parsedPricing.pricingNote !== undefined
            ? parsedPricing.pricingNote
            : mentor.pricing?.pricingNote || "",
      };
    }

    // =====================================================
    // VERIFICATION STATUS
    // =====================================================

    if (verificationStatus !== undefined) {
      mentor.verificationStatus = verificationStatus;

      // -----------------------------
      // APPROVED
      // -----------------------------

      if (verificationStatus === "Approved") {
        mentor.approvedAt = new Date();

        mentor.rejectionReason = "";
      }

      // -----------------------------
      // REJECTED
      // -----------------------------

      if (verificationStatus === "Rejected") {
        mentor.rejectionReason = rejectionReason || "Rejected by Admin";
      }

      // -----------------------------
      // PENDING
      // -----------------------------

      if (verificationStatus === "Pending") {
        mentor.approvedAt = null;
      }
    }

    // =====================================================
    // ACCOUNT STATUS
    // =====================================================

    if (accountStatus !== undefined) {
      mentor.accountStatus = accountStatus;

      // -----------------------------
      // SUSPENDED
      // -----------------------------

      if (accountStatus === "Suspended") {
        mentor.suspensionReason = suspensionReason || "Suspended by Admin";

        mentor.suspendedAt = new Date();
      }

      // -----------------------------
      // ACTIVE
      // -----------------------------

      if (accountStatus === "Active") {
        mentor.suspensionReason = "";

        mentor.suspendedAt = null;
      }
    }

    // =====================================================
    // AGREEMENT
    // =====================================================

    if (agreement !== undefined) {
      mentor.agreement = agreement === true || agreement === "true";
    }

    // =====================================================
    // VERIFIED STATUS
    // =====================================================

    if (isVerified !== undefined) {
      mentor.isVerified = isVerified === true || isVerified === "true";
    }

    // =====================================================
    // REJECTION REASON
    // =====================================================

    if (rejectionReason !== undefined) {
      mentor.rejectionReason = rejectionReason;
    }

    // =====================================================
    // SUSPENSION REASON
    // =====================================================

    if (suspensionReason !== undefined) {
      mentor.suspensionReason = suspensionReason;
    }

    // =====================================================
    // PROFILE IMAGE
    // =====================================================

    if (req.files?.profileImage?.[0]) {
      mentor.profileImage = `/uploads/${req.files.profileImage[0].filename}`;
    }

    // =====================================================
    // RESUME
    // =====================================================

    if (req.files?.resume?.[0]) {
      mentor.resume = `/uploads/${req.files.resume[0].filename}`;
    }

    // =====================================================
    // GOVERNMENT ID
    // =====================================================

    if (req.files?.governmentId?.[0]) {
      mentor.governmentId = `/uploads/${req.files.governmentId[0].filename}`;
    }

    // =====================================================
    // DEGREE CERTIFICATE
    // =====================================================

    if (req.files?.degreeCertificate?.[0]) {
      mentor.degreeCertificate = `/uploads/${req.files.degreeCertificate[0].filename}`;
    }

    // =====================================================
    // SAVE MENTOR
    // =====================================================

    await mentor.save();

    // =====================================================
    // UPDATE LINKED STUDENT
    // =====================================================

    if (mentor.student) {
      const studentUpdates = {};

      // -----------------------------
      // NAME
      // -----------------------------

      if (firstName !== undefined) {
        studentUpdates.firstName = String(firstName).trim();
      }

      if (lastName !== undefined) {
        studentUpdates.lastName = String(lastName).trim();
      }

      // -----------------------------
      // EMAIL
      // -----------------------------

      if (email !== undefined) {
        studentUpdates.email = String(email).trim().toLowerCase();
      }

      // -----------------------------
      // PHONE
      // -----------------------------

      if (phone !== undefined) {
        studentUpdates.phone = String(phone).trim();
      }

      // -----------------------------
      // PROFILE IMAGE
      // -----------------------------

      if (req.files?.profileImage?.[0]) {
        studentUpdates.profileImage = `/uploads/${req.files.profileImage[0].filename}`;
      }

      // -----------------------------
      // UPDATE STUDENT
      // -----------------------------

      if (Object.keys(studentUpdates).length > 0) {
        await Student.findByIdAndUpdate(mentor.student, studentUpdates, {
          new: true,
          runValidators: true,
        });
      }
    }

    // =====================================================
    // GET UPDATED MENTOR
    // =====================================================

    const updatedMentor = await Mentor.findById(id).populate(
      "student",
      "firstName lastName email phone profileImage education careerGoal isVerified isActive isBlocked"
    );

    // =====================================================
    // SUCCESS RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,
      message: "Mentor updated successfully.",
      mentor: updatedMentor,
    });
  } catch (error) {
    // =====================================================
    // ERROR LOG
    // =====================================================

    console.error("Update mentor error:", error);

    // =====================================================
    // DUPLICATE KEY ERROR
    // =====================================================

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Duplicate data found. Please check the mentor email or other unique fields.",
        error: error.message,
      });
    }

    // =====================================================
    // VALIDATION ERROR
    // =====================================================

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );

      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: validationErrors,
      });
    }

    // =====================================================
    // CAST ERROR
    // =====================================================

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid value for ${error.path}.`,
        error: error.message,
      });
    }

    // =====================================================
    // GENERAL ERROR
    // =====================================================

    return res.status(500).json({
      success: false,
      message: "Failed to update mentor.",
      error: error.message,
    });
  }
};

export const getAllAdminReviews = async (req, res) => {
  try {
    // =====================================================
    // FETCH ALL REVIEWS
    // =====================================================

    const reviews = await Review.find({})
      // ================= STUDENT =================
      .populate({
        path: "studentId",
        select:
          "firstName lastName email phone profileImage role isVerified isActive createdAt",
      })

      // ================= MENTOR =================
      .populate({
        path: "mentorId",
        select:
          "firstName lastName email phone profileImage profession company category averageRating",
      })

      // ================= BOOKING =================
      .populate({
        path: "bookingId",
        select:
          "mentor student sessionType sessionDate startTime endTime duration amount currency bookingStatus paymentStatus notes createdAt",
        populate: [
          {
            path: "student",
            select: "firstName lastName email phone profileImage",
          },
          {
            path: "mentor",
            select: "firstName lastName email profileImage profession company",
          },
        ],
      })

      .sort({
        createdAt: -1,
      })
      .lean();

    // =====================================================
    // GET BOOKING IDS
    // =====================================================

    const bookingIds = reviews
      .map((review) => review.bookingId?._id)
      .filter(Boolean);

    // =====================================================
    // FIND RELATED MEETINGS
    // =====================================================

    const meetings = await Meeting.find({
      booking: {
        $in: bookingIds,
      },
    })
      .populate({
        path: "student",
        select: "firstName lastName email phone profileImage",
      })
      .populate({
        path: "mentor",
        select: "firstName lastName email profileImage profession company",
      })
      .populate({
        path: "booking",
        select:
          "sessionType sessionDate startTime endTime duration amount currency bookingStatus paymentStatus",
      })
      .lean();

    // =====================================================
    // MAP MEETINGS BY BOOKING ID
    // =====================================================

    const meetingMap = new Map();

    meetings.forEach((meeting) => {
      if (meeting.booking?._id) {
        meetingMap.set(meeting.booking._id.toString(), meeting);
      }
    });

    // =====================================================
    // ATTACH MEETING TO EACH REVIEW
    // =====================================================

    const reviewsWithMeetings = reviews.map((review) => {
      const bookingId = review.bookingId?._id?.toString();

      return {
        ...review,

        meeting: meetingMap.get(bookingId) || null,
      };
    });

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      count: reviewsWithMeetings.length,

      reviews: reviewsWithMeetings,
    });
  } catch (error) {
    console.error("Get all admin reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

export const getAdminBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find booking
    const booking = await Booking.findById(id)
      .populate("student", "firstName lastName email profileImage")
      .populate("mentor", "firstName lastName email profession profileImage")
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Find review related to this booking
    const review = await Review.findOne({
      bookingId: id,
    }).lean();

    // Find meeting related to this booking
    const meeting = await Meeting.findOne({
      booking: id,
    })
      .select(
        "roomId scheduledStartTime scheduledEndTime status mentorJoined studentJoined mentorJoinedAt studentJoinedAt createdAt updatedAt"
      )
      .lean();

    // Combine booking, review, and meeting data
    const bookingWithDetails = {
      ...booking,

      // Review information
      reviewSubmitted: !!review,
      review: review || null,

      // Meeting information
      meeting: meeting || null,
    };

    return res.status(200).json({
      success: true,
      booking: bookingWithDetails,
    });
  } catch (error) {
    console.error("Get Admin Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch booking details",
      error: error.message,
    });
  }
};
