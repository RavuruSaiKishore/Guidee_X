import { useEffect, useMemo, useState } from "react";
import { useNavigate as useNavigateRouter } from "react-router-dom";

import {
  Search,
  Heart,
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
  Compass,
  GraduationCap,
  Target,
  Users,
  Award,
  ChevronRight,
  Lightbulb,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// =====================================================
// CATEGORIES (Matches Admin Panel Standard Categories)
// =====================================================

const categories = [
  "All",
  "DSA & Coding",
  "System Design",
  "Mock Interviews",
  "Resume Reviews",
  "Aptitude & Reasoning",
  "Core CS Subjects",
  "Behavioral & HR",
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
    return <LinkIcon size={22} />;
  }

  if (resourceType === "PDF") {
    return <FileText size={22} />;
  }

  return <BookOpen size={22} />;
};

// =====================================================
// CATEGORY ICON
// =====================================================

const getCategoryIcon = (category) => {
  switch (category) {
    case "DSA & Coding":
      return "💻";
    case "System Design":
      return "🏗️";
    case "Mock Interviews":
      return "🎯";
    case "Resume Reviews":
      return "📄";
    case "Aptitude & Reasoning":
      return "🧩";
    case "Core CS Subjects":
      return "📚";
    case "Behavioral & HR":
      return "💬";
    default:
      return "📖";
  }
};

// =====================================================
// CATEGORY STYLE
// =====================================================

