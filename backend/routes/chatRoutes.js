import express from "express";
import {
  handleChatBotMessage,
  handleCareerHubAI,
} from "../controllers/chatController.js";
// Optional: Add your authentication middleware if you want only logged-in users to use the chatbot
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/message", protect, handleChatBotMessage);
router.post("/ai-hub", protect, handleCareerHubAI);

export default router;
