import mongoose from "mongoose";

// ==========================================
// SUB-SCHEMAS
// ==========================================

// File Assets / Attachments Schema
const fileAssetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    publicId: { type: String, default: "" }, // For S3/Cloudinary tracking
    fileType: {
      type: String,
      enum: ["pdf", "zip", "doc", "code", "image", "other"],
      default: "pdf",
    },
    fileSize: { type: Number, default: 0 }, // in bytes
  },
  { _id: true }
);

// Structured Curriculum / Roadmap Modules Schema
const moduleSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    content: { type: String, default: "" }, // Rich text or Markdown
    videoUrl: { type: String, default: "", trim: true },
    durationInMinutes: { type: Number, default: 0 },
    isFreePreview: { type: Boolean, default: true },
  },
  { _id: true }
);

// ==========================================
// MAIN RESOURCE SCHEMA
// ==========================================

const resourceSchema = new mongoose.Schema(
  {
    // ------------------------------------------
    // IDENTIFICATION & SEO
    // ------------------------------------------
    title: {
      type: String,
      required: [true, "Resource title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    subtitle: {
      type: String,
      default: "",
      trim: true,
      maxlength: [250, "Subtitle cannot exceed 250 characters"],
    },
    description: {
      type: String,
      required: [true, "Resource description is required"],
      trim: true,
    },
    bodyContent: {
      type: String, // Rich Text / Markdown article body
      default: "",
    },

    // ------------------------------------------
    // TAXONOMY & CLASSIFICATION
    // ------------------------------------------
    category: {
      type: String,
      required: true,
      index: true,
      enum: [
        "Interview Preparation",
        "Coding Roadmaps",
        "Resume Templates",
        "Career Guidance",
        "Skill Development",
        "System Design",
      ],
    },
    subcategory: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    resourceType: {
      type: String,
      required: true,
      index: true,
      enum: [
        "PDF",
        "File",
        "External Link",
        "Interactive Guide",
        "Video Course",
        "Template Pack",
      ],
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      default: "Beginner",
      index: true,
    },
    estimatedDuration: {
      type: String,
      default: "",
      trim: true,
    },
    targetAudience: [
      {
        type: String,
        trim: true,
      },
    ],

    // ------------------------------------------
    // AUTHOR & CREDIBILITY
    // ------------------------------------------
    author: {
      name: { type: String, default: "GuideX Career Team", trim: true },
      role: { type: String, default: "Career & Learning Team", trim: true },
      avatar: { type: String, default: "" },
      bio: { type: String, default: "" },
    },

    // ------------------------------------------
    // MEDIA & ATTACHMENTS
    // ------------------------------------------
    thumbnail: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    bannerImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    attachments: [fileAssetSchema], // Multi-file attachments
    externalUrl: {
      type: String,
      default: "",
      trim: true,
    },
    primaryVideo: {
      provider: {
        type: String,
        enum: ["youtube", "vimeo", "cloudinary", "custom"],
        default: "youtube",
      },
      url: { type: String, default: "", trim: true },
      durationInSeconds: { type: Number, default: 0 },
    },

    // ------------------------------------------
    // STRUCTURED ROADMAP / CURRICULUM
    // ------------------------------------------
    modules: [moduleSectionSchema],

    // ------------------------------------------
    // EDUCATIONAL METADATA
    // ------------------------------------------
    whatYouWillLearn: [{ type: String, trim: true }],
    prerequisites: [{ type: String, trim: true }],
    keyTakeaways: [{ type: String, trim: true }],
    skills: [{ type: String, trim: true, index: true }],
    tags: [{ type: String, trim: true, lowercase: true, index: true }],

    // ------------------------------------------
    // ANALYTICS & SOCIAL METRICS
    // ------------------------------------------
    metrics: {
      viewsCount: { type: Number, default: 0, min: 0 },
      likesCount: { type: Number, default: 0, min: 0 },
      downloadsCount: { type: Number, default: 0, min: 0 },
      savesCount: { type: Number, default: 0, min: 0 },
      sharesCount: { type: Number, default: 0, min: 0 },
      averageRating: { type: Number, default: 0, min: 0, max: 5 },
      totalRatings: { type: Number, default: 0, min: 0 },
    },

    // User Relations
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    downloadedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    viewedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    ratings: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },
        score: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ------------------------------------------
    // PUBLISHING & ACCESS CONTROL
    // ------------------------------------------
    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Draft",
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },

    // ------------------------------------------
    // SEO & METADATA
    // ------------------------------------------
    seo: {
      title: { type: String, default: "", trim: true },
      description: { type: String, default: "", trim: true },
      keywords: [{ type: String, lowercase: true, trim: true }],
      ogImage: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound Search & Filter Indexes
resourceSchema.index({ title: "text", description: "text", tags: "text" });
resourceSchema.index({ category: 1, status: 1, isFeatured: -1 });

// ==========================================
// PRE-SAVE MIDDLEWARE
// ==========================================
resourceSchema.pre("save", function () {
  // Auto-generate slug if title changed and slug is missing
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // Set published timestamp automatically
  if (
    this.isModified("status") &&
    this.status === "Published" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
});

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;