const getCategoryStyle = (category) => {
  switch (category) {
    case "DSA & Coding":
      return "bg-indigo-50 text-indigo-700 border-indigo-100";
    case "System Design":
      return "bg-purple-50 text-purple-700 border-purple-100";
    case "Mock Interviews":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "Resume Reviews":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "Aptitude & Reasoning":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "Core CS Subjects":
      return "bg-cyan-50 text-cyan-700 border-cyan-100";
    case "Behavioral & HR":
      return "bg-rose-50 text-rose-700 border-rose-100";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

// =====================================================
// RESOURCE TYPE STYLE
// =====================================================

const getResourceTypeStyle = (resourceType) => {
  if (resourceType === "External Link") {
    return "bg-purple-100/70 text-purple-800";
  }

  if (resourceType === "PDF") {
    return "bg-rose-100/70 text-rose-800";
  }

  return "bg-blue-100/70 text-blue-800";
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
// RESOURCE CARD
// =====================================================

function ResourceCard({ resource }) {
  const navigate = useNavigateRouter();
  const isLiked = resource.isLiked || false;

  // Safely extract counts from nested metrics or fallback to flat attributes
  const viewsCount = resource.metrics?.viewsCount ?? resource.views ?? 0;
  const likesCount = resource.metrics?.likesCount ?? resource.likes ?? 0;

  const handleCardClick = () => {
    navigate(`/learning-resources/${resource._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md sm:flex-row sm:items-center sm:gap-6 sm:p-6 cursor-pointer"
    >
      <div className="flex items-start gap-4 sm:items-center">
        {/* RESOURCE TYPE ICON */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors duration-300 group-hover:bg-indigo-600 group-hover:text-white">
          {getResourceIcon(resource.resourceType)}
        </div>

        {/* DETAILS */}
        <div className="min-w-0 flex-1">
          {/* BADGES */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getCategoryStyle(
                resource.category
              )}`}
            >
              <span>{getCategoryIcon(resource.category)}</span>
              {resource.category}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getResourceTypeStyle(
                resource.resourceType
              )}`}
            >
              {resource.resourceType}
            </span>
          </div>

          {/* TITLE */}
          <h3 className="mt-2.5 text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {resource.title}
          </h3>

          {/* PREVIEW DESCRIPTION */}
          <p className="mt-1 line-clamp-1 text-sm text-slate-500 max-w-2xl">
            {resource.description || "Click to view full resource details..."}
          </p>

          {/* METRICS */}
          <div className="mt-3.5 flex items-center gap-5 text-sm text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <Eye size={15} className="text-blue-500" /> {viewsCount}
            </span>
            <span
              className={`flex items-center gap-1.5 font-medium ${
                isLiked ? "text-rose-600" : ""
              }`}
            >
              <Heart
                size={15}
                className={
                  isLiked ? "fill-current text-rose-600" : "text-slate-400"
                }
              />{" "}
              {likesCount}
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-400">
              <CalendarDays size={15} /> {formatDate(resource.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* CTA BUTTON */}
      <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3 sm:mt-0 sm:border-t-0 sm:pt-0">
        <span className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
          View Details
          <ArrowRight size={15} />
        </span>
      </div>
    </div>
  );
}

// =====================================================
// MAIN CAREER RESOURCES COMPONENT
// =====================================================

export default function CareerResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [toast, setToast] = useState(null);

  // =====================================================
  // FETCH PUBLISHED RESOURCES
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

  useEffect(() => {
    fetchResources();
  }, []);

  // =====================================================
  // FILTERING LOGIC
  // =====================================================

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesCategory =
        selectedCategory === "All" || resource.category === selectedCategory;

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
  // INITIAL LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={32} className="animate-spin text-indigo-600" />
          <p className="text-sm font-semibold text-slate-600">
            Loading resource portal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60">
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
              type="button"
              onClick={() => setToast(null)}
              className="ml-auto text-slate-400 hover:text-slate-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          PROFESSIONAL GRADIENT HEADER
      ===================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 py-14 text-white shadow-lg">
        {/* DECORATIVE LIGHTING ACCENTS */}
        <div className="pointer-events-none absolute -left-10 -top-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* BADGE */}
            <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md">
              <Sparkles size={14} className="text-indigo-400" />
              STUDENT RESOURCE HUB
            </div>

            {/* MAIN HEADER TITLE */}
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl text-white">
              Career & Learning Library
            </h1>

            {/* SUBTITLE */}
            <p className="mt-3 text-base text-slate-300 leading-relaxed font-normal">
              Access verified prep kits, coding roadmaps, and interview
              guidelines curated directly by expert mentors.
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="mt-8 max-w-xl">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search topics, sheets, guides, or roadmaps..."
                className="h-14 w-full rounded-xl border border-white/10 bg-white/10 pl-12 pr-10 text-base text-white placeholder-slate-400 backdrop-blur-md outline-none transition focus:border-indigo-400 focus:bg-white/15 focus:ring-4 focus:ring-indigo-500/20"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT AREA
      ===================================================== */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* CATEGORY SELECTOR */}
        <div className="mb-7">
          <div className="mb-3.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Filter size={15} />
            Filter by Category
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  selectedCategory === category
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:text-indigo-600"
                }`}
              >
                {category !== "All" && (
                  <span className="mr-2">{getCategoryIcon(category)}</span>
                )}
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS METRICS */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-600">
            Showing{" "}
            <span className="text-slate-900 font-bold">
              {filteredResources.length}
            </span>{" "}
            published resource{filteredResources.length !== 1 ? "s" : ""}
          </p>

          {(search || selectedCategory !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="text-sm font-bold text-indigo-600 hover:underline inline-flex items-center gap-1.5"
            >
              <X size={15} /> Reset Filters
            </button>
          )}
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-5 text-center">
            <p className="text-sm font-semibold text-red-700">{error}</p>
            <button
              type="button"
              onClick={fetchResources}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
            >
              <RefreshCw size={14} /> Retry Loading
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!error && filteredResources.length === 0 && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <Compass size={28} />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">
              No matching resources found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your category selection or search keywords.
            </p>
          </div>
        )}

        {/* RESOURCE LIST */}
        {filteredResources.length > 0 && (
          <div className="space-y-4">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>
        )}

        {/* =====================================================
            ABOUT GUIDEX & CAREER RESOURCES SECTION
        ===================================================== */}
        <section className="mt-20 border-t border-slate-200/80 pt-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            {/* LEFT COLUMN: ABOUT GUIDEX */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700">
                <GraduationCap size={16} />
                ABOUT GUIDEX PLATFORM
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Empowering Students for Tech & Professional Excellence
              </h2>

              <p className="text-sm leading-7 text-slate-600">
                GuideX is an all-in-one mentorship, event, and career
                acceleration ecosystem designed to bridge the gap between
                academic learning and industry standards. We connect ambitious
                students with top-tier professionals, practical roadmaps, and
                high-impact resources.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-3">
                    <Target size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Curated Roadmaps
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 leading-5">
                    Step-by-step learning paths tailored for software
                    engineering, system architecture, and core placements.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-3">
                    <Users size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Expert Mentorship
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 leading-5">
                    Direct guidance, mock interviews, and resume critiques from
                    engineers working at top global tech firms.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: WHY USE OUR CAREER RESOURCES */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Why Use Our Career Library?
                  </h3>
                  <p className="text-xs text-slate-500">
                    Built to maximize your interview readiness
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-600 leading-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-600 text-[11px]">
                    1
                  </span>
                  <p>
                    <strong className="text-slate-900">
                      Industry Aligned:
                    </strong>{" "}
                    Every cheat sheet, coding sheet, and system design framework
                    is updated regularly to match current hiring trends.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-600 text-[11px]">
                    2
                  </span>
                  <p>
                    <strong className="text-slate-900">
                      Verified & Tested:
                    </strong>{" "}
                    Materials are reviewed by senior practitioners to ensure
                    accuracy, quality, and high signal-to-noise ratio.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-600 text-[11px]">
                    3
                  </span>
                  <p>
                    <strong className="text-slate-900">All-in-One Prep:</strong>{" "}
                    From beginner data structures to advanced behavioral HR
                    rounds, find all your prep kits under a single unified hub.
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs font-semibold text-indigo-600">
                <span>Start exploring top-rated guides above</span>
                <Sparkles size={16} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
