import { useEffect, useMemo, useState } from "react";
import {
  Star,
  Search,
  MessageSquare,
  Users,
  TrendingUp,
  Filter,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  UserRound,
  CalendarDays,
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
      console.log(data);

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
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${student?.firstName || "Student"} ${student?.lastName || ""}`
      )}&background=4f46e5&color=fff`;
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

  const renderStars = (rating, size = 18) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300"
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
      <main className="lg:ml-64 min-h-screen bg-slate-50 pt-16 lg:pt-0">
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
              <Loader2 size={32} className="animate-spin text-indigo-600" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-800">
              Loading Reviews
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Fetching feedback from your students...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} />

      <main className="lg:ml-64 min-h-screen bg-slate-50 pt-16 lg:pt-0">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="mb-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200">
                    <MessageSquare size={28} className="text-white" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                      Mentor Feedback
                    </p>

                    <h1 className="mt-1 text-3xl font-black text-slate-900">
                      My Reviews
                    </h1>
                  </div>
                </div>

                <p className="mt-4 max-w-2xl text-slate-500">
                  View feedback from students, monitor your ratings, and
                  understand your mentorship experience.
                </p>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* TOP STATS */}
          {/* ================================================= */}

          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Average Rating */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Average Rating
                  </p>

                  <h2 className="mt-2 text-4xl font-black text-slate-900">
                    {Number(statistics.averageRating || 0).toFixed(1)}
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
                  <Star size={28} className="fill-amber-400 text-amber-400" />
                </div>
              </div>

              <div className="mt-4">
                {renderStars(Math.round(statistics.averageRating || 0))}
              </div>
            </div>

            {/* Total Reviews */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Total Reviews
                  </p>

                  <h2 className="mt-2 text-4xl font-black text-slate-900">
                    {statistics.totalReviews}
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
                  <MessageSquare size={28} className="text-indigo-600" />
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-500">
                Feedback received from your students
              </p>
            </div>

            {/* Students */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Student Feedback
                  </p>

                  <h2 className="mt-2 text-4xl font-black text-slate-900">
                    {statistics.totalReviews}
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                  <Users size={28} className="text-emerald-600" />
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-500">
                Students who shared their experience
              </p>
            </div>
          </section>

          {/* ================================================= */}
          {/* RATING DISTRIBUTION */}
          {/* ================================================= */}

          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
                <TrendingUp size={21} className="text-amber-600" />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Rating Distribution
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  See how students have rated your mentorship.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = statistics.ratingDistribution?.[rating] || 0;

                const percentage = getPercentage(count);

                return (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex w-16 shrink-0 items-center gap-1">
                      <span className="text-sm font-bold text-slate-700">
                        {rating}
                      </span>

                      <Star
                        size={15}
                        className="fill-amber-400 text-amber-400"
                      />
                    </div>

                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <span className="w-12 text-right text-sm font-bold text-slate-500">
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

          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}

              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search student or review..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              {/* Rating Filter */}

              <div className="flex items-center gap-3">
                <Filter size={18} className="text-slate-400" />

                <select
                  value={selectedRating}
                  onChange={(e) => {
                    setSelectedRating(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500"
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

          <section className="mt-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Recent Reviews
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest feedback from your students.
                </p>
              </div>

              {loading && (
                <Loader2 size={20} className="animate-spin text-indigo-600" />
              )}
            </div>

            {filteredReviews.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                  <MessageSquare size={30} className="text-slate-400" />
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-800">
                  No reviews found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Student reviews will appear here once they submit feedback.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredReviews.map((item) => {
                  const student = item.studentId;

                  const studentName =
                    `${student?.firstName || ""} ${
                      student?.lastName || ""
                    }`.trim() || "Student";

                  return (
                    <article
                      key={item._id}
                      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row">
                        {/* Student */}

                        <div className="flex items-start gap-4 sm:w-64">
                          <img
                            src={getProfileImage(student)}
                            alt={studentName}
                            className="h-14 w-14 rounded-2xl object-cover"
                          />

                          <div className="min-w-0">
                            <h3 className="truncate font-bold text-slate-900">
                              {studentName}
                            </h3>

                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                              <CalendarDays size={13} />

                              {formatDate(item.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Review */}

                        <div className="min-w-0 flex-1 border-t border-slate-100 pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            {renderStars(item.rating, 17)}

                            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                              {item.rating}/5
                            </span>
                          </div>

                          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
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
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={18} />
                Previous
              </button>

              <div className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white">
                {pagination.currentPage} / {pagination.totalPages}
              </div>

              <button
                disabled={page >= pagination.totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, pagination.totalPages))
                }
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default MentorReviews;
