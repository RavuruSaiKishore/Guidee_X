import FAQ from "../models/FAQ.js"


export const getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      count: faqs.length,
      faqs,
    });
  } catch (error) {
    console.error("Get FAQs Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQs",
      error: error.message,
    });
  }
};


export const getFAQById = async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findById(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.status(200).json({
      success: true,
      faq,
    });
  } catch (error) {
    console.error("Get FAQ Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQ",
      error: error.message,
    });
  }
};


export const createFAQ = async (req, res) => {
  try {
    const { question, answer, category } = req.body;

    // Validate question
    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // Validate answer
    if (!answer || !answer.trim()) {
      return res.status(400).json({
        success: false,
        message: "Answer is required",
      });
    }

    // Validate category
    const allowedCategories = [
      "General",
      "Booking",
      "Cancellation",
      "Payment",
      "Meeting",
      "Mentor",
      "Account",
    ];

    const faqCategory = category || "General";

    if (!allowedCategories.includes(faqCategory)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ category",
      });
    }

    const faq = await FAQ.create({
      question: question.trim(),
      answer: answer.trim(),
      category: faqCategory,
      createdBy: req.user?.id || null,
    });

    res.status(201).json({
      success: true,
      message: "FAQ created successfully",
      faq,
    });
  } catch (error) {
    console.error("Create FAQ Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create FAQ",
      error: error.message,
    });
  }
};


export const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;

    const { question, answer, category } = req.body;

    // Validate question
    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // Validate answer
    if (!answer || !answer.trim()) {
      return res.status(400).json({
        success: false,
        message: "Answer is required",
      });
    }

    // Validate category
    const allowedCategories = [
      "General",
      "Booking",
      "Cancellation",
      "Payment",
      "Meeting",
      "Mentor",
      "Account",
    ];

    const faqCategory = category || "General";

    if (!allowedCategories.includes(faqCategory)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ category",
      });
    }

    const faq = await FAQ.findByIdAndUpdate(
      id,
      {
        question: question.trim(),
        answer: answer.trim(),
        category: faqCategory,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
      faq,
    });
  } catch (error) {
    console.error("Update FAQ Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update FAQ",
      error: error.message,
    });
  }
};


export const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findByIdAndDelete(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    console.error("Delete FAQ Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete FAQ",
      error: error.message,
    });
  }
};


export const getActiveFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({
      isActive: true,
    })
      .sort({
        category: 1,
        createdAt: -1,
      })
      .lean();

    res.status(200).json({
      success: true,
      count: faqs.length,
      faqs,
    });
  } catch (error) {
    console.error("Get Active FAQs Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQs",
      error: error.message,
    });
  }
};


export const toggleFAQStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findById(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    faq.isActive = !faq.isActive;

    await faq.save();

    res.status(200).json({
      success: true,
      message: faq.isActive
        ? "FAQ activated successfully"
        : "FAQ deactivated successfully",
      faq,
    });
  } catch (error) {
    console.error("Toggle FAQ Status Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update FAQ status",
      error: error.message,
    });
  }
};


