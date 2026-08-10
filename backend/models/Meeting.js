import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },

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

    roomId: {
      type: String,
      required: true,
      unique: true,
    },

    scheduledStartTime: {
      type: String,
      required: true,
    },

    scheduledEndTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Scheduled", "In Progress", "Completed"],
      default: "Scheduled",
    },

    mentorJoined: {
      type: Boolean,
      default: false,
    },

    studentJoined: {
      type: Boolean,
      default: false,
    },

    recordingUrl: {
      type: String,
      default: null,
    },

    sharedNotes: {
      type: String,
      default: "",
    },

    actionItems: [
      {
        task: String,
        completed: { type: Boolean, default: false },
      },
    ],

    mentorJoinedAt: Date,

    studentJoinedAt: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Meeting", meetingSchema);
