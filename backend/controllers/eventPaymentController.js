import crypto from "crypto";
import axios from "axios";

import razorpay from "../config/razorpay.js";

import Event from "../models/Event.js";
import EventRegistration from "../models/EventRegistration.js";

/*
=====================================================
CREATE RAZORPAY ORDER
=====================================================
*/

export const createEventOrder = async (req, res) => {
  try {
    const { eventId } = req.params;

    const studentId = req.user.id;

    // FIND EVENT

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,

        message: "Event not found",
      });
    }

    // EVENT STATUS CHECK

    if (event.status !== "Upcoming") {
      return res.status(400).json({
        success: false,

        message: "Registration is not available",
      });
    }

    // DEADLINE CHECK

    if (
      event.registrationDeadline &&
      new Date() >= new Date(event.registrationDeadline)
    ) {
      return res.status(400).json({
        success: false,

        message: "Registration deadline passed",
      });
    }

    // CHECK EXISTING REGISTRATION

    const existingRegistration = await EventRegistration.findOne({
      event: eventId,

      student: studentId,
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,

        message: "You are already registered",
      });
    }

    // CREATE RAZORPAY ORDER

    const options = {
      amount: event.price * 100,

      currency: event.currency || "INR",

      receipt: `event_${event._id}_${studentId}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,

      message: "Order created successfully",

      order,

      key: process.env.RAZORPAY_KEY_ID,

      event: {
        id: event._id,

        title: event.title,

        price: event.price,
      },
    });
  } catch (error) {
    console.log("Create Order Error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to create payment order",

      error: error.message,
    });
  }
};

/*
=====================================================
VERIFY PAYMENT
=====================================================
*/

export const verifyEventPayment = async (req, res) => {
  try {
    const {
      eventId,

      razorpay_order_id,

      razorpay_payment_id,

      razorpay_signature,
    } = req.body;

    const studentId = req.user.id;

    // FIND EVENT

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,

        message: "Event not found",
      });
    }

    // VERIFY SIGNATURE

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,

        message: "Invalid payment verification",
      });
    }

    // CHECK PAYMENT STATUS

    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== "captured") {
      return res.status(400).json({
        success: false,

        message: "Payment not completed",
      });
    }

    // CREATE REGISTRATION

    const registration = await EventRegistration.create({
      event: eventId,

      student: studentId,

      status: "Registered",

      payment: {
        amount: event.price,

        currency: event.currency,

        razorpayOrderId: razorpay_order_id,

        razorpayPaymentId: razorpay_payment_id,

        razorpaySignature: razorpay_signature,

        paidAt: new Date(),
      },
    });

    await registration.populate([
      {
        path: "event",
      },

      {
        path: "student",
        select: "firstName lastName email profileImage",
      },
    ]);

    // SEND EMAIL

    try {
      await axios.post(
        "https://api.brevo.com/v3/smtp/email",

        {
          sender: {
            name: "GuideX",

            email: "ravurusaikishore@gmail.com",
          },

          to: [
            {
              email: registration.student.email,

              name: `${registration.student.firstName} ${registration.student.lastName}`,
            },
          ],

          subject: `Registration Confirmed - ${event.title}`,

          htmlContent: `

<div style="
font-family:Arial;
padding:30px;
background:#ffffff;
border:1px solid #ddd;
border-radius:10px;
">


<h1 style="color:#4f46e5">
GuideX
</h1>


<h2>
Payment Successful 🎉
</h2>


<p>
Hello 
<strong>
${registration.student.firstName}
</strong>
</p>


<p>
Your registration has been confirmed.
</p>



<h3>
Event Details
</h3>



<p>
<b>Event:</b>
${event.title}
</p>


<p>
<b>Speaker:</b>
${event.speaker}
</p>


<p>
<b>Date:</b>
${new Date(event.startDateTime).toLocaleString()}
</p>



<p>
Thank you for choosing GuideX.
</p>



<p>
Regards,
<br/>
GuideX Team
</p>


</div>

`,
        },

        {
          headers: {
            "api-key": process.env.BREVO_API_KEY,

            "content-type": "application/json",
          },
        }
      );
    } catch (emailError) {
      console.log("Email Error:", emailError.message);

      // Payment successful even if email fails
    }

    return res.status(201).json({
      success: true,

      message: "Payment successful and registration completed",

      registration,
    });
  } catch (error) {
    console.log("Verify Payment Error:", error);

    return res.status(500).json({
      success: false,

      message: "Payment verification failed",

      error: error.message,
    });
  }
};
