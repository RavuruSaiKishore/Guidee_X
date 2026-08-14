import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {
  ArrowLeft,
  Heart,
  ExternalLink,
  FileText,
  Eye,
  CalendarDays,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  BookOpen,
  Download,
  Share2,
  CheckCircle,
  Layers,
  GraduationCap,
  Award,
  Video,
  FileDown,
  User,
  Star,
  Shield,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// =====================================================
// HELPER FUNCTIONS
// =====================================================

const getToken = () => {
  return (
    localStorage.getItem("UserToken") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("token")
  );
};

const getFullUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE_URL.replace(/\/$/, "")}/${url.replace(/^\/+/, "")}`;
};

const getYouTubeEmbedUrl = (rawUrl) => {
  if (!rawUrl) return "";
  try {
    let videoId = "";
    const cleanUrl = rawUrl.trim();

    if (cleanUrl.includes("youtu.be/")) {
      videoId = cleanUrl.split("youtu.be/")[1]?.split("?")[0]?.split("&")[0];
    } else if (cleanUrl.includes("youtube.com/watch")) {
      const searchParams = new URLSearchParams(cleanUrl.split("?")[1]);
      videoId = searchParams.get("v");
    } else if (cleanUrl.includes("youtube.com/embed/")) {
      videoId = cleanUrl
        .split("youtube.com/embed/")[1]
        ?.split("?")[0]
        ?.split("&")[0];
    }

    if (videoId) {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(
        origin
      )}&rel=0`;
    }

    return cleanUrl;
  } catch (err) {
    console.error("Error parsing YouTube URL:", err);
    return rawUrl;
  }
};

