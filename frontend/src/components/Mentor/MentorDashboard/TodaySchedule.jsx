import {
  CalendarDays,
  Clock3,
  Video,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

export default function TodaySchedule({ bookings = [] }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Completed":
        return "bg-blue-100 text-blue-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      case "Rejected":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md sm:rounded-3xl sm:shadow-lg">
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="border-b border-gray-100 px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
              Today's Schedule
            </h2>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Sessions planned for today
            </p>
          </div>

          {bookings.length > 0 && (
            <span className="mt-2 w-fit rounded-full bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-700 sm:mt-0 sm:px-4 sm:py-2 sm:text-sm">
              {bookings.length} {bookings.length === 1 ? "Session" : "Sessions"}
            </span>
          )}
        </div>
      </div>

      {/* ==========================================
          EMPTY STATE
      ========================================== */}

      {bookings.length === 0 && (
        <div className="flex min-h-[280px] flex-col items-center justify-center px-5 py-10 text-center sm:min-h-[320px]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
            <CalendarDays size={36} className="text-gray-300" />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-gray-700 sm:text-xl">
            No Sessions Today
          </h3>

          <p className="mt-2 text-xs text-gray-500 sm:text-sm">
            Enjoy your free day 😊
          </p>
        </div>
      )}

      {/* ==========================================
          TIMELINE
      ========================================== */}

      {bookings.length > 0 && (
        <div className="p-4 sm:p-5 lg:p-6">
          {bookings.map((booking, index) => {
            const studentImage = booking.student?.profileImage
              ? `${API_BASE_URL}/${booking.student.profileImage}`.replace(
                  /([^:]\/)\/+/g,
                  "$1"
                )
              : "/default-avatar.png";

            return (
              <div
                key={booking._id}
                className="relative flex gap-3 pb-6 last:pb-0 sm:gap-4 sm:pb-8"
              >
                {/* ==========================================
                    TIMELINE COLUMN
                ========================================== */}

                <div className="relative flex w-9 shrink-0 flex-col items-center sm:w-12">
                  {/* Timeline Icon */}

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 shadow-md sm:h-12 sm:w-12 sm:shadow-lg">
                    <Clock3 className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                  </div>

                  {/* Timeline Line */}

                  {index !== bookings.length - 1 && (
                    <div className="absolute top-10 bottom-0 w-[2px] bg-orange-200 sm:top-14" />
                  )}
                </div>

                {/* ==========================================
                    SESSION CARD
                ========================================== */}

                <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 p-3 transition hover:border-orange-300 hover:bg-white hover:shadow-md sm:rounded-2xl sm:p-5">
                  {/* ==========================================
                      TOP / TIME
                  ========================================== */}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 sm:text-xs">
                        Time
                      </p>

                      <h3 className="mt-1 text-base font-bold text-gray-800 sm:text-lg">
                        {booking.startTime || "--"}

                        <span className="mx-1 text-gray-400">-</span>

                        {booking.endTime || "--"}
                      </h3>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1.5 text-[10px] font-semibold sm:px-4 sm:py-2 sm:text-xs ${getStatusColor(
                        booking.bookingStatus
                      )}`}
                    >
                      {booking.bookingStatus || "Unknown"}
                    </span>
                  </div>

                  {/* ==========================================
                      STUDENT
                  ========================================== */}

                  <div className="mt-4 flex min-w-0 items-center gap-3 border-t border-gray-200 pt-4 sm:mt-5 sm:gap-4 sm:pt-5">
                    <img
                      src={studentImage}
                      alt={`${booking.student?.firstName || "Student"} ${
                        booking.student?.lastName || ""
                      }`}
                      className="h-12 w-12 shrink-0 rounded-full border border-gray-200 object-cover sm:h-14 sm:w-14"
                      onError={(e) => {
                        e.currentTarget.src = "/default-avatar.png";
                      }}
                    />

                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-semibold text-gray-800 sm:text-base">
                        {booking.student?.firstName} {booking.student?.lastName}
                      </h4>

                      <p className="mt-0.5 truncate text-xs text-gray-500 sm:text-sm">
                        {booking.sessionType || "Mentorship Session"}
                      </p>
                    </div>
                  </div>

                  {/* ==========================================
                      DETAILS
                  ========================================== */}

                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-200 pt-4 sm:mt-6 sm:gap-5 sm:pt-5">
                    {/* Duration */}

                    <div className="min-w-0 rounded-lg bg-white p-3 sm:rounded-xl">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 sm:text-xs">
                        Duration
                      </p>

                      <p className="mt-1 truncate text-xs font-semibold text-gray-700 sm:text-sm">
                        {booking.duration || 0} Minutes
                      </p>
                    </div>

                    {/* Status */}

                    <div className="min-w-0 rounded-lg bg-white p-3 sm:rounded-xl">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 sm:text-xs">
                        Status
                      </p>

                      <div className="mt-1 flex min-w-0 items-center gap-1.5">
                        <CheckCircle2
                          size={15}
                          className="shrink-0 text-green-600"
                        />

                        <span className="truncate text-xs font-medium text-gray-700 sm:text-sm">
                          {booking.bookingStatus || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ==========================================
                      JOIN MEETING
                  ========================================== */}

                  <div className="mt-4 border-t border-gray-200 pt-4 sm:mt-6 sm:pt-5">
                    {booking.meetingLink ? (
                      <a
                        href={booking.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 active:scale-[0.98] sm:inline-flex sm:w-auto sm:px-5 sm:py-3"
                      >
                        <Video size={17} />

                        <span>Join Meeting</span>

                        <ExternalLink size={15} />
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full cursor-not-allowed rounded-xl bg-gray-200 px-4 py-2.5 text-sm font-medium text-gray-500 sm:w-auto sm:px-5 sm:py-3"
                      >
                        Meeting Link Pending
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
