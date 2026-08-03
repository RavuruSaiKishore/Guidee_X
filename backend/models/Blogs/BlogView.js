import mongoose from "mongoose";

const blogViewSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

blogViewSchema.index(
  {
    blog: 1,
    student: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model("BlogView", blogViewSchema);
