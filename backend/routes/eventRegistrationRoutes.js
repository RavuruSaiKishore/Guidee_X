import express from "express";

import {
  registerForEvent,
  getMyRegisteredEvents,
  cancelEventRegistration,
  getMyEventRegistrations,
  getMyEventRegistrationDetails,
} from "../controllers/eventRegistrationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my-registrations/:id", protect, getMyEventRegistrationDetails);


router.post("/register/:eventId", protect, registerForEvent);

router.get("/my-events", protect, getMyRegisteredEvents);

router.put("/cancel/:eventId", protect, cancelEventRegistration);
router.get("/my-registrations", protect, getMyEventRegistrations);

router.put("/cancel/:eventId", protect, cancelEventRegistration);



export default router;
