import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  Layers,
  Edit,
  Trash2,
  ArrowLeft,
  PlayCircle,
  Film,
  FileText,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Clock,
} from "lucide-react";
import { toast } from "react-toastify";

const CourseDetailsAdminPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // State to track expanded modules for showing all lessons
  const [expandedModules, setExpandedModules] = useState({});

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  // Helper to convert standard watch URLs or raw links into valid iframe embed URLs
  const getEmbedUrl = (url) => {
    if (!url) return "";

    if (url.includes("/embed/")) {
      return url;
    }

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

  // Helper to construct absolute URL for PDFs
  const getPdfUrl = (fileUrl) => {
    if (!fileUrl) return "";
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      return fileUrl;
    }
    return `${API_BASE_URL}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`;
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("AdminToken");
        const response = await fetch(
          `${API_BASE_URL}/api/courses/${id}/details-with-students`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            credentials: "include",
          }
        );

        const data = await response.json();
        if (response.ok && data.success) {
          setCourse(data.course);
          setEnrollments(data.enrollments);
        } else {
          toast.error(data.message || "Failed to load course details");
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
        toast.error("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, API_BASE_URL]);

  const handleDeleteCourse = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this course? All student progress will be removed."
      )
    )
      return;

    try {
      const token = localStorage.getItem("AdminToken");
      const response = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast.success("Course deleted successfully.");
        navigate("/admin/courses");
      } else {
        toast.error(data.message || "Failed to delete course");
      }
    } catch (error) {
      toast.error("Something went wrong while deleting.");
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
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500 font-semibold text-lg animate-pulse">
        Loading course dashboard...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-800">Course not found</h2>
        <Link
          to="/admin/courses"
          className="text-blue-600 hover:underline mt-2 inline-block"
        >
          Back to Manage Courses
        </Link>
      </div>
    );
  }

  const imageUrl = course.thumbnail?.startsWith("http")
    ? course.thumbnail
    : `${API_BASE_URL}${course.thumbnail}`;

  const previewEmbedUrl = getEmbedUrl(course.previewVideoUrl);

  return (
    <div className="max-w-[94rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative">
      {/* Top Navigation & Action Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-semibold text-gray-500 hover:text-blue-600 flex items-center gap-1 transition"
        >
          <ArrowLeft size={16} /> Back to Courses
        </button>

        <div className="flex items-center gap-3">
          <Link
            to={`/admin/courses/edit/${course._id}`}
            className="px-5 py-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition font-bold text-xs flex items-center gap-2 shadow-sm"
          >
            <Edit size={16} /> Edit Course
          </Link>
          <button
            onClick={handleDeleteCourse}
            className="px-5 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition font-bold text-xs flex items-center gap-2 shadow-sm"
          >
            <Trash2 size={16} /> Delete Course
          </button>
        </div>
      </div>

      {/* Course Overview Banner & Full Details */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 sm:p-8">
        <div className="relative h-64 lg:h-full min-h-[220px] rounded-2xl overflow-hidden border shadow-inner bg-gray-100">
          <img
            src={imageUrl}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="lg:col-span-2 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
                {course.category}
              </span>
              {course.subCategory && (
                <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-bold uppercase tracking-wider">
                  {course.subCategory}
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
                {course.level || "Beginner"}
              </span>
              <span className="text-xs text-gray-400 font-semibold">
                Lang: {course.language || "English"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              {course.title}
            </h1>
            <p className="text-sm font-semibold text-blue-600 mt-1">
              {course.subtitle}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm mt-2 leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
            <div className="bg-gray-50 p-3 rounded-2xl text-center">
              <span className="text-xs text-gray-400 block font-bold">
                Price
              </span>
              <span className="text-base font-black text-gray-900">
                {course.price === 0 ? "Free" : `$${course.price}`}
                {course.compareAtPrice > course.price && (
                  <span className="text-xs text-gray-400 line-through ml-1.5 font-normal">
                    ${course.compareAtPrice}
                  </span>
                )}
              </span>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl text-center">
              <span className="text-xs text-gray-400 block font-bold">
                Modules
              </span>
              <span className="text-base font-black text-gray-900">
                {course.modules?.length || 0}
              </span>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl text-center">
              <span className="text-xs text-gray-400 block font-bold">
                Enrolled Students
              </span>
              <span className="text-base font-black text-emerald-600">
                {enrollments.length}
              </span>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl text-center">
              <span className="text-xs text-gray-400 block font-bold">
                Instructor
              </span>
              <span className="text-base font-black text-blue-600 truncate">
                {course.instructor || "appwat"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Trailer Section */}
      {previewEmbedUrl && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Film className="text-blue-600" /> Promotional Course Trailer
          </h2>
          <div className="flex justify-center">
            <div className="relative w-full max-w-xl aspect-video rounded-2xl overflow-hidden bg-black border shadow-inner">
              <iframe
                src={previewEmbedUrl}
                title="Course Trailer Preview"
                className="w-full h-full absolute inset-0 border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Course Curriculum Syllabus & Module Notes Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <Layers className="text-blue-600" /> Course Curriculum Syllabus &
          Module Notes
        </h2>

        {/* Grid container set to stretch items to equal height */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {course.modules?.map((mod, modIdx) => {
            const lessons = mod.lessons || [];
            const isExpanded = expandedModules[modIdx];
            const hasMultipleLessons = lessons.length > 1;

            const visibleLessons =
              hasMultipleLessons && !isExpanded ? [lessons[0]] : lessons;

            return (
              <div
                key={`mod-${modIdx}`}
                className="p-5 rounded-2xl bg-gray-50 border border-gray-200/60 space-y-4 shadow-sm flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-2 border-gray-200">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {mod.title}
                    </h3>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-200 text-gray-700">
                      {lessons.length}{" "}
                      {lessons.length === 1 ? "Lesson" : "Lessons"}
                    </span>
                  </div>

                  {/* Module PDF Notes Section with Open in New Tab Button */}
                  {mod.notes && mod.notes.length > 0 && (
                    <div className="space-y-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-4">
                      <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block">
                        Module PDF Notes & Resources
                      </span>
                      {mod.notes.map((note, noteIdx) => {
                        const noteUrl = getPdfUrl(note.fileUrl);
                        return (
                          <div
                            key={noteIdx}
                            className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200 shadow-sm"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <FileText
                                size={18}
                                className="text-blue-600 flex-shrink-0"
                              />
                              <span className="text-xs font-bold text-gray-800 truncate">
                                {note.title || `${mod.title} Notes Document`}
                              </span>
                            </div>
                            <a
                              href={noteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-blue-700 transition flex-shrink-0 shadow-sm cursor-pointer"
                            >
                              <ExternalLink size={14} /> View PDF
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="space-y-4 pt-4">
                    {visibleLessons.map((lesson, lesIdx) => {
                      const actualLesIdx =
                        hasMultipleLessons && !isExpanded ? 0 : lesIdx;
                      const lessonEmbedUrl = getEmbedUrl(lesson.videoUrl);

                      return (
                        <div
                          key={`lesson-${modIdx}-${actualLesIdx}`}
                          className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3"
                        >
                          <div className="flex justify-between items-center flex-wrap gap-2">
                            <span className="font-bold text-gray-800 text-sm flex items-center gap-2">
                              <PlayCircle
                                size={16}
                                className="text-blue-500 flex-shrink-0"
                              />{" "}
                              {actualLesIdx + 1}. {lesson.title}
                            </span>

                            <div className="flex items-center gap-2">
                              {/* Duration Badge */}
                              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-600 flex items-center gap-1">
                                <Clock size={12} className="text-gray-400" />
                                {lesson.duration || 10} mins
                              </span>

                              {lesson.isPreviewFree && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600">
                                  Free Preview
                                </span>
                              )}
                            </div>
                          </div>

                          {lesson.description && (
                            <p className="text-xs text-gray-500 font-medium">
                              {lesson.description}
                            </p>
                          )}

                          {lessonEmbedUrl && (
                            <div className="flex justify-center">
                              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border shadow-inner">
                                <iframe
                                  src={lessonEmbedUrl}
                                  title={`${mod.title}-${lesson.title}`}
                                  className="w-full h-full absolute inset-0 border-0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Dropdown Toggle Button pushed cleanly to the bottom */}
                {hasMultipleLessons && (
                  <div className="pt-3 border-t border-gray-200/60 mt-4">
                    <button
                      type="button"
                      onClick={() => toggleModuleExpand(modIdx)}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      {isExpanded ? (
                        <>
                          Show Less Lessons{" "}
                          <ChevronDown
                            size={16}
                            className="rotate-180 transition-transform"
                          />
                        </>
                      ) : (
                        <>
                          View All Lessons ({lessons.length}){" "}
                          <ChevronDown
                            size={16}
                            className="transition-transform"
                          />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Enrolled Students Navigation Button Section */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/20">
            <Users size={14} /> Student Management Roster
          </div>
          <h3 className="text-2xl font-black">Enrolled Students Overview</h3>
          <p className="text-gray-300 text-sm max-w-xl">
            Inspect individual student progression bars, completion dates,
            communication emails, and status logs.
          </p>
        </div>

        <Link
          to={`/admin/courses/${course._id}/students`}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition transform hover:-translate-y-0.5 whitespace-nowrap"
        >
          <Users size={18} /> View All Enrolled Students ({enrollments.length}){" "}
          <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default CourseDetailsAdminPage;
