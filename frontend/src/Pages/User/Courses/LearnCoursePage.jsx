import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BookOpen,
  PlayCircle,
  Clock,
  FileText,
  ExternalLink,
  Layers,
  Star,
  ChevronDown,
  CheckCircle2,
  Circle,
  Award,
  ArrowLeft,
  ShieldCheck,
  CheckCircle,
  Zap,
  Info,
} from "lucide-react";
import { toast } from "react-toastify";

const LearnCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active playing lesson state
  const [activeLesson, setActiveLesson] = useState(null);

  // State to track expanded modules for showing lessons in sidebar
  const [expandedModules, setExpandedModules] = useState({});

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  // Helper for embed URLs (YouTube)
  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("/embed/")) return url;
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("watch?v=")[1]?.split("&")[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    return url;
  };

  // Helper for absolute PDF URLs
  const getPdfUrl = (fileUrl) => {
    if (!fileUrl) return "";
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      return fileUrl;
    }
    return `${API_BASE_URL}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`;
  };

  useEffect(() => {
    const fetchLearningData = async () => {
      try {
        const token = localStorage.getItem("UserToken");

        // Fetch Course Details & User Enrollment
        const courseRes = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
          headers: { ...(token && { Authorization: `Bearer ${token}` }) },
          credentials: "include",
        });
        const courseData = await courseRes.json();

        const enrollmentRes = await fetch(
          `${API_BASE_URL}/api/courses/${id}/enroll`,
          {
            method: "GET",
            headers: { ...(token && { Authorization: `Bearer ${token}` }) },
            credentials: "include",
          }
        );
        const enrollmentData = await enrollmentRes.json();

        if (courseRes.ok && courseData.success) {
          setCourse(courseData.course);

          // Set default active lesson to first lesson of first module if available
          if (courseData.course.modules?.[0]?.lessons?.[0]) {
            setActiveLesson(courseData.course.modules[0].lessons[0]);
          }
          // Expand first module by default
          setExpandedModules({ 0: true });
        }

        if (enrollmentRes.ok && enrollmentData.success) {
          setEnrollment(enrollmentData.enrollment);
        }
      } catch (error) {
        console.error("Failed to load learning portal:", error);
        toast.error("Network error while loading course room.");
      } finally {
        setLoading(false);
      }
    };

    fetchLearningData();
  }, [id, API_BASE_URL]);

  // Toggle Lesson Completion Status & Progress Calculation
  const handleToggleLessonComplete = async (lessonId) => {
    try {
      const token = localStorage.getItem("UserToken");
      const response = await fetch(
        `${API_BASE_URL}/api/courses/${id}/progress`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ lessonId }),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setEnrollment(data.enrollment);
        toast.success(data.message || "Progress updated!");
      } else {
        toast.error(data.message || "Failed to update progress");
      }
    } catch (error) {
      console.error("Progress update error:", error);
      toast.error("Something went wrong updating progress.");
    }
  };

  const toggleModuleExpand = (modIdx) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modIdx]: !prev[modIdx],
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] space-y-4 bg-slate-50">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600 font-bold text-base tracking-wide animate-pulse">
          Loading secure learning classroom...
        </p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-32 bg-slate-50 text-slate-800 min-h-[75vh] space-y-4">
        <h2 className="text-2xl font-black">Classroom unavailable</h2>
        <button
          onClick={() => navigate("/courses")}
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const completedLessons = enrollment?.completedLessons || [];
  const progressPercentage = enrollment?.progressPercentage || 0;
  const activeEmbedUrl = getEmbedUrl(activeLesson?.videoUrl);
  const totalLessons =
    course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  const imageUrl = course.thumbnail?.startsWith("http")
    ? course.thumbnail
    : `${API_BASE_URL}${course.thumbnail}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-blue-600 selection:text-white pb-32">
      {/* ========================================== */}
      {/* 🌟 IMMERSIVE HERO HEADER (MATCHING COURSE DETAILS) */}
      {/* ========================================== */}
      <div className="relative bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-white/10 shadow-2xl overflow-hidden mt-16">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-6">
          {/* Top Bar inside Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <button
              onClick={() => navigate(`/courses/${id}`)}
              className="text-xs font-bold text-slate-300 hover:text-white transition px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={16} /> Back to Course Overview
            </button>

            {/* Real-time Progress Widget */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/20">
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block">
                  Overall Progress
                </span>
                <span className="text-xs font-black text-emerald-400">
                  {progressPercentage}% Completed
                </span>
              </div>
              <div className="w-28 sm:w-40 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-700 rounded-full shadow-lg"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              {progressPercentage === 100 && (
                <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-xl text-xs font-black">
                  <Award size={15} /> Completed
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center pt-4">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black uppercase tracking-wider border border-blue-400/30 shadow-md">
                  {course.category}
                </span>
                {course.subCategory && (
                  <span className="px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-wider border border-indigo-400/30 shadow-md">
                    {course.subCategory}
                  </span>
                )}
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/20">
                  {course.level || "Beginner"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                {course.title}
              </h1>

              {course.subtitle && (
                <p className="text-blue-200 text-base font-semibold">
                  {course.subtitle}
                </p>
              )}

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-slate-300 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <Layers size={16} className="text-indigo-400" />{" "}
                  {course.modules?.length || 0} Modules
                </span>
                <span className="flex items-center gap-1.5">
                  <PlayCircle size={16} className="text-cyan-400" />{" "}
                  {totalLessons} Total Lessons
                </span>
                <span className="flex items-center gap-1.5">
                  <Star size={16} className="text-amber-400 fill-amber-400" />{" "}
                  {course.averageRating
                    ? course.averageRating.toFixed(1)
                    : "4.9"}{" "}
                  Rating
                </span>
              </div>
            </div>

            {/* Header Thumbnail Box */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-3xl shadow-2xl space-y-4">
              <div className="relative h-40 rounded-2xl overflow-hidden shadow-inner bg-slate-900">
                <img
                  src={imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
                <span>Access Granted</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={14} /> Enrolled & Paid
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 📺 MAIN CLASSROOM CONTAINER GRID */}
      {/* ========================================== */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 gap-8">
        {/* Left Video Player & Active Lesson Info Section (Span 3) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Immersive Video Player Box */}
          <div className="bg-black rounded-3xl overflow-hidden border border-slate-200 shadow-xl aspect-video relative flex items-center justify-center">
            {activeEmbedUrl ? (
              <iframe
                src={activeEmbedUrl}
                title={activeLesson?.title || "Lesson Video"}
                className="w-full h-full absolute inset-0 border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="text-center text-slate-400 space-y-3">
                <PlayCircle
                  size={56}
                  className="mx-auto opacity-40 text-blue-500 animate-pulse"
                />
                <p className="text-sm font-bold text-slate-300">
                  Select a lesson from the right syllabus sidebar to start
                  watching.
                </p>
              </div>
            )}
          </div>

          {/* Active Lesson Header & Complete Action Button */}
          {activeLesson && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-3.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-wider border border-blue-100">
                    Currently Playing
                  </span>
                  <span className="text-xs text-slate-500 font-bold flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-lg">
                    <Clock size={13} className="text-blue-500" />{" "}
                    {activeLesson.duration || 10} mins
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {activeLesson.title}
                </h2>
                {activeLesson.description && (
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {activeLesson.description}
                  </p>
                )}
              </div>

              {/* Mark Complete / Completed Toggle Button */}
              <button
                onClick={() => handleToggleLessonComplete(activeLesson._id)}
                className={`px-7 py-4 rounded-2xl font-black text-xs flex items-center gap-2.5 transition shadow-xl cursor-pointer whitespace-nowrap transform hover:-translate-y-0.5 ${
                  completedLessons.includes(activeLesson._id)
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 shadow-emerald-500/10"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-600/20"
                }`}
              >
                {completedLessons.includes(activeLesson._id) ? (
                  <>
                    <CheckCircle2 size={18} className="text-emerald-600" />{" "}
                    Lesson Completed
                  </>
                ) : (
                  <>
                    <Circle size={18} /> Mark as Complete
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar Syllabus Curriculum Drawer (Span 1) */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-6 h-fit shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Layers size={18} className="text-blue-600" /> Course Syllabus
            </h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {course.modules?.length || 0} Modules
            </span>
          </div>

          <div className="space-y-4">
            {course.modules?.map((mod, modIdx) => {
              const isModExpanded = expandedModules[modIdx];
              return (
                <div
                  key={modIdx}
                  className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/80"
                >
                  {/* Module Header Dropdown Toggle */}
                  <div
                    onClick={() => toggleModuleExpand(modIdx)}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest group-hover:text-blue-600 transition">
                      {mod.title}
                    </h4>
                    <ChevronDown
                      size={16}
                      className={`text-slate-400 transition-transform duration-300 ${
                        isModExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* Module PDF Notes Link (Opens in New Tab) */}
                  {mod.notes && mod.notes.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      {mod.notes.map((note, noteIdx) => {
                        const noteUrl = getPdfUrl(note.fileUrl);
                        return (
                          <a
                            key={noteIdx}
                            href={noteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100/60 transition text-xs font-bold text-blue-700 shadow-sm cursor-pointer"
                          >
                            <span className="flex items-center gap-2 truncate">
                              <FileText
                                size={15}
                                className="text-blue-600 flex-shrink-0"
                              />
                              <span className="truncate">
                                {note.title || `${mod.title} Notes`}
                              </span>
                            </span>
                            <ExternalLink size={13} className="flex-shrink-0" />
                          </a>
                        );
                      })}
                    </div>
                  )}

                  {/* Lessons Playlist Items */}
                  {isModExpanded && (
                    <div className="space-y-2 pt-3">
                      {mod.lessons?.map((lesson, lesIdx) => {
                        const isSelected = activeLesson?._id === lesson._id;
                        const isCompleted = completedLessons.includes(
                          lesson._id
                        );

                        return (
                          <div
                            key={lesson._id || lesIdx}
                            onClick={() => setActiveLesson(lesson)}
                            className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                              isSelected
                                ? "bg-blue-50 border-blue-300 text-blue-900 shadow-sm"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {isCompleted ? (
                                <CheckCircle2
                                  size={16}
                                  className="text-emerald-600 flex-shrink-0"
                                />
                              ) : (
                                <PlayCircle
                                  size={16}
                                  className={`flex-shrink-0 ${
                                    isSelected
                                      ? "text-blue-600"
                                      : "text-slate-400"
                                  }`}
                                />
                              )}
                              <span className="text-xs font-bold truncate">
                                {lesIdx + 1}. {lesson.title}
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold text-slate-500 flex-shrink-0">
                              {lesson.duration || 10}m
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 🌟 COURSE BENEFITS & CLASSROOM INFO CARDS */}
      {/* ========================================== */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
              <Zap size={16} /> Program Perks & Benefits
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              Everything Included in Your Enrollment
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2.5">
                <CheckCircle size={16} className="text-emerald-600" /> Lifetime
                access to all modules and video archives
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle size={16} className="text-emerald-600" />{" "}
                Downloadable PDF resource notes and lesson guides
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle size={16} className="text-emerald-600" /> Verified
                certificate of completion upon 100% progress
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle size={16} className="text-emerald-600" /> Secure
                progress sync across your student dashboard
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <Info size={18} className="text-blue-600" /> Classroom Session
              Telemetry
            </div>
            <div className="space-y-2 text-xs text-slate-600 border-t border-slate-200 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Course Category:</span>
                <span className="font-bold text-slate-800">
                  {course.category}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Difficulty Level:</span>
                <span className="font-bold text-slate-800">
                  {course.level || "Beginner"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">
                  Total Curriculum Lessons:
                </span>
                <span className="font-bold text-slate-800">
                  {totalLessons} Lessons
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Completed By You:</span>
                <span className="font-bold text-emerald-600">
                  {completedLessons.length} / {totalLessons}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnCoursePage;
