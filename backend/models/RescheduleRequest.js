import mongoose from "mongoose";

const rescheduleRequestSchema = new mongoose.Schema(
  {
    // =====================================================
    // ORIGINAL BOOKING
    // =====================================================

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    // =====================================================
    // MENTOR
    // =====================================================

    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },

    // =====================================================
    // STUDENT
    // =====================================================

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    // =====================================================
    // CURRENT / ORIGINAL SCHEDULE
    // Stored for history and comparison
    // =====================================================

    originalSessionDate: {
      type: Date,
      required: true,
    },

    originalStartTime: {
      type: String,
      required: true,
    },

    originalEndTime: {
      type: String,
      default: "",
    },

    // =====================================================
    // REQUESTED NEW SCHEDULE
    // =====================================================

    requestedSessionDate: {
      type: Date,
      required: true,
    },

    requestedStartTime: {
      type: String,
      required: true,
    },

    requestedEndTime: {
      type: String,
      default: "",
    },

    // =====================================================
    // REASON
    // =====================================================

    reason: {
      type: String,
      default: "",
      trim: true,
    },

    // =====================================================
    // STATUS
    // =====================================================

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Cancelled"],
      default: "Pending",
    },

    // =====================================================
    // STUDENT RESPONSE
    // =====================================================

    respondedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("RescheduleRequest", rescheduleRequestSchema);
