import { GraduationCap, ArrowRight, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EnrolledCourses = ({ courses = [], overallProgress, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <section className="rounded-3xl bg-white p-6 shadow-sm font-sans border border-slate-200">
        <div className="mb-6 flex justify-between items-center">
          <div className="h-6 w-48 bg-slate-100 animate-pulse rounded" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      </section>
    );
  }

  // Extract global progress percentage if passed as an object or number
  const globalPercentage = Number(
    overallProgress?.percentage ?? overallProgress ?? 0
  );

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-6 font-sans border border-slate-200">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
            Learning Programs
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-black tracking-tight">
            Enrolled <span className="text-blue-600">Courses</span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium">
            Track your progress across active course modules.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Global Progress Indicator */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Overall Completion
            </span>
            <span className="text-sm font-black text-blue-600">
              {globalPercentage}% Complete
            </span>
          </div>

          <button
            onClick={() => navigate("/courses")}
            className="flex items-center gap-2 self-start rounded-xl bg-blue-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 sm:self-auto"
          >
            Explore All Courses
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-slate-300 bg-white">
          <GraduationCap className="mx-auto h-10 w-10 text-blue-600 mb-2" />
          <h3 className="font-bold text-black text-sm">
            No Enrolled Courses Yet
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            Browse our professional programs to start learning.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((item) => {
            const course = item.course || item;

            // Extract completion percentage precisely from multiple fallback keys
            const progressValue = Number(
              item.progress ??
                item.completionPercentage ??
                course.progress ??
                course.completionPercentage ??
                (item.completedLessons?.length && item.totalLessons
                  ? Math.round(
                      (item.completedLessons.length / item.totalLessons) * 100
                    )
                  : 0)
            );

            return (
              <div
                key={course._id || item._id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-white">
                      <BookOpen size={12} />{" "}
                      {course.category || "Active Course"}
                    </span>
                    <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                      {progressValue}% Complete
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-black mb-2 line-clamp-1">
                    {course.title || "Professional Program"}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                    {course.description ||
                      "Master industry concepts with hands-on labs and real projects."}
                  </p>

                  {/* Progress Bar & Numeric Indicator */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-slate-500 uppercase">
                        Module Progress
                      </span>
                      <span className="text-blue-600">{progressValue}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-200">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            Math.max(progressValue, 0),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    {course.level || "Intermediate"}
                  </span>
                  <button
                    onClick={() =>
                      navigate(`/course/${course._id || course.id}`)
                    }
                    className="rounded-xl bg-black px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800 shadow-sm"
                  >
                    Continue Learning
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default EnrolledCourses;
