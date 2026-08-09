import Event from "../models/Event.js";
import EventRegistration from "../models/EventRegistration.js";
import mongoose from "mongoose";
import Student from "../models/Student.js";


export const createEvent = async (req, res) => {
  try {
    const {
      title,
      shortSummary,
      description,
      domain,
      eventType,
      meetingUrl,
      tags,
      targetAudience,
      startDateTime,
      endDateTime,
      registrationDeadline,
      maxSeats,
      isPaid,
      ticketPrice,
      status,
      isFeatured,
      speakers,
    } = req.body;

    // =====================================================
    // 1. REQUIRED FIELD VALIDATION
    // =====================================================
    if (
      !title?.trim() ||
      !description?.trim() ||
      !domain?.trim() ||
      !startDateTime ||
      !endDateTime ||
      !registrationDeadline
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, domain, start date, end date, and registration deadline are required.",
      });
    }

    // =====================================================
    // 2. PARSE JSON DATA FROM MULTIPART FORM
    // =====================================================
    let parsedSpeakers = [];
    let parsedTags = [];
    let parsedTargetAudience = {
      experienceLevel: "All Levels",
      prerequisites: [],
    };

    try {
      parsedSpeakers =
        typeof speakers === "string" ? JSON.parse(speakers) : speakers || [];
      parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags || [];
      parsedTargetAudience =
        typeof targetAudience === "string"
          ? JSON.parse(targetAudience)
          : targetAudience || parsedTargetAudience;
    } catch (parseErr) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format for speakers, tags, or targetAudience.",
      });
    }

    if (!parsedSpeakers || parsedSpeakers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one guest speaker is required.",
      });
    }

    // =====================================================
    // 3. DATE VALIDATIONS
    // =====================================================
    const eventStartDate = new Date(startDateTime);
    const eventEndDate = new Date(endDateTime);
    const deadlineDate = new Date(registrationDeadline);

    if (
      isNaN(eventStartDate.getTime()) ||
      isNaN(eventEndDate.getTime()) ||
      isNaN(deadlineDate.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid date or time provided.",
      });
    }

    if (eventEndDate <= eventStartDate) {
      return res.status(400).json({
        success: false,
        message: "Event end time must be after the start time.",
      });
    }

    if (deadlineDate >= eventStartDate) {
      return res.status(400).json({
        success: false,
        message: "Registration deadline must be before the event starts.",
      });
    }

    // =====================================================
    // 4. PROCESS FILE UPLOADS
    // =====================================================

    // Banner Image
    const bannerImage = req.files?.bannerImage?.[0]
      ? `/uploads/${req.files.bannerImage[0].filename}`
      : "";

    // Speaker Images Array
    const speakerFiles = req.files?.speakerImages || [];

    // Map profile photos to their respective speakers
    const finalSpeakers = parsedSpeakers.map((spk, index) => {
      let profileImage = spk.existingImage || "";
      if (speakerFiles[index]) {
        profileImage = `/uploads/${speakerFiles[index].filename}`;
      }

      return {
        name: spk.name?.trim(),
        title: spk.title?.trim(),
        organization: spk.organization?.trim(),
        bio: spk.bio?.trim() || "",
        linkedinUrl: spk.linkedinUrl?.trim() || "",
        profileImage,
      };
    });

    // =====================================================
    // 5. AUTO GENERATE SLUG
    // =====================================================
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const slug = `${baseSlug}-${Date.now()}`;

    // =====================================================
    // 6. CREATE EVENT IN DATABASE
    // =====================================================
    const newEvent = await Event.create({
      title: title.trim(),
      slug,
      shortSummary: shortSummary?.trim() || "",
      description: description.trim(),
      domain: domain.trim(),
      tags: parsedTags,
      bannerImage,
      createdByAdmin: req.user?._id, // Set by `protect` middleware
      speakers: finalSpeakers,
      targetAudience: parsedTargetAudience,
      eventType: eventType || "Guest Lecture",
      meetingUrl: meetingUrl?.trim() || "",
      startDateTime: eventStartDate,
      endDateTime: eventEndDate,
      registrationDeadline: deadlineDate,
      maxSeats: Number(maxSeats) || 100,
      isPaid: isPaid === "true" || isPaid === true,
      ticketPrice: isPaid ? Number(ticketPrice) || 0 : 0,
      status: status || "Published",
      isFeatured: isFeatured === "true" || isFeatured === true,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("Create Event Controller Error:", error);
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
    const studentId = req.user?.id || req.user?._id;

    // Fetch Event (No populate on 'createdBy' since schema uses createdByAdmin string)
    const event = await Event.findById(id).lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check whether student is registered
    let isRegistered = false;
    let registration = null;

    if (studentId) {
      registration = await EventRegistration.findOne({
        event: event._id,
        student: studentId,
        status: "Registered",
      }).select("_id event student status attended createdAt joinedAt");

      if (registration) {
        isRegistered = true;
      }
    }

    return res.status(200).json({
      success: true,
      event,
      isRegistered,
      registration,
    });
  } catch (error) {
    console.error("Get Event Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch event details",
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
      slug,
      shortSummary,
      description,
      domain,
      eventType,
      meetingUrl,
      recordingUrl,
      createdByAdmin,
      tags,
      targetAudience,
      startDateTime,
      endDateTime,
      registrationDeadline,
      maxSeats,
      registeredStudentsCount,
      isPaid,
      ticketPrice,
      status,
      isFeatured,
      speakers,
      existingBannerImage,
    } = req.body;

    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // 1. Parse JSON Strings from FormData
    let parsedSpeakers = [];
    let parsedTags = [];
    let parsedTargetAudience = {
      experienceLevel: "All Levels",
      prerequisites: [],
    };

    try {
      parsedSpeakers =
        typeof speakers === "string" ? JSON.parse(speakers) : speakers || [];
      parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags || [];
      parsedTargetAudience =
        typeof targetAudience === "string"
          ? JSON.parse(targetAudience)
          : targetAudience || parsedTargetAudience;
    } catch (parseErr) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format for speakers, tags, or targetAudience.",
      });
    }

    // 2. Validate Dates in Node.js before DB persistence
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const deadline = new Date(registrationDeadline);

    if (
      isNaN(start.getTime()) ||
      isNaN(end.getTime()) ||
      isNaN(deadline.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format provided.",
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time.",
      });
    }

    if (deadline >= start) {
      return res.status(400).json({
        success: false,
        message: "Registration deadline must be before event start time.",
      });
    }

    // 3. Process Banner Image
    let bannerImage = existingEvent.bannerImage;
    if (req.files?.bannerImage?.[0]) {
      bannerImage = `/uploads/${req.files.bannerImage[0].filename}`;
    } else if (existingBannerImage !== undefined && !existingBannerImage) {
      bannerImage = "";
    }

    // 4. Process Dynamic Speaker Profile Images
    const speakerFiles = req.files?.speakerImages || [];
    let speakerFileIndex = 0;

    const updatedSpeakers = parsedSpeakers.map((spk) => {
      let profileImage = spk.existingImage || "";

      // If a new photo file was uploaded for this speaker slot
      if (
        (!spk.existingImage || spk.profileImage === null) &&
        speakerFiles[speakerFileIndex]
      ) {
        profileImage = `/uploads/${speakerFiles[speakerFileIndex].filename}`;
        speakerFileIndex++;
      }

      return {
        name: spk.name?.trim(),
        title: spk.title?.trim(),
        organization: spk.organization?.trim(),
        bio: spk.bio?.trim() || "",
        linkedinUrl: spk.linkedinUrl?.trim() || "",
        profileImage,
      };
    });

    // 5. Explicitly Update Event Document
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        title: title?.trim(),
        slug: slug?.trim() || existingEvent.slug,
        shortSummary: shortSummary?.trim() || "",
        description: description?.trim(),
        domain: domain?.trim(),
        eventType: eventType || "Guest Lecture",
        meetingUrl: meetingUrl?.trim() || "",
        recordingUrl: recordingUrl?.trim() || "",
        createdByAdmin: createdByAdmin?.trim() || "Guideex Admin",
        tags: parsedTags,
        targetAudience: parsedTargetAudience,
        speakers: updatedSpeakers,
        startDateTime: start,
        endDateTime: end,
        registrationDeadline: deadline,
        maxSeats: Number(maxSeats) || 100,
        registeredStudentsCount: Number(registeredStudentsCount) || 0,
        isPaid: isPaid === "true" || isPaid === true,
        ticketPrice: isPaid ? Number(ticketPrice) || 0 : 0,
        status: status || "Draft",
        isFeatured: isFeatured === "true" || isFeatured === true,
        bannerImage,
      },
      {
        returnDocument: "after", // Modern Mongoose option (replaces deprecating new: true)
        runValidators: false, // Bypasses Mongoose context validator bug on update
      }
    );

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
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
    const studentId = req.user?.id;

    const events = await Event.find({
      status: "Published",
      startDateTime: { $exists: true },
    })
      .sort({ startDateTime: 1 })
      .lean({ virtuals: true }); // Crucial: Ensures virtual computedStatus is included in lean()

    // =====================================================
    // 2. GET EVENT IDS
    // =====================================================
    const eventIds = events.map((event) => event._id);

    // =====================================================
    // 3. GET ACTIVE REGISTRATION COUNTS
    // =====================================================
    const registrationCounts = await EventRegistration.aggregate([
      {
        $match: {
          event: { $in: eventIds },
          status: "Registered",
        },
      },
      {
        $group: {
          _id: "$event",
          count: { $sum: 1 },
        },
      },
    ]);

    const registrationCountMap = {};
    registrationCounts.forEach((item) => {
      registrationCountMap[item._id.toString()] = item.count;
    });

    // =====================================================
    // 4. GET CURRENT STUDENT REGISTRATIONS
    // =====================================================
    let registeredEventIds = [];

    if (studentId) {
      const registrations = await EventRegistration.find({
        student: studentId,
        event: { $in: eventIds },
        status: "Registered",
      })
        .select("event")
        .lean();

      registeredEventIds = registrations.map((registration) =>
        registration.event.toString()
      );
    }

    const registeredEventSet = new Set(registeredEventIds);

    // =====================================================
    // 5. MERGE DATA & ATTACH COMPUTED STATUS
    // =====================================================
    const eventsWithData = events.map((event) => {
      const eventId = event._id.toString();
      const currentRegisteredCount = registrationCountMap[eventId] || 0;

      // Calculate runtime timeline status if virtual isn't automatically bound by lean()
      const now = new Date();
      let computed = event.computedStatus;

      if (!computed) {
        if (event.status === "Cancelled") computed = "Cancelled";
        else if (now > new Date(event.endDateTime)) computed = "Completed";
        else if (
          now >= new Date(event.startDateTime) &&
          now <= new Date(event.endDateTime)
        )
          computed = "Live Now";
        else if (now > new Date(event.registrationDeadline))
          computed = "Registration Closed";
        else if (currentRegisteredCount >= (event.maxSeats || 100))
          computed = "Housefull";
        else computed = "Upcoming";
      }

      return {
        ...event,
        registeredCount: currentRegisteredCount,
        isRegistered: registeredEventSet.has(eventId),
        // Use computedStatus as the primary display status for students
        displayStatus: computed,
      };
    });

    return res.status(200).json({
      success: true,
      count: eventsWithData.length,
      events: eventsWithData,
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




export const getEventDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user?.id;

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Event ID format",
      });
    }

    const event = await Event.findById(id).lean({ virtuals: true });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const registrations = await EventRegistration.find({ event: id }).populate(
      "student",
      "firstName lastName email education careerGoal profileImage"
    );

    // Compute statistics server-side to match the frontend expectations
    const totalRegistrations = registrations.length;
    const registeredCount = registrations.filter(
      (r) => r.status === "Registered"
    ).length;
    const cancelledCount = registrations.filter(
      (r) => r.status === "Cancelled"
    ).length;
    const attendedCount = registrations.filter(
      (r) => r.attended === true
    ).length;
    const notAttendedCount = registrations.filter(
      (r) => r.attended === false
    ).length;

    const statistics = {
      totalRegistrations,
      registeredCount,
      cancelledCount,
      attendedCount,
      notAttendedCount,
    };

    const currentRegistration = registrations.find(
      (reg) =>
        reg.student &&
        reg.student._id.toString() === studentId &&
        reg.status === "Registered"
    );

    const isRegistered = !!currentRegistration;

    res.status(200).json({
      success: true,
      event,
      registrations,
      statistics,
      isRegistered,
      currentRegistration,
    });
  } catch (error) {
    console.error("Detailed Server Error in getEventDetailsById:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load event details and insights",
      error: error.message,
    });
  }
};


export const updateEventStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Allowed database statuses in your Mongoose Schema
    const allowedDatabaseStatuses = ["Draft", "Published", "Cancelled"];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Event status is required",
      });
    }

    // Map any loose/computed dropdown values if sent accidentally
    let targetStatus = status;
    if (
      [
        "Upcoming",
        "Live Now",
        "Registration Closed",
        "Completed",
        "Housefull",
      ].includes(status)
    ) {
      targetStatus = "Published"; // Default active/live states to Published
    }

    if (!allowedDatabaseStatuses.includes(targetStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed database statuses are: ${allowedDatabaseStatuses.join(
          ", "
        )}`,
        allowedDatabaseStatuses,
      });
    }

    // Find and update document cleanly
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { status: targetStatus },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Event status updated to ${targetStatus}`,
      event: updatedEvent,
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