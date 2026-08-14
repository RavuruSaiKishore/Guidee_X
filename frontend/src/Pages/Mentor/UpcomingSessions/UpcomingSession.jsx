import { useEffect, useState } from "react";
import {
  CalendarDays,
  ExternalLink,
  Search,
  Clock3,
  UserRound,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TodaySession = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  // =========================================================
  // FETCH TODAY'S SESSIONS
  // =========================================================

  const fetchTodaySessions = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("MentorToken");

      if (!token) {
        throw new Error("Mentor authentication token not found");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/booking/today-sessions`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch today's sessions");
      }

      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Error fetching today's sessions:", error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    fetchTodaySessions();
  }, []);

  // =========================================================
  // CURRENT TIME UPDATE
  // =========================================================

  useEffect(() => {
    setCurrentTime(new Date());

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // =========================================================
  // FILTER SESSIONS
  // =========================================================

  const filteredSessions = sessions.filter((session) => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return true;

    const studentName = `${session.student?.firstName || ""} ${
      session.student?.lastName || ""
    }`.toLowerCase();

    const email = session.student?.email?.toLowerCase() || "";

    const sessionType = session.sessionType?.toLowerCase() || "";

    return (
      studentName.includes(search) ||
      email.includes(search) ||
      sessionType.includes(search)
    );
  });

  // =========================================================
  // CALCULATE END TIME
  // =========================================================

  const calculateEndTime = (startTime, duration) => {
    if (!startTime || !duration) return "--";

    try {
      const [time, period] = startTime.trim().split(" ");

      let [hours, minutes] = time.split(":").map(Number);

      if (period?.toLowerCase() === "pm" && hours !== 12) {
        hours += 12;
      }

      if (period?.toLowerCase() === "am" && hours === 12) {
        hours = 0;
      }

      const date = new Date();

      date.setHours(hours, minutes, 0, 0);

      date.setMinutes(date.getMinutes() + Number(duration));

      let endHours = date.getHours();

      const endMinutes = date.getMinutes();

      const endPeriod = endHours >= 12 ? "PM" : "AM";

      endHours = endHours % 12;

      if (endHours === 0) {
        endHours = 12;
      }

      return `${endHours}:${endMinutes
        .toString()
        .padStart(2, "0")} ${endPeriod}`;
    } catch (error) {
      console.error("End time calculation error:", error);

      return "--";
    }
  };

  // =========================================================
  // GET MEETING TIMES
  // =========================================================

  const getMeetingTimes = (session) => {
    try {
      const meetingStart = new Date(session.sessionDate);

      let [startTime, startPeriod] = session.startTime.split(" ");

      let [startHour, startMinute] = startTime.split(":").map(Number);

      startPeriod = startPeriod.toLowerCase();

      if (startPeriod === "pm" && startHour !== 12) {
        startHour += 12;
      }

      if (startPeriod === "am" && startHour === 12) {
        startHour = 0;
      }

      meetingStart.setHours(startHour, startMinute, 0, 0);

      const meetingEnd = new Date(meetingStart);

      meetingEnd.setMinutes(
        meetingEnd.getMinutes() + Number(session.duration || 0)
      );

      const joinTime = new Date(
        meetingStart.getTime() - 10 * 60 * 1000
      );

      return {
        meetingStart,
        meetingEnd,
        joinTime,
      };
    } catch (error) {
      console.error("Meeting time calculation error:", error);

      return {
        meetingStart: new Date(),
        meetingEnd: new Date(),
        joinTime: new Date(),
      };
    }
  };

  // =========================================================
  // FORMAT COUNTDOWN
  // =========================================================

  const formatCountdown = (seconds) => {
    const safeSeconds = Math.max(0, Math.floor(seconds));

    const hrs = Math.floor(safeSeconds / 3600);

    const mins = Math.floor((safeSeconds % 3600) / 60);

    const secs = safeSeconds % 60;

    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // =========================================================
  // PROFILE IMAGE
  // =========================================================

  const getProfileImageUrl = (image) => {
    if (!image || typeof image !== "string") {
      return null;
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${API_BASE_URL}/${image}`.replace(
      /([^:]\/)\/+/g,
      "$1"
    );
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
            Loading today's sessions...
          </p>

          <p
            className="mt-1 text-center text-[11px] text-slate-400 font-medium"
            style={{ fontWeight: 600 }}
          >
            Please wait a moment
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div
      className="min-h-screen bg-slate-50 pt-16 sm:pt-20 lg:ml-64 lg:pt-0 text-slate-900 pb-16"
      style={{ fontFamily: "'Poppins', sans-serif", fontStyle: "normal" }}
    >
      <main className="w-full max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8 space-y-4 sm:space-y-6">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-black p-4 sm:p-8 text-white shadow-md w-full">
          {/* Background Accents */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Title */}
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 min-w-0">
              <div
                className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur shadow-inner text-blue-400"
                style={{ fontWeight: 600 }}
              >
                <CalendarDays size={22} className="sm:w-[26px] sm:h-[26px]" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-blue-300 backdrop-blur"
                    style={{ fontWeight: 600 }}
                  >
                    <Sparkles size={12} className="text-blue-400" />
                    Mentor Schedule
                  </span>
                </div>

                <h1
                  className="mt-1.5 sm:mt-2 text-xl sm:text-3xl font-semibold tracking-tight text-white"
                  style={{ fontWeight: 600 }}
                >
                  Today's Sessions
                </h1>

                <p
                  className="mt-0.5 sm:mt-1 text-[11px] sm:text-sm text-slate-300 font-medium leading-relaxed"
                  style={{ fontWeight: 600 }}
                >
                  Manage all your scheduled mentorship sessions, track countdowns, and join live rooms instantly.
                </p>
              </div>
            </div>

            {/* Session Count */}
            <div
              className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 sm:px-5 py-3.5 sm:py-4 backdrop-blur shadow-inner shrink-0"
              style={{ fontWeight: 600 }}
            >
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-white text-sm sm:text-base font-semibold text-black shadow-xs">
                {sessions.length}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Total Active
                </p>
                <h3 className="text-xs sm:text-sm font-semibold text-white">Scheduled Sessions</h3>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SEARCH
        ====================================================== */}
        <section className="space-y-3 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs w-full">
            {/* Search Input */}
            <div className="relative min-w-0 flex-1 w-full">
              <Search
                size={16}
                className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search by student name, email or session type..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                style={{ fontWeight: 600 }}
              />
            </div>

            {/* Search Result */}
            <div
              className="flex h-11 w-full lg:w-64 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-700 shrink-0"
              style={{ fontWeight: 600 }}
            >
              <span className="text-slate-500 uppercase tracking-wide text-[10px]">
                Matching Sessions
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-black text-white text-xs">
                {filteredSessions.length}
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {filteredSessions.length === 0 ? (
          <section className="flex min-h-[350px] w-full flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-4 py-12 text-center shadow-xs">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3 sm:mb-4">
              <CalendarDays size={24} />
            </div>

            <h2
              className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight"
              style={{ fontWeight: 600 }}
            >
              {searchTerm ? "No Matching Sessions" : "No Sessions Today"}
            </h2>

            <p
              className="mt-1 max-w-sm text-center text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed"
              style={{ fontWeight: 600 }}
            >
              {searchTerm
                ? "Try searching with another student name, email, or session type."
                : "You don't have any confirmed sessions scheduled for today."}
            </p>
          </section>
        ) : (
          /* =====================================================
             SESSION LIST
          ====================================================== */

          <div className="w-full space-y-4">
            {filteredSessions.map((session, index) => {
              const { meetingEnd, joinTime } = getMeetingTimes(session);

              const canJoin =
                currentTime >= joinTime && currentTime < meetingEnd;

              const meetingExpired = currentTime >= meetingEnd;

              const secondsUntilJoin = Math.max(
                0,
                Math.floor((joinTime.getTime() - currentTime.getTime()) / 1000)
              );

              const profileImage = getProfileImageUrl(
                session.student?.profileImage
              );

              return (
                <article
                  key={session._id}
                  className="w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-xs transition duration-200 hover:border-blue-300 hover:shadow-md p-3.5 sm:p-6"
                >
                  <div className="w-full space-y-3.5 sm:space-y-5">
                    {/* TOP: STUDENT DETAILS */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-3.5 sm:pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-100 shadow-2xs">
                          {profileImage ? (
                            <img
                              src={profileImage}
                              alt={`${session.student?.firstName || ""} ${
                                session.student?.lastName || ""
                              }`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-black text-white text-xs font-semibold">
                              <UserRound size={16} className="text-blue-400 sm:w-[18px] sm:h-[18px]" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h2
                            className="text-xs sm:text-sm font-semibold text-slate-900 truncate tracking-tight"
                            style={{ fontWeight: 600 }}
                          >
                            {session.student?.firstName}{" "}
                            {session.student?.lastName}
                          </h2>

                          <p
                            className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate"
                            style={{ fontWeight: 600 }}
                          >
                            {session.student?.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span
                          className="rounded-full bg-slate-100 px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-slate-700 border border-slate-200"
                          style={{ fontWeight: 600 }}
                        >
                          #{index + 1} Session
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-[10px] sm:text-[11px] font-semibold border ${
                            session.bookingStatus === "Confirmed"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : session.bookingStatus === "Completed"
                              ? "border-blue-200 bg-blue-50 text-blue-700"
                              : "border-amber-200 bg-amber-50 text-amber-700"
                          }`}
                          style={{ fontWeight: 600 }}
                        >
                          {session.bookingStatus}
                        </span>

                        {session.paymentStatus && (
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] sm:text-[11px] font-semibold border ${
                              session.paymentStatus === "Paid"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-red-200 bg-red-50 text-red-700"
                            }`}
                            style={{ fontWeight: 600 }}
                          >
                            {session.paymentStatus}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* MIDDLE: METRICS GRID */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 bg-slate-50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 text-xs font-semibold w-full">
                      <div>
                        <p
                          className="text-[9px] sm:text-[10px] uppercase tracking-wide text-slate-400"
                          style={{ fontWeight: 600 }}
                        >
                          Session Type
                        </p>
                        <p
                          className="mt-1 text-xs sm:text-sm text-slate-900 truncate"
                          style={{ fontWeight: 600 }}
                        >
                          {session.sessionType || "--"}
                        </p>
                      </div>

                      <div>
                        <p
                          className="text-[9px] sm:text-[10px] uppercase tracking-wide text-slate-400"
                          style={{ fontWeight: 600 }}
                        >
                          Scheduled Time
                        </p>
                        <p
                          className="mt-1 text-xs sm:text-sm text-slate-900 truncate"
                          style={{ fontWeight: 600 }}
                        >
                          {session.startTime || "--"} -{" "}
                          {session.endTime ||
                            calculateEndTime(
                              session.startTime,
                              session.duration
                            )}
                        </p>
                      </div>

                      <div>
                        <p
                          className="text-[9px] sm:text-[10px] uppercase tracking-wide text-slate-400"
                          style={{ fontWeight: 600 }}
                        >
                          Duration
                        </p>
                        <p
                          className="mt-1 text-xs sm:text-sm text-slate-900"
                          style={{ fontWeight: 600 }}
                        >
                          {session.duration || 0} mins
                        </p>
                      </div>

                      <div>
                        <p
                          className="text-[9px] sm:text-[10px] uppercase tracking-wide text-slate-400"
                          style={{ fontWeight: 600 }}
                        >
                          Earnings
                        </p>
                        <p
                          className="mt-1 text-xs sm:text-base font-bold text-emerald-600"
                          style={{ fontWeight: 600 }}
                        >
                          ₹{session.amount || 0}
                        </p>
                      </div>
                    </div>

                    {/* BOTTOM: ACTIONS */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pt-1">
                      <div
                        className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 font-semibold"
                        style={{ fontWeight: 600 }}
                      >
                        <Clock3 size={13} className="text-blue-600 shrink-0 sm:w-4 sm:h-4" />
                        <span className="truncate">Room access opens 10 minutes prior to session start</span>
                      </div>

                      <div className="w-full sm:w-auto sm:min-w-[200px]">
                        {session.bookingStatus === "Completed" ? (
                          <button
                            disabled
                            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-500"
                            style={{ fontWeight: 600 }}
                          >
                            <Clock3 size={15} />
                            Session Completed
                          </button>
                        ) : meetingExpired ? (
                          <button
                            disabled
                            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600"
                            style={{ fontWeight: 600 }}
                          >
                            <Clock3 size={15} />
                            Meeting Ended
                          </button>
                        ) : canJoin ? (
                          <button
                            onClick={() => {
                              if (session.roomId) {
                                navigate(`/meeting/${session.roomId}`);
                              }
                            }}
                            disabled={!session.roomId}
                            className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition ${
                              session.roomId
                                ? "bg-black hover:bg-slate-800"
                                : "cursor-not-allowed bg-slate-400"
                            }`}
                            style={{ fontWeight: 600 }}
                          >
                            <ExternalLink size={15} className="text-blue-400" />
                            {session.roomId ? "Join Live Room" : "Meeting Preparing"}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-black px-5 py-2.5 text-xs font-semibold text-white shadow-sm"
                            style={{ fontWeight: 600 }}
                          >
                            <Clock3 size={15} className="animate-pulse text-blue-400" />
                            <span>Join in</span>
                            <span className="font-mono font-bold tracking-wider text-blue-300">
                              {formatCountdown(secondsUntilJoin)}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default TodaySession;