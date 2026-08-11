import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// GuideX Application Knowledge Base
const guideXKnowledgeBase = `
- Application Name: GuideX
- Tagline: Learn. Connect. Grow.
- Core Roles: Student, Mentor, and Admin.
- Authentication Features: 
  1. Email/Password registration secured with a 6-digit OTP (expires in 10 minutes, auto-deleted via MongoDB TTL index).
  2. Google OAuth login support.
  3. Forgot Password & Reset Password flow via OTP.
  4. Account security features including exponential backoff lockout after 5 failed login attempts and session invalidation across devices (tokenVersion tracking).
- Tech Stack: React, Vite, Tailwind CSS, Node.js, Express, MongoDB.
`;

export const handleChatBotMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res
        .status(400)
        .json({ success: false, message: "Message is required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash", // 👈 Updated to a currently supported active model ID
      contents: message,
      config: {
        systemInstruction: `
          You are the official, dedicated customer support and documentation assistant for "GuideX".
          
          KNOWLEDGE BASE ABOUT GUIDEX:
          ${guideXKnowledgeBase}

          STRICT RULES YOU MUST FOLLOW:
          1. You ONLY have knowledge about the GuideX application, its features, authentication rules, workflows, and roles.
          2. If a user asks about anything unrelated to GuideX (such as general coding help outside of GuideX, weather, history, recipes, or other platforms), you must politely decline by saying: "I am specialized exclusively in GuideX. I can only assist you with questions, features, or troubleshooting related to the GuideX platform."
          3. Never make up external facts or technical specifications that contradict the knowledge base provided.
        `,
      },
    });

    return res.status(200).json({
      success: true,
      reply: response.text,
    });
  } catch (error) {
    console.error("Detailed GuideX Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch response from GuideX AI",
      error: error.message,
    });
  }
};
