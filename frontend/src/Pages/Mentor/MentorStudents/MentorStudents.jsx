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

      console.log("MENTOR STUDENTS:", data);

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
      <main className="lg:ml-64 min-h-screen bg-slate-50 pt-16 lg:pt-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto shadow-sm">
            <Loader2 size={34} className="animate-spin text-cyan-600" />
          </div>

          <p className="mt-5 font-semibold text-slate-700">
            Loading your students...
          </p>

          <p className="text-sm text-slate-400 mt-1">
            Fetching students you have interacted with.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} />

      <main className="lg:ml-64 min-h-screen bg-slate-50 pt-16 lg:pt-0">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          {/* =================================================
              PREMIUM HEADER
          ================================================== */}

          <div className="mb-6 sm:mb-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-700 via-teal-600 to-blue-700 p-5 text-white shadow-xl sm:rounded-3xl sm:p-7 lg:p-8">
              {/* Background Decorations */}

              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-3xl sm:h-44 sm:w-44" />

              <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-white/10 blur-3xl sm:h-56 sm:w-56" />

              {/* Header Content */}

              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
                {/* Left */}

                <div className="flex min-w-0 items-start gap-3 sm:gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/20 backdrop-blur-md sm:h-16 sm:w-16 sm:rounded-2xl">
                    <Users
                      size={26}
                      className="text-white sm:h-[34px] sm:w-[34px]"
                    />
                  </div>

                  <div className="min-w-0">
                    <h1 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                      My Students
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-cyan-100 sm:text-base">
                      Manage and track all students you have mentored.
                    </p>
                  </div>
                </div>

                {/* Total */}

                <div className="w-full rounded-2xl border border-white/20 bg-white/15 px-4 py-4 backdrop-blur-md sm:px-6 sm:py-5 lg:w-auto lg:min-w-[220px]">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-xl font-bold text-cyan-700 sm:h-14 sm:w-14 sm:text-2xl">
                      {students.length}
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-cyan-100 sm:text-sm">
                        Total
                      </p>

                      <h3 className="text-lg font-semibold sm:text-xl">
                        Students
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              SEARCH
          ================================================== */}

          <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-7 shadow-sm">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search students by name, email, education or career goal..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-sm sm:text-base"
              />
            </div>
          </div>

          {/* =================================================
              EMPTY STATE
          ================================================== */}

          {filteredStudents.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <Users size={60} className="mx-auto text-slate-300" />

              <h2 className="text-xl font-bold text-slate-800 mt-5">
                No students found
              </h2>

              <p className="text-slate-500 mt-2">
                Students you interact with will appear here.
              </p>
            </div>
          ) : (
            /* =================================================
               HORIZONTAL STUDENT CARDS
            ================================================== */

            <div className="space-y-6">
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
                  <div
                    key={student?._id}
                    className="group w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-cyan-200 hover:shadow-xl"
                  >
                    {/* =================================================
                        MAIN CARD
                    ================================================== */}

                    <div className="p-5 sm:p-6 lg:p-7">
                      <div className="flex flex-col gap-7">
                        {/* =================================================
                            TOP HORIZONTAL ROW
                        ================================================== */}

                        <div className="flex flex-col xl:flex-row xl:items-center gap-7">
                          {/* =================================================
                              PROFILE
                          ================================================== */}

                          <div className="flex items-center gap-5 xl:w-[310px] xl:flex-shrink-0">
                            {profileImage ? (
                              <img
                                src={profileImage}
                                alt={studentName}
                                className="h-20 w-20 flex-shrink-0 rounded-2xl object-cover border border-slate-200 shadow-sm"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="h-20 w-20 flex-shrink-0 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                                <UserRound
                                  size={34}
                                  className="text-cyan-700"
                                />
                              </div>
                            )}

                            <div className="min-w-0">
                              <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                                {studentName}
                              </h2>

                              <p className="mt-1 text-sm text-slate-500 truncate">
                                {student?.email || "No email available"}
                              </p>

                              {student?.phone && (
                                <p className="mt-1 text-xs text-slate-400">
                                  {student.phone}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Divider */}

                          <div className="hidden xl:block h-16 w-px bg-slate-200" />

                          {/* =================================================
                              EDUCATION
                          ================================================== */}

                          <div className="flex items-start gap-3 xl:flex-1 min-w-0">
                            <div className="h-11 w-11 flex-shrink-0 rounded-xl bg-indigo-50 flex items-center justify-center">
                              <GraduationCap
                                size={21}
                                className="text-indigo-600"
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Education
                              </p>

                              <p
                                title={student?.education || "Not provided"}
                                className="mt-1 text-sm font-semibold text-slate-700 line-clamp-2"
                              >
                                {student?.education || "Not provided"}
                              </p>
                            </div>
                          </div>

                          {/* =================================================
                              CAREER GOAL
                          ================================================== */}

                          <div className="flex items-start gap-3 xl:flex-1 min-w-0">
                            <div className="h-11 w-11 flex-shrink-0 rounded-xl bg-purple-50 flex items-center justify-center">
                              <Sparkles size={21} className="text-purple-600" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Career Goal
                              </p>

                              <p
                                title={student?.careerGoal || "Not provided"}
                                className="mt-1 text-sm font-semibold text-slate-700 line-clamp-2"
                              >
                                {student?.careerGoal || "Not provided"}
                              </p>
                            </div>
                          </div>

                          {/* =================================================
                              VIEW PROFILE BUTTON
                          ================================================== */}

                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/mentor/students/${student?._id}`)
                            }
                            className="w-full xl:w-[190px] xl:flex-shrink-0 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98]"
                          >
                            <span>View Profile</span>

                            <ArrowRight
                              size={19}
                              className="transition-transform duration-200 group-hover:translate-x-1"
                            />
                          </button>
                        </div>

                        {/* =================================================
                            SESSION STATISTICS
                        ================================================== */}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Completed */}

                          <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                              <CheckCircle2
                                size={21}
                                className="text-emerald-600"
                              />
                            </div>

                            <div>
                              <p className="text-xs font-medium text-emerald-600">
                                Completed Sessions
                              </p>

                              <p className="mt-1 text-xl font-bold text-emerald-700">
                                {stats?.completedSessions ?? 0}
                              </p>
                            </div>
                          </div>

                          {/* Upcoming */}

                          <div className="flex items-center gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                              <Clock3 size={21} className="text-indigo-600" />
                            </div>

                            <div>
                              <p className="text-xs font-medium text-indigo-600">
                                Upcoming Sessions
                              </p>

                              <p className="mt-1 text-xl font-bold text-indigo-700">
                                {stats?.upcomingSessions ?? 0}
                              </p>
                            </div>
                          </div>

                          {/* Total */}

                          <div className="flex items-center gap-4 rounded-2xl border border-purple-100 bg-purple-50/70 p-4">
                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                              <CalendarDays
                                size={21}
                                className="text-purple-600"
                              />
                            </div>

                            <div>
                              <p className="text-xs font-medium text-purple-600">
                                Total Sessions
                              </p>

                              <p className="mt-1 text-xl font-bold text-purple-700">
                                {stats?.totalSessions ?? 0}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* =================================================
                            BOTTOM DETAILS
                        ================================================== */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-slate-100 pt-6">
                          {/* Last Session */}

                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 flex-shrink-0 rounded-xl bg-cyan-50 flex items-center justify-center">
                              <CalendarCheck2
                                size={20}
                                className="text-cyan-600"
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs text-slate-400">
                                Last Session
                              </p>

                              <p className="mt-1 text-sm font-semibold text-slate-700 truncate">
                                {formatDate(item?.lastSession?.date)}
                              </p>
                            </div>
                          </div>

                          {/* Session Type */}

                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 flex-shrink-0 rounded-xl bg-indigo-50 flex items-center justify-center">
                              <Video size={20} className="text-indigo-600" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs text-slate-400">
                                Session Type
                              </p>

                              <p className="mt-1 text-sm font-semibold text-slate-700 truncate">
                                {item?.lastSession?.sessionType ||
                                  "No session yet"}
                              </p>
                            </div>
                          </div>

                          {/* Last Status */}

                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 flex-shrink-0 rounded-xl bg-emerald-50 flex items-center justify-center">
                              <CircleCheck
                                size={20}
                                className="text-emerald-600"
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs text-slate-400">
                                Last Status
                              </p>

                              <p className="mt-1 text-sm font-semibold text-slate-700 truncate">
                                {item?.lastSession?.status || "No session yet"}
                              </p>
                            </div>
                          </div>

                          {/* Mentoring Activity */}

                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 flex-shrink-0 rounded-xl bg-purple-50 flex items-center justify-center">
                              <CalendarDays
                                size={20}
                                className="text-purple-600"
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs text-slate-400">
                                Mentoring Activity
                              </p>

                              <p className="mt-1 text-sm font-semibold text-slate-700 truncate">
                                {stats?.totalSessions ?? 0}{" "}
                                {stats?.totalSessions === 1
                                  ? "session"
                                  : "sessions"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default MentorStudents;
