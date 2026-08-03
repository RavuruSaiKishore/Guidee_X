import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    // =====================================================
    // EVENT BASIC INFORMATION
    // =====================================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // EVENT BANNER IMAGE
    // =====================================================

    bannerImage: {
      type: String,
      default: "",
      trim: true,
    },

    // =====================================================
    // EVENT DATE & TIME
    // =====================================================

    // Event start date and time
    startDateTime: {
      type: Date,
      required: true,
    },

    // Event end date and time
    endDateTime: {
      type: Date,
      required: true,
    },

    // =====================================================
    // SPEAKER INFORMATION
    // =====================================================

    speaker: {
      type: String,
      required: true,
      trim: true,
    },

    speakerImage: {
      type: String,
      default: "",
      trim: true,
    },

    speakerRole: {
      type: String,
      default: "",
      trim: true,
    },

    speakerCompany: {
      type: String,
      default: "",
      trim: true,
    },

    speakerBio: {
      type: String,
      default: "",
      trim: true,
    },

    speakerExperience: {
      type: String,
      default: "",
      trim: true,
    },

    // =====================================================
    // REGISTRATION
    // =====================================================

    registrationDeadline: {
      type: Date,
      required: true,
    },

    // =====================================================
    // EVENT STATUS
    // =====================================================

    status: {
      type: String,
      enum: [
        "Upcoming",
        "Registration Closed",
        "Live",
        "Completed",
        "Cancelled",
      ],
      default: "Upcoming",
    },

    // =====================================================
    // CREATED BY
    // =====================================================

    createdBy: {
      type: String,
      default: "TeamGuideex",
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
