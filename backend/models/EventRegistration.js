import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema(
  {
    // Reference to the Event
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true,
    },

    // Reference to the Student
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student ID is required"],
      index: true,
    },

    // Meeting link generated or assigned for this registration
    meetingLink: {
      type: String,
      default: "",
      trim: true,
    },

    // Registration Status
    status: {
      type: String,
      enum: ["Registered", "Cancelled"],
      default: "Registered",
      index: true,
    },

    // --- PAYMENT TELEMETRY FIELDS ---
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Free"],
      default: "Pending",
    },
    paymentId: {
      type: String,
      default: "",
      trim: true,
    },
    orderId: {
      type: String,
      default: "",
      trim: true,
    },
    paymentSignature: {
      type: String,
      default: "",
      trim: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    // -------------------------------

    // Attendance Tracking
    attended: {
      type: Boolean,
      default: false,
    },

    // Timestamp recorded when student actually clicks "Join Event"
    joinedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Index: Prevents a student from having multiple ACTIVE registrations for the same event.
eventRegistrationSchema.index(
  { event: 1, student: 1 },
  { unique: true, partialFilterExpression: { status: "Registered" } }
);

const EventRegistration = mongoose.model(
  "EventRegistration",
  eventRegistrationSchema
);

export default EventRegistration;
