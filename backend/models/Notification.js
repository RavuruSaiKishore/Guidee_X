import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "recipientModel",
      required: true,
    },

    recipientModel: {
      type: String,
      enum: ["Student", "Mentor"],
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderModel",
      required: true,
    },

    senderModel: {
      type: String,
      enum: ["Student", "Mentor", "Admin"],
      required: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },

    type: {
      type: String,
      enum: [
        "BOOKING_REQUEST",
        "BOOKING_CONFIRMED",
        "BOOKING_REJECTED",
        "BOOKING_CANCELLED",
        "SESSION_REMINDER",
        "PAYMENT_SUCCESS",
        "PAYMENT_REFUND",
        "REVIEW_RECEIVED",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipient: 1, isRead: 1 });

export default mongoose.model("Notification", notificationSchema);
