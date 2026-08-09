import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  File,
  FileText,
  Link as LinkIcon,
  Pencil,
  Trash2,
  RefreshCw,
  Heart,
  Users,
  UserRound,
  BriefcaseBusiness,
  Brain,
  Target,
  Bookmark,
  Layers,
  Lock,
  Star,
  FolderArchive,
  FileCode,
  Tag,
  Award,
  ListChecks,
  Lightbulb,
  Video,
  PlayCircle,
  UserCheck,
  Globe,
  Image as ImageIcon,
  ChevronRight,
} from "lucide-react";

import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// =====================================================
// AUTH TOKEN HELPER
// =====================================================

const getToken = () => {
  return (
    localStorage.getItem("AdminToken") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token")
  );
};

// =====================================================
// FORMAT HELPERS
// =====================================================

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "N/A";
  if (bytes < 1024) return `${bytes} Bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

const formatSecondsToMinutes = (seconds) => {
  if (!seconds || seconds === 0) return "N/A";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins} mins`;
};

const getCategoryIcon = (category) => {
  switch (category) {
    case "Interview Preparation":
      return Target;
    case "Coding Roadmaps":
      return Code2;
    case "Resume Templates":
      return FileText;
    case "Career Guidance":
      return BriefcaseBusiness;
    case "Skill Development":
      return Brain;
    case "System Design":
      return Layers;
    default:
      return BookOpen;
  }
};

const getResourceIcon = (type) => {
  switch (type) {
    case "PDF":
      return FileText;
    case "External Link":
      return LinkIcon;
    case "Interactive Guide":
      return Sparkles;
    case "Video Course":
      return Layers;
    case "Template Pack":
      return File;
    default:
      return BookOpen;
  }
};

