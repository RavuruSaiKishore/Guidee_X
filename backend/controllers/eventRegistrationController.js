import mongoose from "mongoose";
import Event from "../models/Event.js";
import EventRegistration from "../models/EventRegistration.js";
import axios from "axios";




// @desc    Register student for an event & send Brevo confirmation email
// @route   POST /api/events/register/:eventId
export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const studentId = req.user.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const now = new Date();

    if (event.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "This event has been cancelled",
      });
    }

    if (event.computedStatus === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Registration is closed because the event has ended",
      });
    }

    if (
      event.registrationDeadline &&
      now >= new Date(event.registrationDeadline)
    ) {
      return res.status(400).json({
        success: false,
        message: "Registration deadline has passed",
      });
    }

    if (event.registeredStudentsCount >= event.maxSeats) {
      return res.status(400).json({
        success: false,
        message: "Housefull! Maximum seats reached for this event.",
      });
    }

    let registration = await EventRegistration.findOne({
      event: eventId,
      student: studentId,
    });

    const assignedMeetingLink = event.meetingUrl || "";

    if (registration) {
      if (registration.status === "Registered") {
        return res.status(400).json({
          success: false,
          message: "You are already registered for this event",
          registration,
        });
      }

      if (registration.status === "Cancelled") {
        registration.status = "Registered";
        registration.registeredAt = new Date();
        registration.attended = false;
        registration.joinedAt = null;
        registration.meetingLink = assignedMeetingLink;

        await registration.save();

        event.registeredStudentsCount =
          (event.registeredStudentsCount || 0) + 1;
        await event.save();

        await registration.populate([
          { path: "event" },
          { path: "student", select: "name email profileImage" },
        ]);

        return res.status(200).json({
          success: true,
          message: "You have successfully registered for the event again",
          registration,
          isReRegistered: true,
        });
      }
    }

    registration = await EventRegistration.create({
      event: eventId,
      student: studentId,
      status: "Registered",
      registeredAt: new Date(),
      meetingLink: assignedMeetingLink,
    });

    event.registeredStudentsCount = (event.registeredStudentsCount || 0) + 1;
    await event.save();

    await registration.populate([
      { path: "event" },
      { path: "student", select: "name email profileImage" },
    ]);

    const leadSpeaker = registration.event.speakers?.[0] || {};

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
            name: registration.student.name,
          },
        ],
        subject: `Registration Confirmed - ${registration.event.title}`,
        htmlContent: `
          <div style="max-width:600px;margin:30px auto;padding:30px;font-family:Arial,sans-serif;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;">
            <div style="text-align:center;">
              <h1 style="color:#4f46e5;margin-bottom:5px;">GuideX</h1>
              <p style="color:#6b7280;">Learn. Connect. Grow.</p>
            </div>
            <h2 style="color:#111827;">Event Registration Successful 🎉</h2>
            <p>Hello <strong>${registration.student.name}</strong>,</p>
            <p>Congratulations! You have successfully registered for the following event.</p>
            <table style="width:100%;border-collapse:collapse;margin-top:20px;">
              <tr>
                <td style="padding:10px;font-weight:bold;">Event</td>
                <td style="padding:10px;">${registration.event.title}</td>
              </tr>
              <tr style="background:#f9fafb;">
                <td style="padding:10px;font-weight:bold;">Speaker</td>
                <td style="padding:10px;">${leadSpeaker.name || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding:10px;font-weight:bold;">Role / Company</td>
                <td style="padding:10px;">${leadSpeaker.title || "N/A"} @ ${
          leadSpeaker.organization || "N/A"
        }</td>
              </tr>
              <tr style="background:#f9fafb;">
                <td style="padding:10px;font-weight:bold;">Starts</td>
                <td style="padding:10px;">${new Date(
                  registration.event.startDateTime
                ).toLocaleString()}</td>
              </tr>
            </table>
            <div style="background:#eef4ff;border-left:4px solid #4f46e5;padding:15px;margin-top:25px;border-radius:6px;">
              <strong>Meeting Link</strong>
              <p style="margin-top:8px;">${
                assignedMeetingLink
                  ? `<a href="${assignedMeetingLink}" target="_blank">${assignedMeetingLink}</a>`
                  : "The meeting link will be activated closer to the event."
              }</p>
            </div>
            <p style="margin-top:25px;">Regards,<br><strong>GuideX Team</strong></p>
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
          speakers
          domain
          eventType
          isPaid
          ticketPrice
          startDateTime
          endDateTime
          registrationDeadline
          meetingUrl
          status
          maxSeats
          registeredStudentsCount
          createdAt
          updatedAt
        `,
      })
      .sort({
        registeredAt: -1,
      })
      .lean({ virtuals: true }); // Crucial: includes computedStatus virtual

    const formattedRegistrations = registrations.map((registration) => {
      const event = registration.event;
      const leadSpeaker = event?.speakers?.[0] || {};

      return {
        _id: registration._id,
        registrationId: registration._id,
        status: registration.status,
        attended: registration.attended || false,
        joinedAt: registration.joinedAt || null,
        registeredAt: registration.createdAt || registration.registeredAt,
        meetingLink: registration.meetingLink || event?.meetingUrl || null,
        event: event
          ? {
              _id: event._id,
              title: event.title,
              description: event.description,
              bannerImage: event.bannerImage,
              domain: event.domain,
              eventType: event.eventType,
              isPaid: event.isPaid,
              ticketPrice: event.ticketPrice,
              // Mapped directly from your speakerSchema array structure
              speakerName: leadSpeaker.name || "N/A",
              speakerTitle: leadSpeaker.title || "",
              speakerOrganization: leadSpeaker.organization || "",
              speakerImage: leadSpeaker.profileImage || "",
              startDateTime: event.startDateTime,
              endDateTime: event.endDateTime,
              registrationDeadline: event.registrationDeadline,
              meetingUrl: event.meetingUrl,
              computedStatus: event.computedStatus, // Uses schema virtual
              status: event.status,
            }
          : null,
      };
    });

    const validRegistrations = formattedRegistrations.filter(
      (reg) => reg.event !== null
    );

    // Compute statistics
    const totalRegistrations = validRegistrations.length;
    const activeRegistrations = validRegistrations.filter(
      (r) => r.status === "Registered"
    ).length;
    const cancelledRegistrations = validRegistrations.filter(
      (r) => r.status === "Cancelled"
    ).length;
    const attendedEvents = validRegistrations.filter(
      (r) => r.attended === true
    ).length;
    const upcomingEvents = validRegistrations.filter(
      (r) => r.event?.computedStatus === "Upcoming" && r.status === "Registered"
    ).length;
    const completedEvents = validRegistrations.filter(
      (r) => r.event?.computedStatus === "Completed"
    ).length;

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
            speakers
            domain
            eventType
            isPaid
            ticketPrice
            startDateTime
            endDateTime
            registrationDeadline
            meetingUrl
            status
            maxSeats
            registeredStudentsCount
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
            college
            university
            course
            branch
            yearOfStudy
          `,
      })
      .lean({ virtuals: true });
      console.log(registration);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found or you do not have access to it",
      });
    }

    if (!registration.event) {
      return res.status(404).json({
        success: false,
        message: "The event associated with this registration no longer exists",
      });
    }

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

    if (!registrationId) {
      return res.status(400).json({
        success: false,
        message: "Registration ID is required",
      });
    }

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

    if (registration.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Registration is already cancelled",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled events cannot be modified",
      });
    }

    if (event.computedStatus === "Live Now") {
      return res.status(400).json({
        success: false,
        message: "You cannot cancel registration after event started",
      });
    }

    if (event.computedStatus === "Completed") {
      return res.status(400).json({
        success: false,
        message: "You cannot cancel registration after event ended",
      });
    }

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
    // CANCEL REGISTRATION & DECREMENT SEAT COUNT
    // ==========================================
    registration.status = "Cancelled";
    registration.attended = false;
    registration.joinedAt = null;
    await registration.save();

    // Decrement registered students count safely
    if (event.registeredStudentsCount > 0) {
      event.registeredStudentsCount -= 1;
      await event.save();
    }

    // ==========================================
    // SEND CANCELLATION EMAIL VIA BREVO
    // ==========================================
    try {
      const leadSpeaker = registration.event.speakers?.[0] || {};
      const studentName =
        registration.student.name ||
        registration.student.firstName ||
        "Student";

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
              name: studentName,
            },
          ],
          subject: `Registration Cancelled - ${registration.event.title}`,
          htmlContent: `
            <div style="max-width:600px;margin:auto;padding:30px;font-family:Arial;border:1px solid #ddd;border-radius:12px;">
              <h1 style="color:#dc2626;text-align:center;">GuideX</h1>
              <h2 style="color:#dc2626;">Registration Cancelled</h2>
              <p>Hello <strong>${studentName}</strong></p>
              <p>Your registration has been cancelled successfully.</p>
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td><strong>Event</strong></td>
                  <td>${registration.event.title}</td>
                </tr>
                <tr>
                  <td><strong>Speaker</strong></td>
                  <td>${leadSpeaker.name || "N/A"}</td>
                </tr>
                <tr>
                  <td><strong>Date</strong></td>
                  <td>${new Date(
                    registration.event.startDateTime
                  ).toLocaleString()}</td>
                </tr>
              </table>
              <div style="margin-top:20px;padding:15px;background:#fef2f2;border-left:4px solid #dc2626;">
                Your spot has been freed up. We hope to see you at future events!
              </div>
              <p>Regards,<br/><strong>GuideX Team</strong></p>
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
    } catch (emailError) {
      console.error("Cancellation email failed:", emailError.message);
    }

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


export const getRegistrationDetailsById = async (req, res) => {
  try {
    const { eventId } = req.params; // This parameter is actually holding the Event ID
 
    // Use findOne with the 'event' field instead of findById
    const registration = await EventRegistration.findOne({ event: eventId })
      .populate({
        path: "student",
        select: "-password",
      })
      .populate("event");


    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration details not found for this event",
      });
    }

    return res.status(200).json({
      success: true,
      registration,
    });
  } catch (error) {
    console.error("Error fetching registration details:", error);

    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while fetching registration details",
    });
  }
};