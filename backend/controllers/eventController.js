import Event from "../models/Event.js";
import EventRegistration from "../models/EventRegistration.js";

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,

      // =====================================================
      // EVENT DATE & TIME
      // =====================================================

      startDateTime,
      endDateTime,

      // =====================================================
      // SPEAKER INFORMATION
      // =====================================================

      speaker,
      speakerRole,
      speakerCompany,
      speakerBio,
      speakerExperience,

      // =====================================================
      // REGISTRATION
      // =====================================================

      registrationDeadline,
    } = req.body;

    // =====================================================
    // REQUIRED FIELD VALIDATION
    // =====================================================

    if (
      !title?.trim() ||
      !description?.trim() ||
      !startDateTime ||
      !endDateTime ||
      !speaker?.trim() ||
      !registrationDeadline
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, event start date and time, event end date and time, speaker, and registration deadline are required",
      });
    }

    // =====================================================
    // CREATE DATE OBJECTS
    // =====================================================

    const eventStartDate = new Date(startDateTime);

    const eventEndDate = new Date(endDateTime);

    const deadlineDate = new Date(registrationDeadline);

    // =====================================================
    // VALIDATE EVENT START DATE
    // =====================================================

    if (isNaN(eventStartDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid event start date and time",
      });
    }

    // =====================================================
    // VALIDATE EVENT END DATE
    // =====================================================

    if (isNaN(eventEndDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid event end date and time",
      });
    }

    // =====================================================
    // VALIDATE REGISTRATION DEADLINE
    // =====================================================

    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration deadline",
      });
    }

    // =====================================================
    // EVENT END MUST BE AFTER EVENT START
    // =====================================================

    if (eventEndDate <= eventStartDate) {
      return res.status(400).json({
        success: false,
        message:
          "Event end date and time must be after event start date and time",
      });
    }

    // =====================================================
    // REGISTRATION DEADLINE MUST BE BEFORE EVENT START
    // =====================================================

    if (deadlineDate >= eventStartDate) {
      return res.status(400).json({
        success: false,
        message:
          "Registration deadline must be before event start date and time",
      });
    }

    // =====================================================
    // UPLOADED BANNER IMAGE
    // =====================================================

    const bannerImage = req.files?.bannerImage?.[0]
      ? `/uploads/${req.files.bannerImage[0].filename}`
      : "";

    // =====================================================
    // UPLOADED SPEAKER IMAGE
    // =====================================================

    const speakerImage = req.files?.speakerImage?.[0]
      ? `/uploads/${req.files.speakerImage[0].filename}`
      : "";

    // =====================================================
    // AUTOMATIC EVENT STATUS
    // =====================================================
    //
    // At creation time:
    //
    // If event has already ended:
    //     Completed
    //
    // If event is currently running:
    //     Live
    //
    // If registration deadline has passed:
    //     Registration Closed
    //
    // Otherwise:
    //     Upcoming
    //
    // =====================================================

    const now = new Date();

    let status = "Upcoming";

    if (now >= eventEndDate) {
      status = "Completed";
    } else if (now >= eventStartDate && now < eventEndDate) {
      status = "Live";
    } else if (now >= deadlineDate) {
      status = "Registration Closed";
    }

    // =====================================================
    // CREATE EVENT
    // =====================================================

    const event = await Event.create({
      // ===================================================
      // BASIC EVENT INFORMATION
      // ===================================================

      title: title.trim(),

      description: description.trim(),

      // ===================================================
      // EVENT BANNER
      // ===================================================

      bannerImage,

      // ===================================================
      // EVENT DATE & TIME
      // Matches Event Schema
      // ===================================================

      startDateTime: eventStartDate,

      endDateTime: eventEndDate,

      // ===================================================
      // SPEAKER INFORMATION
      // ===================================================

      speaker: speaker.trim(),

      speakerImage,

      speakerRole: speakerRole?.trim() || "",

      speakerCompany: speakerCompany?.trim() || "",

      speakerBio: speakerBio?.trim() || "",

      speakerExperience: speakerExperience?.trim() || "",

      // ===================================================
      // REGISTRATION DEADLINE
      // Matches Event Schema
      // ===================================================

      registrationDeadline: deadlineDate,

      // ===================================================
      // AUTOMATIC STATUS
      // ===================================================

      status,
    });

    // =====================================================
    // SUCCESS RESPONSE
    // =====================================================

    return res.status(201).json({
      success: true,

      message: "Event created successfully",

      event,
    });
  } catch (error) {
    console.error("Create Event Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to create event",

      error: error.message,
    });
  }
};



