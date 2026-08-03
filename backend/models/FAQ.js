import mongoose from "mongoose";


const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "General",
        "Booking",
        "Cancellation",
        "Payment",
        "Meeting",
        "Mentor",
        "Account",
      ],
      default: "General",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: String,
      default: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("FAQ", faqSchema);
