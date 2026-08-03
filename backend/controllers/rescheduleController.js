import RescheduleRequest from "../models/RescheduleRequest.js";
import Booking from "../models/Bookings.js";
import Meeting from "../models/Meeting.js";
import Mentor from "../models/Mentor.js";


export const createRescheduleRequest = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const {
      requestedSessionDate,
      requestedStartTime,
      reason,
    } = req.body;

    // =====================================================
    // VALIDATE REQUIRED INPUT
    // =====================================================

    if (!requestedSessionDate || !requestedStartTime) {
      return res.status(400).json({
        success: false,
        message: "New session date and start time are required.",
      });
    }

    // =====================================================
    // FIND BOOKING
    // =====================================================

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // =====================================================
    // FIND MENTOR
    // =====================================================

    const mentor = await Mentor.findById(booking.mentor);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found.",
      });
    }

    // =====================================================
    // VERIFY LOGGED-IN MENTOR
    //
    // Mentor model stores the Student/User reference
    // =====================================================

    const loggedInUserId = (
      req.user?._id ||
      req.user?.id
    )?.toString();

    if (
      !mentor.student ||
      mentor.student.toString() !== loggedInUserId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to reschedule this booking.",
      });
    }

    // =====================================================
    // ONLY CONFIRMED BOOKINGS CAN BE RESCHEDULED
    // =====================================================

    if (booking.bookingStatus !== "Confirmed") {
      return res.status(400).json({
        success: false,
        message:
          "Only confirmed bookings can be rescheduled.",
      });
    }

    // =====================================================
    // PREVENT MULTIPLE PENDING REQUESTS
    // =====================================================

    const existingRequest =
      await RescheduleRequest.findOne({
        booking: booking._id,
        status: "Pending",
      });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message:
          "A reschedule request is already pending for this booking.",
      });
    }

    // =====================================================
    // VALIDATE REQUESTED DATE
    // =====================================================

    const newDate = new Date(requestedSessionDate);

    if (Number.isNaN(newDate.getTime())) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid requested session date.",
      });
    }

    // =====================================================
    // NORMALIZE REQUESTED DATE
    //
    // Input:
    // 2026-08-05
    //
    // Result:
    // 2026-08-05
    // =====================================================

    const newDateOnly =
      requestedSessionDate.split("T")[0];

    // =====================================================
    // GET ORIGINAL BOOKING DATE
    // =====================================================

    const originalDateOnly = new Date(
      booking.sessionDate
    )
      .toISOString()
      .split("T")[0];

    // =====================================================
    // PREVENT SAME DATE + TIME
    // =====================================================

    if (
      originalDateOnly === newDateOnly &&
      booking.startTime === requestedStartTime
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The new schedule must be different from the current schedule.",
      });
    }

    // =====================================================
    // VALIDATE BOOKING DURATION
    //
    // Example:
    // duration = 60
    // =====================================================

    const duration = Number(booking.duration);

    if (!duration || duration <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Unable to calculate the new end time because the booking duration is invalid.",
      });
    }

    // =====================================================
    // VALIDATE REQUESTED START TIME
    //
    // Expected frontend format:
    //
    // 09:00
    // 14:30
    // 18:45
    //
    // HH:mm
    // =====================================================

    const timeParts =
      requestedStartTime.split(":");

    if (timeParts.length !== 2) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid requested start time format. Use HH:mm.",
      });
    }

    const hours = Number(timeParts[0]);

    const minutes = Number(timeParts[1]);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid requested start time.",
      });
    }

    // =====================================================
    // CALCULATE REQUESTED END TIME
    //
    // Example:
    //
    // Start Time = 14:30
    // Duration   = 60 minutes
    //
    // End Time   = 15:30
    // =====================================================

    const totalStartMinutes =
      hours * 60 + minutes;

    const totalEndMinutes =
      totalStartMinutes + duration;

    // =====================================================
    // PREVENT SESSION FROM EXCEEDING 24 HOURS
    // =====================================================

    if (totalEndMinutes >= 24 * 60) {
      return res.status(400).json({
        success: false,
        message:
          "The requested session cannot extend beyond midnight.",
      });
    }

    // =====================================================
    // CALCULATE END TIME IN HH:mm
    // =====================================================

    const endHours = Math.floor(
      totalEndMinutes / 60
    );

    const endMinutes =
      totalEndMinutes % 60;

    const requestedEndTime24 =
      `${String(endHours).padStart(2, "0")}:${String(
        endMinutes
      ).padStart(2, "0")}`;

    // =====================================================
    // CONVERT HH:mm TO AM/PM
    //
    // Example:
    //
    // 09:00 -> 09:00 AM
    // 12:00 -> 12:00 PM
    // 14:30 -> 02:30 PM
    // 23:30 -> 11:30 PM
    // =====================================================

    const formatTimeTo12Hour = (time) => {
      if (!time) {
        return null;
      }

      const [timeHours, timeMinutes] =
        time.split(":").map(Number);

      if (
        Number.isNaN(timeHours) ||
        Number.isNaN(timeMinutes)
      ) {
        return null;
      }

      const period =
        timeHours >= 12 ? "PM" : "AM";

      const formattedHours =
        timeHours % 12 || 12;

      return `${String(
        formattedHours
      ).padStart(2, "0")}:${String(
        timeMinutes
      ).padStart(2, "0")} ${period}`;
    };

    // =====================================================
    // FORMAT REQUESTED START TIME
    // =====================================================

    const requestedStartTimeFormatted =
      formatTimeTo12Hour(
        requestedStartTime
      );

    // =====================================================
    // FORMAT REQUESTED END TIME
    // =====================================================

    const requestedEndTimeFormatted =
      formatTimeTo12Hour(
        requestedEndTime24
      );

    if (
      !requestedStartTimeFormatted ||
      !requestedEndTimeFormatted
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Unable to format the requested session time.",
      });
    }

    // =====================================================
    // CREATE RESCHEDULE REQUEST
    //
    // IMPORTANT:
    //
    // The original Booking is NOT modified here.
    //
    // The Booking will be updated only after the
    // Student accepts the reschedule request.
    // =====================================================

    const request =
      await RescheduleRequest.create({
        // =================================================
        // BOOKING
        // =================================================

        booking: booking._id,

        // =================================================
        // MENTOR
        // =================================================

        mentor: booking.mentor,

        // =================================================
        // STUDENT
        // =================================================

        student: booking.student,

        // =================================================
        // ORIGINAL SCHEDULE
        // =================================================

        originalSessionDate:
          booking.sessionDate,

        originalStartTime:
          booking.startTime,

        originalEndTime:
          booking.endTime || "",

        // =================================================
        // REQUESTED NEW SCHEDULE
        // =================================================

        requestedSessionDate:
          newDate,

        requestedStartTime:
          requestedStartTimeFormatted,

        requestedEndTime:
          requestedEndTimeFormatted,

        // =================================================
        // SESSION DURATION
        // =================================================

        duration: duration,

        // =================================================
        // REASON
        // =================================================

        reason:
          reason?.trim() || "",

        // =================================================
        // REQUEST STATUS
        // =================================================

        status: "Pending",
      });

    // =====================================================
    // POPULATE REQUEST
    // =====================================================

    const populatedRequest =
      await RescheduleRequest.findById(
        request._id
      )
        .populate(
          "mentor",
          "firstName lastName profession profileImage"
        )
        .populate(
          "student",
          "firstName lastName email"
        )
        .populate("booking");

    // =====================================================
    // SUCCESS RESPONSE
    // =====================================================

    return res.status(201).json({
      success: true,

      message:
        "Reschedule request sent to the student.",

      request: populatedRequest,
    });
  } catch (error) {
    // =====================================================
    // ERROR HANDLING
    // =====================================================

    console.error(
      "CREATE RESCHEDULE REQUEST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Unable to create reschedule request.",

      error: error.message,
    });
  }
};

