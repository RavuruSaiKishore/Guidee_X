import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Search,
  Star,
  Users,
  UserRound,
  CalendarCheck,
  Video,
  Eye,
  EyeOff,
  Trash2,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Calendar,
  Clock,
  IndianRupee,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  ExternalLink,
  Filter,
} from "lucide-react";

// =====================================================
// API BASE URL
// =====================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// =====================================================
// MAIN COMPONENT
// =====================================================

const ReviewsManagement = () => {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [ratingFilter, setRatingFilter] = useState("All");

  const [visibilityFilter, setVisibilityFilter] = useState("All");

  const [expandedReview, setExpandedReview] = useState(null);

  const [deleteLoading, setDeleteLoading] = useState(null);

  const [visibilityLoading, setVisibilityLoading] = useState(null);

  // =====================================================
  // FETCH ALL REVIEWS
  // =====================================================

  const fetchReviews = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = localStorage.getItem("AdminToken");

      if (!token) {
        throw new Error("Admin authentication token not found");
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/reviews`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log("All Reviews API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reviews");
      }

      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
    } catch (err) {
      console.error("Fetch reviews error:", err);

      setError(err.message || "Failed to load reviews");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
    fetchReviews();
  }, []);

  // =====================================================
  // PROFILE IMAGE HELPER
  // =====================================================

  const getProfileImage = (image, name) => {
    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "User"
    )}&background=6366f1&color=fff&size=200`;

    if (!image || typeof image !== "string") {
      return fallback;
    }

    const cleanImage = image.trim();

    if (!cleanImage) {
      return fallback;
    }

    if (cleanImage.startsWith("http://") || cleanImage.startsWith("https://")) {
      return cleanImage;
    }

    return `${API_BASE_URL.replace(/\/+$/, "")}/${cleanImage.replace(
      /^\/+/,
      ""
    )}`;
  };

  // =====================================================
  // FILTER REVIEWS
  // =====================================================

  const filteredReviews = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return reviews.filter((review) => {
      const student = review.studentId || {};
      const mentor = review.mentorId || {};
      const booking = review.bookingId || {};

      const studentName = `${student.firstName || ""} ${
        student.lastName || ""
      }`.toLowerCase();

      const mentorName = `${mentor.firstName || ""} ${
        mentor.lastName || ""
      }`.toLowerCase();

      const studentEmail = student.email?.toLowerCase() || "";

      const mentorEmail = mentor.email?.toLowerCase() || "";

      const reviewText = review.review?.toLowerCase() || "";

      const sessionType = booking.sessionType?.toLowerCase() || "";

      const bookingStatus = booking.bookingStatus?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        studentName.includes(searchValue) ||
        mentorName.includes(searchValue) ||
        studentEmail.includes(searchValue) ||
        mentorEmail.includes(searchValue) ||
        reviewText.includes(searchValue) ||
        sessionType.includes(searchValue) ||
        bookingStatus.includes(searchValue);

      const matchesRating =
        ratingFilter === "All" ||
        Number(review.rating) === Number(ratingFilter);

      const matchesVisibility =
        visibilityFilter === "All" ||
        (visibilityFilter === "Visible" && review.isVisible === true) ||
        (visibilityFilter === "Hidden" && review.isVisible === false);

      return matchesSearch && matchesRating && matchesVisibility;
    });
  }, [reviews, search, ratingFilter, visibilityFilter]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const statistics = useMemo(() => {
    const total = reviews.length;

    const visible = reviews.filter(
      (review) => review.isVisible !== false
    ).length;

    const hidden = reviews.filter(
      (review) => review.isVisible === false
    ).length;

    const totalRating = reviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0
    );

    const averageRating = total > 0 ? totalRating / total : 0;

    const fiveStar = reviews.filter(
      (review) => Number(review.rating) === 5
    ).length;

    const oneStar = reviews.filter(
      (review) => Number(review.rating) === 1
    ).length;

    return {
      total,
      visible,
      hidden,
      averageRating,
      fiveStar,
      oneStar,
    };
  }, [reviews]);

  // =====================================================
  // TOGGLE EXPANDED REVIEW
  // =====================================================

  const toggleExpanded = (reviewId) => {
    setExpandedReview((current) => (current === reviewId ? null : reviewId));
  };

  // =====================================================
  // TOGGLE VISIBILITY
  // =====================================================

  const toggleVisibility = async (review) => {
    try {
      setVisibilityLoading(review._id);

      const token = localStorage.getItem("AdminToken");

      if (!token) {
        throw new Error("Admin authentication token not found");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/admin/reviews/${review._id}/visibility`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isVisible: !review.isVisible,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update review visibility");
      }

      setReviews((previousReviews) =>
        previousReviews.map((item) =>
          item._id === review._id
            ? {
                ...item,
                isVisible: !item.isVisible,
              }
            : item
        )
      );
    } catch (err) {
      console.error("Toggle visibility error:", err);

      alert(err.message || "Failed to update review visibility");
    } finally {
      setVisibilityLoading(null);
    }
  };

  // =====================================================
  // DELETE REVIEW
  // =====================================================

  const deleteReview = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(reviewId);

      const token = localStorage.getItem("AdminToken");

      if (!token) {
        throw new Error("Admin authentication token not found");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/admin/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete review");
      }

      setReviews((previousReviews) =>
        previousReviews.filter((review) => review._id !== reviewId)
      );

      if (expandedReview === reviewId) {
        setExpandedReview(null);
      }
    } catch (err) {
      console.error("Delete review error:", err);

      alert(err.message || "Failed to delete review");
    } finally {
      setDeleteLoading(null);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col justify-center items-center px-5">
        <div className="relative">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-4 border-emerald-100" />

          <div className="absolute inset-0 h-14 w-14 sm:h-16 sm:w-16 rounded-full border-4 border-transparent border-t-emerald-600 animate-spin" />
        </div>

        <p className="mt-5 sm:mt-6 text-base sm:text-lg font-semibold text-gray-700 text-center">
          Loading your Review...!
        </p>

        <p className="text-xs sm:text-sm text-gray-400 mt-1 text-center">
          Please wait while we fetch your Review.
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-indigo-600"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="mx-auto max-w-2xl rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertCircle size={28} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Unable to Load Reviews
          </h2>

          <p className="mt-2 text-sm text-red-600">{error}</p>

          <button
            onClick={() => fetchReviews()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="relative mb-6 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 shadow-sm">
        {/* Decorative Background */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-indigo-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-violet-400/15 blur-3xl" />

        <div className="relative p-5 md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* LEFT CONTENT */}
            <div>
              {/* BACK BUTTON */}
              <button
                onClick={() => navigate(-1)}
                className="mb-3 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 transition hover:bg-white/70 hover:text-indigo-600"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              {/* TITLE */}
              <div className="flex items-center gap-3.5">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-md shadow-indigo-200/60">
                  <MessageSquare size={22} />

                  <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-rose-500" />
                </div>

                <div>
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                      Admin Panel
                    </span>

                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                      Feedback Center
                    </span>
                  </div>

                  <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                    Reviews Management
                  </h1>

                  <p className="mt-1 text-xs leading-5 text-slate-500 md:text-sm">
                    Manage student reviews and view related mentors, bookings,
                    and meetings.
                  </p>
                </div>
              </div>
            </div>
            {/* REFRESH BUTTON */}
            <button
              onClick={() => fetchReviews(true)}
              disabled={refreshing}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/80 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-md transition hover:border-indigo-200 hover:bg-white hover:text-indigo-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin"
                    : "transition-transform group-hover:rotate-180"
                }
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
          {/* FEATURE STRIP */}
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-indigo-100/70 pt-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              Student Feedback
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              Mentor Details
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="h-2 w-2 rounded-full bg-fuchsia-500" />
              Booking History
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Meeting Records
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <ReviewStatCard
          icon={<MessageSquare size={20} />}
          label="Total Reviews"
          value={statistics.total}
          iconClass="bg-indigo-50 text-indigo-600"
        />

        <ReviewStatCard
          icon={<Star size={20} />}
          label="Average Rating"
          value={statistics.averageRating.toFixed(1)}
          iconClass="bg-yellow-50 text-yellow-600"
        />

        <ReviewStatCard
          icon={<Eye size={20} />}
          label="Visible"
          value={statistics.visible}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <ReviewStatCard
          icon={<EyeOff size={20} />}
          label="Hidden"
          value={statistics.hidden}
          iconClass="bg-orange-50 text-orange-600"
        />

        <ReviewStatCard
          icon={<Star size={20} />}
          label="5 Star Reviews"
          value={statistics.fiveStar}
          iconClass="bg-purple-50 text-purple-600"
        />
      </div>

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          {/* SEARCH */}

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search student, mentor, email, booking, or review..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white"
            />
          </div>

          {/* FILTERS */}

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 sm:w-40"
              >
                <option value="All">All Ratings</option>

                <option value="5">5 Stars</option>

                <option value="4">4 Stars</option>

                <option value="3">3 Stars</option>

                <option value="2">2 Stars</option>

                <option value="1">1 Star</option>
              </select>
            </div>

            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="All">All Reviews</option>

              <option value="Visible">Visible</option>

              <option value="Hidden">Hidden</option>
            </select>
          </div>
        </div>
      </div>

      {/* =====================================================
          RESULT COUNT
      ===================================================== */}

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          Showing{" "}
          <span className="font-bold text-slate-900">
            {filteredReviews.length}
          </span>{" "}
          of <span className="font-bold text-slate-900">{reviews.length}</span>{" "}
          reviews
        </p>
      </div>

      {/* =====================================================
          EMPTY
      ===================================================== */}

      {filteredReviews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <MessageSquare size={30} />
          </div>

          <h3 className="mt-5 text-lg font-bold text-slate-900">
            No Reviews Found
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            No reviews match your current search or filter criteria.
          </p>
        </div>
      ) : (
        /* =====================================================
           REVIEWS LIST
        ===================================================== */

        <div className="space-y-5">
          {filteredReviews.map((review) => {
            const student = review.studentId || {};

            const mentor = review.mentorId || {};

            const booking = review.bookingId || {};

            const meeting = review.meeting || null;

            const studentName =
              `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
              "Unknown Student";

            const mentorName =
              `${mentor.firstName || ""} ${mentor.lastName || ""}`.trim() ||
              "Unknown Mentor";

            const studentImage = getProfileImage(
              student.profileImage,
              studentName
            );

            const mentorImage = getProfileImage(
              mentor.profileImage,
              mentorName
            );

            const isExpanded = expandedReview === review._id;

            return (
              <div
                key={review._id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* =================================================
                    REVIEW MAIN HEADER
                ================================================== */}

                <div className="p-5 md:p-6">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    {/* STUDENT */}

                    <div className="flex min-w-0 items-center gap-4">
                      <img
                        src={studentImage}
                        alt={studentName}
                        className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-2 ring-slate-100"
                      />

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-900">
                            {studentName}
                          </h3>

                          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600">
                            Student
                          </span>
                        </div>

                        <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                          <Mail size={14} />
                          {student.email || "No email available"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Review submitted {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* RATING + STATUS */}

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1 rounded-xl bg-yellow-50 px-3 py-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={
                              star <= Number(review.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-slate-300"
                            }
                          />
                        ))}

                        <span className="ml-1 text-sm font-bold text-slate-800">
                          {review.rating}/5
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold ${
                          review.isVisible !== false
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {review.isVisible !== false ? (
                          <Eye size={14} />
                        ) : (
                          <EyeOff size={14} />
                        )}

                        {review.isVisible !== false ? "Visible" : "Hidden"}
                      </span>
                    </div>
                  </div>

                  {/* =================================================
                      REVIEW CONTENT
                  ================================================== */}

                  <div className="mt-5 rounded-2xl bg-slate-50 p-4 md:p-5">
                    <div className="flex items-start gap-3">
                      <MessageSquare
                        size={18}
                        className="mt-0.5 shrink-0 text-indigo-500"
                      />

                      <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                        {review.review || "No review comment provided."}
                      </p>
                    </div>
                  </div>

                  {/* =================================================
                      RELATED ENTITIES QUICK VIEW
                  ================================================== */}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {/* STUDENT */}

                    <RelatedCard
                      icon={<UserRound size={18} />}
                      label="Student"
                      value={studentName}
                      secondary={student.email || "No email"}
                      iconClass="bg-indigo-50 text-indigo-600"
                    />

                    {/* MENTOR */}

                    <RelatedCard
                      icon={<Users size={18} />}
                      label="Mentor"
                      value={mentorName}
                      secondary={
                        mentor.profession ||
                        mentor.company ||
                        "Professional Mentor"
                      }
                      iconClass="bg-violet-50 text-violet-600"
                    />

                    {/* BOOKING */}

                    <RelatedCard
                      icon={<CalendarCheck size={18} />}
                      label="Booking"
                      value={booking.sessionType || "Session Booking"}
                      secondary={booking.bookingStatus || "Unknown Status"}
                      iconClass="bg-blue-50 text-blue-600"
                    />

                    {/* MEETING */}

                    <RelatedCard
                      icon={<Video size={18} />}
                      label="Meeting"
                      value={meeting?.roomId || "No Meeting"}
                      secondary={meeting?.status || "Not available"}
                      iconClass="bg-emerald-50 text-emerald-600"
                    />
                  </div>

                  {/* =================================================
                      ACTIONS
                  ================================================== */}

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                    <button
                      onClick={() => toggleExpanded(review._id)}
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600"
                    >
                      {isExpanded ? (
                        <ChevronUp size={17} />
                      ) : (
                        <ChevronDown size={17} />
                      )}

                      {isExpanded ? "Hide Details" : "View Full Details"}
                    </button>

                    <div className="flex flex-wrap gap-2">
                      {/* <button
                        onClick={() => toggleVisibility(review)}
                        disabled={visibilityLoading === review._id}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50"
                      >
                        {review.isVisible !== false ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}

                        {review.isVisible !== false ? "Hide" : "Show"}
                      </button> */}

                      <button
                        onClick={() => deleteReview(review._id)}
                        disabled={deleteLoading === review._id}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-100 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 size={16} />

                        {deleteLoading === review._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    EXPANDED DETAILS
                ================================================== */}

                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/70 p-5 md:p-6">
                    <div className="grid gap-5 xl:grid-cols-2">
                      {/* ============================================
                          STUDENT DETAILS
                      ============================================= */}

                      <EntityDetailsCard
                        title="Student Details"
                        icon={<UserRound size={20} />}
                        iconClass="bg-indigo-100 text-indigo-600"
                      >
                        <DetailItem
                          icon={<UserRound size={16} />}
                          label="Name"
                          value={studentName}
                        />

                        <DetailItem
                          icon={<Mail size={16} />}
                          label="Email"
                          value={student.email}
                        />

                        <DetailItem
                          icon={<Phone size={16} />}
                          label="Phone"
                          value={student.phone}
                        />

                        <DetailItem
                          icon={<Calendar size={16} />}
                          label="Joined"
                          value={formatDate(student.createdAt)}
                        />

                        {student._id && (
                          <button
                            onClick={() =>
                              navigate(`/admin/users/${student._id}`)
                            }
                            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                          >
                            View Student
                            <ExternalLink size={14} />
                          </button>
                        )}
                      </EntityDetailsCard>

                      {/* ============================================
                          MENTOR DETAILS
                      ============================================= */}

                      <EntityDetailsCard
                        title="Mentor Details"
                        icon={<Users size={20} />}
                        iconClass="bg-violet-100 text-violet-600"
                      >
                        <DetailItem
                          icon={<UserRound size={16} />}
                          label="Name"
                          value={mentorName}
                        />

                        <DetailItem
                          icon={<Mail size={16} />}
                          label="Email"
                          value={mentor.email}
                        />

                        <DetailItem
                          icon={<Phone size={16} />}
                          label="Phone"
                          value={mentor.phone}
                        />

                        <DetailItem
                          icon={<Users size={16} />}
                          label="Profession"
                          value={mentor.profession}
                        />

                        <DetailItem
                          icon={<CheckCircle2 size={16} />}
                          label="Verification"
                          value={mentor.verificationStatus}
                        />

                        {mentor._id && (
                          <button
                            onClick={() =>
                              navigate(`/admin/mentors/${mentor._id}`)
                            }
                            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700"
                          >
                            View Mentor
                            <ExternalLink size={14} />
                          </button>
                        )}
                      </EntityDetailsCard>

                      {/* ============================================
                          BOOKING DETAILS
                      ============================================= */}

                      <EntityDetailsCard
                        title="Booking Details"
                        icon={<CalendarCheck size={20} />}
                        iconClass="bg-blue-100 text-blue-600"
                      >
                        <DetailItem
                          icon={<Calendar size={16} />}
                          label="Session Date"
                          value={formatDate(booking.sessionDate)}
                        />

                        <DetailItem
                          icon={<Clock size={16} />}
                          label="Time"
                          value={
                            booking.startTime
                              ? `${booking.startTime}${
                                  booking.endTime ? ` - ${booking.endTime}` : ""
                                }`
                              : null
                          }
                        />

                        <DetailItem
                          icon={<CalendarCheck size={16} />}
                          label="Session Type"
                          value={booking.sessionType}
                        />

                        <DetailItem
                          icon={<IndianRupee size={16} />}
                          label="Amount"
                          value={
                            booking.amount !== undefined
                              ? `${booking.currency || "INR"} ${Number(
                                  booking.amount
                                ).toLocaleString("en-US")}`
                              : null
                          }
                        />

                        <DetailItem
                          icon={<CheckCircle2 size={16} />}
                          label="Booking Status"
                          value={booking.bookingStatus}
                        />

                        <DetailItem
                          icon={<CheckCircle2 size={16} />}
                          label="Payment Status"
                          value={booking.paymentStatus}
                        />
                      </EntityDetailsCard>

                      {/* ============================================
                          MEETING DETAILS
                      ============================================= */}

                      <EntityDetailsCard
                        title="Meeting Details"
                        icon={<Video size={20} />}
                        iconClass="bg-emerald-100 text-emerald-600"
                      >
                        {meeting ? (
                          <>
                            <DetailItem
                              icon={<Video size={16} />}
                              label="Room ID"
                              value={meeting.roomId}
                            />

                            <DetailItem
                              icon={<Calendar size={16} />}
                              label="Scheduled Date"
                              value={formatDate(meeting.createdAt)}
                            />

                            <DetailItem
                              icon={<Clock size={16} />}
                              label="Start Time"
                              value={meeting.scheduledStartTime}
                            />

                            <DetailItem
                              icon={<Clock size={16} />}
                              label="End Time"
                              value={meeting.scheduledEndTime}
                            />

                            <DetailItem
                              icon={<CheckCircle2 size={16} />}
                              label="Meeting Status"
                              value={meeting.status}
                            />

                            <div className="mt-3 flex flex-wrap gap-2">
                              <span
                                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                                  meeting.mentorJoined
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                Mentor{" "}
                                {meeting.mentorJoined ? "Joined" : "Not Joined"}
                              </span>

                              <span
                                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                                  meeting.studentJoined
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                Student{" "}
                                {meeting.studentJoined
                                  ? "Joined"
                                  : "Not Joined"}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-3 rounded-xl bg-white p-4">
                            <AlertCircle size={20} className="text-slate-400" />

                            <p className="text-sm text-slate-500">
                              No meeting record found for this booking.
                            </p>
                          </div>
                        )}
                      </EntityDetailsCard>
                    </div>

                    {/* ================================================
                        REVIEW METADATA
                    ================================================= */}

                    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                      <h3 className="font-bold text-slate-900">
                        Review Information
                      </h3>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <DetailItem
                          icon={<MessageSquare size={16} />}
                          label="Review ID"
                          value={review._id}
                        />

                        <DetailItem
                          icon={<Calendar size={16} />}
                          label="Created"
                          value={formatDate(review.createdAt)}
                        />

                        <DetailItem
                          icon={<Calendar size={16} />}
                          label="Updated"
                          value={formatDate(review.updatedAt)}
                        />

                        <DetailItem
                          icon={<Eye size={16} />}
                          label="Visibility"
                          value={
                            review.isVisible !== false ? "Visible" : "Hidden"
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// =====================================================
// REVIEW STAT CARD
// =====================================================

const ReviewStatCard = ({ icon, label, value, iconClass }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <p className="text-sm font-medium text-slate-500">{label}</p>

      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
};

// =====================================================
// RELATED CARD
// =====================================================

const RelatedCard = ({ icon, label, value, secondary, iconClass }) => {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-bold text-slate-800">
          {value}
        </p>

        <p className="mt-0.5 truncate text-xs text-slate-500">{secondary}</p>
      </div>
    </div>
  );
};

// =====================================================
// ENTITY DETAILS CARD
// =====================================================

const EntityDetailsCard = ({ title, icon, iconClass, children }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <h3 className="font-bold text-slate-900">{title}</h3>
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  );
};

// =====================================================
// DETAIL ITEM
// =====================================================

const DetailItem = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0 text-slate-400">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-700">
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
};

// =====================================================
// DATE FORMATTER
// =====================================================

const formatDate = (date) => {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default ReviewsManagement;
