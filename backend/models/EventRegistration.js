import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    // Meeting link for the registered event
    meetingLink: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Registered", "Cancelled"],
      default: "Registered",
    },

    attended: {
      type: Boolean,
      default: false,
    },

    registeredAt: {
      type: Date,
      default: Date.now,
    },

    joinedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

eventRegistrationSchema.index({ event: 1, student: 1 }, { unique: true });

const EventRegistration = mongoose.model(
  "EventRegistration",
  eventRegistrationSchema
);

export default EventRegistration;