const formatDate = (date) => {
  if (!date) return "N/A";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes <= 0) return "N/A";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function ResourceDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedModule, setExpandedModule] = useState(0);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // =====================================================
  // FETCH RESOURCE DATA
  // =====================================================

  const fetchResource = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();
      if (!token) throw new Error("Please login to view resource details");

      const response = await fetch(
        `${API_BASE_URL}/api/resources/published/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to load resource");

      setResource(data.resource);
      if (data.resource.userRating) {
        setUserRating(data.resource.userRating);
      }

      // Track View
      try {
        const viewRes = await fetch(
          `${API_BASE_URL}/api/resources/${id}/view`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const viewData = await viewRes.json();
        if (viewRes.ok && viewData.views !== undefined) {
          setResource((prev) =>
            prev
              ? {
                  ...prev,
                  metrics: {
                    ...(prev.metrics || {}),
                    viewsCount: viewData.views,
                  },
                }
              : prev
          );
        }
      } catch (err) {
        console.error("View tracking error:", err);
      }
    } catch (err) {
      setError(err.message || "Failed to load details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchResource();
  }, [id]);

  // =====================================================
  // DOWNLOAD FILE HANDLER
  // =====================================================

  // =====================================================
  // DOWNLOAD FILE HANDLER (HANDLES BOTH BLOBS & JSON)
  // =====================================================

  const handleDownloadFile = async (specificFileUrl = null) => {
    const targetFile =
      specificFileUrl ||
      resource?.fileUrl ||
      resource?.attachments?.[0]?.fileUrl;

    if (!targetFile) {
      showToast("error", "No downloadable file is available");
      return;
    }

    try {
      setDownloading(true);
      const token = getToken();

      const response = await fetch(
        `${API_BASE_URL}/api/resources/${id}/download`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const contentType = response.headers.get("content-type");

      // Case 1: Backend returned binary file (PDF / ZIP / Doc stream)
      if (contentType && !contentType.includes("application/json")) {
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = resource?.title || "downloaded-resource";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);

        showToast("success", "File download completed!");
      } else {
        // Case 2: Backend returned JSON response with external download URL
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to initiate download");
        }

        if (data.downloadsCount !== undefined) {
          setResource((prev) => ({
            ...prev,
            metrics: {
              ...(prev?.metrics || {}),
              downloadsCount: data.downloadsCount,
            },
          }));
        }

        const downloadLink = getFullUrl(data.downloadUrl || targetFile);
        window.open(downloadLink, "_blank", "noopener,noreferrer");
        showToast("success", "Download started successfully!");
      }
    } catch (err) {
      console.error("Download Error:", err);
      showToast("error", err.message || "Unable to complete file download");
    } finally {
      setDownloading(false);
    }
  };
  // =====================================================
  // SUBMIT RATING & REVIEW
  // =====================================================

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (resource?.hasRated) {
      showToast(
        "error",
        "You have already submitted a rating for this resource."
      );
      return;
    }

    try {
      const token = getToken();
      if (!token) return showToast("error", "Please login to rate resources");

      setSubmittingRating(true);
      const response = await fetch(
        `${API_BASE_URL}/api/resources/${id}/review`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating: userRating }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to submit review");

      setResource((prev) => ({
        ...prev,
        hasRated: true,
        userRating: userRating,
        metrics: {
          ...(prev?.metrics || {}),
          averageRating: data.averageRating,
          totalRatings: data.totalRatings,
        },
      }));

      showToast("success", "Rating submitted successfully!");
    } catch (err) {
      showToast("error", err.message || "Failed to submit rating");
    } finally {
      setSubmittingRating(false);
    }
  };

  // =====================================================
  // LIKE TOGGLE
  // =====================================================

  const handleLike = async () => {
    try {
      const token = getToken();
      if (!token) return showToast("error", "Please login to interact");

      setLiking(true);
      const response = await fetch(`${API_BASE_URL}/api/resources/${id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setResource((prev) => ({
        ...prev,
        isLiked: data.isLiked,
        likes: data.likes,
        metrics: {
          ...(prev?.metrics || {}),
          likesCount: data.likes,
        },
      }));

      showToast(
        "success",
        data.isLiked ? "Added to likes" : "Removed from likes"
      );
    } catch (err) {
      showToast("error", err.message || "Action failed");
    } finally {
      setLiking(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("success", "Resource URL copied to clipboard");
    } catch {
      showToast("error", "Failed to copy link");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={32} className="animate-spin text-indigo-600" />
          <p className="text-sm font-semibold text-slate-600">
            Loading resource...
          </p>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-xl">
          <button
            onClick={() => navigate("/career-resources")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600"
          >
            <ArrowLeft size={18} /> Back to Library
          </button>
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-xs">
            <AlertCircle size={32} className="mx-auto text-red-600" />
            <h2 className="mt-3 text-lg font-bold text-slate-900">
              Resource Unavailable
            </h2>
            <p className="mt-2 text-sm text-slate-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const likesDisplayCount = resource.metrics?.likesCount ?? resource.likes ?? 0;
  const viewsDisplayCount = resource.metrics?.viewsCount ?? resource.views ?? 0;
  const downloadsDisplayCount =
    resource.metrics?.downloadsCount ?? resource.downloads ?? 0;

  const bannerImageUrl = getFullUrl(
    resource.bannerImage?.url || resource.thumbnail?.url
  );

  const hasDownloadableFile =
    resource.fileUrl ||
    (resource.attachments && resource.attachments.length > 0);

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 pb-16">
      {/* TOAST FEEDBACK */}
      {toast && (
        <div className="fixed right-5 top-5 z-50">
          <div
            className={`flex items-center gap-3 rounded-xl border bg-white px-5 py-4 shadow-xl ${
              toast.type === "success"
                ? "border-emerald-200 text-emerald-800"
                : "border-red-200 text-red-800"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <p className="text-sm font-semibold">{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className="ml-auto text-slate-400 hover:text-slate-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* TOP NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <button
            onClick={() => navigate("/career-resources")}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft size={18} /> Back to Resource Hub
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <Share2 size={16} /> Share
            </button>
            <button
              onClick={fetchResource}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw size={16} /> Sync
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION WITH TOP HERO BANNER IMAGE */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-white shadow-xs">
        {bannerImageUrl && (
          <div className="h-64 w-full overflow-hidden bg-slate-100 sm:h-80">
            <img
              src={bannerImageUrl}
              alt={resource.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full bg-indigo-50 border border-indigo-100 px-3.5 py-1 text-xs font-bold text-indigo-700">
                  {resource.category}
                </span>

                {resource.subcategory && (
                  <span className="rounded-full bg-slate-100 px-3.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
                    {resource.subcategory}
                  </span>
                )}

                <span className="rounded-full bg-purple-50 border border-purple-100 px-3.5 py-1 text-xs font-bold text-purple-700">
                  {resource.difficulty || "All Levels"}
                </span>

                <span className="rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold text-slate-700 border border-slate-200">
                  {resource.resourceType}
                </span>

                {resource.isFeatured && (
                  <span className="rounded-full bg-amber-50 border border-amber-200 px-3.5 py-1 text-xs font-bold text-amber-800">
                    ★ Featured
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
                {resource.title}
              </h1>

              {resource.subtitle && (
                <p className="mt-2 text-base font-semibold text-slate-600">
                  {resource.subtitle}
                </p>
              )}

              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                {resource.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-500 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-indigo-600" />
                  <span className="font-semibold text-slate-800">
                    {resource.author?.name || "GuideX Team"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Eye size={16} className="text-blue-600" />
                  {viewsDisplayCount} Views
                </div>

                <div className="flex items-center gap-1.5">
                  <Download size={16} className="text-emerald-600" />
                  {downloadsDisplayCount} Downloads
                </div>

                <div className="flex items-center gap-1.5">
                  <Star size={16} className="text-amber-500 fill-amber-400" />
                  {resource.metrics?.averageRating || 0} (
                  {resource.metrics?.totalRatings || 0} reviews)
                </div>

                <div className="flex items-center gap-1.5">
                  <CalendarDays size={16} className="text-emerald-600" />
                  {formatDate(resource.publishedAt)}
                </div>
              </div>
            </div>

            {/* ACTION CARD WITH DOWNLOAD BUTTON */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 shadow-xs lg:min-w-[260px]">
              <button
                onClick={handleLike}
                disabled={liking}
                className={`flex h-12 items-center justify-center gap-2.5 rounded-xl border text-sm font-bold transition ${
                  resource.isLiked
                    ? "border-rose-300 bg-rose-50 text-rose-600"
                    : "border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                }`}
              >
                <Heart
                  size={18}
                  className={resource.isLiked ? "fill-current" : ""}
                />
                {resource.isLiked ? "Liked" : "Like Resource"} (
                {likesDisplayCount})
              </button>

              {hasDownloadableFile && (
                <button
                  onClick={() => handleDownloadFile()}
                  disabled={downloading}
                  className="flex h-12 items-center justify-center gap-2.5 rounded-xl bg-indigo-600 text-sm font-bold text-white transition hover:bg-indigo-700 shadow-xs disabled:opacity-50"
                >
                  {downloading ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <Download size={18} />
                  )}
                  Download File
                </button>
              )}

              {resource.externalUrl && (
                <a
                  href={getFullUrl(resource.externalUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 items-center justify-center gap-2.5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 text-sm font-bold text-indigo-700 hover:bg-indigo-100"
                >
                  <ExternalLink size={16} /> Access Link
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* NAVIGATION TABS */}
      <section className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-7xl gap-6 px-4 overflow-x-auto sm:px-6">
          {[
            { id: "overview", label: "Overview & Video", icon: Video },
            {
              id: "curriculum",
              label: `Curriculum (${resource.modules?.length || 0})`,
              icon: Layers,
            },
            {
              id: "attachments",
              label: `Attachments (${resource.attachments?.length || 0})`,
              icon: FileDown,
            },
            { id: "metadata", label: "Metadata & Admin Info", icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 py-4 text-sm font-bold transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon size={17} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {activeTab === "overview" && (
              <div className="space-y-8">
                {resource.whatYouWillLearn?.length > 0 && (
                  <section className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-800">
                      <GraduationCap size={18} /> What You Will Learn
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {resource.whatYouWillLearn.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2.5 text-sm text-slate-700"
                        >
                          <CheckCircle
                            size={16}
                            className="mt-0.5 shrink-0 text-emerald-600"
                          />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {resource.primaryVideo?.url && (
                  <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
                    <div className="mb-4 flex items-center justify-between text-sm font-bold text-slate-900">
                      <span className="flex items-center gap-2">
                        <Video size={18} className="text-indigo-600" /> Primary
                        Video Tutorial
                      </span>
                      <span className="text-xs text-slate-400 uppercase font-semibold">
                        Provider: {resource.primaryVideo.provider || "youtube"}
                      </span>
                    </div>

                    <div className="relative overflow-hidden rounded-xl bg-slate-900 aspect-video">
                      <iframe
                        src={getYouTubeEmbedUrl(resource.primaryVideo.url)}
                        title={resource.title}
                        className="h-full w-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </section>
                )}

                {resource.bodyContent && (
                  <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
                    <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
                      <BookOpen size={18} className="text-indigo-600" />{" "}
                      Detailed Content & Guide
                    </div>
                    <div className="max-h-[600px] overflow-y-auto rounded-xl bg-slate-50/80 p-6 border border-slate-100 scrollbar-thin scrollbar-thumb-slate-300">
                      <div className="prose prose-sm prose-slate max-w-none leading-relaxed">
                        {/* rehypePlugins={[rehypeRaw]} allows it to parse raw HTML tags like <ul>, <li>, <h3> */}
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                          {resource.bodyContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </section>
                )}

                {/* RATING & REVIEW CARD */}
                <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <MessageSquare size={18} className="text-indigo-600" />{" "}
                      Resource Feedback
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                      {resource.metrics?.averageRating || 0} ★ (
                      {resource.metrics?.totalRatings || 0} ratings)
                    </span>
                  </div>

                  {resource.hasRated ? (
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <CheckCircle2 size={18} />
                        <p className="text-sm font-bold">
                          You rated this resource {resource.userRating} / 5
                          Stars
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-emerald-600">
                        Thank you for sharing your feedback!
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleRatingSubmit} className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-2">
                          Rate this resource:
                        </p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setUserRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 text-slate-300 transition hover:scale-110"
                            >
                              <Star
                                size={24}
                                className={`${
                                  (hoverRating || userRating) >= star
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-300"
                                }`}
                              />
                            </button>
                          ))}
                          <span className="ml-2 text-xs font-bold text-slate-700">
                            {userRating} Stars
                          </span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={submittingRating}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-700"
                      >
                        {submittingRating ? (
                          <RefreshCw size={14} className="animate-spin" />
                        ) : (
                          <Send size={14} />
                        )}
                        Submit Rating
                      </button>
                    </form>
                  )}
                </section>

                {resource.keyTakeaways?.length > 0 && (
                  <section className="rounded-2xl border border-purple-100 bg-purple-50/50 p-6">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-purple-800">
                      <Award size={18} /> Key Takeaways
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc list-inside">
                      {resource.keyTakeaways.map((takeaway, index) => (
                        <li key={index}>{takeaway}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}

            {/* TAB 2: STRUCTURED CURRICULUM */}
            {activeTab === "curriculum" && (
              <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
                <div className="mb-4 flex items-center justify-between text-sm font-bold text-slate-900">
                  <span className="flex items-center gap-2">
                    <Layers size={18} className="text-indigo-600" /> Module
                    Breakdown
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {resource.modules?.length || 0} Sections
                  </span>
                </div>

                {!resource.modules || resource.modules.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No structured modules available.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {resource.modules.map((module, idx) => (
                      <div
                        key={module._id || idx}
                        className="rounded-xl border border-slate-200/80 bg-slate-50/60 overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setExpandedModule(
                              expandedModule === idx ? null : idx
                            )
                          }
                          className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-100/60"
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              Module {idx + 1}: {module.title}
                            </p>
                            {module.durationInMinutes > 0 && (
                              <p className="text-xs text-slate-500 mt-0.5">
                                Duration: {module.durationInMinutes} mins
                              </p>
                            )}
                          </div>
                          {expandedModule === idx ? (
                            <ChevronUp size={18} className="text-slate-400" />
                          ) : (
                            <ChevronDown size={18} className="text-slate-400" />
                          )}
                        </button>

                        {expandedModule === idx && (
                          <div className="border-t border-slate-200/80 bg-white p-4 text-sm text-slate-700 space-y-4">
                            {module.description && <p>{module.description}</p>}

                            {module.videoUrl && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-bold text-indigo-600 flex items-center gap-1.5">
                                    <Video size={15} /> Module Video Tutorial
                                  </p>
                                  <a
                                    href={module.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                                  >
                                    <ExternalLink size={13} /> Open in YouTube
                                  </a>
                                </div>

                                <div className="relative overflow-hidden rounded-lg bg-slate-900 aspect-video max-w-xl">
                                  <iframe
                                    src={getYouTubeEmbedUrl(module.videoUrl)}
                                    title={module.title}
                                    className="h-full w-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                  />
                                </div>
                              </div>
                            )}

                            {module.content && (
                              <div className="max-h-60 overflow-y-auto rounded-lg bg-slate-50 p-3.5 font-mono text-xs border border-slate-200/80 text-slate-800 whitespace-pre-line">
                                {module.content}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* TAB 3: ATTACHMENTS (WITH INDIVIDUAL FILE DOWNLOAD) */}
            {activeTab === "attachments" && (
              <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
                <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
                  <FileDown size={18} className="text-indigo-600" /> Attachments
                  & Files
                </div>

                {!resource.attachments || resource.attachments.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No attachments uploaded.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {resource.attachments.map((file) => (
                      <div
                        key={file._id}
                        className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/60 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <FileText size={20} className="text-indigo-600" />
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {file.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              Type: {(file.fileType || "pdf").toUpperCase()} •
                              Size: {formatFileSize(file.fileSize)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownloadFile(file.fileUrl)}
                          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                        >
                          <Download size={14} /> Download
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* TAB 4: METADATA & ADMIN DETAILS */}
            {activeTab === "metadata" && (
              <section className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-6 shadow-xs">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Shield size={18} className="text-indigo-600" /> System
                  Attributes
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs uppercase font-bold text-slate-400">
                      Resource ID
                    </p>
                    <p className="font-mono text-slate-800 mt-1">
                      {resource._id}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs uppercase font-bold text-slate-400">
                      SEO Slug
                    </p>
                    <p className="font-mono text-slate-800 mt-1">
                      {resource.slug || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs uppercase font-bold text-slate-400">
                      Status
                    </p>
                    <p className="font-bold text-emerald-600 mt-1">
                      {resource.status}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs uppercase font-bold text-slate-400">
                      Premium Flag
                    </p>
                    <p className="font-bold text-slate-800 mt-1">
                      {resource.isPremium ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            {resource.author && (
              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-3">
                  {resource.author.avatar ? (
                    <img
                      src={getFullUrl(resource.author.avatar)}
                      alt={resource.author.name}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <User size={20} />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {resource.author.name || "GuideX Team"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {resource.author.role || "Author"}
                    </p>
                  </div>
                </div>
                {resource.author.bio && (
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {resource.author.bio}
                  </p>
                )}
              </section>
            )}

            {resource.prerequisites?.length > 0 && (
              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
                <p className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">
                  Prerequisites
                </p>
                <div className="flex flex-wrap gap-2">
                  {resource.prerequisites.map((req, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-slate-100 border border-slate-200/60 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {resource.targetAudience?.length > 0 && (
              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
                <p className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">
                  Target Audience
                </p>
                <div className="space-y-2 text-xs text-slate-700">
                  {resource.targetAudience.map((audience, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                      {audience}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {(resource.skills?.length > 0 || resource.tags?.length > 0) && (
              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
                <p className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">
                  Skills & Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {[...(resource.skills || []), ...(resource.tags || [])].map(
                    (tag, i) => (
                      <span
                        key={i}
                        className="rounded-lg border border-indigo-100 bg-indigo-50/60 px-2.5 py-1 text-xs font-semibold text-indigo-700"
                      >
                        #{tag}
                      </span>
                    )
                  )}
                </div>
              </section>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