// ==========================================
// GET ALL EVENTS
// ==========================================

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Get Events Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};




export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // Logged-in student ID
    const studentId = req.user?.id;

    // Find event
    const event = await Event.findById(id).populate(
      "createdBy",
      "firstName lastName email"
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // =====================================================
    // CHECK WHETHER CURRENT STUDENT IS REGISTERED
    // =====================================================

    let isRegistered = false;
    let registration = null;

    if (studentId) {
      registration = await EventRegistration.findOne({
        event: event._id,
        student: studentId,
        status: "Registered",
      }).select("_id event student status attended registeredAt joinedAt");

      if (registration) {
        isRegistered = true;
      }
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    res.status(200).json({
      success: true,
      event,
      isRegistered,
      registration,
    });
  } catch (error) {
    console.error("Get Event Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch event",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE EVENT CONTROLLER
// =====================================================

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,

      startDate,
      startTime,

      endDate,
      endTime,

      speaker,
      speakerRole,
      speakerCompany,
      speakerBio,
      speakerExperience,

      registrationDeadlineDate,
      registrationDeadlineTime,

      status,
    } = req.body;

    // =====================================================
    // FIND EVENT
    // =====================================================

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // =====================================================
    // VALIDATE REQUIRED FIELDS
    // =====================================================

    if (
      !title?.trim() ||
      !description?.trim() ||
      !startDate ||
      !startTime ||
      !endDate ||
      !endTime ||
      !speaker?.trim() ||
      !registrationDeadlineDate ||
      !registrationDeadlineTime
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, event start date and time, event end date and time, speaker, and registration deadline are required",
      });
    }

    // =====================================================
    // CONVERT 12-HOUR TIME TO 24-HOUR TIME
    // =====================================================

    const convertTo24Hour = (time) => {
      if (!time) {
        return null;
      }

      const match = time.trim().match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);

      if (!match) {
        return null;
      }

      let hours = parseInt(match[1], 10);

      const minutes = match[2];

      const period = match[3].toUpperCase();

      // =====================================================
      // VALIDATE HOURS
      // =====================================================

      if (hours < 1 || hours > 12) {
        return null;
      }

      // =====================================================
      // CONVERT AM
      // =====================================================

      if (period === "AM" && hours === 12) {
        hours = 0;
      }

      // =====================================================
      // CONVERT PM
      // =====================================================

      if (period === "PM" && hours !== 12) {
        hours += 12;
      }

      return `${String(hours).padStart(2, "0")}:${minutes}`;
    };

    // =====================================================
    // CONVERT TIMES
    // =====================================================

    const startTime24 = convertTo24Hour(startTime);

    const endTime24 = convertTo24Hour(endTime);

    const registrationDeadlineTime24 = convertTo24Hour(
      registrationDeadlineTime
    );

    // =====================================================
    // VALIDATE START TIME
    // =====================================================

    if (!startTime24) {
      return res.status(400).json({
        success: false,
        message: "Invalid event start time. Use format like 10:30 AM",
      });
    }

    // =====================================================
    // VALIDATE END TIME
    // =====================================================

    if (!endTime24) {
      return res.status(400).json({
        success: false,
        message: "Invalid event end time. Use format like 02:30 PM",
      });
    }

    // =====================================================
    // VALIDATE REGISTRATION DEADLINE TIME
    // =====================================================

    if (!registrationDeadlineTime24) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration deadline time. Use format like 11:59 PM",
      });
    }

    // =====================================================
    // CREATE COMBINED DATE OBJECTS
    // =====================================================

    const eventStartDate = new Date(`${startDate}T${startTime24}:00`);

    const eventEndDate = new Date(`${endDate}T${endTime24}:00`);

    const deadlineDate = new Date(
      `${registrationDeadlineDate}T${registrationDeadlineTime24}:00`
    );

    // =====================================================
    // VALIDATE EVENT START DATE
    // =====================================================

    if (isNaN(eventStartDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid event start date or time",
      });
    }

    // =====================================================
    // VALIDATE EVENT END DATE
    // =====================================================

    if (isNaN(eventEndDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid event end date or time",
      });
    }

    // =====================================================
    // VALIDATE REGISTRATION DEADLINE
    // =====================================================

    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration deadline",
      });
    }

    // =====================================================
    // EVENT END MUST BE AFTER EVENT START
    // =====================================================

    if (eventEndDate <= eventStartDate) {
      return res.status(400).json({
        success: false,
        message:
          "Event end date and time must be after event start date and time",
      });
    }

    // =====================================================
    // REGISTRATION DEADLINE MUST BE BEFORE EVENT START
    // =====================================================

    if (deadlineDate >= eventStartDate) {
      return res.status(400).json({
        success: false,
        message:
          "Registration deadline must be before event start date and time",
      });
    }

    // =====================================================
    // UPDATE BASIC EVENT INFORMATION
    // =====================================================

    event.title = title.trim();

    event.description = description.trim();

    // =====================================================
    // EVENT DATE & TIME
    // Store exactly as received from frontend
    // Example:
    //
    // startDate = 2026-08-15
    // startTime = 10:30 AM
    // endDate   = 2026-08-15
    // endTime   = 02:30 PM
    // =====================================================

    event.startDate = startDate;

    event.startTime = startTime;

    event.endDate = endDate;

    event.endTime = endTime;

    // =====================================================
    // OPTIONAL COMBINED DATETIME FIELDS
    //
    // These are useful for:
    // - Automatic status
    // - Event countdown
    // - Checking whether event started
    // - Checking whether event ended
    // =====================================================

    event.startDateTime = eventStartDate;

    event.endDateTime = eventEndDate;

    // =====================================================
    // UPDATE SPEAKER INFORMATION
    // =====================================================

    event.speaker = speaker.trim();

    event.speakerRole = speakerRole?.trim() || "";

    event.speakerCompany = speakerCompany?.trim() || "";

    event.speakerBio = speakerBio?.trim() || "";

    event.speakerExperience = speakerExperience?.trim() || "";

    // =====================================================
    // UPDATE REGISTRATION DEADLINE
    // Store date and 12-hour time separately
    // =====================================================

    event.registrationDeadlineDate = registrationDeadlineDate;

    event.registrationDeadlineTime = registrationDeadlineTime;

    // =====================================================
    // AUTOMATIC EVENT STATUS
    // =====================================================

    const now = new Date();

    // =====================================================
    // EVENT ALREADY FINISHED
    // =====================================================

    if (now >= eventEndDate) {
      event.status = "Completed";
    }

    // =====================================================
    // EVENT IS CURRENTLY LIVE
    // =====================================================
    else if (now >= eventStartDate && now < eventEndDate) {
      event.status = "Live";
    }

    // =====================================================
    // REGISTRATION DEADLINE HAS PASSED
    // =====================================================
    else if (now >= deadlineDate && now < eventStartDate) {
      event.status = "Registration Closed";
    }

    // =====================================================
    // EVENT HAS NOT STARTED
    // =====================================================
    else {
      // Keep manually selected status if provided
      // Otherwise use Upcoming

      event.status = status || "Upcoming";
    }

    // =====================================================
    // UPDATE BANNER IMAGE
    // =====================================================

    if (req.files?.bannerImage?.[0]) {
      event.bannerImage = `/uploads/events/${req.files.bannerImage[0].filename}`;
    }

    // =====================================================
    // UPDATE SPEAKER IMAGE
    // =====================================================

    if (req.files?.speakerImage?.[0]) {
      event.speakerImage = `/uploads/events/${req.files.speakerImage[0].filename}`;
    }

    // =====================================================
    // SAVE EVENT
    // =====================================================

    await event.save();

    // =====================================================
    // SUCCESS RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      message: "Event updated successfully",

      event,
    });
  } catch (error) {
    console.error("Update Event Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to update event",

      error: error.message,
    });
  }
};


