import express from "express";
import {
  createDispute,
  getDisputes,
  getDisputeById,
  addDisputeMessage,
  resolveDispute,
} from "../controllers/disputeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createDispute);
router.get("/", protect, getDisputes);
router.get("/:disputeId", protect, getDisputeById);
router.post("/:disputeId/message", protect, addDisputeMessage);
router.put("/:disputeId/resolve", protect, resolveDispute);

export default router;
