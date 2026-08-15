import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // In your User Schema
    password: {
      type: String,
      required: function () {
        return this.authProvider !== "google";
      },
    },

    role: {
      type: String,
      enum: ["student", "mentor", "admin"],
      default: "student",
    },

    phone: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    education: {
      type: String,
      default: "",
    },

    careerGoal: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    lockCount: {
      type: Number,
      required: true,
      default: 0,
    },

    tokenVersion: {
      type: Number,
      default: 0,
    },

    lastIp: {
      type: String,
      default: "",
    },

    loginAttempts: {
      type: Number,
      required: true,
      default: 0,
    },

    learningStats: {
      xp: {
        type: Number,
        default: 0,
      },

      level: {
        type: Number,
        default: 1,
      },

      streak: {
        current: {
          type: Number,
          default: 0,
        },

        longest: {
          type: Number,
          default: 0,
        },

        lastActivity: {
          type: Date,
        },
      },
    },

    achievementHistory: [
      {
        badgeId: Number,
        title: String,
        unlockedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    xpHistory: [
      {
        reason: String,

        xp: Number,

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Student", userSchema);