// ==========================================
// DELETE EVENT
// ==========================================

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await Event.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete Event Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete event",
    });
  }
};



export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Get logged-in student
    const studentId = req.user._id;

    // Find event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check event status
    if (event.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "This event has been cancelled",
      });
    }

    if (event.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "This event has already been completed",
      });
    }

    // Check registration deadline
    const now = new Date();

    if (now > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: "Registration deadline has passed",
      });
    }

    // Check if already registered
    const existingRegistration = await EventRegistration.findOne({
      event: eventId,
      student: studentId,
    });

    if (existingRegistration) {
      if (existingRegistration.status === "Registered") {
        return res.status(400).json({
          success: false,
          message: "You are already registered for this event",
        });
      }

      // Allow cancelled student to register again
      existingRegistration.status = "Registered";
      existingRegistration.registeredAt = new Date();

      await existingRegistration.save();

      return res.status(200).json({
        success: true,
        message: "Successfully registered for the event",
        registration: existingRegistration,
      });
    }

    // Create new registration
    const registration = await EventRegistration.create({
      event: eventId,
      student: studentId,
      status: "Registered",
    });

    res.status(201).json({
      success: true,
      message: "Successfully registered for the event",
      registration,
    });
  } catch (error) {
    console.error("Register Event Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to register for event",
      error: error.message,
    });
  }
};


