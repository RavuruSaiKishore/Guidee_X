import mongoose from "mongoose";

const blogCommentSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogComment",
      default: null,
    },

    likes: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Visible", "Hidden", "Deleted"],
      default: "Visible",
    },
  },
  {
    timestamps: true,
  }
);

blogCommentSchema.index({
  blog: 1,
  createdAt: -1,
});

export default mongoose.model("BlogComment", blogCommentSchema);
