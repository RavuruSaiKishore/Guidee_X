import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    requiredSessions: {
      type: Number,
      required: true,
      min: 1,
    },

    color: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

badgeSchema.index({ requiredSessions: 1 });

export default mongoose.model("Badge", badgeSchema);
