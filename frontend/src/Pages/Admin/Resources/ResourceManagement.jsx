import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Plus,
  FileText,
  Link as LinkIcon,
  Download,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock3,
  BookOpen,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  File,
  Code2,
  BriefcaseBusiness,
  Brain,
  Target,
  ChevronRight,
  CalendarDays,
  Heart,
  Layers3,
} from "lucide-react";

import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// =====================================================
// CONSTANTS
// =====================================================

const categories = [
  "Interview Preparation",
  "Coding Roadmaps",
  "Resume Templates",
  "Career Guidance",
  "Skill Development",
];

const resourceTypes = ["PDF", "File", "External Link"];

// =====================================================
// GET ADMIN TOKEN
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
  if (type === "External Link") {
    return LinkIcon;
  }

  if (type === "PDF") {
    return FileText;
  }

  return File;
};

// =====================================================
// RESOURCE MANAGEMENT
// =====================================================

const ResourceManagement = () => {
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [resources, setResources] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("All");

  const [typeFilter, setTypeFilter] = useState("All");

  const [statusFilter, setStatusFilter] = useState("All");

  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // =====================================================
  // FETCH ALL RESOURCES
  // =====================================================

  const fetchResources = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = getToken();

      const response = await fetch(`${API_BASE_URL}/api/resources/admin/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Resources API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch resources");
      }

      setResources(data.resources || []);
    } catch (error) {
      console.error("Fetch resources error:", error);

      setError(error.message || "Failed to load resources");
    } finally {
      setLoading(false);
      setRefreshing(false);
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
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        resource.title?.toLowerCase().includes(searchValue) ||
        resource.description?.toLowerCase().includes(searchValue) ||
        resource.category?.toLowerCase().includes(searchValue);

      const matchesCategory =
        categoryFilter === "All" || resource.category === categoryFilter;

      const matchesType =
        typeFilter === "All" || resource.resourceType === typeFilter;

      const matchesStatus =
        statusFilter === "All" || resource.status === statusFilter;

      return matchesSearch && matchesCategory && matchesType && matchesStatus;
    });
  }, [resources, search, categoryFilter, typeFilter, statusFilter]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const stats = useMemo(() => {
    const published = resources.filter(
      (resource) => resource.status === "Published"
    ).length;

    const drafts = resources.filter(
      (resource) => resource.status === "Draft"
    ).length;

    const downloads = resources.reduce(
      (total, resource) => total + (resource.downloads || 0),
      0
    );

    const views = resources.reduce(
      (total, resource) => total + (resource.views || 0),
      0
    );

    const likes = resources.reduce(
      (total, resource) => total + (resource.likes || 0),
      0
    );

    return {
      total: resources.length,
      published,
      drafts,
      downloads,
      views,
      likes,
    };
  }, [resources]);

  // =====================================================
  // DELETE RESOURCE
  // =====================================================

  const deleteResource = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resource?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_BASE_URL}/api/resources/delete/${id}`,
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

      setSuccess("Resource deleted successfully");

      toast.success("Resource deleted successfully");

      await fetchResources();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Delete resource error:", error);

      setError(error.message || "Failed to delete resource");

      toast.error(error.message || "Failed to delete resource");
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // TOGGLE RESOURCE STATUS
  // =====================================================

  const toggleStatus = async (resource) => {
    try {
      setError("");

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

      const newStatus = resource.status === "Published" ? "Draft" : "Published";

      toast.success(`Resource moved to ${newStatus}`);

      setSuccess(
        `Resource ${
          resource.status === "Published" ? "moved to Draft" : "Published"
        } successfully`
      );

      await fetchResources();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Toggle status error:", error);

      setError(error.message || "Failed to update status");

      toast.error(error.message || "Failed to update status");
    }
  };

  // =====================================================
  // VIEW RESOURCE DETAILS
  // =====================================================

  const viewResource = (id) => {
    if (!id) {
      setError("Resource ID is not available");

      return;
    }

    navigate(`/admin/careerResources/details/${id}`);
  };

  // =====================================================
  // EDIT RESOURCE
  // =====================================================

  const editResource = (id) => {
    navigate(`/admin/careerResources/edit/${id}`);
  };

  // =====================================================
  // ADD RESOURCE
  // =====================================================

  const addResource = () => {
    navigate("/admin/careerResources/create");
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <BookOpen size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Career Resources
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Build and manage your student learning library.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* REFRESH */}

            <button
              onClick={() => fetchResources(true)}
              disabled={refreshing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            {/* ADD */}

            <button
              onClick={addResource}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
            >
              <Plus size={18} />
              Add Resource
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* SUCCESS */}
        {/* ================================================= */}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 size={18} />

            {success}

            <button onClick={() => setSuccess("")} className="ml-auto text-lg">
              ×
            </button>
          </div>
        )}

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <AlertCircle size={18} />

            {error}

            <button onClick={() => setError("")} className="ml-auto text-lg">
              ×
            </button>
          </div>
        )}

        {/* ================================================= */}
        {/* STATISTICS */}
        {/* ================================================= */}

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          <StatCard
            title="Total Resources"
            value={stats.total}
            icon={BookOpen}
            description="All resources"
          />

          <StatCard
            title="Published"
            value={stats.published}
            icon={CheckCircle2}
            description="Visible to students"
          />

          <StatCard
            title="Drafts"
            value={stats.drafts}
            icon={Clock3}
            description="Not visible"
          />

          <StatCard
            title="Downloads"
            value={stats.downloads}
            icon={Download}
            description="Total downloads"
          />

          <StatCard
            title="Total Views"
            value={stats.views}
            icon={Eye}
            description="Resource views"
          />
        </div>

        {/* ================================================= */}
        {/* FILTERS */}
        {/* ================================================= */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {/* SEARCH */}

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resources..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            {/* CATEGORY */}

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="All">All Categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* TYPE */}

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="All">All Types</option>

              {resourceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="All">All Status</option>

              <option value="Published">Published</option>

              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        {/* ================================================= */}
        {/* RESULTS HEADER */}
        {/* ================================================= */}

        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-900">
                {filteredResources.length}
              </span>{" "}
              resources
            </p>
          </div>

          <div className="hidden items-center gap-2 text-xs font-medium text-slate-400 sm:flex">
            <Layers3 size={15} />
            Resource Library
          </div>
        </div>

        {/* ================================================= */}
        {/* RESOURCE LIST */}
        {/* ================================================= */}

        {loading ? (
          <LoadingState />
        ) : filteredResources.length === 0 ? (
          <EmptyState onAdd={addResource} />
        ) : (
          <div className="space-y-4">
            {filteredResources.map((resource) => (
              <ResourceHorizontalCard
                key={resource._id}
                resource={resource}
                onEdit={editResource}
                onDelete={deleteResource}
                onToggleStatus={toggleStatus}
                onView={viewResource}
                deletingId={deletingId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================================
// STAT CARD
// =====================================================

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>

          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

// =====================================================
// HORIZONTAL RESOURCE CARD
// =====================================================

function ResourceHorizontalCard({
  resource,
  onEdit,
  onDelete,
  onToggleStatus,
  onView,
  deletingId,
}) {
  const ResourceIcon = getResourceIcon(resource.resourceType);

  const CategoryIcon = getCategoryIcon(resource.category);

  const isDeleting = deletingId === resource._id;

  // =====================================================
  // MAIN CARD CLICK
  // =====================================================

  const handleCardClick = () => {
    onView(resource._id);
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg">
      <div className="flex flex-col lg:flex-row">
        {/* ================================================= */}
        {/* RESOURCE ICON SECTION */}
        {/* ================================================= */}

        <div
          onClick={handleCardClick}
          className="flex cursor-pointer items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 lg:w-40 lg:shrink-0"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100 transition group-hover:scale-105">
            <ResourceIcon size={34} />
          </div>
        </div>

        {/* ================================================= */}
        {/* MAIN INFORMATION */}
        {/* ================================================= */}

        <div
          onClick={handleCardClick}
          className="flex-1 cursor-pointer p-5 lg:p-6"
        >
          {/* TOP ROW */}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              {/* CATEGORY */}

              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  <CategoryIcon size={13} />

                  {resource.category}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {resource.resourceType}
                </span>
              </div>

              {/* TITLE */}

              <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-indigo-700 sm:text-xl">
                {resource.title}
              </h3>

              {/* DESCRIPTION */}

              <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-500">
                {resource.description}
              </p>
            </div>

            {/* STATUS */}

            <span
              className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                resource.status === "Published"
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                  : "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
              }`}
            >
              {resource.status === "Published" ? (
                <CheckCircle2 size={14} />
              ) : (
                <Clock3 size={14} />
              )}

              {resource.status}
            </span>
          </div>

          {/* META INFORMATION */}

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <CalendarDays size={15} className="text-indigo-500" />
              Added{" "}
              <span className="font-semibold text-slate-700">
                {formatDate(resource.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Eye size={15} className="text-blue-500" />
              <span className="font-semibold text-slate-700">
                {resource.views || 0}
              </span>
              Views
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Download size={15} className="text-emerald-500" />
              <span className="font-semibold text-slate-700">
                {resource.downloads || 0}
              </span>
              Downloads
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Heart size={15} className="text-rose-500" />
              <span className="font-semibold text-slate-700">
                {resource.likes || 0}
              </span>
              Likes
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* ACTION SECTION */}
        {/* ================================================= */}

        <div
          onClick={(e) => e.stopPropagation()}
          className="flex flex-row items-center justify-between gap-2 border-t border-slate-100 bg-slate-50 p-4 lg:w-64 lg:shrink-0 lg:flex-col lg:items-stretch lg:justify-center lg:border-l lg:border-t-0"
        >
          {/* VIEW DETAILS */}

          <button
            onClick={() => onView(resource._id)}
            className="flex h-8 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700 lg:w-full"
          >
            <ExternalLink size={14} />

            <span className="hidden sm:inline">View Details</span>

            <ChevronRight size={14} className="hidden lg:block" />
          </button>

          {/* SECONDARY ACTIONS */}

          <div className="flex flex-1 gap-2 lg:w-full">
            {/* EDIT */}

            <button
              onClick={() => onEdit(resource._id)}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
              title="Edit Resource"
            >
              <Pencil size={15} />

              <span className="hidden xl:inline">Edit</span>
            </button>

            {/* STATUS */}

            <button
              onClick={() => onToggleStatus(resource)}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
              title={
                resource.status === "Published"
                  ? "Move to Draft"
                  : "Publish Resource"
              }
            >
              {resource.status === "Published" ? (
                <Clock3 size={15} />
              ) : (
                <CheckCircle2 size={15} />
              )}

              <span className="hidden xl:inline">
                {resource.status === "Published" ? "Draft" : "Publish"}
              </span>
            </button>

            {/* DELETE */}

            <button
              onClick={() => onDelete(resource._id)}
              disabled={isDeleting}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              title="Delete Resource"
            >
              {isDeleting ? (
                <RefreshCw size={15} className="animate-spin" />
              ) : (
                <Trash2 size={15} />
              )}

              <span className="hidden xl:inline">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// LOADING STATE
// =====================================================

function LoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="h-48 animate-pulse rounded-2xl bg-white" />
      ))}
    </div>
  );
}

// =====================================================
// EMPTY STATE
// =====================================================

function EmptyState({ onAdd }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <BookOpen size={28} />
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        No resources found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Add interview guides, coding roadmaps, resume templates, and career
        resources to build your GuideX learning library.
      </p>

      <button
        onClick={onAdd}
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
      >
        <Plus size={17} />
        Add Your First Resource
      </button>
    </div>
  );
}

export default ResourceManagement;
