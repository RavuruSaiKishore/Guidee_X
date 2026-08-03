import crypto from "crypto";
import Booking from "../models/Bookings.js";
import Student from "../models/Student.js"
import createAuditLog from "../utils/createAuditLog.js";
import Mentor from "../models/Mentor.js";
import Notification from "../models/Notification.js";
import Meeting from "../models/Meeting.js";
import RescheduleRequest from "../models/RescheduleRequest.js";



const generateMeetingLink = () => {
  const meetingCode = crypto.randomBytes(8).toString("hex");

  return `${process.env.FRONTEND_URL}/meeting/${meetingCode}`;
};

const calculateEndTime = (startTime, duration) => {
  const [time, modifier] = startTime.split(" ");

  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const date = new Date();

  date.setHours(hours);
  date.setMinutes(minutes);

  date.setMinutes(date.getMinutes() + Number(duration));

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const createBooking = async (req, res) => {
  try {
    const {
      mentor,
      sessionType,
      sessionDate,
      startTime,
      duration,
      amount,
      notes,
    } = req.body;

    const student = req.user.id;

    const endTime = calculateEndTime(startTime, duration);

    const meetingLink = generateMeetingLink();

    const booking = await Booking.create({
      mentor,
      student,
      sessionType,
      sessionDate,
      startTime,
      endTime,
      duration,
      amount,
      notes,
      meetingLink,
      cancelledBy: "",
      cancellationReason: "",
    });

    const mentorData = await Mentor.findById(mentor);
    if (!mentorData) {
      return res
        .status(404)
        .json({ success: false, message: "Mentor not found." });
    }

    const userData = await Student.findById(student);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    }

    await Notification.create({
      recipient: mentor,
      recipientModel: "Mentor",

      sender: student,
      senderModel: "Student",

      booking: booking._id,

      type: "BOOKING_REQUEST",

      title: "New Booking Request",

      message: `${userData.firstName} ${userData.lastName} has requested a ${sessionType} session on ${sessionDate}.`,
    });


    await createAuditLog({
      req,
      user: {
        ...userData.toObject(),
        role: "Student",
      },
      action: "Create Booking",
      module: "Booking",
      description: `Booked a ${duration}-minute ${sessionType} session with mentor ${mentorData.firstName} ${mentorData.lastName}.`,
      targetId: booking._id,
      targetType: "Booking",
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create Booking Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getMyBookings = async (req, res) => {
  try {
    const studentId = req.user.id;

    const bookings = await Booking.find({
      student: studentId,
    })
      .populate(
        "mentor",
        "firstName lastName profession profileImage averageRating company"
      )
      .sort({ createdAt: -1 });

    // Find meetings related to these bookings
    const meetings = await Meeting.find({
      booking: {
        $in: bookings.map((booking) => booking._id),
      },
    });

    // Attach meeting details
    const bookingsWithMeeting = bookings.map((booking) => {
      const meeting = meetings.find(
        (meeting) => meeting.booking.toString() === booking._id.toString()
      );

      return {
        ...booking.toObject(),

        meeting: meeting || null,
      };
    });

    res.status(200).json({
      success: true,
      bookings: bookingsWithMeeting,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch bookings.",
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { cancellationReason } = req.body;

    if (!cancellationReason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason is required.",
      });
    }

   const booking = await Booking.findOne({
     _id: bookingId,
     student: req.user.id,
   });


    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (
      booking.bookingStatus === "Completed" ||
      booking.bookingStatus === "Cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: "Booking cannot be cancelled.",
      });
    }

    const user = await Student.findById(req.user.id);
    const mentorData = await Mentor.findById(booking.mentor);

    booking.bookingStatus = "Cancelled";
    booking.cancelledBy = `${user.firstName} ${user.lastName}`;
    booking.cancellationReason = cancellationReason;
    booking.cancelledAt = new Date();

    await booking.save();


    await Notification.create({
      recipient: booking.mentor,
      recipientModel: "Mentor",

      sender: booking.student,
      senderModel: "Student",

      booking: booking._id,

      type: "BOOKING_CANCELLED",

      title: "Booking Cancelled",

      message: `${user.firstName} ${user.lastName} cancelled the booked session.`,
    });

   
    // ===========================
    // AUDIT LOG
    // ===========================
    await createAuditLog({
      req,
      user: {
        ...user.toObject(),
        role: "Student",
      },
      action: "Cancel Booking",
      module: "Booking",
      description: `Cancelled booking with mentor ${mentorData.firstName} ${mentorData.lastName}. Reason: ${cancellationReason}`,
      targetId: booking._id,
      targetType: "Booking",
    });

    res.json({
      success: true,
      message: "Booking cancelled successfully..!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

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

    // Allow only the owner to delete
    if (booking.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const student = await Student.findById(req.user.id).select("-password");

    const mentorData = await Mentor.findById(booking.mentor).select(
      "firstName lastName"
    );

    await Booking.findByIdAndDelete(id);

    await createAuditLog({
      req,
      user: {
        ...student.toObject(),
        role: "Student",
      },
      action: "Delete Booking",
      module: "Booking",
      description: `Deleted booking with mentor ${mentorData.firstName} ${mentorData.lastName}.`,
      targetId: booking._id,
      targetType: "Booking",
    });

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully.",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Unable to delete booking.",
    });
  }
};


export const getTodaySessions = async (req, res) => {
  try {
    // Logged in student's id
    const studentId = req.user.id;

    // Find mentor profile
    const mentor = await Mentor.findOne({ student: studentId });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    // Today's start
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Today's end
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const sessions = await Booking.find({
      mentor: mentor._id,
      bookingStatus: "Confirmed",
      sessionDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .populate("student", "firstName lastName email profileImage")
      .sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUpcomingSessions = async (req, res) => {
  try {
    // Logged-in mentor's student ID
    const studentId = req.user.id;

    // Find mentor profile
    const mentor = await Mentor.findOne({ student: studentId });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    // Tomorrow starts at 00:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const sessions = await Booking.find({
      mentor: mentor._id,
      bookingStatus: "Confirmed",
      sessionDate: {
        $gte: tomorrow,
      },
    })
      .populate("student", "firstName lastName email profileImage phone")
      .sort({
        sessionDate: 1,
        startTime: 1,
      });

    return res.status(200).json({
      success: true,
      totalSessions: sessions.length,
      sessions,
    });
  } catch (error) {
    console.error("Upcoming Sessions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming sessions.",
    });
  }
};


export const getConfirmedSessions = async (req, res) => {
  try {
    const studentId = req.user.id;

    const mentor = await Mentor.findOne({
      student: studentId,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const sessions = await Booking.find({
      mentor: mentor._id,
      bookingStatus: "Confirmed",
    })
      .populate("student", "firstName lastName email profileImage phone")
      .sort({
        sessionDate: 1,
        startTime: 1,
      });

    // Get booking IDs
    const bookingIds = sessions.map((session) => session._id);

    // Find meetings using booking IDs
    const meetings = await Meeting.find({
      booking: {
        $in: bookingIds,
      },
    });

    // Attach meeting details
    const sessionsWithMeeting = sessions.map((session) => {
      const meeting = meetings.find(
        (meeting) => meeting.booking.toString() === session._id.toString()
      );

      return {
        ...session.toObject(),

        meeting: meeting || null,
      };
    });

    return res.status(200).json({
      success: true,
      count: sessionsWithMeeting.length,
      sessions: sessionsWithMeeting,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



export const getSessionForRescheduling = async (req, res) => {
  try {
    // =========================================================
    // GET LOGGED-IN MENTOR
    // =========================================================

    const studentId = req.user.id;

    const mentor = await Mentor.findOne({
      student: studentId,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    // =========================================================
    // GET CONFIRMED BOOKINGS
    // =========================================================

    const sessions = await Booking.find({
      mentor: mentor._id,
      bookingStatus: "Confirmed",
    })
      .populate("student", "firstName lastName email profileImage phone")
      .sort({
        sessionDate: 1,
        startTime: 1,
      });

    // =========================================================
    // GET BOOKING IDS
    // =========================================================

    const bookingIds = sessions.map((session) => session._id);

    // =========================================================
    // GET MEETINGS
    // =========================================================

    const meetings = await Meeting.find({
      booking: {
        $in: bookingIds,
      },
    });

    // =========================================================
    // GET RESCHEDULE REQUESTS
    //
    // We get all requests for these bookings.
    // Later we select the latest request for each booking.
    // =========================================================

    const rescheduleRequests = await RescheduleRequest.find({
      booking: {
        $in: bookingIds,
      },
    }).sort({
      createdAt: -1,
    });

    // =========================================================
    // ATTACH MEETING + RESCHEDULE REQUEST
    // =========================================================

    const sessionsWithDetails = sessions.map((session) => {
      // ---------------------------------------------
      // FIND MEETING
      // ---------------------------------------------

      const meeting = meetings.find(
        (meeting) => meeting.booking.toString() === session._id.toString()
      );

      // ---------------------------------------------
      // FIND LATEST RESCHEDULE REQUEST
      // ---------------------------------------------

      const rescheduleRequest = rescheduleRequests.find(
        (request) => request.booking.toString() === session._id.toString()
      );

      return {
        ...session.toObject(),

        // Meeting information
        meeting: meeting || null,

        // Latest reschedule request
        rescheduleRequest: rescheduleRequest || null,

        // Easy frontend flag
        hasPendingRescheduleRequest: rescheduleRequest?.status === "Pending",
      };
    });

    // =========================================================
    // RESPONSE
    // =========================================================

    return res.status(200).json({
      success: true,

      count: sessionsWithDetails.length,

      sessions: sessionsWithDetails,
    });
  } catch (error) {
    console.error("GET CONFIRMED SESSIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};