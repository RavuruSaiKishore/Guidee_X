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
      )}&background=f97316&color=fff&size=200`;
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
      <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 lg:ml-64 lg:w-[calc(100%-16rem)]">
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="relative">
            <div className="h-14 w-14 rounded-full border-4 border-orange-100 sm:h-16 sm:w-16" />

            <div className="absolute inset-0 h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-orange-500 sm:h-16 sm:w-16" />
          </div>

          <p className="mt-5 text-center font-medium text-gray-700 sm:text-lg">
            Loading your Booking Requests...
          </p>

          <p className="mt-1 text-center text-sm text-gray-400">
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
    <>
      <div
        className="
          min-h-screen
          w-full
          overflow-x-hidden
          bg-gray-50
          px-3
          py-4
          sm:px-5
          sm:py-6
          lg:ml-64
          lg:w-[calc(100%-16rem)]
          lg:px-6
          lg:py-8
          xl:px-8
        "
      >
        <div className="mx-auto w-full max-w-[1600px]">
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="mb-5 sm:mb-6 lg:mb-8">
            <div
              className="
                relative
                overflow-hidden
                rounded-2xl
                bg-gradient-to-r
                from-amber-500
                via-orange-500
                to-red-500
                p-4
                text-white
                shadow-xl
                sm:rounded-3xl
                sm:p-6
                lg:p-8
              "
            >
              {/* Background Decorations */}

              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl sm:h-44 sm:w-44" />

              <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-yellow-300/20 blur-3xl sm:h-56 sm:w-56" />

              <div
                className="
                  relative
                  flex
                  flex-col
                  gap-5
                  sm:gap-6
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                  lg:gap-8
                "
              >
                {/* LEFT */}

                <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-5">
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/30
                      bg-white/20
                      shadow-lg
                      backdrop-blur-lg
                      sm:h-16
                      sm:w-16
                      sm:rounded-2xl
                    "
                  >
                    <CalendarDays
                      size={24}
                      className="text-yellow-100 sm:h-8 sm:w-8"
                    />
                  </div>

                  <div className="min-w-0">
                    <h1 className="text-xl font-bold leading-tight sm:text-2xl lg:text-4xl">
                      Pending Booking Requests
                    </h1>

                    <p className="mt-2 max-w-2xl text-xs leading-5 text-orange-100 sm:text-sm sm:leading-6 lg:text-base">
                      Review, approve or reject new mentorship booking requests.
                    </p>
                  </div>
                </div>

                {/* RIGHT - PENDING COUNT */}

                <div className="w-full sm:w-auto">
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      rounded-2xl
                      border
                      border-white/20
                      bg-white/15
                      px-4
                      py-3
                      shadow-xl
                      backdrop-blur-lg
                      sm:min-w-[220px]
                      sm:px-5
                      sm:py-4
                    "
                  >
                    <div>
                      <p className="text-xs uppercase tracking-widest text-orange-100 sm:text-sm">
                        Pending
                      </p>

                      <p className="mt-1 text-sm font-semibold sm:text-base">
                        Requests
                      </p>
                    </div>

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-xl font-bold text-orange-600 shadow-md sm:h-14 sm:w-14 sm:text-2xl">
                      {filteredBookings.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* SEARCH */}
          {/* ================================================= */}

          <div className="mb-5 sm:mb-6 lg:mb-8">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-gray-700 sm:text-base">
                Search Requests
              </h3>

              <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                Search by student name, email or session type.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
              {/* SEARCH INPUT */}

              <div className="relative min-w-0 flex-1">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search by student name, email or session type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
                    h-13
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    py-3
                    pl-11
                    pr-4
                    text-sm
                    shadow-sm
                    outline-none
                    transition-all
                    duration-300
                    placeholder:text-gray-400
                    focus:border-orange-500
                    focus:ring-4
                    focus:ring-orange-100
                    sm:h-14
                    sm:rounded-2xl
                    sm:text-base
                  "
                />
              </div>

              {/* SEARCH RESULT */}

              <div
                className="
                  flex
                  min-h-[56px]
                  items-center
                  justify-between
                  gap-4
                  rounded-xl
                  border
                  border-orange-200
                  bg-orange-50
                  px-4
                  shadow-sm
                  sm:rounded-2xl
                  sm:px-5
                  lg:min-w-[240px]
                "
              >
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-orange-600 sm:text-xs">
                    Search Results
                  </p>

                  <p className="mt-0.5 text-xs text-gray-600 sm:text-sm">
                    Matching Requests
                  </p>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white sm:h-10 sm:w-10">
                  {filteredBookings.length}
                </div>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* CONTENT */}
          {/* ================================================= */}

          {filteredBookings.length === 0 ? (
            /* ================================================= */
            /* EMPTY STATE */
            /* ================================================= */

            <div
              className="
                rounded-2xl
                border
                border-gray-100
                bg-white
                px-5
                py-12
                text-center
                shadow-sm
                sm:rounded-3xl
                sm:px-8
                sm:py-16
              "
            >
              <CalendarDays
                size={56}
                className="mx-auto mb-5 text-orange-300 sm:h-[70px] sm:w-[70px]"
              />

              <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
                No Pending Booking Requests
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500">
                You're all caught up. There are no booking requests waiting for
                approval.
              </p>
            </div>
          ) : (
            /* ================================================= */
            /* BOOKING LIST */
            /* ================================================= */

            <div className="space-y-4 sm:space-y-5 lg:space-y-6">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="
                    min-w-0
                    rounded-2xl
                    border
                    border-gray-100
                    bg-white
                    p-4
                    shadow-md
                    transition-all
                    duration-300
                    hover:shadow-xl
                    sm:rounded-3xl
                    sm:p-6
                    lg:p-7
                  "
                >
                  {/* ================================================= */}
                  {/* TOP SECTION */}
                  {/* ================================================= */}

                  <div className="flex min-w-0 flex-col gap-5 xl:flex-row xl:items-start xl:justify-between xl:gap-8">
                    {/* STUDENT INFO */}

                    <div className="flex min-w-0 items-start gap-3 sm:gap-5">
                      {/* PROFILE IMAGE */}

                      <img
                        src={getProfileImageUrl(
                          booking.student?.profileImage,
                          booking.student?.firstName,
                          booking.student?.lastName
                        )}
                        alt={`${booking.student?.firstName || ""} ${
                          booking.student?.lastName || ""
                        }`}
                        className="
                          h-14
                          w-14
                          shrink-0
                          rounded-full
                          border-4
                          border-orange-100
                          object-cover
                          sm:h-20
                          sm:w-20
                        "
                      />

                      {/* STUDENT DETAILS */}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <h2 className="break-words text-lg font-bold text-gray-800 sm:text-2xl">
                            {booking.student?.firstName || "Student"}{" "}
                            {booking.student?.lastName || ""}
                          </h2>

                          <span className="shrink-0 rounded-full bg-yellow-100 px-2.5 py-1 text-[10px] font-semibold text-yellow-700 sm:px-3 sm:text-xs">
                            {booking.bookingStatus || "Pending"}
                          </span>
                        </div>

                        {/* EMAIL */}

                        <div className="mt-2 flex min-w-0 items-start gap-2 text-gray-500">
                          <Mail
                            size={15}
                            className="mt-0.5 shrink-0 sm:h-4 sm:w-4"
                          />

                          <span className="min-w-0 break-all text-xs sm:text-sm">
                            {booking.student?.email || "-"}
                          </span>
                        </div>

                        {/* SESSION TYPE */}

                        <div className="mt-3 flex min-w-0 items-center gap-2">
                          <BookOpenCheck
                            size={17}
                            className="shrink-0 text-orange-600"
                          />

                          <span className="truncate text-sm font-medium text-gray-700 sm:text-base">
                            {booking.sessionType || "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ================================================= */}
                    {/* BOOKING DETAILS */}
                    {/* ================================================= */}

                    <div
                      className="
                        grid
                        grid-cols-2
                        gap-2
                        sm:gap-3
                        md:grid-cols-4
                        xl:min-w-[600px]
                        xl:max-w-[720px]
                      "
                    >
                      {/* DATE */}

                      <div className="min-w-0 rounded-xl bg-gray-50 p-3 text-center sm:rounded-2xl sm:p-4">
                        <CalendarDays
                          size={20}
                          className="mx-auto mb-2 text-blue-600 sm:h-[22px] sm:w-[22px]"
                        />

                        <p className="text-[10px] text-gray-500 sm:text-xs">
                          Session Date
                        </p>

                        <h3 className="mt-1 truncate text-xs font-semibold text-gray-800 sm:text-sm">
                          {formatDate(booking.sessionDate)}
                        </h3>
                      </div>

                      {/* TIME */}

                      <div className="min-w-0 rounded-xl bg-gray-50 p-3 text-center sm:rounded-2xl sm:p-4">
                        <Clock3
                          size={20}
                          className="mx-auto mb-2 text-green-600 sm:h-[22px] sm:w-[22px]"
                        />

                        <p className="text-[10px] text-gray-500 sm:text-xs">
                          Time
                        </p>

                        <h3 className="mt-1 truncate text-xs font-semibold text-gray-800 sm:text-sm">
                          {booking.startTime || "-"}
                        </h3>

                        <p className="truncate text-[10px] text-gray-400 sm:text-xs">
                          {booking.endTime || "-"}
                        </p>
                      </div>

                      {/* PAYMENT */}

                      <div className="min-w-0 rounded-xl bg-gray-50 p-3 text-center sm:rounded-2xl sm:p-4">
                        <CreditCard
                          size={20}
                          className="mx-auto mb-2 text-purple-600 sm:h-[22px] sm:w-[22px]"
                        />

                        <p className="text-[10px] text-gray-500 sm:text-xs">
                          Payment
                        </p>

                        <h3
                          className={`mt-1 truncate text-xs font-semibold sm:text-sm ${
                            booking.paymentStatus === "Paid"
                              ? "text-green-600"
                              : booking.paymentStatus === "Pending"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {booking.paymentStatus || "-"}
                        </h3>
                      </div>

                      {/* AMOUNT */}

                      <div className="min-w-0 rounded-xl bg-gray-50 p-3 text-center sm:rounded-2xl sm:p-4">
                        <IndianRupee
                          size={20}
                          className="mx-auto mb-2 text-orange-500 sm:h-[22px] sm:w-[22px]"
                        />

                        <p className="text-[10px] text-gray-500 sm:text-xs">
                          Amount
                        </p>

                        <h3 className="mt-1 truncate text-xs font-semibold text-gray-800 sm:text-sm">
                          ₹{booking.amount || 0}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* ================================================= */}
                  {/* STUDENT NOTES */}
                  {/* ================================================= */}

                  {booking.notes && (
                    <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50 p-4 sm:mt-6 sm:rounded-2xl sm:p-5">
                      <p className="text-xs font-semibold text-orange-700 sm:text-sm">
                        Student Notes
                      </p>

                      <p className="mt-2 break-words text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
                        {booking.notes}
                      </p>
                    </div>
                  )}

                  {/* ================================================= */}
                  {/* ACTION BUTTONS */}
                  {/* ================================================= */}

                  <div
                    className="
                      mt-5
                      flex
                      flex-col
                      gap-3
                      border-t
                      border-gray-100
                      pt-5
                      sm:mt-6
                      sm:flex-row
                      sm:justify-end
                      sm:gap-3
                      sm:pt-5
                    "
                  >
                    {/* REJECT */}

                    <button
                      onClick={() => {
                        setSelectedBookingId(booking._id);
                        setRejectReason("");
                        setShowRejectModal(true);
                      }}
                      disabled={approvingId === booking._id || rejecting}
                      className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-red-600
                        transition-all
                        duration-300
                        hover:bg-red-600
                        hover:text-white
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        sm:w-auto
                        sm:px-6
                      "
                    >
                      <XCircle size={18} />
                      Reject Booking
                    </button>

                    {/* APPROVE */}

                    <button
                      onClick={() => approveBooking(booking._id)}
                      disabled={approvingId === booking._id || rejecting}
                      className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-green-600
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        shadow-md
                        transition-all
                        duration-300
                        hover:bg-green-700
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        sm:w-auto
                        sm:px-6
                      "
                    >
                      {approvingId === booking._id ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={18} />
                          Confirm Booking
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* REJECT MODAL */}
      {/* ========================================================= */}

      {showRejectModal && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/50
            p-3
            backdrop-blur-sm
            sm:p-5
          "
          onClick={() => {
            if (!rejecting) {
              setShowRejectModal(false);
            }
          }}
        >
          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              bg-white
              p-5
              shadow-2xl
              sm:rounded-3xl
              sm:p-6
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <XCircle size={21} />
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
                  Reject Booking
                </h2>

                <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                  Please enter the reason for rejecting this booking request.
                </p>
              </div>
            </div>

            {/* TEXTAREA */}

            <textarea
              rows={5}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              disabled={rejecting}
              placeholder="Enter rejection reason..."
              className="
                mt-5
                w-full
                resize-none
                rounded-xl
                border
                border-gray-200
                p-4
                text-sm
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-red-500
                focus:ring-4
                focus:ring-red-100
                disabled:bg-gray-50
              "
            />

            {/* ACTIONS */}

            <div className="mt-5 flex flex-col-reverse gap-2 sm:mt-6 sm:flex-row sm:justify-end sm:gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedBookingId(null);
                }}
                disabled={rejecting}
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  px-5
                  py-3
                  text-sm
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-gray-100
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  sm:w-auto
                "
              >
                Cancel
              </button>

              <button
                onClick={rejectBooking}
                disabled={!rejectReason.trim() || rejecting}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-red-600
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  sm:w-auto
                "
              >
                {rejecting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle size={17} />
                    Reject Booking
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PendingBookings;
