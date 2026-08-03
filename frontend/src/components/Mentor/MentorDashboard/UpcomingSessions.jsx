import {
  CalendarDays,
  Clock3,
  IndianRupee,
  Video,
  ExternalLink,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function UpcomingSessions({ bookings = [] }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ==========================================
  // GET MEETING DATE & TIME
  // ==========================================

  const getMeetingDateTime = (booking) => {
    const meetingDate = new Date(booking.sessionDate);

    if (!booking.startTime) {
      return meetingDate;
    }

    const [time, modifier] = booking.startTime.split(" ");

    let [hours, minutes] = time.split(":").map(Number);

    if (modifier?.toLowerCase() === "pm" && hours !== 12) {
      hours += 12;
    }

    if (modifier?.toLowerCase() === "am" && hours === 12) {
      hours = 0;
    }

    meetingDate.setHours(hours, minutes, 0, 0);

    return meetingDate;
  };

  // ==========================================
  // COUNTDOWN
  // ==========================================

  const getRemainingTime = (meetingTime) => {
    const diff = meetingTime - now;

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // ==========================================
  // STATUS COLOR
  // ==========================================

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

      <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-5 lg:px-6">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Upcoming Sessions
          </h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Your upcoming mentorship bookings
          </p>
        </div>

        <span className="w-fit rounded-full bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-700 sm:px-4 sm:py-2 sm:text-sm">
          {bookings.length} {bookings.length === 1 ? "Session" : "Sessions"}
        </span>
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
            No Upcoming Sessions
          </h3>

          <p className="mt-2 max-w-sm text-xs text-gray-500 sm:text-sm">
            Upcoming bookings will appear here once a student books a session
            with you.
          </p>
        </div>
      )}

      {/* ==========================================
          SESSION LIST
      ========================================== */}

      {bookings.length > 0 && (
        <div className="space-y-4 p-4 sm:space-y-5 sm:p-5 lg:p-6">
          {bookings.map((booking) => {
            const meetingTime = getMeetingDateTime(booking);

            const joinTime = new Date(meetingTime.getTime() - 10 * 60 * 1000);

            const endTime = new Date(
              meetingTime.getTime() + (Number(booking.duration) || 0) * 60000
            );

            const canJoin =
              now >= joinTime &&
              now <= endTime &&
              booking.bookingStatus === "Confirmed";

            const countdown = getRemainingTime(joinTime);

            const meetingEnded = now > endTime;

            const studentImage = booking.student?.profileImage
              ? `${API_BASE_URL}/${booking.student.profileImage}`.replace(
                  /([^:]\/)\/+/g,
                  "$1"
                )
              : "/default-avatar.png";

            return (
              <article
                key={booking._id}
                className="w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-orange-300 hover:shadow-md sm:p-5 lg:p-6"
              >
                {/* ==========================================
                    TOP SECTION
                ========================================== */}

                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  {/* ==========================================
                      STUDENT
                  ========================================== */}

                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <img
                      src={studentImage}
                      alt={`${booking.student?.firstName || "Student"} ${
                        booking.student?.lastName || ""
                      }`}
                      className="h-14 w-14 shrink-0 rounded-full border border-gray-200 object-cover sm:h-16 sm:w-16"
                      onError={(e) => {
                        e.currentTarget.src = "/default-avatar.png";
                      }}
                    />

                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold text-gray-800 sm:text-lg">
                        {booking.student?.firstName} {booking.student?.lastName}
                      </h3>

                      <p className="truncate text-xs text-gray-500 sm:text-sm">
                        {booking.student?.email || "No email available"}
                      </p>

                      <span className="mt-2 inline-flex max-w-full truncate rounded-full bg-orange-100 px-3 py-1 text-[10px] font-semibold text-orange-700 sm:text-xs">
                        {booking.sessionType || "Mentorship Session"}
                      </span>
                    </div>
                  </div>

                  {/* ==========================================
                      STATUS
                  ========================================== */}

                  <div className="flex items-center justify-between gap-3 xl:flex-col xl:items-end">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold sm:px-4 sm:py-2 sm:text-sm ${getStatusColor(
                        booking.bookingStatus
                      )}`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </div>
                </div>

                {/* ==========================================
                    BOOKING DETAILS
                ========================================== */}

                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-100 pt-5 sm:grid-cols-4 sm:gap-4">
                  {/* Date */}

                  <div className="min-w-0 rounded-xl bg-gray-50 p-3">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 sm:text-xs">
                      Date
                    </p>

                    <div className="mt-2 flex min-w-0 items-center gap-2">
                      <CalendarDays
                        size={15}
                        className="shrink-0 text-orange-500"
                      />

                      <span className="truncate text-xs font-medium text-gray-700 sm:text-sm">
                        {new Date(booking.sessionDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Time */}

                  <div className="min-w-0 rounded-xl bg-gray-50 p-3">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 sm:text-xs">
                      Time
                    </p>

                    <div className="mt-2 flex min-w-0 items-center gap-2">
                      <Clock3 size={15} className="shrink-0 text-blue-500" />

                      <span className="truncate text-xs font-medium text-gray-700 sm:text-sm">
                        {booking.startTime || "--"}
                      </span>
                    </div>
                  </div>

                  {/* Duration */}

                  <div className="min-w-0 rounded-xl bg-gray-50 p-3">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 sm:text-xs">
                      Duration
                    </p>

                    <p className="mt-2 truncate text-xs font-semibold text-gray-700 sm:text-sm">
                      {booking.duration || 0} mins
                    </p>
                  </div>

                  {/* Fee */}

                  <div className="min-w-0 rounded-xl bg-gray-50 p-3">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 sm:text-xs">
                      Fee
                    </p>

                    <div className="mt-2 flex items-center gap-1">
                      <IndianRupee
                        size={15}
                        className="shrink-0 text-green-600"
                      />

                      <span className="truncate text-xs font-bold text-green-600 sm:text-sm">
                        {Number(booking.amount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ==========================================
                    ACTION SECTION
                ========================================== */}

                <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  {/* Countdown */}

                  <div className="min-w-0">
                    {meetingEnded ? (
                      <p className="text-xs font-medium text-gray-400 sm:text-sm">
                        This meeting has ended
                      </p>
                    ) : canJoin ? (
                      <p className="text-xs font-medium text-green-600 sm:text-sm">
                        Your meeting is ready to join
                      </p>
                    ) : countdown ? (
                      <p className="text-xs font-medium text-orange-600 sm:text-sm">
                        Meeting starts in{" "}
                        <span className="font-bold">{countdown}</span>
                      </p>
                    ) : null}
                  </div>

                  {/* Button */}

                  <div className="w-full sm:w-auto">
                    {meetingEnded ? (
                      <button
                        disabled
                        className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-gray-100 px-5 py-3 text-sm font-medium text-gray-400 sm:w-auto"
                      >
                        Meeting Ended
                      </button>
                    ) : canJoin ? (
                      <a
                        href={booking.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-700 active:scale-[0.98] sm:w-auto"
                      >
                        <Video size={17} />

                        <span>Join Meeting</span>

                        <ExternalLink size={15} />
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex w-full items-center justify-center rounded-xl bg-orange-50 px-5 py-3 text-sm font-medium text-orange-700 sm:w-auto"
                      >
                        {countdown ? `Starts in ${countdown}` : "Not Available"}
                      </button>
                    )}
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
