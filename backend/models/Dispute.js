import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      default: null, // Optional if it's not a mentor-specific issue
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null, // Optional now
    },
    category: {
      type: String,
      enum: [
        "Booking Session",
        "Course Content",
        "Payment / Refund",
        "Technical Issue",
        "Other",
      ],
      default: "Booking Session",
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    raisedBy: {
      type: String,
      enum: ["Student", "Mentor"],
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "Open",
        "Under Review",
        "Resolved - Refunded",
        "Resolved - Dismissed",
      ],
      default: "Open",
    },
    messages: [
      {
        senderModel: {
          type: String,
          enum: ["Student", "Mentor", "Admin"],
          required: true,
        },
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        senderName: String,
        message: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    resolutionNotes: {
      type: String,
      default: "",
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Dispute", disputeSchema);
