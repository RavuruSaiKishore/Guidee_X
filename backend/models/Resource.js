import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // NEW
    subtitle: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Interview Preparation",
        "Coding Roadmaps",
        "Resume Templates",
        "Career Guidance",
        "Skill Development",
      ],
    },

    resourceType: {
      type: String,
      required: true,
      enum: ["PDF", "File", "External Link"],
    },


    // NEW
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    // NEW
    estimatedDuration: {
      type: String,
      default: "",
      trim: true,
    },

    // NEW
    targetAudience: [
      {
        type: String,
        trim: true,
      },
    ],

    
    // NEW
    authorName: {
      type: String,
      default: "GuideX Career Team",
      trim: true,
    },

    // NEW
    authorRole: {
      type: String,
      default: "Career & Learning Team",
      trim: true,
    },

    // ==========================================
    // RESOURCE FILE
    // ==========================================

    fileUrl: {
      type: String,
      default: "",
    },

    // ==========================================
    // EXTERNAL RESOURCE LINK
    // ==========================================

    externalUrl: {
      type: String,
      default: "",
    },

    // ==========================================
    // VIDEO RESOURCE
    // ==========================================

    // NEW
    videoUrl: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // FILE INFORMATION
    // ==========================================

    fileName: {
      type: String,
      default: "",
    },

    fileSize: {
      type: Number,
      default: 0,
    },

    // ==========================================
    // THUMBNAIL / COVER IMAGE
    // ==========================================

    thumbnail: {
      type: String,
      default: "",
    },

    // ==========================================
    // WHAT YOU WILL LEARN
    // ==========================================

    // NEW
    whatYouWillLearn: [
      {
        type: String,
        trim: true,
      },
    ],

    // ==========================================
    // PREREQUISITES
    // ==========================================

    // NEW
    prerequisites: [
      {
        type: String,
        trim: true,
      },
    ],

    // ==========================================
    // KEY TAKEAWAYS
    // ==========================================

    // NEW
    keyTakeaways: [
      {
        type: String,
        trim: true,
      },
    ],

    // ==========================================
    // SKILLS COVERED
    // ==========================================

    // NEW
    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    // ==========================================
    // SEARCH TAGS
    // ==========================================

    // NEW
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    // ==========================================
    // FEATURED RESOURCE
    // ==========================================

    // NEW
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // STATUS
    // ==========================================

    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },

    // ==========================================
    // ADMIN WHO CREATED RESOURCE
    // ==========================================

    createdBy: {
      type: String,
      default: "Admin",
    },

    // ==========================================
    // RESOURCE VIEWS
    // ==========================================

    views: {
      type: Number,
      default: 0,
    },

    // ==========================================
    // RESOURCE LIKES
    // ==========================================

    likes: {
      type: Number,
      default: 0,
    },

    // ==========================================
    // STUDENTS WHO LIKED RESOURCE
    // ==========================================

    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],

    // ==========================================
    // RESOURCE DOWNLOADS
    // ==========================================

    downloads: {
      type: Number,
      default: 0,
    },

    // ==========================================
    // STUDENTS WHO DOWNLOADED RESOURCE
    // ==========================================

    downloadedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],

    // ==========================================
    // SEO INFORMATION
    // ==========================================

    // NEW
    seoTitle: {
      type: String,
      default: "",
      trim: true,
    },

    // NEW
    seoDescription: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;
