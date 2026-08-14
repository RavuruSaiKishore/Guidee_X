import { useEffect, useState } from "react";

import {
  CalendarDays,
  Clock3,
  UserRound,
  Briefcase,
  IndianRupee,
  RefreshCw,
  X,
  AlertCircle,
  Loader2,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Timer,
  Sparkles,
} from "lucide-react";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RescheduleSession = () => {
  // =========================================================
  // BOOKINGS
  // =========================================================

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================================================
  // RESCHEDULE MODAL
  // =========================================================

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);

  // =========================================================
  // FORM
  // =========================================================

  const [newDate, setNewDate] = useState("");

  const [newStartTime, setNewStartTime] = useState("");

  const [reason, setReason] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // =========================================================
  // FETCH BOOKINGS
  // =========================================================

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("MentorToken");

      if (!token) {
        toast.error("Mentor authentication token not found.");

        return;
      }

      const res = await fetch(
        `${API_BASE_URL}/api/booking/sessionforrescheduling`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to fetch confirmed sessions.");
      }

      const sessionData = data.sessions || data.bookings || [];

      setBookings(sessionData);
    } catch (error) {
      console.error("Fetch bookings error:", error);

      toast.error(error.message || "Failed to load your mentoring sessions.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // OPEN MODAL
  // =========================================================

  const openRescheduleModal = (booking) => {
    setSelectedBooking(booking);

    setNewDate("");

    setNewStartTime("");

    setReason("");

    setShowRescheduleModal(true);

    document.body.style.overflow = "hidden";
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeRescheduleModal = () => {
    if (submitting) {
      return;
    }

    setShowRescheduleModal(false);

    setSelectedBooking(null);

    setNewDate("");

    setNewStartTime("");

    setReason("");

    document.body.style.overflow = "";
  };

  // =========================================================
  // CLEAN BODY SCROLL
  // =========================================================

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

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
  // GET TODAY
  // =========================================================

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =========================================================
  // GET STUDENT NAME
  // =========================================================

  const getStudentName = (student) => {
    if (!student) {
      return "Student";
    }

    return `${student.firstName || ""} ${student.lastName || ""}`.trim();
  };

  // =========================================================
  // CONVERT 24-HOUR TIME TO AM/PM
  // =========================================================

  const convertTo12Hour = (time) => {
    if (!time) {
      return "";
    }

    const [hours, minutes] = time.split(":").map(Number);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return time;
    }

    const period = hours >= 12 ? "PM" : "AM";

    const hour12 = hours % 12 || 12;

    return `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )} ${period}`;
  };

  // =========================================================
  // CALCULATE END TIME
  // =========================================================

  const calculateEndTime = (startTime, duration) => {
    if (!startTime || !duration) {
      return "";
    }

    const [hours, minutes] = startTime.split(":").map(Number);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return "";
    }

    const startDate = new Date();

    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(
      startDate.getTime() + Number(duration) * 60 * 1000
    );

    const endHours = endDate.getHours();

    const endMinutes = endDate.getMinutes();

    return convertTo12Hour(
      `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(
        2,
        "0"
      )}`
    );
  };

  // =========================================================
  // GET RESCHEDULE STATUS
  // =========================================================

  const getRescheduleStatus = (booking) => {
    return (
      booking.rescheduleStatus || booking.rescheduleRequest?.status || null
    );
  };

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getRescheduleStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return {
          wrapper: "bg-amber-50 border-amber-200",

          icon: "text-amber-600",

          title: "text-amber-900",

          text: "text-amber-700",
        };

      case "Accepted":
        return {
          wrapper: "bg-emerald-50 border-emerald-200",

          icon: "text-emerald-600",

          title: "text-emerald-900",

          text: "text-emerald-700",
        };

      case "Rejected":
        return {
          wrapper: "bg-red-50 border-red-200",

          icon: "text-red-600",

          title: "text-red-900",

          text: "text-red-700",
        };

      default:
        return {
          wrapper: "bg-slate-50 border-slate-200",

          icon: "text-slate-500",

          title: "text-slate-800",

          text: "text-slate-600",
        };
    }
  };

  // =========================================================
  // STATUS ICON
  // =========================================================

  const getRescheduleStatusIcon = (status) => {
    switch (status) {
      case "Accepted":
        return <CheckCircle2 size={22} className="text-emerald-600" />;

      case "Rejected":
        return <XCircle size={22} className="text-red-600" />;

      case "Pending":
        return <Timer size={22} className="text-amber-600" />;

      default:
        return <RefreshCw size={22} className="text-slate-500" />;
    }
  };

  // =========================================================
  // STATUS MESSAGE
  // =========================================================

  const getRescheduleStatusMessage = (status) => {
    switch (status) {
      case "Pending":
        return "Your reschedule request is waiting for the student to respond.";

      case "Accepted":
        return "The student accepted your reschedule request. The booking schedule has been updated.";

      case "Rejected":
        return "The student rejected your reschedule request. The original booking schedule remains unchanged.";

      default:
        return "";
    }
  };

  // =========================================================
  // SEND RESCHEDULE REQUEST
  // =========================================================

  const handleRescheduleRequest = async (e) => {
    e.preventDefault();

    if (!selectedBooking) {
      toast.error("No booking selected.");

      return;
    }

    if (selectedBooking.bookingStatus !== "Confirmed") {
      toast.error("Only confirmed sessions can be rescheduled.");

      return;
    }

    if (!newDate) {
      toast.error("Please select a new date.");

      return;
    }

    if (!newStartTime) {
      toast.error("Please select a new start time.");

      return;
    }

    if (!reason.trim()) {
      toast.error("Please enter a reason for rescheduling.");

      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("MentorToken");

      const res = await fetch(
        `${API_BASE_URL}/api/reschedule/request/${selectedBooking._id}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            requestedSessionDate: newDate,

            requestedStartTime: newStartTime,

            reason: reason.trim(),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to send reschedule request.");
      }

      toast.success(data.message || "Reschedule request sent to the student.");

      const request = data.request || null;

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === selectedBooking._id
            ? {
                ...booking,

                rescheduleRequest: request,

                rescheduleStatus: request?.status || "Pending",

                hasPendingRescheduleRequest: true,
              }
            : booking
        )
      );

      closeRescheduleModal();
    } catch (error) {
      console.error("Reschedule request error:", error);

      toast.error(error.message || "Failed to send reschedule request.");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // BOOKING STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";

      case "Completed":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "Cancelled":
        return "border-red-200 bg-red-50 text-red-700";

      case "Rejected":
        return "border-slate-200 bg-slate-100 text-slate-700";

      default:
        return "border-amber-200 bg-amber-50 text-amber-700";
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

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
            Loading your Reschedule Sessions...
          </p>
          <p
            className="mt-1 text-center text-[11px] text-slate-400 font-medium"
            style={{ fontWeight: 600 }}
          >
            Please wait while we fetch your Reschedule Session.
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
        <ToastContainer position="top-right" autoClose={2500} />

        {/* =====================================================
            HEADER
        ====================================================== */}
        <section className="relative overflow-hidden rounded-3xl bg-black p-6 sm:p-8 text-white shadow-md">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur shadow-inner text-blue-400"
                style={{ fontWeight: 600 }}
              >
                <CalendarDays size={26} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-blue-300 backdrop-blur"
                    style={{ fontWeight: 600 }}
                  >
                    <Sparkles size={13} className="text-blue-400" />
                    Flexibility Suite
                  </span>
                </div>

                <h1
                  className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-white"
                  style={{ fontWeight: 600 }}
                >
                  Reschedule Sessions
                </h1>

                <p
                  className="mt-1 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed"
                  style={{ fontWeight: 600 }}
                >
                  Request a new date and time for your upcoming mentoring
                  sessions.
                </p>
              </div>
            </div>

            <div
              className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur shadow-inner shrink-0"
              style={{ fontWeight: 600 }}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-base font-semibold text-black shadow-xs">
                {bookings.length}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Total
                </p>
                <h3 className="text-sm font-semibold text-white">Sessions</h3>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            INFORMATION BANNER
        ====================================================== */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <RefreshCw size={20} />
          </div>
          <div>
            <h3
              className="text-xs font-semibold text-slate-900 tracking-tight"
              style={{ fontWeight: 600 }}
            >
              How rescheduling works
            </h3>
            <p
              className="mt-0.5 text-xs text-slate-500 font-medium leading-relaxed"
              style={{ fontWeight: 600 }}
            >
              Send a new date and time to your student. The request status will
              change to Pending, Accepted, or Rejected based on the student's
              response.
            </p>
          </div>
        </div>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
              <CalendarDays size={26} />
            </div>
            <h2
              className="text-base font-semibold text-slate-900 tracking-tight"
              style={{ fontWeight: 600 }}
            >
              No confirmed sessions
            </h2>
            <p
              className="mt-1 text-xs text-slate-500 font-medium max-w-sm mx-auto"
              style={{ fontWeight: 600 }}
            >
              Your confirmed mentoring sessions will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const student = booking.student;

              const studentName = getStudentName(student);

              const rescheduleRequest = booking.rescheduleRequest;

              const rescheduleStatus = getRescheduleStatus(booking);

              const hasPendingRequest = rescheduleStatus === "Pending";

              const statusStyle = getRescheduleStatusStyle(rescheduleStatus);

              return (
                <article
                  key={booking._id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs transition duration-200 hover:border-blue-300 hover:shadow-md p-6"
                >
                  <div className="space-y-5">
                    {/* STUDENT + BOOKING STATUS */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 shadow-2xs">
                          {student?.profileImage ? (
                            <img
                              src={`${API_BASE_URL}${student.profileImage}`}
                              alt={studentName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextElementSibling.style.display =
                                  "flex";
                              }}
                            />
                          ) : null}

                          <div
                            className={`w-full h-full items-center justify-center bg-black text-white text-xs font-semibold ${
                              student?.profileImage ? "hidden" : "flex"
                            }`}
                            style={{ fontWeight: 600 }}
                          >
                            <UserRound size={18} className="text-blue-400" />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <h2
                            className="text-xs sm:text-sm font-semibold text-slate-900 tracking-tight truncate"
                            style={{ fontWeight: 600 }}
                          >
                            {studentName}
                          </h2>
                          <p
                            className="text-[11px] text-slate-500 font-medium truncate mt-0.5"
                            style={{ fontWeight: 600 }}
                          >
                            {student?.email || "Email unavailable"}
                          </p>
                          {student?.phone && (
                            <p
                              className="text-[10px] text-slate-400 font-medium mt-0.5"
                              style={{ fontWeight: 600 }}
                            >
                              {student.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-[11px] font-semibold border ${getStatusStyle(
                          booking.bookingStatus
                        )}`}
                        style={{ fontWeight: 600 }}
                      >
                        {booking.bookingStatus}
                      </span>
                    </div>

                    {/* CURRENT BOOKING METRICS */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CalendarDays size={15} className="text-blue-600" />
                        <h3
                          className="text-xs font-semibold uppercase tracking-wider text-slate-900"
                          style={{ fontWeight: 600 }}
                        >
                          Current Booking Details
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 text-xs font-semibold">
                        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200">
                          <p
                            className="text-[10px] uppercase tracking-wide text-slate-400 mb-1"
                            style={{ fontWeight: 600 }}
                          >
                            Session Date
                          </p>
                          <p
                            className="text-slate-900 truncate"
                            style={{ fontWeight: 600 }}
                          >
                            {formatDate(booking.sessionDate)}
                          </p>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200">
                          <p
                            className="text-[10px] uppercase tracking-wide text-slate-400 mb-1"
                            style={{ fontWeight: 600 }}
                          >
                            Start Time
                          </p>
                          <p
                            className="text-slate-900 truncate"
                            style={{ fontWeight: 600 }}
                          >
                            {formatTime(booking.startTime)}
                          </p>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200">
                          <p
                            className="text-[10px] uppercase tracking-wide text-slate-400 mb-1"
                            style={{ fontWeight: 600 }}
                          >
                            End Time
                          </p>
                          <p
                            className="text-slate-900 truncate"
                            style={{ fontWeight: 600 }}
                          >
                            {formatTime(booking.endTime)}
                          </p>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200">
                          <p
                            className="text-[10px] uppercase tracking-wide text-slate-400 mb-1"
                            style={{ fontWeight: 600 }}
                          >
                            Session Type
                          </p>
                          <p
                            className="text-slate-900 truncate"
                            style={{ fontWeight: 600 }}
                          >
                            {booking.sessionType}
                          </p>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200">
                          <p
                            className="text-[10px] uppercase tracking-wide text-slate-400 mb-1"
                            style={{ fontWeight: 600 }}
                          >
                            Amount
                          </p>
                          <p
                            className="text-emerald-600 font-bold truncate"
                            style={{ fontWeight: 600 }}
                          >
                            ₹{booking.amount}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* RESCHEDULE STATUS */}
                    {rescheduleStatus && (
                      <div
                        className={`rounded-2xl border p-5 ${statusStyle.wrapper}`}
                      >
                        <div className="flex gap-3">
                          <div className="shrink-0 mt-0.5">
                            {getRescheduleStatusIcon(rescheduleStatus)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                              <h3
                                className={`text-xs font-semibold ${statusStyle.title}`}
                                style={{ fontWeight: 600 }}
                              >
                                Reschedule Request: {rescheduleStatus}
                              </h3>

                              {rescheduleRequest?.respondedAt && (
                                <span
                                  className={`text-[10px] ${statusStyle.text} font-semibold`}
                                  style={{ fontWeight: 600 }}
                                >
                                  Responded on{" "}
                                  {formatDate(rescheduleRequest.respondedAt)}
                                </span>
                              )}
                            </div>

                            <p
                              className={`text-xs mt-1 font-medium ${statusStyle.text}`}
                              style={{ fontWeight: 600 }}
                            >
                              {getRescheduleStatusMessage(rescheduleStatus)}
                            </p>

                            {rescheduleRequest && (
                              <div className="mt-4 space-y-3 pt-3 border-t border-current/10">
                                <p
                                  className={`text-[10px] font-semibold uppercase tracking-wider ${statusStyle.text}`}
                                  style={{ fontWeight: 600 }}
                                >
                                  Proposed Schedule
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div className="bg-white/80 rounded-xl p-3 border border-current/10">
                                    <p className="text-[10px] text-slate-400 font-semibold">
                                      New Date
                                    </p>
                                    <p className="text-xs font-semibold text-slate-800 mt-0.5">
                                      {formatDate(
                                        rescheduleRequest.requestedSessionDate
                                      )}
                                    </p>
                                  </div>

                                  <div className="bg-white/80 rounded-xl p-3 border border-current/10">
                                    <p className="text-[10px] text-slate-400 font-semibold">
                                      New Start Time
                                    </p>
                                    <p className="text-xs font-semibold text-slate-800 mt-0.5">
                                      {formatTime(
                                        rescheduleRequest.requestedStartTime
                                      )}
                                    </p>
                                  </div>

                                  <div className="bg-white/80 rounded-xl p-3 border border-current/10">
                                    <p className="text-[10px] text-slate-400 font-semibold">
                                      New End Time
                                    </p>
                                    <p className="text-xs font-semibold text-slate-800 mt-0.5">
                                      {formatTime(
                                        rescheduleRequest.requestedEndTime
                                      )}
                                    </p>
                                  </div>
                                </div>

                                {rescheduleRequest.reason && (
                                  <div className="bg-white/80 rounded-xl p-3.5 border border-current/10">
                                    <div className="flex items-center gap-1.5 mb-1">
                                      <MessageSquare
                                        size={13}
                                        className={statusStyle.icon}
                                      />
                                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                        Reason
                                      </p>
                                    </div>
                                    <p
                                      className="text-xs text-slate-700 font-medium"
                                      style={{ fontWeight: 600 }}
                                    >
                                      {rescheduleRequest.reason}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* NOTES */}
                    {booking.notes && (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-semibold">
                        <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                          <MessageSquare size={14} />
                          <p
                            className="text-[10px] uppercase tracking-wider text-slate-400"
                            style={{ fontWeight: 600 }}
                          >
                            Student Notes
                          </p>
                        </div>
                        <p
                          className="break-words leading-relaxed text-slate-700 font-medium pl-5"
                          style={{ fontWeight: 600 }}
                        >
                          {booking.notes}
                        </p>
                      </div>
                    )}

                    {/* REQUEST BUTTON */}
                    {booking.bookingStatus === "Confirmed" &&
                      !hasPendingRequest && (
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => openRescheduleModal(booking)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-black hover:bg-slate-800 text-xs font-semibold text-white shadow-xs transition"
                            style={{ fontWeight: 600 }}
                          >
                            <RefreshCw size={14} className="text-blue-400" />
                            Request Reschedule
                          </button>
                        </div>
                      )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* =========================================================
          RESCHEDULE MODAL
      ========================================================= */}
      {showRescheduleModal && selectedBooking && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm overflow-y-auto"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeRescheduleModal();
            }
          }}
        >
          <div
            className="w-full max-w-xl max-h-[90vh] rounded-3xl bg-white p-6 shadow-xl border border-slate-200 overflow-y-auto"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2
                  className="text-base font-semibold text-slate-900 tracking-tight"
                  style={{ fontWeight: 600 }}
                >
                  Request Reschedule
                </h2>
                <p
                  className="mt-1 text-xs text-slate-500 font-medium"
                  style={{ fontWeight: 600 }}
                >
                  Send a new schedule proposal to{" "}
                  <span className="font-semibold text-slate-900">
                    {getStudentName(selectedBooking.student)}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={closeRescheduleModal}
                disabled={submitting}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {/* CURRENT BOOKING PREVIEW */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarDays size={15} className="text-blue-600" />
                  <p
                    className="text-xs font-semibold text-slate-900"
                    style={{ fontWeight: 600 }}
                  >
                    Current Booking Details
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold">
                  <div className="bg-white rounded-xl p-3 border border-slate-200">
                    <p className="text-[10px] text-slate-400 uppercase">
                      Current Date
                    </p>
                    <p className="text-slate-800 mt-0.5">
                      {formatDate(selectedBooking.sessionDate)}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-slate-200">
                    <p className="text-[10px] text-slate-400 uppercase">
                      Start Time
                    </p>
                    <p className="text-slate-800 mt-0.5">
                      {formatTime(selectedBooking.startTime)}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-slate-200">
                    <p className="text-[10px] text-slate-400 uppercase">
                      End Time
                    </p>
                    <p className="text-slate-800 mt-0.5">
                      {formatTime(selectedBooking.endTime)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-xl bg-blue-50 border border-blue-200 px-3.5 py-2.5 text-xs font-semibold text-blue-700">
                  <span>Session Duration</span>
                  <span>{selectedBooking.duration || 0} minutes</span>
                </div>
              </div>

              {/* FORM */}
              <form onSubmit={handleRescheduleRequest} className="space-y-4">
                <div>
                  <label
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                    style={{ fontWeight: 600 }}
                  >
                    Proposed New Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    min={getTodayDate()}
                    disabled={submitting}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                    style={{ fontWeight: 600 }}
                  />
                </div>

                <div>
                  <label
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                    style={{ fontWeight: 600 }}
                  >
                    Proposed New Start Time
                  </label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    disabled={submitting}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                    style={{ fontWeight: 600 }}
                  />

                  {newStartTime && selectedBooking.duration && (
                    <div className="mt-2.5 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs font-semibold text-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">
                          Calculated End Time
                        </span>
                        <span className="text-slate-900 font-bold">
                          {calculateEndTime(
                            newStartTime,
                            selectedBooking.duration
                          )}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Based on {selectedBooking.duration} minute session
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                    style={{ fontWeight: 600 }}
                  >
                    Reason for Rescheduling
                  </label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={submitting}
                    placeholder="Explain why you need to reschedule this session..."
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                    style={{ fontWeight: 600 }}
                  />
                </div>

                <div className="flex gap-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800">
                  <AlertCircle
                    size={18}
                    className="shrink-0 text-amber-600 mt-0.5"
                  />
                  <p className="leading-relaxed" style={{ fontWeight: 600 }}>
                    The current booking will remain unchanged until the student
                    accepts your request.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={closeRescheduleModal}
                    disabled={submitting}
                    className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    style={{ fontWeight: 600 }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-black hover:bg-slate-800 px-5 py-2.5 text-xs font-semibold text-white transition disabled:opacity-50 shadow-xs"
                    style={{ fontWeight: 600 }}
                  >
                    {submitting ? (
                      <>
                        <Loader2
                          size={15}
                          className="animate-spin text-blue-400"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={15} className="text-blue-400" />
                        Send Reschedule Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RescheduleSession;
