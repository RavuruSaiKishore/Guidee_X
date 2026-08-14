import {
  ArrowRight,
  BookOpen,
  Clock,
  Monitor,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const CourseSection = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // =====================================================
  // FETCH COURSES
  // =====================================================

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // Fixed endpoint from /api/user to /api/courses
      const res = await fetch(`${API_BASE_URL}/api/courses`);
      const data = await res.json();

      if (res.ok && data.success) {
        setCourses((data.courses || []).slice(0, 4));
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20 font-sans">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              FEATURED PROGRAMS
            </span>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              Advance Your Skills With{" "}
              <span className="text-slate-900">Industry Programs</span>
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base font-normal">
              Explore professional certification and master programs designed
              for high-growth career tracks.
            </p>
          </div>

          {/* Desktop View All */}
          <button
            onClick={() => navigate("/courses")}
            className="group hidden shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-900 shadow-sm transition-all hover:border-slate-400 md:flex"
          >
            View All Courses
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[380px] animate-pulse rounded-2xl bg-slate-100 border border-slate-200"
              />
            ))}
          </div>
        ) : courses.length > 0 ? (
          <>
            {/* DESKTOP / TABLET CARDS */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {courses.map((course) => {
                return (
                  <div
                    key={course._id}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:block text-left"
                  >
                    <div>
                      {/* Institution / University Badge Simulation */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 font-bold shrink-0">
                          <GraduationCap size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {course.institution || "GuideX Certified"}
                          </p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                            {course.category || "Professional Program"}
                          </p>
                        </div>
                      </div>

                      {/* Course Title */}
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-3 min-h-[4.5rem]">
                        {course.title}
                      </h3>

                      {/* Divider Indicator */}
                      <div className="my-4 flex justify-center text-slate-300">
                        <div className="w-full h-px bg-slate-100" />
                      </div>

                      {/* Duration & Mode details */}
                      <div className="space-y-2 py-1 text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-2">
                          <Clock
                            size={14}
                            className="text-slate-400 shrink-0"
                          />
                          <span>{course.duration || "12 Months"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Monitor
                            size={14}
                            className="text-slate-400 shrink-0"
                          />
                          <span>{course.mode || "Online"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/courses/${course._id}`)}
                        className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => navigate(`/courses/${course._id}`)}
                        className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-slate-900 py-2 text-xs font-bold text-white transition hover:bg-slate-800 shadow-sm"
                      >
                        Explore
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* MOBILE CARDS */}
            <div className="space-y-4 sm:hidden">
              {courses.map((course) => {
                return (
                  <div
                    key={course._id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-left"
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 font-bold shrink-0">
                        <GraduationCap size={16} />
                      </div>
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {course.institution || "GuideX Certified"}
                      </p>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                      {course.title}
                    </h3>

                    <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 font-medium">
                      <span>{course.duration || "12 Months"}</span> •
                      <span>{course.mode || "Online"}</span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                      <button
                        onClick={() => navigate(`/courses/${course._id}`)}
                        className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-700"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => navigate(`/courses/${course._id}`)}
                        className="flex-1 rounded-xl bg-slate-900 py-2 text-xs font-bold text-white"
                      >
                        Explore
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center">
            <h3 className="text-lg font-bold text-slate-900">
              No courses found
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Please check back later for new programs.
            </p>
          </div>
        )}

        {/* MOBILE VIEW ALL */}
        {!loading && courses.length > 0 && (
          <div className="mt-7 text-center sm:mt-8 md:hidden">
            <button
              onClick={() => navigate("/courses")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold text-slate-900"
            >
              View All Courses
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseSection;
