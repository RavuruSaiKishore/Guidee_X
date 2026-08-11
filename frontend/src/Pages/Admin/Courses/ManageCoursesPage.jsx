import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  Edit,
  Users,
  BookOpen,
  Layers,
  Search,
  FolderKanban,
  CheckCircle2,
  SlidersHorizontal,
  ArrowUpDown,
  Tag,
  Eye,
} from "lucide-react";
import { toast } from "react-toastify";

const ManageCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const fetchManagedCourses = async () => {
    try {
      const token = localStorage.getItem("AdminToken");

      const response = await fetch(`${API_BASE_URL}/api/courses/manage/all`, {
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
      } else {
        toast.error(data.message || "Failed to fetch courses");
      }
    } catch (error) {
      console.error("Failed to fetch managed courses:", error);
      toast.error("Network error while fetching courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagedCourses();
  }, [API_BASE_URL]);

  const handleDelete = async (courseId, e) => {
    e.stopPropagation(); // Prevent card navigation when clicking delete
    if (
      !window.confirm(
        "Are you sure you want to delete this course? All student progress data will be removed."
      )
    )
      return;

    try {
      const token = localStorage.getItem("AdminToken");

      const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setCourses(courses.filter((c) => c._id !== courseId));
        toast.success("Course deleted successfully.");
      } else {
        toast.error(data.message || "Failed to delete course");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Something went wrong while deleting.");
    }
  };

  const categories = [
    "All",
    ...new Set(courses.map((c) => c.category).filter(Boolean)),
  ];
  const levels = ["All", "Beginner", "Intermediate", "Advanced", "All Levels"];

  const filteredCourses = courses
    .filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.subtitle?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || c.category === selectedCategory;
      const matchesLevel = selectedLevel === "All" || c.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "students")
        return (b.studentCount || 0) - (a.studentCount || 0);
      return 0;
    });

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500 font-semibold text-lg animate-pulse">
        Loading management portal...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 mb-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/20">
            <FolderKanban size={14} /> Admin & Mentor Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Manage <span className="text-blue-400">Curriculums</span>
          </h1>
          <p className="text-gray-300 text-sm max-w-xl">
            Monitor real-time enrollments, filter and inspect modular content
            structures, update pricing matrices, and publish elite learning
            experiences.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
          <Link
            to="/admin/courses/create"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold shadow-lg shadow-blue-500/30 hover:from-blue-600 hover:to-indigo-600 transition transform hover:-translate-y-0.5"
          >
            <Plus size={18} /> Create New Course
          </Link>
        </div>
      </div>

      {/* Advanced Control Bar */}
      <div className="bg-white rounded-3xl p-5 mb-6 border border-gray-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-1">
            <Search
              className="absolute left-3.5 top-3.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium transition"
            />
          </div>

          <div className="relative">
            <div className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none">
              <Tag size={16} />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold text-gray-700 cursor-pointer"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none">
              <SlidersHorizontal size={16} />
            </div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold text-gray-700 cursor-pointer"
            >
              {levels.map((lvl, idx) => (
                <option key={idx} value={lvl}>
                  Level: {lvl}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none">
              <ArrowUpDown size={16} />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold text-gray-700 cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="students">Most Enrolled</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-xs font-bold text-gray-500 px-1">
          <div>
            Showing{" "}
            <span className="text-gray-900">{filteredCourses.length}</span> of{" "}
            {courses.length} courses
          </div>
          {(searchTerm ||
            selectedCategory !== "All" ||
            selectedLevel !== "All") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedLevel("All");
                setSortBy("newest");
              }}
              className="text-blue-600 hover:underline font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Courses List Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No courses found</h3>
          <p className="text-gray-500 text-sm mt-1 mb-6">
            Try adjusting your search criteria or filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
              setSelectedLevel("All");
            }}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-md hover:bg-blue-700 transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredCourses.map((course) => {
            const imageUrl = course.thumbnail?.startsWith("http")
              ? course.thumbnail
              : `${API_BASE_URL}${course.thumbnail}`;

            return (
              <Link
                to={`/admin/courses/${course._id}`}
                key={course._id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 group cursor-pointer"
              >
                {/* Left Side: Thumbnail & Core Details */}
                <div className="flex items-start sm:items-center gap-5 w-full lg:w-2/5">
                  <div className="relative w-32 h-20 sm:w-36 sm:h-24 rounded-2xl overflow-hidden border shadow-inner flex-shrink-0 bg-gray-100">
                    <img
                      src={imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                      {course.level || "Beginner"}
                    </span>
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
                        {course.category}
                      </span>
                      {course.isPublished && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={12} /> Live
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-gray-900 truncate group-hover:text-blue-600 transition">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1 font-medium">
                      {course.subtitle || course.description}
                    </p>
                  </div>
                </div>

                {/* Middle: Quick Metrics Badges */}
                <div className="grid grid-cols-3 gap-4 w-full lg:w-auto lg:flex lg:items-center lg:gap-8 border-y lg:border-y-0 py-3 lg:py-0 border-gray-100">
                  <div className="bg-gray-50/80 lg:bg-transparent p-3 lg:p-0 rounded-2xl text-center lg:text-left">
                    <span className="text-[11px] text-gray-400 block font-bold uppercase tracking-wider">
                      Price
                    </span>
                    <span className="text-sm font-black text-gray-900 mt-0.5 block">
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </span>
                  </div>

                  <div className="bg-gray-50/80 lg:bg-transparent p-3 lg:p-0 rounded-2xl text-center lg:text-left">
                    <span className="text-[11px] text-gray-400 block font-bold uppercase tracking-wider">
                      Modules
                    </span>
                    <span className="text-sm font-black text-gray-800 flex items-center justify-center lg:justify-start gap-1 mt-0.5">
                      <Layers size={14} className="text-blue-500" />{" "}
                      {course.modules?.length || 0}
                    </span>
                  </div>

                  <div className="bg-gray-50/80 lg:bg-transparent p-3 lg:p-0 rounded-2xl text-center lg:text-left">
                    <span className="text-[11px] text-gray-400 block font-bold uppercase tracking-wider">
                      Students
                    </span>
                    <span className="text-sm font-black text-emerald-600 flex items-center justify-center lg:justify-start gap-1 mt-0.5">
                      <Users size={14} /> {course.studentCount || 0}
                    </span>
                  </div>
                </div>

                {/* Right Side: Action Buttons */}
                <div
                  className="flex items-center gap-2.5 w-full lg:w-auto justify-end"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    to={`/admin/courses/edit/${course._id}`}
                    className="px-4 py-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                    title="Edit Course"
                  >
                    <Edit size={15} /> Edit
                  </Link>
                  <button
                    onClick={(e) => handleDelete(course._id, e)}
                    className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition flex items-center justify-center shadow-sm"
                    title="Delete Course"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageCoursesPage;
