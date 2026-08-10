import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    sessionType: {
      type: String,
      enum: [
        "1 : 1 Mentorship",
        "One-on-One Session",
        "Group Session",
        "Career Guidance",
        "Project Mentoring",
        "Mock Interview",
      ],
      required: true,
    },

    sessionDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      default: 60,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    notes: {
      type: String,
      trim: true,
    },

    // ================= RAZORPAY =================

    orderId: {
      type: String,
    },

    paymentId: {
      type: String,
    },

    paymentSignature: {
      type: String,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded", "Failed"],
      default: "Pending",
    },

    // ================= BOOKING =================

    bookingStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled", "Rejected"],
      default: "Pending",
    },

    cancelledBy: {
      type: String,
    },

    cancellationReason: {
      type: String,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    isSeen: {
      type: Boolean,
      default: false,
    },

    reviewSubmitted: {
      type: Boolean,
      default: false,
    },

    platformFee: {
      type: Number,
      default: 0,
    },

    adminCommission: {
      type: Number,
      default: 0,
    },

    mentorEarnings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ================= INDEXES =================

bookingSchema.index({ student: 1 });

bookingSchema.index({ mentor: 1 });

bookingSchema.index({ bookingStatus: 1 });

bookingSchema.index({ paymentStatus: 1 });

bookingSchema.index({ sessionDate: 1 });


export default mongoose.model("Booking", bookingSchema);
