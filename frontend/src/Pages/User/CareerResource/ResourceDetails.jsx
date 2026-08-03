import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Heart,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Eye,
  CalendarDays,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  BookOpen,
  Download,
  Copy,
  HardDrive,
  Clock3,
  File,
  Globe,
  Info,
  Sparkles,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// =====================================================
// TOKEN
// =====================================================

const getToken = () => {
  return (
    localStorage.getItem("UserToken") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("token")
  );
};

// =====================================================
// FULL RESOURCE URL
// =====================================================

const getFullResourceUrl = (url) => {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${API_BASE_URL.replace(/\/$/, "")}/${url.replace(/^\/+/, "")}`;
};

// =====================================================
// CATEGORY ICON
// =====================================================

const getCategoryIcon = (category) => {
  switch (category) {
    case "Interview Preparation":
      return "📚";

    case "Coding Roadmaps":
      return "💻";

    case "Resume Templates":
      return "📄";

    case "Career Guidance":
      return "🎯";

    case "Skill Development":
      return "🧠";

    default:
      return "📖";
  }
};

// =====================================================
// CATEGORY STYLE
// =====================================================

const getCategoryStyle = (category) => {
  switch (category) {
    case "Interview Preparation":
      return "bg-blue-50 text-blue-700 border-blue-100";

    case "Coding Roadmaps":
      return "bg-violet-50 text-violet-700 border-violet-100";

    case "Resume Templates":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";

    case "Career Guidance":
      return "bg-amber-50 text-amber-700 border-amber-100";

    case "Skill Development":
      return "bg-pink-50 text-pink-700 border-pink-100";

    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

// =====================================================
// DATE FORMAT
// =====================================================

const formatDate = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// =====================================================
// DATE TIME FORMAT
// =====================================================

const formatDateTime = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// =====================================================
// FILE SIZE
// =====================================================

const formatFileSize = (bytes) => {
  if (!bytes || bytes <= 0) {
    return "Not available";
  }

  if (bytes < 1024) {
    return `${bytes} Bytes`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function ResourceDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  // =====================================================
  // STATES
  // =====================================================

  const [resource, setResource] = useState(null);

  const [loading, setLoading] = useState(true);

  const [liking, setLiking] = useState(false);

  const [downloading, setDownloading] = useState(false);

  const [error, setError] = useState("");

  const [toast, setToast] = useState(null);

  // =====================================================
  // TOAST
  // =====================================================

  const showToast = (type, message) => {
    setToast({
      type,
      message,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // =====================================================
  // FETCH RESOURCE
  // =====================================================

  const fetchResource = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Please login to access resources");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/resources/published/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load resource"
        );
      }

      const loadedResource =
        data.resource || data.data;

      if (!loadedResource) {
        throw new Error("Resource not found");
      }

      setResource(loadedResource);

      // =================================================
      // TRACK VIEW
      // =================================================

      try {
        const viewResponse = await fetch(
          `${API_BASE_URL}/api/resources/${id}/view`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const viewData = await viewResponse.json();

        if (viewResponse.ok) {
          setResource((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              views:
                viewData.views !== undefined
                  ? viewData.views
                  : prev.views,
            };
          });
        }
      } catch (viewError) {
        console.error(
          "View tracking error:",
          viewError
        );
      }
    } catch (error) {
      console.error(
        "Fetch Resource Error:",
        error
      );

      setError(
        error.message ||
          "Failed to load resource"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    if (!id) {
      setError("Resource ID is missing");
      setLoading(false);
      return;
    }

    fetchResource();
  }, [id]);

  // =====================================================
  // LIKE / UNLIKE
  // =====================================================

  const handleLike = async () => {
    try {
      const token = getToken();

      if (!token) {
        showToast(
          "error",
          "Please login to like this resource"
        );

        return;
      }

      if (!resource) return;

      setLiking(true);

      const response = await fetch(
        `${API_BASE_URL}/api/resources/${id}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update like"
        );
      }

      setResource((prev) => ({
        ...prev,

        likes:
          data.likes !== undefined
            ? data.likes
            : prev.likes,

        isLiked:
          data.isLiked !== undefined
            ? data.isLiked
            : prev.isLiked,
      }));

      showToast(
        "success",
        data.isLiked
          ? "Resource added to your likes"
          : "Resource removed from your likes"
      );
    } catch (error) {
      console.error(
        "Like Error:",
        error
      );

      showToast(
        "error",
        error.message ||
          "Failed to update like"
      );
    } finally {
      setLiking(false);
    }
  };

  // =====================================================
  // RESOURCE URL
  // =====================================================

  const isExternalLink =
    resource?.resourceType ===
    "External Link";

  const resourceUrl = isExternalLink
    ? resource?.externalUrl
    : getFullResourceUrl(
        resource?.fileUrl
      );

  // =====================================================
  // OPEN RESOURCE
  // =====================================================

  const handleOpenResource = () => {
    if (!resourceUrl) {
      showToast(
        "error",
        "Resource URL is not available"
      );

      return;
    }

    window.open(
      resourceUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================================
  // COPY URL
  // =====================================================

  const handleCopyUrl = async () => {
    if (!resourceUrl) {
      showToast(
        "error",
        "Resource URL is not available"
      );

      return;
    }

    try {
      await navigator.clipboard.writeText(
        resourceUrl
      );

      showToast(
        "success",
        "Resource URL copied"
      );
    } catch (error) {
      console.error(
        "Copy URL Error:",
        error
      );

      showToast(
        "error",
        "Unable to copy resource URL"
      );
    }
  };

  // =====================================================
  // DOWNLOAD RESOURCE
  // =====================================================

  const handleDownload = async () => {
    if (!resource?.fileUrl) {
      showToast(
        "error",
        "Resource file is not available"
      );

      return;
    }

    try {
      setDownloading(true);

      const token = getToken();

      // Optional backend download tracking
      try {
        await fetch(
          `${API_BASE_URL}/api/resources/${id}/download`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (downloadTrackError) {
        console.error(
          "Download tracking error:",
          downloadTrackError
        );
      }

      window.open(
        resourceUrl,
        "_blank",
        "noopener,noreferrer"
      );

      showToast(
        "success",
        "Resource opened successfully"
      );
    } catch (error) {
      console.error(
        "Download Error:",
        error
      );

      showToast(
        "error",
        "Unable to open resource"
      );
    } finally {
      setDownloading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8">

          <div className="h-8 w-40 animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-8 h-[420px] animate-pulse rounded-3xl bg-white" />

          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>

        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">

        <div className="mx-auto max-w-3xl">

          <button
            onClick={() =>
              navigate("/resources")
            }
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600"
          >
            <ArrowLeft size={17} />
            Back to Resources
          </button>

          <div className="rounded-3xl border border-red-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertCircle size={28} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Resource Not Found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error ||
                "The requested resource could not be found."}
            </p>

            <button
              onClick={() =>
                navigate("/resources")
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
            >
              <ArrowLeft size={16} />
              Back to Resources
            </button>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const isLiked =
    resource.isLiked || false;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================================================= */}
      {/* TOAST */}
      {/* ================================================= */}

      {toast && (
        <div className="fixed right-5 top-5 z-50">

          <div
            className={`flex min-w-[300px] items-center gap-3 rounded-2xl border bg-white px-5 py-4 shadow-2xl ${
              toast.type === "success"
                ? "border-emerald-200 text-emerald-700"
                : "border-red-200 text-red-700"
            }`}
          >

            {toast.type === "success" ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}

            <p className="text-sm font-semibold">
              {toast.message}
            </p>

            <button
              onClick={() =>
                setToast(null)
              }
              className="ml-auto rounded-lg p-1 hover:bg-slate-100"
            >
              <X size={17} />
            </button>

          </div>

        </div>
      )}

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">

          <button
            onClick={() =>
              navigate("/resources")
            }
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft size={18} />
            Back to Resources
          </button>

          <button
            onClick={fetchResource}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

        </div>

      </header>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">

        {/* ================================================= */}
        {/* HERO */}
        {/* ================================================= */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="p-6 sm:p-8 lg:p-10">

            <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">

              {/* RESOURCE INFO */}

              <div className="max-w-4xl">

                <div className="flex flex-wrap items-center gap-3">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    {isExternalLink ? (
                      <LinkIcon size={30} />
                    ) : (
                      <FileText size={30} />
                    )}
                  </div>

                  <span
                    className={`rounded-full border px-4 py-2 text-xs font-bold ${getCategoryStyle(
                      resource.category
                    )}`}
                  >
                    {getCategoryIcon(
                      resource.category
                    )}{" "}
                    {resource.category ||
                      "General"}
                  </span>

                  <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
                    {resource.resourceType ||
                      "Resource"}
                  </span>

                </div>

                <h1 className="mt-7 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                  {resource.title}
                </h1>

                <p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-8 text-slate-600 sm:text-base">
                  {resource.description ||
                    "No description available for this resource."}
                </p>

                <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-500">

                  <span className="flex items-center gap-2">
                    <CalendarDays
                      size={16}
                      className="text-indigo-500"
                    />
                    Published{" "}
                    {formatDate(
                      resource.createdAt
                    )}
                  </span>

                  {resource.updatedAt && (
                    <span className="flex items-center gap-2">
                      <Clock3
                        size={16}
                        className="text-violet-500"
                      />
                      Updated{" "}
                      {formatDate(
                        resource.updatedAt
                      )}
                    </span>
                  )}

                </div>

              </div>

              {/* ACTIONS */}

              <div className="flex flex-col gap-3 sm:flex-row lg:min-w-[180px] lg:flex-col">

                <button
                  onClick={handleLike}
                  disabled={liking}
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-bold transition ${
                    isLiked
                      ? "border-rose-200 bg-rose-50 text-rose-600"
                      : "border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                  }`}
                >

                  {liking ? (
                    <RefreshCw
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <Heart
                      size={18}
                      className={
                        isLiked
                          ? "fill-current"
                          : ""
                      }
                    />
                  )}

                  {isLiked
                    ? "Liked"
                    : "Like"}

                  <span>
                    {resource.likes || 0}
                  </span>

                </button>

                <button
                  onClick={
                    handleOpenResource
                  }
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700"
                >
                  <ExternalLink size={18} />

                  {isExternalLink
                    ? "Open Link"
                    : "Open Resource"}
                </button>

              </div>

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* RESOURCE STATS */}
        {/* ================================================= */}

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <MetricCard
            icon={Eye}
            label="Views"
            value={
              resource.views || 0
            }
            iconStyle="bg-blue-50 text-blue-600"
          />

          <MetricCard
            icon={Heart}
            label="Likes"
            value={
              resource.likes || 0
            }
            iconStyle="bg-rose-50 text-rose-600"
          />

          <MetricCard
            icon={Download}
            label="Downloads"
            value={
              resource.downloads || 0
            }
            iconStyle="bg-emerald-50 text-emerald-600"
          />

          <MetricCard
            icon={CalendarDays}
            label="Published"
            value={formatDate(
              resource.createdAt
            )}
            iconStyle="bg-violet-50 text-violet-600"
          />

        </div>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ================================================= */}
          {/* LEFT CONTENT */}
          {/* ================================================= */}

          <div className="space-y-6 lg:col-span-2">

            {/* ABOUT RESOURCE */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <SectionHeader
                icon={Info}
                title="About This Resource"
              />

              <div className="mt-6 rounded-2xl bg-slate-50 p-5 sm:p-6">

                <p className="whitespace-pre-line text-sm leading-8 text-slate-600 sm:text-base">
                  {resource.description ||
                    "No description available for this resource."}
                </p>

              </div>

            </section>

            {/* RESOURCE INFORMATION */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <SectionHeader
                icon={BookOpen}
                title="Resource Information"
              />

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <InfoCard
                  icon={BookOpen}
                  label="Category"
                  value={
                    resource.category ||
                    "General"
                  }
                />

                <InfoCard
                  icon={File}
                  label="Resource Type"
                  value={
                    resource.resourceType ||
                    "Resource"
                  }
                />

                <InfoCard
                  icon={CalendarDays}
                  label="Published On"
                  value={formatDate(
                    resource.createdAt
                  )}
                />

                <InfoCard
                  icon={Clock3}
                  label="Last Updated"
                  value={formatDate(
                    resource.updatedAt
                  )}
                />

              </div>

            </section>

            {/* FILE DETAILS */}

            {!isExternalLink && (

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                <SectionHeader
                  icon={HardDrive}
                  title="File Details"
                />

                <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                      <FileText size={24} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                        File Name
                      </p>

                      <p className="mt-2 break-words text-sm font-bold text-slate-800">
                        {resource.fileName ||
                          "Resource file"}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-slate-500">

                        {resource.fileSize && (
                          <span className="rounded-lg bg-white px-3 py-2">
                            Size:{" "}
                            {formatFileSize(
                              resource.fileSize
                            )}
                          </span>
                        )}

                        <span className="rounded-lg bg-white px-3 py-2">
                          Downloads:{" "}
                          {resource.downloads ||
                            0}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </section>

            )}

            {/* EXTERNAL LINK */}

            {isExternalLink && (

              <section className="rounded-3xl border border-violet-200 bg-violet-50 p-6 shadow-sm sm:p-8">

                <SectionHeader
                  icon={Globe}
                  title="External Learning Resource"
                />

                <div className="mt-6 rounded-2xl border border-violet-100 bg-white p-5">

                  <p className="break-all text-sm leading-7 text-slate-600">
                    {resource.externalUrl ||
                      "External link unavailable"}
                  </p>

                </div>

              </section>

            )}

          </div>

          {/* ================================================= */}
          {/* RIGHT SIDEBAR */}
          {/* ================================================= */}

          <aside className="space-y-6">

            {/* QUICK ACTIONS */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Sparkles size={19} />
                </div>

                <h2 className="text-lg font-bold text-slate-900">
                  Quick Actions
                </h2>

              </div>

              <div className="mt-5 space-y-3">

                <button
                  onClick={
                    handleOpenResource
                  }
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  <ExternalLink size={17} />
                  Open Resource
                </button>

                {!isExternalLink && (

                  <button
                    onClick={
                      handleDownload
                    }
                    disabled={downloading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >

                    {downloading ? (
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Download size={17} />
                    )}

                    Download Resource

                  </button>

                )}

                <button
                  onClick={
                    handleCopyUrl
                  }
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <Copy size={17} />
                  Copy Resource URL
                </button>

              </div>

            </section>

            {/* ENGAGEMENT */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <SectionHeader
                icon={Eye}
                title="Resource Engagement"
              />

              <div className="mt-5 space-y-3">

                <EngagementRow
                  icon={Eye}
                  label="Views"
                  value={
                    resource.views || 0
                  }
                />

                <EngagementRow
                  icon={Heart}
                  label="Likes"
                  value={
                    resource.likes || 0
                  }
                />

                <EngagementRow
                  icon={Download}
                  label="Downloads"
                  value={
                    resource.downloads || 0
                  }
                />

              </div>

            </section>

            {/* PUBLISHED INFORMATION */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <SectionHeader
                icon={CalendarDays}
                title="Published Information"
              />

              <div className="mt-5 space-y-5">

                <TimelineItem
                  title="Published On"
                  value={formatDateTime(
                    resource.createdAt
                  )}
                  icon={CalendarDays}
                />

                {resource.updatedAt && (
                  <TimelineItem
                    title="Last Updated"
                    value={formatDateTime(
                      resource.updatedAt
                    )}
                    icon={Clock3}
                  />
                )}

              </div>

            </section>

            {/* HELP CARD */}

            <section className="rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white shadow-lg">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <BookOpen size={21} />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Keep Learning
              </h3>

              <p className="mt-2 text-sm leading-6 text-indigo-100">
                Explore more learning resources
                and continue building your skills
                with GuideX.
              </p>

              <button
                onClick={() =>
                  navigate("/resources")
                }
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
              >
                <ArrowLeft size={16} />
                Explore Resources
              </button>

            </section>

          </aside>

        </div>

      </main>

    </div>
  );
}

// =====================================================
// METRIC CARD
// =====================================================

function MetricCard({
  icon: Icon,
  label,
  value,
  iconStyle,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-center gap-4">

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
        >
          <Icon size={21} />
        </div>

        <div className="min-w-0">

          <p className="text-xs font-medium text-slate-400">
            {label}
          </p>

          <p className="mt-1 truncate text-lg font-bold text-slate-900 sm:text-xl">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}

// =====================================================
// SECTION HEADER
// =====================================================

function SectionHeader({
  icon: Icon,
  title,
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        <Icon size={19} />
      </div>

      <h2 className="text-lg font-bold text-slate-900">
        {title}
      </h2>

    </div>
  );
}

// =====================================================
// INFO CARD
// =====================================================

function InfoCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

      <div className="flex items-start gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-500 shadow-sm">
          <Icon size={16} />
        </div>

        <div className="min-w-0">

          <p className="text-xs font-medium text-slate-400">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-bold text-slate-700">
            {value ?? "Not available"}
          </p>

        </div>

      </div>

    </div>
  );
}

// =====================================================
// ENGAGEMENT ROW
// =====================================================

function EngagementRow({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">

      <div className="flex items-center gap-3">

        <Icon
          size={16}
          className="text-indigo-500"
        />

        <span className="text-sm font-medium text-slate-600">
          {label}
        </span>

      </div>

      <span className="text-sm font-bold text-slate-900">
        {value}
      </span>

    </div>
  );
}

// =====================================================
// TIMELINE ITEM
// =====================================================

function TimelineItem({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        <Icon size={16} />
      </div>

      <div className="min-w-0">

        <p className="text-xs font-medium text-slate-400">
          {title}
        </p>

        <p className="mt-1 text-sm font-bold text-slate-700">
          {value}
        </p>

      </div>

    </div>
  );
}
