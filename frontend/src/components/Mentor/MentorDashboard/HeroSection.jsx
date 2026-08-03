import {
  Star,
  Briefcase,
  MapPin,
  BadgeCheck,
  CalendarDays,
  Clock3,
  Pencil,
} from "lucide-react";

export default function HeroSection({ mentor }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const imageUrl = mentor?.profileImage
    ? `${API_BASE_URL}/${mentor.profileImage}`.replace(/([^:]\/)\/+/g, "$1")
    : "/default-avatar.png";

  console.log("Mentor Image:", imageUrl);

  return (
    <section className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 p-4 sm:p-6 lg:p-8 shadow-lg sm:shadow-xl">
      {/* ==========================================
          DECORATIVE CIRCLES
      ========================================== */}

      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 sm:h-56 sm:w-56 lg:h-64 lg:w-64 rounded-full bg-white/10" />

      <div className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-white/10" />

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <div className="relative z-10 flex flex-col gap-6 sm:gap-8 xl:flex-row xl:items-start xl:justify-between">
        {/* ==========================================
            LEFT CONTENT
        ========================================== */}

        <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
          {/* ==========================================
              PROFILE IMAGE
          ========================================== */}

          <div className="relative mx-auto h-24 w-24 shrink-0 sm:mx-0 sm:h-28 sm:w-28 lg:h-32 lg:w-32">
            <div className="h-full w-full overflow-hidden rounded-full border-4 border-white shadow-xl">
              <img
                src={imageUrl}
                alt={`${mentor?.firstName || "Mentor"} ${
                  mentor?.lastName || ""
                }`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/default-avatar.png";
                }}
              />
            </div>

            {mentor?.verificationStatus === "Approved" && (
              <div className="absolute bottom-0 right-0 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-green-500 ring-2 ring-white">
                <BadgeCheck className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            )}
          </div>

          {/* ==========================================
              MENTOR DETAILS
          ========================================== */}

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              Welcome back,
            </h1>

            <h2 className="mt-1 text-xl font-bold text-white sm:mt-2 sm:text-2xl lg:text-3xl break-words">
              {mentor?.firstName} {mentor?.lastName}
            </h2>

            <p className="mt-2 text-sm text-orange-100 sm:text-base lg:text-lg">
              {mentor?.headline || mentor?.profession || "Mentor"}
            </p>

            {/* ==========================================
                META INFORMATION
            ========================================== */}

            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-white sm:mt-5 sm:justify-start sm:gap-5">
              {/* Company */}

              <div className="flex min-w-0 items-center gap-2">
                <Briefcase
                  size={16}
                  className="shrink-0 sm:h-[18px] sm:w-[18px]"
                />

                <span className="truncate">
                  {mentor?.company || "Independent Mentor"}
                </span>
              </div>

              {/* Location */}

              <div className="flex min-w-0 items-center gap-2">
                <MapPin
                  size={16}
                  className="shrink-0 sm:h-[18px] sm:w-[18px]"
                />

                <span className="truncate">
                  {mentor?.location?.city || "-"},{" "}
                  {mentor?.location?.country || "-"}
                </span>
              </div>

              {/* Rating */}

              <div className="flex items-center gap-2">
                <Star
                  size={16}
                  className="shrink-0 fill-yellow-300 text-yellow-300 sm:h-[18px] sm:w-[18px]"
                />

                <span>
                  {mentor?.averageRating?.toFixed(1) || "0.0"} (
                  {mentor?.totalReviews || 0})
                </span>
              </div>
            </div>

            {/* ==========================================
                SKILLS
            ========================================== */}

            {mentor?.primarySkill?.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:mt-6 sm:justify-start">
                {mentor.primarySkill.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur sm:px-4 sm:text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ==========================================
            RIGHT CONTENT
        ========================================== */}

        <div className="w-full shrink-0 xl:max-w-sm">
          <div className="space-y-3 sm:space-y-4">
            {/* ==========================================
                NEXT SESSION
            ========================================== */}

            <div className="rounded-xl bg-white/20 p-4 backdrop-blur sm:rounded-2xl sm:p-5">
              <p className="text-xs uppercase tracking-wide text-orange-100 sm:text-sm">
                Next Session
              </p>

              <div className="mt-3 flex items-center gap-3 sm:mt-4">
                <CalendarDays className="h-5 w-5 shrink-0 text-white sm:h-6 sm:w-6" />

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-white sm:text-base">
                    No Upcoming Session
                  </h3>

                  <p className="mt-0.5 text-xs text-orange-100 sm:text-sm">
                    Bookings will appear here
                  </p>
                </div>
              </div>
            </div>

            {/* ==========================================
                AVAILABILITY
            ========================================== */}

            <div className="rounded-xl bg-white/20 p-4 backdrop-blur sm:rounded-2xl sm:p-5">
              <div className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 shrink-0 text-white sm:h-6 sm:w-6" />

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-white sm:text-base">
                    {mentor?.availability?.availableDays?.length > 0
                      ? mentor.availability.availableDays.join(", ")
                      : "Availability not set"}
                  </h3>

                  <p className="text-xs text-orange-100 sm:text-sm">
                    {mentor?.availability?.startTime || "--"} -{" "}
                    {mentor?.availability?.endTime || "--"}
                  </p>
                </div>
              </div>
            </div>

            {/* ==========================================
                EDIT PROFILE
            ========================================== */}

            <button
              type="button"
              onClick={() => navigate("/mentor/Editprofile")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-orange-600 transition duration-300 hover:bg-orange-50 active:scale-[0.98] sm:px-6 sm:py-3 sm:text-base sm:hover:scale-[1.02]"
            >
              <Pencil size={17} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================
          BOTTOM STAT CARDS
      ========================================== */}

      <div className="relative z-10 mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
        {/* Experience */}

        <div className="rounded-xl bg-white/15 p-4 backdrop-blur sm:rounded-2xl sm:p-5">
          <p className="text-xs text-orange-100 sm:text-sm">Experience</p>

          <h2 className="mt-1 text-2xl font-bold text-white sm:mt-2 sm:text-3xl">
            {mentor?.experience || 0}+
          </h2>

          <p className="text-xs text-white sm:text-sm">Years</p>
        </div>

        {/* Category */}

        <div className="rounded-xl bg-white/15 p-4 backdrop-blur sm:rounded-2xl sm:p-5">
          <p className="text-xs text-orange-100 sm:text-sm">Category</p>

          <h2 className="mt-1 break-words text-lg font-bold text-white sm:mt-2 sm:text-xl">
            {mentor?.category || "-"}
          </h2>
        </div>

        {/* Session Fee */}

        <div className="rounded-xl bg-white/15 p-4 backdrop-blur sm:rounded-2xl sm:p-5">
          <p className="text-xs text-orange-100 sm:text-sm">Session Fee</p>

          <h2 className="mt-1 text-2xl font-bold text-white sm:mt-2 sm:text-3xl">
            ₹{mentor?.pricing?.sessionPrice || 0}
          </h2>
        </div>

        {/* Languages */}

        <div className="rounded-xl bg-white/15 p-4 backdrop-blur sm:rounded-2xl sm:p-5">
          <p className="text-xs text-orange-100 sm:text-sm">Languages</p>

          <h2 className="mt-1 break-words text-base font-bold text-white sm:mt-2 sm:text-lg">
            {mentor?.languages?.join(", ") || "-"}
          </h2>
        </div>
      </div>
    </section>
  );
}
