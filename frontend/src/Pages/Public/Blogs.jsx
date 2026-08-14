import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock,
  Eye,
  Heart,
  Search,
  Share2,
  TrendingUp,
  X,
  Sparkles,
  Flame,
  FileText,
  BookmarkCheck,
  Lightbulb,
  Layers,
  Compass,
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories = [
    "All",
    "Career",
    "Technology",
    "Education",
    "Interview",
    "Programming",
    "Personal Growth",
    "Mentorship",
    "Industry Trends",
  ];

  // ==========================================
  // CATEGORY COLORS (Harmonized with Mentor/Course UI slate/blue theme)
  // ==========================================

  const getCategoryStyle = (category) => {
    const styles = {
      Career: "bg-blue-50 text-blue-700 border-blue-200/60",
      Technology: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
      Education: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      Interview: "bg-amber-50 text-amber-700 border-amber-200/60",
      Programming: "bg-cyan-50 text-cyan-700 border-cyan-200/60",
      "Personal Growth": "bg-purple-50 text-purple-700 border-purple-200/60",
      Mentorship: "bg-blue-50 text-blue-800 border-blue-200/60",
      "Industry Trends": "bg-slate-100 text-slate-800 border-slate-200",
    };

    return styles[category] || "bg-slate-50 text-slate-700 border-slate-200";
  };

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_BASE_URL}${image}`;
  };

  // ==========================================
  // FETCH BLOGS
  // ==========================================

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/blog-interactions/blogs`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch blogs");
      }

      const blogData = Array.isArray(data)
        ? data
        : data.blogs || data.data || [];

      setBlogs(blogData);

      const featured = blogData.filter((blog) => blog.featured === true);

      setFeaturedBlogs(featured);
    } catch (error) {
      console.error("Fetch blogs error:", error);
      setError(
        error.message || "Unable to load blogs. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILTER BLOGS
  // ==========================================

  const filteredBlogs = blogs.filter((blog) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      !searchValue ||
      blog.title?.toLowerCase().includes(searchValue) ||
      blog.excerpt?.toLowerCase().includes(searchValue) ||
      blog.category?.toLowerCase().includes(searchValue) ||
      blog.tags?.some((tag) => tag.toLowerCase().includes(searchValue));

    const matchesCategory =
      selectedCategory === "All" || blog.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ==========================================
          REFINED MODERN HERO SECTION
      ========================================== */}

      <section className="relative overflow-hidden bg-white border-b border-slate-200/80 py-16 sm:py-20 lg:py-24">
        {/* Subtle decorative backdrop glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-full max-w-7xl bg-gradient-to-b from-blue-50/60 via-indigo-50/20 to-transparent pointer-events-none blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 mb-6 shadow-sm">
            <Compass size={14} />
            GuideX Knowledge Nexus
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
            Explore Expert Perspectives & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Accelerate Your Growth
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-slate-500">
            Deep-dive technical articles, structured career pathways, and
            insider interview strategies curated directly by industry mentors.
          </p>

          {/* Quick Stat Indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-600">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-xs border border-blue-100">
                {blogs.length}+
              </div>
              <span className="text-xs font-bold text-slate-700">
                Published Guides
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs border border-indigo-100">
                {categories.length - 1}
              </div>
              <span className="text-xs font-bold text-slate-700">
                Core Categories
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-xs border border-emerald-100">
                100%
              </div>
              <span className="text-xs font-bold text-slate-700">
                Verified Insights
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          MAIN CONTENT CONTAINER
      ========================================== */}

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* ==========================================
            FEATURED ARTICLES (Editor's Picks Carousel / Grid)
        ========================================== */}

        {!loading && featuredBlogs.length > 0 && (
          <section className="mb-14">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  EDITOR'S PICKS
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                  Featured Masterclass Articles
                </h2>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {featuredBlogs.slice(0, 2).map((blog) => (
                <FeaturedBlogCard
                  key={blog._id}
                  blog={blog}
                  getImageUrl={getImageUrl}
                  formatDate={formatDate}
                  getCategoryStyle={getCategoryStyle}
                />
              ))}
            </div>
          </section>
        )}

        {/* ==========================================
            CATEGORY TABS + SEARCH FILTER BAR
        ========================================== */}

        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-slate-100 hover:text-blue-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-72">
            <Search
              size={16}
              className="absolute left-3.5 top-3.5 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search articles, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-9 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-500 transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* ==========================================
            ARTICLES DIRECTORY GRID SECTION
        ========================================== */}

        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900">
              {selectedCategory === "All"
                ? "All Articles"
                : `${selectedCategory} Insights`}
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              Showing{" "}
              <span className="text-blue-600 font-bold">
                {filteredBlogs.length}
              </span>{" "}
              articles
            </span>
          </div>

          {/* Loading Skeleton State */}
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <BlogSkeleton key={item} />
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-12 text-center">
              <BookOpen size={36} className="mx-auto text-rose-500 mb-3" />
              <p className="text-sm font-bold text-rose-700">{error}</p>
              <button
                onClick={fetchBlogs}
                className="mt-4 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Articles Grid */}
          {!loading && !error && filteredBlogs.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  navigate={navigate}
                  getImageUrl={getImageUrl}
                  formatDate={formatDate}
                  getCategoryStyle={getCategoryStyle}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredBlogs.length === 0 && (
            <div className="rounded-3xl bg-white border border-slate-200 py-20 text-center px-4 shadow-sm">
              <Search size={36} className="mx-auto text-slate-300" />
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                No articles found
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                No articles match your search or selected category. Try checking
                your spelling or clearing filters.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>

        {/* ==========================================
            BLOG METRICS & ECOSYSTEM SUMMARY CARD
        ========================================== */}
        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  GuideX Content & Publication Overview
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Summary metrics across our active learning tracks and
                  technical journals.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Database Feed
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total Publications
              </p>
              <p className="text-xl font-black text-slate-900 mt-1">
                {blogs.length} Articles
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Indexed and fully searchable across domains.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Featured Spotlights
              </p>
              <p className="text-xl font-black text-blue-600 mt-1">
                {featuredBlogs.length} Masterclasses
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Hand-picked editor's choices for advanced learning.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Active Tracks
              </p>
              <p className="text-xl font-black text-indigo-600 mt-1">
                {categories.length - 1} Categories
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Covering technical stacks, career growth & interviews.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Community Access
              </p>
              <p className="text-xl font-black text-emerald-600 mt-1">
                Free & Open
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Direct insights contributed by verified mentors.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Blogs;

// =====================================================
// STANDARD BLOG CARD (Clean Minimalist White Card UI)
// =====================================================

const BlogCard = ({
  blog,
  navigate,
  getImageUrl,
  formatDate,
  getCategoryStyle,
}) => {
  const handleBlogClick = () => {
    navigate(`/blogs/${blog._id}`);
  };

  return (
    <article
      onClick={handleBlogClick}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
    >
      <div>
        {/* Cover Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 mb-5">
          {blog.coverImage ? (
            <img
              src={getImageUrl(blog.coverImage)}
              alt={blog.coverImageAlt || blog.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-blue-50 text-blue-600">
              <BookOpen size={32} />
            </div>
          )}

          {blog.isTrending && (
            <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-amber-300 shadow">
              <Flame size={12} className="fill-amber-300" /> Trending
            </span>
          )}
        </div>

        {/* Category & Type */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${getCategoryStyle(
              blog.category
            )}`}
          >
            {blog.category || "General"}
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            {blog.contentType || "Article"}
          </span>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 mb-4">
          {blog.excerpt}
        </p>

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {blog.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="rounded-lg bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Author & Footer Metadata */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {blog.authorImage ? (
            <img
              src={getImageUrl(blog.authorImage)}
              alt={blog.authorName || "Author"}
              className="h-8 w-8 rounded-full object-cover border border-slate-100"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
              {(blog.authorName || "G").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">
              {blog.authorName || "GuideX Team"}
            </p>
            <p className="text-[10px] text-slate-400">
              {formatDate(blog.publishedAt || blog.createdAt)}
            </p>
          </div>
        </div>

        {/* Reading Time */}
        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 shrink-0">
          <Clock size={12} />
          {blog.readingTime || 1}m read
        </div>
      </div>
    </article>
  );
};

// =====================================================
// FEATURED BLOG CARD (Wide Featured Layout)
// =====================================================

const FeaturedBlogCard = ({
  blog,
  getImageUrl,
  formatDate,
  getCategoryStyle,
}) => {
  return (
    <Link
      to={`/blogs/${blog._id}`}
      className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
    >
      <div className="grid md:grid-cols-12 gap-6 items-center">
        {/* Left Image (5 Cols) */}
        <div className="md:col-span-5 relative aspect-[16/10] md:aspect-square overflow-hidden rounded-2xl bg-slate-100">
          {blog.coverImage ? (
            <img
              src={getImageUrl(blog.coverImage)}
              alt={blog.coverImageAlt || blog.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-blue-50 text-blue-600">
              <BookOpen size={40} />
            </div>
          )}
          <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-blue-600 text-white px-3 py-1 text-[10px] font-bold shadow">
            <Sparkles size={12} /> Featured
          </span>
        </div>

        {/* Right Content (7 Cols) */}
        <div className="md:col-span-7 flex flex-col justify-between">
          <div>
            <div className="mb-3">
              <span
                className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${getCategoryStyle(
                  blog.category
                )}`}
              >
                {blog.category || "General"}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-3">
              {blog.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3 mb-6">
              {blog.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-3 text-slate-500">
              <span className="flex items-center gap-1">
                <CalendarDays size={13} className="text-blue-600" />
                {formatDate(blog.publishedAt || blog.createdAt)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-emerald-600" />
                {blog.readingTime || 1} min read
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Read Article</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// =====================================================
// BLOG SKELETON
// =====================================================

const BlogSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="aspect-[16/10] w-full animate-pulse rounded-2xl bg-slate-100 mb-5" />
      <div className="h-5 w-20 animate-pulse rounded-full bg-slate-100 mb-3" />
      <div className="h-6 w-full animate-pulse rounded bg-slate-100 mb-2" />
      <div className="h-6 w-3/4 animate-pulse rounded bg-slate-100 mb-4" />
      <div className="h-4 w-full animate-pulse rounded bg-slate-100 mb-2" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100 mb-6" />
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full animate-pulse bg-slate-100" />
          <div className="space-y-1">
            <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
            <div className="h-2.5 w-12 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
        <div className="h-3 w-12 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
};
