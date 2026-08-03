import mongoose from "mongoose";

const blogLikeSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", 
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// One user can like a blog only once
blogLikeSchema.index(
  {
    blog: 1,
    user: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model("BlogLike", blogLikeSchema);
