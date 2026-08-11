import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import { Course, Enrollment } from "../models/Course.js";
import axios from "axios";

// @desc    Create Razorpay Order for Course Purchase
// @route   POST /api/payment/create-order
export const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    if (
      course.price === undefined ||
      course.price === null ||
      isNaN(course.price)
    ) {
      return res.status(400).json({
        success: false,
        message: "Course price is invalid or missing",
      });
    }

    // If course is free, no payment order needed
    if (course.price <= 0) {
      return res.status(400).json({
        success: false,
        message: "This course is free. No order required.",
      });
    }

    // Check if already enrolled and paid
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });
    if (existingEnrollment && existingEnrollment.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled and paid for this course",
      });
    }

    const shortReceipt = `crs_${Date.now().toString().slice(-8)}`;

    const options = {
      amount: Math.round(course.price * 100), // convert to paise
      currency: "INR",
      receipt: shortReceipt,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      order,
      userName: req.user.name || req.user.firstName || "",
      userEmail: req.user.email || "",
    });
  } catch (err) {
    console.error("Course Payment Order Error:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to create payment order",
    });
  }
};

// @desc    Verify Razorpay Payment & Complete Course Enrollment
// @route   POST /api/payment/verify-payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      courseId,
    } = req.body;

    const studentId = req.user.id;

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_SECRET || process.env.RAZORPAY_KEY_SECRET
      )
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment Verification Failed",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const totalAmount = Number(course.price);

    let enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (enrollment) {
      if (enrollment.paymentStatus === "paid") {
        return res.status(400).json({
          success: false,
          message: "You are already enrolled in this course",
        });
      }

      // Update existing enrollment if previously pending/unpaid
      enrollment.paymentStatus = "paid";
      enrollment.amountPaid = totalAmount;
      enrollment.razorpayOrderId = razorpay_order_id;
      enrollment.razorpayPaymentId = razorpay_payment_id;
      enrollment.razorpaySignature = razorpay_signature;
      await enrollment.save();
    } else {
      // Create new paid enrollment record
      enrollment = await Enrollment.create({
        student: studentId,
        course: courseId,
        paymentStatus: "paid",
        amountPaid: totalAmount,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        completedLessons: [],
        progressPercentage: 0,
      });

      // Increment total students enrolled counter on Course
      course.totalStudentsEnrolled = (course.totalStudentsEnrolled || 0) + 1;
      await course.save();
    }

    // 💡 FIXED: Explicitly map model: "Student" to match your export model name
    await enrollment.populate([
      { path: "course" },
      {
        path: "student",
        model: "Student",
        select: "name email firstName lastName profileImage",
      },
    ]);

    // Send Brevo Email Confirmation for Course Enrollment
    try {
      const studentName =
        enrollment.student?.name || enrollment.student?.firstName || "Student";
      const studentEmail = enrollment.student?.email;

      if (studentEmail) {
        await axios.post(
          "https://api.brevo.com/v3/smtp/email",
          {
            sender: { name: "GuideX", email: "ravurusaikishore@gmail.com" },
            to: [{ email: studentEmail, name: studentName }],
            subject: `Enrollment Confirmed - ${enrollment.course.title}`,
            htmlContent: `
              <div style="max-width:600px;margin:30px auto;padding:30px;font-family:Arial,sans-serif;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;">
                <h2 style="color:#111827;">Course Enrollment Successful 🎉</h2>
                <p>Hello <strong>${studentName}</strong>,</p>
                <p>Your payment of <strong>₹${totalAmount}</strong> was successful. You are officially enrolled!</p>
                <p><strong>Course:</strong> ${enrollment.course.title}</p>
                <p>You can now access your learning modules, videos, and PDF notes directly from your dashboard.</p>
                <p>Regards,<br><strong>GuideX Team</strong></p>
              </div>
            `,
          },
          {
            headers: {
              accept: "application/json",
              "api-key": process.env.BREVO_API_KEY,
              "content-type": "application/json",
            },
          }
        );
      }
    } catch (emailErr) {
      console.error("Brevo email dispatch failed:", emailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Payment Verified & Course Enrollment Completed Successfully",
      enrollment,
    });
  } catch (err) {
    console.error("Verify Course Payment Error:", err);
    return res.status(500).json({
      success: false,
      message: "Verification Failed",
    });
  }
};