export const getUpcomingEvents = async (req, res) => {
  try {
    const now = new Date();

    // =====================================================
    // GET LOGGED-IN STUDENT ID
    // =====================================================

    // Change this according to your protect middleware.
    // Usually req.user._id contains the logged-in student ID.
    const studentId = req.user?.id;

    // =====================================================
    // 1. MARK ENDED EVENTS AS COMPLETED
    // =====================================================

    await Event.updateMany(
      {
        endDateTime: { $lte: now },
        status: {
          $nin: ["Cancelled", "Completed"],
        },
      },
      {
        $set: {
          status: "Completed",
        },
      }
    );

    // =====================================================
    // 2. MARK CURRENTLY RUNNING EVENTS AS LIVE
    // =====================================================

    await Event.updateMany(
      {
        startDateTime: { $lte: now },
        endDateTime: { $gt: now },
        status: {
          $nin: ["Cancelled", "Completed"],
        },
      },
      {
        $set: {
          status: "Live",
        },
      }
    );

    // =====================================================
    // 3. MARK REGISTRATION CLOSED
    // =====================================================

    await Event.updateMany(
      {
        registrationDeadline: { $lte: now },
        startDateTime: { $gt: now },
        status: "Upcoming",
      },
      {
        $set: {
          status: "Registration Closed",
        },
      }
    );

    // =====================================================
    // 4. FETCH EVENTS
    // =====================================================

    const events = await Event.find({
      startDateTime: {
        $exists: true,
      },
    })
      .sort({
        startDateTime: 1,
      })
      .lean();

    // =====================================================
    // 5. GET EVENT IDS
    // =====================================================

    const eventIds = events.map((event) => event._id);

    // =====================================================
    // 6. GET REGISTRATION COUNTS
    //
    // Only active "Registered" registrations are counted.
    // Cancelled registrations are not counted.
    // =====================================================

    const registrationCounts = await EventRegistration.aggregate([
      {
        $match: {
          event: {
            $in: eventIds,
          },
          status: "Registered",
        },
      },
      {
        $group: {
          _id: "$event",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // =====================================================
    // 7. CREATE REGISTRATION COUNT MAP
    // =====================================================

    const registrationCountMap = {};

    registrationCounts.forEach((item) => {
      registrationCountMap[item._id.toString()] = item.count;
    });

    // =====================================================
    // 8. GET CURRENT STUDENT REGISTRATIONS
    //
    // This checks which events the logged-in student
    // has already registered for.
    // =====================================================

    let registeredEventIds = [];

    if (studentId) {
      const registrations = await EventRegistration.find({
        student: studentId,
        event: {
          $in: eventIds,
        },
        status: "Registered",
      })
        .select("event")
        .lean();

      registeredEventIds = registrations.map((registration) =>
        registration.event.toString()
      );
    }

    // =====================================================
    // 9. CREATE REGISTERED EVENT SET
    //
    // Set makes lookup faster.
    // =====================================================

    const registeredEventSet = new Set(registeredEventIds);

    // =====================================================
    // 10. ADD REGISTRATION DATA TO EACH EVENT
    // =====================================================

    const eventsWithRegistrationData = events.map((event) => {
      const eventId = event._id.toString();

      return {
        ...event,

        // Total active registrations
        registeredCount: registrationCountMap[eventId] || 0,

        // Current student registration status
        isRegistered: registeredEventSet.has(eventId),
      };
    });

    // =====================================================
    // 11. RETURN RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,
      count: eventsWithRegistrationData.length,
      events: eventsWithRegistrationData,
    });
  } catch (error) {
    console.error("Get Upcoming Events Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};


export const completeEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Already completed
    if (event.status === "Completed") {
      return res.status(200).json({
        success: true,
        message: "Event is already completed",
        event,
      });
    }

    const now = new Date();

    // Do not complete before end time
    if (event.endDateTime && now < new Date(event.endDateTime)) {
      return res.status(400).json({
        success: false,
        message: "Event has not reached its end time yet",
      });
    }

    event.status = "Completed";

    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event automatically marked as Completed",
      event,
    });
  } catch (error) {
    console.error("Complete Event Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to complete event",
      error: error.message,
    });
  }
};



