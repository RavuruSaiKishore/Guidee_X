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
  Mail,
  ShieldCheck,
  ShieldOff,
  BriefcaseBusiness,
  Brain,
  Target,
  HardDrive,
  Calendar,
  UserCheck,
  Globe,
  Database,
  BarChart3,
  Image as ImageIcon,
  Info,
  Activity,
  FileArchive,
  Sparkles,
} from "lucide-react";

import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// =====================================================
// GET TOKEN
// =====================================================

const getToken = () => {
  return (
    localStorage.getItem("AdminToken") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token")
  );
};

// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// =====================================================
// FORMAT DATE TIME
// =====================================================

const formatDateTime = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// =====================================================
// FORMAT FILE SIZE
// =====================================================

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) {
    return "N/A";
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
// CATEGORY ICON
// =====================================================

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

    default:
      return BookOpen;
  }
};

// =====================================================
// RESOURCE ICON
// =====================================================

const getResourceIcon = (type) => {
  switch (type) {
    case "PDF":
      return FileText;

    case "External Link":
      return LinkIcon;

    case "File":
      return File;

    default:
      return BookOpen;
  }
};

// =====================================================
// IMAGE URL
// =====================================================

const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "";
  }

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    return imagePath;
  }

  return `${API_BASE_URL.replace(/\/$/, "")}/${imagePath.replace(
    /^\//,
    ""
  )}`;
};

// =====================================================
// ADMIN RESOURCE DETAILS
// =====================================================

