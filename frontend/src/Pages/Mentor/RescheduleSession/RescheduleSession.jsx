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

      console.log("Sessions With Reschedule Status:", data);

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
      toast.error("Only confirmed bookings can be rescheduled.");

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

      console.log("Reschedule Request Response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Unable to send reschedule request.");
      }

      toast.success(data.message || "Reschedule request sent to the student.");

      // =====================================================
      // GET REQUEST FROM RESPONSE
      // =====================================================

      const request = data.request || null;

      // =====================================================
      // UPDATE UI LOCALLY
      // =====================================================

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
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "Completed":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      case "Rejected":
        return "bg-gray-100 text-gray-600 border-gray-200";

      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
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
            <Loader2 size={34} className="animate-spin text-indigo-600" />
          </div>

          <p className="mt-5 text-slate-700 font-semibold">
            Loading your Reschedule Sessions...
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Please wait while we fetch your Reschedule Session.
          </p>
        </div>
      </div>
    );
  }
  

  return (
    <>
      <main className="lg:ml-64 min-h-screen bg-slate-50 pt-16 lg:pt-0">
        <ToastContainer position="top-right" autoClose={2500} />

        <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          {/* =====================================================
              HEADER
          ====================================================== */}

          <div className="mb-6 sm:mb-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 p-5 text-white shadow-xl sm:rounded-3xl sm:p-7 lg:p-8">
              {/* Background Decorations */}

              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl sm:h-52 sm:w-52" />

              <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl sm:h-64 sm:w-64" />

              <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-teal-400/15 blur-3xl sm:h-56 sm:w-56" />

              {/* Header Content */}

              <div className="relative flex items-start gap-3 sm:gap-5">
                {/* Icon */}

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/30 to-indigo-500/30 shadow-lg shadow-cyan-900/20 backdrop-blur-md sm:h-16 sm:w-16 sm:rounded-2xl">
                  <CalendarDays
                    size={26}
                    className="text-cyan-200 sm:h-[34px] sm:w-[34px]"
                  />
                </div>

                {/* Title & Description */}

                <div className="min-w-0">
                  <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                    Reschedule Sessions
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
                    Request a new date and time for your upcoming mentoring
                    sessions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              INFORMATION BANNER
          ====================================================== */}

          <div className="mb-8 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 sm:p-5">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <RefreshCw size={20} className="text-indigo-600" />
              </div>

              <div>
                <h3 className="font-bold text-indigo-900">
                  How rescheduling works
                </h3>

                <p className="text-sm text-indigo-700 mt-1">
                  Send a new date and time to your student. The request status
                  will change to Pending, Accepted, or Rejected based on the
                  student's response.
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              EMPTY STATE
          ====================================================== */}

          {bookings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 sm:p-16 text-center">
              <CalendarDays size={60} className="mx-auto text-slate-300" />

              <h2 className="text-2xl font-bold text-slate-800 mt-6">
                No confirmed sessions
              </h2>

              <p className="text-slate-500 mt-2">
                Your confirmed mentoring sessions will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => {
                const student = booking.student;

                const studentName = getStudentName(student);

                const rescheduleRequest = booking.rescheduleRequest;

                const rescheduleStatus = getRescheduleStatus(booking);

                const hasPendingRequest = rescheduleStatus === "Pending";

                const statusStyle = getRescheduleStatusStyle(rescheduleStatus);

                return (
                  <div
                    key={booking._id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-5 sm:p-6">
                      {/* =================================================
                            STUDENT + BOOKING STATUS
                        ================================================== */}

                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-indigo-100 flex items-center justify-center flex-shrink-0">
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
                              className={`w-full h-full items-center justify-center ${
                                student?.profileImage ? "hidden" : "flex"
                              }`}
                            >
                              <UserRound
                                size={28}
                                className="text-indigo-600"
                              />
                            </div>
                          </div>

                          <div className="min-w-0">
                            <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                              {studentName}
                            </h2>

                            <p className="text-sm text-slate-500 truncate">
                              {student?.email || "Email unavailable"}
                            </p>

                            {student?.phone && (
                              <p className="text-xs text-slate-400 mt-1">
                                {student.phone}
                              </p>
                            )}
                          </div>
                        </div>

                        <span
                          className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold border ${getStatusStyle(
                            booking.bookingStatus
                          )}`}
                        >
                          {booking.bookingStatus}
                        </span>
                      </div>

                      {/* =================================================
                            CURRENT BOOKING
                        ================================================== */}

                      <div className="mt-8">
                        <div className="flex items-center gap-2 mb-4">
                          <CalendarDays size={18} className="text-slate-500" />

                          <h3 className="font-bold text-slate-800">
                            Current Booking
                          </h3>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                          {/* DATE */}

                          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                                <CalendarDays
                                  size={20}
                                  className="text-indigo-600"
                                />
                              </div>

                              <div className="min-w-0">
                                <p className="text-xs text-slate-400">
                                  Session Date
                                </p>

                                <p className="font-semibold text-slate-800 truncate">
                                  {formatDate(booking.sessionDate)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* START */}

                          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                <Clock3 size={20} className="text-purple-600" />
                              </div>

                              <div>
                                <p className="text-xs text-slate-400">
                                  Start Time
                                </p>

                                <p className="font-semibold text-slate-800">
                                  {formatTime(booking.startTime)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* END */}

                          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                <Clock3 size={20} className="text-orange-600" />
                              </div>

                              <div>
                                <p className="text-xs text-slate-400">
                                  End Time
                                </p>

                                <p className="font-semibold text-slate-800">
                                  {formatTime(booking.endTime)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* TYPE */}

                          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Briefcase
                                  size={20}
                                  className="text-blue-600"
                                />
                              </div>

                              <div>
                                <p className="text-xs text-slate-400">
                                  Session Type
                                </p>

                                <p className="font-semibold text-slate-800">
                                  {booking.sessionType}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* AMOUNT */}

                          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                <IndianRupee
                                  size={20}
                                  className="text-emerald-600"
                                />
                              </div>

                              <div>
                                <p className="text-xs text-slate-400">Amount</p>

                                <p className="font-bold text-slate-800">
                                  ₹{booking.amount}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* =================================================
                            RESCHEDULE STATUS
                        ================================================== */}

                      {rescheduleStatus && (
                        <div
                          className={`mt-6 rounded-2xl border p-5 ${statusStyle.wrapper}`}
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getRescheduleStatusIcon(rescheduleStatus)}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <h3
                                  className={`font-bold ${statusStyle.title}`}
                                >
                                  Reschedule Request: {rescheduleStatus}
                                </h3>

                                {rescheduleRequest?.respondedAt && (
                                  <span
                                    className={`text-xs ${statusStyle.text}`}
                                  >
                                    Responded on{" "}
                                    {formatDate(rescheduleRequest.respondedAt)}
                                  </span>
                                )}
                              </div>

                              <p className={`text-sm mt-1 ${statusStyle.text}`}>
                                {getRescheduleStatusMessage(rescheduleStatus)}
                              </p>

                              {/* =================================================
                                    REQUESTED SCHEDULE
                                ================================================== */}

                              {rescheduleRequest && (
                                <div className="mt-5">
                                  <p
                                    className={`text-xs font-bold uppercase tracking-wider ${statusStyle.text}`}
                                  >
                                    Proposed Schedule
                                  </p>

                                  <div className="grid sm:grid-cols-3 gap-3 mt-3">
                                    <div className="bg-white/70 rounded-xl p-3 border border-white">
                                      <p className="text-xs text-slate-400">
                                        New Date
                                      </p>

                                      <p className="font-semibold text-slate-800 mt-1">
                                        {formatDate(
                                          rescheduleRequest.requestedSessionDate
                                        )}
                                      </p>
                                    </div>

                                    <div className="bg-white/70 rounded-xl p-3 border border-white">
                                      <p className="text-xs text-slate-400">
                                        New Start Time
                                      </p>

                                      <p className="font-semibold text-slate-800 mt-1">
                                        {formatTime(
                                          rescheduleRequest.requestedStartTime
                                        )}
                                      </p>
                                    </div>

                                    <div className="bg-white/70 rounded-xl p-3 border border-white">
                                      <p className="text-xs text-slate-400">
                                        New End Time
                                      </p>

                                      <p className="font-semibold text-slate-800 mt-1">
                                        {formatTime(
                                          rescheduleRequest.requestedEndTime
                                        )}
                                      </p>
                                    </div>
                                  </div>

                                  {/* REASON */}

                                  {rescheduleRequest.reason && (
                                    <div className="mt-4 bg-white/70 rounded-xl p-4 border border-white">
                                      <div className="flex items-center gap-2">
                                        <MessageSquare
                                          size={16}
                                          className={statusStyle.icon}
                                        />

                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                          Reason
                                        </p>
                                      </div>

                                      <p className="text-sm text-slate-700 mt-2">
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

                      {/* =================================================
                            NOTES
                        ================================================== */}

                      {booking.notes && (
                        <div className="mt-6 rounded-2xl bg-indigo-50 border border-indigo-100 p-5">
                          <div className="flex items-center gap-2">
                            <MessageSquare
                              size={17}
                              className="text-indigo-600"
                            />

                            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                              Student Notes
                            </p>
                          </div>

                          <p className="text-sm text-slate-700 mt-2">
                            {booking.notes}
                          </p>
                        </div>
                      )}

                      {/* =================================================
                            REQUEST BUTTON
                        ================================================== */}

                      {booking.bookingStatus === "Confirmed" &&
                        !hasPendingRequest && (
                          <div className="mt-7 flex justify-end">
                            <button
                              onClick={() => openRescheduleModal(booking)}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition"
                            >
                              <RefreshCw size={18} />
                              Request Reschedule
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* =========================================================
          RESCHEDULE MODAL
      ========================================================= */}

      {showRescheduleModal && selectedBooking && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm overflow-y-auto"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeRescheduleModal();
            }
          }}
        >
          <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
            <div
              className="bg-white w-full max-w-xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
              onMouseDown={(e) => e.stopPropagation()}
            >
              {/* HEADER */}

              <div className="flex-shrink-0 px-5 sm:px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="min-w-0 pr-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Request Reschedule
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Send a new schedule proposal to{" "}
                    <span className="font-semibold">
                      {getStudentName(selectedBooking.student)}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeRescheduleModal}
                  disabled={submitting}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition flex-shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              {/* BODY */}

              <div className="flex-1 overflow-y-auto p-5 sm:p-6">
                {/* CURRENT BOOKING */}

                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <CalendarDays size={18} className="text-slate-500" />

                    <p className="font-semibold text-slate-800">
                      Current Booking
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl border border-slate-100 p-4">
                      <p className="text-xs text-slate-400">Current Date</p>

                      <p className="font-semibold text-slate-700 mt-2">
                        {formatDate(selectedBooking.sessionDate)}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-100 p-4">
                      <p className="text-xs text-slate-400">Start Time</p>

                      <p className="font-semibold text-slate-700 mt-2">
                        {formatTime(selectedBooking.startTime)}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-100 p-4">
                      <p className="text-xs text-slate-400">End Time</p>

                      <p className="font-semibold text-slate-700 mt-2">
                        {formatTime(selectedBooking.endTime)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Clock3 size={17} className="text-indigo-600" />

                      <span className="text-sm font-medium text-indigo-700">
                        Session Duration
                      </span>
                    </div>

                    <span className="text-sm font-bold text-indigo-800">
                      {selectedBooking.duration || 0} minutes
                    </span>
                  </div>
                </div>

                {/* FORM */}

                <form
                  onSubmit={handleRescheduleRequest}
                  className="mt-6 space-y-5"
                >
                  {/* DATE */}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Proposed New Date
                    </label>

                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      min={getTodayDate()}
                      disabled={submitting}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
                    />
                  </div>

                  {/* START TIME */}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Proposed New Start Time
                    </label>

                    <input
                      type="time"
                      value={newStartTime}
                      onChange={(e) => setNewStartTime(e.target.value)}
                      disabled={submitting}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
                    />

                    {newStartTime && selectedBooking.duration && (
                      <div className="mt-3 rounded-xl bg-indigo-50 border border-indigo-100 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-indigo-700">
                            Calculated End Time
                          </span>

                          <span className="font-bold text-indigo-900">
                            {calculateEndTime(
                              newStartTime,
                              selectedBooking.duration
                            )}
                          </span>
                        </div>

                        <p className="text-xs text-indigo-600 mt-1">
                          Based on {selectedBooking.duration} minute session
                        </p>
                      </div>
                    )}
                  </div>

                  {/* REASON */}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Reason for Rescheduling
                    </label>

                    <textarea
                      rows={4}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      disabled={submitting}
                      placeholder="Explain why you need to reschedule this session..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none resize-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
                    />
                  </div>

                  {/* WARNING */}

                  <div className="flex gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                    <AlertCircle
                      size={20}
                      className="text-amber-600 flex-shrink-0"
                    />

                    <p className="text-sm text-amber-800">
                      The current booking will remain unchanged until the
                      student accepts your request. The new end time is
                      calculated automatically from the session duration.
                    </p>
                  </div>

                  {/* BUTTONS */}

                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeRescheduleModal}
                      disabled={submitting}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <RefreshCw size={18} />
                          Send Reschedule Request
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RescheduleSession;
