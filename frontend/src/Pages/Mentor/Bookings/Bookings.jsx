import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarCheck2,
  Search,
  ExternalLink,
  FileText,
  X,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

const ConfirmedSessions = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const [currentTime, setCurrentTime] = useState(new Date());

  // ==================================================
  // FETCH CONFIRMED SESSIONS
  // ==================================================

  const fetchConfirmedSessions = async () => {
    try {
      const token = localStorage.getItem("MentorToken");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/booking/confirmed-sessions`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch confirmed sessions");
      }

      if (data.success) {
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error("Error fetching confirmed sessions:", error);

      toast.error(error.message || "Failed to load confirmed sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfirmedSessions();
  }, []);

  // ==================================================
  // CURRENT TIME
  // ==================================================

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ==================================================
  // CANCEL BOOKING
  // ==================================================

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

      if (data.success) {
        toast.success("Booking cancelled successfully.");

        setShowCancelModal(false);
        setCancelReason("");
        setSelectedBookingId(null);

        await fetchConfirmedSessions();
      } else {
        toast.error(data.message || "Failed to cancel booking.");
      }
    } catch (error) {
      console.error("Cancel booking error:", error);

      toast.error("Something went wrong.");
    }
  };

  // ==================================================
  // SEARCH
  // ==================================================

  const filteredSessions = sessions.filter((session) => {
    const studentName = `
      ${session.student?.firstName || ""}
      ${session.student?.lastName || ""}
    `.toLowerCase();

    const sessionType = (session.sessionType || "").toLowerCase();

    const email = (session.student?.email || "").toLowerCase();

    const search = searchTerm.toLowerCase().trim();

    return (
      studentName.includes(search) ||
      sessionType.includes(search) ||
      email.includes(search)
    );
  });

  // ==================================================
  // MEETING TIMES
  // ==================================================

  const getMeetingTimes = (session) => {
    const meetingStart = new Date(session.sessionDate);

    if (!session.startTime || !session.endTime) {
      return {
        meetingStart,
        meetingEnd: meetingStart,
        joinTime: meetingStart,
      };
    }

    // START TIME

    let [startTime, startPeriod] = session.startTime.split(" ");

    let [startHour, startMinute] = startTime.split(":").map(Number);

    startPeriod = startPeriod?.toLowerCase();

    if (startPeriod === "pm" && startHour !== 12) {
      startHour += 12;
    }

    if (startPeriod === "am" && startHour === 12) {
      startHour = 0;
    }

    meetingStart.setHours(startHour, startMinute, 0, 0);

    // END TIME

    const meetingEnd = new Date(session.sessionDate);

    let [endTime, endPeriod] = session.endTime.split(" ");

    let [endHour, endMinute] = endTime.split(":").map(Number);

    endPeriod = endPeriod?.toLowerCase();

    if (endPeriod === "pm" && endHour !== 12) {
      endHour += 12;
    }

    if (endPeriod === "am" && endHour === 12) {
      endHour = 0;
    }

    meetingEnd.setHours(endHour, endMinute, 0, 0);

    // JOIN 10 MINUTES BEFORE

    const joinTime = new Date(meetingStart.getTime() - 10 * 60 * 1000);

    return {
      meetingStart,
      meetingEnd,
      joinTime,
    };
  };

  // ==================================================
  // COUNTDOWN
  // ==================================================

  const formatCountdown = (seconds) => {
    const hrs = Math.floor(seconds / 3600);

    const mins = Math.floor((seconds % 3600) / 60);

    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // ==================================================
  // PROFILE IMAGE URL
  // ==================================================

  const getProfileImage = (image) => {
    if (!image) {
      return "https://ui-avatars.com/api/?name=Student&background=10b981&color=fff";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${API_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 pt-16 lg:ml-64 lg:pt-0">
        <div className="flex flex-col items-center">
          <div className="relative h-14 w-14">
            <div className="h-14 w-14 rounded-full border-4 border-emerald-100" />

            <div className="absolute inset-0 h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-emerald-600" />
          </div>

          <p className="mt-5 text-center font-medium text-gray-700">
            Loading your Bookings...
          </p>

          <p className="mt-1 text-sm text-gray-400">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ==================================================
          PAGE CONTENT

          Mobile:
          pt-20 -> space for mobile navbar

          Desktop:
          ml-64 -> space for fixed sidebar
      ================================================== */}

      <main className="min-h-screen w-full min-w-0 overflow-x-hidden bg-gray-50 px-3 pb-8 pt-20 sm:px-5 sm:pb-10 sm:pt-20 lg:ml-64 lg:w-[calc(100%-16rem)] lg:px-6 lg:pt-8 xl:px-8">
        {/* ==================================================
            HEADER
        ================================================== */}

        <section className="mb-5 sm:mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-700 via-indigo-700 to-fuchsia-700 p-4 text-white shadow-xl sm:rounded-3xl sm:p-6 lg:p-8">
            {/* Decorative */}

            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl sm:h-44 sm:w-44" />

            <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl sm:h-56 sm:w-56" />

            <div className="relative flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Left */}

              <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/20 backdrop-blur-md sm:h-16 sm:w-16 sm:rounded-2xl">
                  <CalendarCheck2
                    size={25}
                    className="sm:h-[34px] sm:w-[34px]"
                  />
                </div>

                <div className="min-w-0">
                  <h1 className="break-words text-xl font-bold leading-tight sm:text-2xl lg:text-3xl">
                    Confirmed Booking Sessions
                  </h1>

                  <p className="mt-1 text-sm leading-5 text-green-100 sm:mt-2 sm:text-base">
                    View and manage all confirmed mentorship sessions.
                  </p>
                </div>
              </div>

              {/* Right */}

              <div className="w-full rounded-xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-md sm:w-auto sm:rounded-2xl sm:px-6 sm:py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-green-100">
                      Total
                    </p>

                    <h3 className="mt-1 text-lg font-semibold sm:text-xl">
                      Confirmed
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-xl font-bold text-green-700 sm:h-14 sm:w-14 sm:text-2xl">
                    {filteredSessions.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            SEARCH
        ================================================== */}

        <section className="mb-5 sm:mb-8">
          <div className="mb-2">
            <h3 className="text-sm font-semibold text-gray-700">
              Search Sessions
            </h3>

            <p className="text-xs leading-5 text-gray-500">
              Search by student name, email or session type.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Search Input */}

            <div className="relative min-w-0 flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search by student or session type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-14 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-700 shadow-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 sm:h-16 sm:rounded-2xl sm:text-base"
              />
            </div>

            {/* Result */}

            <div className="flex h-14 w-full items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 shadow-sm sm:h-16 sm:px-6 lg:w-[240px] lg:shrink-0 lg:rounded-2xl">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                  Search Results
                </p>

                <p className="text-xs text-gray-600 sm:text-sm">
                  Matching sessions
                </p>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-base font-bold text-white sm:h-10 sm:w-10 sm:text-lg">
                {filteredSessions.length}
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {filteredSessions.length === 0 ? (
          <section className="rounded-2xl border border-gray-200 bg-white px-4 py-12 shadow-sm sm:rounded-3xl sm:p-14">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 sm:h-20 sm:w-20">
                <CalendarCheck2
                  size={32}
                  className="text-emerald-600 sm:h-[38px] sm:w-[38px]"
                />
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-800 sm:text-2xl">
                No Confirmed Sessions
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
                There are currently no confirmed mentorship sessions. Once
                students book and you confirm them, they will appear here.
              </p>
            </div>
          </section>
        ) : (
          /* ==================================================
              SESSION LIST
          ================================================== */

          <section className="space-y-4 sm:space-y-5">
            {filteredSessions.map((session) => {
              const { meetingEnd, joinTime } = getMeetingTimes(session);

              const canJoin =
                currentTime >= joinTime && currentTime < meetingEnd;

              const meetingExpired = currentTime >= meetingEnd;

              const secondsUntilJoin = Math.max(
                0,
                Math.floor((joinTime - currentTime) / 1000)
              );

              return (
                <article
                  key={session._id}
                  className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg sm:rounded-2xl"
                >
                  {/* Accent */}

                  <div className="h-1 bg-emerald-500" />

                  <div className="p-4 sm:p-5 lg:p-6">
                    {/* ==================================================
                        STUDENT + FEE
                    ================================================== */}

                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      {/* Student */}

                      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                        <img
                          src={getProfileImage(session.student?.profileImage)}
                          alt={`${session.student?.firstName || ""} ${
                            session.student?.lastName || ""
                          }`}
                          className="h-12 w-12 shrink-0 rounded-full border-4 border-emerald-100 object-cover sm:h-16 sm:w-16"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://ui-avatars.com/api/?name=Student";
                          }}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="max-w-full break-words text-base font-bold text-gray-800 sm:text-lg">
                              {session.student?.firstName}{" "}
                              {session.student?.lastName}
                            </h2>

                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              {session.bookingStatus}
                            </span>

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

                          <div className="mt-2 inline-flex max-w-full rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:text-sm">
                            <span className="truncate">
                              {session.sessionType}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Fee */}

                      <div className="border-t border-gray-100 pt-4 xl:border-0 xl:pt-0 xl:text-right">
                        <p className="text-xs text-gray-500">Session Fee</p>

                        <h2 className="text-xl font-bold text-emerald-600 sm:text-2xl">
                          ₹{session.amount}
                        </h2>
                      </div>
                    </div>

                    {/* ==================================================
                        DETAILS
                    ================================================== */}

                    <div className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
                        <p className="text-[10px] uppercase tracking-wide text-gray-500 sm:text-[11px]">
                          Session Date
                        </p>

                        <h3 className="mt-1 text-sm font-semibold text-gray-800 sm:text-base">
                          {new Date(session.sessionDate).toLocaleDateString()}
                        </h3>
                      </div>

                      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
                        <p className="text-[10px] uppercase tracking-wide text-gray-500 sm:text-[11px]">
                          Time
                        </p>

                        <h3 className="mt-1 text-sm font-semibold text-gray-800 sm:text-base">
                          {session.startTime}
                        </h3>

                        <p className="text-xs text-gray-500 sm:text-sm">
                          {session.endTime}
                        </p>
                      </div>

                      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
                        <p className="text-[10px] uppercase tracking-wide text-gray-500 sm:text-[11px]">
                          Duration
                        </p>

                        <h3 className="mt-1 text-sm font-semibold text-gray-800 sm:text-base">
                          {session.duration} mins
                        </h3>
                      </div>

                      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
                        <p className="text-[10px] uppercase tracking-wide text-gray-500 sm:text-[11px]">
                          Booked On
                        </p>

                        <h3 className="mt-1 text-sm font-semibold text-gray-800 sm:text-base">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </h3>
                      </div>
                    </div>

                    {/* ==================================================
                        NOTES
                    ================================================== */}

                    {session.notes && (
                      <div className="mt-4 overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-sm sm:mt-5 sm:rounded-2xl">
                        <div className="flex items-center gap-3 border-b border-amber-200 bg-white/60 px-4 py-3 sm:px-5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 sm:h-10 sm:w-10">
                            <FileText size={19} className="text-amber-600" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-gray-800">
                              Session Notes
                            </h3>

                            <p className="text-xs text-gray-500">
                              Instructions shared by the student
                            </p>
                          </div>
                        </div>

                        <div className="px-4 py-4 sm:px-5">
                          <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
                            {session.notes}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* ==================================================
                        MEETING STATUS
                    ================================================== */}

                    <div className="mt-4 rounded-xl border border-gray-200 bg-gradient-to-r from-slate-50 to-gray-100 p-4 sm:mt-5 sm:rounded-2xl sm:p-5">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        {/* Status */}

                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Meeting Status
                          </p>

                          {canJoin ? (
                            <>
                              <div className="mt-2 flex items-center gap-2">
                                <span className="h-3 w-3 shrink-0 animate-pulse rounded-full bg-emerald-500" />

                                <span className="text-sm font-semibold text-emerald-700 sm:text-base">
                                  Live • Ready to Join
                                </span>
                              </div>

                              <p className="mt-2 text-xs leading-5 text-gray-500 sm:text-sm">
                                Your session is live now. Click the button to
                                join the meeting.
                              </p>
                            </>
                          ) : meetingExpired ? (
                            <>
                              <div className="mt-2 flex items-center gap-2">
                                <span className="h-3 w-3 shrink-0 rounded-full bg-gray-500" />

                                <span className="text-sm font-semibold text-gray-700 sm:text-base">
                                  Meeting Completed
                                </span>
                              </div>

                              <p className="mt-2 text-xs leading-5 text-gray-500 sm:text-sm">
                                This mentorship session has already ended.
                              </p>
                            </>
                          ) : (
                            <>
                              <div className="mt-2 flex items-center gap-2">
                                <span className="h-3 w-3 shrink-0 animate-pulse rounded-full bg-orange-500" />

                                <span className="text-sm font-semibold text-orange-700 sm:text-base">
                                  Waiting for Meeting Window
                                </span>
                              </div>

                              <div className="mt-3 inline-flex max-w-full rounded-xl bg-orange-100 px-3 py-2 font-mono text-base font-bold text-orange-700 shadow-sm sm:px-4 sm:text-lg">
                                {formatCountdown(secondsUntilJoin)}
                              </div>

                              <p className="mt-2 text-xs leading-5 text-gray-500 sm:text-sm">
                                Join button will unlock{" "}
                                <strong>10 minutes</strong> before the session
                                starts.
                              </p>
                            </>
                          )}
                        </div>

                        {/* Actions */}

                        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                          {canJoin ? (
                            <button
                              onClick={() =>
                                navigate(`/meeting/${session.meeting?.roomId}`)
                              }
                              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700 sm:w-auto sm:px-6"
                            >
                              <ExternalLink size={18} />
                              Join Meeting
                            </button>
                          ) : meetingExpired ? (
                            <button
                              disabled
                              className="w-full cursor-not-allowed rounded-xl bg-gray-400 px-5 py-3 text-sm font-semibold text-white sm:w-auto sm:px-6"
                            >
                              Meeting Ended
                            </button>
                          ) : (
                            <button
                              disabled
                              className="w-full cursor-not-allowed rounded-xl bg-orange-300 px-5 py-3 text-sm font-semibold text-white sm:w-auto sm:px-6"
                            >
                              Join Locked
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedBookingId(session._id);
                              setCancelReason("");
                              setShowCancelModal(true);
                            }}
                            className="w-full rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-red-700 sm:w-auto sm:px-6"
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
          </section>
        )}
      </main>

      {/* ==================================================
          CANCEL MODAL
      ================================================== */}

      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:p-5">
          <div className="my-auto w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6">
            {/* Header */}

            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
                Cancel Booking
              </h2>

              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                  setSelectedBookingId(null);
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Please enter the reason for cancelling this booking.
            </p>

            <textarea
              rows={5}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter cancellation reason..."
              className="mt-4 w-full resize-none rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100 sm:mt-5 sm:p-4"
            />

            <div className="mt-5 flex flex-col-reverse gap-3 sm:mt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                  setSelectedBookingId(null);
                }}
                className="w-full rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={cancelBooking}
                disabled={!cancelReason.trim()}
                className="w-full rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ConfirmedSessions;
