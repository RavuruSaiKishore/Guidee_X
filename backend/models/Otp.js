import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    otp: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // auto delete after expiry (Mongo TTL)
    },

    userData: {
      firstName: String,
      lastName: String,
      companyName: String,
      password: String,
      role: {
        type: String,
        default: "student",
      },
      phone: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Otp", otpSchema);
