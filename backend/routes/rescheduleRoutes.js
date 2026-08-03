import express from "express";

import {
  createRescheduleRequest,
  getMyRescheduleRequests,
  acceptRescheduleRequest,
  rejectRescheduleRequest,
} from "../controllers/rescheduleController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
==========================================================
MENTOR
Send reschedule request
==========================================================
*/

router.post("/request/:bookingId", protect, createRescheduleRequest);

/*
==========================================================
STUDENT
Get all reschedule requests
==========================================================
*/

router.get("/my-requests", protect, getMyRescheduleRequests);

/*
==========================================================
STUDENT
Accept
==========================================================
*/

router.patch("/:requestId/accept", protect, acceptRescheduleRequest);

/*
==========================================================
STUDENT
Reject
==========================================================
*/

router.patch("/:requestId/reject", protect, rejectRescheduleRequest);

export default router;
