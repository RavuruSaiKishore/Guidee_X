import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  IndianRupee,
  ExternalLink,
  CreditCard,
  Timer,
  AlertTriangle,
  X,
  Sparkles,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [refundDetails, setRefundDetails] = useState({
    amount: 0,
    eligible: false,
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("UserToken");
      const res = await fetch(`${API_BASE_URL}/api/booking/mybookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load your bookings.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Completed":
        return "bg-slate-900 text-white border border-slate-900";
      case "Cancelled":
        return "bg-red-50 text-red-600 border border-red-200";
      case "Rejected":
        return "bg-slate-100 text-slate-600 border border-slate-200";
      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  const getMeetingTimes = (booking) => {
    const datePart = booking.sessionDate.split("T")[0];
    const [year, month, day] = datePart.split("-").map(Number);

    const meetingStart = new Date(year, month - 1, day);
    const meetingEnd = new Date(year, month - 1, day);

    if (!booking.startTime || !booking.endTime) {
      return { meetingStart, meetingEnd, joinTime: meetingStart };
    }

    let [time, period] = booking.startTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    period = period.toLowerCase();
    if (period === "pm" && hours !== 12) hours += 12;
    if (period === "am" && hours === 12) hours = 0;
    meetingStart.setHours(hours, minutes, 0, 0);

    let [endTime, endPeriod] = booking.endTime.split(" ");
    let [endHours, endMinutes] = endTime.split(":").map(Number);
    endPeriod = endPeriod.toLowerCase();
    if (endPeriod === "pm" && endHours !== 12) endHours += 12;
    if (endPeriod === "am" && endHours === 12) endHours = 0;
    meetingEnd.setHours(endHours, endMinutes, 0, 0);

    const joinTime = new Date(meetingStart.getTime() - 10 * 60 * 1000);
    return { meetingStart, meetingEnd, joinTime };
  };

  const formatCountdown = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const openCancelModal = (booking) => {
    setSelectedBookingId(booking._id);
    const { meetingStart } = getMeetingTimes(booking);
    const now = new Date();
    const hoursLeft = (meetingStart - now) / (1000 * 60 * 60);
    const isEligible = hoursLeft >= 24 && booking.paymentStatus === "Paid";
    setRefundDetails({
      amount: booking.amount,
      eligible: isEligible,
    });
    setShowCancelModal(true);
  };

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      return toast.error("Please enter cancellation reason.");
    }

    try {
      const token = localStorage.getItem("UserToken");
      const res = await fetch(
        `${API_BASE_URL}/api/booking/cancelbooking/${selectedBookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cancellationReason: cancelReason }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setBookings((prev) =>
          prev.map((b) =>
            b._id === selectedBookingId
              ? {
                  ...b,
                  bookingStatus: "Cancelled",
                  cancelledBy: "Student",
                  cancellationReason: cancelReason,
                  paymentStatus: refundDetails.eligible
                    ? "Refunded"
                    : b.paymentStatus,
                }
              : b
          )
        );
        setShowCancelModal(false);
        setSelectedBookingId(null);
        setCancelReason("");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong.");
    }
  };

  const handleJoinGoogleMeet = async (roomId, bookingId) => {
    try {
      const token = localStorage.getItem("UserToken");
      const res = await fetch(`${API_BASE_URL}/api/meeting/${roomId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return toast.error(data.message || "Unable to join meeting.");
      }

      await fetch(`${API_BASE_URL}/api/meeting/${roomId}/complete`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      window.open(data.googleMeetLink, "_blank");
      setTimeout(() => {
        navigate(`/review/${bookingId}`);
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect to meeting room.");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking record?"))
      return;

    try {
      const token = localStorage.getItem("UserToken");
      const res = await fetch(
        `${API_BASE_URL}/api/booking/delete/${bookingId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Unable to delete booking.");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "all") return true;
    if (activeTab === "upcoming") return b.bookingStatus === "Confirmed";
    if (activeTab === "completed") return b.bookingStatus === "Completed";
    if (activeTab === "cancelled") return b.bookingStatus === "Cancelled";
    return true;
  });

  if (loading) {
    return (
      <div
        className="fixed inset-0 bg-white flex flex-col items-center justify-center"
        style={{ fontFamily: "'Poppins', sans-serif", fontStyle: "normal" }}
      >
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-4 border-slate-100"></div>
          <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
        </div>
        <p
          className="mt-5 text-slate-900 font-semibold tracking-tight"
          style={{ fontWeight: 600 }}
        >
          Loading your bookings...
        </p>
        <p
          className="mt-1 text-xs text-slate-500 font-medium"
          style={{ fontWeight: 600 }}
        >
          Please wait a moment
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-50 py-10 text-slate-900"
      style={{ fontFamily: "'Poppins', sans-serif", fontStyle: "normal" }}
    >
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-widest text-blue-600"
              style={{ fontWeight: 600 }}
            >
              Session Dashboard
            </p>
            <h1
              className="mt-1 text-3xl font-semibold tracking-tight text-slate-900"
              style={{ fontWeight: 600 }}
            >
              My Bookings
            </h1>
            <p
              className="mt-1 text-xs sm:text-sm text-slate-600 font-medium"
              style={{ fontWeight: 600 }}
            >
              Manage all your professional mentoring sessions and live connects
              in one place.
            </p>
          </div>
          <button
            onClick={() => navigate("/mentors")}
            className="flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
            style={{ fontWeight: 600 }}
          >
            <Sparkles size={14} className="text-blue-400" />
            Book New Session
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200">
          {["all", "upcoming", "completed", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
              style={{ fontWeight: 600 }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <Calendar size={28} />
            </div>
            <h2
              className="text-xl font-semibold text-slate-900"
              style={{ fontWeight: 600 }}
            >
              No Bookings Found
            </h2>
            <p
              className="text-slate-500 text-xs sm:text-sm mt-1 mb-6 font-medium"
              style={{ fontWeight: 600 }}
            >
              You don't have any bookings matching this filter category.
            </p>
            <button
              onClick={() => navigate("/mentors")}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
              style={{ fontWeight: 600 }}
            >
              Explore Mentors
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const mentor = booking.mentor;
              const { meetingStart, meetingEnd, joinTime } =
                getMeetingTimes(booking);

              const canJoin =
                currentTime >= joinTime && currentTime < meetingEnd;
              const meetingExpired = currentTime >= meetingEnd;
              const secondsUntilJoin = Math.max(
                0,
                Math.floor((joinTime - currentTime) / 1000)
              );

              const image = mentor?.profileImage
                ? mentor.profileImage.startsWith("http")
                  ? mentor.profileImage
                  : `${API_BASE_URL}/${mentor.profileImage.replace(/^\/+/, "")}`
                : `https://ui-avatars.com/api/?name=${
                    mentor?.firstName || "Mentor"
                  }+${mentor?.lastName || ""}`;

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden"
                >
                  <div className="p-6 sm:p-8">
                    {/* Top Row: Mentor info & Status */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 pb-6 border-b border-slate-100">
                      <div
                        onClick={() =>
                          navigate(`/mentor/profile/${mentor?._id}`)
                        }
                        className="flex gap-4 cursor-pointer group items-center"
                      >
                        <img
                          src={image}
                          alt={`${mentor?.firstName} ${mentor?.lastName}`}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 group-hover:border-blue-600 transition"
                        />
                        <div>
                          <h2
                            className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition flex items-center gap-1.5"
                            style={{ fontWeight: 600 }}
                          >
                            {mentor?.firstName} {mentor?.lastName}
                            <ChevronRight
                              size={14}
                              className="text-slate-400 group-hover:translate-x-0.5 transition"
                            />
                          </h2>
                          <p
                            className="text-xs text-slate-500 font-medium"
                            style={{ fontWeight: 600 }}
                          >
                            {mentor?.profession || "Expert Mentor"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusBadge(
                            booking.bookingStatus
                          )}`}
                          style={{ fontWeight: 600 }}
                        >
                          {booking.bookingStatus}
                        </span>

                        <button
                          onClick={() => navigate(`/disputes`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-full text-xs font-semibold transition"
                          style={{ fontWeight: 600 }}
                        >
                          <ShieldAlert size={13} className="text-amber-600" />
                          Report Issue
                        </button>
                      </div>
                    </div>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-6">
                      <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Calendar size={16} />
                        </div>
                        <div>
                          <p
                            className="text-[10px] font-semibold text-slate-400 uppercase"
                            style={{ fontWeight: 600 }}
                          >
                            Date
                          </p>
                          <p
                            className="text-xs font-semibold text-slate-800"
                            style={{ fontWeight: 600 }}
                          >
                            {new Date(booking.sessionDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Clock size={16} />
                        </div>
                        <div>
                          <p
                            className="text-[10px] font-semibold text-slate-400 uppercase"
                            style={{ fontWeight: 600 }}
                          >
                            Time
                          </p>
                          <p
                            className="text-xs font-semibold text-slate-800"
                            style={{ fontWeight: 600 }}
                          >
                            {booking.startTime}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <BookOpen size={16} />
                        </div>
                        <div>
                          <p
                            className="text-[10px] font-semibold text-slate-400 uppercase"
                            style={{ fontWeight: 600 }}
                          >
                            Session
                          </p>
                          <p
                            className="text-xs font-semibold text-slate-800 truncate max-w-[100px]"
                            style={{ fontWeight: 600 }}
                          >
                            {booking.sessionType}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Timer size={16} />
                        </div>
                        <div>
                          <p
                            className="text-[10px] font-semibold text-slate-400 uppercase"
                            style={{ fontWeight: 600 }}
                          >
                            Duration
                          </p>
                          <p
                            className="text-xs font-semibold text-slate-800"
                            style={{ fontWeight: 600 }}
                          >
                            {booking.duration} min
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3.5 rounded-2xl col-span-2 md:col-span-1">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <IndianRupee size={16} />
                        </div>
                        <div>
                          <p
                            className="text-[10px] font-semibold text-slate-400 uppercase"
                            style={{ fontWeight: 600 }}
                          >
                            Amount
                          </p>
                          <p
                            className="text-xs font-semibold text-blue-600"
                            style={{ fontWeight: 600 }}
                          >
                            ₹{booking.amount}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Status & Notes */}
                    <div className="grid md:grid-cols-2 gap-4 mt-2">
                      <div
                        className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-xs font-semibold"
                        style={{ fontWeight: 600 }}
                      >
                        <CreditCard size={15} className="text-slate-500" />
                        <span className="text-slate-500">Payment Status:</span>
                        <span
                          className={`font-semibold ${
                            booking.paymentStatus === "Paid"
                              ? "text-emerald-600"
                              : booking.paymentStatus === "Refunded"
                              ? "text-purple-600"
                              : "text-amber-600"
                          }`}
                          style={{ fontWeight: 600 }}
                        >
                          {booking.paymentStatus}
                        </span>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-xs">
                        <span
                          className="font-semibold text-slate-500 uppercase tracking-wide text-[10px] block mb-0.5"
                          style={{ fontWeight: 600 }}
                        >
                          Session Notes
                        </span>
                        <p
                          className="text-slate-700 font-medium truncate"
                          style={{ fontWeight: 600 }}
                        >
                          {booking.notes ||
                            "No custom instructions or notes added."}
                        </p>
                      </div>
                    </div>

                    {/* Cancellation details box if cancelled */}
                    {booking.bookingStatus === "Cancelled" && (
                      <div
                        className="mt-4 rounded-2xl border border-red-200 bg-red-50/50 p-4 text-xs font-medium"
                        style={{ fontWeight: 600 }}
                      >
                        <p
                          className="font-semibold text-red-700 uppercase tracking-wide mb-1"
                          style={{ fontWeight: 600 }}
                        >
                          Cancellation Summary
                        </p>
                        <p className="text-slate-700">
                          <span
                            className="font-semibold"
                            style={{ fontWeight: 600 }}
                          >
                            By:
                          </span>{" "}
                          {booking.cancelledBy || "Student"} |{" "}
                          <span
                            className="font-semibold"
                            style={{ fontWeight: 600 }}
                          >
                            Reason:
                          </span>{" "}
                          {booking.cancellationReason || "No reason specified."}
                        </p>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-100">
                      {(booking.bookingStatus === "Pending" ||
                        booking.bookingStatus === "Confirmed") && (
                        <button
                          onClick={() => openCancelModal(booking)}
                          className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition"
                          style={{ fontWeight: 600 }}
                        >
                          Cancel Booking
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteBooking(booking._id)}
                        className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-red-600 hover:text-white text-xs font-semibold transition"
                        style={{ fontWeight: 600 }}
                      >
                        Delete Record
                      </button>

                      {booking.bookingStatus === "Confirmed" && (
                        <>
                          {meetingExpired ? (
                            <button
                              disabled
                              className="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-500 text-xs font-semibold cursor-not-allowed"
                              style={{ fontWeight: 600 }}
                            >
                              Session Completed
                            </button>
                          ) : canJoin ? (
                            <button
                              onClick={() =>
                                handleJoinGoogleMeet(
                                  booking.meeting?.roomId,
                                  booking._id
                                )
                              }
                              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition"
                              style={{ fontWeight: 600 }}
                            >
                              <ExternalLink size={15} />
                              Join Live Connect
                            </button>
                          ) : (
                            <button
                              disabled
                              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-not-allowed"
                              style={{ fontWeight: 600 }}
                            >
                              Join in {formatCountdown(secondsUntilJoin)}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 sm:p-8 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h2
                className="text-lg font-semibold text-slate-900"
                style={{ fontWeight: 600 }}
              >
                Cancel & Refund Summary
              </h2>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBookingId(null);
                  setCancelReason("");
                }}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div
              className="bg-slate-50 rounded-2xl p-4 mt-5 border border-slate-200 space-y-2 text-xs font-medium"
              style={{ fontWeight: 600 }}
            >
              <div className="flex justify-between text-slate-600">
                <span className="font-semibold" style={{ fontWeight: 600 }}>
                  Session Fee Paid:
                </span>
                <span
                  className="font-semibold text-slate-900"
                  style={{ fontWeight: 600 }}
                >
                  ₹{refundDetails.amount}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-semibold" style={{ fontWeight: 600 }}>
                  Refund Policy Eligibility:
                </span>
                <span
                  className={`font-semibold ${
                    refundDetails.eligible
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {refundDetails.eligible
                    ? "Eligible (100% Refund)"
                    : "Non-refundable (< 24 hrs)"}
                </span>
              </div>
              <div
                className="border-t border-slate-200 pt-2 flex justify-between font-semibold text-sm text-slate-900"
                style={{ fontWeight: 600 }}
              >
                <span>Expected Refund Amount:</span>
                <span className="text-blue-600">
                  ₹{refundDetails.eligible ? refundDetails.amount : 0}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <label
                className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
                style={{ fontWeight: 600 }}
              >
                Reason for Cancellation *
              </label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Briefly state why you need to reschedule or cancel..."
                className="w-full border border-slate-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-blue-600 text-xs font-medium text-slate-800"
                style={{ fontWeight: 600 }}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBookingId(null);
                  setCancelReason("");
                }}
                className="w-1/2 py-3 border border-slate-200 rounded-2xl hover:bg-slate-50 font-semibold text-xs text-slate-700 transition"
                style={{ fontWeight: 600 }}
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                className="w-1/2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-semibold text-xs shadow-sm transition"
                style={{ fontWeight: 600 }}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
