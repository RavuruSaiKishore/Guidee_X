import Booking from "../models/Bookings.js";
import Mentor from "../models/Mentor.js";
import MentorStudentNote from "../models/MentorStudentNote.js";
import Review from "../models/Reviews.js";
import Student from "../models/Student.js";

export const getMentorStudents = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Find mentor profile
    const mentor = await Mentor.findOne({
      student: userId,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found.",
      });
    }

    /*
    =====================================================
    FIND ALL BOOKINGS FOR THIS MENTOR
    =====================================================
    */

    const bookings = await Booking.find({
      mentor: mentor._id,
    })
      .populate(
        "student",
        "firstName lastName email profileImage phone education skills careerGoal goals"
      )
      .sort({
        sessionDate: -1,
        createdAt: -1,
      });

    /*
    =====================================================
    GROUP BOOKINGS BY STUDENT
    =====================================================
    */

    const studentMap = new Map();

    bookings.forEach((booking) => {
      if (!booking.student) return;

      const studentId = booking.student._id.toString();

      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, {
          student: booking.student,
          bookings: [],
        });
      }

      studentMap.get(studentId).bookings.push(booking);
    });

    const students = [];

    for (const [studentId, data] of studentMap.entries()) {
      const studentBookings = data.bookings;

      const completedSessions = studentBookings.filter(
        (booking) => booking.bookingStatus === "Completed"
      ).length;

      const upcomingSessions = studentBookings.filter(
        (booking) =>
          booking.bookingStatus === "Confirmed" &&
          new Date(booking.sessionDate) >= new Date()
      ).length;

      const totalSessions = studentBookings.length;

      const completedBooking = studentBookings.find(
        (booking) => booking.bookingStatus === "Completed"
      );

      /*
      =====================================================
      GET LAST SESSION
      =====================================================
      */

      let lastSession = null;

      if (completedBooking) {
        lastSession = {
          date: completedBooking.sessionDate,
          startTime: completedBooking.startTime,
          endTime: completedBooking.endTime,
          sessionType: completedBooking.sessionType,
        };
      }

      /*
      =====================================================
      GET NEXT UPCOMING SESSION
      =====================================================
      */

      const upcomingBooking = studentBookings
        .filter(
          (booking) =>
            booking.bookingStatus === "Confirmed" &&
            new Date(booking.sessionDate) >= new Date()
        )
        .sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate))[0];

      let upcomingSession = null;

      if (upcomingBooking) {
        upcomingSession = {
          date: upcomingBooking.sessionDate,
          startTime: upcomingBooking.startTime,
          endTime: upcomingBooking.endTime,
          sessionType: upcomingBooking.sessionType,
        };
      }

      students.push({
        student: data.student,

        statistics: {
          completedSessions,
          upcomingSessions,
          totalSessions,
        },

        lastSession,

        upcomingSession,
      });
    }

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("GET MENTOR STUDENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch mentor students.",
    });
  }
};


export const getMentorStudentProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    const { studentId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    /*
    =====================================================
    FIND MENTOR
    =====================================================
    */

    const mentor = await Mentor.findOne({
      student: userId,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found.",
      });
    }

    /*
    =====================================================
    SECURITY CHECK
    =====================================================
    
    Mentor can only access students they interacted with.
    */

    const bookings = await Booking.find({
      mentor: mentor._id,
      student: studentId,
    })
      .populate(
        "student",
        "firstName lastName email profileImage phone education skills careerGoal goals"
      )
      .sort({
        sessionDate: -1,
      });

    if (!bookings.length) {
      return res.status(403).json({
        success: false,
        message: "You have not interacted with this student.",
      });
    }

    const student = bookings[0].student;

    /*
    =====================================================
    SESSION STATISTICS
    =====================================================
    */

    const completedSessions = bookings.filter(
      (booking) => booking.bookingStatus === "Completed"
    );

    const upcomingSessions = bookings.filter(
      (booking) =>
        booking.bookingStatus === "Confirmed" &&
        new Date(booking.sessionDate) >= new Date()
    );

    const cancelledSessions = bookings.filter(
      (booking) => booking.bookingStatus === "Cancelled"
    );

    /*
    =====================================================
    MENTOR NOTES
    =====================================================
    */

    const notes = await MentorStudentNote.find({
      mentor: mentor._id,
      student: studentId,
    }).sort({
      createdAt: -1,
    });

    /*
    =====================================================
    FEEDBACK / REVIEWS
    =====================================================
    */

    const reviews = await Review.find({
      mentor: mentor._id,
      student: studentId,
    }).sort({
      createdAt: -1,
    });

    /*
    =====================================================
    RESPONSE
    =====================================================
    */

    return res.status(200).json({
      success: true,

      student,

      statistics: {
        totalSessions: bookings.length,
        completedSessions: completedSessions.length,
        upcomingSessions: upcomingSessions.length,
        cancelledSessions: cancelledSessions.length,
      },

      sessionHistory: bookings,

      notes,

      reviews,
    });
  } catch (error) {
    console.error("GET MENTOR STUDENT PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student profile.",
    });
  }
};


export const addMentorStudentNote = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    const { studentId } = req.params;

    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note is required.",
      });
    }

    const mentor = await Mentor.findOne({
      student: userId,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found.",
      });
    }

    /*
    =====================================================
    VERIFY MENTOR-STUDENT RELATIONSHIP
    =====================================================
    */

    const hasInteraction = await Booking.exists({
      mentor: mentor._id,
      student: studentId,
    });

    if (!hasInteraction) {
      return res.status(403).json({
        success: false,
        message: "You cannot add notes for this student.",
      });
    }

    const newNote = await MentorStudentNote.create({
      mentor: mentor._id,
      student: studentId,
      note: note.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Mentor note added successfully.",
      note: newNote,
    });
  } catch (error) {
    console.error("ADD MENTOR NOTE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add mentor note.",
    });
  }
};


export const deleteMentorStudentNote = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    const { noteId } = req.params;

    const mentor = await Mentor.findOne({
      student: userId,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found.",
      });
    }

    const note = await MentorStudentNote.findOneAndDelete({
      _id: noteId,
      mentor: mentor._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE MENTOR NOTE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete note.",
    });
  }
};
