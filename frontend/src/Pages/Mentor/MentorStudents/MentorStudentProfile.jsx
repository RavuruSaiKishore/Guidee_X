import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  GraduationCap,
  Target,
  CalendarDays,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  FileText,
  Save,
  Loader2,
  Star,
  BookOpen,
  Plus,
  Trash2,
} from "lucide-react";

import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MentorStudentProfile = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();

  // =========================================================
  // STATE
  // =========================================================

  const [student, setStudent] = useState(null);

  const [sessions, setSessions] = useState([]);

  const [reviews, setReviews] = useState([]);

  const [notes, setNotes] = useState([]);

  const [goals, setGoals] = useState([]);

  // Backend statistics
  const [statistics, setStatistics] = useState({
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    cancelledSessions: 0,
  });

  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("overview");

  // =========================================================
  // NOTES
  // =========================================================

  const [newNote, setNewNote] = useState("");

  const [savingNote, setSavingNote] = useState(false);

  // =========================================================
  // GOALS
  // =========================================================

  const [showGoalForm, setShowGoalForm] = useState(false);

  const [goalTitle, setGoalTitle] = useState("");

  const [goalDescription, setGoalDescription] = useState("");

  const [goalProgress, setGoalProgress] = useState(0);

  const [savingGoal, setSavingGoal] = useState(false);

  // =========================================================
  // FETCH STUDENT PROFILE
  // =========================================================

  useEffect(() => {
    if (studentId) {
      fetchStudentProfile();
    }
  }, [studentId]);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("MentorToken");

      if (!token) {
        toast.error("Mentor authentication token not found.");
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}/api/mentorStudent/students/${studentId}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to fetch student profile.");
      }

      setStudent(data.student || null);

      setSessions(
        Array.isArray(data.sessionHistory) ? data.sessionHistory : []
      );

      setReviews(Array.isArray(data.reviews) ? data.reviews : []);

      setNotes(Array.isArray(data.notes) ? data.notes : []);

      setGoals(Array.isArray(data.goals) ? data.goals : []);

      setStatistics({
        totalSessions: Number(data.statistics?.totalSessions || 0),

        completedSessions: Number(data.statistics?.completedSessions || 0),

        upcomingSessions: Number(data.statistics?.upcomingSessions || 0),

        cancelledSessions: Number(data.statistics?.cancelledSessions || 0),
      });
    } catch (error) {
      console.error("FETCH STUDENT PROFILE ERROR:", error);

      toast.error(error.message || "Failed to load student profile.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FORMAT PROFILE IMAGE URL
  // =========================================================

  const getProfileImageUrl = (image) => {
    if (!image || typeof image !== "string") {
      return null;
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${API_BASE_URL}/${image}`.replace(/([^:]\/)\/+/g, "$1");
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
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

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (time) => {
    if (!time) {
      return "Not available";
    }

    return time;
  };

  // =========================================================
  // SESSION STATUS STYLE
  // =========================================================

  const getSessionStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";

      case "Confirmed":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "Cancelled":
        return "border-red-200 bg-red-50 text-red-700";

      case "Rejected":
        return "border-slate-200 bg-slate-100 text-slate-600";

      case "Rescheduled":
        return "border-purple-200 bg-purple-50 text-purple-700";

      default:
        return "border-amber-200 bg-amber-50 text-amber-700";
    }
  };

  // =========================================================
  // SAVE PRIVATE NOTE
  // =========================================================

  const handleSaveNote = async () => {
    if (!newNote.trim()) {
      toast.error("Please enter a note.");
      return;
    }

    try {
      setSavingNote(true);

      const token = localStorage.getItem("MentorToken");

      if (!token) {
        toast.error("Mentor authentication token not found.");
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}/api/mentorStudent/students/${studentId}/notes`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            note: newNote.trim(),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to save note.");
      }

      toast.success("Private mentor note saved.");

      if (data.note) {
        setNotes((previous) => [data.note, ...previous]);
      }

      setNewNote("");
    } catch (error) {
      console.error("SAVE NOTE ERROR:", error);

      toast.error(error.message || "Failed to save private note.");
    } finally {
      setSavingNote(false);
    }
  };

  // =========================================================
  // DELETE NOTE
  // =========================================================

  const handleDeleteNote = async (noteId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("MentorToken");

      if (!token) {
        toast.error("Mentor authentication token not found.");
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}/api/mentorStudent/students/${studentId}/notes/${noteId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to delete note.");
      }

      toast.success("Note deleted.");

      setNotes((previous) => previous.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error("DELETE NOTE ERROR:", error);

      toast.error(error.message || "Failed to delete note.");
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div
        className="min-h-screen bg-slate-50 pt-16 sm:pt-20 lg:ml-64 lg:pt-0 text-slate-900"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-2 sm:px-5">
          <div className="relative">
            <div className="h-14 w-14 rounded-full border-4 border-slate-200" />
            <div className="absolute inset-0 h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
          </div>
          <p
            className="mt-5 text-center text-xs font-semibold tracking-tight"
            style={{ fontWeight: 600 }}
          >
            Loading student profile...
          </p>
          <p
            className="mt-1 text-center text-[11px] text-slate-400 font-medium"
            style={{ fontWeight: 600 }}
          >
            Please wait while we fetch the student details.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // STUDENT NOT FOUND
  // =========================================================

  if (!student) {
    return (
      <div
        className="min-h-screen bg-slate-50 pt-16 sm:pt-20 lg:ml-64 lg:pt-0 text-slate-900 flex items-center justify-center px-4"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="text-center bg-white p-8 rounded-3xl border border-slate-200 shadow-xs max-w-sm w-full">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
            <UserRound size={26} />
          </div>
          <h2
            className="text-base font-semibold text-slate-900 tracking-tight"
            style={{ fontWeight: 600 }}
          >
            Student not found
          </h2>

          <button
            onClick={() => navigate("/mentor/students")}
            className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-black hover:bg-slate-800 px-5 py-2.5 text-xs font-semibold text-white transition shadow-xs"
            style={{ fontWeight: 600 }}
          >
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  const profileImageUrl = getProfileImageUrl(student.profileImage);

  return (
    <div
      className="min-h-screen bg-slate-50 pt-16 sm:pt-20 lg:ml-64 lg:pt-0 text-slate-900 pb-16"
      style={{ fontFamily: "'Poppins', sans-serif", fontStyle: "normal" }}
    >
      <main className="w-full max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8 space-y-4 sm:space-y-6">
        {/* =====================================================
            BACK BUTTON
        ====================================================== */}
        <button
          onClick={() => navigate("/mentor/students")}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold text-xs transition"
          style={{ fontWeight: 600 }}
        >
          <ArrowLeft size={15} />
          Back to My Students
        </button>

        {/* =====================================================
            PROFILE HEADER
        ====================================================== */}
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs overflow-hidden w-full">
          <div className="h-28 sm:h-36 bg-gradient-to-r from-black via-slate-900 to-blue-950 relative">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-600/20 blur-3xl" />
          </div>

          <div className="px-4 sm:px-8 pb-6 sm:pb-8 w-full">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 -mt-12 sm:-mt-14 w-full">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-5 w-full">
                {/* PROFILE IMAGE */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl bg-white p-1.5 shadow-md border border-slate-200 shrink-0">
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl}
                      alt={student.firstName || "Student"}
                      className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl sm:rounded-2xl bg-black flex items-center justify-center text-white">
                      <UserRound size={36} className="text-blue-400" />
                    </div>
                  )}
                </div>

                <div className="pb-1 min-w-0 flex-1">
                  <h1
                    className="text-lg sm:text-2xl font-semibold text-slate-900 tracking-tight truncate"
                    style={{ fontWeight: 600 }}
                  >
                    {student.firstName} {student.lastName}
                  </h1>

                  <p
                    className="text-[11px] sm:text-xs text-slate-500 font-medium truncate mt-0.5"
                    style={{ fontWeight: 600 }}
                  >
                    {student.email}
                  </p>

                  {student.careerGoal && (
                    <div
                      className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-blue-600"
                      style={{ fontWeight: 600 }}
                    >
                      <Target size={14} className="shrink-0" />
                      <span className="truncate">{student.careerGoal}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* =================================================
                QUICK STATS
            ================================================== */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mt-6 sm:mt-8 w-full text-xs font-semibold">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shrink-0">
                    <BookOpen size={18} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-[9px] sm:text-[10px] uppercase tracking-wide text-slate-400"
                      style={{ fontWeight: 600 }}
                    >
                      Total Sessions
                    </p>
                    <p
                      className="text-sm sm:text-base font-semibold text-slate-900 mt-0.5"
                      style={{ fontWeight: 600 }}
                    >
                      {statistics.totalSessions}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-[9px] sm:text-[10px] uppercase tracking-wide text-slate-400"
                      style={{ fontWeight: 600 }}
                    >
                      Completed
                    </p>
                    <p
                      className="text-sm sm:text-base font-semibold text-emerald-600 mt-0.5"
                      style={{ fontWeight: 600 }}
                    >
                      {statistics.completedSessions}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shrink-0">
                    <CalendarDays size={18} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-[9px] sm:text-[10px] uppercase tracking-wide text-slate-400"
                      style={{ fontWeight: 600 }}
                    >
                      Upcoming
                    </p>
                    <p
                      className="text-sm sm:text-base font-semibold text-blue-600 mt-0.5"
                      style={{ fontWeight: 600 }}
                    >
                      {statistics.upcomingSessions}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-purple-600 shrink-0">
                    <TrendingUp size={18} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-[9px] sm:text-[10px] uppercase tracking-wide text-slate-400"
                      style={{ fontWeight: 600 }}
                    >
                      Goals
                    </p>
                    <p
                      className="text-sm sm:text-base font-semibold text-slate-900 mt-0.5"
                      style={{ fontWeight: 600 }}
                    >
                      {goals.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            TABS
        ====================================================== */}
        <div className="bg-white border border-slate-200 rounded-2xl p-1.5 sm:p-2 flex gap-1.5 sm:gap-2 overflow-x-auto w-full shadow-xs">
          {[
            {
              id: "overview",
              label: "Overview",
              icon: UserRound,
            },
            {
              id: "sessions",
              label: "Session History",
              icon: CalendarDays,
            },
            {
              id: "notes",
              label: "Private Notes",
              icon: FileText,
            },
            {
              id: "goals",
              label: "Goals & Progress",
              icon: Target,
            },
            {
              id: "feedback",
              label: "Feedback",
              icon: Star,
            },
          ].map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? "bg-black text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
                style={{ fontWeight: 600 }}
              >
                <Icon
                  size={15}
                  className={
                    activeTab === tab.id ? "text-blue-400" : "text-slate-400"
                  }
                />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* =====================================================
            OVERVIEW
        ====================================================== */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 w-full">
            {/* PERSONAL DETAILS */}
            <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs w-full space-y-5">
              <h2
                className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight"
                style={{ fontWeight: 600 }}
              >
                Student Overview
              </h2>

              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 shrink-0">
                      <Mail size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400"
                        style={{ fontWeight: 600 }}
                      >
                        Email
                      </p>
                      <p
                        className="font-semibold text-slate-800 truncate mt-0.5"
                        style={{ fontWeight: 600 }}
                      >
                        {student.email || "Not available"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 shrink-0">
                      <Phone size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400"
                        style={{ fontWeight: 600 }}
                      >
                        Phone
                      </p>
                      <p
                        className="font-semibold text-slate-800 truncate mt-0.5"
                        style={{ fontWeight: 600 }}
                      >
                        {student.phone || "Not available"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 shrink-0">
                      <GraduationCap size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400"
                        style={{ fontWeight: 600 }}
                      >
                        Education
                      </p>
                      <p
                        className="font-semibold text-slate-800 truncate mt-0.5"
                        style={{ fontWeight: 600 }}
                      >
                        {student.education || "Not available"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 shrink-0">
                      <Target size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400"
                        style={{ fontWeight: 600 }}
                      >
                        Career Goal
                      </p>
                      <p
                        className="font-semibold text-slate-800 truncate mt-0.5"
                        style={{ fontWeight: 600 }}
                      >
                        {student.careerGoal || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SKILLS */}
              <div className="pt-2">
                <h3
                  className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5"
                  style={{ fontWeight: 600 }}
                >
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(student.skills) &&
                  student.skills.length > 0 ? (
                    student.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
                        style={{ fontWeight: 600 }}
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 font-medium">
                      No skills added.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs w-full space-y-4">
              <h2
                className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight"
                style={{ fontWeight: 600 }}
              >
                Recent Activity
              </h2>

              {sessions.length > 0 ? (
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shrink-0">
                      <CalendarDays size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[10px] uppercase tracking-wide text-slate-400"
                        style={{ fontWeight: 600 }}
                      >
                        Last Session
                      </p>
                      <p
                        className="text-xs font-semibold text-slate-900 mt-0.5 truncate"
                        style={{ fontWeight: 600 }}
                      >
                        {formatDate(sessions[0].sessionDate)}
                      </p>
                    </div>
                  </div>

                  <p
                    className="text-xs text-slate-600 font-medium truncate"
                    style={{ fontWeight: 600 }}
                  >
                    Type:{" "}
                    <strong className="text-slate-900">
                      {sessions[0].sessionType || "Session"}
                    </strong>
                  </p>

                  {sessions[0].bookingStatus && (
                    <span
                      className={`inline-flex px-3 py-1 rounded-full border text-[11px] font-semibold ${getSessionStatusStyle(
                        sessions[0].bookingStatus
                      )}`}
                      style={{ fontWeight: 600 }}
                    >
                      {sessions[0].bookingStatus}
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-medium">
                  No sessions yet.
                </p>
              )}
            </div>
          </div>
        )}

        {/* =====================================================
            SESSION HISTORY
        ====================================================== */}
        {activeTab === "sessions" && (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-xs w-full">
            <div className="p-4 sm:p-6 border-b border-slate-100">
              <h2
                className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight"
                style={{ fontWeight: 600 }}
              >
                Session History
              </h2>
              <p
                className="text-xs text-slate-500 font-medium mt-0.5"
                style={{ fontWeight: 600 }}
              >
                All mentoring sessions with this student.
              </p>
            </div>

            {sessions.length === 0 ? (
              <div className="p-12 text-center">
                <CalendarDays
                  size={40}
                  className="mx-auto text-slate-300 mb-3"
                />
                <p className="text-xs text-slate-500 font-medium">
                  No sessions found.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {sessions.map((session) => (
                  <div
                    key={session._id}
                    className="p-4 sm:p-6 hover:bg-slate-50 transition space-y-3.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600 shrink-0">
                          <CalendarDays size={18} />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-xs font-semibold text-slate-900 truncate"
                            style={{ fontWeight: 600 }}
                          >
                            {formatDate(session.sessionDate)}
                          </p>
                          <p
                            className="text-[11px] text-slate-500 font-medium truncate mt-0.5"
                            style={{ fontWeight: 600 }}
                          >
                            {formatTime(session.startTime)} -{" "}
                            {formatTime(session.endTime)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700"
                          style={{ fontWeight: 600 }}
                        >
                          {session.sessionType || "Session"}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full border text-[11px] font-semibold ${getSessionStatusStyle(
                            session.bookingStatus
                          )}`}
                          style={{ fontWeight: 600 }}
                        >
                          {session.bookingStatus || "Pending"}
                        </span>
                      </div>
                    </div>

                    {session.notes && (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold space-y-1">
                        <div className="flex items-center gap-1.5 text-blue-600">
                          <MessageSquare size={14} />
                          <span
                            className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold"
                            style={{ fontWeight: 600 }}
                          >
                            Session Notes
                          </span>
                        </div>
                        <p
                          className="text-slate-700 font-medium pl-5"
                          style={{ fontWeight: 600 }}
                        >
                          {session.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =====================================================
            PRIVATE NOTES
        ====================================================== */}
        {activeTab === "notes" && (
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 w-full">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600 shrink-0">
                  <FileText size={18} />
                </div>
                <div className="min-w-0">
                  <h2
                    className="text-xs sm:text-sm font-semibold text-slate-900 tracking-tight truncate"
                    style={{ fontWeight: 600 }}
                  >
                    Private Mentor Note
                  </h2>
                  <p
                    className="text-[10px] text-slate-400 font-medium truncate"
                    style={{ fontWeight: 600 }}
                  >
                    Only you can see these notes.
                  </p>
                </div>
              </div>

              <textarea
                rows={5}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write your private notes about this student..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                style={{ fontWeight: 600 }}
              />

              <button
                onClick={handleSaveNote}
                disabled={savingNote}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-black hover:bg-slate-800 px-5 py-2.5 text-xs font-semibold text-white transition disabled:opacity-50 shadow-xs"
                style={{ fontWeight: 600 }}
              >
                {savingNote ? (
                  <>
                    <Loader2 size={15} className="animate-spin text-blue-400" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={15} className="text-blue-400" />
                    Save Private Note
                  </>
                )}
              </button>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-slate-100">
                <h2
                  className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight"
                  style={{ fontWeight: 600 }}
                >
                  Your Notes
                </h2>
              </div>

              {notes.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-xs text-slate-500 font-medium">
                    No private notes yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {notes.map((note) => (
                    <div
                      key={note._id}
                      className="p-4 sm:p-6 flex items-start justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs text-slate-700 whitespace-pre-wrap font-medium"
                          style={{ fontWeight: 600 }}
                        >
                          {note.note}
                        </p>
                        <p
                          className="text-[10px] text-slate-400 font-medium mt-2"
                          style={{ fontWeight: 600 }}
                        >
                          {formatDate(note.createdAt)}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 border border-red-200 shrink-0 transition"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================
            GOALS & PROGRESS
        ====================================================== */}
        {activeTab === "goals" && (
          <div className="space-y-4 sm:space-y-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2
                  className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight"
                  style={{ fontWeight: 600 }}
                >
                  Goals & Progress
                </h2>
                <p
                  className="text-xs text-slate-500 font-medium mt-0.5"
                  style={{ fontWeight: 600 }}
                >
                  Track this student's career development.
                </p>
              </div>

              <button
                onClick={() => setShowGoalForm(!showGoalForm)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-black hover:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white transition shadow-xs"
                style={{ fontWeight: 600 }}
              >
                <Plus size={15} className="text-blue-400" />
                Add Goal
              </button>
            </div>

            {showGoalForm && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowGoalForm(false);
                }}
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4"
              >
                <h3
                  className="text-xs sm:text-sm font-semibold text-slate-900"
                  style={{ fontWeight: 600 }}
                >
                  Create New Goal
                </h3>

                <div className="space-y-3.5 text-xs font-semibold">
                  <input
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    placeholder="Goal title"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    style={{ fontWeight: 600 }}
                  />

                  <textarea
                    rows={3}
                    value={goalDescription}
                    onChange={(e) => setGoalDescription(e.target.value)}
                    placeholder="Describe the student's goal..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-slate-800 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    style={{ fontWeight: 600 }}
                  />

                  <div>
                    <label
                      className="text-xs font-semibold text-slate-700 block mb-1.5"
                      style={{ fontWeight: 600 }}
                    >
                      Progress: {goalProgress}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={goalProgress}
                      onChange={(e) => setGoalProgress(e.target.value)}
                      className="w-full accent-blue-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowGoalForm(false)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    style={{ fontWeight: 600 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingGoal}
                    className="rounded-xl bg-black hover:bg-slate-800 px-5 py-2.5 text-xs font-semibold text-white shadow-xs disabled:opacity-50"
                    style={{ fontWeight: 600 }}
                  >
                    {savingGoal ? "Saving..." : "Create Goal"}
                  </button>
                </div>
              </form>
            )}

            {goals.length === 0 ? (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
                <Target size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-xs text-slate-500 font-medium">
                  No goals created yet.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {goals.map((goal) => (
                  <div
                    key={goal._id}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600 shrink-0">
                        <Target size={18} />
                      </div>
                      <span
                        className="text-sm font-bold text-blue-600"
                        style={{ fontWeight: 600 }}
                      >
                        {goal.progress || 0}%
                      </span>
                    </div>

                    <h3
                      className="text-xs sm:text-sm font-semibold text-slate-900 tracking-tight"
                      style={{ fontWeight: 600 }}
                    >
                      {goal.title}
                    </h3>

                    <p
                      className="text-xs text-slate-500 font-medium"
                      style={{ fontWeight: 600 }}
                    >
                      {goal.description || "No description provided."}
                    </p>

                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{
                          width: `${goal.progress || 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =====================================================
            FEEDBACK
        ====================================================== */}
        {activeTab === "feedback" && (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-xs w-full">
            <div className="p-4 sm:p-6 border-b border-slate-100">
              <h2
                className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight"
                style={{ fontWeight: 600 }}
              >
                Feedback & Reviews
              </h2>
              <p
                className="text-xs text-slate-500 font-medium mt-0.5"
                style={{ fontWeight: 600 }}
              >
                Feedback received from this student.
              </p>
            </div>

            {reviews.length === 0 ? (
              <div className="p-12 text-center">
                <Star size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-xs text-slate-500 font-medium">
                  No feedback received yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {reviews.map((review) => (
                  <div key={review._id} className="p-4 sm:p-6 space-y-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={15}
                          className={
                            star <= review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          }
                        />
                      ))}
                    </div>

                    <p
                      className="text-xs text-slate-700 font-medium"
                      style={{ fontWeight: 600 }}
                    >
                      {review.comment ||
                        review.review ||
                        "No written feedback."}
                      
                    </p>

                    <p
                      className="text-[10px] text-slate-400 font-medium"
                      style={{ fontWeight: 600 }}
                    >
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MentorStudentProfile;
