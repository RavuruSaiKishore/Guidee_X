import Blog from "../models/Blogs/Blog.js";
import BlogLike from "../models/Blogs/BlogLike.js";
import BlogComment from "../models/Blogs/BlogComment.js";
import BlogShare from "../models/Blogs/BlogShare.js";
import Student from "../models/Student.js";
import BlogView from "../models/Blogs/BlogView.js";

export const getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      status: "Published",
    })
      .sort({ publishedAt: -1, createdAt: -1 })
      .select(
        `
        _id
        title
        slug
        excerpt
        coverImage
        coverImageAlt
        category
        tags
        contentType
        difficulty
        author
        authorName
        authorImage
        authorBio
        status
        featured
        publishedAt
        views
        readingTime
        seoTitle
        seoDescription
        isTrending
        createdAt
        updatedAt
      `
      )
      .lean();

    // ==========================================
    // GET LIKE + SHARE COUNTS
    // ==========================================

    const blogsWithCounts = await Promise.all(
      blogs.map(async (blog) => {
        const [likesCount, sharesCount] = await Promise.all([
          BlogLike.countDocuments({
            blog: blog._id,
          }),

          BlogShare.countDocuments({
            blog: blog._id,
          }),
        ]);

        return {
          ...blog,

          // Actual like count
          likesCount,

          // Actual share count
          sharesCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: blogsWithCounts.length,
      blogs: blogsWithCounts,
    });
  } catch (error) {
    console.error("Get published blogs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};



export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;

    // ==========================================
    // GET LOGGED-IN USER PROFILE
    // ==========================================

    let user = null;

    if (req.user?.id) {
      user = await Student.findById(req.user.id).select(
        "_id firstName lastName profileImage"
      );
    }

    // ==========================================
    // GET BLOG
    // ==========================================

    const blog = await Blog.findOne({
      _id: blogId,
      status: "Published",
    })
      .populate(
        "relatedBlogs",
        "title slug excerpt coverImage category authorName readingTime publishedAt"
      )
      .lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // ==========================================
    // INCREASE VIEW COUNT
    // ONLY FOR LOGGED-IN STUDENTS
    // ==========================================

    if (req.user?.id) {
      try {
        // Check if this student has already viewed this blog
        const existingView = await BlogView.findOne({
          blog: blogId,
          student: req.user.id,
        });

        // If no previous view exists
        if (!existingView) {
          // Create a new BlogView record
          await BlogView.create({
            blog: blogId,
            student: req.user.id,
          });

          // Increase blog views count
          await Blog.findByIdAndUpdate(blogId, {
            $inc: {
              views: 1,
            },
          });

          // Update local blog object
          blog.views = (blog.views || 0) + 1;
        }
      } catch (viewError) {
        // Handle duplicate view race condition
        // without breaking the blog response

        if (viewError.code !== 11000) {
          console.error("Blog view tracking error:", viewError);
        }
      }
    }

    // ==========================================
    // GET LIKE COUNT
    // ==========================================

    const likesCount = await BlogLike.countDocuments({
      blog: blogId,
    });

    // ==========================================
    // GET SHARE COUNT
    // ==========================================

    const sharesCount = await BlogShare.countDocuments({
      blog: blogId,
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      blog: {
        ...blog,
        views: blog.views || 0,
        likesCount,
        sharesCount,
      },

      user,
    });
  } catch (error) {
    console.error("Get blog by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message,
    });
  }
};


export const toggleBlogLike = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.id;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const existingLike = await BlogLike.findOne({
      blog: blogId,
      user: userId,
    });

    if (existingLike) {
      // Unlike
      await BlogLike.findByIdAndDelete(existingLike._id);

      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $inc: {
            likes: -1,
          },
        },
        {
          new: true,
        }
      );

      return res.status(200).json({
        success: true,
        liked: false,
        likes: updatedBlog.likes,
        message: "Blog unliked",
      });
    }

    // Like
    await BlogLike.create({
      blog: blogId,
      user: userId,
    });

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $inc: {
          likes: 1,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      liked: true,
      likes: updatedBlog.likes,
      message: "Blog liked",
    });
  } catch (error) {
    console.error("Toggle blog like error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update like",
    });
  }
};


export const getBlogLikeStatus = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user._id;

    const liked = await BlogLike.exists({
      blog: blogId,
      user: userId,
    });

    const blog = await Blog.findById(blogId).select("likes");

    return res.status(200).json({
      success: true,
      liked: Boolean(liked),
      likes: blog?.likes || 0,
    });
  } catch (error) {
    console.error("Get like status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get like status",
    });
  }
};


export const addBlogComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { comment, parentComment } = req.body;

    const userId = req.user.id;

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment is required",
      });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (!blog.commentsEnabled) {
      return res.status(403).json({
        success: false,
        message: "Comments are disabled for this blog",
      });
    }

    const newComment = await BlogComment.create({
      blog: blogId,
      user: userId,
      comment: comment.trim(),
      parentComment: parentComment || null,
    });

    await Blog.findByIdAndUpdate(blogId, {
      $inc: {
        commentsCount: 1,
      },
    });

    const populatedComment = await BlogComment.findById(
      newComment._id
    ).populate("user", "firstName lastName profileImage");

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("Add blog comment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add comment",
    });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await BlogComment.find({
      blog: blogId,
      status: "Visible",
      parentComment: null,
    })
      .populate("user", "firstName lastName profileImage")
      .sort({
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Get blog comments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get comments",
    });
  }
};

export const deleteBlogComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await BlogComment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comment",
      });
    }

    await BlogComment.findByIdAndDelete(commentId);

    await Blog.findByIdAndUpdate(comment.blog, {
      $inc: {
        commentsCount: -1,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete comment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete comment",
    });
  }
};



export const shareBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const { platform = "copy" } = req.body;

    const blog = await Blog.findOne({
      _id: blogId,
      status: "Published",
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Get logged-in user
    const userId = req.user.id;

    // Create share record
    const share = await BlogShare.create({
      blog: blogId,
      user: userId,
      platform,
    });

    // Get total shares
    const sharesCount = await BlogShare.countDocuments({
      blog: blogId,
    });

    return res.status(200).json({
      success: true,
      message: "Blog shared successfully",
      share,
      sharesCount,
    });
  } catch (error) {
    console.error("Share blog error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to share blog",
      error: error.message,
    });
  }
};