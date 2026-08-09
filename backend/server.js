import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import path from "path";
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

dotenv.config();

const app = express();

// DB CONNECTION
connectDB();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

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



// SERVER
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
