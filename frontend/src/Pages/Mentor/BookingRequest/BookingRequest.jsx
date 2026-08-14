import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Search,
  Mail,
  Clock3,
  IndianRupee,
  CreditCard,
  BookOpenCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";

const PendingBookings = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  // =========================================================
  // FETCH PENDING BOOKINGS
  // =========================================================

  const fetchPendingBookings = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("MentorToken");

      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/mentor/pending`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        toast.error(data.message || "Failed to fetch booking requests.");
      }
    } catch (error) {
      console.error("Error fetching pending bookings:", error);
      toast.error("Failed to load booking requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  // =========================================================
  // APPROVE BOOKING
  // =========================================================

  const approveBooking = async (bookingId) => {
    try {
      setApprovingId(bookingId);

      const token = localStorage.getItem("MentorToken");

      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/mentor/approve/${bookingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Booking approved successfully!");
        await fetchPendingBookings();
      } else {
        toast.error(data.message || "Failed to approve booking.");
      }
    } catch (error) {
      console.error("Approve booking error:", error);
      toast.error("Something went wrong while approving the booking.");
    } finally {
      setApprovingId(null);
    }
  };

  // =========================================================
  // REJECT BOOKING
  // =========================================================

  const rejectBooking = async () => {
    if (!selectedBookingId) {
      toast.error("Booking not selected.");
      return;
    }

    if (!rejectReason.trim()) {
      toast.error("Please enter a rejection reason.");
      return;
    }

    try {
      setRejecting(true);

      const token = localStorage.getItem("MentorToken");

      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/mentor/reject/${selectedBookingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: rejectReason.trim(),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Booking rejected successfully.");

        setShowRejectModal(false);
        setRejectReason("");
        setSelectedBookingId(null);

        await fetchPendingBookings();
      } else {
        toast.error(data.message || "Failed to reject booking.");
      }
    } catch (error) {
      console.error("Reject booking error:", error);
      toast.error("Something went wrong while rejecting the booking.");
    } finally {
      setRejecting(false);
    }
  };

  // =========================================================
  // FILTER BOOKINGS
  // =========================================================

  const filteredBookings = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return bookings;
    }

    return bookings.filter((booking) => {
      const studentName = `${booking.student?.firstName || ""} ${
        booking.student?.lastName || ""
      }`.toLowerCase();

      const sessionType = (booking.sessionType || "").toLowerCase();

      const email = (booking.student?.email || "").toLowerCase();

      return (
        studentName.includes(search) ||
        sessionType.includes(search) ||
        email.includes(search)
      );
    });
  }, [bookings, searchTerm]);

  // =========================================================
  // PROFILE IMAGE URL
  // =========================================================

  const getProfileImageUrl = (image, firstName, lastName) => {
    if (!image || typeof image !== "string") {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${firstName || ""} ${lastName || ""}`.trim() || "Student"
      )}`;
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${API_BASE_URL}/${image}`.replace(/([^:]\/)\/+/g, "$1");
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "-";
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
            Loading your Booking Requests...
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

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div
      className="min-h-screen bg-slate-50 pt-20 lg:ml-64 lg:pt-0 text-slate-900"
      style={{ fontFamily: "'Poppins', sans-serif", fontStyle: "normal" }}
    >
      <main className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

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
                    Approval Suite
                  </span>
                </div>

                <h1
                  className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-white"
                  style={{ fontWeight: 600 }}
                >
                  Pending Booking Requests
                </h1>

                <p
                  className="mt-1 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed"
                  style={{ fontWeight: 600 }}
                >
                  Review, approve or reject new mentorship booking requests.
                </p>
              </div>
            </div>

            <div
              className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur shadow-inner shrink-0"
              style={{ fontWeight: 600 }}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-base font-semibold text-black shadow-xs">
                {filteredBookings.length}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Pending
                </p>
                <h3 className="text-sm font-semibold text-white">Requests</h3>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* SEARCH */}
        {/* ================================================= */}

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
                Matching Requests
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-black text-white text-xs">
                {filteredBookings.length}
              </span>
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        {filteredBookings.length === 0 ? (
          <section className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-5 py-16 text-center shadow-xs">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
              <CalendarDays size={26} />
            </div>

            <h2
              className="text-base font-semibold text-slate-900 tracking-tight"
              style={{ fontWeight: 600 }}
            >
              No Pending Booking Requests
            </h2>

            <p
              className="mt-1 max-w-sm text-center text-xs text-slate-500 font-medium leading-relaxed"
              style={{ fontWeight: 600 }}
            >
              You're all caught up. There are no booking requests waiting for
              approval.
            </p>
          </section>
        ) : (
          <section className="w-full space-y-4">
            {filteredBookings.map((booking) => (
              <article
                key={booking._id}
                className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs transition duration-200 hover:border-blue-300 hover:shadow-md p-5 sm:p-6"
              >
                <div className="w-full space-y-5">
                  {/* TOP SECTION */}
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between pb-4 border-b border-slate-100">
                    <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
                      <img
                        src={getProfileImageUrl(
                          booking.student?.profileImage,
                          booking.student?.firstName,
                          booking.student?.lastName
                        )}
                        alt={`${booking.student?.firstName || ""} ${
                          booking.student?.lastName || ""
                        }`}
                        className="h-12 w-12 shrink-0 rounded-2xl border border-slate-200 object-cover shadow-2xs"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2
                            className="break-words text-xs sm:text-sm font-semibold text-slate-900 tracking-tight"
                            style={{ fontWeight: 600 }}
                          >
                            {booking.student?.firstName || "Student"}{" "}
                            {booking.student?.lastName || ""}
                          </h2>

                          <span
                            className="rounded-full px-3 py-1 text-[11px] font-semibold border border-amber-200 bg-amber-50 text-amber-700"
                            style={{ fontWeight: 600 }}
                          >
                            {booking.bookingStatus || "Pending"}
                          </span>
                        </div>

                        <p
                          className="mt-1 break-all text-[11px] text-slate-500 font-medium"
                          style={{ fontWeight: 600 }}
                        >
                          {booking.student?.email || "-"}
                        </p>

                        <div
                          className="mt-2 inline-flex max-w-full rounded-xl bg-slate-100 border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700"
                          style={{ fontWeight: 600 }}
                        >
                          <span className="truncate">
                            {booking.sessionType || "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* BOOKING DETAILS */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs font-semibold shrink-0">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-center">
                        <p
                          className="text-[10px] uppercase tracking-wide text-slate-400"
                          style={{ fontWeight: 600 }}
                        >
                          Date
                        </p>
                        <h3
                          className="mt-1 text-slate-900"
                          style={{ fontWeight: 600 }}
                        >
                          {formatDate(booking.sessionDate)}
                        </h3>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-center">
                        <p
                          className="text-[10px] uppercase tracking-wide text-slate-400"
                          style={{ fontWeight: 600 }}
                        >
                          Time
                        </p>
                        <h3
                          className="mt-1 text-slate-900"
                          style={{ fontWeight: 600 }}
                        >
                          {booking.startTime || "-"}
                        </h3>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-center">
                        <p
                          className="text-[10px] uppercase tracking-wide text-slate-400"
                          style={{ fontWeight: 600 }}
                        >
                          Payment
                        </p>
                        <h3
                          className={`mt-1 font-semibold ${
                            booking.paymentStatus === "Paid"
                              ? "text-emerald-600"
                              : "text-amber-600"
                          }`}
                          style={{ fontWeight: 600 }}
                        >
                          {booking.paymentStatus || "-"}
                        </h3>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-center">
                        <p
                          className="text-[10px] uppercase tracking-wide text-slate-400"
                          style={{ fontWeight: 600 }}
                        >
                          Amount
                        </p>
                        <h3
                          className="mt-1 text-emerald-600 font-bold"
                          style={{ fontWeight: 600 }}
                        >
                          ₹{booking.amount || 0}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* STUDENT NOTES */}
                  {booking.notes && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-semibold">
                      <p
                        className="text-[10px] uppercase tracking-wider text-slate-400 mb-1"
                        style={{ fontWeight: 600 }}
                      >
                        Student Notes
                      </p>
                      <p
                        className="break-words leading-relaxed text-slate-700 font-medium"
                        style={{ fontWeight: 600 }}
                      >
                        {booking.notes}
                      </p>
                    </div>
                  )}

                  {/* ACTION BUTTONS */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                    <button
                      onClick={() => {
                        setSelectedBookingId(booking._id);
                        setRejectReason("");
                        setShowRejectModal(true);
                      }}
                      disabled={approvingId === booking._id || rejecting}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition shadow-2xs disabled:opacity-50"
                      style={{ fontWeight: 600 }}
                    >
                      <XCircle size={15} />
                      Reject Booking
                    </button>

                    <button
                      onClick={() => approveBooking(booking._id)}
                      disabled={approvingId === booking._id || rejecting}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition shadow-xs disabled:opacity-50"
                      style={{ fontWeight: 600 }}
                    >
                      {approvingId === booking._id ? (
                        <>
                          <Loader2
                            size={15}
                            className="animate-spin text-blue-400"
                          />
                          Confirming...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={15} className="text-blue-400" />
                          Confirm Booking
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      {/* ========================================================= */}
      {/* REJECT MODAL */}
      {/* ========================================================= */}

      {showRejectModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!rejecting) {
              setShowRejectModal(false);
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-200">
                  <XCircle size={20} />
                </div>
                <h2
                  className="mt-3 text-base font-semibold text-slate-900 tracking-tight"
                  style={{ fontWeight: 600 }}
                >
                  Reject Booking
                </h2>
                <p
                  className="mt-1 text-xs text-slate-500 font-medium"
                  style={{ fontWeight: 600 }}
                >
                  Please enter the reason for rejecting this booking request.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <textarea
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                disabled={rejecting}
                placeholder="Enter rejection reason..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                style={{ fontWeight: 600 }}
              />
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedBookingId(null);
                }}
                disabled={rejecting}
                className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                style={{ fontWeight: 600 }}
              >
                Cancel
              </button>

              <button
                onClick={rejectBooking}
                disabled={!rejectReason.trim() || rejecting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 shadow-xs"
                style={{ fontWeight: 600 }}
              >
                {rejecting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle size={15} />
                    Reject Booking
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingBookings;