export const getEventDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id).lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // =====================================================
    // FIND EVENT REGISTRATIONS
    // =====================================================

    const registrations = await EventRegistration.find({
      event: id,
    })
      .populate({
        path: "student",
        select:
          "firstName lastName name email phone profileImage avatar college university course branch yearOfStudy",
      })
      .sort({
        registeredAt: -1,
      })
      .lean();

    // =====================================================
    // STATISTICS
    // =====================================================

    const totalRegistrations = registrations.length;

    const registeredCount = registrations.filter(
      (registration) => registration.status === "Registered"
    ).length;

    const cancelledCount = registrations.filter(
      (registration) => registration.status === "Cancelled"
    ).length;

    const attendedCount = registrations.filter(
      (registration) => registration.attended === true
    ).length;

    const notAttendedCount = registrations.filter(
      (registration) =>
        registration.status === "Registered" && registration.attended === false
    ).length;

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      event,

      registrations,

      statistics: {
        totalRegistrations,
        registeredCount,
        cancelledCount,
        attendedCount,
        notAttendedCount,
      },
    });
  } catch (error) {
    console.error("Get Admin Event Details Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load event details",
      error: error.message,
    });
  }
};


export const updateEventStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // =====================================================
    // VALID STATUSES
    // =====================================================

    const allowedStatuses = [
      "Upcoming",
      "Registration Closed",
      "Live",
      "Completed",
      "Cancelled",
    ];

    // =====================================================
    // VALIDATE STATUS
    // =====================================================

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Event status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event status",
        allowedStatuses,
      });
    }

    // =====================================================
    // FIND EVENT
    // =====================================================

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // =====================================================
    // UPDATE STATUS
    // =====================================================

    event.status = status;

    await event.save();

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,
      message: `Event status changed to ${status}`,
      event,
    });
  } catch (error) {
    console.error("Update Event Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update event status",
      error: error.message,
    });
  }
};