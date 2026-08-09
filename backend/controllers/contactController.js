import Contact from "../models/Contact.js";
import createAuditLog from "../utils/createAuditLog.js";


// Create Contact Message
export const createContact = async (req, res) => {
  try {
    const { name, email, phone, category, subject, message } = req.body;

    if (!name || !email || !category || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const studentId = req.user.id;

    // Check if same issue already exists
    let contact = await Contact.findOne({
      studentId,
      subject,
      status: {
        $in: ["Pending", "In Progress"],
      },
    });

    // If ticket exists add message
    if (contact) {
      contact.conversation.push({
        sender: "Student",
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

    // Otherwise create new ticket
    contact = await Contact.create({
      name,
      email,
      phone,

      studentId,

      category,

      subject,

      message,

      status: "Pending",

      lastMessageAt: new Date(),

      conversation: [
        {
          sender: "Student",
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
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Server Error",
    });
  }
};

export const getMyContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({
      studentId: req.user._id,
    }).sort({ createdAt: -1 });

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

export const getMyRequests = async (req, res) => {
  try {
    const requests = await Contact.find({
      studentId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch support requests.",
    });
  }
};

export const getSingleRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Contact.findOne({
      _id: id,
      studentId: req.user.id,
    });

    if (!request) {
      return res.status(404).json({
        message: "Support request not found.",
      });
    }

    res.status(200).json(request);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch support request.",
    });
  }
};

// ====================================================
// Student Reply
// ====================================================

export const replyToRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty.",
      });
    }

    const ticket = await Contact.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found.",
      });
    }

    // Only owner can reply
    if (ticket.studentId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // Don't allow reply after resolved
    if (ticket.status === "Resolved" || ticket.status === "Closed") {
      return res.status(400).json({
        success: false,
        message: "This support request has already been resolved.",
      });
    }

    ticket.conversation.push({
      sender: "Student",
      message,
      sentAt: new Date(),
    });

    ticket.lastMessageAt = new Date();

    await ticket.save();

     
    res.status(200).json({
      success: true,
      message: "Reply sent successfully.",
      ticket,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
