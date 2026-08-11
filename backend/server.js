import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import helmet from "helmet";
import { validateEnv } from "./config/validateEnv.js";
import compression from "compression";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import notificacationRoutes from "./routes/notificationRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import blogRoutes from "./routes/blogInteractionRoutes.js";
import FAQ from "./routes/faqRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import eventRegistrationRoutes from "./routes/eventRegistrationRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import rescheduleRoutes from "./routes/rescheduleRoutes.js";
import mentorStudentRoutes from "./routes/mentorStudentRoutes.js";
import mentorReviewRoutes from "./routes/mentorReviewRoutes.js";
import mentorContactRoutes from "./routes/mentorContactRoutes.js";
import eventPaymentRoutes from "./routes/eventPaymentRoutes.js";
import disputeRoutes from "./routes/disputeRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();
validateEnv();

const app = express();

// ==========================================
// PERFORMANCE & SECURITY MIDDLEWARE
// ==========================================
app.use(compression());

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://checkout.razorpay.com",
          "https://accounts.google.com",
        ],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://res.cloudinary.com",
          "https://*.googleusercontent.com",
        ],
        connectSrc: [
          "'self'",
          "http://localhost:8080",
          "https://guidee-xbackend.onrender.com",
          "https://api.razorpay.com",
          "https://accounts.google.com",
        ],
        frameSrc: [
          "'self'",
          "https://api.razorpay.com",
          "https://checkout.razorpay.com",
          "https://accounts.google.com",
        ],
      },
    },
  })
);

// DB CONNECTION
connectDB();

// ==========================================
// CORS HARDENING CONFIGURATION
// ==========================================
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS: Unauthorized origin"));
      }
    },
    credentials: true,
  })
);

// MIDDLEWARE
app.use(express.json());
app.use(cookieParser());

// ==========================================
// NoSQL INJECTION SANITIZATION
// ==========================================
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.headers) mongoSanitize.sanitize(req.headers);
  next();
});

// NOTE: CSRF middleware completely removed here!

app.use("/uploads", express.static("uploads"));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/meeting", meetingRoutes);
app.use("/api/notification", notificacationRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/blog-interactions", blogRoutes);
app.use("/api/faq", FAQ);
app.use("/api/events", eventRoutes);
app.use("/api/event-registration", eventRegistrationRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/reschedule", rescheduleRoutes);
app.use("/api/mentorStudent", mentorStudentRoutes);
app.use("/api/mentorReview", mentorReviewRoutes);
app.use("/api/mentor-contact", mentorContactRoutes);
app.use("/api/event-payment", eventPaymentRoutes);
app.use("/api/disputes", disputeRoutes);
app.use("/api/chat", chatRoutes);

// SERVER
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
