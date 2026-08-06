import MentorContact from "../models/MentorContact.js";
import Mentor from "../models/Mentor.js";

// =====================================================
// ADMIN GET ALL MENTORS FOR CHAT
// =====================================================

export const getChatMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({
      accountStatus: "Active",
      verificationStatus: "Approved",
    })
      .select(
        `
      firstName
      lastName
      email
      phone
      profileImage
      category
      primarySkill
      `
      )
      .sort({
        firstName: 1,
      });

    res.status(200).json({
      success: true,

      mentors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// ADMIN START CHAT WITH MENTOR
// =====================================================

export const startMentorChat = async (req, res) => {
  try {
    const { mentorId, subject, category, message } = req.body;

    if (!mentorId || !subject || !message) {
      return res.status(400).json({
        success: false,

        message: "All fields required",
      });
    }

    // check mentor exists

    const mentor = await Mentor.findById(mentorId);

    if (!mentor) {
      return res.status(404).json({
        success: false,

        message: "Mentor not found",
      });
    }

    // check existing conversation

    let contact = await MentorContact.findOne({
      mentorId,

      subject,

      status: {
        $in: ["Pending", "In Progress"],
      },
    });

    // if already exists add message

    if (contact) {
      contact.conversation.push({
        sender: "Admin",

        message,

        sentAt: new Date(),

        isRead: false,
      });

      contact.lastMessageAt = new Date();

      contact.lastSender = "Admin";

      await contact.save();

      return res.status(200).json({
        success: true,

        message: "Message added",

        contact,
      });
    }

    // create new chat

    contact = await MentorContact.create({
      mentorId,

      name: "GuideX Admin",

      email: "admin@guidex.com",

      category: category || "General",

      subject,

      message,

      startedBy: "Admin",

      conversation: [
        {
          sender: "Admin",

          message,

          sentAt: new Date(),

          isRead: false,
        },
      ],

      lastSender: "Admin",
    });

    res.status(201).json({
      success: true,

      message: "Conversation started",

      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};


export const createMentorContact = async (req, res) => {
  try {
    const { category, subject, message } = req.body;

    const studentId = req.user.id;

    if (!category || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Find mentor profile of logged in user
    const mentor = await Mentor.findOne({
      student: studentId,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found.",
      });
    }

    // Check existing active ticket
    let contact = await MentorContact.findOne({
      mentorId: mentor._id,
      subject,
      status: {
        $in: ["Pending", "In Progress"],
      },
    });

    if (contact) {
      contact.conversation.push({
        sender: "Mentor",
        message,
        sentAt: new Date(),
      });

      contact.lastMessageAt = new Date();

      await contact.save();

      return res.status(200).json({
        success: true,
        message: "Message added successfully.",
        contact,
      });
    }

    // Create new ticket
    contact = await MentorContact.create({
      mentorId: mentor._id,

      name: `${mentor.firstName} ${mentor.lastName}`,
      email: mentor.email,
      phone: mentor.phone,

      category,
      subject,
      message,

      lastMessageAt: new Date(),

      conversation: [
        {
          sender: "Mentor",
          message,
          sentAt: new Date(),
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Support request created successfully.",
      contact,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// Mentor Get Own Requests
// =====================================================

export const getMyMentorContacts = async (req, res) => {
  try {
    // find mentor profile using logged user

    const mentor = await Mentor.findOne({
      student: req.user.id,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,

        message: "Mentor profile not found",
      });
    }

    const contacts = await MentorContact.find({
      mentorId: mentor.id,
    }).sort({
      lastMessageAt: -1,
    });

    res.status(200).json({
      success: true,

      contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// Mentor Get Single Request
// =====================================================

export const getMentorContactById = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({
      student: req.user.id,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    const contact = await MentorContact.findOne({
      _id: req.params.id,
      mentorId: mentor._id,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Mentor Reply
// =====================================================

export const mentorReply = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    const mentor = await Mentor.findOne({
      student: req.user.id,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    const contact = await MentorContact.findOne({
      _id: req.params.id,
      mentorId: mentor._id,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    if (contact.status === "Resolved" || contact.status === "Closed") {
      return res.status(400).json({
        success: false,
        message: "Conversation already closed",
      });
    }

    contact.conversation.push({
      sender: "Mentor",
      message: message.trim(),
      sentAt: new Date(),
    });

    contact.replied = true;
    contact.repliedAt = new Date();
    contact.lastSender = "Mentor";
    contact.lastMessageAt = new Date();

    await contact.save();

    res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      contact,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ADMIN GET ALL MENTOR REQUESTS
// =====================================================

export const getAllMentorContacts = async (req, res) => {
  try {
    const contacts = await MentorContact.find()

      .populate("mentorId", "firstName lastName email profileImage")

      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,

      count: contacts.length,

      contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// ADMIN GET SINGLE REQUEST
// =====================================================

export const getAdminMentorContactById = async (req, res) => {
  try {
    const contact = await MentorContact.findById(req.params.id).populate(
      "mentorId",
      "firstName lastName email profileImage"
    );

    if (!contact) {
      return res.status(404).json({
        success: false,

        message: "Request not found",
      });
    }

    res.status(200).json({
      success: true,

      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// ADMIN REPLY TO MENTOR
// =====================================================

export const replyToMentor = async (req, res) => {
  try {
    const { adminReply, status } = req.body;

    const contact = await MentorContact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,

        message: "Request not found",
      });
    }

    contact.conversation.push({
      sender: "Admin",

      message: adminReply,

      sentAt: new Date(),
    });

    contact.status = status || contact.status;

    contact.replied = true;

    contact.repliedAt = new Date();

    contact.lastMessageAt = new Date();

    if (status === "Resolved") {
      contact.closedAt = new Date();
    }

    await contact.save();

    res.status(200).json({
      success: true,

      message: "Reply sent successfully",

      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// ADMIN UPDATE STATUS
// =====================================================

export const updateMentorContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const update = {
      status,
    };

    if (status === "Resolved") {
      update.closedAt = new Date();
    }

    const contact = await MentorContact.findByIdAndUpdate(
      req.params.id,

      update,

      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,

      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// ADMIN DELETE
// =====================================================

export const deleteMentorContact = async (req, res) => {
  try {
    await MentorContact.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,

      message: "Request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
