import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import Event from "../models/Event.js";
import EventRegistration from "../models/EventRegistration.js";
import User from "../models/Student.js";
import axios from "axios";
import createAuditLog from "../utils/createAuditLog.js";

export const createEventOrder = async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    if (!event.isPaid || event.ticketPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "This event is free. No order required.",
      });
    }

    // Shorten receipt to stay well under 40 characters
    const shortReceipt = `evt_${Date.now().toString().slice(-8)}`;

    const options = {
      amount: Math.round(event.ticketPrice * 100), // convert to paise
      currency: "INR",
      receipt: shortReceipt,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.error("Event Payment Order Error:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to create payment order",
    });
  }
};

// @desc    Verify Razorpay Payment & Complete Event Registration
// @route   POST /api/event-payment/verify
export const verifyEventPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      eventId,
    } = req.body;

    const studentId = req.user.id;

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

    const event = await Event.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    if (event.registeredStudentsCount >= event.maxSeats) {
      return res
        .status(400)
        .json({ success: false, message: "Housefull! Maximum seats reached." });
    }

    let registration = await EventRegistration.findOne({
      event: eventId,
      student: studentId,
    });

    const assignedMeetingLink = event.meetingUrl || "";

    if (registration) {
      if (registration.status === "Registered") {
        return res
          .status(400)
          .json({
            success: false,
            message: "You are already registered for this event",
          });
      }

      if (registration.status === "Cancelled") {
        registration.status = "Registered";
        registration.registeredAt = new Date();
        registration.paymentStatus = "Paid";
        registration.paymentId = razorpay_payment_id;
        registration.orderId = razorpay_order_id;
        registration.paymentSignature = razorpay_signature;
        registration.amountPaid = event.ticketPrice;
        registration.meetingLink = assignedMeetingLink;
        registration.attended = false;
        await registration.save();

        event.registeredStudentsCount =
          (event.registeredStudentsCount || 0) + 1;
        await event.save();

        await registration.populate([
          { path: "event" },
          {
            path: "student",
            select: "name email firstName lastName profileImage",
          },
        ]);

        return res.status(200).json({
          success: true,
          message: "Successfully registered again",
          registration,
        });
      }
    }

    registration = await EventRegistration.create({
      event: eventId,
      student: studentId,
      status: "Registered",
      registeredAt: new Date(),
      paymentStatus: "Paid",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentSignature: razorpay_signature,
      amountPaid: event.ticketPrice,
      meetingLink: assignedMeetingLink,
    });

    event.registeredStudentsCount = (event.registeredStudentsCount || 0) + 1;
    await event.save();

    await registration.populate([
      { path: "event" },
      { path: "student", select: "name email firstName lastName profileImage" },
    ]);

    // Send Brevo Email Confirmation
    try {
      const leadSpeaker = registration.event.speakers?.[0] || {};
      const studentName =
        registration.student.name ||
        registration.student.firstName ||
        "Student";

      await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: { name: "GuideX", email: "ravurusaikishore@gmail.com" },
          to: [{ email: registration.student.email, name: studentName }],
          subject: `Registration Confirmed - ${registration.event.title}`,
          htmlContent: `
            <div style="max-width:600px;margin:30px auto;padding:30px;font-family:Arial,sans-serif;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;">
              <h2 style="color:#111827;">Event Registration Successful 🎉</h2>
              <p>Hello <strong>${studentName}</strong>,</p>
              <p>Your payment of <strong>₹${
                event.ticketPrice
              }</strong> was successful. You are officially registered!</p>
              <p><strong>Event:</strong> ${registration.event.title}</p>
              <p><strong>Speaker:</strong> ${leadSpeaker.name || "N/A"}</p>
              <p><strong>Starts:</strong> ${new Date(
                registration.event.startDateTime
              ).toLocaleString()}</p>
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
    } catch (emailErr) {
      console.error("Brevo email dispatch failed:", emailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Payment Verified & Booking Created Successfully",
      registration,
    });
  } catch (err) {
    console.error("Verify Event Payment Error:", err);
    return res.status(500).json({
      success: false,
      message: "Verification Failed",
    });
  }
};