/* ==========================================================
   STUDENT
   GET MY PENDING RESCHEDULE REQUESTS
========================================================== */

export const getMyRescheduleRequests = async (req, res) => {
  try {
    const studentId = req.user.id;

    const requests = await RescheduleRequest.find({
      student: studentId,
    })
      .populate("mentor", "firstName lastName profession profileImage")
      .populate(
        "booking",
        "sessionDate startTime endTime duration sessionType bookingStatus amount"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("GET RESCHEDULE REQUESTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch reschedule requests.",
    });
  }
};

/* ==========================================================
   STUDENT
   ACCEPT RESCHEDULE REQUEST
========================================================== */


const formatTimeWithAmPm = (timeString) => {
  if (!timeString) return "";

  const value = timeString.trim().toUpperCase();

  // Already in 12-hour AM/PM format
  const match12 = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);

  if (match12) {
    let hours = Number(match12[1]);
    const minutes = match12[2];
    const period = match12[3];

    // Ensure 2-digit hour
    return `${String(hours).padStart(2, "0")}:${minutes} ${period}`;
  }

  // 24-hour format
  const match24 = value.match(/^(\d{1,2}):(\d{2})$/);

  if (match24) {
    let hours = Number(match24[1]);
    const minutes = match24[2];

    let period = "AM";

    if (hours >= 12) {
      period = "PM";
    }

    if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      hours -= 12;
    }

    return `${String(hours).padStart(2, "0")}:${minutes} ${period}`;
  }

  return null;
};


