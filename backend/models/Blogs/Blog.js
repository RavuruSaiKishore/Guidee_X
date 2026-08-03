import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    content: {
      type: String,
      required: true,
    },

    // ==========================================
    // MEDIA
    // ==========================================

    coverImage: {
      type: String,
      default: "",
    },

    // Optional image alt text for accessibility + SEO
    coverImageAlt: {
      type: String,
      default: "",
    },

    // ==========================================
    // CATEGORIZATION
    // ==========================================

    category: {
      type: String,
      required: true,
      enum: [
        "Career",
        "Technology",
        "Education",
        "Interview",
        "Programming",
        "Personal Growth",
        "Mentorship",
        "Industry Trends",
      ],
      index: true,
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    // ==========================================
    // CONTENT TYPE
    // ==========================================

    contentType: {
      type: String,
      enum: [
        "Article",
        "Tutorial",
        "Guide",
        "Interview Tips",
        "Career Advice",
        "News",
        "Case Study",
        "Success Story",
      ],
      default: "Article",
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    // ==========================================
    // AUTHOR
    // ==========================================

    author: {
      type: String,
      default: "Admin",
    },

    authorName: {
      type: String,
      default: "GuideX Team",
    },

    authorImage: {
      type: String,
      default: "",
    },

    authorBio: {
      type: String,
      default: "",
    },

    // ==========================================
    // PUBLISHING
    // ==========================================

    status: {
      type: String,
      enum: ["Draft", "Published", "Scheduled", "Archived"],
      default: "Draft",
      index: true,
    },

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    publishedAt: {
      type: Date,
    },

    scheduledAt: {
      type: Date,
    },

    // ENGAGEMENT
    views: {
      type: Number,
      default: 0,
    },

    bookmarks: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },

    shares: {
      type: Number,
      default: 0,
    },

    // ==========================================
    // READING INFORMATION
    // ==========================================

    readingTime: {
      type: Number,
      default: 1,
    },

    // ==========================================
    // SEO
    // ==========================================

    seoTitle: {
      type: String,
      maxlength: 60,
      default: "",
    },

    seoDescription: {
      type: String,
      maxlength: 160,
      default: "",
    },

    seoKeywords: [
      {
        type: String,
        trim: true,
      },
    ],

    // ==========================================
    // TABLE OF CONTENTS
    // ==========================================

    tableOfContents: [
      {
        title: String,
        id: String,
        level: {
          type: Number,
          default: 1,
        },
      },
    ],

    // ==========================================
    // RELATED BLOGS
    // ==========================================

    relatedBlogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],

    // ==========================================
    // COMMENTS
    // ==========================================

    commentsEnabled: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // FEATURED / TRENDING
    // ==========================================

    isTrending: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // ADMIN MANAGEMENT
    // ==========================================

   

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },

    lastEditedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// INDEXES
// ==========================================

blogSchema.index({
  title: "text",
  excerpt: "text",
  content: "text",
  tags: "text",
});

blogSchema.index({
  category: 1,
  status: 1,
});

blogSchema.index({
  featured: 1,
  status: 1,
});

blogSchema.index({
  createdAt: -1,
});

export default mongoose.model("Blog", blogSchema);
