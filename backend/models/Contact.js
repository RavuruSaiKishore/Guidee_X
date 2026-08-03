import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    // User details
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
      trim: true,
    },

    // Logged-in student
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    // Ticket information
    category: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    // First message (ticket creation message)
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Complete conversation history
    conversation: [
      {
        sender: {
          type: String,
          enum: ["Student", "Admin"],
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
      },
    ],

    // Ticket status
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Closed"],
      default: "Pending",
    },

    // Admin reply tracking
    replied: {
      type: Boolean,
      default: false,
    },

    repliedAt: {
      type: Date,
      default: null,
    },

    // Last activity in conversation
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },

    // When ticket closed
    closedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster student ticket search
contactSchema.index({
  studentId: 1,
  createdAt: -1,
});

export default mongoose.model("Contact", contactSchema);
