import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    // User who performed the action
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "userType",
      required: true,
    },

    userType: {
      type: String,
      enum: ["Admin", "Mentor", "Student"],
      required: true,
    },

    userName: {
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

    // Action performed
    action: {
      type: String,
      required: true,
      trim: true,
    },

    // Module where action happened
    module: {
      type: String,
      enum: [
        "Authentication",
        "Admin",
        "Mentor",
        "Student",
        "Booking",
        "Payment",
        "Review",
        "Profile",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Entity affected
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    targetType: {
      type: String,
      default: null,
      trim: true,
    },

    // Request info
    ipAddress: {
      type: String,
      default: "",
    },

    userAgent: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Useful indexes
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ module: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ userId: 1 });

export default mongoose.model("AuditLog", auditLogSchema);