const AdminResourceDetails = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  // =====================================================
  // STATES
  // =====================================================

  const [resource, setResource] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [deleting, setDeleting] = useState(false);

  const [updatingStatus, setUpdatingStatus] = useState(false);

  // =====================================================
  // FETCH RESOURCE
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

      console.log("Resource Details:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch resource details"
        );
      }

      setResource(data.resource);
    } catch (error) {
      console.error(
        "Fetch resource details error:",
        error
      );

      setError(
        error.message ||
          "Failed to load resource details"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
    if (id) {
      fetchResource();
    }
  }, [id]);

  // =====================================================
  // DELETE RESOURCE
  // =====================================================

  const handleDelete = async () => {
    if (!resource?._id) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this resource?"
    );

    if (!confirmed) {
      return;
    }

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
        throw new Error(
          data.message ||
            "Failed to delete resource"
        );
      }

      toast.success(
        "Resource deleted successfully"
      );

      navigate("/admin/careerResources");
    } catch (error) {
      console.error(
        "Delete resource error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to delete resource"
      );
    } finally {
      setDeleting(false);
    }
  };

  // =====================================================
  // TOGGLE STATUS
  // =====================================================

  const handleToggleStatus = async () => {
    if (!resource?._id) {
      return;
    }

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
        throw new Error(
          data.message ||
            "Failed to update resource status"
        );
      }

      toast.success(
        "Resource status updated"
      );

      setResource(
        data.resource || resource
      );

      await fetchResource();
    } catch (error) {
      console.error(
        "Toggle status error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to update resource status"
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // =====================================================
  // OPEN RESOURCE
  // =====================================================

 const handleOpenResource = () => {
   if (!resource) {
     toast.error("Resource information is not available");
     return;
   }

   let url = "";

   // External Link
   if (resource.resourceType === "External Link") {
     url = resource.externalUrl?.trim();
   }
   // Uploaded PDF / File
   else {
     const filePath = resource.fileUrl?.trim();

     if (filePath) {
       // Already a complete URL
       if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
         url = filePath;
       } else {
         // Convert relative path into backend URL
         url = `${API_BASE_URL.replace(/\/$/, "")}/${filePath.replace(
           /^\//,
           ""
         )}`;
       }
     }
   }

   if (!url) {
     toast.error("Resource URL is not available");
     return;
   }

   console.log("Opening resource:", url);

   window.open(url, "_blank", "noopener,noreferrer");
 };

  // =====================================================
  // COPY URL
  // =====================================================

const handleCopyUrl = async (url) => {
  if (!url) {
    toast.error("URL is not available");
    return;
  }

  try {
    let finalUrl = url.trim();

    // External URL or already complete URL
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      // Remove /api from API_BASE_URL if it exists
      const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, "");

      // Build complete file URL
      finalUrl = `${BACKEND_URL}/${finalUrl.replace(/^\//, "")}`;
    }

    await navigator.clipboard.writeText(finalUrl);

    toast.success("Resource URL copied to clipboard");
  } catch (error) {
    console.error("Copy URL error:", error);

    toast.error("Unable to copy URL");
  }
};

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">

          <div className="mb-6 h-10 w-40 animate-pulse rounded-xl bg-white" />

          <div className="h-72 animate-pulse rounded-3xl bg-white" />

          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl bg-white"
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

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-3xl">

          <button
            onClick={() =>
              navigate(
                "/admin/careerResources"
              )
            }
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"
          >
            <ArrowLeft size={18} />
            Back to Resources
          </button>

          <div className="rounded-3xl border border-red-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <FileText size={28} />
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
                navigate(
                  "/admin/careerResources"
                )
              }
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <ArrowLeft size={17} />
              Back to Resources
            </button>

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // ICONS
  // =====================================================

  const ResourceIcon = getResourceIcon(
    resource.resourceType
  );

  const CategoryIcon = getCategoryIcon(
    resource.category
  );

  const thumbnailUrl = getImageUrl(
    resource.thumbnail
  );

  const resourceUrl =
    resource.resourceType ===
    "External Link"
      ? resource.externalUrl
      : resource.fileUrl;

  // =====================================================
  // ENGAGEMENT
  // =====================================================

  const likedStudents =
    resource.likedBy || [];

  const downloadedStudents =
    resource.downloadedBy || [];

  const studentsEngaged = Math.max(
    likedStudents.length,
    downloadedStudents.length
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* ================================================= */}
        {/* TOP NAVIGATION */}
        {/* ================================================= */}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate("/admin/careerResources")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
          >
            <ArrowLeft size={18} />
            Back to Resources
          </button>

          <button
            onClick={fetchResource}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ================================================= */}
        {/* HERO RESOURCE CARD */}
        {/* ================================================= */}

        <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* ================================================= */}
            {/* THUMBNAIL */}
            {/* ================================================= */}

            <div className="relative min-h-[250px] overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 lg:min-h-full">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={resource.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[250px] items-center justify-center">
                  <div className="text-center text-white">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-sm">
                      <ResourceIcon size={38} />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-white/80">
                      {resource.resourceType}
                    </p>
                  </div>
                </div>
              )}

              {/* OVERLAY */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* CATEGORY */}

              <div className="absolute left-5 top-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-bold text-indigo-700 shadow-lg">
                  <CategoryIcon size={14} />

                  {resource.category}
                </span>
              </div>
            </div>

            {/* ================================================= */}
            {/* HERO CONTENT */}
            {/* ================================================= */}

            <div className="p-6 sm:p-8 lg:col-span-2">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
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

                      <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                        {resource.resourceType}
                      </span>
                    </div>

                    <h1 className="break-words text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                      {resource.title}
                    </h1>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                      <span className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-indigo-500" />
                        Created {formatDate(resource.createdAt)}
                      </span>

                      <span className="flex items-center gap-2">
                        <UserRound size={16} className="text-indigo-500" />
                        {resource.createdBy || "Admin"}
                      </span>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/careerResources/edit/${resource._id}`)
                      }
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      onClick={handleToggleStatus}
                      disabled={updatingStatus}
                      className="inline-flex h-10 items-center gap-2 rounded-xl bg-amber-50 px-4 text-sm font-bold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
                    >
                      {updatingStatus ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : resource.status === "Published" ? (
                        <Clock3 size={16} />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}

                      {resource.status === "Published" ? "Draft" : "Publish"}
                    </button>

                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="inline-flex h-10 items-center gap-2 rounded-xl bg-red-50 px-4 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                    >
                      {deleting ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>

                {/* DESCRIPTION */}

                <div className="border-t border-slate-100 pt-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Info size={17} className="text-indigo-500" />

                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                      About this resource
                    </p>
                  </div>

                  <p className="max-w-5xl whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {resource.description}
                  </p>
                </div>

                {/* OPEN RESOURCE */}

                {resourceUrl && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleOpenResource}
                      className="inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                    >
                      {resource.resourceType === "External Link" ? (
                        <ExternalLink size={17} />
                      ) : (
                        <Download size={17} />
                      )}

                      {resource.resourceType === "External Link"
                        ? "Open External Resource"
                        : "Open Resource File"}
                    </button>

                    <button
                      onClick={() => handleCopyUrl(resourceUrl)}
                      className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      <Copy size={17} />
                      Copy URL
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* ANALYTICS */}
        {/* ================================================= */}

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <MetricCard
            icon={Eye}
            label="Total Views"
            value={resource.views || 0}
          />

          <MetricCard
            icon={Download}
            label="Downloads"
            value={resource.downloads || 0}
          />

          <MetricCard icon={Heart} label="Likes" value={resource.likes || 0} />

          <MetricCard
            icon={Users}
            label="Engaged Students"
            value={studentsEngaged}
          />

          <MetricCard
            icon={Activity}
            label="Total Activity"
            value={
              (resource.views || 0) +
              (resource.likes || 0) +
              (resource.downloads || 0)
            }
          />
        </div>

        {/* ================================================= */}
        {/* MAIN GRID */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* ================================================= */}
          {/* LEFT CONTENT */}
          {/* ================================================= */}

          <div className="space-y-6 xl:col-span-2">
            {/* ================================================= */}
            {/* COMPLETE RESOURCE INFORMATION */}
            {/* ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <SectionHeader
                icon={Database}
                title="Complete Resource Information"
                description="All information stored for this resource"
              />

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoItem
                  icon={BookOpen}
                  label="Resource Title"
                  value={resource.title}
                />

                <InfoItem
                  icon={Target}
                  label="Category"
                  value={resource.category}
                />

                <InfoItem
                  icon={FileText}
                  label="Resource Type"
                  value={resource.resourceType}
                />

                <InfoItem
                  icon={resource.status === "Published" ? CheckCircle2 : Clock3}
                  label="Status"
                  value={resource.status}
                />

                <InfoItem
                  icon={UserRound}
                  label="Created By"
                  value={resource.createdBy || "Admin"}
                />

                <InfoItem
                  icon={Calendar}
                  label="Created At"
                  value={formatDateTime(resource.createdAt)}
                />

                <InfoItem
                  icon={CalendarDays}
                  label="Last Updated"
                  value={formatDateTime(resource.updatedAt)}
                />

                <InfoItem
                  icon={Database}
                  label="Resource ID"
                  value={resource._id}
                />
              </div>
            </section>

            {/* ================================================= */}
            {/* FILE INFORMATION */}
            {/* ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <SectionHeader
                icon={HardDrive}
                title="File & Content Information"
                description="Complete information about the uploaded content"
              />

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoItem
                  icon={FileText}
                  label="File Name"
                  value={resource.fileName || "No file uploaded"}
                />

                <InfoItem
                  icon={HardDrive}
                  label="File Size"
                  value={formatFileSize(resource.fileSize)}
                />

                <InfoItem
                  icon={Globe}
                  label="External URL"
                  value={resource.externalUrl || "No external URL"}
                />

                <InfoItem
                  icon={File}
                  label="File URL"
                  value={resource.fileUrl || "No file URL"}
                />

                <InfoItem
                  icon={ImageIcon}
                  label="Thumbnail"
                  value={resource.thumbnail || "No thumbnail"}
                />
              </div>

              {/* FILE URL */}

              {resource.fileUrl && (
                <UrlBox
                  label="Uploaded File URL"
                  url={
                    resource.fileUrl.startsWith("http://") ||
                    resource.fileUrl.startsWith("https://")
                      ? resource.fileUrl
                      : `${API_BASE_URL.replace(
                          /\/api\/?$/,
                          ""
                        )}/${resource.fileUrl.replace(/^\//, "")}`
                  }
                  onCopy={handleCopyUrl}
                />
              )}

              {/* EXTERNAL URL */}

              {resource.externalUrl && (
                <UrlBox
                  label="External Resource URL"
                  url={resource.externalUrl}
                  onCopy={handleCopyUrl}
                />
              )}
            </section>

            {/* ================================================= */}
            {/* DESCRIPTION */}
            {/* ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <SectionHeader
                icon={FileText}
                title="Full Description"
                description="Complete resource description"
              />

              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <p className="whitespace-pre-wrap text-sm leading-8 text-slate-600">
                  {resource.description}
                </p>
              </div>
            </section>

            {/* ================================================= */}
            {/* LIKED STUDENTS */}
            {/* ================================================= */}

            <StudentSection
              title="Students Who Liked This Resource"
              icon={Heart}
              students={likedStudents}
              emptyText="No students have liked this resource yet."
            />

            {/* ================================================= */}
            {/* DOWNLOADED STUDENTS */}
            {/* ================================================= */}

            <StudentSection
              title="Students Who Downloaded This Resource"
              icon={Download}
              students={downloadedStudents}
              emptyText="No students have downloaded this resource yet."
            />
          </div>

          {/* ================================================= */}
          {/* RIGHT SIDEBAR */}
          {/* ================================================= */}

          <div className="space-y-6">
            {/* ================================================= */}
            {/* STATUS */}
            {/* ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                icon={ShieldCheck}
                title="Publication Status"
                description="Control student visibility"
              />

              <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500">
                    Current Status
                  </span>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-black ${
                      resource.status === "Published"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {resource.status}
                  </span>
                </div>

                <button
                  onClick={handleToggleStatus}
                  disabled={updatingStatus}
                  className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  {updatingStatus ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : resource.status === "Published" ? (
                    <Clock3 size={16} />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}

                  {resource.status === "Published"
                    ? "Move to Draft"
                    : "Publish Resource"}
                </button>
              </div>
            </section>

            {/* ================================================= */}
            {/* ENGAGEMENT */}
            {/* ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                icon={BarChart3}
                title="Engagement Analytics"
                description="Resource performance"
              />

              <div className="mt-5 space-y-3">
                <EngagementRow
                  icon={Eye}
                  label="Total Views"
                  value={resource.views || 0}
                />

                <EngagementRow
                  icon={Heart}
                  label="Total Likes"
                  value={resource.likes || 0}
                />

                <EngagementRow
                  icon={Download}
                  label="Total Downloads"
                  value={resource.downloads || 0}
                />

                <EngagementRow
                  icon={Heart}
                  label="Students Who Liked"
                  value={likedStudents.length}
                />

                <EngagementRow
                  icon={Download}
                  label="Students Who Downloaded"
                  value={downloadedStudents.length}
                />
              </div>
            </section>

            {/* ================================================= */}
            {/* RESOURCE OWNER */}
            {/* ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                icon={UserCheck}
                title="Resource Owner"
                description="Creation information"
              />

              <div className="mt-5 rounded-2xl bg-indigo-50 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <UserRound size={22} />
                </div>

                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Created By
                </p>

                <p className="mt-1 text-lg font-black text-indigo-950">
                  {resource.createdBy || "Admin"}
                </p>

                <p className="mt-3 text-xs leading-5 text-indigo-700">
                  This resource was created and managed by the administrator.
                </p>
              </div>
            </section>

            {/* ================================================= */}
            {/* QUICK ACCESS */}
            {/* ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                icon={Sparkles}
                title="Quick Access"
                description="Manage this resource"
              />

              <div className="mt-5 space-y-3">
                {resourceUrl && (
                  <button
                    onClick={handleOpenResource}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700"
                  >
                    <ExternalLink size={16} />
                    Open Resource
                  </button>
                )}

                <button
                  onClick={() =>
                    navigate(`/admin/careerResources/edit/${resource._id}`)
                  }
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <Pencil size={16} />
                  Edit Resource
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-50 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                >
                  {deleting ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Delete Resource
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// METRIC CARD
// =====================================================

function MetricCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon size={20} />
        </div>

        <div className="min-w-0">

          <p className="truncate text-xs font-semibold text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-xl font-black text-slate-900">
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
  description,
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        <Icon size={19} />
      </div>

      <div>

        <h2 className="text-lg font-black text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        )}

      </div>

    </div>
  );
}

// =====================================================
// INFO ITEM
// =====================================================

function InfoItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-indigo-100 hover:bg-indigo-50/30">

      <div className="flex items-start gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-500 shadow-sm">
          <Icon size={16} />
        </div>

        <div className="min-w-0">

          <p className="text-xs font-semibold text-slate-400">
            {label}
          </p>

          <p className="mt-1 break-all text-sm font-bold leading-6 text-slate-700">
            {value || "N/A"}
          </p>

        </div>

      </div>

    </div>
  );
}

// =====================================================
// URL BOX
// =====================================================

function UrlBox({
  label,
  url,
  onCopy,
}) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">

      <div className="flex items-center justify-between gap-3">

        <p className="text-xs font-black uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <button
          onClick={() =>
            onCopy(url)
          }
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
        >
          <Copy size={13} />
          Copy
        </button>

      </div>

      <p className="mt-3 break-all rounded-xl bg-white p-3 text-xs leading-5 text-slate-600">
        {url}
      </p>

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

        <span className="text-sm font-semibold text-slate-600">
          {label}
        </span>

      </div>

      <span className="text-sm font-black text-slate-900">
        {value}
      </span>

    </div>
  );
}

// =====================================================
// STUDENT SECTION
// =====================================================

function StudentSection({
  title,
  icon: Icon,
  students,
  emptyText,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

      <div className="flex items-center justify-between gap-4">

        <SectionHeader
          icon={Icon}
          title={title}
          description="Students associated with this resource"
        />

        <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-black text-indigo-600">
          {students.length}
        </span>

      </div>

      {students.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">

          <Users
            size={28}
            className="mx-auto text-slate-300"
          />

          <p className="mt-3 text-sm font-medium text-slate-500">
            {emptyText}
          </p>

        </div>
      ) : (
        <div className="mt-6 overflow-x-auto pb-2">

          <div className="flex min-w-max gap-4">

            {students.map(
              (student, index) => (
                <StudentCompactCard
                  key={
                    student._id ||
                    student.id ||
                    index
                  }
                  student={
                    student
                  }
                />
              )
            )}

          </div>

        </div>
      )}

    </section>
  );
}

// =====================================================
// STUDENT COMPACT CARD
// =====================================================

function StudentCompactCard({
  student,
}) {
  const isObject =
    typeof student ===
    "object" &&
    student !== null;

  const fullName = isObject
    ? `${student.firstName || ""} ${
        student.lastName || ""
      }`.trim() ||
      student.name ||
      "Unknown Student"
    : "Student";

  const email = isObject
    ? student.email ||
      "No email available"
    : "Student ID";

  const studentId = isObject
    ? student._id
    : student;

  const profileImage = isObject
    ? getImageUrl(
        student.profileImage
      )
    : "";

  return (
    <div className="w-80 shrink-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-200 hover:bg-white hover:shadow-md">

      <div className="flex items-center gap-3">

        <div className="relative h-12 w-12 shrink-0">

          {profileImage ? (
            <img
              src={profileImage}
              alt={fullName}
              className="h-12 w-12 rounded-xl object-cover"
              onError={(event) => {
                event.currentTarget.style.display =
                  "none";

                const fallback =
                  event.currentTarget
                    .parentElement
                    .querySelector(
                      ".student-fallback"
                    );

                if (fallback) {
                  fallback.style.display =
                    "flex";
                }
              }}
            />
          ) : null}

          <div
            className="student-fallback h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-sm font-black text-indigo-600"
            style={{
              display: profileImage
                ? "none"
                : "flex",
            }}
          >
            {fullName
              .charAt(0)
              .toUpperCase()}
          </div>

        </div>

        <div className="min-w-0 flex-1">

          <p className="truncate text-sm font-black text-slate-900">
            {fullName}
          </p>

          <p className="mt-1 flex items-center gap-1 truncate text-xs text-slate-500">

            <Mail
              size={12}
              className="shrink-0"
            />

            <span className="truncate">
              {email}
            </span>

          </p>

        </div>

      </div>

      <div className="mt-4 border-t border-slate-200 pt-3">

        <div className="flex items-center justify-between">

          <span className="text-xs font-semibold text-slate-400">
            Student ID
          </span>

          <span className="max-w-[160px] truncate text-xs font-bold text-slate-600">
            {studentId || "N/A"}
          </span>

        </div>

        {isObject && (
          <div className="mt-2 flex items-center justify-between">

            <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">

              {student.isActive ? (
                <>
                  <ShieldCheck
                    size={13}
                    className="text-emerald-500"
                  />

                  <span className="text-emerald-600">
                    Active
                  </span>
                </>
              ) : (
                <>
                  <ShieldOff
                    size={13}
                    className="text-slate-400"
                  />

                  <span>
                    Inactive
                  </span>
                </>
              )}

            </span>

            <span
              className={`text-xs font-bold ${
                student.isBlocked
                  ? "text-red-600"
                  : "text-emerald-600"
              }`}
            >
              {student.isBlocked
                ? "Blocked"
                : "Normal"}
            </span>

          </div>
        )}

      </div>

    </div>
  );
}

export default AdminResourceDetails;
