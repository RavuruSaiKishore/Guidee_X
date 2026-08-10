import Dispute from "../models/Dispute.js";
import Booking from "../models/Bookings.js";
import Mentor from "../models/Mentor.js"; // <--- Import Mentor model

// 1. Create a Dispute
export const createDispute = async (req, res) => {
  try {
    const { bookingId, category, subject, reason, raisedBy } = req.body;
    const userId = req.user?._id || req.user?.id;
    console.log(userId, bookingId);

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User ID missing." });
    }

    let mentorId = null;

    // If a booking is attached, fetch the booking and extract its mentor ID
    if (bookingId && bookingId !== "" && bookingId !== "null") {
      const booking = await Booking.findById(bookingId);
      if (booking) {
        mentorId = booking.mentor;
      }
    }

    const dispute = await Dispute.create({
      student: raisedBy === "Student" ? userId : req.body.studentId, // handles who raised it
      mentor: mentorId, // <--- Now correctly populated from the booking
      booking: bookingId && bookingId !== "" ? bookingId : null,
      category: category || "Booking Session",
      subject,
      reason,
      raisedBy: raisedBy || "Student",
      messages: [
        {
          senderModel: raisedBy || "Student",
          senderId: userId,
          senderName: req.user.firstName || req.user.name || raisedBy,
          message: `Dispute opened: ${reason}`,
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Dispute submitted successfully",
      dispute,
    });
  } catch (error) {
    console.error("Create Dispute Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDisputes = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const userRole = req.user?.role?.toLowerCase();

    let filter = {};

    if (userRole === "student") {
      filter.student = userId;
    } else if (userRole === "mentor") {
      // Find the Mentor document where the 'student' reference matches the logged-in User ID
      const mentorProfile = await Mentor.findOne({ student: userId });

      if (!mentorProfile) {
        return res.status(200).json({ success: true, disputes: [] }); // No profile found yet
      }

      // Filter disputes using the actual Mentor document _id
      filter.mentor = mentorProfile._id;
    }
    // Admins get all disputes (filter remains empty)

    const disputes = await Dispute.find(filter)
      .populate("booking", "sessionDate startTime bookingStatus")
      .populate("student", "firstName lastName email profileImage")
      .populate("mentor", "firstName lastName email profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, disputes });
  } catch (error) {
    console.error("Get Disputes Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get Single Dispute By ID (For Chat Room)
export const getDisputeById = async (req, res) => {
  try {
    const { disputeId } = req.params;

    // Prevent CastError if string is literally "undefined" or null
    if (!disputeId || disputeId === "undefined") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Dispute ID provided." });
    }

    const dispute = await Dispute.findById(disputeId)
      .populate("booking")
      .populate("student", "firstName lastName email")
      .populate("mentor", "firstName lastName email");

    if (!dispute) {
      return res
        .status(404)
        .json({ success: false, message: "Dispute room not found." });
    }

    res.status(200).json({ success: true, dispute });
  } catch (error) {
    console.error("Get Dispute By ID Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Add Message to 3-Way Chat Room
export const addDisputeMessage = async (req, res) => {
  try {
    const { disputeId } = req.params;

    if (!disputeId || disputeId === "undefined") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Dispute ID provided." });
    }

    const { message, senderModel } = req.body;
    const userId = req.user?._id || req.user?.id;

    const dispute = await Dispute.findById(disputeId);
    if (!dispute) {
      return res
        .status(404)
        .json({ success: false, message: "Dispute room not found." });
    }

    // Determine the actual sender name dynamically
    let senderName = req.user.firstName || req.user.name || senderModel;

    if (senderModel === "Mentor") {
      // Find the mentor profile linked to this user ID to get their exact name
      const mentorProfile = await Mentor.findOne({ student: userId });
      if (mentorProfile) {
        senderName = `${mentorProfile.firstName} ${mentorProfile.lastName}`;
      }
    } else if (senderModel === "Admin") {
      senderName = "Platform Admin";
    }

    dispute.messages.push({
      senderModel,
      senderId: userId,
      senderName, // <--- Saves the real mentor name permanently in DB
      message,
    });

    await dispute.save();
    res.status(200).json({ success: true, dispute });
  } catch (error) {
    console.error("Add Dispute Message Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Admin Resolution (Refund or Dismiss)
export const resolveDispute = async (req, res) => {
  try {
    const { disputeId } = req.params;
    const { resolutionAction, resolutionNotes } = req.body;
    const userId = req.user?._id || req.user?.id;

    const dispute = await Dispute.findById(disputeId);
    if (!dispute) {
      return res
        .status(404)
        .json({ success: false, message: "Dispute room not found." });
    }

    dispute.status =
      resolutionAction === "Refund"
        ? "Resolved - Refunded"
        : "Resolved - Dismissed";
    dispute.resolutionNotes = resolutionNotes;
    dispute.resolvedBy = userId;

    dispute.messages.push({
      senderModel: "Admin",
      senderId: userId,
      senderName: "Platform Admin",
      message: `[CASE CLOSED]: Action taken - ${resolutionAction}. Notes: ${resolutionNotes}`,
    });

    await dispute.save();

    if (resolutionAction === "Refund" && dispute.booking) {
      await Booking.findByIdAndUpdate(dispute.booking, {
        bookingStatus: "Cancelled",
      });
    }

    res.status(200).json({
      success: true,
      message: "Dispute resolved successfully",
      dispute,
    });
  } catch (error) {
    console.error("Resolve Dispute Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
