import { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RotateCcw,
  Calendar,
  IndianRupee,
  CheckCircle,
  Clock,
  CalendarCheck2,
  CalendarDays,
  Activity,
  Star,
  MessageSquareText,
  CheckCircle2,
  X,
  Printer,
  Trash2,
  User,
  Briefcase,
} from "lucide-react";

const BookingManagement = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("AdminToken");
  const navigate = useNavigate();

  // =========================================================
  // STATES
  // =========================================================

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteBooking, setDeleteBooking] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [paymentFilter, setPaymentFilter] = useState("All Payments");

  const [deleting, setDeleting] = useState(false);

  // =========================================================
  // FETCH BOOKINGS
  // =========================================================

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/admin/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to fetch bookings");
        return;
      }

      setBookings(data.bookings || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All Status");
    setPaymentFilter("All Payments");
  };

  // =========================================================
  // FILTER BOOKINGS
  // =========================================================

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const studentName = `${booking.student?.firstName || ""} ${
        booking.student?.lastName || ""
      }`.toLowerCase();

      const mentorName = `${booking.mentor?.firstName || ""} ${
        booking.mentor?.lastName || ""
      }`.toLowerCase();

      const email = (booking.student?.email || "").toLowerCase();

      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        studentName.includes(search) ||
        mentorName.includes(search) ||
        email.includes(search);

      const matchesBooking =
        statusFilter === "All Status"
          ? true
          : booking.bookingStatus === statusFilter;

      const matchesPayment =
        paymentFilter === "All Payments"
          ? true
          : booking.paymentStatus === paymentFilter;

      return matchesSearch && matchesBooking && matchesPayment;
    });
  }, [bookings, searchTerm, statusFilter, paymentFilter]);

  // =========================================================
  // STATS
  // =========================================================

  const stats = {
    total: bookings.length,

    confirmed: bookings.filter(
      (booking) => booking.bookingStatus === "Confirmed"
    ).length,

    pending: bookings.filter((booking) => booking.bookingStatus === "Pending")
      .length,

    revenue: bookings
      .filter((booking) => booking.paymentStatus === "Paid")
      .reduce((sum, booking) => sum + (booking.amount || 0), 0),
  };

  // =========================================================
  // DELETE BOOKING
  // =========================================================

  const handleDeleteBooking = async () => {
    if (!deleteBooking?._id) return;

    try {
      setDeleting(true);

      const res = await fetch(
        `${API_BASE_URL}/api/admin/bookings/${deleteBooking._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete booking");
        return;
      }

      toast.success("Booking deleted successfully.");

      setBookings((prev) =>
        prev.filter((booking) => booking._id !== deleteBooking._id)
      );

     setDeleteBooking(null);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setDeleting(false);
    }
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const getInitials = (person, fallback = "U") => {
    if (!person) return fallback;

    const first = person.firstName?.charAt(0) || "";
    const last = person.lastName?.charAt(0) || "";

    return `${first}${last}` || fallback;
  };

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

  const getStatusStripClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500";

      case "Confirmed":
        return "bg-blue-500";

      case "Pending":
        return "bg-yellow-500";

      case "Cancelled":
      case "Rejected":
        return "bg-red-500";

      default:
        return "bg-gray-400";
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col justify-center items-center px-5">
        <div className="relative">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-4 border-emerald-100" />

          <div className="absolute inset-0 h-14 w-14 sm:h-16 sm:w-16 rounded-full border-4 border-transparent border-t-emerald-600 animate-spin" />
        </div>

        <p className="mt-5 sm:mt-6 text-base sm:text-lg font-semibold text-gray-700 text-center">
          Loading your booking data...!
        </p>

        <p className="text-xs sm:text-sm text-gray-400 mt-1 text-center">
          Please wait while we fetch your schedule.
        </p>
      </div>
    );
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-4 md:p-6">
      <ToastContainer position="top-right" />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-5 sm:mb-6">
        {/* HERO */}
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-violet-700 via-indigo-600 to-purple-600 shadow-xl">
          <div className="px-4 py-5 sm:px-6 sm:py-7 md:px-8 md:py-8">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
              {/* HERO CONTENT */}

              <div className="flex items-start gap-3 sm:gap-5 min-w-0">
                <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <CalendarCheck2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white break-words">
                    Booking Management
                  </h1>

                  <p className="mt-2 text-sm sm:text-base text-indigo-100 max-w-2xl leading-6">
                    Monitor student bookings, track session status, manage
                    payments, and oversee all mentoring appointments from one
                    place.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/15 border border-white/20 text-white text-xs sm:text-sm">
                      <Activity size={14} />

                      <span>Showing</span>

                      <span className="font-semibold">
                        {filteredBookings.length}
                      </span>

                      <span>of</span>

                      <span className="font-semibold">{bookings.length}</span>

                      <span>Bookings</span>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/15 border border-white/20 text-white text-xs sm:text-sm">
                      <CalendarDays size={14} />

                      {new Date().toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* TOTAL CARD */}

              <div className="w-full xl:w-auto">
                <div className="bg-white rounded-2xl px-5 py-4 sm:px-6 sm:py-5 shadow-lg xl:min-w-[230px]">
                  <p className="text-gray-500 text-sm">Total Bookings</p>

                  <h2 className="text-3xl sm:text-4xl font-bold text-indigo-600 mt-1">
                    {bookings.length}
                  </h2>

                  <p className="text-green-600 text-sm mt-2">
                    Across All Mentors
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            FILTER TOOLBAR
        ================================================= */}

        <div className="bg-white rounded-2xl shadow-md border mt-4 sm:mt-5 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* SEARCH */}

            <div className="relative w-full lg:flex-1 lg:max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 sm:h-12 pl-11 pr-4 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm sm:text-base"
              />
            </div>

            {/* FILTERS */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 sm:h-12 w-full lg:min-w-[150px] px-4 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              >
                <option>All Status</option>
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Completed</option>
                <option>Cancelled</option>
                <option>Rejected</option>
              </select>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="h-11 sm:h-12 w-full lg:min-w-[150px] px-4 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              >
                <option>All Payments</option>
                <option>Pending</option>
                <option>Paid</option>
                <option>Refunded</option>
                <option>Failed</option>
              </select>

              <button
                onClick={handleClearFilters}
                className="h-11 sm:h-12 px-5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium flex items-center justify-center gap-2 transition"
              >
                <RotateCcw size={17} />
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-5 sm:mt-6">
        {/* TOTAL */}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase truncate">
                Total Bookings
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">
                {stats.total}
              </h2>
            </div>

            <div className="shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calendar size={19} className="text-blue-600 sm:w-[22px]" />
            </div>
          </div>
        </div>

        {/* CONFIRMED */}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                Confirmed
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-green-600 mt-1">
                {stats.confirmed}
              </h2>
            </div>

            <div className="shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle size={19} className="text-green-600 sm:w-[22px]" />
            </div>
          </div>
        </div>

        {/* PENDING */}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                Pending
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-yellow-600 mt-1">
                {stats.pending}
              </h2>
            </div>

            <div className="shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Clock size={19} className="text-yellow-600 sm:w-[22px]" />
            </div>
          </div>
        </div>

        {/* REVENUE */}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                Revenue
              </p>

              <h2 className="text-lg sm:text-2xl font-bold text-emerald-600 mt-1 truncate">
                ₹{stats.revenue.toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
              <IndianRupee size={19} className="text-emerald-600 sm:w-[22px]" />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOOKINGS LIST
      ===================================================== */}

      <div className="mt-4 sm:mt-5 space-y-3 sm:space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl py-14 sm:py-16 px-5 text-center shadow-sm">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center">
              <CalendarDays className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500" />
            </div>

            <h2 className="mt-4 text-lg sm:text-xl font-bold text-gray-700">
              No Bookings Found
            </h2>

            <p className="mt-1.5 text-sm text-gray-500">
              Try changing the search or filter options.
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* STATUS STRIP */}
              <div
                className={`absolute left-0 top-0 h-full w-1.5 ${getStatusStripClass(
                  booking.bookingStatus
                )}`}
              />

              <div className="p-4 sm:p-5 md:p-6">
                {/* =================================================
              BOOKING HEADER
          ================================================= */}

                <div className="flex flex-col 2xl:flex-row justify-between gap-5 lg:gap-6">
                  {/* PEOPLE */}
                  <div className="flex flex-col sm:flex-row flex-1 gap-4 sm:gap-6 min-w-0">
                    {/* STUDENT */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {booking.student?.profileImage ? (
                        <img
                          src={getImageUrl(booking.student.profileImage)}
                          alt={booking.student?.firstName || "Student"}
                          className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 shrink-0 rounded-xl object-cover border border-gray-200"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/default-avatar.png";
                          }}
                        />
                      ) : (
                        <div className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 shrink-0 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center text-base sm:text-lg font-bold">
                          {getInitials(booking.student)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-400">
                          Student
                        </p>

                        <h2 className="text-sm sm:text-base font-bold text-gray-800 truncate">
                          {booking.student?.firstName || "Unknown"}{" "}
                          {booking.student?.lastName || ""}
                        </h2>

                        <p className="text-xs text-gray-500 truncate max-w-[200px] sm:max-w-[260px]">
                          {booking.student?.email || "No email"}
                        </p>
                      </div>
                    </div>

                    {/* MENTOR */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {booking.mentor?.profileImage ? (
                        <img
                          src={getImageUrl(booking.mentor.profileImage)}
                          alt={booking.mentor?.firstName || "Mentor"}
                          className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 shrink-0 rounded-xl object-cover border border-gray-200"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/default-avatar.png";
                          }}
                        />
                      ) : (
                        <div className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 shrink-0 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-center text-base sm:text-lg font-bold">
                          {getInitials(booking.mentor)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-400">
                          Mentor
                        </p>

                        <h2 className="text-sm sm:text-base font-bold text-gray-800 truncate">
                          {booking.mentor?.firstName || "Unknown"}{" "}
                          {booking.mentor?.lastName || ""}
                        </h2>

                        <p className="text-xs text-gray-500 truncate max-w-[200px] sm:max-w-[260px]">
                          {booking.mentor?.profession || "Mentor"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AMOUNT */}
                  <div className="flex flex-col sm:flex-row 2xl:flex-col items-start sm:items-center 2xl:items-end gap-2.5 sm:gap-3">
                    <div className="text-left sm:text-right">
                      <p className="text-[9px] sm:text-[10px] uppercase text-gray-400 tracking-wider">
                        Total Amount
                      </p>

                      <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-emerald-600">
                        ₹{booking.amount?.toLocaleString("en-IN") || 0}
                      </h1>
                    </div>

                    <div className="flex gap-2 flex-wrap justify-start sm:justify-end">
                      <span
                        className={`px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold ${getPaymentStatusClass(
                          booking.paymentStatus
                        )}`}
                      >
                        {booking.paymentStatus || "Pending"}
                      </span>

                      <span
                        className={`px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold ${getBookingStatusClass(
                          booking.bookingStatus
                        )}`}
                      >
                        {booking.bookingStatus || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* =================================================
              DETAILS
          ================================================= */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-2.5 sm:gap-3 mt-5 sm:mt-6">
                  {/* SESSION */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400">
                      Session
                    </p>

                    <h3 className="font-bold text-sm text-gray-800 mt-1.5 break-words">
                      {booking.sessionType || "-"}
                    </h3>

                    <p className="text-xs text-gray-500 mt-0.5">
                      {booking.duration || 0} Minutes
                    </p>
                  </div>

                  {/* DATE */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                    <p className="text-[10px] uppercase tracking-wider text-blue-500">
                      Date
                    </p>

                    <h3 className="font-bold text-sm text-gray-800 mt-1.5">
                      {formatDate(booking.sessionDate)}
                    </h3>

                    <p className="text-xs text-gray-500 mt-0.5">Scheduled</p>
                  </div>

                  {/* TIME */}
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <p className="text-[10px] uppercase tracking-wider text-amber-600">
                      Time
                    </p>

                    <h3 className="font-bold text-sm text-gray-800 mt-1.5">
                      {booking.startTime || "-"}
                    </h3>

                    <p className="text-xs text-gray-500 mt-0.5">
                      {booking.endTime || "-"}
                    </p>
                  </div>

                  {/* MEETING */}
                  <div className="bg-violet-50 border border-violet-100 rounded-xl p-3">
                    <p className="text-[10px] uppercase tracking-wider text-violet-600">
                      Meeting
                    </p>

                    <h3 className="font-bold text-sm text-gray-800 mt-1.5">
                      {booking.meeting?.status || "Pending"}
                    </h3>

                    <p className="text-xs text-gray-500 mt-0.5">
                      {booking.meeting?.meetingLink
                        ? "Link Generated"
                        : "No Link"}
                    </p>
                  </div>

                  {/* BOOKING ID */}
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                    <p className="text-[10px] uppercase tracking-wider text-emerald-600">
                      Booking ID
                    </p>

                    <h3 className="font-bold text-sm text-gray-800 mt-1.5 truncate">
                      #{booking._id?.slice(-8)}
                    </h3>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Booking Record
                    </p>
                  </div>
                </div>

                {/* NOTES */}
                {booking.notes && (
                  <div className="mt-4 sm:mt-5 bg-gray-50 border border-gray-200 rounded-xl p-3.5 sm:p-4">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
                      Notes
                    </p>

                    <p className="text-sm text-gray-700 leading-6 break-words">
                      {booking.notes}
                    </p>
                  </div>
                )}

                {/* =================================================
              FOOTER
          ================================================= */}

                <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-200">
                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                    {/* META */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400">
                          Created On
                        </p>

                        <p className="font-semibold text-gray-700 mt-0.5 text-sm">
                          {formatDate(booking.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400">
                          Currency
                        </p>

                        <p className="font-semibold text-gray-700 mt-0.5 text-sm">
                          {booking.currency || "INR"}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400">
                          Payment ID
                        </p>

                        <p className="font-semibold text-gray-700 mt-0.5 truncate max-w-[220px] text-sm">
                          {booking.paymentId || "Not Available"}
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-col sm:flex-row gap-2.5 w-full xl:w-auto">
                      <button
                        onClick={() =>
                          navigate(`/admin/bookings/${booking._id}`)
                        }
                        className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition shadow-sm hover:shadow-md"
                      >
                        View Details
                      </button>

                      <button
                        onClick={() => setDeleteBooking(booking)}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 text-sm transition"
                      >
                        Delete Booking
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* =====================================================
          BOOKING DETAILS MODAL
      ===================================================== */}

  

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {deleteBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-5">
          <div className="w-full max-w-lg max-h-[95vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white shadow-2xl">
            {/* HEADER */}

            <div className="bg-gradient-to-r from-red-600 to-rose-600 p-5 sm:p-7 text-white">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                  <Trash2 size={22} />
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    Delete Booking
                  </h2>

                  <p className="text-red-100 mt-1 text-sm">
                    This action is permanent and cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* BODY */}

            <div className="p-4 sm:p-6 md:p-7 space-y-4 sm:space-y-6">
              {/* STUDENT */}

              <div className="bg-gray-50 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-blue-600" />

                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Student
                  </p>
                </div>

                <h3 className="text-lg font-bold mt-3">
                  {deleteBooking.student?.firstName}{" "}
                  {deleteBooking.student?.lastName}
                </h3>

                <p className="text-gray-500 mt-1 break-all text-sm">
                  {deleteBooking.student?.email}
                </p>
              </div>

              {/* MENTOR */}

              <div className="bg-gray-50 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <Briefcase size={18} className="text-indigo-600" />

                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Mentor
                  </p>
                </div>

                <h3 className="text-lg font-bold mt-3">
                  {deleteBooking.mentor?.firstName}{" "}
                  {deleteBooking.mentor?.lastName}
                </h3>

                <p className="text-gray-500 mt-1">
                  {deleteBooking.mentor?.profession || "N/A"}
                </p>
              </div>

              {/* SUMMARY */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs text-blue-500">Session</p>

                  <p className="font-semibold mt-1">
                    {deleteBooking.sessionType || "-"}
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-xs text-green-500">Amount</p>

                  <p className="font-bold text-green-600 text-lg mt-1">
                    ₹{deleteBooking.amount?.toLocaleString("en-IN") || 0}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-xs text-purple-500">Date</p>

                  <p className="font-semibold mt-1">
                    {formatDate(deleteBooking.sessionDate)}
                  </p>
                </div>

                <div className="bg-yellow-50 rounded-xl p-4">
                  <p className="text-xs text-yellow-600">Time</p>

                  <p className="font-semibold mt-1">
                    {deleteBooking.startTime || "-"} -{" "}
                    {deleteBooking.endTime || "-"}
                  </p>
                </div>
              </div>

              {/* WARNING */}

              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5">
                <h4 className="font-bold text-red-700">Warning</h4>

                <p className="text-red-600 mt-3 leading-7">
                  Deleting this booking will permanently remove:
                </p>

                <ul className="mt-4 space-y-2 text-red-600 list-disc list-inside text-sm">
                  <li>Booking information</li>
                  <li>Meeting details</li>
                  <li>Payment records</li>
                  <li>Session history</li>
                </ul>
              </div>
            </div>

            {/* FOOTER */}

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t bg-gray-50 p-4 sm:p-6">
              <button
                onClick={() => setDeleteBooking(null)}
                disabled={deleting}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteBooking}
                disabled={deleting}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold transition flex items-center justify-center gap-2"
              >
                <Trash2 size={17} />

                {deleting ? "Deleting..." : "Delete Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
