import express from "express";

import {
  createResource,
  getAllResourcesAdmin,
  getResourceById,
  AdmingetResourceById,
  updateResource,
  deleteResource,
  getPublishedResources,
  toggleResourceStatus,
  toggleResourceLike,
  trackResourceView,
  getAdminResourceDetails,
} from "../controllers/ResourceController.js";

import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// =====================================================
// ADMIN RESOURCE ROUTES
// =====================================================

// Create Resource
router.post(
  "/create",
  protect,
  upload.fields([
    {
      name: "file",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  createResource
);

// Get All Resources - Admin
router.get("/admin/all", protect, getAllResourcesAdmin);

// Update Resource
router.put("/update/:id", protect, upload.single("file"), updateResource);

router.get("/admin/:id", protect, AdmingetResourceById);

router.get("/details/:id", protect, getAdminResourceDetails);

// Delete Resource
router.delete("/delete/:id", protect, deleteResource);

// Toggle Published / Draft
router.patch("/toggle-status/:id", protect, toggleResourceStatus);

router.get("/published", protect, getPublishedResources);

router.get("/published/:id", protect, getResourceById);

router.post("/:id/view", protect, trackResourceView);

router.post("/:id/like", protect, toggleResourceLike);

export default router;
