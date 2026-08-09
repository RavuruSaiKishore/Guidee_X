import mongoose from "mongoose";

// =====================================================
// 1. SUB-SCHEMA: GUEST SPEAKERS / FACULTY
// =====================================================
const speakerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Speaker name is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Speaker title/designation is required"],
      trim: true,
    }, // e.g., "Senior AI Researcher", "Visiting Professor"
    organization: {
      type: String,
      required: [true, "Company or University is required"],
      trim: true,
    }, // e.g., "Google", "MIT", "Stanford"
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    profileImage: {
      type: String,
      default: "",
      trim: true,
    },
    linkedinUrl: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: true }
);

// =====================================================
// 2. MAIN SCHEMA: EVENT
// =====================================================
const eventSchema = new mongoose.Schema(
  {
    // --- BASIC INFORMATION & DOMAIN ---
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    shortSummary: {
      type: String,
      maxlength: [300, "Summary cannot exceed 300 characters"],
      trim: true,
    },
    description: {
      type: String, // Rich text or Markdown content
      required: [true, "Event description is required"],
    },
    domain: {
      type: String,
      required: [true, "Domain field is required"],
      enum: [
        "Software Engineering",
        "Data Science & AI",
        "Product Management",
        "UI/UX Design",
        "Cybersecurity",
        "DevOps & Cloud",
        "Career Guidance & Resume",
        "Study Abroad",
        "Research & Academia",
        "Other",
      ],
      index: true,
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    bannerImage: {
      type: String,
      default: "",
    },

    // --- ADMIN HOST & SPEAKERS ---
    createdByAdmin: {
      type: String,
      default: "Guideex Admin",
      trim: true,
    },
    speakers: {
      type: [speakerSchema],
      validate: {
        validator: function (val) {
          return val && val.length > 0;
        },
        message: "At least one guest speaker is required.",
      },
    },

    // --- TARGET AUDIENCE & PREREQUISITES ---
    targetAudience: {
      experienceLevel: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
        default: "All Levels",
      },
      prerequisites: [{ type: String }],
    },

    // --- SESSION DETAILS & MEETING LINKS ---
    eventType: {
      type: String,
      enum: ["Guest Lecture", "Masterclass", "Panel Discussion", "Workshop"],
      default: "Guest Lecture",
    },
    meetingUrl: {
      type: String,
      default: "", // Virtual room link (Zoom, Google Meet, etc.)
    },
    recordingUrl: {
      type: String,
      default: "", // Post-event session recording
    },

    // --- SCHEDULE & TIMINGS ---
    startDateTime: {
      type: Date,
      required: [true, "Start time is required"],
      index: true,
    },
    endDateTime: {
      type: Date,
      required: [true, "End time is required"],
      validate: {
        validator: function (value) {
          return value > this.startDateTime;
        },
        message: "End time must be strictly after the start time.",
      },
    },
    registrationDeadline: {
      type: Date,
      required: [true, "Registration deadline is required"],
    },

    // --- CAPACITY & TICKETING ---
    maxSeats: {
      type: Number,
      required: true,
      default: 100,
    },
    registeredStudentsCount: {
      type: Number,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    ticketPrice: {
      type: Number,
      default: 0,
    },

    // --- STATUS 1: DATABASE PUBLICATION CONTROL ---
    status: {
      type: String,
      enum: ["Draft", "Published", "Cancelled"],
      default: "Draft",
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Auto-creates createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// =====================================================
// 3. PERFORMANCE INDEXES
// =====================================================
eventSchema.index({ domain: 1, startDateTime: 1 });
eventSchema.index({ title: "text", description: "text", tags: "text" });

// =====================================================
// 4. AUTO-GENERATE SLUG PRE-SAVE HOOK
// =====================================================
eventSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove non-word chars
      .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with hyphen
      .replace(/^-+|-+$/g, ""); // Trim trailing hyphens
  }
});

// =====================================================
// 5. STATUS 2: DYNAMIC EVENT STATE (VIRTUAL)
// =====================================================
eventSchema.virtual("computedStatus").get(function () {
  const now = new Date();

  // Explicit Administrative Overrides
  if (this.status === "Cancelled") return "Cancelled";
  if (this.status === "Draft") return "Draft";

  // Dynamic Time & Capacity Calculations
  if (now > this.endDateTime) return "Completed";
  if (now >= this.startDateTime && now <= this.endDateTime) return "Live Now";
  if (now > this.registrationDeadline) return "Registration Closed";
  if (this.registeredStudentsCount >= this.maxSeats) return "Housefull";

  return "Upcoming";
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
