import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Eye,
  User,
  Tag,
  Loader2,
  Edit3,
  Trash2,
  Star,
  CheckCircle,
  Clock3,
  Link as LinkIcon,
  Search,
  FileText,
  RefreshCw,
  X,
  AlertTriangle,
  Copy,
  Hash,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";

import DOMPurify from "dompurify";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeInteractionTab, setActiveInteractionTab] = useState("likes");

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("AdminToken");

      const response = await fetch(`${API_BASE_URL}/api/admin/blogs/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log("Blog Details Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch blog");
      }

      setBlog(data.blog);
    } catch (error) {
      console.error("Fetch blog error:", error);

      toast.error(error.message || "Failed to fetch blog");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE BLOG
  // ==========================================

  const handleDeleteBlog = async () => {
    if (!blog?._id) return;

    try {
      setDeleting(true);

      const token = localStorage.getItem("AdminToken");

      const response = await fetch(
        `${API_BASE_URL}/api/admin/blogs/delete/${blog._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Delete Blog Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete blog");
      }

      setShowDeleteModal(false);

      toast.success("Blog deleted successfully!");

      setTimeout(() => {
        navigate("/admin/blogs", {
          replace: true,
        });
      }, 800);
    } catch (error) {
      console.error("Delete blog error:", error);

      toast.error(error.message || "Failed to delete blog");
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================
  // COPY TO CLIPBOARD
  // ==========================================

  const handleCopy = async (value, label) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);

      toast.success(`${label} copied to clipboard.`);
    } catch (error) {
      console.error("Copy error:", error);

      toast.error(`Could not copy ${label.toLowerCase()}.`);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // FORMAT DATE TIME
  // ==========================================

  const formatDateTime = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // IMAGE URL HELPER
  // ==========================================

  const getImageUrl = (image) => {
    if (!image) return null;

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${API_BASE_URL}${image}`;
  };

 

  const interactions = blog?.interactions || {};

  const likeCount = interactions.likeCount || 0;

  const commentCount = interactions.commentCount || 0;

  const shareCount = interactions.shareCount || 0;

  const likedUsers = Array.isArray(interactions.likedUsers)
    ? interactions.likedUsers
    : [];

  const sharedUsers = Array.isArray(interactions.sharedUsers)
    ? interactions.sharedUsers
    : [];

  const comments = Array.isArray(interactions.comments)
    ? interactions.comments
    : [];

  // ==========================================
  // SIDEBAR CARD
  // ==========================================

  const SidebarCard = ({ icon: Icon, title, children }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-2.5 mb-5">
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
            <Icon size={16} className="text-indigo-600" />
          </div>
        )}

        <h2 className="text-base font-bold text-gray-900">{title}</h2>
      </div>

      {children}
    </div>
  );

  // ==========================================
  // EMPTY INTERACTION STATE
  // ==========================================

  const EmptyInteraction = ({ icon: Icon, message }) => (
    <div className="text-center py-6">
      <div className="w-12 h-12 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center">
        <Icon size={24} className="text-gray-300" />
      </div>

      <p className="text-sm text-gray-400 mt-3">{message}</p>
    </div>
  );

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <>
        <ToastContainer position="top-right" />

        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/60 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={40} className="animate-spin text-indigo-600" />

            <p className="text-gray-500 font-medium">Loading blog details...</p>
          </div>
        </div>
      </>
    );
  }

  // ==========================================
  // BLOG NOT FOUND
  // ==========================================

  if (!blog) {
    return (
      <>
        <ToastContainer position="top-right" />

        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/60 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
            <FileText size={30} className="text-indigo-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-5">
            Blog not found
          </h2>

          <p className="text-gray-500 mt-2">
            The blog you are looking for does not exist.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-sm shadow-indigo-200"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <>
      <ToastContainer position="top-right" />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/60">
        {/* ==========================================
            TOP HEADER
        ========================================== */}

        <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* BACK */}

              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition group w-fit"
              >
                <span className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-indigo-50 flex items-center justify-center transition">
                  <ArrowLeft size={16} />
                </span>
                Back to Blogs
              </button>

              {/* ACTIONS */}

              <div className="flex items-center gap-3">
                {/* EDIT */}

                <button
                  onClick={() => navigate(`/admin/blogs/edit/${blog._id}`)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-sm shadow-indigo-200"
                >
                  <Edit3 size={17} />
                  Edit Blog
                </button>

                {/* DELETE */}

                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={deleting}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={17} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            MAIN CONTENT
        ========================================== */}

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ==========================================
                LEFT MAIN BLOG
            ========================================== */}

            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {/* ==========================================
                    COVER IMAGE
                ========================================== */}

                {blog.coverImage ? (
                  <div className="relative h-[300px] md:h-[450px]">
                    <img
                      src={getImageUrl(blog.coverImage)}
                      alt={blog.coverImageAlt || blog.title}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                    {/* FEATURED */}

                    {blog.featured && (
                      <div className="absolute top-5 left-5 flex items-center gap-2 bg-white/95 backdrop-blur-sm text-amber-600 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        <Star
                          size={16}
                          className="fill-amber-500 text-amber-500"
                        />
                        Featured Blog
                      </div>
                    )}

                    {/* STATUS */}

                    <div
                      className={`absolute top-5 right-5 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                        blog.status === "Published"
                          ? "bg-emerald-500 text-white"
                          : "bg-amber-400 text-amber-950"
                      }`}
                    >
                      {blog.status === "Published" ? (
                        <CheckCircle size={16} />
                      ) : (
                        <Clock3 size={16} />
                      )}

                      {blog.status}
                    </div>

                    {/* CATEGORY */}

                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <span className="inline-flex px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm ring-1 ring-white/20 text-white text-xs font-bold uppercase tracking-wide">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-[220px] bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center">
                    <FileText size={56} className="text-indigo-300" />
                  </div>
                )}

                {/* ==========================================
                    BLOG HEADER
                ========================================== */}

                <div className="p-6 md:p-10">
                  {!blog.coverImage && (
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                      <span className="inline-flex px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold">
                        {blog.category}
                      </span>

                      {blog.featured && (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-sm font-bold">
                          <Star size={15} className="fill-amber-500" />
                          Featured
                        </span>
                      )}
                    </div>
                  )}

                  {/* TITLE */}

                  <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
                    {blog.title}
                  </h1>

                  {/* EXCERPT */}

                  {blog.excerpt && (
                    <p className="text-lg md:text-xl text-gray-500 mt-5 leading-8">
                      {blog.excerpt}
                    </p>
                  )}

                  {/* AUTHOR INFO */}

                  <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-7 pt-6 border-t border-gray-100">
                    {/* AUTHOR */}

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                        <User size={18} className="text-indigo-600" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Author</p>

                        <p className="text-sm font-semibold text-gray-800">
                          {blog.authorName || "GuideX Team"}
                        </p>
                      </div>
                    </div>

                    {/* PUBLISHED */}

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                        <CalendarDays size={17} className="text-gray-500" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Published</p>

                        <p className="text-sm font-semibold text-gray-800">
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* VIEWS */}

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                        <Eye size={17} className="text-gray-500" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Views</p>

                        <p className="text-sm font-semibold text-gray-800">
                          {blog.views || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ==========================================
                      QUICK INTERACTION STATS
                  ========================================== */}

                  <div className="grid grid-cols-3 gap-3 mt-8">
                    {/* LIKES */}

                    <div className="rounded-2xl bg-red-50 border border-red-100 p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                          <Heart
                            size={19}
                            className="text-red-500 fill-red-500"
                          />
                        </div>

                        <div>
                          <p className="text-xl font-bold text-gray-900">
                            {likeCount}
                          </p>

                          <p className="text-xs text-gray-500 font-medium">
                            Likes
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* COMMENTS */}

                    <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                          <MessageCircle size={19} className="text-blue-500" />
                        </div>

                        <div>
                          <p className="text-xl font-bold text-gray-900">
                            {commentCount}
                          </p>

                          <p className="text-xs text-gray-500 font-medium">
                            Comments
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* SHARES */}

                    <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <Share2 size={19} className="text-emerald-500" />
                        </div>

                        <div>
                          <p className="text-xl font-bold text-gray-900">
                            {shareCount}
                          </p>

                          <p className="text-xs text-gray-500 font-medium">
                            Shares
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ==========================================
                      BLOG CONTENT
                  ========================================== */}

                  <article className="mt-10">
                    <div className="bg-gray-50/60 rounded-3xl border border-gray-100 overflow-hidden">
                      <div
                        className="
                          prose
                          prose-lg
                          max-w-none
                          px-6
                          py-8
                          sm:px-10
                          sm:py-10
                          lg:px-14
                          lg:py-14

                          prose-headings:text-gray-900
                          prose-headings:font-bold
                          prose-headings:tracking-tight

                          prose-h1:text-4xl
                          prose-h1:leading-tight
                          prose-h1:mb-6
                          prose-h1:mt-0

                          prose-h2:text-3xl
                          prose-h2:leading-tight
                          prose-h2:mt-12
                          prose-h2:mb-5

                          prose-h3:text-2xl
                          prose-h3:leading-tight
                          prose-h3:mt-10
                          prose-h3:mb-4

                          prose-p:text-gray-600
                          prose-p:leading-8
                          prose-p:my-5

                          prose-strong:text-gray-900
                          prose-strong:font-bold

                          prose-a:text-indigo-600
                          prose-a:font-semibold
                          prose-a:no-underline

                          hover:prose-a:underline

                          prose-ul:text-gray-600
                          prose-ol:text-gray-600

                          prose-li:my-2
                          prose-li:leading-7

                          prose-blockquote:border-l-4
                          prose-blockquote:border-indigo-500
                          prose-blockquote:bg-indigo-50
                          prose-blockquote:text-gray-700
                          prose-blockquote:font-medium
                          prose-blockquote:rounded-r-xl
                          prose-blockquote:px-6
                          prose-blockquote:py-4
                          prose-blockquote:my-8
                        "
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(blog.content || ""),
                        }}
                      />
                    </div>
                  </article>

                  {/* ==========================================
                      TAGS
                  ========================================== */}

                  {blog.tags?.length > 0 && (
                    <div className="mt-10 pt-8 border-t border-gray-100">
                      <div className="flex items-center gap-2 mb-4">
                        <Tag size={18} className="text-indigo-600" />

                        <h3 className="font-bold text-gray-900">Tags</h3>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag, index) => (
                          <span
                            key={`${tag}-${index}`}
                            className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium hover:bg-indigo-50 hover:text-indigo-700 transition"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ==========================================
    AUDIENCE ENGAGEMENT - TABBED
========================================== */}

              <div className="mt-8">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* ==========================================
        TAB HEADER
    ========================================== */}

                  <div className="p-5 md:p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">
                          Audience Engagement
                        </h2>

                        <p className="text-sm text-gray-400 mt-1">
                          View user interactions with this blog
                        </p>
                      </div>

                      <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                        <Eye size={14} />
                        {blog.views || 0} views
                      </div>
                    </div>

                    {/* TABS */}

                    <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                      {/* LIKES TAB */}

                      <button
                        type="button"
                        onClick={() => setActiveInteractionTab("likes")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                          activeInteractionTab === "likes"
                            ? "bg-white text-red-600 shadow-sm border border-red-100"
                            : "text-gray-500 hover:text-red-600 hover:bg-white/70"
                        }`}
                      >
                        <Heart
                          size={17}
                          className={
                            activeInteractionTab === "likes"
                              ? "text-red-500 fill-red-500"
                              : ""
                          }
                        />

                        <span className="hidden sm:inline">Liked By</span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            activeInteractionTab === "likes"
                              ? "bg-red-50 text-red-600"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {likeCount}
                        </span>
                      </button>

                      {/* COMMENTS TAB */}

                      <button
                        type="button"
                        onClick={() => setActiveInteractionTab("comments")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                          activeInteractionTab === "comments"
                            ? "bg-white text-blue-600 shadow-sm border border-blue-100"
                            : "text-gray-500 hover:text-blue-600 hover:bg-white/70"
                        }`}
                      >
                        <MessageCircle size={17} />

                        <span className="hidden sm:inline">Comments</span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            activeInteractionTab === "comments"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {commentCount}
                        </span>
                      </button>

                      {/* SHARES TAB */}

                      <button
                        type="button"
                        onClick={() => setActiveInteractionTab("shares")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                          activeInteractionTab === "shares"
                            ? "bg-white text-emerald-600 shadow-sm border border-emerald-100"
                            : "text-gray-500 hover:text-emerald-600 hover:bg-white/70"
                        }`}
                      >
                        <Share2 size={17} />

                        <span className="hidden sm:inline">Shares</span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            activeInteractionTab === "shares"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {shareCount}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="h-[300px] overflow-y-auto custom-scrollbar">
                    {activeInteractionTab === "likes" && (
                      <div className="p-5 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                              <Heart
                                size={19}
                                className="text-red-500 fill-red-500"
                              />
                            </div>

                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                Liked By
                              </h3>

                              <p className="text-sm text-gray-400">
                                Users who liked this blog
                              </p>
                            </div>
                          </div>

                          <span className="px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-sm font-bold">
                            {likeCount}
                          </span>
                        </div>

                        {likedUsers.length > 0 ? (
                          <div className="space-y-3">
                            {likedUsers.map((like) => (
                              <div
                                key={like._id}
                                className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-red-100 hover:bg-red-50/30 transition"
                              >
                                {/* USER IMAGE */}

                                {like.user?.profileImage ? (
                                  <img
                                    src={getImageUrl(like.user.profileImage)}
                                    alt={like.user?.firstName || "User"}
                                    className="w-11 h-11 rounded-full object-cover border border-gray-200 shrink-0"
                                  />
                                ) : (
                                  <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                    <User
                                      size={18}
                                      className="text-indigo-600"
                                    />
                                  </div>
                                )}

                                {/* USER INFO */}

                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-800 truncate">
                                    {like.user?.firstName || "Unknown"}{" "}
                                    {like.user?.lastName || ""}
                                  </p>

                                  <p className="text-xs text-gray-400 truncate">
                                    {like.user?.email || "No email"}
                                  </p>

                                  <p className="text-[11px] text-gray-400 mt-1">
                                    Liked on {formatDateTime(like.likedAt)}
                                  </p>
                                </div>

                                <Heart
                                  size={17}
                                  className="text-red-500 fill-red-500 shrink-0"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <EmptyInteraction
                            icon={Heart}
                            message="No likes yet"
                          />
                        )}
                      </div>
                    )}

                    {/* ==========================================
          COMMENTS TAB
      ========================================== */}

                    {activeInteractionTab === "comments" && (
                      <div className="p-5 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                              <MessageCircle
                                size={19}
                                className="text-blue-500"
                              />
                            </div>

                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                Comments
                              </h3>

                              <p className="text-sm text-gray-400">
                                User discussions on this blog
                              </p>
                            </div>
                          </div>

                          <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold">
                            {commentCount}
                          </span>
                        </div>

                        {comments.length > 0 ? (
                          <div className="space-y-4">
                            {comments.map((comment) => (
                              <div
                                key={comment._id}
                                className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-100 transition"
                              >
                                {/* COMMENT HEADER */}

                                <div className="flex items-center gap-3">
                                  {comment.user?.profileImage ? (
                                    <img
                                      src={getImageUrl(
                                        comment.user.profileImage
                                      )}
                                      alt={comment.user?.firstName || "User"}
                                      className="w-10 h-10 rounded-full object-cover shrink-0"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                      <User
                                        size={17}
                                        className="text-indigo-600"
                                      />
                                    </div>
                                  )}

                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800">
                                      {comment.user?.firstName || "Unknown"}{" "}
                                      {comment.user?.lastName || ""}
                                    </p>

                                    <p className="text-xs text-gray-400">
                                      {formatDateTime(comment.commentedAt)}
                                    </p>
                                  </div>

                                  <span
                                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                                      comment.status === "Visible"
                                        ? "bg-emerald-50 text-emerald-600"
                                        : comment.status === "Hidden"
                                        ? "bg-amber-50 text-amber-600"
                                        : "bg-red-50 text-red-600"
                                    }`}
                                  >
                                    {comment.status}
                                  </span>
                                </div>

                                {/* COMMENT */}

                                <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100">
                                  <p className="text-sm text-gray-600 leading-7">
                                    {comment.comment}
                                  </p>
                                </div>

                                {/* COMMENT FOOTER */}

                                <div className="flex items-center gap-5 mt-4">
                                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <Heart size={14} />
                                    {comment.likes || 0} likes
                                  </div>

                                  {comment.parentComment && (
                                    <span className="text-xs text-indigo-500 font-semibold">
                                      Reply
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <EmptyInteraction
                            icon={MessageCircle}
                            message="No comments yet"
                          />
                        )}
                      </div>
                    )}

                    {activeInteractionTab === "shares" && (
                      <div className="p-5 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                              <Share2 size={19} className="text-emerald-500" />
                            </div>

                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                Shares
                              </h3>

                              <p className="text-sm text-gray-400">
                                Users who shared this blog
                              </p>
                            </div>
                          </div>

                          <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-sm font-bold">
                            {shareCount}
                          </span>
                        </div>

                        {sharedUsers.length > 0 ? (
                          <div className="space-y-3">
                            {sharedUsers.map((share) => (
                              <div
                                key={share._id}
                                className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-emerald-100 hover:bg-emerald-50/30 transition"
                              >
                                {/* USER IMAGE */}

                                {share.user?.profileImage ? (
                                  <img
                                    src={getImageUrl(share.user.profileImage)}
                                    alt={share.user?.firstName || "User"}
                                    className="w-11 h-11 rounded-full object-cover border border-gray-200 shrink-0"
                                  />
                                ) : (
                                  <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                    <User
                                      size={18}
                                      className="text-emerald-600"
                                    />
                                  </div>
                                )}

                                {/* USER INFO */}

                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-800 truncate">
                                    {share.user?.firstName || "Unknown"}{" "}
                                    {share.user?.lastName || ""}
                                  </p>

                                  <p className="text-xs text-gray-400">
                                    {formatDateTime(share.sharedAt)}
                                  </p>
                                </div>

                                {/* PLATFORM */}

                                <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold capitalize shrink-0">
                                  {share.platform || "other"}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <EmptyInteraction
                            icon={Share2}
                            message="No shares yet"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ==========================================
                RIGHT SIDEBAR
            ========================================== */}

            <div className="space-y-6">
              {/* ==========================================
                  BLOG INFORMATION
              ========================================== */}

              <SidebarCard icon={FileText} title="Blog Information">
                <div className="space-y-5">
                  {/* STATUS */}

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                      Status
                    </p>

                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        blog.status === "Published"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {blog.status === "Published" ? (
                        <CheckCircle size={13} />
                      ) : (
                        <Clock3 size={13} />
                      )}

                      {blog.status}
                    </div>
                  </div>

                  {/* CATEGORY */}

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                      Category
                    </p>

                    <p className="font-semibold text-gray-800 text-sm">
                      {blog.category || "-"}
                    </p>
                  </div>

                  {/* DIFFICULTY */}

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                      Difficulty
                    </p>

                    <p className="font-semibold text-gray-800 text-sm">
                      {blog.difficulty || "-"}
                    </p>
                  </div>

                  {/* READING TIME */}

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                      Reading Time
                    </p>

                    <p className="font-semibold text-gray-800 text-sm">
                      {blog.readingTime ? `${blog.readingTime} min` : "-"}
                    </p>
                  </div>

                  {/* AUTHOR */}

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                      Author
                    </p>

                    <div className="text-right">
                      <p className="font-semibold text-gray-800 text-sm">
                        {blog.authorName || "GuideX Team"}
                      </p>

                      <p className="text-xs text-gray-400">
                        {blog.author || "Admin"}
                      </p>
                    </div>
                  </div>

                  {/* VIEWS */}

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                      Total Views
                    </p>

                    <div className="flex items-center gap-1.5">
                      <Eye size={15} className="text-gray-400" />

                      <span className="font-semibold text-gray-800 text-sm">
                        {blog.views || 0}
                      </span>
                    </div>
                  </div>

                  {/* FEATURED */}

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                      Featured
                    </p>

                    <div className="flex items-center gap-1.5">
                      <Star
                        size={15}
                        className={
                          blog.featured
                            ? "text-amber-500 fill-amber-500"
                            : "text-gray-300"
                        }
                      />

                      <span className="font-semibold text-gray-800 text-sm">
                        {blog.featured ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              </SidebarCard>

              {/* ==========================================
                  INTERACTION SUMMARY
              ========================================== */}

              <SidebarCard icon={Heart} title="Interaction Summary">
                <div className="space-y-4">
                  {/* LIKES */}

                  <div className="flex items-center justify-between p-3 rounded-xl bg-red-50">
                    <div className="flex items-center gap-3">
                      <Heart size={17} className="text-red-500 fill-red-500" />

                      <span className="text-sm font-medium text-gray-700">
                        Likes
                      </span>
                    </div>

                    <span className="font-bold text-gray-900">{likeCount}</span>
                  </div>

                  {/* COMMENTS */}

                  <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50">
                    <div className="flex items-center gap-3">
                      <MessageCircle size={17} className="text-blue-500" />

                      <span className="text-sm font-medium text-gray-700">
                        Comments
                      </span>
                    </div>

                    <span className="font-bold text-gray-900">
                      {commentCount}
                    </span>
                  </div>

                  {/* SHARES */}

                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50">
                    <div className="flex items-center gap-3">
                      <Share2 size={17} className="text-emerald-500" />

                      <span className="text-sm font-medium text-gray-700">
                        Shares
                      </span>
                    </div>

                    <span className="font-bold text-gray-900">
                      {shareCount}
                    </span>
                  </div>
                </div>
              </SidebarCard>

              {/* ==========================================
                  SEO INFORMATION
              ========================================== */}

              <SidebarCard icon={Search} title="SEO Settings">
                <div className="space-y-5">
                  {/* SEO TITLE */}

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                      SEO Title
                    </p>

                    <p
                      className={`text-sm mt-2 leading-6 ${
                        blog.seoTitle ? "text-gray-700" : "text-gray-400 italic"
                      }`}
                    >
                      {blog.seoTitle || "Not provided"}
                    </p>
                  </div>

                  {/* SEO DESCRIPTION */}

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                      SEO Description
                    </p>

                    <p
                      className={`text-sm mt-2 leading-6 ${
                        blog.seoDescription
                          ? "text-gray-700"
                          : "text-gray-400 italic"
                      }`}
                    >
                      {blog.seoDescription || "Not provided"}
                    </p>
                  </div>

                  {/* SEO KEYWORDS */}

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                      SEO Keywords
                    </p>

                    {blog.seoKeywords?.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {blog.seoKeywords.map((keyword, index) => (
                          <span
                            key={`${keyword}-${index}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium"
                          >
                            <Hash size={11} />

                            {keyword}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic mt-2">
                        No keywords added
                      </p>
                    )}
                  </div>
                </div>
              </SidebarCard>

              {/* ==========================================
                  URL INFORMATION
              ========================================== */}

              <SidebarCard icon={LinkIcon} title="URL Information">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                    Slug
                  </p>

                  <div className="mt-2 flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="text-sm text-gray-600 break-all flex-1">
                      /blogs/
                      {blog.slug}
                    </p>

                    <button
                      onClick={() => handleCopy(`/blogs/${blog.slug}`, "Slug")}
                      title="Copy slug"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white hover:text-indigo-600 transition shrink-0"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                {/* BLOG ID */}

                <div className="mt-5">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                    Blog ID
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-xs text-gray-500 break-all flex-1">
                      {blog._id}
                    </p>

                    <button
                      onClick={() => handleCopy(blog._id, "Blog ID")}
                      title="Copy blog ID"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-indigo-600 transition shrink-0"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>
              </SidebarCard>

              {/* ==========================================
                  TIMELINE
              ========================================== */}

              <SidebarCard icon={RefreshCw} title="Timeline">
                <div className="space-y-6">
                  {/* CREATED */}

                  <div className="flex gap-3 relative">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-50 shrink-0" />

                      {(blog.publishedAt || blog.updatedAt) && (
                        <div className="w-px flex-1 bg-gray-100 mt-1" />
                      )}
                    </div>

                    <div className="pb-1">
                      <p className="text-sm font-semibold text-gray-800">
                        Blog Created
                      </p>

                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDateTime(blog.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* PUBLISHED */}

                  {blog.publishedAt && (
                    <div className="flex gap-3 relative">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50 shrink-0" />

                        {blog.updatedAt && (
                          <div className="w-px flex-1 bg-gray-100 mt-1" />
                        )}
                      </div>

                      <div className="pb-1">
                        <p className="text-sm font-semibold text-gray-800">
                          Blog Published
                        </p>

                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDateTime(blog.publishedAt)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* UPDATED */}

                  {blog.updatedAt && (
                    <div className="flex gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-50 shrink-0 mt-[1px]" />

                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Last Updated
                        </p>

                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDateTime(blog.updatedAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </SidebarCard>
            </div>
          </div>
        </div>

        {/* ==========================================
            DELETE CONFIRMATION MODAL
        ========================================== */}

        {showDeleteModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => {
              if (!deleting) {
                setShowDeleteModal(false);
              }
            }}
          >
            <div
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER */}

              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>

                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              {/* TITLE */}

              <h2 className="text-xl font-bold text-gray-900 mt-6">
                Delete this blog?
              </h2>

              {/* DESCRIPTION */}

              <p className="text-gray-500 mt-3 leading-6">
                Are you sure you want to permanently delete{" "}
                <span className="font-semibold text-gray-800">
                  "{blog.title}"
                </span>
                ?
              </p>

              <p className="text-sm text-red-500 mt-3 flex items-center gap-1.5">
                <AlertTriangle size={14} />
                This action cannot be undone.
              </p>

              {/* ACTIONS */}

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-7">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="px-5 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteBlog}
                  disabled={deleting}
                  className="px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Delete Blog
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogDetails;
