import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

import { ToastContainer, toast } from "react-toastify";
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

      console.log("MENTOR STUDENT PROFILE:", data);

      if (!res.ok) {
        throw new Error(data.message || "Unable to fetch student profile.");
      }

      // =====================================================
      // STUDENT
      // Backend:
      // data.student
      // =====================================================

      setStudent(data.student || null);

      // =====================================================
      // SESSION HISTORY
      // Backend:
      // data.sessionHistory
      //
      // IMPORTANT:
      // Previously frontend was using data.sessions
      // but backend sends data.sessionHistory
      // =====================================================

      setSessions(
        Array.isArray(data.sessionHistory) ? data.sessionHistory : []
      );

      // =====================================================
      // REVIEWS
      // Backend:
      // data.reviews
      // =====================================================

      setReviews(Array.isArray(data.reviews) ? data.reviews : []);

      // =====================================================
      // NOTES
      // Backend:
      // data.notes
      // =====================================================

      setNotes(Array.isArray(data.notes) ? data.notes : []);

      // =====================================================
      // GOALS
      //
      // Your current response does not contain goals.
      // This safely supports goals if backend sends them.
      // =====================================================

      setGoals(Array.isArray(data.goals) ? data.goals : []);

      // =====================================================
      // STATISTICS
      //
      // Backend:
      //
      // statistics: {
      //   cancelledSessions: 0,
      //   completedSessions: 0,
      //   totalSessions: 1,
      //   upcomingSessions: 1
      // }
      //
      // We directly use backend statistics.
      // =====================================================

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
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "Confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      case "Rejected":
        return "bg-slate-100 text-slate-600 border-slate-200";

      case "Rescheduled":
        return "bg-purple-50 text-purple-700 border-purple-200";

      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
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
      <div className="lg:ml-64 min-h-screen bg-slate-50 pt-16 lg:pt-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto">
            <Loader2 size={32} className="animate-spin text-indigo-600" />
          </div>

          <p className="mt-5 font-semibold text-slate-700">
            Loading student profile...
          </p>

          <p className="text-sm text-slate-400 mt-1">
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
      <div className="lg:ml-64 min-h-screen bg-slate-50 pt-16 lg:pt-0 flex items-center justify-center">
        <div className="text-center">
          <UserRound size={60} className="mx-auto text-slate-300" />

          <h2 className="text-2xl font-bold text-slate-800 mt-5">
            Student not found
          </h2>

          <button
            onClick={() => navigate("/mentor/students")}
            className="mt-6 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold"
          >
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="lg:ml-64 min-h-screen bg-slate-50 pt-16 lg:pt-0">
        <ToastContainer position="top-right" autoClose={2500} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          {/* =====================================================
              BACK BUTTON
          ====================================================== */}

          <button
            onClick={() => navigate("/mentor/students")}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold mb-6 transition"
          >
            <ArrowLeft size={19} />
            Back to My Students
          </button>

          {/* =====================================================
              PROFILE HEADER
          ====================================================== */}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700" />

            <div className="px-5 sm:px-8 pb-8">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 -mt-14">
                <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                  {/* PROFILE IMAGE */}

                  <div className="w-28 h-28 rounded-3xl bg-white p-2 shadow-xl">
                    {student.profileImage ? (
                      <img
                        src={
                          student.profileImage.startsWith("http")
                            ? student.profileImage
                            : `${API_BASE_URL}${student.profileImage}`
                        }
                        alt={student.firstName || "Student"}
                        className="w-full h-full object-cover rounded-2xl"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full rounded-2xl bg-indigo-100 flex items-center justify-center">
                        <UserRound size={42} className="text-indigo-600" />
                      </div>
                    )}
                  </div>

                  <div className="pb-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                      {student.firstName} {student.lastName}
                    </h1>

                    <p className="text-slate-500 mt-1">{student.email}</p>

                    {student.careerGoal && (
                      <div className="flex items-center gap-2 mt-3 text-indigo-600 font-semibold">
                        <Target size={17} />

                        {student.careerGoal}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* =================================================
                  QUICK STATS
              ================================================== */}

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                {/* TOTAL SESSIONS */}

                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                      <BookOpen size={20} className="text-indigo-600" />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Total Sessions</p>

                      <p className="text-xl font-bold text-slate-800">
                        {statistics.totalSessions}
                      </p>
                    </div>
                  </div>
                </div>

                {/* COMPLETED SESSIONS */}

                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 size={20} className="text-emerald-600" />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Completed</p>

                      <p className="text-xl font-bold text-slate-800">
                        {statistics.completedSessions}
                      </p>
                    </div>
                  </div>
                </div>

                {/* UPCOMING SESSIONS */}

                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <CalendarDays size={20} className="text-blue-600" />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Upcoming</p>

                      <p className="text-xl font-bold text-slate-800">
                        {statistics.upcomingSessions}
                      </p>
                    </div>
                  </div>
                </div>

                {/* GOALS */}

                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <TrendingUp size={20} className="text-purple-600" />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Goals</p>

                      <p className="text-xl font-bold text-slate-800">
                        {goals.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              TABS
          ====================================================== */}

          <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-2 flex gap-2 overflow-x-auto">
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
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={17} />

                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* =====================================================
              OVERVIEW
          ====================================================== */}

          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-3 gap-6 mt-6">
              {/* PERSONAL DETAILS */}

              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Student Overview
                </h2>

                <div className="grid sm:grid-cols-2 gap-5 mt-6">
                  {/* EMAIL */}

                  <div className="p-4 rounded-2xl bg-slate-50">
                    <div className="flex items-center gap-3">
                      <Mail size={19} className="text-indigo-600" />

                      <div>
                        <p className="text-xs text-slate-400">Email</p>

                        <p className="font-semibold text-slate-700">
                          {student.email || "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PHONE */}

                  <div className="p-4 rounded-2xl bg-slate-50">
                    <div className="flex items-center gap-3">
                      <Phone size={19} className="text-indigo-600" />

                      <div>
                        <p className="text-xs text-slate-400">Phone</p>

                        <p className="font-semibold text-slate-700">
                          {student.phone || "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* EDUCATION */}

                  <div className="p-4 rounded-2xl bg-slate-50">
                    <div className="flex items-center gap-3">
                      <GraduationCap size={19} className="text-indigo-600" />

                      <div>
                        <p className="text-xs text-slate-400">Education</p>

                        <p className="font-semibold text-slate-700">
                          {student.education || "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CAREER GOAL */}

                  <div className="p-4 rounded-2xl bg-slate-50">
                    <div className="flex items-center gap-3">
                      <Target size={19} className="text-indigo-600" />

                      <div>
                        <p className="text-xs text-slate-400">Career Goal</p>

                        <p className="font-semibold text-slate-700">
                          {student.careerGoal || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SKILLS */}

                <div className="mt-7">
                  <h3 className="font-bold text-slate-800">Skills</h3>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {Array.isArray(student.skills) &&
                    student.skills.length > 0 ? (
                      student.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-semibold"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">No skills added.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* RECENT ACTIVITY */}

              <div className="bg-white rounded-3xl border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Recent Activity
                </h2>

                {sessions.length > 0 ? (
                  <div className="mt-6">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                      <CalendarDays className="text-indigo-600" size={22} />
                    </div>

                    <p className="text-xs text-slate-400 mt-5">Last Session</p>

                    <p className="font-bold text-slate-800 mt-1">
                      {formatDate(sessions[0].sessionDate)}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      {sessions[0].sessionType || "Session"}
                    </p>

                    {sessions[0].bookingStatus && (
                      <span
                        className={`inline-flex mt-3 px-3 py-1.5 rounded-lg border text-xs font-semibold ${getSessionStatusStyle(
                          sessions[0].bookingStatus
                        )}`}
                      >
                        {sessions[0].bookingStatus}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 mt-6">
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
            <div className="mt-6 bg-white rounded-3xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">
                  Session History
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  All mentoring sessions with this student.
                </p>
              </div>

              {sessions.length === 0 ? (
                <div className="p-12 text-center">
                  <CalendarDays size={50} className="mx-auto text-slate-300" />

                  <p className="mt-4 text-slate-500">No sessions found.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {sessions.map((session) => (
                    <div
                      key={session._id}
                      className="p-6 hover:bg-slate-50 transition"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                        <div>
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center">
                              <CalendarDays
                                size={20}
                                className="text-indigo-600"
                              />
                            </div>

                            <div>
                              <p className="font-bold text-slate-800">
                                {formatDate(session.sessionDate)}
                              </p>

                              <p className="text-sm text-slate-500">
                                {formatTime(session.startTime)} -{" "}
                                {formatTime(session.endTime)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <span className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold">
                            {session.sessionType || "Session"}
                          </span>

                          <span
                            className={`px-3 py-2 rounded-xl border text-sm font-semibold ${getSessionStatusStyle(
                              session.bookingStatus
                            )}`}
                          >
                            {session.bookingStatus || "Pending"}
                          </span>
                        </div>
                      </div>

                      {session.notes && (
                        <div className="mt-5 p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                          <div className="flex items-center gap-2">
                            <MessageSquare
                              size={17}
                              className="text-indigo-600"
                            />

                            <span className="text-xs font-bold text-indigo-700 uppercase">
                              Session Notes
                            </span>
                          </div>

                          <p className="text-sm text-slate-700 mt-2">
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
            <div className="grid lg:grid-cols-3 gap-6 mt-6">
              {/* ADD NOTE */}

              <div className="bg-white rounded-3xl border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
                    <FileText size={21} className="text-amber-600" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Private Mentor Note
                    </h2>

                    <p className="text-xs text-slate-400">
                      Only you can see these notes.
                    </p>
                  </div>
                </div>

                <textarea
                  rows={7}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write your private notes about this student..."
                  className="w-full mt-5 px-4 py-3 rounded-2xl border border-slate-200 resize-none outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  onClick={handleSaveNote}
                  disabled={savingNote}
                  className="w-full mt-4 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:opacity-60"
                >
                  {savingNote ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Private Note
                    </>
                  )}
                </button>
              </div>

              {/* NOTES LIST */}

              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900">
                    Your Notes
                  </h2>
                </div>

                {notes.length === 0 ? (
                  <div className="p-12 text-center">
                    <FileText size={50} className="mx-auto text-slate-300" />

                    <p className="text-slate-500 mt-4">No private notes yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {notes.map((note) => (
                      <div key={note._id} className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-slate-700 whitespace-pre-wrap">
                              {note.note}
                            </p>

                            <p className="text-xs text-slate-400 mt-3">
                              {formatDate(note.createdAt)}
                            </p>
                          </div>

                          <button
                            onClick={() => handleDeleteNote(note._id)}
                            className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
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
            <div className="mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Goals & Progress
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Track this student's career development.
                  </p>
                </div>

                <button
                  onClick={() => setShowGoalForm(!showGoalForm)}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                >
                  <Plus size={18} />
                  Add Goal
                </button>
              </div>

              {/* GOAL FORM */}

              {showGoalForm && (
                <form
                  onSubmit={handleCreateGoal}
                  className="bg-white rounded-3xl border border-slate-200 p-6 mb-6"
                >
                  <h3 className="text-lg font-bold text-slate-900">
                    Create New Goal
                  </h3>

                  <div className="grid gap-4 mt-5">
                    <input
                      value={goalTitle}
                      onChange={(e) => setGoalTitle(e.target.value)}
                      placeholder="Goal title"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <textarea
                      rows={4}
                      value={goalDescription}
                      onChange={(e) => setGoalDescription(e.target.value)}
                      placeholder="Describe the student's goal..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none resize-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <div>
                      <label className="text-sm font-semibold text-slate-700">
                        Progress: {goalProgress}%
                      </label>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goalProgress}
                        onChange={(e) => setGoalProgress(e.target.value)}
                        className="w-full mt-3"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-5">
                    <button
                      type="button"
                      onClick={() => setShowGoalForm(false)}
                      className="px-5 py-3 rounded-xl border border-slate-200 font-semibold"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={savingGoal}
                      className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-60"
                    >
                      {savingGoal ? "Saving..." : "Create Goal"}
                    </button>
                  </div>
                </form>
              )}

              {/* GOALS */}

              {goals.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                  <Target size={55} className="mx-auto text-slate-300" />

                  <p className="text-slate-500 mt-4">No goals created yet.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {goals.map((goal) => (
                    <div
                      key={goal._id}
                      className="bg-white rounded-3xl border border-slate-200 p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center">
                          <Target size={21} className="text-indigo-600" />
                        </div>

                        <span className="text-lg font-bold text-indigo-600">
                          {goal.progress || 0}%
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mt-5">
                        {goal.title}
                      </h3>

                      <p className="text-sm text-slate-500 mt-2">
                        {goal.description || "No description provided."}
                      </p>

                      <div className="mt-5">
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full transition-all"
                            style={{
                              width: `${goal.progress || 0}%`,
                            }}
                          />
                        </div>
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
            <div className="mt-6 bg-white rounded-3xl border border-slate-200">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">
                  Feedback & Reviews
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Feedback received from this student.
                </p>
              </div>

              {reviews.length === 0 ? (
                <div className="p-12 text-center">
                  <Star size={50} className="mx-auto text-slate-300" />

                  <p className="text-slate-500 mt-4">
                    No feedback received yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {reviews.map((review) => (
                    <div key={review._id} className="p-6">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={18}
                            className={
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-slate-300"
                            }
                          />
                        ))}
                      </div>

                      <p className="text-slate-700 mt-4">
                        {review.comment ||
                          review.review ||
                          "No written feedback."}
                      </p>

                      <p className="text-xs text-slate-400 mt-4">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default MentorStudentProfile;
