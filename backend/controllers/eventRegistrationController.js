import mongoose from "mongoose";
import Event from "../models/Event.js";
import EventRegistration from "../models/EventRegistration.js";
import axios from "axios";



export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const studentId = req.user.id;

    // ==========================================
    // FIND EVENT
    // ==========================================

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // ==========================================
    // CURRENT TIME
    // ==========================================

    const now = new Date();

    // ==========================================
    // CHECK EVENT STATUS
    // ==========================================

    if (event.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "This event has been cancelled",
      });
    }

    if (event.status === "Live") {
      return res.status(400).json({
        success: false,
        message: "Registration is closed because the event is live",
      });
    }

    if (event.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Registration is closed because the event has ended",
      });
    }

    // ==========================================
    // CHECK REGISTRATION DEADLINE
    // ==========================================

    if (
      event.registrationDeadline &&
      now >= new Date(event.registrationDeadline)
    ) {
      return res.status(400).json({
        success: false,
        message: "Registration deadline has passed",
      });
    }

    // ==========================================
    // FIND EXISTING REGISTRATION
    // ==========================================

    let registration = await EventRegistration.findOne({
      event: eventId,
      student: studentId,
    });

    // ==========================================
    // EXISTING REGISTRATION
    // ==========================================

    if (registration) {
      // ------------------------------------------
      // ALREADY REGISTERED
      // ------------------------------------------

      if (registration.status === "Registered") {
        return res.status(400).json({
          success: false,
          message: "You are already registered for this event",
          registration,
        });
      }

      // ------------------------------------------
      // RE-REGISTER CANCELLED REGISTRATION
      // ------------------------------------------

      if (registration.status === "Cancelled") {
        registration.status = "Registered";

        registration.registeredAt = new Date();

        registration.attended = false;

        registration.joinedAt = null;

        // Keep existing meetingLink if you want
        // Or reset it:
        // registration.meetingLink = "";

        await registration.save();

        await registration.populate([
          {
            path: "event",
          },
          {
            path: "student",
            select: "name email profileImage",
          },
        ]);

        return res.status(200).json({
          success: true,
          message: "You have successfully registered for the event again",
          registration,
          isReRegistered: true,
        });
      }
    }

    // ==========================================
    // CREATE NEW REGISTRATION
    // ==========================================

    registration = await EventRegistration.create({
      event: eventId,
      student: studentId,
      status: "Registered",
      registeredAt: new Date(),
    });

    await registration.populate([
      {
        path: "event",
      },
      {
        path: "student",
        select: "name email profileImage",
      },
    ]);

    // ==========================
    // SEND EMAIL USING BREVO API
    // ==========================

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "GuideX",
          email: "ravurusaikishore@gmail.com",
        },
        to: [
          {
            email: registration.student.email,
            name: registration.student.name,
          },
        ],
        subject: `Registration Confirmed - ${registration.event.title}`,

        textContent: `Hello ${registration.student.name},

Congratulations! Your registration for the event has been confirmed.

Event Details

Title: ${registration.event.title}
Speaker: ${registration.event.speaker}
Date: ${new Date(registration.event.startDateTime).toLocaleString()}
End Time: ${new Date(registration.event.endDateTime).toLocaleString()}

We will share the meeting link with you before the event starts.

Thank you for choosing GuideX!

Regards,
GuideX Team`,

        htmlContent: `
    <div style="
      max-width:600px;
      margin:30px auto;
      padding:30px;
      font-family:Arial,sans-serif;
      background:#ffffff;
      border-radius:12px;
      border:1px solid #e5e7eb;
    ">

      <div style="text-align:center;">
        <h1 style="color:#4f46e5;margin-bottom:5px;">
          GuideX
        </h1>

        <p style="color:#6b7280;">
          Learn. Connect. Grow.
        </p>
      </div>

      <h2 style="color:#111827;">
        Event Registration Successful 🎉
      </h2>

      <p>
        Hello
        <strong>${registration.student.name}</strong>,
      </p>

      <p>
        Congratulations! You have successfully registered for the following event.
      </p>

      <table
        style="
          width:100%;
          border-collapse:collapse;
          margin-top:20px;
        "
      >

        <tr>
          <td style="padding:10px;font-weight:bold;">
            Event
          </td>

          <td style="padding:10px;">
            ${registration.event.title}
          </td>
        </tr>

        <tr style="background:#f9fafb;">
          <td style="padding:10px;font-weight:bold;">
            Speaker
          </td>

          <td style="padding:10px;">
            ${registration.event.speaker}
          </td>
        </tr>

        <tr>
          <td style="padding:10px;font-weight:bold;">
            Role
          </td>

          <td style="padding:10px;">
            ${registration.event.speakerRole || "N/A"}
          </td>
        </tr>

        <tr style="background:#f9fafb;">
          <td style="padding:10px;font-weight:bold;">
            Company
          </td>

          <td style="padding:10px;">
            ${registration.event.speakerCompany || "N/A"}
          </td>
        </tr>

        <tr>
          <td style="padding:10px;font-weight:bold;">
            Starts
          </td>

          <td style="padding:10px;">
            ${new Date(registration.event.startDateTime).toLocaleString()}
          </td>
        </tr>

        <tr style="background:#f9fafb;">
          <td style="padding:10px;font-weight:bold;">
            Ends
          </td>

          <td style="padding:10px;">
            ${new Date(registration.event.endDateTime).toLocaleString()}
          </td>
        </tr>

      </table>

      <div style="
        background:#eef4ff;
        border-left:4px solid #4f46e5;
        padding:15px;
        margin-top:25px;
        border-radius:6px;
      ">
        <strong>Meeting Link</strong>

        <p style="margin-top:8px;">
          The meeting link will be shared with you before the event begins.
        </p>
      </div>

      <p style="margin-top:25px;">
        We look forward to seeing you at the event.
      </p>

      <p>
        Regards,<br>
        <strong>GuideX Team</strong>
      </p>

      <hr>

      <div style="text-align:center;">
        <small>
          © ${new Date().getFullYear()} GuideX
        </small>
      </div>

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

    if (response.status !== 201) {
      return res.status(500).json({
        success: false,
        message: "Failed to send registration confirmation email",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Successfully registered for the event",
      registration,
      isReRegistered: false,
    });
  } catch (error) {
    console.error("Register Event Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to register for event",
      error: error.message,
    });
  }
};

export const getMyRegisteredEvents = async (req, res) => {
  try {
    const studentId = req.user.id;

    const registrations = await EventRegistration.find({
      student: studentId,
      status: "Registered",
    })
      .populate("event")
      .sort({ registeredAt: -1 });

    res.status(200).json({
      success: true,
      registrations,
    });
  } catch (error) {
    console.error("Get Registered Events Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch registered events",
      error: error.message,
    });
  }
};

export const getMyEventRegistrations = async (req, res) => {
  try {
    const studentId = req.user.id;

    const registrations = await EventRegistration.find({
      student: studentId,
    })
      .populate({
        path: "event",
        select: `
          title
          description
          bannerImage
          speaker
          speakerRole
          speakerCompany
          speakerBio
          speakerExperience
          startDateTime
          endDateTime
          registrationDeadline
          meetingLink
          status
          createdAt
          updatedAt
        `,
      })
      .sort({
        registeredAt: -1,
      })
      .lean();

    // =====================================================
    // FORMAT RESPONSE
    // =====================================================

    const formattedRegistrations = registrations.map((registration) => {
      const event = registration.event;

      return {
        _id: registration._id,

        registrationId: registration._id,

        status: registration.status,

        attended: registration.attended || false,

        joinedAt: registration.joinedAt || null,

        registeredAt: registration.registeredAt,

        meetingLink: registration.meetingLink || null,

        event: event
          ? {
              _id: event._id,

              title: event.title,

              description: event.description,

              bannerImage: event.bannerImage,

              speaker: event.speaker,

              speakerRole: event.speakerRole,

              speakerCompany: event.speakerCompany,

              speakerBio: event.speakerBio,

              speakerExperience: event.speakerExperience,

              startDateTime: event.startDateTime,

              endDateTime: event.endDateTime,

              registrationDeadline: event.registrationDeadline,

              meetingLink: event.meetingLink,

              status: event.status,

              createdAt: event.createdAt,

              updatedAt: event.updatedAt,
            }
          : null,
      };
    });

    // =====================================================
    // REMOVE REGISTRATIONS WHERE EVENT NO LONGER EXISTS
    // =====================================================

    const validRegistrations = formattedRegistrations.filter(
      (registration) => registration.event !== null
    );

    // =====================================================
    // STATISTICS
    // =====================================================

    const totalRegistrations = validRegistrations.length;

    const activeRegistrations = validRegistrations.filter(
      (registration) => registration.status === "Registered"
    ).length;

    const cancelledRegistrations = validRegistrations.filter(
      (registration) => registration.status === "Cancelled"
    ).length;

    const attendedEvents = validRegistrations.filter(
      (registration) => registration.attended === true
    ).length;

    const upcomingEvents = validRegistrations.filter((registration) => {
      if (!registration.event?.startDateTime) {
        return false;
      }

      const eventDate = new Date(registration.event.startDateTime);

      return eventDate > new Date() && registration.status === "Registered";
    }).length;

    const completedEvents = validRegistrations.filter(
      (registration) => registration.event?.status === "Completed"
    ).length;

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      message: "My event registrations fetched successfully",

      statistics: {
        totalRegistrations,

        activeRegistrations,

        cancelledRegistrations,

        attendedEvents,

        upcomingEvents,

        completedEvents,
      },

      registrations: validRegistrations,
    });
  } catch (error) {
    console.error("Get My Event Registrations Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch your event registrations",

      error: error.message,
    });
  }
};

export const getMyEventRegistrationDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const studentId = req.user.id;

    // =====================================================
    // FIND REGISTRATION
    // =====================================================

    const registration = await EventRegistration.findOne({
      _id: id,

      student: studentId,
    })
      .populate({
        path: "event",

        select: `
            title
            description
            bannerImage
            speaker
            speakerRole
            speakerCompany
            speakerBio
            speakerImage
            speakerExperience
            startDateTime
            endDateTime
            registrationDeadline
            meetingLink
            status
            createdAt
            updatedAt
          `,
      })
      .populate({
        path: "student",

        select: `
            firstName
            lastName
            name
            email
            phone
            profileImage
            avatar
            college
            university
            course
            branch
            yearOfStudy
          `,
      })
      .lean();

    // =====================================================
    // REGISTRATION NOT FOUND
    // =====================================================

    if (!registration) {
      return res.status(404).json({
        success: false,

        message: "Registration not found or you do not have access to it",
      });
    }

    // =====================================================
    // EVENT NOT FOUND
    // =====================================================

    if (!registration.event) {
      return res.status(404).json({
        success: false,

        message: "The event associated with this registration no longer exists",
      });
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      registration,
    });
  } catch (error) {
    console.error("Get My Event Registration Details Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch registration details",

      error: error.message,
    });
  }
};

export const cancelEventRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { registrationId } = req.body;

    const studentId = req.user.id;

    // ==========================================
    // VALIDATE REGISTRATION ID
    // ==========================================

    if (!registrationId) {
      return res.status(400).json({
        success: false,
        message: "Registration ID is required",
      });
    }

    // ==========================================
    // FIND REGISTRATION
    // ==========================================

    const registration = await EventRegistration.findOne({
      _id: registrationId,
      event: eventId,
      student: studentId,
    })
      .populate("student")
      .populate("event");

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    // ==========================================
    // ALREADY CANCELLED
    // ==========================================

    if (registration.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Registration is already cancelled",
      });
    }

    // ==========================================
    // GET EVENT
    // ==========================================

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // ==========================================
    // EVENT STATUS CHECK
    // ==========================================

    if (event.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled events cannot be modified",
      });
    }

    if (event.status === "Live") {
      return res.status(400).json({
        success: false,
        message: "You cannot cancel registration after event started",
      });
    }

    if (event.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "You cannot cancel registration after event ended",
      });
    }

    // ==========================================
    // REGISTRATION DEADLINE CHECK
    // ==========================================

    const now = new Date();

    if (
      event.registrationDeadline &&
      now >= new Date(event.registrationDeadline)
    ) {
      return res.status(400).json({
        success: false,
        message: "Registration cancellation deadline has passed",
      });
    }

    // ==========================================
    // PAYMENT CHECK
    // ==========================================

    /*
       If payment is completed,
       integrate Razorpay refund here.

       Example:

       if(registration.paymentStatus==="Paid"){
            refundPayment();
       }

    */

    // ==========================================
    // CANCEL REGISTRATION
    // ==========================================

    registration.status = "Cancelled";

    registration.attended = false;

    registration.joinedAt = null;

    await registration.save();

    // ==========================================
    // SEND CANCELLATION EMAIL
    // ==========================================

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
              name: `${registration.student.firstName || ""} ${
                registration.student.lastName || ""
              }`.trim(),
            },
          ],

          subject: `Registration Cancelled - ${registration.event.title}`,

          textContent: `Hello ${registration.student.firstName},