const getImageUrl = (imageObj) => {
  if (!imageObj) return "";
  const path = typeof imageObj === "string" ? imageObj : imageObj.url;
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const AdminResourceDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // =====================================================
  // FETCH RESOURCE DETAILS
  // =====================================================

  const fetchResource = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();
      const response = await fetch(
        `${API_BASE_URL}/api/resources/details/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch resource details");
      }

      setResource(data.resource);
    } catch (err) {
      console.error("Fetch details error:", err);
      setError(err.message || "Failed to load resource details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchResource();
  }, [id]);

  // =====================================================
  // DELETE RESOURCE
  // =====================================================

  const handleDelete = async () => {
    if (!resource?._id) return;
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this resource?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      const token = getToken();
      const response = await fetch(
        `${API_BASE_URL}/api/resources/delete/${resource._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete resource");
      }

      toast.success("Resource deleted successfully");
      navigate("/admin/careerResources");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.message || "Failed to delete resource");
    } finally {
      setDeleting(false);
    }
  };

  // =====================================================
  // TOGGLE STATUS
  // =====================================================

  const handleToggleStatus = async () => {
    if (!resource?._id) return;

    try {
      setUpdatingStatus(true);
      const token = getToken();
      const response = await fetch(
        `${API_BASE_URL}/api/resources/toggle-status/${resource._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update resource status");
      }

      toast.success("Resource status updated");
      setResource(data.resource || resource);
      await fetchResource();
    } catch (err) {
      console.error("Toggle status error:", err);
      toast.error(err.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // =====================================================
  // ACTION HELPERS
  // =====================================================

  const handleCopyUrl = async (url) => {
    if (!url) {
      toast.error("URL is not available");
      return;
    }

    try {
      let finalUrl = url.trim();
      if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
        const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, "");
        finalUrl = `${BACKEND_URL}/${finalUrl.replace(/^\//, "")}`;
      }
      await navigator.clipboard.writeText(finalUrl);
      toast.success("URL copied to clipboard");
    } catch (err) {
      toast.error("Unable to copy URL");
    }
  };

  // =====================================================
  // LOADING / ERROR STATES
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 h-10 w-40 animate-pulse rounded-xl bg-white" />
          <div className="h-72 animate-pulse rounded-3xl bg-white" />
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-96 animate-pulse rounded-3xl bg-white lg:col-span-2" />
            <div className="h-96 animate-pulse rounded-3xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-3xl text-center">
          <button
            onClick={() => navigate("/admin/careerResources")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"
          >
            <ArrowLeft size={18} /> Back to Resources
          </button>
          <div className="rounded-3xl border border-red-200 bg-white p-10 shadow-sm">
            <FileText size={40} className="mx-auto text-red-500" />
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Resource Not Found
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {error || "Requested resource could not be loaded."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Extract schema values safely
  const ResourceIcon = getResourceIcon(resource.resourceType);
  const CategoryIcon = getCategoryIcon(resource.category);

  const thumbnailUrl = getImageUrl(resource.thumbnail);
  const bannerUrl = getImageUrl(resource.bannerImage);

  const authorName =
    resource.author?.name || resource.authorName || "GuideX Team";
  const authorRole =
    resource.author?.role || resource.authorRole || "Career & Learning";
  const authorBio = resource.author?.bio || "";
  const authorAvatar = getImageUrl(resource.author?.avatar);

  const metrics = {
    views: resource.metrics?.viewsCount ?? resource.views ?? 0,
    downloads: resource.metrics?.downloadsCount ?? resource.downloads ?? 0,
    likes: resource.metrics?.likesCount ?? resource.likes ?? 0,
    saves: resource.metrics?.savesCount ?? 0,
  };

  const likedStudents = resource.likedBy || [];
  const downloadedStudents = resource.downloadedBy || [];
  const savedStudents = resource.savedBy || [];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* TOP BAR */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/admin/careerResources")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
          >
            <ArrowLeft size={18} /> Back to Resources
          </button>

          <button
            onClick={fetchResource}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />{" "}
            Refresh
          </button>
        </div>

        {/* HERO BANNER CARD */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* THUMBNAIL / MEDIA COVER */}
            <div className="relative min-h-[260px] bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 lg:min-h-full">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={resource.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[260px] items-center justify-center text-white">
                  <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-sm">
                      <ResourceIcon size={38} />
                    </div>
                    <p className="mt-3 text-xs font-bold uppercase tracking-wider text-white/80">
                      {resource.resourceType}
                    </p>
                  </div>
                </div>
              )}

              {/* COVER OVERLAY BADGES */}
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-indigo-700 shadow-md">
                  <CategoryIcon size={14} /> {resource.category}
                </span>

                {resource.isFeatured && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/95 px-3 py-1 text-xs font-bold text-white shadow-md">
                    <Star size={12} className="fill-white" /> Featured
                  </span>
                )}

                {resource.isPremium && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-900/90 px-3 py-1 text-xs font-bold text-white shadow-md">
                    <Lock size={12} /> Premium Gated
                  </span>
                )}
              </div>
            </div>

            {/* HERO CONTENT */}
            <div className="p-6 sm:p-8 lg:col-span-2">
              <div className="flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                        resource.status === "Published"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {resource.status === "Published" ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <Clock3 size={14} />
                      )}
                      {resource.status}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {resource.difficulty || "Beginner"}
                    </span>

                    {resource.subcategory && (
                      <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                        {resource.subcategory}
                      </span>
                    )}

                    {resource.estimatedDuration && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                        <Clock3 size={12} /> {resource.estimatedDuration}
                      </span>
                    )}
                  </div>

                  <h1 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl lg:text-4xl">
                    {resource.title}
                  </h1>

                  {resource.subtitle && (
                    <p className="mt-2 text-base font-medium text-slate-500">
                      {resource.subtitle}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={15} className="text-indigo-500" />
                      Created {formatDate(resource.createdAt)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <UserRound size={15} className="text-indigo-500" />
                      {authorName} ({authorRole})
                    </span>
                    {resource.publishedAt && (
                      <span className="flex items-center gap-1.5 text-emerald-600">
                        <CheckCircle2 size={15} /> Published{" "}
                        {formatDate(resource.publishedAt)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Overview
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                    {resource.description}
                  </p>
                </div>

                {/* PRIMARY ACTIONS */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/careerResources/edit/${resource._id}`)
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700"
                  >
                    <Pencil size={15} /> Edit Resource
                  </button>

                  <button
                    onClick={handleToggleStatus}
                    disabled={updatingStatus}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    {updatingStatus ? (
                      <RefreshCw size={15} className="animate-spin" />
                    ) : (
                      <Clock3 size={15} />
                    )}
                    {resource.status === "Published"
                      ? "Move to Draft"
                      : "Publish Resource"}
                  </button>

                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-red-50 px-4 text-xs font-bold text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <MetricCard icon={Eye} label="Views" value={metrics.views} />
          <MetricCard
            icon={Download}
            label="Downloads"
            value={metrics.downloads}
          />
          <MetricCard icon={Heart} label="Likes" value={metrics.likes} />
          <MetricCard icon={Bookmark} label="Saves" value={metrics.saves} />
          <MetricCard
            icon={Users}
            label="Engaged Students"
            value={Math.max(
              likedStudents.length,
              downloadedStudents.length,
              savedStudents.length
            )}
          />
        </div>

        {/* MAIN DETAILS GRID */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* LEFT 2 COLUMNS */}
          <div className="space-y-6 xl:col-span-2">
            {/* RICH BODY CONTENT / ARTICLE (SCROLLABLE AREA) */}
            {resource.bodyContent && (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <SectionHeader
                  icon={FileText}
                  title="Article & Body Content"
                  description="Inline reading material"
                />
                {/* Scrollable container bounded to 384px height max */}
                <div className="mt-4 max-h-96 overflow-y-auto rounded-2xl bg-slate-50 p-5 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <pre className="whitespace-pre-wrap font-sans text-xs leading-6 text-slate-700">
                    {resource.bodyContent}
                  </pre>
                </div>
              </section>
            )}

            {/* PRIMARY VIDEO PLAYER DETAILS */}
            {resource.primaryVideo?.url && (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <SectionHeader
                  icon={Video}
                  title="Primary Resource Video"
                  description="Embedded video media details"
                />

                <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                        <PlayCircle size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="uppercase text-[10px] font-black tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                            {resource.primaryVideo.provider || "YouTube"}
                          </span>
                          {resource.primaryVideo.durationInSeconds > 0 && (
                            <span className="text-xs text-slate-400">
                              Duration:{" "}
                              {formatSecondsToMinutes(
                                resource.primaryVideo.durationInSeconds
                              )}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 break-all text-xs font-mono text-slate-700">
                          {resource.primaryVideo.url}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={resource.primaryVideo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
                      >
                        <ExternalLink size={13} /> Watch Video
                      </a>
                      <button
                        onClick={() => handleCopyUrl(resource.primaryVideo.url)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        <Copy size={13} /> Copy Link
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ATTACHMENT BUNDLE / FILES */}
            {resource.attachments && resource.attachments.length > 0 && (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <SectionHeader
                  icon={FolderArchive}
                  title={`Attached Files (${resource.attachments.length})`}
                  description="Downloadable assets bundle"
                />
                <div className="mt-4 space-y-3">
                  {resource.attachments.map((att, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                          {att.fileType === "pdf" && <FileText size={18} />}
                          {att.fileType === "zip" && (
                            <FolderArchive size={18} />
                          )}
                          {att.fileType === "code" && <FileCode size={18} />}
                          {att.fileType !== "pdf" &&
                            att.fileType !== "zip" &&
                            att.fileType !== "code" && <File size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {att.title}
                          </p>
                          <p className="text-xs text-slate-400">
                            {formatFileSize(att.fileSize)} •{" "}
                            {att.fileType.toUpperCase()}
                            {att.publicId && ` • ID: ${att.publicId}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={getImageUrl(att.fileUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-9 items-center gap-1.5 rounded-xl bg-indigo-50 px-3 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
                        >
                          <Download size={13} /> Download
                        </a>
                        <button
                          onClick={() => handleCopyUrl(att.fileUrl)}
                          className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                          <Copy size={13} /> Copy Link
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CURRICULUM MODULES (WITH FULL BREAKDOWN) */}
            {resource.modules && resource.modules.length > 0 && (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <SectionHeader
                  icon={Layers}
                  title={`Roadmap & Modules (${resource.modules.length})`}
                  description="Sequential curriculum sections"
                />
                <div className="mt-4 space-y-4">
                  {resource.modules.map((mod, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="rounded-lg bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700">
                            Section {idx + 1}
                          </span>
                          {mod.isFreePreview ? (
                            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              Free Preview
                            </span>
                          ) : (
                            <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                              Locked
                            </span>
                          )}
                        </div>
                        {mod.durationInMinutes > 0 && (
                          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                            <Clock3 size={12} /> {mod.durationInMinutes} mins
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">
                        {mod.title}
                      </h4>

                      {mod.description && (
                        <p className="text-xs font-medium text-slate-500">
                          {mod.description}
                        </p>
                      )}

                      {mod.content && (
                        <div className="rounded-xl bg-white p-3 border border-slate-200/60 max-h-60 overflow-y-auto">
                          <p className="whitespace-pre-line text-xs leading-5 text-slate-600">
                            {mod.content}
                          </p>
                        </div>
                      )}

                      {mod.videoUrl && (
                        <div className="flex items-center justify-between rounded-xl bg-indigo-50/50 p-2.5 text-xs text-indigo-900 border border-indigo-100/50">
                          <span className="flex items-center gap-1.5 font-medium truncate">
                            <Video
                              size={14}
                              className="text-indigo-600 shrink-0"
                            />
                            <span className="truncate">{mod.videoUrl}</span>
                          </span>
                          <button
                            onClick={() => handleCopyUrl(mod.videoUrl)}
                            className="shrink-0 text-indigo-600 font-bold hover:underline text-[11px]"
                          >
                            Copy Video Link
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* EDUCATIONAL OUTCOMES */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                icon={Award}
                title="Educational Outcomes & Requirements"
                description="Gains, takeaways & prerequisites"
              />

              <div className="mt-5 space-y-6">
                {resource.whatYouWillLearn &&
                  resource.whatYouWillLearn.length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <ListChecks size={15} className="text-indigo-600" />{" "}
                        What You'll Learn
                      </h4>
                      <ul className="mt-2 space-y-2">
                        {resource.whatYouWillLearn.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs font-medium text-slate-700"
                          >
                            <CheckCircle2
                              size={14}
                              className="mt-0.5 shrink-0 text-emerald-500"
                            />{" "}
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {resource.keyTakeaways && resource.keyTakeaways.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <Lightbulb size={15} className="text-amber-500" /> Key
                      Takeaways
                    </h4>
                    <ul className="mt-2 space-y-2">
                      {resource.keyTakeaways.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs font-medium text-slate-700"
                        >
                          <Star
                            size={13}
                            className="mt-0.5 shrink-0 text-amber-500 fill-amber-500"
                          />{" "}
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {resource.prerequisites &&
                  resource.prerequisites.length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <Target size={15} className="text-indigo-600" />{" "}
                        Prerequisites
                      </h4>
                      <ul className="mt-2 space-y-2">
                        {resource.prerequisites.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs font-medium text-slate-700"
                          >
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />{" "}
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </section>

            {/* DEDICATED STUDENT INTERACTIONS ACTION CARD */}
            <section
              onClick={() =>
                navigate(`/admin/careerResources/${resource._id}/interactions`)
              }
              className="group cursor-pointer rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 p-6 text-white shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      Student Interactions & Analytics
                    </h3>
                    <p className="mt-0.5 text-xs text-indigo-100">
                      View full student lists who liked ({likedStudents.length}
                      ), downloaded ({downloadedStudents.length}), or bookmarked
                      ({savedStudents.length}) this resource.
                    </p>
                  </div>
                </div>

                <div className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-600 shadow-sm transition group-hover:bg-indigo-50">
                  <span>View Full Interactions</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN SIDEBAR */}
          <div className="space-y-6">
            {/* AUTHOR CREDIT CARD */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                icon={UserCheck}
                title="Author Attribution"
                description="Resource creator profile"
              />

              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-indigo-50/70 p-4 border border-indigo-100/60">
                {authorAvatar ? (
                  <img
                    src={authorAvatar}
                    alt={authorName}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-black">
                    {authorName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {authorName}
                  </h4>
                  <p className="text-xs font-medium text-indigo-600">
                    {authorRole}
                  </p>
                </div>
              </div>

              {authorBio && (
                <p className="mt-3 text-xs leading-5 text-slate-500 bg-slate-50 p-3 rounded-xl">
                  {authorBio}
                </p>
              )}
            </section>

            {/* TAXONOMY & TAGS */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                icon={Tag}
                title="Skills & Tags"
                description="Platform search taxonomy"
              />

              {resource.skills && resource.skills.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Skills Covered
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {resource.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {resource.tags && resource.tags.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Search Tags
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {resource.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* AUDIENCE */}
            {resource.targetAudience && resource.targetAudience.length > 0 && (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <SectionHeader
                  icon={Target}
                  title="Target Audience"
                  description="Intended audience segments"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {resource.targetAudience.map((aud) => (
                    <span
                      key={aud}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700"
                    >
                      {aud}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* BANNER MEDIA PREVIEW */}
            {bannerUrl && (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <SectionHeader
                  icon={ImageIcon}
                  title="Hero Banner Image"
                  description="Secondary cover media"
                />
                <img
                  src={bannerUrl}
                  alt="Hero Banner"
                  className="mt-3 h-32 w-full rounded-2xl object-cover border border-slate-200"
                />
              </section>
            )}

            {/* SEO SUMMARY */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                icon={Globe}
                title="SEO Metadata & Slug"
                description="Search engine optimization"
              />
              <div className="mt-3 space-y-3">
                <InfoItem
                  icon={Globe}
                  label="URL Slug"
                  value={resource.slug || "N/A"}
                />
                <InfoItem
                  icon={Globe}
                  label="SEO Title"
                  value={resource.seo?.title || resource.title}
                />
                <InfoItem
                  icon={FileText}
                  label="SEO Description"
                  value={resource.seo?.description || resource.subtitle}
                />
                {resource.seo?.keywords && resource.seo.keywords.length > 0 && (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      SEO Keywords
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {resource.seo.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="rounded-md bg-white border border-slate-200/80 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// UI HELPER COMPONENTS

function MetricCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="text-lg font-black text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        <Icon size={18} />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        {description && <p className="text-xs text-slate-400">{description}</p>}
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-all text-xs font-bold text-slate-700">
        {value || "N/A"}
      </p>
    </div>
  );
}

export default AdminResourceDetails;
