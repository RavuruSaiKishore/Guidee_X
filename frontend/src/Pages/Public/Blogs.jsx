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
  // CATEGORY COLORS
  // ==========================================

  const getCategoryStyle = (category) => {
    const styles = {
      Career: "bg-blue-50 text-blue-700 border-blue-100",

      Technology: "bg-violet-50 text-violet-700 border-violet-100",

      Education: "bg-emerald-50 text-emerald-700 border-emerald-100",

      Interview: "bg-orange-50 text-orange-700 border-orange-100",

      Programming: "bg-cyan-50 text-cyan-700 border-cyan-100",

      "Personal Growth": "bg-pink-50 text-pink-700 border-pink-100",

      Mentorship: "bg-indigo-50 text-indigo-700 border-indigo-100",

      "Industry Trends": "bg-amber-50 text-amber-700 border-amber-100",
    };

    return styles[category] || "bg-slate-50 text-slate-600 border-slate-200";
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

     console.log("Blogs response:", data);

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

     setError(error.message || "Unable to load blogs. Please try again later.");
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

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-white">
      {/* ==========================================
          HERO SECTION
      ========================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-950 to-emerald-950">
        {/* Decorative Background */}

        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="absolute right-1/3 top-10 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

        {/* Hero Content */}

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            {/* Badge */}

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-300 backdrop-blur-sm">
              <BookOpen size={17} />

              <span>GuideX Insights</span>
            </div>

            {/* Heading */}

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Ideas to help you{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                learn and grow.
              </span>
            </h1>

            {/* Description */}

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Practical insights on careers, technology, programming,
              interviews, and personal growth from the GuideX community.
            </p>

            {/* Stats */}

            <div className="mt-8 flex flex-wrap gap-3">
              {/* Articles */}

              <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                <p className="text-lg font-bold text-white">{blogs.length}+</p>

                <p className="text-xs text-slate-400">Articles</p>
              </div>

              {/* Categories */}

              <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                <p className="text-lg font-bold text-white">
                  {categories.length - 1}
                </p>

                <p className="text-xs text-slate-400">Categories</p>
              </div>

              {/* Insights */}

              <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                <p className="text-lg font-bold text-white">Expert</p>

                <p className="text-xs text-slate-400">Insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <main className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* ==========================================
            FEATURED ARTICLES
        ========================================== */}

        {!loading && featuredBlogs.length > 0 && (
          <section className="py-14">
            {/* Section Heading */}

            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                  Featured
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
                  Editor's Picks
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Handpicked articles to help you learn something valuable.
                </p>
              </div>
            </div>

            {/* Featured Grid */}

            <div className="grid gap-8 lg:grid-cols-2">
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
            CATEGORY + SEARCH
        ========================================== */}

        <section className="border-y border-slate-200 py-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Categories */}

            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search */}

            <div className="relative w-full lg:w-80">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-indigo-600"
                >
                  <X size={17} />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ==========================================
            LATEST ARTICLES
        ========================================== */}

        <section className="py-14">
          {/* Header */}

          <div className="mb-9 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                Discover
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-950">
                Latest Articles
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Explore the latest insights from GuideX.
              </p>
            </div>

            <p className="hidden rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 sm:block">
              {filteredBlogs.length}{" "}
              {filteredBlogs.length === 1 ? "Article" : "Articles"}
            </p>
          </div>

          {/* ==========================================
              LOADING
          ========================================== */}

          {loading && (
            <div className="grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <BlogSkeleton key={item} />
              ))}
            </div>
          )}

          {/* ==========================================
              ERROR
          ========================================== */}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <BookOpen size={24} className="text-red-500" />
              </div>

              <p className="mt-4 font-medium text-red-600">{error}</p>

              <button
                onClick={fetchBlogs}
                className="mt-5 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
              >
                Try Again
              </button>
            </div>
          )}

          {/* ==========================================
              BLOG GRID
          ========================================== */}

          {!loading && !error && filteredBlogs.length > 0 && (
            <div className="grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
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

          {/* ==========================================
              EMPTY STATE
          ========================================== */}

          {!loading && !error && filteredBlogs.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                <Search size={28} className="text-indigo-500" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                No articles found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                We couldn't find any articles matching your search or selected
                category.
              </p>

              <button
                onClick={clearFilters}
                className="mt-6 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Blogs;


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
      className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
    >
      {/* IMAGE */}

      <div className="relative block aspect-[16/10] overflow-hidden bg-slate-100">
        {blog.coverImage ? (
          <img
            src={getImageUrl(blog.coverImage)}
            alt={blog.coverImageAlt || blog.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-100 via-violet-50 to-emerald-100">
            <BookOpen size={42} className="text-indigo-400" />
          </div>
        )}

        {blog.isTrending && (
          <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
            <TrendingUp size={13} />
            Trending
          </span>
        )}
      </div>

      {/* CONTENT */}

      <div className="p-6">
        {/* Category */}

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getCategoryStyle(
              blog.category
            )}`}
          >
            {blog.category}
          </span>

          <span className="text-xs text-slate-300">•</span>

          <span className="text-xs font-medium text-slate-400">
            {blog.contentType || "Article"}
          </span>
        </div>

        {/* Title */}

        <h3 className="mt-4 line-clamp-2 text-xl font-bold leading-snug text-slate-950 transition group-hover:text-indigo-600">
          {blog.title}
        </h3>

        {/* Excerpt */}

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
          {blog.excerpt}
        </p>

        {/* Tags */}

        {blog.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* AUTHOR + READING TIME */}

        {/* AUTHOR + READING TIME */}

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
          <div className="flex items-center gap-2">
            {blog.authorImage ? (
              <img
                src={getImageUrl(blog.authorImage)}
                alt={blog.authorName || "Author"}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-indigo-50"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
                {(blog.authorName || "G").charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <p className="text-xs font-semibold text-slate-700">
                {blog.authorName || "GuideX Team"}
              </p>

              <p className="mt-0.5 text-xs text-slate-400">
                {formatDate(blog.publishedAt || blog.createdAt)}
              </p>
            </div>
          </div>

          {/* Reading Time */}

          <div className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
            <Clock size={13} />
            {blog.readingTime || 1} min
          </div>
        </div>

        {/* ENGAGEMENT COUNTS */}

        <div className="mt-5 flex items-center gap-4 border-t border-slate-100 pt-4">
          {/* Views */}

          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Eye size={15} className="text-violet-500" />
            <span>{blog.views || 0}</span>
            <span>Views</span>
          </div>

          {/* Likes */}

          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Heart size={15} className="text-red-500" />
            <span>{blog.likes || 0}</span>
            <span>Likes</span>
          </div>

          {/* Shares */}

          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Share2 size={15} className="text-indigo-500" />
            <span>{blog.shares || 0}</span>
            <span>Shares</span>
          </div>
        </div>

        {/* READ ARTICLE */}

        <button
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/blogs/${blog._id}`);
          }}
          className="mt-5 flex w-full items-center justify-between rounded-lg bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-gradient-to-r hover:from-indigo-600 hover:to-violet-600 hover:text-white"
        >
          <span>Read Article</span>

          <ArrowRight
            size={17}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>
    </article>
  );
};