Your registration for the following GuideX event has been cancelled successfully.

Event:

Title: ${registration.event.title}

Speaker: ${registration.event.speaker}

Date:
${new Date(registration.event.startDateTime).toLocaleString()}


Regards,
GuideX Team`,

          htmlContent: `

<div style="
max-width:600px;
margin:auto;
padding:30px;
font-family:Arial;
border:1px solid #ddd;
border-radius:12px;
">

<h1 style="color:#dc2626;text-align:center;">
GuideX
</h1>


<h2 style="color:#dc2626;">
Registration Cancelled
</h2>


<p>
Hello
<strong>
${registration.student.firstName}
</strong>
</p>


<p>
Your registration has been cancelled successfully.
</p>



<table style="
width:100%;
border-collapse:collapse;
">

<tr>
<td>
<strong>Event</strong>
</td>

<td>
${registration.event.title}
</td>

</tr>


<tr>

<td>
<strong>Speaker</strong>
</td>

<td>
${registration.event.speaker || "N/A"}
</td>

</tr>



<tr>

<td>
<strong>Date</strong>
</td>


<td>
${new Date(registration.event.startDateTime).toLocaleString()}
</td>


</tr>


</table>



<div style="
margin-top:20px;
padding:15px;
background:#fef2f2;
border-left:4px solid #dc2626;
">

Your registration has been cancelled.

</div>



<p>
Regards,
<br/>
<strong>
GuideX Team
</strong>
</p>


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

      console.log("Cancellation email sent successfully");
    } catch (emailError) {
      console.error("Cancellation email failed:", emailError.message);

      // Do not fail cancellation
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      message: "Registration cancelled successfully",

      registration,
    });
  } catch (error) {
    console.error("Cancel Event Registration Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to cancel event registration",

      error: error.message,
    });
  }
};