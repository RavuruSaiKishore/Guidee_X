import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  FileText,
  Eye,
  Star,
  Edit3,
  Trash2,
  CheckCircle,
  Clock3,
  X,
  Loader2,
  User,
  Tag,
  AlertTriangle,
  SlidersHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const categories = [
  "Career",
  "Technology",
  "Education",
  "Interview",
  "Programming",
  "Personal Growth",
  "Mentorship",
  "Industry Trends",
];

const AdminBlogManagement = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [blogs, setBlogs] = useState([]);

  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    featuredBlogs: 0,
  });

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // ==========================================
  // FETCH BLOGS
  // ==========================================

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("AdminToken");

      const queryParams = new URLSearchParams();

      if (search.trim()) {
        queryParams.append("search", search.trim());
      }

      if (category) {
        queryParams.append("category", category);
      }

      if (status) {
        queryParams.append("status", status);
      }

      const queryString = queryParams.toString();

      const response = await fetch(
        `${API_BASE_URL}/api/admin/blogs${
          queryString ? `?${queryString}` : ""
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Blogs response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch blogs");
      }

      const fetchedBlogs = data.blogs || [];

      setBlogs(fetchedBlogs);

      setStats({
        totalBlogs: fetchedBlogs.length,

        publishedBlogs: fetchedBlogs.filter(
          (blog) => blog.status === "Published"
        ).length,

        draftBlogs: fetchedBlogs.filter((blog) => blog.status === "Draft")
          .length,

        featuredBlogs: fetchedBlogs.filter((blog) => blog.featured === true)
          .length,
      });
    } catch (error) {
      console.error("Fetch blogs error:", error);

      toast.error(error.message || "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL FETCH
  // ==========================================

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ==========================================
  // SEARCH / FILTER FETCH
  // ==========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 400);

    return () => clearTimeout(timer);
  }, [search, category, status]);

  // ==========================================
  // DELETE BLOG
  // ==========================================

  const handleDeleteBlog = async () => {
    if (!selectedBlog?._id) return;

    try {
      setActionLoading(selectedBlog._id);

      const token = localStorage.getItem("AdminToken");

      const response = await fetch(
        `${API_BASE_URL}/api/admin/blogs/delete/${selectedBlog._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete blog");
      }

      setBlogs((prevBlogs) =>
        prevBlogs.filter((blog) => blog._id !== selectedBlog._id)
      );

      setStats((prev) => ({
        ...prev,

        totalBlogs: Math.max(0, prev.totalBlogs - 1),

        publishedBlogs:
          selectedBlog.status === "Published"
            ? Math.max(0, prev.publishedBlogs - 1)
            : prev.publishedBlogs,

        draftBlogs:
          selectedBlog.status === "Draft"
            ? Math.max(0, prev.draftBlogs - 1)
            : prev.draftBlogs,

        featuredBlogs: selectedBlog.featured
          ? Math.max(0, prev.featuredBlogs - 1)
          : prev.featuredBlogs,
      }));

      setShowDeleteModal(false);
      setSelectedBlog(null);

      toast.success("Blog deleted successfully.");
    } catch (error) {
      console.error("Delete blog error:", error);

      toast.error(error.message || "Failed to delete blog.");
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // TOGGLE FEATURED
  // ==========================================

  const handleToggleFeatured = async (blog) => {
    try {
      setActionLoading(blog._id);

      const token = localStorage.getItem("AdminToken");

      const response = await fetch(
        `${API_BASE_URL}/api/admin/blogs/${blog._id}/featured`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            featured: !blog.featured,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update featured status");
      }

      setBlogs((prevBlogs) =>
        prevBlogs.map((item) =>
          item._id === blog._id
            ? {
                ...item,
                featured: !item.featured,
              }
            : item
        )
      );

      setStats((prev) => ({
        ...prev,

        featuredBlogs: blog.featured
          ? Math.max(0, prev.featuredBlogs - 1)
          : prev.featuredBlogs + 1,
      }));

      toast.success(
        blog.featured
          ? "Removed from featured blogs."
          : "Blog marked as featured."
      );
    } catch (error) {
      console.error("Toggle featured error:", error);

      toast.error(error.message || "Failed to update featured status.");
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // TOGGLE STATUS
  // ==========================================

  const handleToggleStatus = async (blog) => {
    try {
      setActionLoading(blog._id);

      const token = localStorage.getItem("AdminToken");

      const newStatus = blog.status === "Published" ? "Draft" : "Published";

      const response = await fetch(
        `${API_BASE_URL}/api/admin/blogs/update/${blog._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update blog status");
      }

      setBlogs((prevBlogs) =>
        prevBlogs.map((item) =>
          item._id === blog._id
            ? {
                ...item,
                status: newStatus,
                publishedAt:
                  newStatus === "Published"
                    ? new Date().toISOString()
                    : item.publishedAt,
              }
            : item
        )
      );

      setStats((prev) => ({
        ...prev,

        publishedBlogs:
          blog.status === "Published"
            ? Math.max(0, prev.publishedBlogs - 1)
            : prev.publishedBlogs + 1,

        draftBlogs:
          blog.status === "Draft"
            ? Math.max(0, prev.draftBlogs - 1)
            : prev.draftBlogs + 1,
      }));

      toast.success(
        newStatus === "Published"
          ? "Blog published successfully."
          : "Blog moved to draft."
      );
    } catch (error) {
      console.error("Toggle status error:", error);

      toast.error(error.message || "Failed to update blog status.");
    } finally {
      setActionLoading(null);
    }
  };


  

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // STAT CARD
  // ==========================================

  const StatCard = ({ title, value, icon: Icon, description, accent }) => {
    return (
      <div className="relative bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        <div className={`absolute top-0 left-0 right-0 h-1 ${accent.bar}`} />

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">
              {title}
            </p>

            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1.5 sm:mt-2 tracking-tight">
              {value}
            </h3>

            <p className="text-[11px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2 truncate">
              {description}
            </p>
          </div>

          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${accent.bg}`}
          >
            <Icon size={19} className={`sm:hidden ${accent.text}`} />

            <Icon size={22} className={`hidden sm:block ${accent.text}`} />
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // BLOG CARD
  // ==========================================

  const BlogCard = ({ blog }) => {
    return (
      <div
        onClick={() => navigate(`/admin/blogs/${blog._id}`)}
        className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5 hover:border-gray-200 transition-all duration-300 cursor-pointer flex flex-col"
      >
        {/* COVER IMAGE */}

        <div className="relative h-44 xs:h-48 sm:h-52 bg-gray-100 overflow-hidden">
          {blog.coverImage ? (
            <img
              src={`${API_BASE_URL}${blog.coverImage}`}
              alt={blog.coverImageAlt || blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-50">
              <FileText size={34} className="sm:hidden text-indigo-300" />

              <FileText size={40} className="hidden sm:block text-indigo-300" />
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />

          {/* FEATURED */}

          {blog.featured && (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-1 bg-white/95 backdrop-blur-sm text-amber-600 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-sm ring-1 ring-black/5">
              <Star
                size={11}
                className="sm:hidden fill-amber-500 text-amber-500"
              />
              <Star
                size={13}
                className="hidden sm:block fill-amber-500 text-amber-500"
              />
              Featured
            </div>
          )}

          {/* STATUS */}

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(blog);
            }}
            disabled={actionLoading === blog._id}
            className={`absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-sm ring-1 transition disabled:opacity-70 ${
              blog.status === "Published"
                ? "bg-emerald-500 text-white ring-emerald-600/20"
                : "bg-amber-400 text-amber-950 ring-amber-500/20"
            }`}
          >
            {actionLoading === blog._id ? (
              <Loader2 size={12} className="animate-spin" />
            ) : blog.status === "Published" ? (
              <CheckCircle size={12} />
            ) : (
              <Clock3 size={12} />
            )}

            <span className="hidden xs:inline">
              {actionLoading === blog._id ? "Updating..." : blog.status}
            </span>

            <span className="xs:hidden">
              {blog.status === "Published" ? "Live" : "Draft"}
            </span>
          </button>
        </div>

        {/* CONTENT */}

        <div className="p-4 sm:p-5 flex flex-col flex-1">
          {/* CATEGORY + FEATURED */}

          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="px-2.5 sm:px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] sm:text-xs font-bold tracking-wide truncate max-w-[calc(100%-50px)]">
              {blog.category}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFeatured(blog);
              }}
              disabled={actionLoading === blog._id}
              title={
                blog.featured ? "Remove from featured" : "Mark as featured"
              }
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition disabled:opacity-50 shrink-0 ${
                blog.featured
                  ? "bg-amber-50 text-amber-500"
                  : "bg-gray-50 text-gray-400 hover:bg-amber-50 hover:text-amber-500"
              }`}
            >
              {actionLoading === blog._id ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Star
                  size={17}
                  className={blog.featured ? "fill-amber-500" : ""}
                />
              )}
            </button>
          </div>

          {/* TITLE */}

          <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug line-clamp-2 min-h-[48px] sm:min-h-[56px] group-hover:text-indigo-700 transition-colors">
            {blog.title}
          </h3>

          {/* EXCERPT */}

          <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-3 min-h-[60px]">
            {blog.excerpt}
          </p>

          {/* TAGS */}

          {blog.tags?.length > 0 && (
            <div className="flex items-center gap-x-2.5 gap-y-1.5 mt-4 flex-wrap">
              <Tag size={13} className="text-gray-300 shrink-0" />

              {blog.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="text-xs text-gray-500 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex-1" />

          {/* DIVIDER */}

          <div className="border-t border-gray-100 my-4 sm:my-5" />

          {/* AUTHOR */}

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <User size={15} className="sm:hidden text-indigo-600" />

              <User size={17} className="hidden sm:block text-indigo-600" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                {blog.authorName || "GuideX Team"}
              </p>

              <p className="text-[10px] sm:text-xs text-gray-400">
                {blog.publishedAt
                  ? formatDate(blog.publishedAt)
                  : `Created ${formatDate(blog.createdAt)}`}
              </p>
            </div>

            {/* VIEWS */}

            <div className="flex items-center gap-1 text-gray-400 text-xs sm:text-sm shrink-0">
              <Eye size={14} className="sm:hidden" />
              <Eye size={16} className="hidden sm:block" />

              {blog.views || 0}
            </div>
          </div>

          {/* ACTIONS */}

          <div className="flex gap-2 mt-4 sm:mt-5">
            {/* EDIT */}

            <button
              onClick={(e) => {
                e.stopPropagation();

                navigate(`/admin/blogs/edit/${blog._id}`);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-semibold text-xs sm:text-sm hover:bg-indigo-600 hover:text-white transition-colors"
            >
              <Edit3 size={15} />
              Edit
            </button>

            {/* DELETE */}

            <button
              onClick={(e) => {
                e.stopPropagation();

                setSelectedBlog(blog);
                setShowDeleteModal(true);
              }}
              disabled={actionLoading === blog._id}
              title="Delete blog"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 shrink-0"
            >
              {actionLoading === blog._id ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // FILTERS
  // ==========================================

  const hasActiveFilters = Boolean(search || category || status);

  const filteredBlogs = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return blogs.filter((blog) => {
      const matchesSearch =
        !searchTerm ||
        blog.title?.toLowerCase().includes(searchTerm) ||
        blog.excerpt?.toLowerCase().includes(searchTerm);

      const matchesCategory = !category || blog.category === category;

      const matchesStatus = !status || blog.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [blogs, search, category, status]);

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setStatus("");
  };

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-gray-50 to-gray-100/60 px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:p-8 lg:mt-0">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        limit={3}
        toastStyle={{
          maxWidth: "calc(100vw - 24px)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="relative overflow-hidden rounded-2xl bg-indigo-600 mb-5 sm:mb-7 md:mb-8 shadow-sm shadow-indigo-200">
          {/* DECORATIVE BACKDROP */}

          <div className="absolute -top-10 -right-10 w-40 sm:w-52 h-40 sm:h-52 rounded-full bg-white/10" />

          <div className="absolute -bottom-16 right-10 sm:right-24 w-32 sm:w-40 h-32 sm:h-40 rounded-full bg-white/10" />

          <div className="relative flex flex-col gap-5 px-4 py-5 sm:px-6 sm:py-7 md:flex-row md:items-center md:justify-between md:px-8 md:py-8">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
              <div className="hidden sm:flex w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/15 ring-1 ring-white/20 items-center justify-center shrink-0">
                <FileText size={24} className="text-white" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-indigo-200 mb-1">
                  GuideX Admin
                </p>

                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Blog Management
                </h1>

                <p className="text-sm sm:text-base text-indigo-100 mt-1 leading-relaxed max-w-xl">
                  Create, manage and publish content for GuideX students.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/admin/blogs/create")}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-indigo-50 active:bg-indigo-100 text-indigo-700 px-5 py-3 rounded-xl font-semibold shadow-sm transition shrink-0 text-sm sm:text-base"
            >
              <Plus size={19} />
              Create Blog
            </button>
          </div>
        </div>

        {/* ==========================================
            STATS
        ========================================== */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-5 sm:mb-7 md:mb-8">
          <StatCard
            title="Total Blogs"
            value={stats.totalBlogs}
            icon={FileText}
            description="All created blogs"
            accent={{
              bar: "bg-indigo-500",
              bg: "bg-indigo-50",
              text: "text-indigo-600",
            }}
          />

          <StatCard
            title="Published"
            value={stats.publishedBlogs}
            icon={CheckCircle}
            description="Currently visible"
            accent={{
              bar: "bg-emerald-500",
              bg: "bg-emerald-50",
              text: "text-emerald-600",
            }}
          />

          <StatCard
            title="Drafts"
            value={stats.draftBlogs}
            icon={Clock3}
            description="Waiting to publish"
            accent={{
              bar: "bg-amber-400",
              bg: "bg-amber-50",
              text: "text-amber-500",
            }}
          />

          <StatCard
            title="Featured"
            value={stats.featuredBlogs}
            icon={Star}
            description="Highlighted content"
            accent={{
              bar: "bg-violet-500",
              bg: "bg-violet-50",
              text: "text-violet-600",
            }}
          />
        </div>

        {/* ==========================================
            FILTER BAR
        ========================================== */}

        <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 shadow-sm mb-5 sm:mb-7">
          <div className="flex flex-col gap-3">
            {/* SEARCH */}

            <div className="relative w-full">
              <Search
                size={18}
                className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search by title or excerpt..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 sm:pl-11 pr-4 py-3 text-sm sm:text-base border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {/* FILTERS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] gap-3">
              {/* CATEGORY */}

              <div className="relative min-w-0">
                <SlidersHorizontal
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 text-sm sm:text-base border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none cursor-pointer"
                >
                  <option value="">All Categories</option>

                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* STATUS */}

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 text-sm sm:text-base border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none cursor-pointer"
              >
                <option value="">All Status</option>

                <option value="Published">Published</option>

                <option value="Draft">Draft</option>
              </select>

              {/* CLEAR */}

              {hasActiveFilters ? (
                <button
                  onClick={clearFilters}
                  className="w-full lg:w-auto px-4 py-3 rounded-xl border border-gray-200 text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition shrink-0 text-sm sm:text-base"
                >
                  <X size={17} />
                  Clear
                </button>
              ) : (
                <div className="hidden lg:block" />
              )}
            </div>
          </div>
        </div>

        {/* ==========================================
            RESULTS COUNT
        ========================================== */}

        {!loading && blogs.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 px-1">
            <p className="text-xs sm:text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredBlogs.length}
              </span>{" "}
              {hasActiveFilters && filteredBlogs.length !== blogs.length && (
                <>
                  of{" "}
                  <span className="font-semibold text-gray-700">
                    {blogs.length}
                  </span>{" "}
                </>
              )}
              {filteredBlogs.length === 1 ? "blog" : "blogs"}
              {hasActiveFilters ? " matching your filters" : ""}
            </p>
          </div>
        )}

        {/* ==========================================
            BLOG LIST
        ========================================== */}

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 sm:py-24 px-4 flex flex-col items-center justify-center gap-3">
            <Loader2 size={32} className="animate-spin text-indigo-600" />

            <p className="text-sm text-gray-400">Loading blogs...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 sm:py-24 text-center px-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto">
              <FileText size={27} className="text-indigo-500" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mt-5">
              No blogs found
            </h3>

            <p className="text-sm sm:text-base text-gray-500 mt-1">
              {hasActiveFilters
                ? "Try adjusting your search or filters."
                : "Create your first GuideX blog."}
            </p>

            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="mt-5 inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-600 px-5 py-3 rounded-xl font-semibold hover:bg-gray-50 transition text-sm"
              >
                <X size={17} />
                Clear filters
              </button>
            ) : (
              <button
                onClick={() => navigate("/admin/blogs/create")}
                className="mt-5 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold transition text-sm"
              >
                <Plus size={18} />
                Create Blog
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>

      {/* ==========================================
          DELETE CONFIRMATION MODAL
      ========================================== */}

      {showDeleteModal && selectedBlog && (
        <div
          onClick={() => {
            if (actionLoading === null) {
              setShowDeleteModal(false);
              setSelectedBlog(null);
            }
          }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* MODAL CONTENT */}

            <div className="p-5 sm:p-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                <AlertTriangle size={23} className="text-red-600" />
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-5">
                Delete blog?
              </h2>

              <p className="text-sm sm:text-base text-gray-500 mt-2 leading-6">
                This will permanently remove the blog below from GuideX.
              </p>

              {/* BLOG NAME */}

              <div className="mt-4 p-3.5 sm:p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2">
                  {selectedBlog.title}
                </p>

                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-500">
                  {selectedBlog.category}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-red-500 mt-4 flex items-start gap-1.5">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />

                <span>This action cannot be undone.</span>
              </p>
            </div>

            {/* MODAL ACTIONS */}

            <div className="px-5 sm:px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedBlog(null);
                }}
                disabled={actionLoading !== null}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-50 transition text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteBlog}
                disabled={actionLoading === selectedBlog._id}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-red-700 disabled:opacity-50 transition text-sm"
              >
                {actionLoading === selectedBlog._id ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Delete Blog
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogManagement;
