import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck2,
  Search,
  Star,
  Clock3,
  BookOpenCheck,
  CreditCard,
  IndianRupee,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";

const CompletedBookings = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // =========================================================
  // FETCH COMPLETED BOOKINGS
  // =========================================================

  const fetchCompletedBookings = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("MentorToken");

      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/mentor/completeBookings`,
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
        throw new Error(data.message || "Failed to fetch completed bookings.");
      }

      setSessions(data.bookings || []);
    } catch (error) {
      console.error("Error fetching completed bookings:", error);

      toast.error(error.message || "Unable to load completed bookings.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchCompletedBookings();
  }, []);

  // =========================================================
  // SEARCH FILTER
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

      const studentEmail = (session.student?.email || "").toLowerCase();

      const sessionType = (session.sessionType || "").toLowerCase();

      const bookingStatus = (session.bookingStatus || "").toLowerCase();

      const paymentStatus = (session.paymentStatus || "").toLowerCase();

      return (
        studentName.includes(search) ||
        studentEmail.includes(search) ||
        sessionType.includes(search) ||
        bookingStatus.includes(search) ||
        paymentStatus.includes(search)
      );
    });
  }, [sessions, searchTerm]);

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

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
  // GET PROFILE IMAGE
  // =========================================================

  const getProfileImage = (student) => {
    if (!student?.profileImage) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${student?.firstName || "Student"} ${student?.lastName || ""}`
      )}&background=d1fae5&color=047857&size=200`;
    }

    if (
      student.profileImage.startsWith("http://") ||
      student.profileImage.startsWith("https://")
    ) {
      return student.profileImage;
    }

    return `${API_BASE_URL}${student.profileImage.startsWith("/") ? "" : "/"}${
      student.profileImage
    }`;
  };

  // =========================================================
  // CLEAR SEARCH
  // =========================================================

  const clearSearch = () => {
    setSearchTerm("");
  };

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 lg:ml-64 lg:pt-0">
        <div className="px-3 py-4 sm:px-5 sm:py-6 lg:px-6 lg:py-8">
          <div className="mx-auto w-full max-w-7xl">
            {/* Header Skeleton */}

            <div className="h-56 animate-pulse rounded-2xl bg-gray-200 sm:h-64 sm:rounded-3xl" />

            {/* Search Skeleton */}

            <div className="mt-6 h-14 animate-pulse rounded-xl bg-gray-200 sm:mt-8 sm:h-16 sm:rounded-2xl" />

            {/* Cards Skeleton */}

            <div className="mt-6 space-y-5 sm:mt-8">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-[420px] animate-pulse rounded-2xl bg-white shadow-sm sm:h-80 sm:rounded-3xl"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50 pt-20 lg:ml-64 lg:pt-0">
      <div className="px-3 py-4 sm:px-5 sm:py-6 lg:px-6 lg:py-8">
        <div className="mx-auto w-full max-w-7xl">
          {/* =================================================
              HEADER
          ================================================== */}

          <div className="mb-6 sm:mb-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-700 via-teal-600 to-blue-700 p-5 text-white shadow-xl sm:rounded-3xl sm:p-7 lg:p-8">
              {/* Background Decorations */}

              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-3xl sm:h-44 sm:w-44" />

              <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-white/10 blur-3xl sm:h-56 sm:w-56" />

              {/* Header Content */}

              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
                {/* Left Section */}

                <div className="flex min-w-0 items-start gap-3 sm:gap-5">
                  {/* Icon */}

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/20 backdrop-blur-md sm:h-16 sm:w-16 sm:rounded-2xl">
                    <CalendarCheck2
                      size={26}
                      className="text-white sm:h-[34px] sm:w-[34px]"
                    />
                  </div>

                  {/* Title */}

                  <div className="min-w-0">
                    <h1 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                      Completed Booking Sessions
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-cyan-100 sm:text-base">
                      View and manage all completed mentorship sessions.
                    </p>
                  </div>
                </div>

                {/* Total Count */}

                <div className="w-full rounded-2xl border border-white/20 bg-white/15 px-4 py-4 backdrop-blur-md sm:px-6 sm:py-5 lg:w-auto lg:min-w-[210px]">
                  <div className="flex items-center justify-between gap-4 sm:justify-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-xl font-bold text-cyan-700 sm:h-14 sm:w-14 sm:text-2xl">
                      {filteredSessions.length}
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-cyan-100 sm:text-sm">
                        Total
                      </p>

                      <h3 className="text-lg font-semibold sm:text-xl">
                        Completed
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              SEARCH
          ================================================== */}

          <div className="mb-6 sm:mb-8">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-gray-700">
                Search Sessions
              </h3>

              <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                Search by student name, email, session type, or payment status.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
              {/* Search Input */}

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
                  className="h-14 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-700 shadow-sm outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 sm:h-16 sm:rounded-2xl sm:text-base"
                />
              </div>

              {/* Search Result */}

              <div className="flex min-h-14 w-full items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 shadow-sm sm:min-h-16 sm:px-6 lg:w-auto lg:min-w-[230px] lg:rounded-2xl">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-green-600 sm:text-xs">
                    Search Results
                  </p>

                  <p className="mt-0.5 text-xs text-gray-600 sm:text-sm">
                    Matching sessions
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white sm:h-10 sm:w-10 sm:text-base">
                  {filteredSessions.length}
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              EMPTY STATE
          ================================================== */}

          {filteredSessions.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-12 shadow-sm sm:rounded-3xl sm:p-14">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 sm:h-20 sm:w-20">
                  <CalendarCheck2
                    size={32}
                    className="text-green-400 sm:h-[38px] sm:w-[38px]"
                  />
                </div>

                <h2 className="mt-5 text-xl font-bold text-gray-800 sm:mt-6 sm:text-2xl">
                  {searchTerm
                    ? "No Matching Completed Sessions"
                    : "No Completed Sessions"}
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
                  {searchTerm
                    ? "No completed sessions match your current search. Try using a different search term."
                    : "There are currently no completed mentorship sessions. Completed sessions will appear here."}
                </p>

                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 active:scale-95"
                  >
                    <RefreshCw size={16} />
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* =================================================
               SESSION LIST
            ================================================== */

            <div className="space-y-4 sm:space-y-5">
              {filteredSessions.map((session) => (
                <div
                  key={session._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg sm:rounded-3xl"
                >
                  {/* Top Border */}

                  <div className="h-1 bg-gradient-to-r from-cyan-700 via-teal-600 to-blue-700" />

                  <div className="p-4 sm:p-5 lg:p-6">
                    {/* =================================================
                        TOP SECTION
                    ================================================== */}

                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      {/* Student Information */}

                      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                        {/* Profile Image */}

                        <img
                          src={getProfileImage(session.student)}
                          alt={`${session.student?.firstName || "Student"} ${
                            session.student?.lastName || ""
                          }`}
                          className="h-14 w-14 shrink-0 rounded-full border-4 border-green-50 object-cover sm:h-16 sm:w-16"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://ui-avatars.com/api/?name=Student";
                          }}
                        />

                        {/* Student Details */}

                        <div className="min-w-0 flex-1">
                          {/* Name + Status */}

                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="break-words text-base font-bold text-gray-800 sm:text-lg">
                              {session.student?.firstName || "Student"}{" "}
                              {session.student?.lastName || ""}
                            </h2>

                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-semibold text-green-700 sm:text-xs">
                              {session.bookingStatus || "Completed"}
                            </span>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold sm:text-xs ${
                                session.paymentStatus === "Paid"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {session.paymentStatus || "N/A"}
                            </span>
                          </div>

                          {/* Email */}

                          <p className="mt-1 break-all text-xs text-gray-500 sm:text-sm">
                            {session.student?.email || "No email available"}
                          </p>

                          {/* Session Type */}

                          <div className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 sm:text-sm">
                            <BookOpenCheck size={15} className="shrink-0" />

                            <span className="truncate">
                              {session.sessionType || "Mentorship Session"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Session Fee */}

                      <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 xl:block xl:border-0 xl:bg-transparent xl:p-0 xl:text-right">
                        <div className="flex items-center gap-2 xl:justify-end">
                          <IndianRupee
                            size={18}
                            className="text-green-600 xl:hidden"
                          />

                          <p className="text-xs text-gray-500">Session Fee</p>
                        </div>

                        <h2 className="text-xl font-bold text-green-600 sm:text-2xl">
                          ₹{session.amount ?? 0}
                        </h2>
                      </div>
                    </div>

                    {/* =================================================
                        SESSION DETAILS
                    ================================================== */}

                    <div className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
                      {/* Date */}

                      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
                        <div className="flex items-center gap-2">
                          <CalendarCheck2 size={17} className="text-blue-600" />

                          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500 sm:text-[11px]">
                            Session Date
                          </p>
                        </div>

                        <h3 className="mt-2 text-sm font-semibold text-gray-800 sm:text-base">
                          {formatDate(session.sessionDate)}
                        </h3>
                      </div>

                      {/* Time */}

                      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
                        <div className="flex items-center gap-2">
                          <Clock3 size={17} className="text-green-600" />

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

                      {/* Duration */}

                      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
                        <div className="flex items-center gap-2">
                          <Clock3 size={17} className="text-purple-600" />

                          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500 sm:text-[11px]">
                            Duration
                          </p>
                        </div>

                        <h3 className="mt-2 text-sm font-semibold text-gray-800 sm:text-base">
                          {session.duration
                            ? `${session.duration} mins`
                            : "N/A"}
                        </h3>
                      </div>

                      {/* Booked On */}

                      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
                        <div className="flex items-center gap-2">
                          <CalendarCheck2
                            size={17}
                            className="text-orange-600"
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
                        STUDENT REVIEW
                    ================================================== */}

                    <div className="mt-5 border-t border-gray-100 pt-5">
                      {session.review ? (
                        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 sm:p-5">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                              Student Review
                            </span>

                            {/* Rating */}

                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={15}
                                  className={
                                    star <= session.review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }
                                />
                              ))}

                              <span className="ml-1 text-sm font-semibold text-gray-700">
                                {session.review.rating}/5
                              </span>
                            </div>
                          </div>

                          {/* Review Text */}

                          {session.review.review && (
                            <p className="mt-3 break-words text-sm italic leading-6 text-gray-700">
                              "{session.review.review}"
                            </p>
                          )}

                          {/* Review Date */}

                          <p className="mt-2 text-xs text-gray-400">
                            Reviewed on {formatDate(session.review.createdAt)}
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center sm:p-5">
                          <p className="text-sm text-gray-500">
                            No review submitted for this session yet.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* =================================================
                        FOOTER INFORMATION
                    ================================================== */}

                    <div className="mt-5 flex flex-col gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} />

                        <span>
                          Payment Status:{" "}
                          <span className="font-semibold text-gray-700">
                            {session.paymentStatus || "N/A"}
                          </span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <CalendarCheck2 size={16} />

                        <span>Completed Session</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletedBookings;
