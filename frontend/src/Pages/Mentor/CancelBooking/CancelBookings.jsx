import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck2,
  Search,
  Clock3,
  IndianRupee,
  CreditCard,
  BookOpenCheck,
  XCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";

const CancelBookings = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [approvingId, setApprovingId] = useState(null);

  // =========================================================
  // FETCH CANCELLED BOOKINGS
  // =========================================================

  const fetchCancelledBookings = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("MentorToken");

      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/mentor/cancelBookings`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch cancelled bookings.");
      }

      setSessions(data.bookings || []);
    } catch (error) {
      console.error("Error fetching cancelled bookings:", error);

      toast.error(error.message || "Failed to load cancelled bookings.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // MARK NOTIFICATIONS AS READ
  // =========================================================

  const markNotificationsRead = async () => {
    try {
      const token = localStorage.getItem("MentorToken");

      if (!token) return;

      await fetch(`${API_BASE_URL}/api/notification/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    markNotificationsRead();
    fetchCancelledBookings();
  }, []);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredSessions = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return sessions;
    }

    return sessions.filter((session) => {
      const studentName = `${session.student?.firstName || ""} ${
        session.student?.lastName || ""
      }`.toLowerCase();

      const sessionType = (session.sessionType || "").toLowerCase();

      const studentEmail = (session.student?.email || "").toLowerCase();

      const bookingStatus = (session.bookingStatus || "").toLowerCase();

      const paymentStatus = (session.paymentStatus || "").toLowerCase();

      const cancellationReason = (
        session.cancellationReason || ""
      ).toLowerCase();

      return (
        studentName.includes(search) ||
        sessionType.includes(search) ||
        studentEmail.includes(search) ||
        bookingStatus.includes(search) ||
        paymentStatus.includes(search) ||
        cancellationReason.includes(search)
      );
    });
  }, [sessions, searchTerm]);

  // =========================================================
  // APPROVE BOOKING
  // =========================================================

  const approveBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("MentorToken");

      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      setApprovingId(bookingId);

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

      if (!response.ok || !data.success) {
        toast.error(data.message || "Unable to approve booking.");
        return;
      }

      toast.success(data.message || "Booking approved successfully.");

      // Remove approved booking immediately
      setSessions((prev) =>
        prev.filter((session) => session._id !== bookingId)
      );
    } catch (error) {
      console.error("Error approving booking:", error);

      toast.error("Something went wrong while approving the booking.");
    } finally {
      setApprovingId(null);
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // PROFILE IMAGE
  // =========================================================

  const getProfileImage = (session) => {
    if (!session.student?.profileImage) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${session.student?.firstName || "Student"} ${
          session.student?.lastName || ""
        }`
      )}&background=ef4444&color=fff&size=200`;
    }

    if (
      session.student.profileImage.startsWith("http://") ||
      session.student.profileImage.startsWith("https://")
    ) {
      return session.student.profileImage;
    }

    return `${API_BASE_URL}${session.student.profileImage}`;
  };

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-gray-50 pt-16 lg:ml-64 lg:pt-0">
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 lg:min-h-screen">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative h-14 w-14">
              <div className="absolute inset-0 rounded-full border-4 border-red-100" />

              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-red-600" />
            </div>

            <p className="mt-5 text-base font-semibold text-gray-700">
              Loading your Cancelled Bookings...
            </p>

            <p className="mt-1 text-sm text-gray-400">Please wait a moment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 pt-16 lg:ml-64 lg:pt-0">
      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-6 md:px-6 lg:px-8 lg:py-8 xl:px-10">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-5 sm:mb-7 lg:mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-red-400 p-4 text-white shadow-lg sm:rounded-3xl sm:p-6 md:p-7 lg:p-8">
            {/* Background Decorations */}

            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl sm:h-44 sm:w-44" />

            <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl sm:h-56 sm:w-56" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
              {/* LEFT */}

              <div className="flex min-w-0 items-start gap-3 sm:gap-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/20 backdrop-blur-md sm:h-14 sm:w-14 sm:rounded-2xl lg:h-16 lg:w-16">
                  <CalendarCheck2
                    size={23}
                    className="text-white sm:h-7 sm:w-7 lg:h-[34px] lg:w-[34px]"
                  />
                </div>

                <div className="min-w-0">
                  <h1 className="text-xl font-bold leading-tight sm:text-2xl md:text-3xl lg:text-4xl">
                    Cancelled Booking Sessions
                  </h1>

                  <p className="mt-2 max-w-2xl text-xs leading-5 text-red-100 sm:text-sm sm:leading-6 md:text-base">
                    View and manage all cancelled mentorship sessions.
                  </p>
                </div>
              </div>

              {/* TOTAL */}

              <div className="w-full rounded-xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-md sm:rounded-2xl sm:px-5 sm:py-4 lg:w-auto lg:min-w-[210px] lg:px-6 lg:py-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-lg font-bold text-red-600 sm:h-14 sm:w-14 sm:text-2xl">
                    {filteredSessions.length}
                  </div>

                  <div className="flex-1 lg:flex-none">
                    <p className="text-[10px] uppercase tracking-wider text-red-100 sm:text-xs sm:text-sm">
                      Total
                    </p>

                    <h3 className="text-base font-semibold sm:text-lg lg:text-xl">
                      Cancelled
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            SEARCH
        ====================================================== */}

        <div className="mb-5 sm:mb-7 lg:mb-8">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-700 sm:text-base">
              Search Sessions
            </h3>

            <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
              Search by student name, email, session type, booking status, or
              cancellation reason.
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
                placeholder="Search by student, email, session type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-13 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-700 shadow-sm outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-100 sm:h-14 sm:rounded-2xl sm:text-base"
              />
            </div>

            {/* SEARCH RESULT */}

            <div className="flex min-h-13 w-full items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 shadow-sm sm:min-h-14 sm:rounded-2xl sm:px-6 lg:w-auto lg:min-w-[230px]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-red-600 sm:text-xs">
                  Search Results
                </p>

                <p className="mt-0.5 text-xs text-gray-600 sm:text-sm">
                  Matching sessions
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white sm:h-10 sm:w-10 sm:text-base">
                {filteredSessions.length}
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {filteredSessions.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-12 shadow-sm sm:rounded-3xl sm:p-14">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 sm:h-20 sm:w-20">
                <CalendarCheck2
                  size={32}
                  className="text-red-300 sm:h-[38px] sm:w-[38px]"
                />
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-800 sm:mt-6 sm:text-2xl">
                {searchTerm
                  ? "No Matching Cancelled Sessions"
                  : "No Cancelled Sessions"}
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
                {searchTerm
                  ? "No cancelled sessions match your current search. Try using a different search term."
                  : "There are currently no cancelled mentorship sessions. Cancelled sessions will appear here."}
              </p>

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-95"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          /* =====================================================
             SESSION LIST
          ====================================================== */

          <div className="space-y-4 sm:space-y-5">
            {filteredSessions.map((session) => (
              <div
                key={session._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg sm:rounded-3xl"
              >
                {/* TOP BORDER */}

                <div className="h-1 bg-red-500" />

                <div className="p-4 sm:p-5 md:p-6 lg:p-7">
                  {/* =================================================
                      STUDENT + FEE
                  ================================================== */}

                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    {/* STUDENT INFO */}

                    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                      <img
                        src={getProfileImage(session)}
                        alt={`${session.student?.firstName || "Student"} ${
                          session.student?.lastName || ""
                        }`}
                        className="h-12 w-12 shrink-0 rounded-full border-4 border-red-50 object-cover sm:h-16 sm:w-16"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <h2 className="break-words text-base font-bold text-gray-800 sm:text-lg">
                            {session.student?.firstName || "Student"}{" "}
                            {session.student?.lastName || ""}
                          </h2>

                          <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-semibold text-red-700 sm:px-2.5 sm:py-1 sm:text-xs">
                            {session.bookingStatus || "Cancelled"}
                          </span>

                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-semibold sm:px-2.5 sm:py-1 sm:text-xs ${
                              session.paymentStatus === "Paid"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {session.paymentStatus || "N/A"}
                          </span>
                        </div>

                        <p className="mt-1 max-w-full truncate text-xs text-gray-500 sm:text-sm">
                          {session.student?.email || "No email available"}
                        </p>

                        <div className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 sm:text-sm">
                          <BookOpenCheck size={15} className="shrink-0" />

                          <span className="truncate">
                            {session.sessionType || "Mentorship Session"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* SESSION FEE */}

                    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 xl:block xl:border-0 xl:bg-transparent xl:p-0 xl:text-right">
                      <div className="flex items-center gap-2 xl:justify-end">
                        <IndianRupee
                          size={18}
                          className="text-red-500 xl:hidden"
                        />

                        <p className="text-xs text-gray-500">Session Fee</p>
                      </div>

                      <h2 className="text-xl font-bold text-red-600 sm:text-2xl">
                        ₹{session.amount || 0}
                      </h2>
                    </div>
                  </div>

                  {/* =================================================
                      SESSION DETAILS
                  ================================================== */}

                  <div className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
                    {/* DATE */}

                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
                      <div className="flex items-center gap-2">
                        <CalendarCheck2
                          size={17}
                          className="shrink-0 text-blue-600"
                        />

                        <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500 sm:text-[11px]">
                          Session Date
                        </p>
                      </div>

                      <h3 className="mt-2 text-sm font-semibold text-gray-800 sm:text-base">
                        {formatDate(session.sessionDate)}
                      </h3>
                    </div>

                    {/* TIME */}

                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
                      <div className="flex items-center gap-2">
                        <Clock3 size={17} className="shrink-0 text-green-600" />

                        <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500 sm:text-[11px]">
                          Time
                        </p>
                      </div>

                      <h3 className="mt-2 text-sm font-semibold text-gray-800 sm:text-base">
                        {session.startTime || "N/A"}
                      </h3>

                      {session.endTime && (
                        <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                          {session.endTime}
                        </p>
                      )}
                    </div>

                    {/* DURATION */}

                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
                      <div className="flex items-center gap-2">
                        <Clock3
                          size={17}
                          className="shrink-0 text-purple-600"
                        />

                        <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500 sm:text-[11px]">
                          Duration
                        </p>
                      </div>

                      <h3 className="mt-2 text-sm font-semibold text-gray-800 sm:text-base">
                        {session.duration ? `${session.duration} mins` : "N/A"}
                      </h3>
                    </div>

                    {/* BOOKED ON */}

                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
                      <div className="flex items-center gap-2">
                        <CalendarCheck2
                          size={17}
                          className="shrink-0 text-orange-600"
                        />

                        <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500 sm:text-[11px]">
                          Booked On
                        </p>
                      </div>

                      <h3 className="mt-2 text-sm font-semibold text-gray-800 sm:text-base">
                        {formatDate(session.createdAt)}
                      </h3>
                    </div>
                  </div>

                  {/* =================================================
                      CANCELLATION REASON
                  ================================================== */}

                  {session.cancellationReason && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 sm:p-4">
                      <div className="flex items-start gap-3">
                        <XCircle
                          size={19}
                          className="mt-0.5 shrink-0 text-red-600"
                        />

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-red-700">
                            Cancellation Reason
                          </p>

                          <p className="mt-1 break-words text-sm leading-6 text-red-600">
                            {session.cancellationReason}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* =================================================
                      ACTION FOOTER
                  ================================================== */}

                  <div className="mt-5 flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* PAYMENT */}

                    <div className="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
                      <CreditCard size={16} className="shrink-0" />

                      <span>
                        Payment:{" "}
                        <span className="font-semibold text-gray-700">
                          {session.paymentStatus || "N/A"}
                        </span>
                      </span>
                    </div>

                    {/* APPROVE */}

                    <button
                      onClick={() => approveBooking(session._id)}
                      disabled={approvingId === session._id}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-green-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {approvingId === session._id ? (
                        <>
                          <RefreshCw size={17} className="animate-spin" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={17} />
                          Approve Booking
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CancelBookings;
