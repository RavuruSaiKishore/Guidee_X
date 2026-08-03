import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  ArrowLeft,
  CalendarDays,
  User,
  Briefcase,
  Clock,
  IndianRupee,
  CheckCircle2,
  MessageSquareText,
  Star,
  Printer,
  XCircle,
  Video,
  CreditCard,
  FileText,
} from "lucide-react";

const BookingDetails = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("AdminToken");

  const navigate = useNavigate();
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // FETCH BOOKING
  // =========================================================

  useEffect(() => {
    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/api/admin/bookings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        toast.error(data.message || "Failed to fetch booking details");
        return;
      }

      setBooking(data.booking);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch booking details");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const getImageUrl = (image) => {
    if (!image) return "/default-avatar.png";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${API_BASE_URL}${image.startsWith("/") ? image : `/${image}`}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getBookingStatusClass = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-100 text-blue-700";

      case "Completed":
        return "bg-green-100 text-green-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Cancelled":
      case "Rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Refunded":
        return "bg-blue-100 text-blue-700";

      case "Failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="h-14 w-14 rounded-full border-4 border-blue-100" />

          <div className="absolute inset-0 h-14 w-14 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
        </div>

        <p className="mt-5 text-lg font-semibold text-gray-700">
          Loading booking details...
        </p>

        <p className="text-sm text-gray-400 mt-1">
          Please wait while we fetch the booking information.
        </p>
      </div>
    );
  }

  // =========================================================
  // BOOKING NOT FOUND
  // =========================================================

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center max-w-md w-full">
          <XCircle className="w-14 h-14 text-red-500 mx-auto" />

          <h2 className="text-xl font-bold text-gray-800 mt-4">
            Booking Not Found
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            The booking you're looking for doesn't exist or has been removed.
          </p>

          <button
            onClick={() => navigate("/admin/bookings")}
            className="mt-6 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-4 md:p-6">
      <ToastContainer position="top-right" />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/admin/bookings")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition mb-4"
        >
          <ArrowLeft size={18} />
          Back to Bookings
        </button>

        {/* PAGE HEADER */}

        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-5 sm:p-6 md:p-7">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                  <CalendarDays className="text-white" size={26} />
                </div>

                <div className="min-w-0">
                  <p className="text-blue-100 text-xs uppercase tracking-widest">
                    Booking Details
                  </p>

                  <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                    {booking.student?.firstName || "Unknown"}{" "}
                    {booking.student?.lastName || ""}
                  </h1>

                  <p className="text-blue-100 text-sm mt-1 break-all">
                    Booking ID: {booking._id}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-4 py-2 rounded-full text-xs font-bold ${getBookingStatusClass(
                    booking.bookingStatus
                  )}`}
                >
                  {booking.bookingStatus || "Unknown"}
                </span>

                <span
                  className={`px-4 py-2 rounded-full text-xs font-bold ${getPaymentStatusClass(
                    booking.paymentStatus
                  )}`}
                >
                  {booking.paymentStatus || "Pending"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            PEOPLE
        ===================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
          {/* STUDENT */}

          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <User size={20} className="text-blue-600" />
              </div>

              <div>
                <h2 className="font-bold text-gray-800">Student Information</h2>

                <p className="text-xs text-gray-500">
                  Student associated with this booking
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={getImageUrl(booking.student?.profileImage)}
                alt="Student"
                className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/default-avatar.png";
                }}
              />

              <div className="min-w-0">
                <h3 className="font-bold text-gray-800 truncate">
                  {booking.student?.firstName || "Unknown"}{" "}
                  {booking.student?.lastName || ""}
                </h3>

                <p className="text-sm text-gray-500 break-all">
                  {booking.student?.email || "No email"}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-xs uppercase tracking-wider text-gray-400">
                Student ID
              </p>

              <p className="text-sm font-medium text-gray-700 mt-1 break-all">
                {booking.student?._id || "-"}
              </p>
            </div>
          </div>

          {/* MENTOR */}

          <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Briefcase size={20} className="text-indigo-600" />
              </div>

              <div>
                <h2 className="font-bold text-gray-800">Mentor Information</h2>

                <p className="text-xs text-gray-500">
                  Mentor associated with this booking
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={getImageUrl(booking.mentor?.profileImage)}
                alt="Mentor"
                className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/default-avatar.png";
                }}
              />

              <div className="min-w-0">
                <h3 className="font-bold text-gray-800 truncate">
                  {booking.mentor?.firstName || "Unknown"}{" "}
                  {booking.mentor?.lastName || ""}
                </h3>

                <p className="text-sm text-gray-500">
                  {booking.mentor?.profession || "Mentor"}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-xs uppercase tracking-wider text-gray-400">
                Mentor ID
              </p>

              <p className="text-sm font-medium text-gray-700 mt-1 break-all">
                {booking.mentor?._id || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            SESSION DETAILS
        ===================================================== */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 mt-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <CalendarDays size={20} className="text-blue-600" />
            </div>

            <div>
              <h2 className="font-bold text-gray-800">Session Details</h2>

              <p className="text-xs text-gray-500">
                Information about the scheduled mentoring session
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-xs uppercase text-gray-400">Session Type</p>

              <p className="font-bold text-gray-800 mt-2">
                {booking.sessionType || "-"}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs uppercase text-blue-500">Session Date</p>

              <p className="font-bold text-gray-800 mt-2">
                {formatDate(booking.sessionDate)}
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="text-xs uppercase text-amber-600">Session Time</p>

              <p className="font-bold text-gray-800 mt-2">
                {booking.startTime || "-"} - {booking.endTime || "-"}
              </p>
            </div>

            <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
              <p className="text-xs uppercase text-violet-600">Duration</p>

              <p className="font-bold text-gray-800 mt-2">
                {booking.duration || 0} Minutes
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <p className="text-xs uppercase text-emerald-600">Amount</p>

              <p className="text-xl font-extrabold text-emerald-600 mt-1">
                ₹{booking.amount?.toLocaleString("en-IN") || 0}
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs uppercase text-gray-400">Created On</p>

              <p className="font-bold text-gray-800 mt-2">
                {formatDate(booking.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            MEETING + NOTES
        ===================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          {/* MEETING */}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <Video size={20} className="text-violet-600" />
              </div>

              <div>
                <h2 className="font-bold text-gray-800">Meeting Details</h2>

                <p className="text-xs text-gray-500">
                  Online session information
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
              <p className="text-xs uppercase text-gray-400">Meeting Status</p>

              <p className="font-bold text-gray-800 mt-2">
                {booking.meeting?.status || "Pending"}
              </p>
            </div>

            <div className="mt-3 bg-gray-50 rounded-xl border border-gray-100 p-4">
              <p className="text-xs uppercase text-gray-400">Meeting Link</p>

              {booking.meeting?.roomId ? (
                <a
                  href={booking.meeting.roomId}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm text-blue-600 hover:underline break-all mt-2"
                >
                  {booking.meeting.roomId}
                </a>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  No meeting link available.
                </p>
              )}
            </div>
          </div>

          {/* NOTES */}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <FileText size={20} className="text-gray-600" />
              </div>

              <div>
                <h2 className="font-bold text-gray-800">Booking Notes</h2>

                <p className="text-xs text-gray-500">
                  Notes provided during booking
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 min-h-[130px]">
              <p className="text-sm text-gray-700 leading-7 whitespace-pre-wrap break-words">
                {booking.notes || "No notes available."}
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            PAYMENT
        ===================================================== */}

        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 sm:p-6 mt-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CreditCard size={20} className="text-emerald-600" />
              </div>

              <div>
                <h2 className="font-bold text-gray-800">Payment Information</h2>

                <p className="text-xs text-gray-500">
                  Payment and transaction details
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <IndianRupee size={20} className="text-emerald-600" />

              <span className="text-2xl font-extrabold text-emerald-600">
                {booking.amount?.toLocaleString("en-IN") || 0}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs uppercase text-gray-400">Payment Status</p>

              <span
                className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-bold ${getPaymentStatusClass(
                  booking.paymentStatus
                )}`}
              >
                {booking.paymentStatus || "Pending"}
              </span>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs uppercase text-gray-400">Order ID</p>

              <p className="text-sm font-medium text-gray-700 mt-2 break-all">
                {booking.orderId || "-"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs uppercase text-gray-400">Payment ID</p>

              <p className="text-sm font-medium text-gray-700 mt-2 break-all">
                {booking.paymentId || "-"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs uppercase text-gray-400">Currency</p>

              <p className="font-semibold text-gray-700 mt-2">
                {booking.currency || "INR"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 sm:col-span-2">
              <p className="text-xs uppercase text-gray-400">
                Payment Signature
              </p>

              <p className="text-sm font-medium text-gray-700 mt-2 break-all">
                {booking.paymentSignature || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            REVIEW
        ===================================================== */}

        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5 sm:p-6 mt-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Star size={21} className="fill-amber-500 text-amber-500" />
              </div>

              <div>
                <h2 className="font-bold text-gray-800">Student Review</h2>

                <p className="text-xs text-gray-500">
                  Feedback submitted for this session
                </p>
              </div>
            </div>

            {booking.reviewSubmitted ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700">
                <CheckCircle2 size={16} />
                Review Submitted
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-gray-600">
                <MessageSquareText size={16} />
                No Review
              </span>
            )}
          </div>

          {booking.reviewSubmitted && booking.review ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Rating
                </p>

                <div className="flex gap-1 mt-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={
                        star <= booking.review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>

                <p className="text-2xl font-bold text-gray-800 mt-3">
                  {booking.review.rating}
                  <span className="text-sm text-gray-500"> / 5</span>
                </p>
              </div>

              <div className="md:col-span-2 bg-gray-50 rounded-xl p-5">
                <div className="flex items-center gap-2">
                  <MessageSquareText size={18} className="text-indigo-600" />

                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Student Feedback
                  </p>
                </div>

                <p className="mt-4 text-sm text-gray-700 leading-7 whitespace-pre-wrap break-words">
                  {booking.review.review || "No written feedback provided."}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
                  Submitted on:{" "}
                  <span className="font-medium text-gray-700">
                    {formatDate(booking.review.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <MessageSquareText size={28} className="text-gray-400 mx-auto" />

              <h3 className="font-semibold text-gray-700 mt-3">
                No Review Submitted
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                The student has not submitted a review for this session.
              </p>
            </div>
          )}
        </div>

        {/* =====================================================
            CANCELLATION
        ===================================================== */}

        {booking.bookingStatus === "Cancelled" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 sm:p-6 mt-5">
            <div className="flex items-center gap-3 mb-5">
              <XCircle size={22} className="text-red-600" />

              <h2 className="font-bold text-red-700">Cancellation Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4">
                <p className="text-xs uppercase text-gray-500">Cancelled By</p>

                <p className="font-semibold mt-2">
                  {booking.cancelledBy || "-"}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4">
                <p className="text-xs uppercase text-gray-500">
                  Cancellation Reason
                </p>

                <p className="mt-2 text-sm text-gray-700">
                  {booking.cancellationReason || "No reason provided."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            FOOTER ACTIONS
        ===================================================== */}

        <div className="flex flex-col sm:flex-row justify-between gap-3 py-6">
          <button
            onClick={() => navigate("/admin/bookings")}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium transition flex items-center justify-center gap-2"
          >
            <ArrowLeft size={17} />
            Back to Bookings
          </button>

          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition flex items-center justify-center gap-2"
          >
            <Printer size={17} />
            Print Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
