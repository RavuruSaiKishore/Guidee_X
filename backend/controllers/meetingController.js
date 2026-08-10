import Meeting from "../models/Meeting.js";
import Booking from "../models/Bookings.js";
import { rewardCompletedSession } from "../utils/gamification.js";
import Student from "../models/Student.js";

/* ==========================================================
   Create Meeting (Called when mentor approves booking)
========================================================== */
export const createMeeting = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return null;

    // Prevent duplicate meetings
    const existingMeeting = await Meeting.findOne({ booking: booking._id });
    if (existingMeeting) return existingMeeting;

    // 1. Extract exact year, month, and day from booking.sessionDate
    const dateStr = new Date(booking.sessionDate).toISOString().split("T")[0];
    const [year, month, day] = dateStr.split("-").map(Number);

    // 2. Parse booking.startTime (e.g., "3:45 pm")
    let hours = 0;
    let minutes = 0;
    if (booking.startTime) {
      const parts = booking.startTime.trim().split(" ");
      const timePart = parts[0];
      const period = parts[1] ? parts[1].toLowerCase() : "";

      const timeSubParts = timePart.split(":");
      hours = Number(timeSubParts[0]) || 0;
      minutes = Number(timeSubParts[1]) || 0;

      if (period === "pm" && hours !== 12) hours += 12;
      if (period === "am" && hours === 12) hours = 0;
    }

    // 3. Construct accurate start and end Date objects in local time
    const start = new Date(year, month - 1, day, hours, minutes, 0, 0);
    const durationMs = (booking.duration || 60) * 60 * 1000;
    const end = new Date(start.getTime() + durationMs);

    const roomId =
      "meet_" +
      Math.random().toString(36).substring(2) +
      Date.now().toString(36);
    const googleMeetLink = "https://meet.google.com/new";

    const meeting = await Meeting.create({
      booking: booking._id,
      mentor: booking.mentor,
      student: booking.student,
      roomId,
      googleMeetLink,
      scheduledStartTime: start.toISOString(),
      scheduledEndTime: end.toISOString(),
      status: "Scheduled",
    });

    return meeting;
  } catch (err) {
    console.error("Create Meeting Error:", err);
    return null;
  }
};

/* ==========================================================
   Join Meeting (Logs attendance & returns Meet Link)
========================================================== */
export const joinMeeting = async (req, res) => {
  try {
    const { roomId } = req.params;

    const meeting = await Meeting.findOne({ roomId })
      .populate("booking")
      .populate("mentor")
      .populate("student");

    if (!meeting) {
      return res
        .status(404)
        .json({ success: false, message: "Meeting not found" });
    }

    const booking = meeting.booking;
    if (booking.bookingStatus !== "Confirmed") {
      return res
        .status(400)
        .json({ success: false, message: "Booking is not confirmed" });
    }

    const now = new Date();
    const joinTime = new Date(meeting.scheduledStartTime);
    joinTime.setMinutes(joinTime.getMinutes() - 10);

    if (now < joinTime) {
      return res.status(400).json({
        success: false,
        message: "Meeting can be joined only 10 minutes before start time.",
      });
    }

    const userId = req.user.id.toString();

    // Track Participant Joins
    if (meeting.student && meeting.student._id.toString() === userId) {
      meeting.studentJoined = true;
      meeting.studentJoinedAt = new Date();
    }

    if (
      meeting.mentor &&
      meeting.mentor.student &&
      meeting.mentor.student.toString() === userId
    ) {
      meeting.mentorJoined = true;
      meeting.mentorJoinedAt = new Date();
    }

    meeting.status = "In Progress";
    await meeting.save();

    return res.status(200).json({
      success: true,
      googleMeetLink: meeting.googleMeetLink || "https://meet.google.com/new",
      bookingId: booking._id,
    });
  } catch (err) {
    console.error("Join Meeting Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ==========================================================
   End Meeting (Saves Notes, Tasks & Rewards Student)
========================================================== */
export const endMeeting = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { sharedNotes, actionItems } = req.body;

    const meeting = await Meeting.findOne({ roomId });
    if (!meeting) {
      return res
        .status(404)
        .json({ success: false, message: "Meeting not found" });
    }

    meeting.status = "Completed";
    if (sharedNotes) meeting.sharedNotes = sharedNotes;
    if (actionItems) meeting.actionItems = actionItems;
    await meeting.save();

    const booking = await Booking.findByIdAndUpdate(
      meeting.booking,
      { bookingStatus: "Completed" },
      { new: true }
    );

    if (booking) {
      const student = await Student.findById(booking.student);
      if (student) {
        rewardCompletedSession(student);
        await student.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Meeting completed and notes saved successfully",
    });
  } catch (err) {
    console.error("End Meeting Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};



export const completeMeetingSession = async (req, res) => {
  try {
    const { roomId } = req.params;

    const meeting = await Meeting.findOne({ roomId });
    if (!meeting) {
      return res
        .status(404)
        .json({ success: false, message: "Meeting not found" });
    }

    meeting.status = "Completed";
    await meeting.save();

    const booking = await Booking.findByIdAndUpdate(
      meeting.booking,
      { bookingStatus: "Completed" },
      { new: true }
    );

    if (booking) {
      const student = await Student.findById(booking.student);
      if (student) {
        rewardCompletedSession(student);
        await student.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Session marked as completed successfully",
    });
  } catch (err) {
    console.error("Complete Session Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};