import express from "express";
import {
  createContact,
  getMyContacts,
  getMyRequests,
  getSingleRequest,
  replyToRequest,
} from "../controllers/contactController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student
router.post("/", protect, createContact);
router.get("/my", protect, getMyContacts);
router.get("/my-requests", protect, getMyRequests);
router.get("/:id", protect, getSingleRequest);
router.post("/:id/reply", protect, replyToRequest);



export default router;
