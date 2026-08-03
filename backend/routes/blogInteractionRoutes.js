import express from "express";

import {
  getPublishedBlogs,
  getBlogById,
  toggleBlogLike,
  getBlogLikeStatus,
  addBlogComment,
  getBlogComments,
  deleteBlogComment,
  shareBlog,
} from "../controllers/blogInteractionController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/blogs", getPublishedBlogs);
router.get("/blogs/:blogId", protect, getBlogById);
router.post("/:blogId/like", protect, toggleBlogLike);

router.get("/:blogId/like-status", protect, getBlogLikeStatus);

router.post("/:blogId/comments", protect, addBlogComment);

router.get("/:blogId/comments", getBlogComments);

router.delete("/comments/:commentId", protect, deleteBlogComment);

router.post("/:blogId/share", protect, shareBlog);

export default router;
