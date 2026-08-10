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
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
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

  // Update every second for live countdown timers
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700";
      case "Completed":
        return "bg-blue-100 text-blue-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Rejected":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const borderColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "border-green-500";
      case "Completed":
        return "border-blue-500";
      case "Cancelled":
        return "border-red-500";
      case "Rejected":
        return "border-gray-400";
      default:
        return "border-yellow-500";
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
          body: JSON.stringify({
            cancellationReason: cancelReason,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);

        setBookings((prev) =>
          prev.map((booking) =>
            booking._id === selectedBookingId
              ? {
                  ...booking,
                  bookingStatus: "Cancelled",
                  cancelledBy: "Student",
                  cancellationReason: cancelReason,
                  paymentStatus: refundDetails.eligible
                    ? "Refunded"
                    : booking.paymentStatus,
                }
              : booking
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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("UserToken");

      const res = await fetch(
        `${API_BASE_URL}/api/booking/delete/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setBookings((prev) =>
          prev.filter((booking) => booking._id !== bookingId)
        );
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Unable to delete booking.");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-4 border-blue-100"></div>
          <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
        </div>
        <p className="mt-5 text-gray-700 font-medium">
          Loading your bookings...
        </p>
        <p className="mt-1 text-sm text-gray-400">Please wait a moment</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">📅 My Bookings</h1>
          <p className="text-gray-500 mt-2">
            Manage all your mentoring sessions in one place.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
              className="w-36 mx-auto"
              alt="No bookings"
            />
            <h2 className="text-3xl font-bold mt-8">No Bookings Yet</h2>
            <p className="text-gray-500 mt-3">
              Book your first mentoring session and start learning.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
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
                  className={`bg-white rounded-3xl border-l-4 ${borderColor(
                    booking.bookingStatus
                  )} shadow-md hover:shadow-xl transition duration-300`}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-5">
                      <div
                        onClick={() =>
                          navigate(`/mentor/profile/${mentor?._id}`)
                        }
                        className="flex gap-4 cursor-pointer group"
                      >
                        <img
                          src={image}
                          alt={`${mentor?.firstName} ${mentor?.lastName}`}
                          className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 group-hover:border-blue-500 transition"
                        />
                        <div>
                          <h2 className="text-xl font-bold group-hover:text-blue-600 transition">
                            {mentor?.firstName} {mentor?.lastName}
                          </h2>
                          <p className="text-gray-500">{mentor?.profession}</p>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-2">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColor(
                            booking.bookingStatus
                          )}`}
                        >
                          {booking.bookingStatus}
                        </span>

                        <button
                          onClick={() => navigate(`/disputes`)}
                          className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-semibold transition"
                        >
                          <AlertTriangle size={14} />
                          Report Issue / Dispute
                        </button>

                        <p className="text-xs text-gray-400 mt-1">
                          Booked on{" "}
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-8">
                      <div className="flex items-center gap-3">
                        <Calendar className="text-blue-600" size={20} />
                        <div>
                          <p className="text-gray-400 text-sm">Date</p>
                          <p className="font-semibold">
                            {new Date(booking.sessionDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="text-blue-600" size={20} />
                        <div>
                          <p className="text-gray-400 text-sm">Time</p>
                          <p className="font-semibold">{booking.startTime}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <BookOpen className="text-blue-600" size={20} />
                        <div>
                          <p className="text-gray-400 text-sm">Session</p>
                          <p className="font-semibold">{booking.sessionType}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Timer className="text-blue-600" size={20} />
                        <div>
                          <p className="text-gray-400 text-sm">Duration</p>
                          <p className="font-semibold">
                            {booking.duration} min
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <IndianRupee className="text-blue-600" size={20} />
                        <div>
                          <p className="text-gray-400 text-sm">Amount</p>
                          <p className="font-bold text-blue-600">
                            ₹{booking.amount}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment */}
                    <div className="mt-6 flex items-center gap-3">
                      <CreditCard size={18} className="text-gray-500" />
                      <span className="text-sm text-gray-600">Payment:</span>
                      <span
                        className={`font-semibold ${
                          booking.paymentStatus === "Paid"
                            ? "text-green-600"
                            : booking.paymentStatus === "Refunded"
                            ? "text-purple-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </div>

                    {/* Notes */}
                    <div className="mt-6 border-l-4 border-blue-500 bg-blue-50 rounded-xl p-4">
                      <p className="text-xs uppercase tracking-wide font-semibold text-blue-600">
                        Session Notes
                      </p>
                      <p className="mt-2 text-gray-700">
                        {booking.notes || "No notes added."}
                      </p>
                    </div>

                    {/* Cancellation Details */}
                    {booking.bookingStatus === "Cancelled" && (
                      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
                        <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wide">
                          Cancellation Details
                        </h3>
                        <div className="mt-3 space-y-2 text-sm">
                          <p>
                            <span className="font-medium text-gray-700">
                              Cancelled By:
                            </span>{" "}
                            <span className="text-red-600 font-semibold">
                              {booking.cancelledBy}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium text-gray-700">
                              Reason:
                            </span>{" "}
                            <span className="text-gray-600">
                              {booking.cancellationReason ||
                                "No reason provided."}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-end gap-3 mt-6">
                      {(booking.bookingStatus === "Pending" ||
                        booking.bookingStatus === "Confirmed") && (
                        <button
                          onClick={() => openCancelModal(booking)}
                          className="px-6 py-3 rounded-xl border border-red-500 text-red-600 hover:bg-red-50 font-semibold transition"
                        >
                          Cancel Booking
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteBooking(booking._id)}
                        className="px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                      >
                        Delete Booking
                      </button>

                      {booking.bookingStatus === "Confirmed" && (
                        <>
                          {meetingExpired ? (
                            <button
                              disabled
                              className="px-6 py-3 rounded-xl bg-gray-400 text-white cursor-not-allowed"
                            >
                              Meeting Ended
                            </button>
                          ) : canJoin ? (
                            <button
                              onClick={() =>
                                handleJoinGoogleMeet(
                                  booking.meeting?.roomId,
                                  booking._id
                                )
                              }
                              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                            >
                              <ExternalLink size={18} />
                              Join Google Meet
                            </button>
                          ) : (
                            <button
                              disabled
                              className="px-6 py-3 rounded-xl bg-gray-400 text-white cursor-not-allowed"
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

      {/* CHECKOUT-STYLE CANCELLATION & REFUND MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Cancel & Refund Summary
              </h2>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBookingId(null);
                  setCancelReason("");
                }}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl"
              >
                &times;
              </button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mt-4 border border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Session Fee Paid:</span>
                <span className="font-semibold text-gray-800">
                  ₹{refundDetails.amount}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Refund Eligibility:</span>
                <span
                  className={`font-semibold ${
                    refundDetails.eligible ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {refundDetails.eligible
                    ? "Eligible (100% Refund)"
                    : "Not Eligible (< 24 hrs)"}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-base text-gray-900">
                <span>Expected Refund:</span>
                <span className="text-emerald-600">
                  ₹{refundDetails.eligible ? refundDetails.amount : 0}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Reason for Cancellation
              </label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Let us know why you're cancelling..."
                className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-300 text-sm"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBookingId(null);
                  setCancelReason("");
                }}
                className="w-1/2 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 font-medium text-gray-700 transition"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                className="w-1/2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-md transition"
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
