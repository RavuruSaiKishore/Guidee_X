import Meeting from "../models/Meeting.js";
import Booking from "../models/Bookings.js";
import { generateToken04 } from "../server/zegoServerAssistant.js";
import { rewardCompletedSession } from "../utils/gamification.js";
import Student from "../models/Student.js";


const APP_ID = Number(process.env.ZEGO_APP_ID);
const SERVER_SECRET = process.env.ZEGO_SERVER_SECRET;

/* ==========================================================
   Create Meeting
   (Call this after mentor approves the booking)
========================================================== */

export const createMeeting = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) return null;

    // Prevent duplicate meeting
    const existingMeeting = await Meeting.findOne({
      booking: booking._id,
    });

    if (existingMeeting) return existingMeeting;

    const start = new Date(booking.sessionDate);

    const [sh, sm] = booking.startTime.split(":");

    start.setHours(Number(sh), Number(sm), 0, 0);

    const end = new Date(start);

    end.setMinutes(end.getMinutes() + booking.duration);

    const meeting = await Meeting.create({
      booking: booking._id,
      mentor: booking.mentor,
      student: booking.student,
      roomId: `GX-${booking._id}`,
      scheduledStart: start,
      scheduledEnd: end,
    });

    return meeting;
  } catch (err) {
    console.log(err);
    return null;
  }
};

/* ==========================================================
   Join Meeting
========================================================== */

  export const joinMeeting = async (req, res) => {
    try {
      const { roomId } = req.params;

      const meeting = await Meeting.findOne({ roomId })
        .populate("booking")
        .populate("mentor")
        .populate("student");

      if (!meeting) {
        return res.status(404).json({
          success: false,
          message: "Meeting not found",
        });
      }

      const booking = meeting.booking;

      if (booking.bookingStatus !== "Confirmed") {
        return res.status(400).json({
          success: false,
          message: "Booking is not confirmed",
        });
      }

      const now = new Date();

      const joinTime = new Date(meeting.scheduledStart);

      joinTime.setMinutes(joinTime.getMinutes() - 10);

      if (now < joinTime) {
        return res.status(400).json({
          success: false,
          message: "Meeting can be joined only 10 minutes before start time.",
        });
      }

    const userId = req.user.id;

    let userName = "";

    if (meeting.student && meeting.student._id.toString() === userId) {
      userName =
        `${meeting.student.firstName} ${meeting.student.lastName}`.trim();
    }

    if (
      meeting.mentor &&
      meeting.mentor.student &&
      meeting.mentor.student.toString() === userId
    ) {
      userName =
        `${meeting.mentor.firstName} ${meeting.mentor.lastName}`.trim();
    }

    // Student joined
    if (
      meeting.student &&
      meeting.student._id &&
      meeting.student._id.toString() === userId
    ) {
      meeting.studentJoined = true;
      meeting.studentJoinedAt = new Date();
    }

    // Mentor joined
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

      const token = generateToken04(APP_ID, userId, SERVER_SECRET, 60 * 60);

    res.json({
      success: true,
      meeting: {
        appID: APP_ID,
        roomId: meeting.roomId,
        bookingId: meeting.booking._id,
        userID: userId,
        userName,
        token,
      },
    });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

/* ==========================================================
   End Meeting
========================================================== */
export const endMeeting = async (req, res) => {
  try {
    const { roomId } = req.params;

    const meeting = await Meeting.findOne({ roomId });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    meeting.status = "Completed";
    await meeting.save();

    const booking = await Booking.findByIdAndUpdate(
      meeting.booking,
      {
        bookingStatus: "Completed",
      },
      {
        new: true,
      }
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
      message: "Meeting completed successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};