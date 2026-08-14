import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import {
  CalendarCheck2,
  Search,
  ExternalLink,
  FileText,
  X,
  Sparkles,
  Clock3,
  Calendar,
  User,
  ShieldCheck,
} from "lucide-react";

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
  // JOIN GOOGLE MEET HANDLER
  // ==================================================

  const handleJoinGoogleMeet = async (roomId) => {
    try {
      const token = localStorage.getItem("MentorToken");
      const res = await fetch(`${API_BASE_URL}/api/meeting/${roomId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return toast.error(data.message || "Unable to join meeting.");
      }

      window.open(data.googleMeetLink, "_blank");
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect to meeting room.");
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
    const datePart = session.sessionDate.split("T")[0];
    const [year, month, day] = datePart.split("-").map(Number);

    const meetingStart = new Date(year, month - 1, day);
    const meetingEnd = new Date(year, month - 1, day);

    if (!session.startTime || !session.endTime) {
      return {
        meetingStart,
        meetingEnd,
        joinTime: meetingStart,
      };
    }

    let [startTime, startPeriod] = session.startTime.split(" ");
    let [startHour, startMinute] = startTime.split(":").map(Number);
    startPeriod = startPeriod?.toLowerCase();

    if (startPeriod === "pm" && startHour !== 12) startHour += 12;
    if (startPeriod === "am" && startHour === 12) startHour = 0;

    meetingStart.setHours(startHour, startMinute, 0, 0);

    let [endTime, endPeriod] = session.endTime.split(" ");
    let [endHour, endMinute] = endTime.split(":").map(Number);
    endPeriod = endPeriod?.toLowerCase();

    if (endPeriod === "pm" && endHour !== 12) endHour += 12;
    if (endPeriod === "am" && endHour === 12) endHour = 0;

    meetingEnd.setHours(endHour, endMinute, 0, 0);

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
      return "https://ui-avatars.com/api/?name=Student";
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
            Loading your Bookings...
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

  return (
    <div
      className="min-h-screen bg-slate-50 pt-20 lg:ml-64 lg:pt-0 text-slate-900"
      style={{ fontFamily: "'Poppins', sans-serif", fontStyle: "normal" }}
    >
      <main className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* ==================================================
            HEADER - POLISHED EXECUTIVE BANNER
        ================================================== */}
        <section className="relative overflow-hidden rounded-3xl bg-black p-6 sm:p-8 text-white shadow-md">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur shadow-inner text-blue-400"
                style={{ fontWeight: 600 }}
              >
                <CalendarCheck2 size={26} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-blue-300 backdrop-blur"
                    style={{ fontWeight: 600 }}
                  >
                    <Sparkles size={13} className="text-blue-400" />
                    Confirmed Suite
                  </span>
                </div>

                <h1
                  className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-white"
                  style={{ fontWeight: 600 }}
                >
                  Confirmed Booking Sessions
                </h1>

                <p
                  className="mt-1 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed"
                  style={{ fontWeight: 600 }}
                >
                  View, track readiness, and manage all verified mentorship
                  bookings.
                </p>
              </div>
            </div>

            <div
              className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur shadow-inner shrink-0"
              style={{ fontWeight: 600 }}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-base font-semibold text-black shadow-xs">
                {filteredSessions.length}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Total
                </p>
                <h3 className="text-sm font-semibold text-white">Confirmed</h3>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            SEARCH & FILTER BAR
        ================================================== */}
        <section className="space-y-3">
          <div className="flex flex-col lg:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative min-w-0 flex-1 w-full">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by student name, email or session type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                style={{ fontWeight: 600 }}
              />
            </div>

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

        {/* ==================================================
            EMPTY STATE
        ================================================== */}
        {filteredSessions.length === 0 ? (
          <section className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-5 py-16 text-center shadow-xs">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
              <CalendarCheck2 size={26} />
            </div>

            <h2
              className="text-base font-semibold text-slate-900 tracking-tight"
              style={{ fontWeight: 600 }}
            >
              No Confirmed Sessions
            </h2>
            <p
              className="mt-1 max-w-sm text-center text-xs text-slate-500 font-medium leading-relaxed"
              style={{ fontWeight: 600 }}
            >
              There are currently no confirmed mentorship sessions matching your
              criteria.
            </p>
          </section>
        ) : (
          /* ==================================================
              SESSION CARDS - STRUCTURED MASTER-DETAIL LAYOUT
          ================================================== */
          <section className="w-full space-y-4">
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
                  className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs transition duration-200 hover:border-blue-300 hover:shadow-md p-5 sm:p-6"
                >
                  <div className="w-full space-y-5">
                    {/* TOP: STUDENT IDENTITY & STATUS */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={getProfileImage(session.student?.profileImage)}
                          alt={`${session.student?.firstName || ""} ${
                            session.student?.lastName || ""
                          }`}
                          className="h-12 w-12 shrink-0 rounded-2xl border border-slate-200 object-cover shadow-2xs"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://ui-avatars.com/api/?name=Student";
                          }}
                        />

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2
                              className="text-xs sm:text-sm font-semibold text-slate-900 tracking-tight truncate"
                              style={{ fontWeight: 600 }}
                            >
                              {session.student?.firstName}{" "}
                              {session.student?.lastName}
                            </h2>

                            <span
                              className="rounded-full px-3 py-0.5 text-[10px] font-semibold border border-emerald-200 bg-emerald-50 text-emerald-700"
                              style={{ fontWeight: 600 }}
                            >
                              {session.bookingStatus}
                            </span>

                            {session.paymentStatus && (
                              <span
                                className={`rounded-full px-3 py-0.5 text-[10px] font-semibold border ${
                                  session.paymentStatus === "Paid"
                                    ? "border-blue-200 bg-blue-50 text-blue-700"
                                    : "border-red-200 bg-red-50 text-red-700"
                                }`}
                                style={{ fontWeight: 600 }}
                              >
                                {session.paymentStatus}
                              </span>
                            )}
                          </div>

                          <p
                            className="mt-0.5 text-[11px] text-slate-500 font-medium truncate"
                            style={{ fontWeight: 600 }}
                          >
                            {session.student?.email}
                          </p>
                        </div>
                      </div>

                      {/* SESSION FEE BADGE */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5">
                        <span
                          className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold"
                          style={{ fontWeight: 600 }}
                        >
                          Fee Earned:
                        </span>
                        <span
                          className="text-sm font-semibold text-emerald-600"
                          style={{ fontWeight: 600 }}
                        >
                          ₹{session.amount}
                        </span>
                      </div>
                    </div>

                    {/* MIDDLE: SESSION SCHEDULING METRICS */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                        <p
                          className="text-[10px] uppercase tracking-wide text-slate-400 mb-1"
                          style={{ fontWeight: 600 }}
                        >
                          Type
                        </p>
                        <p
                          className="text-slate-900 truncate"
                          style={{ fontWeight: 600 }}
                        >
                          {session.sessionType || "Mentorship"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                        <p
                          className="text-[10px] uppercase tracking-wide text-slate-400 mb-1"
                          style={{ fontWeight: 600 }}
                        >
                          Date & Time
                        </p>
                        <p
                          className="text-slate-900 truncate"
                          style={{ fontWeight: 600 }}
                        >
                          {new Date(session.sessionDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                            }
                          )}{" "}
                          • {session.startTime}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                        <p
                          className="text-[10px] uppercase tracking-wide text-slate-400 mb-1"
                          style={{ fontWeight: 600 }}
                        >
                          Duration
                        </p>
                        <p
                          className="text-slate-900"
                          style={{ fontWeight: 600 }}
                        >
                          {session.duration} mins
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                        <p
                          className="text-[10px] uppercase tracking-wide text-slate-400 mb-1"
                          style={{ fontWeight: 600 }}
                        >
                          Booked On
                        </p>
                        <p
                          className="text-slate-900 truncate"
                          style={{ fontWeight: 600 }}
                        >
                          {new Date(session.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    {/* NOTES ACCORDION / BOX */}
                    {session.notes && (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-semibold">
                        <div className="flex items-center gap-2 mb-1.5 text-blue-600">
                          <FileText size={14} />
                          <p
                            className="text-[10px] uppercase tracking-wider text-slate-400"
                            style={{ fontWeight: 600 }}
                          >
                            Student Instructions / Notes
                          </p>
                        </div>
                        <p
                          className="break-words leading-relaxed text-slate-700 font-medium pl-6"
                          style={{ fontWeight: 600 }}
                        >
                          {session.notes}
                        </p>
                      </div>
                    )}

                    {/* BOTTOM: MEETING LAUNCH CONTROLS & CANCELLATION */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                          <p
                            className="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                            style={{ fontWeight: 600 }}
                          >
                            Room Readiness
                          </p>

                          {canJoin ? (
                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
                              <span
                                className="text-xs font-semibold text-emerald-700"
                                style={{ fontWeight: 600 }}
                              >
                                Live • Room is open for entry
                              </span>
                            </div>
                          ) : meetingExpired ? (
                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                              <span
                                className="text-xs font-semibold text-slate-600"
                                style={{ fontWeight: 600 }}
                              >
                                Meeting Concluded
                              </span>
                            </div>
                          ) : (
                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-600" />
                              <span
                                className="text-xs font-semibold text-blue-700"
                                style={{ fontWeight: 600 }}
                              >
                                Unlocks in
                              </span>
                              <span
                                className="font-mono font-bold tracking-wider text-xs bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 text-slate-800"
                                style={{ fontWeight: 600 }}
                              >
                                {formatCountdown(secondsUntilJoin)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex w-full flex-col gap-2.5 sm:flex-row lg:w-auto">
                          {canJoin ? (
                            <button
                              onClick={() =>
                                handleJoinGoogleMeet(session.meeting?.roomId)
                              }
                              className="flex w-full items-center justify-center gap-2 rounded-xl bg-black hover:bg-slate-800 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition sm:w-auto"
                              style={{ fontWeight: 600 }}
                            >
                              <ExternalLink
                                size={14}
                                className="text-blue-400"
                              />
                              Join Google Meet
                            </button>
                          ) : meetingExpired ? (
                            <button
                              disabled
                              className="w-full cursor-not-allowed rounded-xl bg-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-500 sm:w-auto"
                              style={{ fontWeight: 600 }}
                            >
                              Meeting Ended
                            </button>
                          ) : (
                            <button
                              disabled
                              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-500 sm:w-auto"
                              style={{ fontWeight: 600 }}
                            >
                              <Clock3 size={14} />
                              Join Locked
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedBookingId(session._id);
                              setCancelReason("");
                              setShowCancelModal(true);
                            }}
                            className="w-full rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 px-5 py-2.5 text-xs font-semibold text-red-600 transition shadow-2xs sm:w-auto"
                            style={{ fontWeight: 600 }}
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-200">
                  <X size={20} />
                </div>
                <h2
                  className="mt-3 text-base font-semibold text-slate-900 tracking-tight"
                  style={{ fontWeight: 600 }}
                >
                  Cancel Booking
                </h2>
                <p
                  className="mt-1 text-xs text-slate-500 font-medium"
                  style={{ fontWeight: 600 }}
                >
                  Please provide a reason for cancelling this booking.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                  setSelectedBookingId(null);
                }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4">
              <textarea
                rows={4}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter cancellation reason..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                style={{ fontWeight: 600 }}
              />
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                  setSelectedBookingId(null);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                style={{ fontWeight: 600 }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={cancelBooking}
                disabled={!cancelReason.trim()}
                className="w-full rounded-xl bg-red-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto shadow-xs"
                style={{ fontWeight: 600 }}
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ConfirmedSessions;
