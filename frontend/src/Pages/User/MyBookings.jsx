import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  IndianRupee,
  ExternalLink,
  User,
  CreditCard,
  Timer,
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

  useEffect(() => {
    fetchBookings();
  }, []);

  //Update every second
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
      console.log(data);

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
   const meetingStart = new Date(booking.sessionDate);

   let [time, period] = booking.startTime.split(" ");

   let [hours, minutes] = time.split(":").map(Number);

   period = period.toLowerCase();

   if (period === "pm" && hours !== 12) {
     hours += 12;
   }

   if (period === "am" && hours === 12) {
     hours = 0;
   }

   meetingStart.setHours(hours, minutes, 0, 0);

   const meetingEnd = new Date(
     meetingStart.getTime() + booking.duration * 60 * 1000
   );

   const joinTime = new Date(meetingStart.getTime() - 10 * 60 * 1000);

   return {
     meetingStart,
     meetingEnd,
     joinTime,
   };
 };

 
  const formatCountdown = (seconds) => {
    const hrs = Math.floor(seconds / 3600);

    const mins = Math.floor((seconds % 3600) / 60);

    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
      console.log(data);

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
        {/* Spinner */}
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-4 border-blue-100"></div>
          <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
        </div>

        {/* Loading text */}
        <p className="mt-5 text-gray-700 font-medium">
          Loading your bookings...
        </p>

        {/* Sub text */}
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

              const image = mentor.profileImage
                ? mentor.profileImage.startsWith("http")
                  ? mentor.profileImage
                  : `${API_BASE_URL}/${mentor.profileImage.replace(/^\/+/, "")}`
                : `https://ui-avatars.com/api/?name=${mentor.firstName}+${mentor.lastName}`;

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
                          navigate(`/mentor/profile/${mentor._id}`)
                        }
                        className="flex gap-4 cursor-pointer group"
                      >
                        <img
                          src={image}
                          alt={`${mentor.firstName} ${mentor.lastName}`}
                          className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 group-hover:border-blue-500 transition"
                        />

                        <div>
                          <h2 className="text-xl font-bold group-hover:text-blue-600 transition">
                            {mentor.firstName} {mentor.lastName}
                          </h2>

                          <p className="text-gray-500">{mentor.profession}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColor(
                            booking.bookingStatus
                          )}`}
                        >
                          {booking.bookingStatus}
                        </span>

                        <p className="text-xs text-gray-400 mt-2">
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
                          onClick={() => {
                            setSelectedBookingId(booking._id);
                            setShowCancelModal(true);
                          }}
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
                          {canJoin ? (
                            <button
                              onClick={() =>
                                navigate(`/meeting/${booking.meeting.roomId}`)
                              }
                              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                            >
                              <ExternalLink size={18} />
                              Join Meeting
                            </button>
                          ) : meetingExpired ? (
                            <button
                              disabled
                              className="px-6 py-3 rounded-xl bg-gray-400 text-white cursor-not-allowed"
                            >
                              Meeting Ended
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
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-2xl font-bold">Cancel Booking</h2>

            <p className="text-gray-500 mt-2">
              Please tell us why you are cancelling this booking.
            </p>

            <textarea
              rows={4}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter cancellation reason..."
              className="w-full mt-5 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-300"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBookingId(null);
                  setCancelReason("");
                }}
                className="px-5 py-2 border rounded-xl hover:bg-gray-100"
              >
                Close
              </button>

              <button
                onClick={handleCancelBooking}
                className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
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

export default MyBookings;
