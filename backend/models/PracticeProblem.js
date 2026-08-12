import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  isHidden: { type: Boolean, default: false }, // Hidden test cases for evaluation
});

const practiceProblemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    category: {
      type: String,
      enum: ["DSA", "Full-Stack", "Frontend", "Backend"],
      required: true,
    },
    description: { type: String, required: true }, // Markdown formatted description
    starterCode: {
      python: { type: String, default: "" },
      javascript: { type: String, default: "" },
      cpp: { type: String, default: "" },
    },
    testCases: [testCaseSchema],
    hints: [{ type: String }],
    solvedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  },
  { timestamps: true }
);

export default mongoose.model("PracticeProblem", practiceProblemSchema);
