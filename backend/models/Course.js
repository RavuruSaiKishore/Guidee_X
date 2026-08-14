import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String, required: true },
  duration: { type: Number, default: 0 },
  isPreviewFree: { type: Boolean, default: false },
  resources: [
    {
      title: { type: String },
      fileUrl: { type: String },
    },
  ],
  type: {
    type: String,
    enum: ["video", "quiz", "assignment", "text"],
    default: "video",
  },
});

// ==========================================
// 1. NEW SUB-SCHEMAS FOR ASSIGNMENTS & CODING
// ==========================================
const mcqQuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }], // 4 options
  correctOptionIndex: { type: Number, required: true, min: 0, max: 3 },
  explanation: { type: String, default: "" },
});

const moduleAssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true, default: "Module Assessment" },
  description: {
    type: String,
    default: "10 Multiple Choice Questions to test module proficiency.",
  },
  questions: [mcqQuestionSchema], // Enforces up to 10 questions
});

const moduleCodingProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  problemSlug: { type: String, required: true }, // Links directly to PracticeArena
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Medium",
  },
  description: { type: String, required: true },
});

// ==========================================
// 2. MODULE / SECTION SCHEMA (UPDATED)
// ==========================================
const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },

  // Notes field for each module
  notes: [
    {
      title: { type: String },
      fileUrl: { type: String },
    },
  ],

  lessons: [lessonSchema],

  // 🔑 Added module-level assignment (10 MCQs) and coding problem integration
  assignment: moduleAssignmentSchema,
  codingProblem: moduleCodingProblemSchema,
});

// ==========================================
// 3. COURSE REVIEW SCHEMA
// ==========================================
const reviewSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

// ==========================================
// 4. MAIN COURSE SCHEMA
// ==========================================
const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    previewVideoUrl: { type: String },
    category: { type: String, required: true, index: true },
    subCategory: { type: String },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      default: "Beginner",
    },
    language: { type: String, default: "English" },

    price: { type: Number, default: 0, min: 0 },
    compareAtPrice: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },

    instructor: {
      type: String,
      default: "appwat",
    },

    modules: [moduleSchema],

    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalStudentsEnrolled: { type: Number, default: 0 },

    reviews: [reviewSchema],
  },
  { timestamps: true }
);

courseSchema.index({ title: "text", description: "text", category: "text" });

export const Course = mongoose.model("Course", courseSchema);

// ==========================================
// 5. ENROLLMENT & PROGRESS SCHEMA
// ==========================================
const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId }],
    progressPercentage: { type: Number, default: 0 },

    isCompleted: { type: Boolean, default: false },
    certificateIssuedAt: { type: Date },
    lastAccessedLesson: { type: mongoose.Schema.Types.ObjectId },
    assessmentSubmissions: [
      {
        moduleIndex: { type: Number, required: true },
        score: { type: Number, required: true },
        totalQuestions: { type: Number, required: true },
        submittedAt: { type: Date, default: Date.now },
      },
    ],
    solvedCodingProblems: [{ type: String }], // Stores solved problem slugs e.g., ["two-sum"]

    paymentStatus: {
      type: String,
      enum: ["free", "pending", "paid", "refunded"],
      default: "free",
    },
    amountPaid: { type: Number, default: 0 },

    // Razorpay Payment Tracking Fields
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
