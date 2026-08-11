import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  PlayCircle,
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
  Search,
  Sparkles,
  Trophy,
  Compass,
  X,
  GraduationCap,
} from "lucide-react";
import { toast } from "react-toastify";

const MyCoursesPage = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState("all"); // 'all', 'in-progress', 'completed'

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("UserToken");
        const response = await fetch(
          `${API_BASE_URL}/api/courses/student/enrolled`,
          {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          }
        );

        const data = await response.json();
        if (response.ok && data.success) {
          setEnrollments(data.enrollments || []);
        } else {
          toast.error(data.message || "Failed to load your enrolled courses.");
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        toast.error("Network error while loading your courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [API_BASE_URL]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4 bg-slate-50/50">
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <GraduationCap
            size={22}
            className="absolute text-blue-600 animate-pulse"
          />
        </div>
        <p className="text-slate-600 font-bold text-sm tracking-wide animate-pulse">
          Setting up your classroom...
        </p>
      </div>
    );
  }

  // Filter and search logic
  const filteredEnrollments = enrollments.filter((item) => {
    const course = item.course;
    if (!course) return false;

    const matchesSearch =
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const progress = item.progressPercentage || 0;

    if (filterTab === "in-progress") return matchesSearch && progress < 100;
    if (filterTab === "completed") return matchesSearch && progress === 100;
    return matchesSearch;
  });

  const completedCount = enrollments.filter(
    (i) => (i.progressPercentage || 0) === 100
  ).length;
  const inProgressCount = enrollments.filter(
    (i) => (i.progressPercentage || 0) < 100
  ).length;

  return (
    <div className="min-h-screen bg-slate-50/70 pb-32 pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* 🌟 Top Glassmorphic Banner Header */}
      <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 rounded-3xl text-white p-8 sm:p-10 shadow-2xl overflow-hidden border border-white/15">
        {/* Decorative Background Lighting Effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-blue-300 text-xs font-black uppercase tracking-wider border border-white/15 shadow-inner">
              <Sparkles size={14} className="text-blue-400" /> Student Workspace
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              My Learning Classroom
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Access your enrolled courses, track module completion, and
              continue mastering your tech skills.
            </p>
          </div>

          {/* Stat Badges */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/15 p-2.5 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-3 px-4 py-2 border-r border-white/10">
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <BookOpen size={20} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block">
                  Enrolled
                </span>
                <span className="text-xl font-black text-white leading-none">
                  {enrollments.length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Trophy size={20} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block">
                  Completed
                </span>
                <span className="text-xl font-black text-emerald-400 leading-none">
                  {completedCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔍 Search & Segmented Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Segmented Filter Control */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60">
          <button
            onClick={() => setFilterTab("all")}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all duration-200 cursor-pointer ${
              filterTab === "all"
                ? "bg-white text-blue-600 shadow-md shadow-slate-200"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            All Courses ({enrollments.length})
          </button>
          <button
            onClick={() => setFilterTab("in-progress")}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all duration-200 cursor-pointer ${
              filterTab === "in-progress"
                ? "bg-white text-blue-600 shadow-md shadow-slate-200"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            onClick={() => setFilterTab("completed")}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all duration-200 cursor-pointer ${
              filterTab === "completed"
                ? "bg-white text-emerald-600 shadow-md shadow-slate-200"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Search Input Box */}
        <div className="relative min-w-[260px]">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search your courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 📚 Course Cards Grid */}
      {filteredEnrollments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-16 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Compass size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900">
            {searchTerm ? "No Matching Courses" : "No Enrolled Courses Found"}
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
            {searchTerm
              ? `We couldn't find any courses matching "${searchTerm}". Try searching with a different keyword.`
              : "You haven't enrolled in any courses yet. Browse our professional catalog to start learning."}
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate("/courses")}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              Explore Course Catalog
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredEnrollments.map((item) => {
            const course = item.course;
            if (!course) return null;

            const imageUrl = course.thumbnail?.startsWith("http")
              ? course.thumbnail
              : `${API_BASE_URL}${course.thumbnail}`;

            const progress = item.progressPercentage || 0;
            const totalModules = course.modules?.length || 0;
            const totalLessons =
              course.modules?.reduce(
                (acc, m) => acc + (m.lessons?.length || 0),
                0
              ) || 0;

            return (
              <div
                key={item._id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-lg shadow-slate-200/50 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-blue-200 group"
              >
                <div>
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video bg-slate-950 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                    {/* Progress Badge */}
                    <span
                      className={`absolute top-3.5 right-3.5 px-3 py-1.5 rounded-full backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md border border-white/20 ${
                        progress === 100
                          ? "bg-emerald-600/90"
                          : progress > 0
                          ? "bg-blue-600/90"
                          : "bg-slate-950/80"
                      }`}
                    >
                      {progress === 100 ? (
                        <CheckCircle2 size={13} />
                      ) : (
                        <Clock size={13} />
                      )}
                      {progress === 100
                        ? "Completed"
                        : progress > 0
                        ? `${progress}% Done`
                        : "Not Started"}
                    </span>

                    {/* Category Tag */}
                    <span className="absolute bottom-3.5 left-3.5 px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider border border-white/15">
                      {course.category}
                    </span>
                  </div>

                  {/* Course Details Content */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <h3 className="font-black text-slate-900 text-lg sm:text-xl line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* Meta stats */}
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500 pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Layers size={14} className="text-indigo-500" />{" "}
                        {totalModules} Modules
                      </span>
                      <span className="flex items-center gap-1">
                        <PlayCircle size={14} className="text-cyan-500" />{" "}
                        {totalLessons} Lessons
                      </span>
                    </div>

                    {/* Progress Bar Widget */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between items-center text-[11px] font-extrabold">
                        <span className="text-slate-500 uppercase tracking-wider">
                          Overall Progress
                        </span>
                        <span
                          className={
                            progress === 100
                              ? "text-emerald-600 font-black"
                              : "text-blue-600 font-black"
                          }
                        >
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/80">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            progress === 100
                              ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                              : "bg-gradient-to-r from-blue-600 to-indigo-600"
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Button */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => navigate(`/courses/${course._id}/learn`)}
                    className={`w-full py-3.5 rounded-2xl font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 ${
                      progress === 100
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 shadow-emerald-500/10"
                        : progress > 0
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-600/20"
                        : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20"
                    }`}
                  >
                    <PlayCircle size={16} />
                    {progress === 100
                      ? "Review Classroom"
                      : progress > 0
                      ? "Continue Learning"
                      : "Start Course"}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
