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
  Sparkles,
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
      )}`;
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
            Loading Completed Bookings...
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
        {/* =================================================
            HEADER
        ================================================== */}
        <section className="relative overflow-hidden rounded-3xl bg-black p-6 sm:p-8 text-white shadow-md">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur shadow-inner text-blue-400"
                style={{ fontWeight: 600 }}
              >
                <CalendarCheck2 size={26} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-blue-300 backdrop-blur"
                    style={{ fontWeight: 600 }}
                  >
                    <Sparkles size={13} className="text-blue-400" />
                    History Suite
                  </span>
                </div>

                <h1
                  className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-white"
                  style={{ fontWeight: 600 }}
                >
                  Completed Booking Sessions
                </h1>

                <p
                  className="mt-1 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed"
                  style={{ fontWeight: 600 }}
                >
                  View and manage all completed mentorship sessions and student
                  reviews.
                </p>
              </div>
            </div>

            <div
              className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur shadow-inner shrink-0"
              style={{ fontWeight: 600 }}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-base font-semibold text-black shadow-xs">
                {filteredSessions.length}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Total
                </p>
                <h3 className="text-sm font-semibold text-white">Completed</h3>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            SEARCH
        ================================================== */}
        <section className="space-y-3">
          <div className="flex flex-col lg:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative min-w-0 flex-1 w-full">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by student, email, session type..."
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
                Matching Sessions
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-black text-white text-xs">
                {filteredSessions.length}
              </span>
            </div>
          </div>
        </section>

        {/* =================================================
            EMPTY STATE
        ================================================== */}
        {filteredSessions.length === 0 ? (
          <section className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-5 py-16 text-center shadow-xs">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
              <CalendarCheck2 size={26} />
            </div>

            <h2
              className="text-base font-semibold text-slate-900 tracking-tight"
              style={{ fontWeight: 600 }}
            >
              {searchTerm
                ? "No Matching Completed Sessions"
                : "No Completed Sessions"}
            </h2>

            <p
              className="mt-1 max-w-sm text-center text-xs text-slate-500 font-medium leading-relaxed"
              style={{ fontWeight: 600 }}
            >
              {searchTerm
                ? "No completed sessions match your current search. Try using a different search term."
                : "There are currently no completed mentorship sessions. Completed sessions will appear here."}
            </p>

            {searchTerm && (
              <button
                onClick={clearSearch}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 shadow-xs"
                style={{ fontWeight: 600 }}
              >
                <RefreshCw size={14} className="text-blue-400" />
                Clear Search
              </button>
            )}
          </section>
        ) : (
          /* =================================================
             SESSION LIST
          ================================================== */
          <section className="w-full space-y-4">
            {filteredSessions.map((session) => (
              <article
                key={session._id}
                className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs transition duration-200 hover:border-blue-300 hover:shadow-md p-5 sm:p-6"
              >
                <div className="w-full space-y-5">
                  {/* TOP SECTION */}
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between pb-4 border-b border-slate-100">
                    <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
                      <img
                        src={getProfileImage(session.student)}
                        alt={`${session.student?.firstName || "Student"} ${
                          session.student?.lastName || ""
                        }`}
                        className="h-12 w-12 shrink-0 rounded-2xl border border-slate-200 object-cover shadow-2xs"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://ui-avatars.com/api/?name=Student";
                        }}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2
                            className="break-words text-xs sm:text-sm font-semibold text-slate-900 tracking-tight"
                            style={{ fontWeight: 600 }}
                          >
                            {session.student?.firstName || "Student"}{" "}
                            {session.student?.lastName || ""}
                          </h2>

                          <span
                            className="rounded-full px-3 py-1 text-[11px] font-semibold border border-blue-200 bg-blue-50 text-blue-700"
                            style={{ fontWeight: 600 }}
                          >
                            {session.bookingStatus || "Completed"}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${
                              session.paymentStatus === "Paid"
                                ? "border-blue-200 bg-blue-50 text-blue-700"
                                : "border-red-200 bg-red-50 text-red-700"
                            }`}
                            style={{ fontWeight: 600 }}
                          >
                            {session.paymentStatus || "N/A"}
                          </span>
                        </div>

                        <p
                          className="mt-1 break-all text-[11px] text-slate-500 font-medium"
                          style={{ fontWeight: 600 }}
                        >
                          {session.student?.email || "No email available"}
                        </p>

                        <div
                          className="mt-2 inline-flex max-w-full rounded-xl bg-slate-100 border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700"
                          style={{ fontWeight: 600 }}
                        >
                          <span className="truncate">
                            {session.sessionType || "Mentorship Session"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 xl:min-w-[150px] xl:bg-transparent xl:px-0 xl:py-0 xl:text-right">
                      <p
                        className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold"
                        style={{ fontWeight: 600 }}
                      >
                        Session Fee
                      </p>
                      <h2
                        className="text-base sm:text-lg font-semibold text-emerald-600 mt-0.5"
                        style={{ fontWeight: 600 }}
                      >
                        ₹{session.amount ?? 0}
                      </h2>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs font-semibold">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                      <p
                        className="text-[10px] uppercase tracking-wide text-slate-400"
                        style={{ fontWeight: 600 }}
                      >
                        Session Date
                      </p>
                      <h3
                        className="mt-1 text-slate-900"
                        style={{ fontWeight: 600 }}
                      >
                        {formatDate(session.sessionDate)}
                      </h3>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
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
                        {session.startTime || "N/A"}
                      </h3>
                      {session.endTime && (
                        <p
                          className="text-[11px] text-slate-500 font-medium"
                          style={{ fontWeight: 600 }}
                        >
                          {session.endTime}
                        </p>
                      )}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                      <p
                        className="text-[10px] uppercase tracking-wide text-slate-400"
                        style={{ fontWeight: 600 }}
                      >
                        Duration
                      </p>
                      <h3
                        className="mt-1 text-slate-900"
                        style={{ fontWeight: 600 }}
                      >
                        {session.duration ? `${session.duration} mins` : "N/A"}
                      </h3>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                      <p
                        className="text-[10px] uppercase tracking-wide text-slate-400"
                        style={{ fontWeight: 600 }}
                      >
                        Booked On
                      </p>
                      <h3
                        className="mt-1 text-slate-900"
                        style={{ fontWeight: 600 }}
                      >
                        {formatDate(session.createdAt)}
                      </h3>
                    </div>
                  </div>

                  {/* STUDENT REVIEW */}
                  {session.review ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-semibold space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <p
                          className="text-[10px] uppercase tracking-wider text-slate-400"
                          style={{ fontWeight: 600 }}
                        >
                          Student Review
                        </p>

                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={
                                star <= session.review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                              }
                            />
                          ))}
                          <span className="ml-1 text-xs text-slate-700 font-semibold">
                            {session.review.rating}/5
                          </span>
                        </div>
                      </div>

                      {session.review.review && (
                        <p
                          className="break-words leading-relaxed text-slate-700 font-medium italic"
                          style={{ fontWeight: 600 }}
                        >
                          "{session.review.review}"
                        </p>
                      )}

                      <p className="text-[10px] text-slate-400 font-medium">
                        Reviewed on {formatDate(session.review.createdAt)}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500 font-semibold">
                      No review submitted for this session yet.
                    </div>
                  )}

                  {/* FOOTER INFORMATION */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-slate-500">
                    <div className="flex items-center gap-2">
                      <CreditCard size={15} className="text-blue-600" />
                      <span>
                        Payment Status:{" "}
                        <span className="text-slate-900 font-semibold">
                          {session.paymentStatus || "N/A"}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarCheck2 size={15} className="text-emerald-600" />
                      <span>Completed Session</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default CompletedBookings;
