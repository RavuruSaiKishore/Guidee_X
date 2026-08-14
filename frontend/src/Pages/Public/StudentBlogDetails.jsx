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
  Bookmark,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const StudentBlogDetails = () => {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const [readingProgress, setReadingProgress] = useState(0);

  const getImageUrl = (image) => {
    if (!image) return "";
    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:")
    ) {
      return image;
    }
    return `${API_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
  };

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

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch blog");
      }

      if (!data.success || !data.blog) {
        throw new Error("Blog data not found in response");
      }

      setBlog(data.blog);
      setLikes(data.blog.likesCount ?? data.blog.likes ?? 0);
      setLiked(
        data.blog.isLiked ??
          data.blog.likedByUser ??
          data.blog.userLiked ??
          false
      );
    } catch (error) {
      setError(error.message || "Unable to load this blog.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!blog?.commentsEnabled) {
      setComments([]);
      return;
    }

    try {
      setCommentsLoading(true);
      const userToken = localStorage.getItem("UserToken");
      if (!userToken) return;

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
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch comments");
      }

      if (data.success) {
        setComments(data.comments || []);
      }
    } catch (error) {
      toast.error("Unable to load comments.");
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setError("Blog ID is missing");
      setLoading(false);
      return;
    }
    fetchBlog();
  }, [id]);

  useEffect(() => {
    if (!blog) return;
    if (blog.commentsEnabled === true) {
      fetchComments();
    } else {
      setComments([]);
    }
  }, [blog?.commentsEnabled, id]);

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
    return () => window.removeEventListener("scroll", handleScroll);
  }, [blog]);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const scrollToComments = () => {
    if (!blog?.commentsEnabled) return;
    document.getElementById("comments-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const recordShare = async (platform) => {
    if (!blog) return;
    try {
      const userToken = localStorage.getItem("UserToken");
      if (!userToken) return;

      const response = await fetch(
        `${API_BASE_URL}/api/blog-interactions/${blog._id}/share`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ platform }),
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
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
      console.error(error);
    }
  };

  const handleShare = async () => {
    if (!blog) return;
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
      setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      if (error.name === "AbortError") return;
      toast.error("Unable to share this article.");
    }
  };

  const handleLike = async () => {
    if (!blog) return;
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
          prev ? { ...prev, likesCount: updatedLikes } : prev
        );
      }
    } catch (error) {
      toast.error(error.message || "Unable to like this blog.");
    }
  };

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
          body: JSON.stringify({ comment: commentText.trim() }),
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
      toast.error(error.message || "Unable to add comment.");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleCommentKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleComment();
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-xs font-semibold" style={{ fontWeight: 600 }}>
            Loading professional article...
          </p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-900"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
            <BookOpen size={24} />
          </div>
          <h2 className="text-base font-semibold" style={{ fontWeight: 600 }}>
            Article Not Found
          </h2>
          <p
            className="mt-2 text-xs text-slate-500 font-medium"
            style={{ fontWeight: 600 }}
          >
            {error ||
              "The article you are looking for does not exist or has been removed."}
          </p>
          <Link
            to="/blogs"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800"
            style={{ fontWeight: 600 }}
          >
            <ArrowLeft size={14} className="text-blue-400" />
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 pb-16 selection:bg-blue-600 selection:text-white"
      style={{ fontFamily: "'Poppins', sans-serif", fontStyle: "normal" }}
    >
      <ToastContainer position="top-right" autoClose={2500} />

      {/* ==========================================
          READING PROGRESS BAR
      ========================================== */}
      <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-slate-200">
        <div
          className="h-full bg-blue-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* ==========================================
          TOP NAVIGATION BAR
      ========================================== */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-2xs">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-blue-600 transition"
            style={{ fontWeight: 600 }}
          >
            <ArrowLeft size={15} className="text-blue-600" />
            <span>Back to Feed</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2.5 rounded-xl border transition ${
                bookmarked
                  ? "bg-black text-white border-black"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
              title="Bookmark article"
            >
              <Bookmark
                size={15}
                className={bookmarked ? "text-blue-400" : ""}
              />
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
              title="Share article"
            >
              {copied ? (
                <Check size={15} className="text-emerald-600" />
              ) : (
                <Share2 size={15} className="text-blue-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ==========================================
          ARTICLE HERO HEADER
      ========================================== */}
      <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {blog.category && (
              <span
                className="rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700"
                style={{ fontWeight: 600 }}
              >
                {blog.category}
              </span>
            )}
            {blog.difficulty && (
              <span
                className="rounded-full border border-slate-200 bg-slate-100 px-3.5 py-1 text-xs font-semibold text-slate-700"
                style={{ fontWeight: 600 }}
              >
                {blog.difficulty}
              </span>
            )}
          </div>

          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-950 leading-snug"
            style={{ fontWeight: 600 }}
          >
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p
              className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-4xl"
              style={{ fontWeight: 600 }}
            >
              {blog.excerpt}
            </p>
          )}

          {/* Author & Meta Bar */}
          <div className="pt-4 pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              {blog.authorImage ? (
                <img
                  src={getImageUrl(blog.authorImage)}
                  alt={blog.authorName || "Author"}
                  className="h-10 w-10 rounded-xl object-cover shadow-2xs border border-slate-200"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white text-xs font-semibold shadow-2xs"
                  style={{ fontWeight: 600 }}
                >
                  {(blog.authorName || "G").charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p
                  className="text-xs font-semibold text-slate-900"
                  style={{ fontWeight: 600 }}
                >
                  {blog.authorName || "GuideX Editorial"}
                </p>
                <p
                  className="text-[10px] text-slate-500 font-medium"
                  style={{ fontWeight: 600 }}
                >
                  Published on {formatDate(blog.publishedAt || blog.createdAt)}
                </p>
              </div>
            </div>

            <div
              className="flex items-center gap-3 text-xs font-semibold text-slate-500"
              style={{ fontWeight: 600 }}
            >
              <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <Clock size={13} className="text-blue-600" />
                {blog.readingTime || 1} min read
              </span>
              <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <Eye size={13} className="text-blue-600" />
                {blog.views || 0} views
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          MAIN ARTICLE BODY & SIDEBAR CONTAINER (FIXED OVERFLOW & CROSSING)
      ========================================== */}
      <main className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ARTICLE CONTENT (Flexible layout to prevent container breaking) */}
          <article className="w-full lg:flex-1 min-w-0 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs overflow-hidden">
            {/* Featured Cover Image inside article flow */}
            {blog.coverImage && (
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 mb-8">
                <img
                  src={getImageUrl(blog.coverImage)}
                  alt={blog.coverImageAlt || blog.title}
                  className="aspect-[16/9] w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            <div
              className="
                blog-content
                w-full
                max-w-none
                overflow-hidden
                text-slate-800
                text-xs
                sm:text-sm
                font-medium
                leading-relaxed

                [&_*]:max-w-full
                [&_img]:h-auto
                [&_table]:block
                [&_table]:overflow-x-auto
                [&_pre]:overflow-x-auto

                [&_h1]:mb-4
                [&_h1]:mt-8
                [&_h1]:text-xl
                [&_h1]:font-semibold
                [&_h1]:text-slate-950

                [&_h2]:mb-3
                [&_h2]:mt-8
                [&_h2]:text-lg
                [&_h2]:font-semibold
                [&_h2]:text-slate-950

                [&_h3]:mb-3
                [&_h3]:mt-6
                [&_h3]:text-base
                [&_h3]:font-semibold
                [&_h3]:text-slate-950

                [&_p]:my-4
                [&_p]:text-xs
                [&_p]:sm:text-sm
                [&_p]:leading-relaxed
                [&_p]:text-slate-700
                [&_p]:break-words

                [&_strong]:font-semibold
                [&_strong]:text-slate-950

                [&_ul]:my-4
                [&_ul]:list-disc
                [&_ul]:space-y-1.5
                [&_ul]:pl-5

                [&_ol]:my-4
                [&_ol]:list-decimal
                [&_ol]:space-y-1.5
                [&_ol]:pl-5

                [&_li]:text-xs
                [&_li]:sm:text-sm
                [&_li]:leading-relaxed
                [&_li]:text-slate-700

                [&_a]:font-semibold
                [&_a]:text-blue-600
                [&_a]:underline
                [&_a:hover]:text-blue-800

                [&_blockquote]:my-6
                [&_blockquote]:rounded-2xl
                [&_blockquote]:border-l-4
                [&_blockquote]:border-blue-600
                [&_blockquote]:bg-blue-50/50
                [&_blockquote]:px-5
                [&_blockquote]:py-4
                [&_blockquote]:italic
                [&_blockquote]:text-slate-700

                [&_code]:rounded-md
                [&_code]:bg-slate-100
                [&_code]:px-1.5
                [&_code]:py-0.5
                [&_code]:font-mono
                [&_code]:text-xs
                [&_code]:font-semibold
                [&_code]:text-blue-700

                [&_pre]:my-6
                [&_pre]:overflow-x-auto
                [&_pre]:rounded-2xl
                [&_pre]:bg-black
                [&_pre]:p-5
                [&_pre]:text-xs
                [&_pre]:text-slate-100

                [&_img]:my-6
                [&_img]:w-full
                [&_img]:rounded-2xl
                [&_img]:object-cover
              "
              dangerouslySetInnerHTML={{
                __html: blog.content || "",
              }}
            />

            {/* TAGS */}
            {blog.tags?.length > 0 && (
              <div className="mt-10 pt-6 border-t border-slate-100">
                <div
                  className="flex items-center gap-2 text-xs font-semibold text-slate-900 mb-3"
                  style={{ fontWeight: 600 }}
                >
                  <Tag size={14} className="text-blue-600" />
                  Related Topics
                </div>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700"
                      style={{ fontWeight: 600 }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ACTION FOOTER BAR */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition ${
                    liked
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  <Heart size={15} fill={liked ? "currentColor" : "none"} />
                  <span>{likes}</span> Likes
                </button>

                {blog.commentsEnabled === true && (
                  <button
                    onClick={scrollToComments}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
                    style={{ fontWeight: 600 }}
                  >
                    <MessageCircle size={15} className="text-blue-600" />
                    <span>{comments.length}</span> Comments
                  </button>
                )}
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
                style={{ fontWeight: 600 }}
              >
                {copied ? (
                  <Check size={15} className="text-emerald-600" />
                ) : (
                  <Share2 size={15} className="text-blue-600" />
                )}
                <span>{copied ? "Link Copied" : "Share Article"}</span>
              </button>
            </div>

            {/* AUTHOR CARD */}
            <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {blog.authorImage ? (
                <img
                  src={getImageUrl(blog.authorImage)}
                  alt={blog.authorName || "Author"}
                  className="h-16 w-16 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                />
              ) : (
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-black text-white text-lg font-semibold shadow-2xs"
                  style={{ fontWeight: 600 }}
                >
                  {(blog.authorName || "G").charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <span
                  className="text-[10px] uppercase font-semibold tracking-wider text-blue-600"
                  style={{ fontWeight: 600 }}
                >
                  Written By
                </span>
                <h3
                  className="text-sm font-semibold text-slate-900 mt-0.5"
                  style={{ fontWeight: 600 }}
                >
                  {blog.authorName || "GuideX Team"}
                </h3>
                <p
                  className="text-xs text-slate-600 font-medium mt-1 leading-relaxed"
                  style={{ fontWeight: 600 }}
                >
                  {blog.authorBio ||
                    "Sharing practical knowledge and technical insights to empower learners and professionals."}
                </p>
              </div>
            </div>
          </article>

          {/* SIDEBAR (Fixed width to prevent overlap) */}
          <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* ARTICLE SUMMARY */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3
                  className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4 pb-3 border-b border-slate-100"
                  style={{ fontWeight: 600 }}
                >
                  Article Summary
                </h3>
                <div
                  className="space-y-3.5 text-xs font-semibold text-slate-700"
                  style={{ fontWeight: 600 }}
                >
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Category</span>
                    <span className="text-slate-900 font-semibold">
                      {blog.category || "Technology"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Level</span>
                    <span className="text-slate-900 font-semibold">
                      {blog.difficulty || "Advanced"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Views</span>
                    <span className="text-slate-900 font-semibold">
                      {blog.views || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Likes</span>
                    <span className="text-slate-900 font-semibold">
                      {likes || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Table of Contents */}
              {blog.tableOfContents?.length > 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                    <List size={16} className="text-blue-600" />
                    <h3
                      className="text-xs font-semibold uppercase tracking-wider text-slate-900"
                      style={{ fontWeight: 600 }}
                    >
                      Table of Contents
                    </h3>
                  </div>
                  <div className="space-y-2.5">
                    {blog.tableOfContents.map((item, index) => (
                      <a
                        key={item.id || index}
                        href={`#${item.id}`}
                        className={`block text-xs font-medium text-slate-600 hover:text-blue-600 transition truncate ${
                          item.level === 2 ? "pl-3" : ""
                        }`}
                        style={{ fontWeight: 600 }}
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* ==========================================
            COMMENTS SECTION
        ========================================== */}
        <section
          id="comments-section"
          className="mx-auto mt-16 max-w-4xl scroll-mt-28"
        >
          {blog.commentsEnabled === true ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                    <MessageCircle size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <h3
                      className="text-sm font-semibold text-slate-900 tracking-tight"
                      style={{ fontWeight: 600 }}
                    >
                      Discussion ({comments.length})
                    </h3>
                    <p
                      className="text-[11px] text-slate-500 font-medium"
                      style={{ fontWeight: 600 }}
                    >
                      Share your thoughts or ask questions
                    </p>
                  </div>
                </div>
              </div>

              {/* Comment Input */}
              <div className="space-y-3">
                <textarea
                  id="comment-input"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={handleCommentKeyDown}
                  placeholder="Write a constructive response..."
                  rows={3}
                  maxLength={1000}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-semibold text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  style={{ fontWeight: 600 }}
                />
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] text-slate-400 font-semibold"
                    style={{ fontWeight: 600 }}
                  >
                    Press Enter to post • {commentText.length}/1000
                  </span>
                  <button
                    onClick={handleComment}
                    disabled={commentSubmitting || !commentText.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-black hover:bg-slate-800 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition disabled:opacity-50"
                    style={{ fontWeight: 600 }}
                  >
                    {commentSubmitting ? (
                      <>
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Posting...
                      </>
                    ) : (
                      <>
                        Post Comment
                        <ArrowRight size={14} className="text-blue-400" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="mt-8 space-y-4">
                {commentsLoading ? (
                  <div
                    className="text-center py-6 text-xs text-slate-400 font-semibold"
                    style={{ fontWeight: 600 }}
                  >
                    Loading comments...
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                    <p
                      className="text-xs text-slate-500 font-semibold"
                      style={{ fontWeight: 600 }}
                    >
                      No comments yet. Start the discussion!
                    </p>
                  </div>
                ) : (
                  comments.map((item) => {
                    const user = item.user || {};
                    const fullName =
                      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                      "GuideX User";

                    return (
                      <div
                        key={item._id}
                        className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5"
                      >
                        <div className="flex gap-3">
                          {user.profileImage ? (
                            <img
                              src={getImageUrl(user.profileImage)}
                              alt={fullName}
                              className="h-9 w-9 shrink-0 rounded-xl object-cover border border-slate-200"
                            />
                          ) : (
                            <div
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-white text-xs font-semibold"
                              style={{ fontWeight: 600 }}
                            >
                              {fullName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <h4
                                className="text-xs font-semibold text-slate-900"
                                style={{ fontWeight: 600 }}
                              >
                                {fullName}
                              </h4>
                              <span
                                className="text-[10px] text-slate-400 font-semibold"
                                style={{ fontWeight: 600 }}
                              >
                                {formatDate(item.createdAt)}
                              </span>
                            </div>
                            <p
                              className="mt-2 text-xs leading-relaxed text-slate-700 font-medium"
                              style={{ fontWeight: 600 }}
                            >
                              {item.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xs">
              <MessageSquareOff
                size={24}
                className="mx-auto text-slate-400 mb-2"
              />
              <h3
                className="text-sm font-semibold text-slate-900"
                style={{ fontWeight: 600 }}
              >
                Comments are disabled
              </h3>
              <p
                className="text-xs text-slate-500 font-medium mt-1"
                style={{ fontWeight: 600 }}
              >
                The author has turned off comments for this article.
              </p>
            </div>
          )}
        </section>

        {/* ==========================================
            RELATED BLOGS SECTION
        ========================================== */}
        {blog.relatedBlogs?.length > 0 && (
          <section className="mx-auto mt-16 max-w-4xl border-t border-slate-200 pt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span
                  className="text-[10px] uppercase font-semibold tracking-wider text-blue-600"
                  style={{ fontWeight: 600 }}
                >
                  Explore More
                </span>
                <h2
                  className="text-lg font-semibold text-slate-950 tracking-tight"
                  style={{ fontWeight: 600 }}
                >
                  Related Articles
                </h2>
              </div>
              <Link
                to="/blogs"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
                style={{ fontWeight: 600 }}
              >
                View Feed &rarr;
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {blog.relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog._id}
                  to={`/blogs/${relatedBlog._id}`}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-300 hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100 mb-4">
                      {relatedBlog.coverImage ? (
                        <img
                          src={getImageUrl(relatedBlog.coverImage)}
                          alt={relatedBlog.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <BookOpen size={28} className="text-slate-400" />
                        </div>
                      )}
                    </div>
                    <span
                      className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider"
                      style={{ fontWeight: 600 }}
                    >
                      {relatedBlog.category}
                    </span>
                    <h3
                      className="mt-1 line-clamp-2 text-sm font-semibold text-slate-950 group-hover:text-blue-600 transition"
                      style={{ fontWeight: 600 }}
                    >
                      {relatedBlog.title}
                    </h3>
                  </div>

                  <div
                    className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold"
                    style={{ fontWeight: 600 }}
                  >
                    <span>
                      {formatDate(
                        relatedBlog.publishedAt || relatedBlog.createdAt
                      )}
                    </span>
                    <span className="text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition">
                      Read article <ArrowRight size={12} />
                    </span>
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
