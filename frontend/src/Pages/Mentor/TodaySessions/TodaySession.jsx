import { useEffect, useState } from "react";
import {
  CalendarDays,
  ExternalLink,
  Search,
  Clock3,
  UserRound,
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
  // TIMER RUNS BACKWARDS EVERY SECOND
  // =========================================================

  useEffect(() => {
    // Update immediately
    setCurrentTime(new Date());

    // Update every second
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

      // Mentor can join 10 minutes before session
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
      <div className="min-h-screen bg-slate-50 pt-20 lg:ml-64 lg:pt-8">
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-5">
          <div className="relative">
            <div className="h-14 w-14 rounded-full border-4 border-blue-100" />

            <div className="absolute inset-0 h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
          </div>

          <p className="mt-5 text-center font-medium text-gray-700">
            Loading today's sessions...
          </p>

          <p className="mt-1 text-center text-sm text-gray-400">
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
    <div className="min-h-screen bg-slate-50 pt-20 lg:ml-64 lg:pt-0">
      <main className="w-full p-3 sm:p-5 lg:p-6 xl:p-8">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <section className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-stone-800 via-amber-700 to-yellow-600 p-5 text-white shadow-xl sm:mb-8 sm:rounded-3xl sm:p-7 lg:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            {/* Title */}

            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 sm:h-14 sm:w-14 sm:rounded-2xl">
                <CalendarDays
                  size={24}
                  className="sm:h-7 sm:w-7"
                />
              </div>

              <div className="min-w-0">
                <h1 className="text-xl font-bold sm:text-2xl lg:text-3xl">
                  Today's Sessions
                </h1>

                <p className="mt-1 text-xs text-white/75 sm:text-sm lg:text-base">
                  Manage all your scheduled mentorship sessions.
                </p>
              </div>
            </div>

            {/* Session Count */}

            <div className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 sm:h-20 sm:w-24 sm:flex-col sm:gap-0 sm:px-0">
              <span className="text-2xl font-bold sm:text-3xl">
                {sessions.length}
              </span>

              <span className="text-xs text-white/75 sm:text-sm">
                Sessions
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            SEARCH
        ====================================================== */}

        <section className="mb-6 sm:mb-8">

          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-700 sm:text-base">
              Search Today's Sessions
            </h3>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Search by student name, email or session type.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row">

            {/* Search Input */}

            <div className="relative h-14 flex-1 sm:h-16">

              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search by name, email or session type..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="h-full w-full rounded-xl border border-gray-200 bg-white pl-12 pr-4 text-sm text-gray-700 shadow-sm outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 sm:rounded-2xl sm:text-base"
              />
            </div>

            {/* Search Result */}

            <div className="flex h-14 w-full items-center justify-between rounded-xl border border-orange-200 bg-orange-50 px-4 shadow-sm sm:h-16 sm:rounded-2xl sm:px-6 lg:w-64">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                  Search Results
                </p>

                <p className="text-xs text-gray-600 sm:text-sm">
                  matching sessions
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white sm:h-10 sm:w-10 sm:text-lg">
                {filteredSessions.length}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {filteredSessions.length === 0 ? (

          <section className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm sm:rounded-3xl sm:py-24">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 sm:h-20 sm:w-20">
              <CalendarDays size={32} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-800 sm:mt-6 sm:text-2xl">
              {searchTerm
                ? "No Matching Sessions"
                : "No Sessions Today"}
            </h2>

            <p className="mt-2 max-w-md text-center text-sm text-slate-500 sm:text-base">
              {searchTerm
                ? "Try searching with another student name, email, or session type."
                : "You don't have any confirmed sessions scheduled for today."}
            </p>
          </section>

        ) : (

          /* =====================================================
             SESSION LIST
          ====================================================== */

          <div className="space-y-4 sm:space-y-5">

            {filteredSessions.map((session, index) => {

              const {
                meetingEnd,
                joinTime,
              } = getMeetingTimes(session);

              // ================================================
              // LIVE TIMER CALCULATION
              // This recalculates every second because
              // currentTime changes every second.
              // ================================================

              const canJoin =
                currentTime >= joinTime &&
                currentTime < meetingEnd;

              const meetingExpired =
                currentTime >= meetingEnd;

              const secondsUntilJoin = Math.max(
                0,
                Math.floor(
                  (joinTime.getTime() -
                    currentTime.getTime()) /
                    1000
                )
              );

              const profileImage =
                getProfileImageUrl(
                  session.student?.profileImage
                );

              return (
                <article
                  key={session._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg sm:rounded-3xl"
                >
                  {/* Top Accent */}

                  <div className="h-1 bg-green-500" />

                  <div className="p-4 sm:p-6 lg:p-7">
                    {/* =================================================
                        STUDENT
                    ================================================== */}
                    <div className="flex min-w-0 items-center gap-3 sm:gap-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-blue-100 bg-slate-100 shadow-sm sm:h-16 sm:w-16">
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
                          <div className="flex h-full w-full items-center justify-center">
                            <UserRound size={25} className="text-blue-500" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="truncate text-base font-bold text-slate-800 sm:text-xl">
                          {session.student?.firstName}{" "}
                          {session.student?.lastName}
                        </h2>

                        <p className="truncate text-xs text-slate-500 sm:text-sm">
                          {session.student?.email}
                        </p>

                        <div className="mt-2 inline-flex max-w-full items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          #{index + 1} Today's Session
                        </div>
                      </div>
                    </div>
                    {/* =================================================
                        SESSION DETAILS
                    ================================================== */}
                    <div className="mt-6 grid grid-cols-2 gap-4 border-y border-slate-100 py-5 sm:gap-5 md:grid-cols-4 md:border-y-0 md:py-0">
                      {/* Session */}

                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">
                          Session
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-slate-800 sm:text-base">
                          {session.sessionType || "--"}
                        </p>
                      </div>

                      {/* Time */}

                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">
                          Time
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800 sm:text-base">
                          {session.startTime || "--"}
                        </p>

                        <p className="text-xs text-slate-500 sm:text-sm">
                          to{" "}
                          {session.endTime ||
                            calculateEndTime(
                              session.startTime,
                              session.duration
                            )}
                        </p>
                      </div>

                      {/* Duration */}

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">
                          Duration
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800 sm:text-base">
                          {session.duration || 0} mins
                        </p>
                      </div>

                      {/* Earnings */}

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">
                          Earnings
                        </p>

                        <p className="mt-1 text-lg font-bold text-emerald-600 sm:text-xl">
                          ₹{session.amount || 0}
                        </p>
                      </div>
                    </div>
                    {/* =================================================
                        BOTTOM ACTION
                    ================================================== */}
                    <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      {/* STATUS */}

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`w-fit rounded-full px-4 py-2 text-xs font-semibold sm:text-sm ${
                            session.bookingStatus === "Confirmed"
                              ? "bg-green-100 text-green-700"
                              : session.bookingStatus === "Completed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {session.bookingStatus}
                        </span>

                        {/* PAYMENT STATUS */}

                        {session.paymentStatus && (
                          <span
                            className={`w-fit rounded-full px-4 py-2 text-xs font-semibold ${
                              session.paymentStatus === "Paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {session.paymentStatus}
                          </span>
                        )}
                      </div>

                      {/* ACTION */}

                      <div className="w-full sm:w-auto sm:min-w-[240px]">
                        {/* SESSION IS COMPLETED */}

                        {session.bookingStatus === "Completed" ? (
                          <button
                            disabled
                            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-blue-100 px-5 py-3 text-sm font-semibold text-blue-700 sm:text-base"
                          >
                            <Clock3 size={18} />
                            Session Completed
                          </button>
                        ) : meetingExpired ? (
                          /* MEETING ENDED */

                          <button
                            disabled
                            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-gray-400 px-5 py-3 text-sm font-semibold text-white sm:text-base"
                          >
                            <Clock3 size={18} />
                            Meeting Ended
                          </button>
                        ) : canJoin ? (
                          /* JOIN WINDOW OPEN */

                          <button
                            onClick={() => {
                              if (session.roomId) {
                                navigate(`/meeting/${session.roomId}`);
                              }
                            }}
                            disabled={!session.roomId}
                            className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition active:scale-[0.98] sm:text-base ${
                              session.roomId
                                ? "bg-green-600 hover:bg-green-700"
                                : "cursor-not-allowed bg-slate-400"
                            }`}
                          >
                            <ExternalLink size={18} />

                            {session.roomId
                              ? "Join Meeting"
                              : "Meeting Preparing"}
                          </button>
                        ) : (
                          /* COUNTDOWN */

                          <button
                            disabled
                            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm sm:text-base"
                          >
                            <Clock3 size={18} className="animate-pulse" />

                            <span>Join in</span>

                            <span className="font-mono font-bold tracking-wider">
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
