import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  CalendarDays,
  ExternalLink,
  Search,
  Clock3,
  X,
  AlertCircle,
} from "lucide-react";

const UpcomingSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const [currentTime, setCurrentTime] = useState(new Date());

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();

  // =========================================================
  // FETCH UPCOMING SESSIONS
  // =========================================================

  const fetchUpcomingSessions = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("MentorToken");

      if (!token) {
        throw new Error("Mentor authentication token not found");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/booking/upcomingsessions`,
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
        throw new Error(data.message || "Failed to fetch upcoming sessions");
      }

      if (data.success) {
        setSessions(data.sessions || []);
      } else {
        setSessions([]);
      }
    } catch (error) {
      console.error("Error fetching upcoming sessions:", error);

      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    fetchUpcomingSessions();
  }, []);

  // =========================================================
  // CURRENT TIME
  // =========================================================

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // =========================================================
  // CANCEL BOOKING
  // =========================================================

  const cancelBooking = async () => {
    if (!selectedBookingId) {
      toast.error("Booking not selected.");
      return;
    }

    if (!cancelReason.trim()) {
      toast.error("Please enter a cancellation reason.");
      return;
    }

    try {
      const token = localStorage.getItem("MentorToken");

      const response = await fetch(
        `${API_BASE_URL}/api/mentor/reject/${selectedBookingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: cancelReason.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel booking.");
      }

      if (data.success) {
        toast.success("Booking cancelled successfully.");

        setShowCancelModal(false);
        setCancelReason("");
        setSelectedBookingId(null);

        await fetchUpcomingSessions();
      } else {
        toast.error(data.message || "Failed to cancel booking.");
      }
    } catch (error) {
      console.error("Cancel booking error:", error);

      toast.error(error.message || "Something went wrong.");
    }
  };

  // =========================================================
  // FILTER SESSIONS
  // =========================================================

  const filteredSessions = sessions.filter((session) => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return true;

    const studentName = `${session.student?.firstName || ""} ${
      session.student?.lastName || ""
    }`.toLowerCase();

    const studentEmail = session.student?.email?.toLowerCase() || "";

    const sessionType = session.sessionType?.toLowerCase() || "";

    return (
      studentName.includes(search) ||
      studentEmail.includes(search) ||
      sessionType.includes(search)
    );
  });

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

      // Prefer backend endTime when available
      if (session.endTime) {
        let [endTime, endPeriod] = session.endTime.split(" ");

        let [endHour, endMinute] = endTime.split(":").map(Number);

        endPeriod = endPeriod.toLowerCase();

        if (endPeriod === "pm" && endHour !== 12) {
          endHour += 12;
        }

        if (endPeriod === "am" && endHour === 12) {
          endHour = 0;
        }

        meetingEnd.setHours(endHour, endMinute, 0, 0);
      } else {
        meetingEnd.setMinutes(
          meetingEnd.getMinutes() + Number(session.duration || 0)
        );
      }

      // Allow joining 10 minutes before session
      const joinTime = new Date(meetingStart.getTime() - 10 * 60 * 1000);

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
    const hrs = Math.floor(seconds / 3600);

    const mins = Math.floor((seconds % 3600) / 60);

    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // =========================================================
  // PROFILE IMAGE URL
  // =========================================================

  const getProfileImageUrl = (image) => {
    if (!image || typeof image !== "string") {
      return "https://ui-avatars.com/api/?name=Student";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${API_BASE_URL}/${image}`.replace(/([^:]\/)\/+/g, "$1");
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 lg:ml-64 lg:pt-0">
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-5">
          <div className="relative">
            <div className="h-14 w-14 rounded-full border-4 border-blue-100" />

            <div className="absolute inset-0 h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
          </div>

          <p className="mt-5 text-center font-medium text-gray-700">
            Loading your Upcoming Sessions...
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
    <div className="min-h-screen bg-gray-50 pt-20 lg:ml-64 lg:pt-0">
      <main className="w-full p-3 sm:p-5 lg:p-6 xl:p-8">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <section className="mb-6 w-full sm:mb-8">
          <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-5 text-white shadow-xl sm:rounded-3xl sm:p-7 lg:p-9">
            {/* Decorative Background */}

            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl sm:h-44 sm:w-44" />

            <div className="absolute -bottom-14 -left-14 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl sm:h-56 sm:w-56" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Header Left */}

              <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/20 shadow-xl backdrop-blur-lg sm:h-16 sm:w-16 sm:rounded-2xl">
                  <CalendarDays
                    size={26}
                    className="text-yellow-300 sm:h-[34px] sm:w-[34px]"
                  />
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                    Upcoming Sessions
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                    Stay organized and manage all your scheduled mentorship
                    sessions.
                  </p>
                </div>
              </div>

              {/* Header Count */}

              <div className="w-full sm:w-auto">
                <div className="w-full rounded-2xl border border-white/20 bg-white/15 px-5 py-4 shadow-xl backdrop-blur-lg sm:min-w-[220px] sm:px-6">
                  <p className="text-xs uppercase tracking-widest text-blue-100">
                    Upcoming
                  </p>

                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400 text-xl font-bold text-blue-900 sm:h-14 sm:w-14 sm:text-2xl">
                      {filteredSessions.length}
                    </div>

                    <span className="text-lg font-semibold sm:text-xl">
                      Sessions
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SEARCH
        ====================================================== */}

        <section className="mb-6 w-full sm:mb-8">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-700 sm:text-base">
              Search Sessions
            </h3>

            <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
              Search by student name, email or session type to quickly find an
              upcoming session.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 lg:flex-row">
            {/* Search Input */}

            <div className="relative min-w-0 flex-1">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search by student or session type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-14 w-full rounded-xl border border-gray-200 bg-white pl-12 pr-4 text-sm shadow-sm outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:h-16 sm:rounded-2xl sm:text-base"
              />
            </div>

            {/* Result Count */}

            <div className="flex h-14 w-full items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 shadow-sm sm:h-16 sm:px-5 lg:w-[260px] lg:shrink-0">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Search Results
                </p>

                <p className="text-xs text-gray-600 sm:text-sm">
                  Matching sessions
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                {filteredSessions.length}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {filteredSessions.length === 0 ? (
          <section className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-5 py-14 text-center shadow-sm sm:rounded-3xl sm:px-10 sm:py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 sm:h-20 sm:w-20">
              <CalendarDays className="h-8 w-8 text-blue-400 sm:h-10 sm:w-10" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-gray-700 sm:text-2xl">
              {searchTerm ? "No Matching Sessions" : "No Upcoming Sessions"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
              {searchTerm
                ? "Try searching with another student name, email, or session type."
                : "You don't have any scheduled sessions at the moment."}
            </p>
          </section>
        ) : (
          /* =====================================================
             SESSION LIST
          ====================================================== */

          <div className="w-full space-y-5">
            {filteredSessions.map((session) => {
              const { meetingEnd, joinTime } = getMeetingTimes(session);

              const canJoin =
                currentTime >= joinTime && currentTime < meetingEnd;

              const meetingExpired = currentTime >= meetingEnd;

              const secondsUntilJoin = Math.max(
                0,
                Math.floor((joinTime.getTime() - currentTime.getTime()) / 1000)
              );

              return (
                <article
                  key={session._id}
                  className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg sm:rounded-3xl"
                >
                  {/* Top Accent */}

                  <div className="h-1 bg-blue-500" />

                  <div className="p-4 sm:p-6 lg:p-7 xl:p-8">
                    {/* =================================================
                        STUDENT + FEE
                    ================================================== */}

                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      {/* Student */}

                      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                        <img
                          src={getProfileImageUrl(
                            session.student?.profileImage
                          )}
                          alt={`${session.student?.firstName || "Student"} ${
                            session.student?.lastName || ""
                          }`}
                          className="h-14 w-14 shrink-0 rounded-full border-4 border-green-100 object-cover sm:h-16 sm:w-16"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://ui-avatars.com/api/?name=Student";
                          }}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="break-words text-base font-bold text-gray-800 sm:text-lg">
                              {session.student?.firstName}{" "}
                              {session.student?.lastName}
                            </h2>

                            {/* Booking Status */}

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                session.bookingStatus === "Confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : session.bookingStatus === "Pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : session.bookingStatus === "Completed"
                                  ? "bg-blue-100 text-blue-700"
                                  : session.bookingStatus === "Cancelled" ||
                                    session.bookingStatus === "Rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {session.bookingStatus}
                            </span>

                            {/* Payment Status */}

                            {session.paymentStatus && (
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  session.paymentStatus === "Paid"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {session.paymentStatus}
                              </span>
                            )}
                          </div>

                          <p className="mt-1 break-all text-xs text-gray-500 sm:text-sm">
                            {session.student?.email}
                          </p>

                          <div className="mt-2 inline-flex max-w-full rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 sm:text-sm">
                            <span className="truncate">
                              {session.sessionType}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Session Fee */}

                      <div className="rounded-xl bg-green-50 px-4 py-3 xl:min-w-[150px] xl:bg-transparent xl:px-0 xl:py-0 xl:text-right">
                        <p className="text-xs text-gray-500">Session Fee</p>

                        <h2 className="text-xl font-bold text-green-600 sm:text-2xl">
                          ₹{session.amount || 0}
                        </h2>
                      </div>
                    </div>

                    {/* =================================================
                        SESSION DETAILS
                    ================================================== */}

                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {/* Date */}

                      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
                        <p className="text-[11px] uppercase tracking-wide text-gray-500">
                          Session Date
                        </p>

                        <h3 className="mt-1 text-sm font-semibold text-gray-800 sm:text-base">
                          {session.sessionDate
                            ? new Date(session.sessionDate).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "--"}
                        </h3>
                      </div>

                      {/* Time */}

                      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
                        <p className="text-[11px] uppercase tracking-wide text-gray-500">
                          Time
                        </p>

                        <h3 className="mt-1 text-sm font-semibold text-gray-800 sm:text-base">
                          {session.startTime || "--"}
                        </h3>

                        <p className="text-sm text-gray-500">
                          to {session.endTime || "--"}
                        </p>
                      </div>

                      {/* Duration */}

                      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
                        <p className="text-[11px] uppercase tracking-wide text-gray-500">
                          Duration
                        </p>

                        <h3 className="mt-1 text-sm font-semibold text-gray-800 sm:text-base">
                          {session.duration || 0} mins
                        </h3>
                      </div>

                      {/* Booked On */}

                      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
                        <p className="text-[11px] uppercase tracking-wide text-gray-500">
                          Booked On
                        </p>

                        <h3 className="mt-1 text-sm font-semibold text-gray-800 sm:text-base">
                          {session.createdAt
                            ? new Date(session.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "--"}
                        </h3>
                      </div>
                    </div>

                    {/* =================================================
                        NOTES
                    ================================================== */}

                    {session.notes && (
                      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
                        <p className="text-sm font-semibold text-gray-700">
                          Notes
                        </p>

                        <p className="mt-1 break-words text-sm leading-6 text-gray-600">
                          {session.notes}
                        </p>
                      </div>
                    )}

                    {/* =================================================
                        MEETING ACTION
                    ================================================== */}

                    <div className="mt-5 rounded-2xl border border-gray-200 bg-gradient-to-r from-slate-50 to-gray-100 p-4 sm:p-5">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        {/* Status */}

                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Meeting Status
                          </p>

                          {canJoin ? (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="h-3 w-3 animate-pulse rounded-full bg-green-500" />

                              <span className="text-sm font-semibold text-green-700 sm:text-base">
                                Live • You can join now
                              </span>
                            </div>
                          ) : meetingExpired ? (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="h-3 w-3 rounded-full bg-gray-500" />

                              <span className="text-sm font-semibold text-gray-600 sm:text-base">
                                Session Completed
                              </span>
                            </div>
                          ) : (
                            <div className="mt-2">
                              <div className="flex items-center gap-2">
                                <span className="h-3 w-3 animate-pulse rounded-full bg-orange-500" />

                                <span className="text-sm font-semibold text-orange-700 sm:text-base">
                                  Meeting starts soon
                                </span>
                              </div>

                              <div className="mt-2 inline-flex rounded-xl bg-orange-100 px-3 py-2 font-mono text-base font-bold text-orange-700 sm:px-4 sm:text-lg">
                                {formatCountdown(secondsUntilJoin)}
                              </div>

                              <p className="mt-2 max-w-lg text-xs leading-5 text-gray-500">
                                Join button will be enabled 10 minutes before
                                the session starts.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Buttons */}

                        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                          {session.meetingLink && (
                            <>
                              {canJoin ? (
                                <button
                                  onClick={() =>
                                    navigate(`/meeting/${session.roomId}`)
                                  }
                                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-green-700 active:scale-[0.98] sm:w-auto sm:px-6"
                                >
                                  <ExternalLink size={18} />
                                  Join Meeting
                                </button>
                              ) : meetingExpired ? (
                                <button
                                  disabled
                                  className="w-full cursor-not-allowed rounded-xl bg-gray-400 px-5 py-3 font-semibold text-white sm:w-auto sm:px-6"
                                >
                                  Meeting Ended
                                </button>
                              ) : (
                                <button
                                  disabled
                                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-300 px-5 py-3 font-semibold text-white sm:w-auto sm:px-6"
                                >
                                  <Clock3 size={18} />
                                  Join Locked
                                </button>
                              )}
                            </>
                          )}

                          <button
                            onClick={() => {
                              setSelectedBookingId(session._id);

                              setCancelReason("");

                              setShowCancelModal(true);
                            }}
                            className="w-full rounded-xl bg-red-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-red-700 active:scale-[0.98] sm:w-auto sm:px-6"
                          >
                            Cancel Booking
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* =====================================================
          CANCEL MODAL
      ====================================================== */}

      {showCancelModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-5">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6">
            {/* Modal Header */}

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <AlertCircle size={22} />
                </div>

                <h2 className="mt-4 text-xl font-bold text-gray-800 sm:text-2xl">
                  Cancel Booking
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Please provide a reason for cancelling this booking.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                  setSelectedBookingId(null);
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Textarea */}

            <textarea
              rows={5}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter cancellation reason..."
              className="mt-5 w-full resize-none rounded-xl border border-gray-200 p-3 text-sm text-gray-700 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100 sm:p-4"
            />

            {/* Actions */}

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                  setSelectedBookingId(null);
                }}
                className="w-full rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:w-auto"
              >
                Close
              </button>

              <button
                onClick={cancelBooking}
                disabled={!cancelReason.trim()}
                className="w-full rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingSessions;
