import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema(
  {
    // ================= USER =================
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },

    // ================= PERSONAL =================
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    dob: { type: Date },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    // FIXED: location as nested object
    location: {
      city: String,
      state: String,
      country: String,
    },

    // ================= PROFESSIONAL =================
    profession: { type: String, required: true },
    company: String,
    experience: Number,
    industry: String,
    linkedin: String,

    // ================= EXPERTISE =================
    primarySkill: {
      type: [String],
      default: [],
    },
    category: String,

    // store comma-separated or array (we normalize in backend)
    languages: [String],

    skillExperience: Number,
    skillLevel: String,

    // ================= EDUCATION =================
    education: {
      degree: String,
      college: String,
      graduationYear: Number,
      cgpa: String,
    },

    certifications: [String],

    // ================= ABOUT =================
    headline: String,
    about: String,
    teachingStyle: String,

    // ================= AVAILABILITY =================
    availability: {
      availableDays: [String],
      preferredTime: String,
      startTime: String,
      endTime: String,
      timezone: {
        type: String,
        default: "Asia/Kolkata",
      },
      sessionDuration: Number,
    },

    // ================= PRICING =================
    pricing: {
      sessionTypes: {
        type: [String],
        default: [],
      },

      sessionPrice: {
        type: Number,
        required: true,
      },

      currency: {
        type: String,
        default: "INR",
      },

      freeTrial: {
        type: Boolean,
        default: false,
      },

      pricingNote: {
        type: String,
        default: "",
      },
    },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    averageRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    // ================= FILES =================
    profileImage: String,
    resume: String,
    governmentId: String,
    degreeCertificate: String,

    // ================= VERIFICATION =================
    agreement: { type: Boolean, default: false },

    verificationStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    accountStatus: {
      type: String,
      enum: ["Active", "Suspended"],
      default: "Active",
    },

    suspensionReason: {
      type: String,
      default: "",
    },

    suspendedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    suspendedAt: {
      type: Date,
      default: null,
    },

    isVerified: { type: Boolean, default: false },

    rejectionReason: {
      type: String,
      default: "",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Mentor", mentorSchema);