export const acceptRescheduleRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const studentId = req.user.id;

    // =====================================================
    // FIND REQUEST
    // =====================================================

    const request = await RescheduleRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Reschedule request not found.",
      });
    }

    // =====================================================
    // VERIFY STUDENT
    // =====================================================

    if (request.student.toString() !== studentId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to accept this request.",
      });
    }

    // =====================================================
    // REQUEST MUST BE PENDING
    // =====================================================

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `This request has already been ${request.status.toLowerCase()}.`,
      });
    }

    // =====================================================
    // GET BOOKING
    // =====================================================

    const booking = await Booking.findById(request.booking);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Original booking not found.",
      });
    }

    // =====================================================
    // SAFETY CHECK
    // =====================================================

    if (booking.bookingStatus !== "Confirmed") {
      return res.status(400).json({
        success: false,
        message: "This booking can no longer be rescheduled.",
      });
    }

    // =====================================================
    // FORMAT REQUESTED TIME
    //
    // Example:
    // 21:05      -> 09:05 PM
    // 09:05      -> 09:05 AM
    // 09:05 pm   -> 09:05 PM
    // 12:00      -> 12:00 PM
    // 00:00      -> 12:00 AM
    // =====================================================

    const formattedStartTime = formatTimeWithAmPm(request.requestedStartTime);

    if (!formattedStartTime) {
      return res.status(400).json({
        success: false,
        message: "Invalid requested start time.",
      });
    }

    let formattedEndTime = "";

    if (request.requestedEndTime) {
      formattedEndTime = formatTimeWithAmPm(request.requestedEndTime);

      if (!formattedEndTime) {
        return res.status(400).json({
          success: false,
          message: "Invalid requested end time.",
        });
      }
    }

    // =====================================================
    // UPDATE ORIGINAL BOOKING
    //
    // Booking changes ONLY after student accepts.
    // =====================================================

    booking.sessionDate = request.requestedSessionDate;

    booking.startTime = formattedStartTime;

    if (formattedEndTime) {
      booking.endTime = formattedEndTime;
    }

    await booking.save();

    // =====================================================
    // UPDATE EXISTING MEETING
    // =====================================================

    const meeting = await Meeting.findOne({
      booking: booking._id,
    });

    if (meeting) {
      meeting.scheduledStartTime = formattedStartTime;

      if (formattedEndTime) {
        meeting.scheduledEndTime = formattedEndTime;
      }

      meeting.status = "Scheduled";

      // Reset joined state after rescheduling
      meeting.mentorJoined = false;
      meeting.studentJoined = false;

      meeting.mentorJoinedAt = null;
      meeting.studentJoinedAt = null;

      await meeting.save();
    }

    // =====================================================
    // ACCEPT REQUEST
    // =====================================================

    request.status = "Accepted";
    request.respondedAt = new Date();

    await request.save();

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,
      message: "Reschedule request accepted. Your booking has been updated.",

      booking,

      meeting,

      updatedSchedule: {
        sessionDate: booking.sessionDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
      },
    });
  } catch (error) {
    console.error("ACCEPT RESCHEDULE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to accept reschedule request.",
      error: error.message,
    });
  }
};
/* ==========================================================
   STUDENT
   REJECT RESCHEDULE REQUEST
========================================================== */

export const rejectRescheduleRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const studentId = req.user.id;

    const request = await RescheduleRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Reschedule request not found.",
      });
    }

    // =====================================================
    // VERIFY STUDENT
    // =====================================================

    if (request.student.toString() !== studentId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to reject this request.",
      });
    }

    // =====================================================
    // REQUEST MUST BE PENDING
    // =====================================================

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `This request has already been ${request.status.toLowerCase()}.`,
      });
    }

    // =====================================================
    // IMPORTANT
    //
    // DO NOT CHANGE BOOKING
    // DO NOT CHANGE MEETING
    // =====================================================

    request.status = "Rejected";
    request.respondedAt = new Date();

    await request.save();

    return res.status(200).json({
      success: true,
      message:
        "Reschedule request rejected. Your original booking remains unchanged.",
    });
  } catch (error) {
    console.error("REJECT RESCHEDULE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reject reschedule request.",
      error: error.message,
    });
  }
};
