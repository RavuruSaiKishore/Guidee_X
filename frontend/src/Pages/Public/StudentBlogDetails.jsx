import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  Clock,
  Eye,
  Heart,
  List,
  MessageCircle,
  MessageSquareOff,
  Share2,
  Tag,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const StudentBlogDetails = () => {
  const { id } = useParams();

  // ==========================================
  // BLOG
  // ==========================================

  const [blog, setBlog] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LIKE
  // ==========================================

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  // ==========================================
  // SHARE
  // ==========================================

  const [copied, setCopied] = useState(false);

  // ==========================================
  // COMMENTS
  // ==========================================

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // ==========================================
  // READING PROGRESS
  // ==========================================

  const [readingProgress, setReadingProgress] = useState(0);

  // ==========================================
  // GET IMAGE URL
  // ==========================================

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:")
    ) {
      return image;
    }

    return `${API_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
  };

  // ==========================================
  // SANITIZE / NORMALIZE BLOG HTML
  // ==========================================

  const sanitizeHtml = (html) => {
    if (!html) {
      return "";
    }

    // Browser-side HTML parsing.
    // This preserves HTML tags such as:
    // <h2>, <p>, <ul>, <ol>, <li>, <strong>, etc.
    const parser = new DOMParser();
    const document = parser.parseFromString(html, "text/html");

    // Remove potentially dangerous elements
    document
      .querySelectorAll("script, iframe, object, embed, style")
      .forEach((element) => element.remove());

    // Remove inline event handlers such as onclick
    document.querySelectorAll("*").forEach((element) => {
      [...element.attributes].forEach((attribute) => {
        if (attribute.name.toLowerCase().startsWith("on")) {
          element.removeAttribute(attribute.name);
        }
      });
    });

    return document.body.innerHTML;
  };

  // ==========================================
  // FETCH BLOG
  // ==========================================

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError("");

      const userToken = localStorage.getItem("UserToken");

      if (!userToken) {
        throw new Error("User token not found. Please login again.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/blog-interactions/blogs/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Blog response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch blog");
      }

      if (!data.success || !data.blog) {
        throw new Error("Blog data not found in response");
      }

      setBlog(data.blog);

      // ==========================================
      // LIKE DATA
      // ==========================================

      setLikes(data.blog.likesCount ?? data.blog.likes ?? 0);

      setLiked(
        data.blog.isLiked ??
          data.blog.likedByUser ??
          data.blog.userLiked ??
          false
      );
    } catch (error) {
      console.error("Fetch blog error:", error);

      setError(error.message || "Unable to load this blog.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH COMMENTS
  // ==========================================

  const fetchComments = async () => {
    if (!blog?.commentsEnabled) {
      setComments([]);
      return;
    }

    try {
      setCommentsLoading(true);

      const userToken = localStorage.getItem("UserToken");

      if (!userToken) {
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/blog-interactions/${id}/comments`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Comments response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch comments");
      }

      if (data.success) {
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error("Fetch comments error:", error);

      toast.error("Unable to load comments.");
    } finally {
      setCommentsLoading(false);
    }
  };

  // ==========================================
  // FETCH BLOG ON ID CHANGE
  // ==========================================

  useEffect(() => {
    if (!id) {
      setError("Blog ID is missing");
      setLoading(false);
      return;
    }

    fetchBlog();
  }, [id]);

  // ==========================================
  // FETCH COMMENTS AFTER BLOG LOAD
  // ==========================================

  useEffect(() => {
    if (!blog) {
      return;
    }

    if (blog.commentsEnabled === true) {
      fetchComments();
    } else {
      setComments([]);
    }
  }, [blog?.commentsEnabled, id]);

  // ==========================================
  // READING PROGRESS
  // ==========================================

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (documentHeight <= 0) {
        setReadingProgress(0);
        return;
      }

      const progress = (scrollTop / documentHeight) * 100;

      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [blog]);

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // ==========================================
  // SCROLL TO COMMENTS
  // ==========================================

  const scrollToComments = () => {
    if (!blog?.commentsEnabled) {
      return;
    }

    document.getElementById("comments-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // ==========================================
  // RECORD SHARE
  // ==========================================

  const recordShare = async (platform) => {
    if (!blog) {
      return;
    }

    try {
      const userToken = localStorage.getItem("UserToken");

      if (!userToken) {
        console.log("No UserToken found.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/blog-interactions/${blog._id}/share`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            platform,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to record share");
      }

      if (data.success) {
        setBlog((prev) =>
          prev
            ? {
                ...prev,
                sharesCount:
                  data.sharesCount ??
                  data.shares ??
                  (prev.sharesCount || 0) + 1,
              }
            : prev
        );
      }
    } catch (error) {
      console.error("Record share error:", error);
    }
  };

  // ==========================================
  // SHARE BLOG
  // ==========================================

  const handleShare = async () => {
    if (!blog) {
      return;
    }

    const shareUrl = window.location.href;

    const shareData = {
      title: blog.title,
      text: blog.excerpt || `Check out this article: ${blog.title}`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);

        await recordShare("other");

        return;
      }

      await navigator.clipboard.writeText(shareUrl);

      await recordShare("copy");

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      console.error("Share error:", error);

      toast.error("Unable to share this article.");
    }
  };

  // ==========================================
  // LIKE BLOG
  // ==========================================

  const handleLike = async () => {
    if (!blog) {
      return;
    }

    const userToken = localStorage.getItem("UserToken");

    if (!userToken) {
      toast.error("Please login to like this blog.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/blog-interactions/${blog._id}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to like blog");
      }

      if (data.success) {
        setLiked(data.liked);

        const updatedLikes =
          data.likes ??
          data.likesCount ??
          (data.liked ? likes + 1 : Math.max(0, likes - 1));

        setLikes(updatedLikes);

        setBlog((prev) =>
          prev
            ? {
                ...prev,
                likesCount: updatedLikes,
              }
            : prev
        );
      }
    } catch (error) {
      console.error("Like error:", error);

      toast.error(error.message || "Unable to like this blog.");
    }
  };

  // ==========================================
  // ADD COMMENT
  // ==========================================

  const handleComment = async () => {
    if (!blog?.commentsEnabled) {
      toast.info("Comments are disabled for this article.");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Please write a comment.");
      return;
    }

    const userToken = localStorage.getItem("UserToken");

    if (!userToken) {
      toast.error("Please login to comment.");
      return;
    }

    try {
      setCommentSubmitting(true);

      const response = await fetch(
        `${API_BASE_URL}/api/blog-interactions/${blog._id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            comment: commentText.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add comment");
      }

      if (data.success) {
        setComments((prev) => [data.comment, ...prev]);

        setCommentText("");

        toast.success("Comment added successfully!");
      }
    } catch (error) {
      console.error("Comment error:", error);

      toast.error(error.message || "Unable to add comment.");
    } finally {
      setCommentSubmitting(false);
    }
  };

  // ==========================================
  // COMMENT ENTER KEY
  // ==========================================

  const handleCommentKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      handleComment();
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-1 bg-slate-100" />

        <div className="mx-auto max-w-5xl px-6 py-12 lg:py-20">
          <div className="h-5 w-28 animate-pulse rounded bg-slate-200" />

          <div className="mt-8 h-6 w-32 animate-pulse rounded-full bg-indigo-100" />

          <div className="mt-6 h-14 w-full animate-pulse rounded bg-slate-200" />

          <div className="mt-4 h-14 w-4/5 animate-pulse rounded bg-slate-200" />

          <div className="mt-7 h-6 w-3/5 animate-pulse rounded bg-slate-100" />

          <div className="mt-8 flex gap-4">
            <div className="h-10 w-32 animate-pulse rounded bg-slate-100" />
            <div className="h-10 w-24 animate-pulse rounded bg-slate-100" />
          </div>

          <div className="mt-12 aspect-[16/8] animate-pulse rounded-3xl bg-slate-200" />

          <div className="mx-auto mt-16 max-w-3xl space-y-5">
            <div className="h-5 animate-pulse rounded bg-slate-200" />
            <div className="h-5 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !blog) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-emerald-50 px-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
            <BookOpen size={28} className="text-indigo-600" />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-slate-950">
            Blog Not Found
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {error ||
              "The article you are looking for does not exist or has been removed."}
          </p>

          <Link
            to="/blogs"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <ArrowLeft size={17} />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN
  // ==========================================

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer position="top-right" autoClose={2500} />

      {/* ==========================================
          READING PROGRESS
      ========================================== */}

      <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-slate-100">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 transition-all duration-150"
          style={{
            width: `${readingProgress}%`,
          }}
        />
      </div>

      {/* ==========================================
          BREADCRUMB
      ========================================== */}

      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
          <div className="flex items-center gap-2 text-sm">
            <Link
              to="/blogs"
              className="font-medium text-indigo-600 transition hover:text-indigo-700"
            >
              GuideX Blog
            </Link>

            <span className="text-slate-300">/</span>

            <span className="truncate text-slate-500">
              {blog.category || "Article"}
            </span>
          </div>
        </div>
      </div>

      {/* ==========================================
          ARTICLE HEADER
      ========================================== */}

      <header className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 py-14 lg:px-8 lg:py-20">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft size={17} />
            Back to all articles
          </Link>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {blog.category && (
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700">
                {blog.category}
              </span>
            )}

            {blog.contentType && (
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">
                {blog.contentType}
              </span>
            )}

            {blog.difficulty && (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
                {blog.difficulty}
              </span>
            )}
          </div>

          <h1 className="mt-7 max-w-5xl text-4xl font-bold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-600 lg:text-xl">
              {blog.excerpt}
            </p>
          )}

          <div className="mt-9 flex flex-wrap items-center gap-5">
            {/* AUTHOR */}

            <div className="flex items-center gap-3">
              {blog.authorImage ? (
                <img
                  src={getImageUrl(blog.authorImage)}
                  alt={blog.authorName || "Author"}
                  className="h-11 w-11 rounded-full object-cover ring-4 ring-white shadow-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white ring-4 ring-white shadow-sm">
                  {(blog.authorName || "G").charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <p className="text-sm font-bold text-slate-900">
                  {blog.authorName || "GuideX Team"}
                </p>

                <p className="text-xs text-slate-500">
                  {blog.author || "GuideX"}
                </p>
              </div>
            </div>

            <div className="hidden h-8 w-px bg-slate-200 sm:block" />

            {/* DATE */}

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays size={16} className="text-indigo-500" />

              {formatDate(blog.publishedAt || blog.createdAt)}
            </div>

            {/* READING TIME */}

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock size={16} className="text-emerald-500" />
              {blog.readingTime || 1} min read
            </div>

            {/* VIEWS */}

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Eye size={16} className="text-violet-500" />

              {blog.views || 0}
            </div>
          </div>
        </div>
      </header>

      {/* ==========================================
          COVER IMAGE
      ========================================== */}

      <section className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="relative -mt-2 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-2xl shadow-slate-200/60">
          {blog.coverImage ? (
            <img
              src={getImageUrl(blog.coverImage)}
              alt={blog.coverImageAlt || blog.title}
              className="aspect-[16/8] w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="flex aspect-[16/8] items-center justify-center bg-gradient-to-br from-indigo-100 via-violet-50 to-emerald-100">
              <BookOpen size={80} className="text-indigo-300" />
            </div>
          )}
        </div>
      </section>

      {/* ==========================================
          MAIN ARTICLE
      ========================================== */}

      <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,760px)_280px] lg:justify-center">
          {/* ==========================================
              ARTICLE
          ========================================== */}

          <article className="min-w-0">
            {/* MOBILE ARTICLE INFO */}

            <div className="mb-10 flex flex-wrap gap-3 lg:hidden">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-400">Reading Time</p>

                <p className="mt-1 text-sm font-bold text-slate-900">
                  {blog.readingTime || 1} min
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-400">Views</p>

                <p className="mt-1 text-sm font-bold text-slate-900">
                  {blog.views || 0}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-400">Shares</p>

                <p className="mt-1 text-sm font-bold text-slate-900">
                  {blog.sharesCount || 0}
                </p>
              </div>
            </div>

            {/* ==========================================
                ARTICLE CONTENT
            ========================================== */}

            {/* ==========================================
    ARTICLE CONTENT
========================================== */}

            <div
              className="
    blog-content
    max-w-none

    [&_h1]:mb-6
    [&_h1]:mt-12
    [&_h1]:text-4xl
    [&_h1]:font-extrabold
    [&_h1]:leading-tight
    [&_h1]:tracking-tight
    [&_h1]:text-slate-950

    [&_h2]:mb-5
    [&_h2]:mt-14
    [&_h2]:text-3xl
    [&_h2]:font-bold
    [&_h2]:leading-tight
    [&_h2]:tracking-tight
    [&_h2]:text-slate-950

    [&_h3]:mb-4
    [&_h3]:mt-10
    [&_h3]:text-2xl
    [&_h3]:font-bold
    [&_h3]:leading-tight
    [&_h3]:text-slate-950

    [&_h4]:mb-3
    [&_h4]:mt-8
    [&_h4]:text-xl
    [&_h4]:font-bold
    [&_h4]:text-slate-900

    [&_p]:my-6
    [&_p]:text-[17px]
    [&_p]:font-normal
    [&_p]:leading-[1.9]
    [&_p]:text-slate-600

    [&_strong]:font-bold
    [&_strong]:text-slate-900

    [&_em]:italic
    [&_em]:text-slate-700

    [&_ul]:my-6
    [&_ul]:list-disc
    [&_ul]:space-y-2
    [&_ul]:pl-7

    [&_ol]:my-6
    [&_ol]:list-decimal
    [&_ol]:space-y-2
    [&_ol]:pl-7

    [&_li]:text-[17px]
    [&_li]:leading-8
    [&_li]:text-slate-600

    [&_a]:font-semibold
    [&_a]:text-indigo-600
    [&_a]:underline
    [&_a]:underline-offset-4
    [&_a]:transition
    [&_a:hover]:text-indigo-700

    [&_blockquote]:my-8
    [&_blockquote]:rounded-r-2xl
    [&_blockquote]:border-l-4
    [&_blockquote]:border-indigo-500
    [&_blockquote]:bg-indigo-50
    [&_blockquote]:px-6
    [&_blockquote]:py-5
    [&_blockquote]:italic
    [&_blockquote]:leading-8
    [&_blockquote]:text-slate-600

    [&_code]:rounded-md
    [&_code]:bg-slate-100
    [&_code]:px-1.5
    [&_code]:py-1
    [&_code]:font-mono
    [&_code]:text-sm
    [&_code]:font-semibold
    [&_code]:text-indigo-700

    [&_pre]:my-8
    [&_pre]:overflow-x-auto
    [&_pre]:rounded-2xl
    [&_pre]:bg-slate-950
    [&_pre]:p-6
    [&_pre]:text-sm
    [&_pre]:leading-7
    [&_pre]:text-slate-100
    [&_pre]:shadow-xl

    [&_img]:my-10
    [&_img]:w-full
    [&_img]:rounded-2xl
    [&_img]:object-cover
    [&_img]:shadow-lg

    [&_hr]:my-10
    [&_hr]:border-slate-200

    [&_table]:my-8
    [&_table]:w-full
    [&_table]:border-collapse

    [&_th]:border
    [&_th]:border-slate-200
    [&_th]:bg-slate-50
    [&_th]:px-4
    [&_th]:py-3
    [&_th]:text-left
    [&_th]:font-bold
    [&_th]:text-slate-900

    [&_td]:border
    [&_td]:border-slate-200
    [&_td]:px-4
    [&_td]:py-3
    [&_td]:text-slate-600
  "
              dangerouslySetInnerHTML={{
                __html: blog.content || "",
              }}
            />

            {/* ==========================================
                TAGS
            ========================================== */}

            {blog.tags?.length > 0 && (
              <div className="mt-14 border-t border-slate-200 pt-8">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Tag size={17} className="text-indigo-600" />
                  Topics
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ==========================================
                ENGAGEMENT ACTION BAR
            ========================================== */}

            <div className="mt-12 border-y border-slate-200 py-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  {/* LIKE */}

                  <button
                    onClick={handleLike}
                    className={`group flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all ${
                      liked
                        ? "border-red-200 bg-red-50 text-red-600"
                        : "border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    }`}
                  >
                    <Heart size={18} fill={liked ? "currentColor" : "none"} />

                    <span>{likes}</span>

                    <span className="hidden sm:inline">
                      {liked ? "Liked" : "Like"}
                    </span>
                  </button>

                  {/* COMMENTS */}

                  {blog.commentsEnabled === true && (
                    <button
                      onClick={scrollToComments}
                      className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <MessageCircle size={18} />

                      <span>{comments.length}</span>

                      <span className="hidden sm:inline">
                        {comments.length === 1 ? "Comment" : "Comments"}
                      </span>
                    </button>
                  )}

                  {/* SHARE */}

                  <button
                    onClick={handleShare}
                    className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                  >
                    {copied ? <Check size={18} /> : <Share2 size={18} />}

                    <span>{copied ? "Link Copied" : "Share"}</span>

                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                      {blog.sharesCount || 0}
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Eye size={16} />

                  <span>{blog.views || 0} views</span>
                </div>
              </div>
            </div>

            {/* ==========================================
                AUTHOR CARD
            ========================================== */}

            <div className="mt-12 overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-7 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                {blog.authorImage ? (
                  <img
                    src={getImageUrl(blog.authorImage)}
                    alt={blog.authorName || "Author"}
                    className="h-20 w-20 rounded-2xl object-cover shadow-md"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white shadow-md">
                    {(blog.authorName || "G").charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    About the Author
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-slate-950">
                    {blog.authorName || "GuideX Team"}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {blog.authorBio ||
                      "Sharing practical knowledge and insights to help students and professionals grow their technology careers."}
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* ==========================================
              SIDEBAR
          ========================================== */}

          <aside className="hidden lg:block">
            <div className="sticky top-8 space-y-6">
              {/* TABLE OF CONTENTS */}

              {blog.tableOfContents?.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2">
                    <List size={18} className="text-indigo-600" />

                    <h3 className="font-bold text-slate-900">
                      In This Article
                    </h3>
                  </div>

                  <div className="mt-5 space-y-3">
                    {blog.tableOfContents.map((item, index) => (
                      <a
                        key={item.id || index}
                        href={`#${item.id}`}
                        className={`block text-sm leading-5 text-slate-500 transition hover:text-indigo-600 ${
                          item.level === 2 ? "pl-4" : ""
                        }`}
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* ARTICLE INFORMATION */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="font-bold text-slate-900">
                  Article Information
                </h3>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">Category</span>

                    <span className="text-right text-sm font-semibold text-slate-900">
                      {blog.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">Difficulty</span>

                    <span className="text-sm font-semibold text-slate-900">
                      {blog.difficulty || "Beginner"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">Read Time</span>

                    <span className="text-sm font-semibold text-slate-900">
                      {blog.readingTime || 1} min
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">Views</span>

                    <span className="text-sm font-semibold text-slate-900">
                      {blog.views || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">Likes</span>

                    <span className="text-sm font-semibold text-slate-900">
                      {likes || 0}
                    </span>
                  </div>

                  {blog.commentsEnabled === true && (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-500">Comments</span>

                      <span className="text-sm font-semibold text-slate-900">
                        {comments.length}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">Shares</span>

                    <span className="text-sm font-semibold text-slate-900">
                      {blog.sharesCount || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* SHARE CARD */}

              <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-lg shadow-indigo-500/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                  <Share2 size={19} />
                </div>

                <h3 className="mt-5 font-bold">Found this useful?</h3>

                <p className="mt-2 text-sm leading-6 text-indigo-100">
                  Share this article with someone who might find it helpful.
                </p>

                <button
                  onClick={handleShare}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
                >
                  {copied ? <Check size={17} /> : <Share2 size={17} />}

                  {copied ? "Link Copied" : "Share Article"}
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* ==========================================
            COMMENTS SECTION
        ========================================== */}

        <section
          id="comments-section"
          className="mx-auto mt-20 max-w-5xl scroll-mt-24"
        >
          {blog.commentsEnabled === true ? (
            <>
              {/* HEADER */}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50">
                    <MessageCircle size={21} className="text-indigo-600" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-slate-950">
                      Join the Conversation
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {comments.length}{" "}
                      {comments.length === 1 ? "comment" : "comments"}
                    </p>
                  </div>
                </div>
              </div>

              {/* COMMENT INPUT */}

              <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-indigo-50/40 p-5 sm:p-6">
                <div className="flex gap-4">
                  <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white sm:flex">
                    {blog.authorName?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <textarea
                      id="comment-input"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={handleCommentKeyDown}
                      placeholder="What are your thoughts on this article?"
                      rows={4}
                      maxLength={1000}
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm leading-6 text-slate-700 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />

                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-slate-400">
                          Press Enter to post
                        </p>

                        <span className="text-xs text-slate-300">•</span>

                        <p className="text-xs text-slate-400">
                          {commentText.length}/1000
                        </p>
                      </div>

                      <button
                        onClick={handleComment}
                        disabled={commentSubmitting || !commentText.trim()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {commentSubmitting ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Posting...
                          </>
                        ) : (
                          <>
                            Post Comment
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* COMMENTS LIST */}

              <div className="mt-10">
                {commentsLoading ? (
                  <div className="space-y-5">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="animate-pulse rounded-2xl border border-slate-100 bg-white p-6"
                      >
                        <div className="flex gap-4">
                          <div className="h-11 w-11 rounded-full bg-slate-200" />

                          <div className="flex-1">
                            <div className="h-4 w-32 rounded bg-slate-200" />

                            <div className="mt-3 h-3 w-20 rounded bg-slate-100" />

                            <div className="mt-5 h-4 w-full rounded bg-slate-100" />

                            <div className="mt-2 h-4 w-4/5 rounded bg-slate-100" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : comments.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <MessageCircle size={28} className="text-indigo-400" />
                    </div>

                    <h4 className="mt-5 text-lg font-bold text-slate-900">
                      No comments yet
                    </h4>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                      Be the first to share your thoughts, ask a question, or
                      start a discussion about this article.
                    </p>

                    <button
                      onClick={() =>
                        document.querySelector("#comment-input")?.focus()
                      }
                      className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      Start the Conversation
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {comments.map((item) => {
                      const user = item.user || {};

                      const fullName =
                        `${user.firstName || ""} ${
                          user.lastName || ""
                        }`.trim() || "GuideX User";

                      return (
                        <div
                          key={item._id}
                          className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-indigo-100 hover:shadow-md sm:p-6"
                        >
                          <div className="flex gap-4">
                            {user.profileImage ? (
                              <img
                                src={getImageUrl(user.profileImage)}
                                alt={fullName}
                                className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-indigo-50"
                              />
                            ) : (
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
                                {fullName.charAt(0).toUpperCase()}
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-900">
                                  {fullName}
                                </h4>

                                <span className="h-1 w-1 rounded-full bg-slate-300" />

                                <span className="text-xs text-slate-400">
                                  {formatDate(item.createdAt)}
                                </span>
                              </div>

                              <p className="mt-3 text-sm leading-7 text-slate-600">
                                {item.comment}
                              </p>

                              <div className="mt-4 flex items-center gap-5">
                                <button className="text-xs font-semibold text-slate-400 transition hover:text-indigo-600">
                                  Reply
                                </button>

                                <button className="text-xs font-semibold text-slate-400 transition hover:text-red-500">
                                  Like
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
              <div className="relative px-6 py-14 text-center sm:px-10 sm:py-16">
                <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-indigo-100/50 blur-3xl" />

                <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-violet-100/50 blur-3xl" />

                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <MessageSquareOff size={28} className="text-slate-400" />
                </div>

                <h3 className="relative mt-6 text-2xl font-bold text-slate-900">
                  Comments are currently disabled
                </h3>

                <p className="relative mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">
                  The author or administrator has disabled comments for this
                  article. You can still read the article and share it with
                  others.
                </p>

                <div className="relative mx-auto mt-7 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  Discussion unavailable for this article
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ==========================================
            RELATED BLOGS
        ========================================== */}

        {blog.relatedBlogs?.length > 0 && (
          <section className="mt-20 border-t border-slate-200 pt-16">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
                  Keep Reading
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-950">
                  Related Articles
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Continue exploring topics related to this article.
                </p>
              </div>

              <Link
                to="/blogs"
                className="hidden items-center gap-2 text-sm font-bold text-indigo-600 sm:flex"
              >
                View All
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="mt-9 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {blog.relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog._id}
                  to={`/blogs/${relatedBlog._id}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-indigo-100 to-emerald-100">
                    {relatedBlog.coverImage ? (
                      <img
                        src={getImageUrl(relatedBlog.coverImage)}
                        alt={relatedBlog.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen size={40} className="text-indigo-300" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <span className="text-xs font-bold text-indigo-600">
                      {relatedBlog.category}
                    </span>

                    <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-slate-950 transition group-hover:text-indigo-600">
                      {relatedBlog.title}
                    </h3>

                    {relatedBlog.excerpt && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                        {relatedBlog.excerpt}
                      </p>
                    )}

                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {formatDate(
                          relatedBlog.publishedAt || relatedBlog.createdAt
                        )}
                      </span>

                      <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600">
                        Read
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default StudentBlogDetails;
