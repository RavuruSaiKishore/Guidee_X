import mongoose from "mongoose";

const mentorContactSchema = new mongoose.Schema(
  {
    // Mentor reference
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
      index: true,
    },

    // Person who created request
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    // First message
    message: {
      type: String,
      trim: true,
      default: "",
    },

    // Who started conversation
    startedBy: {
      type: String,
      enum: ["Mentor", "Admin"],
      default: "Mentor",
    },

    // Chat messages
    conversation: [
      {
        sender: {
          type: String,
          enum: ["Mentor", "Admin"],
          required: true,
        },

        message: {
          type: String,
          required: true,
          trim: true,
        },

        sentAt: {
          type: Date,
          default: Date.now,
        },

        // future use
        isRead: {
          type: Boolean,
          default: false,
        },
      },
    ],

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Closed"],
      default: "Pending",
    },

    // Admin replied or not
    replied: {
      type: Boolean,
      default: false,
    },

    repliedAt: {
      type: Date,
      default: null,
    },

    // Last message information
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },

    lastSender: {
      type: String,
      enum: ["Mentor", "Admin"],
      default: "Mentor",
    },

    closedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Faster mentor dashboard loading
mentorContactSchema.index({
  mentorId: 1,
  lastMessageAt: -1,
});

export default mongoose.model("MentorContact", mentorContactSchema);
