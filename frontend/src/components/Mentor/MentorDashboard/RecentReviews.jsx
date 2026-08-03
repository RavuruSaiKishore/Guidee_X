import { Star, MessageSquare, CalendarDays, Quote } from "lucide-react";

export default function RecentReviews({
  reviews = [],
  averageRating = 0,
  totalReviews = 0,
}) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const getAvatarUrl = (studentName, profileImage) => {
    if (profileImage) {
      return `${API_BASE_URL}/${profileImage}`.replace(/([^:]\/)\/+/g, "$1");
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      studentName
    )}&background=f97316&color=fff`;
  };

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md sm:rounded-3xl sm:shadow-lg">
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex flex-col gap-4 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-5 lg:px-6">
        {/* Title */}

        <div className="min-w-0">
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Recent Reviews
          </h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Feedback from your students
          </p>
        </div>

        {/* Rating */}

        <div className="flex w-full items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 sm:w-auto sm:rounded-2xl sm:px-5 sm:py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 sm:h-10 sm:w-10">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold leading-none text-gray-800 sm:text-2xl">
                {Number(averageRating || 0).toFixed(1)}
              </p>

              <span className="text-xs text-gray-400">/ 5</span>
            </div>

            <p className="mt-1 text-xs text-gray-500">
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>
      </div>

      {/* ==========================================
          EMPTY STATE
      ========================================== */}

      {reviews.length === 0 && (
        <div className="flex min-h-[280px] flex-col items-center justify-center px-5 py-10 text-center sm:min-h-[320px]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
            <MessageSquare size={36} className="text-gray-300" />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-gray-700 sm:text-xl">
            No Reviews Yet
          </h3>

          <p className="mt-2 max-w-sm text-xs text-gray-500 sm:text-sm">
            Student reviews will appear here after your mentorship sessions.
          </p>
        </div>
      )}

      {/* ==========================================
          REVIEWS
      ========================================== */}

      {reviews.length > 0 && (
        <div className="grid grid-cols-1 gap-4 p-4 sm:gap-5 sm:p-5 md:grid-cols-2 lg:p-6">
          {reviews.map((review) => {
            const studentName = `${review.student?.firstName || "Anonymous"} ${
              review.student?.lastName || ""
            }`.trim();

            const avatarSrc = getAvatarUrl(
              studentName,
              review.student?.profileImage
            );

            return (
              <article
                key={review._id}
                className="group relative min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4 transition duration-300 hover:border-orange-300 hover:bg-white hover:shadow-md sm:rounded-2xl sm:p-5"
              >
                {/* Accent */}

                <div className="absolute left-0 top-0 h-full w-1 bg-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* ==========================================
                    TOP
                ========================================== */}

                <div className="flex min-w-0 items-start justify-between gap-3">
                  {/* Student */}

                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={avatarSrc}
                      alt={studentName}
                      className="h-10 w-10 shrink-0 rounded-full border-2 border-white object-cover shadow-sm sm:h-12 sm:w-12"
                      onError={(e) => {
                        e.currentTarget.src = getAvatarUrl(studentName);
                      }}
                    />

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold leading-tight text-gray-800 sm:text-base">
                        {studentName}
                      </h3>

                      <p className="mt-0.5 text-[11px] text-gray-500 sm:text-xs">
                        Student
                      </p>
                    </div>
                  </div>

                  {/* Rating Badge */}

                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-[10px] font-semibold text-orange-700 sm:px-2.5 sm:py-1 sm:text-xs">
                    <Star size={11} className="fill-orange-700 sm:h-3 sm:w-3" />
                    {review.rating}/5
                  </span>
                </div>

                {/* ==========================================
                    STARS
                ========================================== */}

                <div className="mt-3 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>

                {/* ==========================================
                    COMMENT
                ========================================== */}

                <div className="relative mt-4 pl-5 sm:pl-6">
                  <Quote
                    size={16}
                    className="absolute left-0 top-0 -scale-x-100 text-orange-200 sm:h-[18px] sm:w-[18px]"
                    fill="currentColor"
                  />

                  <p className="break-words text-xs leading-relaxed text-gray-700 sm:text-sm">
                    {review.comment || "No comment provided."}
                  </p>
                </div>

                {/* ==========================================
                    FOOTER
                ========================================== */}

                <div className="mt-4 flex items-center border-t border-gray-200 pt-3 sm:mt-5">
                  <div className="flex min-w-0 items-center gap-1.5 text-[10px] text-gray-500 sm:text-xs">
                    <CalendarDays
                      size={13}
                      className="shrink-0 sm:h-3.5 sm:w-3.5"
                    />

                    <span className="truncate">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "Date unavailable"}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
