import crypto from "crypto";
import Booking from "../models/Bookings.js";
import Student from "../models/Student.js"
import createAuditLog from "../utils/createAuditLog.js";
import Mentor from "../models/Mentor.js";
import Notification from "../models/Notification.js";



export const getNotificationCount = async (req, res) => {
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

    const bookingRequestCount = await Notification.countDocuments({
      recipient: mentor._id,
      recipientModel: "Mentor",
      isRead: false,
      type: "BOOKING_REQUEST",
    });

    const bookingCancelledCount = await Notification.countDocuments({
      recipient: mentor._id,
      recipientModel: "Mentor",
      isRead: false,
      type: "BOOKING_CANCELLED",
    });

    res.json({
      success: true,
      counts: {
        bookingRequest: bookingRequestCount,
        bookingCancelled: bookingCancelledCount,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



export const markNotificationsRead = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({
      student: req.user.id,
    });

    await Notification.updateMany(
      {
        recipient: mentor._id,
        recipientModel: "Mentor",
        type: "BOOKING_CANCELLED",
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.json({
      success: true,
      message: "Notifications marked as read.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};