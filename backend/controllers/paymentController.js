import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import Booking from "../models/Bookings.js";
import createAuditLog from "../utils/createAuditLog.js";
import User from "../models/Student.js";
import Mentor from "../models/Mentor.js";

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Unable to create order",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,

      mentor,
      sessionType,
      sessionDate,
      endTime,
      startTime,
      duration,
      amount,
      notes,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment Verification Failed",
      });
    }

    // ==========================================
    // FINANCIAL SPLIT & COMMISSION CALCULATION
    // ==========================================
    const totalAmount = Number(amount); // e.g., 499
    const platformFee = 20; // Flat platform handling fee (₹20)
    const remainingAmount = totalAmount - platformFee;
    const adminCommission = Math.round(remainingAmount * 0.1); // 10% admin commission on remaining
    const mentorEarnings = remainingAmount - adminCommission; // Net money for the mentor

    const booking = await Booking.create({
      mentor,
      student: req.user.id,

      sessionType,
      sessionDate,

      startTime,
      endTime,

      duration,

      amount: totalAmount,
      currency: "INR",

      // Financial breakdown saved in DB
      platformFee,
      adminCommission,
      mentorEarnings,

      notes,

      paymentStatus: "Paid",
      bookingStatus: "Pending",

      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentSignature: razorpay_signature,
    });

    const student = await User.findById(req.user.id).select("-password");

    const mentorData = await Mentor.findById(mentor).select(
      "firstName lastName"
    );

    // Audit Logging System
    await createAuditLog({
      req,
      user: {
        ...student.toObject(),
        role: "Student",
      },
      action: "Payment Success",
      module: "Payment",
      description: `Successfully paid ₹${totalAmount} and booked a session with mentor ${mentorData.firstName} ${mentorData.lastName}. (Mentor Net: ₹${mentorEarnings}, Commission: ₹${adminCommission})`,
      targetId: booking._id,
      targetType: "Booking",
    });

    return res.status(200).json({
      success: true,
      message: "Booking Created Successfully",
      booking,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Verification Failed",
    });
  }
};