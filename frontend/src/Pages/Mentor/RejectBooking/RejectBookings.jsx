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
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";

const RejectBookings = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // =========================================================
  // FETCH REJECTED BOOKINGS
  // =========================================================

  const fetchRejectedBookings = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("MentorToken");

      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/mentor/rejected`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch rejected bookings.");
      }

      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Error fetching rejected bookings:", error);

      toast.error(error.message || "Unable to load rejected bookings.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchRejectedBookings();
  }, []);

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
        throw new Error(data.message || "Failed to approve booking.");
      }

      toast.success(data.message || "Booking approved successfully.");

      // Remove approved booking immediately
      setBookings((prev) =>
        prev.filter((booking) => booking._id !== bookingId)
      );
    } catch (error) {
      console.error("Error approving booking:", error);

      toast.error(error.message || "Unable to approve booking.");
    } finally {
      setApprovingId(null);
    }
  };

  // =========================================================
  // SEARCH FILTER
  // =========================================================

  const filteredBookings = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return bookings;
    }

    return bookings.filter((booking) => {
      const studentName = `${booking.student?.firstName || ""} ${
        booking.student?.lastName || ""
      }`.toLowerCase();

      const email = (booking.student?.email || "").toLowerCase();

      const sessionType = (booking.sessionType || "").toLowerCase();

      const bookingStatus = (booking.bookingStatus || "").toLowerCase();

      const rejectionReason = (booking.cancellationReason || "").toLowerCase();

      const notes = (booking.notes || "").toLowerCase();

      return (
        studentName.includes(search) ||
        email.includes(search) ||
        sessionType.includes(search) ||
        bookingStatus.includes(search) ||
        rejectionReason.includes(search) ||
        notes.includes(search)
      );
    });
  }, [bookings, searchTerm]);

  // =========================================================
  // CHECK SESSION DATE
  // =========================================================

  const isSessionValid = (sessionDate) => {
    if (!sessionDate) return false;

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const bookingDate = new Date(sessionDate);

    if (Number.isNaN(bookingDate.getTime())) {
      return false;
    }

    bookingDate.setHours(0, 0, 0, 0);

    return bookingDate >= today;
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

  const getProfileImage = (student) => {
    if (!student?.profileImage) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${student?.firstName || "Student"} ${student?.lastName || ""}`
      )}&background=fee2e2&color=b91c1c&size=200`;
    }

    if (
      student.profileImage.startsWith("http://") ||
      student.profileImage.startsWith("https://")
    ) {
      return student.profileImage;
    }

    return `${API_BASE_URL}${student.profileImage}`;
  };

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-gray-50 pt-16 lg:ml-64 lg:pt-0">
        <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-6 md:px-6 lg:px-8 lg:py-8">
          {/* HEADER SKELETON */}

          <div className="h-52 animate-pulse rounded-2xl bg-gray-200 sm:h-56 sm:rounded-3xl" />

          {/* SEARCH SKELETON */}

          <div className="mt-6 h-14 animate-pulse rounded-xl bg-gray-200 sm:mt-8 sm:h-16 sm:rounded-2xl" />

          {/* CARD SKELETONS */}

          <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[520px] animate-pulse rounded-2xl bg-white shadow-sm sm:h-80 sm:rounded-3xl"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 pt-16 lg:ml-64 lg:pt-0">
      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-6 md:px-6 lg:px-8 lg:py-8 xl:px-10">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-5 sm:mb-7 lg:mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-700 via-red-700 to-red-900 p-4 text-white shadow-xl sm:rounded-3xl sm:p-6 md:p-7 lg:p-8">
            {/* Background Effects */}

            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-3xl sm:-right-16 sm:-top-16 sm:h-52 sm:w-52" />

            <div className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-red-400/20 blur-3xl sm:-bottom-20 sm:-left-16 sm:h-64 sm:w-64" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
              {/* HEADER LEFT */}

              <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/20 shadow-lg backdrop-blur-lg sm:h-14 sm:w-14 sm:rounded-2xl lg:h-16 lg:w-16">
                  <CalendarDays
                    size={23}
                    className="text-red-100 sm:h-7 sm:w-7 lg:h-8 lg:w-8"
                  />
                </div>

                <div className="min-w-0">
                  <h1 className="text-xl font-bold leading-tight sm:text-2xl md:text-3xl lg:text-4xl">
                    Rejected Bookings
                  </h1>

                  <p className="mt-2 max-w-2xl text-xs leading-5 text-red-100 sm:text-sm sm:leading-6 md:text-base">
                    Review all booking requests that were rejected by you.
                  </p>
                </div>
              </div>

              {/* HEADER COUNT */}

              <div className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-lg sm:rounded-2xl sm:px-6 sm:py-4 lg:w-auto lg:min-w-[210px]">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-red-100 sm:text-xs">
                  Rejected
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-lg font-bold text-red-700 sm:h-14 sm:w-14 sm:text-2xl">
                    {filteredBookings.length}
                  </div>

                  <span className="text-base font-semibold sm:text-xl">
                    Requests
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            SEARCH SECTION
        ====================================================== */}

        <div className="mb-5 sm:mb-7 lg:mb-8">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-700 sm:text-base">
              Search Requests
            </h3>

            <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
              Search by student name, email, session type, or rejection reason.
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
                placeholder="Search booking requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-13 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-700 shadow-sm outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-100 sm:h-16 sm:rounded-2xl sm:text-base"
              />

              {/* CLEAR SEARCH */}

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <XCircle size={18} />
                </button>
              )}
            </div>

            {/* SEARCH RESULT */}

            <div className="flex min-h-13 w-full items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 shadow-sm sm:min-h-16 sm:rounded-2xl sm:px-5 lg:w-auto lg:min-w-[230px]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-red-600 sm:text-xs">
                  Search Results
                </p>

                <p className="text-xs text-gray-600 sm:text-sm">
                  Matching Requests
                </p>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-900 text-sm font-bold text-white sm:h-10 sm:w-10">
                {filteredBookings.length}
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {filteredBookings.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-5 py-12 text-center shadow-sm sm:rounded-3xl sm:px-10 sm:py-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 sm:h-20 sm:w-20">
              <CalendarDays
                size={34}
                className="text-red-300 sm:h-10 sm:w-10"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-800 sm:text-2xl">
              {searchTerm ? "No Matching Bookings" : "No Rejected Bookings"}
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
              {searchTerm
                ? "No rejected booking requests match your search. Try using a different name, email, or session type."
                : "There are currently no booking requests that have been rejected."}
            </p>

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-95"
              >
                <RefreshCw size={16} />
                Clear Search
              </button>
            )}
          </div>
        ) : (
          /* =====================================================
             BOOKING LIST
          ====================================================== */

          <div className="space-y-4 sm:space-y-5">
            {filteredBookings.map((booking) => {
              const studentName = `${booking.student?.firstName || "Student"} ${
                booking.student?.lastName || ""
              }`.trim();

              const isApproving = approvingId === booking._id;

              const sessionIsValid = isSessionValid(booking.sessionDate);

              return (
                <div
                  key={booking._id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg sm:rounded-3xl"
                >
                  {/* TOP ACCENT */}

                  <div className="h-1 bg-red-600" />

                  <div className="p-4 sm:p-5 md:p-6 lg:p-7">
                    {/* =================================================
                        STUDENT INFORMATION + DETAILS
                    ================================================== */}

                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      {/* STUDENT */}

                      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                        <img
                          src={getProfileImage(booking.student)}
                          alt={studentName}
                          className="h-12 w-12 shrink-0 rounded-full border-2 border-red-100 object-cover sm:h-16 sm:w-16"
                        />

                        <div className="min-w-0 flex-1">
                          {/* NAME + STATUS */}

                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="break-words text-base font-bold text-gray-800 sm:text-xl">
                              {studentName}
                            </h2>

                            <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-semibold text-red-700 sm:text-xs">
                              {booking.bookingStatus || "Rejected"}
                            </span>
                          </div>

                          {/* EMAIL */}

                          <div className="mt-2 flex min-w-0 items-start gap-2 text-xs text-gray-500 sm:text-sm">
                            <Mail size={15} className="mt-0.5 shrink-0" />

                            <span className="break-all">
                              {booking.student?.email || "No email available"}
                            </span>
                          </div>

                          {/* SESSION TYPE */}

                          <div className="mt-2 flex min-w-0 items-center gap-2">
                            <BookOpenCheck
                              size={16}
                              className="shrink-0 text-orange-600"
                            />

                            <span className="truncate text-xs font-medium text-gray-700 sm:text-sm">
                              {booking.sessionType || "Session"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* =================================================
                          BOOKING DETAILS
                      ================================================== */}

                      <div className="grid w-full grid-cols-2 gap-2 sm:gap-3 xl:max-w-3xl xl:grid-cols-4">
                        {/* DATE */}

                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center sm:p-4">
                          <CalendarDays
                            size={18}
                            className="mx-auto mb-1.5 text-blue-600"
                          />

                          <p className="text-[10px] uppercase tracking-wide text-gray-500 sm:text-[11px]">
                            Date
                          </p>

                          <h3 className="mt-1 text-xs font-semibold text-gray-800 sm:text-sm">
                            {formatDate(booking.sessionDate)}
                          </h3>
                        </div>

                        {/* TIME */}

                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center sm:p-4">
                          <Clock3
                            size={18}
                            className="mx-auto mb-1.5 text-green-600"
                          />

                          <p className="text-[10px] uppercase tracking-wide text-gray-500 sm:text-[11px]">
                            Time
                          </p>

                          <h3 className="mt-1 text-xs font-semibold text-gray-800 sm:text-sm">
                            {booking.startTime || "N/A"}
                          </h3>

                          {booking.endTime && (
                            <p className="text-[11px] text-gray-400 sm:text-xs">
                              {booking.endTime}
                            </p>
                          )}
                        </div>

                        {/* PAYMENT */}

                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center sm:p-4">
                          <CreditCard
                            size={18}
                            className="mx-auto mb-1.5 text-purple-600"
                          />

                          <p className="text-[10px] uppercase tracking-wide text-gray-500 sm:text-[11px]">
                            Payment
                          </p>

                          <h3
                            className={`mt-1 text-xs font-semibold sm:text-sm ${
                              booking.paymentStatus === "Paid"
                                ? "text-green-600"
                                : booking.paymentStatus === "Pending"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {booking.paymentStatus || "N/A"}
                          </h3>
                        </div>

                        {/* AMOUNT */}

                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center sm:p-4">
                          <IndianRupee
                            size={18}
                            className="mx-auto mb-1.5 text-orange-500"
                          />

                          <p className="text-[10px] uppercase tracking-wide text-gray-500 sm:text-[11px]">
                            Amount
                          </p>

                          <h3 className="mt-1 text-xs font-semibold text-gray-800 sm:text-sm">
                            ₹{booking.amount ?? 0}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                        STUDENT NOTES
                    ================================================== */}

                    {booking.notes && (
                      <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50 p-3 sm:p-4">
                        <p className="text-sm font-semibold text-orange-700">
                          Student Notes
                        </p>

                        <p className="mt-2 break-words text-sm leading-6 text-gray-700">
                          {booking.notes}
                        </p>
                      </div>
                    )}

                    {/* =================================================
                        REJECTION REASON
                    ================================================== */}

                    {booking.cancellationReason && (
                      <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 sm:p-4">
                        <div className="flex items-start gap-3">
                          <XCircle
                            size={20}
                            className="mt-0.5 shrink-0 text-red-600"
                          />

                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-red-700">
                              Rejection Reason
                            </h4>

                            <p className="mt-2 break-words text-sm leading-6 text-gray-700">
                              {booking.cancellationReason}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* =================================================
                        ACTION FOOTER
                    ================================================== */}

                    <div className="mt-5 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      {/* SESSION STATUS */}

                      <div className="flex items-start gap-2 text-xs text-gray-500 sm:items-center sm:text-sm">
                        {sessionIsValid ? (
                          <CheckCircle2
                            size={16}
                            className="mt-0.5 shrink-0 text-green-600 sm:mt-0"
                          />
                        ) : (
                          <XCircle
                            size={16}
                            className="mt-0.5 shrink-0 text-red-500 sm:mt-0"
                          />
                        )}

                        <span>
                          {sessionIsValid
                            ? "This session date is still available."
                            : "This session date has already passed."}
                        </span>
                      </div>

                      {/* ACTION BUTTON */}

                      {sessionIsValid ? (
                        <button
                          onClick={() => approveBooking(booking._id)}
                          disabled={isApproving}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-green-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                          {isApproving ? (
                            <>
                              <Loader2 size={17} className="animate-spin" />
                              Approving...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={17} />
                              Approve Booking
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 sm:w-auto">
                          <XCircle size={17} />
                          Session Date Passed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default RejectBookings;
