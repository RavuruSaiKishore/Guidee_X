import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  BookOpen,
  Sparkles,
  Filter,
  Star,
  GraduationCap,
  Layers,
  Compass,
  CheckCircle2,
  BookMarked,
} from "lucide-react";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("UserToken");

        const response = await fetch(`${API_BASE_URL}/api/courses`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setCourses(data.courses);
          setFilteredCourses(data.courses);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [API_BASE_URL]);

  // Handle Filtering & Search
  useEffect(() => {
    let result = courses;

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((c) => c.category === selectedCategory);
    }

    if (selectedLevel !== "All") {
      result = result.filter((c) => c.level === selectedLevel);
    }

    setFilteredCourses(result);
  }, [searchQuery, selectedCategory, selectedLevel, courses]);

  // Extract unique categories for filter tabs
  const categories = [
    "All",
    ...new Set(courses.map((c) => c.category).filter(Boolean)),
  ];
  const levels = ["All", "Beginner", "Intermediate", "Advanced", "All Levels"];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] space-y-4 bg-slate-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BookMarked className="w-6 h-6 text-blue-600 animate-pulse" />
          </div>
        </div>
        <p className="text-gray-600 font-bold text-base tracking-wide animate-pulse">
          Loading expert courses...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 pb-32">
      {/* Modern Immersive Hero Header */}
      <div className="relative bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 text-white py-24 px-4 sm:px-6 lg:px-8 mb-12 overflow-hidden border-b border-white/10 shadow-2xl">
        {/* Abstract decorative background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 text-xs font-black uppercase tracking-widest border border-blue-400/30 shadow-lg backdrop-blur-md">
            <Sparkles size={14} className="text-blue-400 animate-spin" />{" "}
            Premium Learning Academy
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Elevate Your Skills With{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
              Expert-Led Courses
            </span>
          </h1>

          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Master high-demand technical concepts through structured
            multi-module curriculums, video lessons, and interactive PDF
            learning resources.
          </p>

          {/* Feature Badges Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-bold text-gray-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-400" /> Curated
              Modules
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-400" />{" "}
              Downloadable Notes
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-400" /> Self-Paced
              Learning
            </span>
          </div>

          {/* Modern Glassmorphic Search Bar */}
          <div className="pt-6 max-w-2xl mx-auto">
            <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 p-2.5 transition-all focus-within:bg-white/20 focus-within:border-blue-400">
              <Search className="absolute left-6 text-gray-300" size={20} />
              <input
                type="text"
                placeholder="Search by course title, tech stack, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent pl-12 pr-4 py-3 text-white placeholder-gray-300 text-sm font-semibold outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Filters and Categories Navigation Card */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-slate-200/50">
          {/* Category Tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            <span className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mr-2">
              <Compass size={15} className="text-blue-600" /> Category:
            </span>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-sm cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-105"
                    : "bg-slate-100 text-gray-600 hover:bg-slate-200 hover:text-gray-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Level Filter Dropdown */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
            <span className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap size={16} className="text-indigo-600" /> Level:
            </span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-gray-800 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-sm hover:border-slate-300 transition"
            >
              {levels.map((lvl, idx) => (
                <option key={idx} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-slate-200/50 space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <BookOpen size={30} />
            </div>
            <h3 className="text-xl font-black text-gray-900">
              No courses discovered
            </h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
              We couldn't find any courses matching your filters. Try checking
              your spelling or clearing search terms.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedLevel("All");
              }}
              className="mt-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              const imageUrl = course.thumbnail?.startsWith("http")
                ? course.thumbnail
                : `${API_BASE_URL}${course.thumbnail}`;

              return (
                <div
                  key={course._id}
                  className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col justify-between group hover:shadow-2xl hover:border-blue-200 transition-all duration-500 transform hover:-translate-y-1.5"
                >
                  <div>
                    {/* Thumbnail Image Container */}
                    <div className="relative h-56 overflow-hidden bg-slate-100">
                      <img
                        src={imageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60"></div>

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3.5 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
                          {course.category}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-black shadow-lg flex items-center gap-1">
                          <Star
                            size={13}
                            className="text-amber-500 fill-amber-500"
                          />
                          {course.averageRating
                            ? course.averageRating.toFixed(1)
                            : "4.9"}
                        </span>
                      </div>
                    </div>

                    {/* Course Body Content */}
                    <div className="p-6 space-y-3.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                        <span className="flex items-center gap-1.5 font-bold text-slate-600">
                          <Layers size={14} className="text-blue-600" />{" "}
                          {course.modules?.length || 0} Modules
                        </span>
                        <span className="px-3 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                          {course.level || "Beginner"}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>

                      <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed font-normal">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  {/* Pricing & Call-to-Action Footer */}
                  <div className="p-6 pt-4 flex items-center justify-between border-t border-slate-100 mt-2 bg-slate-50/50">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        Enrollment
                      </span>
                      <span className="text-2xl font-black text-slate-900 tracking-tight">
                        {course.price === 0 ? (
                          <span className="text-emerald-600">Free</span>
                        ) : (
                          `$${course.price}`
                        )}
                        {course.compareAtPrice > course.price && (
                          <span className="text-xs text-slate-400 line-through ml-2 font-normal">
                            ${course.compareAtPrice}
                          </span>
                        )}
                      </span>
                    </div>

                    <Link
                      to={`/courses/${course._id}`}
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/30 group-hover:scale-105"
                    >
                      View Curriculum{" "}
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