// =====================================================
// FEATURED BLOG CARD
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
      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="grid md:grid-cols-2">
        {/* ==========================================
            IMAGE
        ========================================== */}

        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-indigo-100 to-emerald-100 md:aspect-auto">
          {blog.coverImage ? (
            <img
              src={getImageUrl(blog.coverImage)}
              alt={blog.coverImageAlt || blog.title}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full min-h-[300px] items-center justify-center">
              <BookOpen size={60} className="text-indigo-400" />
            </div>
          )}

          {/* Featured Badge */}

          <span className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-indigo-700 shadow-lg">
            <TrendingUp size={14} />
            Featured
          </span>
        </div>

        {/* ==========================================
            CONTENT
        ========================================== */}

        <div className="flex flex-col justify-center bg-gradient-to-br from-white via-indigo-50/30 to-emerald-50/40 p-8 lg:p-10">
          {/* Category */}

          <span
            className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${getCategoryStyle(
              blog.category
            )}`}
          >
            {blog.category}
          </span>

          {/* Title */}

          <h3 className="mt-5 line-clamp-3 text-2xl font-bold leading-tight text-slate-950 transition group-hover:text-indigo-600 lg:text-3xl">
            {blog.title}
          </h3>

          {/* Excerpt */}

          <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-500">
            {blog.excerpt}
          </p>

          {/* Metadata */}

          {/* Metadata */}

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            {/* Date */}

            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} className="text-indigo-500" />

              {formatDate(blog.publishedAt || blog.createdAt)}
            </span>

            {/* Reading Time */}

            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-emerald-500" />
              {blog.readingTime || 1} min
            </span>

            {/* Views */}

            <span className="flex items-center gap-1.5">
              <Eye size={14} className="text-violet-500" />

              {blog.views || 0}
            </span>

            {/* Likes */}

            <span className="flex items-center gap-1.5">
              <Heart size={14} className="text-red-500" />

              {blog.likesCount}
            </span>

            {/* Shares */}

            <span className="flex items-center gap-1.5">
              <Share2 size={14} className="text-indigo-500" />

              {blog.sharesCount}
            </span>
          </div>

          {/* Button */}

          <div className="mt-7 flex w-fit items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition group-hover:from-indigo-700 group-hover:to-violet-700">
            Read Featured Article
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Image */}

      <div className="aspect-[16/10] animate-pulse bg-gradient-to-br from-slate-200 to-indigo-100" />

      {/* Content */}

      <div className="p-6">
        <div className="h-6 w-24 animate-pulse rounded-full bg-indigo-100" />

        <div className="mt-5 h-6 w-full animate-pulse rounded bg-slate-200" />

        <div className="mt-2 h-6 w-4/5 animate-pulse rounded bg-slate-200" />

        <div className="mt-5 h-4 w-full animate-pulse rounded bg-slate-100" />

        <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-slate-100" />

        <div className="mt-6 h-9 w-full animate-pulse rounded-lg bg-indigo-50" />
      </div>
    </div>
  );
};
