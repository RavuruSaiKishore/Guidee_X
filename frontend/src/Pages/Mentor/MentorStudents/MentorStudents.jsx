import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Users,
  Search,
  UserRound,
  GraduationCap,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ArrowRight,
  Loader2,
  Sparkles,
  CalendarCheck2,
  Video,
  CircleCheck,
} from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MentorStudents = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /*
  =========================================================
  FETCH STUDENTS
  =========================================================
  */

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("MentorToken");

      if (!token) {
        toast.error("Mentor authentication required.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/mentorStudent/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch students.");
      }

      setStudents(Array.isArray(data.students) ? data.students : []);
    } catch (error) {
      console.error("FETCH STUDENTS ERROR:", error);

      toast.error(error.message || "Unable to load students.");
    } finally {
      setLoading(false);
    }
  };

  /*
  =========================================================
  FORMAT DATE
  =========================================================
  */

  const formatDate = (date) => {
    if (!date) {
      return "No session yet";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /*
  =========================================================
  FILTER STUDENTS
  =========================================================
  */

  const filteredStudents = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return students;
    }

    return students.filter((item) => {
      const student = item?.student || {};

      const name = `${student?.firstName || ""} ${
        student?.lastName || ""
      }`.toLowerCase();

      const email = student?.email?.toLowerCase() || "";

      const careerGoal = student?.careerGoal?.toLowerCase() || "";

      const education = student?.education?.toLowerCase() || "";

      return (
        name.includes(query) ||
        email.includes(query) ||
        careerGoal.includes(query) ||
        education.includes(query)
      );
    });
  }, [students, search]);

  /*
  =========================================================
  LOADING SCREEN
  =========================================================
  */

  if (loading) {
    return (
      <div
        className="min-h-screen bg-slate-50 pt-20 lg:ml-64 lg:pt-0 text-slate-900"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-5">
          <div className="relative">
            <div className="h-14 w-14 rounded-full border-4 border-slate-200" />
            <div className="absolute inset-0 h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
          </div>
          <p
            className="mt-5 text-center text-xs font-semibold tracking-tight"
            style={{ fontWeight: 600 }}
          >
            Loading your students...
          </p>
          <p
            className="mt-1 text-center text-[11px] text-slate-400 font-medium"
            style={{ fontWeight: 600 }}
          >
            Fetching students you have interacted with.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-50 pt-16 sm:pt-20 lg:ml-64 lg:pt-0 text-slate-900 pb-16"
      style={{ fontFamily: "'Poppins', sans-serif", fontStyle: "normal" }}
    >
      <ToastContainer position="top-right" autoClose={2500} />

      <main className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* =================================================
            HEADER
        ================================================== */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-black p-5 sm:p-8 text-white shadow-md">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 min-w-0">
              <div
                className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur shadow-inner text-blue-400"
                style={{ fontWeight: 600 }}
              >
                <Users size={24} className="sm:w-[26px] sm:h-[26px]" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-blue-300 backdrop-blur"
                    style={{ fontWeight: 600 }}
                  >
                    <Sparkles size={12} className="text-blue-400" />
                    Student Roster
                  </span>
                </div>

                <h1
                  className="mt-1.5 sm:mt-2 text-xl sm:text-3xl font-semibold tracking-tight text-white"
                  style={{ fontWeight: 600 }}
                >
                  My Students
                </h1>

                <p
                  className="mt-0.5 sm:mt-1 text-[11px] sm:text-sm text-slate-300 font-medium leading-relaxed"
                  style={{ fontWeight: 600 }}
                >
                  Manage and track all students you have mentored.
                </p>
              </div>
            </div>

            <div
              className="flex items-center gap-3.5 sm:gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 sm:px-5 py-3.5 sm:py-4 backdrop-blur shadow-inner shrink-0"
              style={{ fontWeight: 600 }}
            >
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-white text-sm sm:text-base font-semibold text-black shadow-xs">
                {students.length}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Total
                </p>
                <h3 className="text-xs sm:text-sm font-semibold text-white">
                  Students
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            SEARCH
        ================================================== */}
        <section className="space-y-3">
          <div className="flex flex-col lg:flex-row items-center gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative min-w-0 flex-1 w-full">
              <Search
                size={16}
                className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search students by name, email, education..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 sm:h-11 pl-10 sm:pl-11 pr-3 sm:pr-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                style={{ fontWeight: 600 }}
              />
            </div>

            <div
              className="flex h-10 sm:h-11 w-full lg:w-64 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 sm:px-4 text-xs font-semibold text-slate-700 shrink-0"
              style={{ fontWeight: 600 }}
            >
              <span className="text-slate-500 uppercase tracking-wide text-[10px]">
                Matching Students
              </span>
              <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-lg bg-black text-white text-[11px] sm:text-xs">
                {filteredStudents.length}
              </span>
            </div>
          </div>
        </section>

        {/* =================================================
            EMPTY STATE
        ================================================== */}
        {filteredStudents.length === 0 ? (
          <section className="flex min-h-[350px] w-full flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-5 py-12 text-center shadow-xs">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3 sm:mb-4">
              <Users size={24} />
            </div>

            <h2
              className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight"
              style={{ fontWeight: 600 }}
            >
              No students found
            </h2>
            <p
              className="mt-1 max-w-sm text-center text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed"
              style={{ fontWeight: 600 }}
            >
              Students you interact with will appear here.
            </p>
          </section>
        ) : (
          /* =================================================
             STUDENT CARDS (RESPONSIVE STACK FOR SMALL SCREENS)
          ================================================== */
          <section className="w-full space-y-4">
            {filteredStudents.map((item) => {
              const student = item?.student || {};

              const stats = item?.statistics || {};

              const studentName =
                `${student?.firstName || ""} ${
                  student?.lastName || ""
                }`.trim() || "Student";

              const profileImage = student?.profileImage
                ? student.profileImage.startsWith("http")
                  ? student.profileImage
                  : `${API_BASE_URL}${student.profileImage}`
                : null;

              return (
                <article
                  key={student?._id}
                  className="group w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-xs transition duration-200 hover:border-blue-300 hover:shadow-md p-4 sm:p-6"
                >
                  <div className="w-full space-y-4 sm:space-y-5">
                    {/* TOP ROW: AVATAR, INFO & VIEW PROFILE BUTTON */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3.5 sm:pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3 min-w-0">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt={studentName}
                            className="h-11 w-11 sm:h-14 sm:w-14 shrink-0 rounded-xl sm:rounded-2xl border border-slate-200 object-cover shadow-2xs"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div
                            className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-black text-white text-xs font-semibold shadow-2xs"
                            style={{ fontWeight: 600 }}
                          >
                            <UserRound
                              size={16}
                              className="text-blue-400 sm:w-[18px] sm:h-[18px]"
                            />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h2
                            className="text-xs sm:text-sm font-semibold text-slate-900 tracking-tight truncate"
                            style={{ fontWeight: 600 }}
                          >
                            {studentName}
                          </h2>
                          <p
                            className="mt-0.5 text-[10px] sm:text-[11px] text-slate-500 font-medium truncate"
                            style={{ fontWeight: 600 }}
                          >
                            {student?.email || "No email available"}
                          </p>
                          {student?.phone && (
                            <p
                              className="mt-0.5 text-[10px] text-slate-400 font-medium truncate"
                              style={{ fontWeight: 600 }}
                            >
                              {student.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* VIEW PROFILE BUTTON */}
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/mentor/students/${student?._id}`)
                        }
                        className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 rounded-xl bg-black hover:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white transition shadow-xs"
                        style={{ fontWeight: 600 }}
                      >
                        <span>View Profile</span>
                        <ArrowRight
                          size={13}
                          className="text-blue-400 transition-transform group-hover:translate-x-0.5"
                        />
                      </button>
                    </div>

                    {/* EDUCATION & CAREER GOAL TAGS / BOXES */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="h-7 w-7 shrink-0 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 mt-0.5">
                          <GraduationCap size={14} />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                            style={{ fontWeight: 600 }}
                          >
                            Education
                          </p>
                          <p
                            title={student?.education || "Not provided"}
                            className="mt-0.5 text-[11px] sm:text-xs font-semibold text-slate-800 truncate"
                            style={{ fontWeight: 600 }}
                          >
                            {student?.education || "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="h-7 w-7 shrink-0 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 mt-0.5">
                          <Sparkles size={14} />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                            style={{ fontWeight: 600 }}
                          >
                            Career Goal
                          </p>
                          <p
                            title={student?.careerGoal || "Not provided"}
                            className="mt-0.5 text-[11px] sm:text-xs font-semibold text-slate-800 truncate"
                            style={{ fontWeight: 600 }}
                          >
                            {student?.careerGoal || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* SESSION STATISTICS (STACKED ON MOBILE, 3-COL ON DESKTOP) */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3.5 text-xs font-semibold">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 p-2.5 sm:p-3.5 text-center sm:text-left">
                        <div className="mx-auto sm:mx-0 flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-white border border-slate-200 text-emerald-600">
                          <CheckCircle2 size={14} className="sm:w-4 sm:h-4" />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-[9px] sm:text-[10px] uppercase tracking-wide text-slate-400 truncate"
                            style={{ fontWeight: 600 }}
                          >
                            Completed
                          </p>
                          <p
                            className="text-xs sm:text-base font-semibold text-emerald-600"
                            style={{ fontWeight: 600 }}
                          >
                            {stats?.completedSessions ?? 0}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 p-2.5 sm:p-3.5 text-center sm:text-left">
                        <div className="mx-auto sm:mx-0 flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-white border border-slate-200 text-blue-600">
                          <Clock3 size={14} className="sm:w-4 sm:h-4" />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-[9px] sm:text-[10px] uppercase tracking-wide text-slate-400 truncate"
                            style={{ fontWeight: 600 }}
                          >
                            Upcoming
                          </p>
                          <p
                            className="text-xs sm:text-base font-semibold text-blue-600"
                            style={{ fontWeight: 600 }}
                          >
                            {stats?.upcomingSessions ?? 0}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 p-2.5 sm:p-3.5 text-center sm:text-left">
                        <div className="mx-auto sm:mx-0 flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-white border border-slate-200 text-slate-800">
                          <CalendarDays size={14} className="sm:w-4 sm:h-4" />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-[9px] sm:text-[10px] uppercase tracking-wide text-slate-400 truncate"
                            style={{ fontWeight: 600 }}
                          >
                            Total
                          </p>
                          <p
                            className="text-xs sm:text-base font-semibold text-slate-900"
                            style={{ fontWeight: 600 }}
                          >
                            {stats?.totalSessions ?? 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* BOTTOM DETAILS (GRID WRAPPED FOR SMALL SCREENS) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1 text-[11px] sm:text-xs font-semibold text-slate-500">
                      <div className="flex items-center gap-2 bg-slate-50/70 p-2.5 sm:p-3 rounded-xl border border-slate-200">
                        <CalendarCheck2
                          size={14}
                          className="text-blue-600 shrink-0"
                        />
                        <span className="truncate">
                          Last Session:{" "}
                          <strong className="text-slate-800 font-semibold">
                            {formatDate(item?.lastSession?.date)}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-50/70 p-2.5 sm:p-3 rounded-xl border border-slate-200">
                        <Video size={14} className="text-blue-600 shrink-0" />
                        <span className="truncate">
                          Type:{" "}
                          <strong className="text-slate-800 font-semibold">
                            {item?.lastSession?.sessionType || "No session yet"}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-50/70 p-2.5 sm:p-3 rounded-xl border border-slate-200">
                        <CircleCheck
                          size={14}
                          className="text-emerald-600 shrink-0"
                        />
                        <span className="truncate">
                          Status:{" "}
                          <strong className="text-slate-800 font-semibold">
                            {item?.lastSession?.status || "No session yet"}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-50/70 p-2.5 sm:p-3 rounded-xl border border-slate-200">
                        <CalendarDays
                          size={14}
                          className="text-blue-600 shrink-0"
                        />
                        <span className="truncate">
                          Activity:{" "}
                          <strong className="text-slate-800 font-semibold">
                            {stats?.totalSessions ?? 0}{" "}
                            {stats?.totalSessions === 1
                              ? "session"
                              : "sessions"}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
};

export default MentorStudents;