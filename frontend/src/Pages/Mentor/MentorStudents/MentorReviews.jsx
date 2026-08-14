import { useEffect, useMemo, useState } from "react";
import {
  Star,
  Search,
  MessageSquare,
  Users,
  TrendingUp,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserRound,
  CalendarDays,
  Sparkles,
} from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MentorReviews = () => {
  const [reviews, setReviews] = useState([]);

  const [statistics, setStatistics] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  });

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedRating, setSelectedRating] = useState("all");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
  });

  /*
  =========================================================
  FETCH REVIEWS
  =========================================================
  */

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("MentorToken");

      if (!token) {
        toast.error("Mentor authentication required.");
        return;
      }

      let url = `${API_BASE_URL}/api/mentorReview/reviews?page=${page}&limit=10`;

      if (selectedRating !== "all") {
        url += `&rating=${selectedRating}`;
      }

      const response = await fetch(url, {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to fetch reviews.");
      }

      setReviews(data.data?.reviews || []);

      setStatistics(
        data.data?.statistics || {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
          },
        }
      );

      setPagination(
        data.data?.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalReviews: 0,
        }
      );
    } catch (error) {
      console.error("Reviews fetch error:", error);

      toast.error(error.message || "Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  /*
  =========================================================
  INITIAL FETCH
  =========================================================
  */

  useEffect(() => {
    fetchReviews();
  }, [page, selectedRating]);

  /*
  =========================================================
  FILTER SEARCH
  =========================================================
  */

  const filteredReviews = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return reviews;
    }

    return reviews.filter((item) => {
      const student = item.studentId;

      const studentName = `${student?.firstName || ""} ${
        student?.lastName || ""
      }`.toLowerCase();

      const reviewText = item.review?.toLowerCase() || "";

      return studentName.includes(query) || reviewText.includes(query);
    });
  }, [reviews, search]);

  /*
  =========================================================
  FORMAT DATE
  =========================================================
  */

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown date";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /*
  =========================================================
  PROFILE IMAGE
  =========================================================
  */

  const getProfileImage = (student) => {
    if (!student?.profileImage) {
      return null;
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

  /*
  =========================================================
  STAR COMPONENT
  =========================================================
  */

  const renderStars = (rating, size = 15) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "text-slate-200"
            }
          />
        ))}
      </div>
    );
  };

  /*
  =========================================================
  RATING BAR
  =========================================================
  */

  const getPercentage = (count) => {
    if (!statistics.totalReviews) {
      return 0;
    }

    return Math.round((count / statistics.totalReviews) * 100);
  };

  /*
  =========================================================
  LOADING
  =========================================================
  */

  if (loading && reviews.length === 0) {
    return (
      <div
        className="min-h-screen bg-slate-50 pt-16 sm:pt-20 lg:ml-64 lg:pt-0 text-slate-900"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-2 sm:px-5">
          <div className="relative">
            <div className="h-14 w-14 rounded-full border-4 border-slate-200" />
            <div className="absolute inset-0 h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
          </div>
          <p
            className="mt-5 text-center text-xs font-semibold tracking-tight"
            style={{ fontWeight: 600 }}
          >
            Loading Reviews...
          </p>
          <p
            className="mt-1 text-center text-[11px] text-slate-400 font-medium"
            style={{ fontWeight: 600 }}
          >
            Fetching feedback from your students...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-50 pt-16 sm:pt-20 lg:ml-64 lg:pt-0 text-slate-900 pb-16"
      style={{ fontFamily: "'Poppins', sans-serif", fontStyle: "normal" }}
    >
      <ToastContainer position="top-right" autoClose={2500} />

      <main className="w-full max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8 space-y-4 sm:space-y-6">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-black p-4 sm:p-8 text-white shadow-md w-full">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 min-w-0">
              <div
                className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur shadow-inner text-blue-400"
                style={{ fontWeight: 600 }}
              >
                <MessageSquare size={22} className="sm:w-[26px] sm:h-[26px]" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-blue-300 backdrop-blur"
                    style={{ fontWeight: 600 }}
                  >
                    <Sparkles size={12} className="text-blue-400" />
                    Mentor Feedback
                  </span>
                </div>

                <h1
                  className="mt-1.5 sm:mt-2 text-xl sm:text-3xl font-semibold tracking-tight text-white"
                  style={{ fontWeight: 600 }}
                >
                  My Reviews
                </h1>

                <p
                  className="mt-0.5 sm:mt-1 text-[11px] sm:text-sm text-slate-300 font-medium leading-relaxed"
                  style={{ fontWeight: 600 }}
                >
                  View feedback from students, monitor your ratings, and
                  understand your mentorship experience.
                </p>
              </div>
            </div>

            <div
              className="flex items-center gap-3.5 sm:gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 sm:px-5 py-3.5 sm:py-4 backdrop-blur shadow-inner shrink-0"
              style={{ fontWeight: 600 }}
            >
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-white text-sm sm:text-base font-semibold text-black shadow-xs">
                {statistics.totalReviews}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Total
                </p>
                <h3 className="text-xs sm:text-sm font-semibold text-white">
                  Reviews
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* TOP STATS */}
        {/* ================================================= */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 text-xs font-semibold w-full">
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs flex items-center justify-between">
            <div>
              <p
                className="text-[10px] uppercase tracking-wide text-slate-400"
                style={{ fontWeight: 600 }}
              >
                Average Rating
              </p>
              <h2
                className="mt-1 text-xl sm:text-2xl font-semibold text-slate-900"
                style={{ fontWeight: 600 }}
              >
                {Number(statistics.averageRating || 0).toFixed(1)}
              </h2>
              <div className="mt-2">
                {renderStars(Math.round(statistics.averageRating || 0), 14)}
              </div>
            </div>

            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 border border-amber-100 text-amber-500">
              <Star size={22} className="fill-amber-400 text-amber-400" />
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs flex items-center justify-between">
            <div>
              <p
                className="text-[10px] uppercase tracking-wide text-slate-400"
                style={{ fontWeight: 600 }}
              >
                Total Reviews
              </p>
              <h2
                className="mt-1 text-xl sm:text-2xl font-semibold text-slate-900"
                style={{ fontWeight: 600 }}
              >
                {statistics.totalReviews}
              </h2>
              <p
                className="mt-2 text-[11px] text-slate-500 font-medium"
                style={{ fontWeight: 600 }}
              >
                Feedback received
              </p>
            </div>

            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 text-blue-600">
              <MessageSquare size={22} />
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs flex items-center justify-between">
            <div>
              <p
                className="text-[10px] uppercase tracking-wide text-slate-400"
                style={{ fontWeight: 600 }}
              >
                Student Feedback
              </p>
              <h2
                className="mt-1 text-xl sm:text-2xl font-semibold text-slate-900"
                style={{ fontWeight: 600 }}
              >
                {statistics.totalReviews}
              </h2>
              <p
                className="mt-2 text-[11px] text-slate-500 font-medium"
                style={{ fontWeight: 600 }}
              >
                Students who shared experience
              </p>
            </div>

            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600">
              <Users size={22} />
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* RATING DISTRIBUTION */}
        {/* ================================================= */}
        <section className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 border border-amber-100 text-amber-600">
              <TrendingUp size={18} />
            </div>
            <div>
              <h2
                className="text-xs sm:text-sm font-semibold text-slate-900 tracking-tight"
                style={{ fontWeight: 600 }}
              >
                Rating Distribution
              </h2>
              <p
                className="text-[10px] sm:text-xs text-slate-500 font-medium"
                style={{ fontWeight: 600 }}
              >
                See how students have rated your mentorship.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = statistics.ratingDistribution?.[rating] || 0;

              const percentage = getPercentage(count);

              return (
                <div
                  key={rating}
                  className="flex items-center gap-3 text-xs font-semibold"
                >
                  <div className="flex w-14 shrink-0 items-center gap-1">
                    <span
                      className="text-slate-700"
                      style={{ fontWeight: 600 }}
                    >
                      {rating}
                    </span>
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                  </div>

                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <span
                    className="w-10 text-right text-slate-500"
                    style={{ fontWeight: 600 }}
                  >
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================================================= */}
        {/* FILTERS */}
        {/* ================================================= */}
        <section className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs">
          <div className="flex flex-col lg:flex-row items-center gap-3">
            <div className="relative min-w-0 flex-1 w-full">
              <Search
                size={16}
                className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student or review..."
                className="w-full h-10 sm:h-11 pl-10 sm:pl-11 pr-3 sm:pr-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                style={{ fontWeight: 600 }}
              />
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
              <Filter size={15} className="text-slate-400" />
              <select
                value={selectedRating}
                onChange={(e) => {
                  setSelectedRating(e.target.value);
                  setPage(1);
                }}
                className="w-full lg:w-48 h-10 sm:h-11 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                style={{ fontWeight: 600 }}
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* RECENT REVIEWS */}
        {/* ================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2
                className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight"
                style={{ fontWeight: 600 }}
              >
                Recent Reviews
              </h2>
              <p
                className="text-xs text-slate-500 font-medium mt-0.5"
                style={{ fontWeight: 600 }}
              >
                Latest feedback from your students.
              </p>
            </div>

            {loading && (
              <Loader2 size={18} className="animate-spin text-blue-600" />
            )}
          </div>

          {filteredReviews.length === 0 ? (
            <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3">
                <MessageSquare size={24} />
              </div>

              <h3
                className="text-xs sm:text-sm font-semibold text-slate-900 tracking-tight"
                style={{ fontWeight: 600 }}
              >
                No reviews found
              </h3>

              <p
                className="mt-1 text-xs text-slate-500 font-medium max-w-sm mx-auto"
                style={{ fontWeight: 600 }}
              >
                Student reviews will appear here once they submit feedback.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredReviews.map((item) => {
                const student = item.studentId;

                const studentName =
                  `${student?.firstName || ""} ${
                    student?.lastName || ""
                  }`.trim() || "Student";

                const profileImg = getProfileImage(student);

                return (
                  <article
                    key={item._id}
                    className="w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-xs transition duration-200 hover:border-blue-300 hover:shadow-md p-4 sm:p-6"
                  >
                    <div className="flex flex-col gap-4 sm:gap-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-3 sm:pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-100 shadow-2xs">
                            {profileImg ? (
                              <img
                                src={profileImg}
                                alt={studentName}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-black text-white text-xs font-semibold">
                                <UserRound
                                  size={16}
                                  className="text-blue-400"
                                />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <h3
                              className="text-xs sm:text-sm font-semibold text-slate-900 truncate tracking-tight"
                              style={{ fontWeight: 600 }}
                            >
                              {studentName}
                            </h3>

                            <p
                              className="mt-0.5 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 font-medium"
                              style={{ fontWeight: 600 }}
                            >
                              <CalendarDays size={12} />
                              {formatDate(item.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className="rounded-full px-3 py-1 text-[10px] sm:text-[11px] font-semibold border border-amber-200 bg-amber-50 text-amber-700"
                            style={{ fontWeight: 600 }}
                          >
                            {item.rating}/5 Stars
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          {renderStars(item.rating, 14)}
                        </div>

                        <p
                          className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap"
                          style={{ fontWeight: 600 }}
                        >
                          {item.review ||
                            "The student did not leave written feedback."}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* ================================================= */}
        {/* PAGINATION */}
        {/* ================================================= */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2.5 pt-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 shadow-xs"
              style={{ fontWeight: 600 }}
            >
              <ChevronLeft size={15} />
              Previous
            </button>

            <div
              className="rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white shadow-xs"
              style={{ fontWeight: 600 }}
            >
              {pagination.currentPage} / {pagination.totalPages}
            </div>

            <button
              disabled={page >= pagination.totalPages}
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, pagination.totalPages))
              }
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 shadow-xs"
              style={{ fontWeight: 600 }}
            >
              Next
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MentorReviews;
