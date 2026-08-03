import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Heart,
  Download,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  BookOpen,
  Eye,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  X,
  CalendarDays,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// =====================================================
// CATEGORIES
// =====================================================

const categories = [
  "All",
  "Interview Preparation",
  "Coding Roadmaps",
  "Resume Templates",
  "Career Guidance",
  "Skill Development",
];

// =====================================================
// GET STUDENT TOKEN
// =====================================================

const getToken = () => {
  return (
    localStorage.getItem("UserToken") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("token")
  );
};

// =====================================================
// RESOURCE ICON
// =====================================================

const getResourceIcon = (resourceType) => {
  if (resourceType === "External Link") {
    return <LinkIcon size={21} />;
  }

  if (resourceType === "PDF") {
    return <FileText size={21} />;
  }

  return <BookOpen size={21} />;
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
// RESOURCE TYPE STYLE
// =====================================================

const getResourceTypeStyle = (resourceType) => {
  if (resourceType === "External Link") {
    return "bg-violet-50 text-violet-700";
  }

  if (resourceType === "PDF") {
    return "bg-red-50 text-red-700";
  }

  return "bg-blue-50 text-blue-700";
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
// BUILD FILE URL
// =====================================================

const getFileUrl = (fileUrl) => {
  if (!fileUrl) {
    return "";
  }

  // Already a complete URL
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
    return fileUrl;
  }

  // Convert relative path into backend URL
  return `${API_BASE_URL.replace(/\/$/, "")}/${fileUrl.replace(/^\//, "")}`;
};

// =====================================================
// RESOURCE CARD
// =====================================================

function ResourceCard({ resource }) {
  const navigate = useNavigate();

  const isLiked = resource.isLiked || false;

  const isExternalLink = resource.resourceType === "External Link";

  // =====================================================
  // VIEW DETAILS
  // =====================================================

  const handleViewDetails = (e) => {
    e.stopPropagation();

    navigate(`/learning-resources/${resource._id}`);
  };

  // =====================================================
  // OPEN RESOURCE
  // =====================================================

  const handleOpenResource = (e) => {
    e.stopPropagation();

    try {
      // =================================================
      // EXTERNAL LINK
      // =================================================

      if (isExternalLink) {
        if (!resource.externalUrl) {
          alert("External resource link is not available");

          return;
        }

        window.open(resource.externalUrl, "_blank", "noopener,noreferrer");

        return;
      }

      // =================================================
      // FILE RESOURCE
      // =================================================

      const fullFileUrl = getFileUrl(resource.fileUrl);

      if (!fullFileUrl) {
        alert("Resource file is not available");

        return;
      }

      console.log("Opening resource:", fullFileUrl);

      // IMPORTANT:
      // Do not use navigate() here.
      // This opens the actual uploaded file.
      window.open(fullFileUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Open Resource Error:", error);

      alert("Failed to open resource");
    }
  };

  // =====================================================
  // CARD CLICK
  // =====================================================

  const handleCardClick = () => {
    navigate(`/learning-resources/${resource._id}`);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      onClick={handleCardClick}
      className="group w-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
    >
      {/* ================================================= */}
      {/* HORIZONTAL RESOURCE CONTENT */}
      {/* ================================================= */}

      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
        {/* ================================================= */}
        {/* RESOURCE ICON */}
        {/* ================================================= */}

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white">
          {getResourceIcon(resource.resourceType)}
        </div>

        {/* ================================================= */}
        {/* RESOURCE INFORMATION */}
        {/* ================================================= */}

        <div className="min-w-0 flex-1">
          {/* ================================================= */}
          {/* CATEGORY + TYPE */}
          {/* ================================================= */}

          <div className="flex flex-wrap items-center gap-2">
            {/* CATEGORY */}

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${getCategoryStyle(
                resource.category
              )}`}
            >
              <span>{getCategoryIcon(resource.category)}</span>

              {resource.category}
            </span>

            {/* RESOURCE TYPE */}

            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${getResourceTypeStyle(
                resource.resourceType
              )}`}
            >
              {resource.resourceType}
            </span>
          </div>

          {/* ================================================= */}
          {/* TITLE */}
          {/* ================================================= */}

          <h3 className="mt-2 line-clamp-1 text-base font-bold text-slate-900 sm:text-lg">
            {resource.title}
          </h3>

          {/* ================================================= */}
          {/* DESCRIPTION */}
          {/* ================================================= */}

          <p className="mt-1 line-clamp-2 max-w-4xl text-sm leading-6 text-slate-500">
            {resource.description ||
              "No description available for this resource."}
          </p>

          {/* ================================================= */}
          {/* RESOURCE STATS */}
          {/* ================================================= */}

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
            {/* VIEWS */}

            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Eye size={14} />

              <span>{resource.views || 0} views</span>
            </div>

            {/* LIKES */}

            <div
              className={`flex items-center gap-1.5 text-xs font-semibold ${
                isLiked ? "text-rose-600" : "text-slate-400"
              }`}
            >
              <Heart size={14} className={isLiked ? "fill-current" : ""} />

              <span>{resource.likes || 0} likes</span>
            </div>

            {/* DOWNLOADS */}

            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Download size={14} />

              <span>{resource.downloads || 0} downloads</span>
            </div>

            {/* CREATED DATE */}

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <CalendarDays size={14} />

              <span>{formatDate(resource.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* ACTION BUTTONS */}
        {/* ================================================= */}

        <div className="flex shrink-0 gap-2 sm:flex-col lg:flex-row">
          {/* ================================================= */}
          {/* VIEW DETAILS */}
          {/* ================================================= */}

          <button
            type="button"
            onClick={handleViewDetails}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <ExternalLink size={14} />

            <span>View Details</span>
          </button>

          {/* ================================================= */}
          {/* OPEN / DOWNLOAD */}
          {/* ================================================= */}

          <button
            type="button"
            onClick={handleOpenResource}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
          >
            {isExternalLink ? (
              <>
                <ExternalLink size={14} />

                <span>Open</span>
              </>
            ) : (
              <>
                <Download size={14} />

                <span>Download</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function CareerResources() {
  const [resources, setResources] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [toast, setToast] = useState(null);

  // =====================================================
  // SHOW TOAST
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
  // FETCH RESOURCES
  // =====================================================

  const fetchResources = async () => {
    try {
      setLoading(true);

      setError("");

      const token = getToken();

      const response = await fetch(`${API_BASE_URL}/api/resources/published`, {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log("Published Resources:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to load resources");
      }

      setResources(data.resources || []);
    } catch (error) {
      console.error("Fetch resources error:", error);

      setError(error.message || "Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
    fetchResources();
  }, []);

  // =====================================================
  // FILTER RESOURCES
  // =====================================================

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      // CATEGORY FILTER

      const matchesCategory =
        selectedCategory === "All" || resource.category === selectedCategory;

      // SEARCH

      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        resource.title?.toLowerCase().includes(searchValue) ||
        resource.description?.toLowerCase().includes(searchValue) ||
        resource.category?.toLowerCase().includes(searchValue) ||
        resource.resourceType?.toLowerCase().includes(searchValue);

      return matchesCategory && matchesSearch;
    });
  }, [resources, selectedCategory, search]);

  // =====================================================
  // LOADING UI
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <RefreshCw size={26} className="animate-spin" />
          </div>

          <p className="text-sm font-semibold text-slate-500">
            Loading learning resources...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

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

            <p className="text-sm font-semibold">{toast.message}</p>

            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-auto text-slate-400 hover:text-slate-700"
            >
              <X size={17} />
            </button>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="max-w-3xl">
            {/* BADGE */}

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-600">
              <Sparkles size={15} />
              GUIDE X LEARNING HUB
            </div>

            {/* TITLE */}

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Learning Resources
            </h1>

            {/* DESCRIPTION */}

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Explore curated learning materials, interview preparation guides,
              coding roadmaps, resume templates, and career resources designed
              to help you grow your skills.
            </p>
          </div>

          {/* ================================================= */}
          {/* SEARCH */}
          {/* ================================================= */}

          <div className="mt-8 max-w-2xl">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resources, roadmaps, interview guides..."
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-5 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />

              {/* CLEAR SEARCH */}

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ================================================= */}
        {/* CATEGORY FILTER */}
        {/* ================================================= */}

        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Filter size={17} className="text-slate-500" />

            <h2 className="text-sm font-bold text-slate-800">
              Browse by Category
            </h2>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                }`}
              >
                {category !== "All" && (
                  <span className="mr-1.5">{getCategoryIcon(category)}</span>
                )}

                {category}
              </button>
            ))}
          </div>
        </div>

        {/* ================================================= */}
        {/* RESULTS HEADER */}
        {/* ================================================= */}

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {selectedCategory === "All"
                ? "All Learning Resources"
                : selectedCategory}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredResources.length} resource
              {filteredResources.length !== 1 ? "s" : ""} available
            </p>
          </div>

          {/* CLEAR FILTERS */}

          {(search || selectedCategory !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
            >
              <X size={15} />
              Clear Filters
            </button>
          )}
        </div>

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle size={20} />

              <p className="text-sm font-semibold">{error}</p>
            </div>

            <button
              type="button"
              onClick={fetchResources}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-700"
            >
              <RefreshCw size={15} />
              Try Again
            </button>
          </div>
        )}

        {/* ================================================= */}
        {/* EMPTY STATE */}
        {/* ================================================= */}

        {!error && filteredResources.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <BookOpen size={28} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No resources found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              We couldn't find any resources matching your search or selected
              category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              View All Resources
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ================================================= */}
        {/* RESOURCE LIST */}
        {/* ================================================= */}

        {filteredResources.length > 0 && (
          <div className="space-y-4">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
