import mongoose from "mongoose";

const blogShareSchema = new mongoose.Schema(
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
      default: null,
    },

    platform: {
      type: String,
      enum: [
        "copy",
        "whatsapp",
        "facebook",
        "twitter",
        "linkedin",
        "telegram",
        "other",
      ],
      default: "copy",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("BlogShare", blogShareSchema);
