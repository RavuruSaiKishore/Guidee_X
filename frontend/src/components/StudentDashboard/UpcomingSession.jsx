import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarDays,
  Clock,
  Video,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const UpcomingSession = ({ bookings = [], loading }) => {
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const SERVER_BASE_URL = API_BASE_URL?.replace(/\/api\/?$/, "").replace(
    /\/$/,
    ""
  );

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    const cleanPath = image.replace(/^\/+/, "");

    return `${SERVER_BASE_URL}/${cleanPath}`;
  };

  const getMentorImage = (mentor) => {
    const name =
      `${mentor?.firstName || ""} ${mentor?.lastName || ""}`.trim() || "Mentor";

    if (mentor?.profileImage) {
      return getImageUrl(mentor.profileImage);
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=2563eb&color=fff`;
  };

  const getSessionDateTime = (booking) => {
    if (!booking?.sessionDate) {
      return null;
    }

    const date = new Date(booking.sessionDate);

    if (booking.startTime) {
      const [hours, minutes] = String(booking.startTime).split(":").map(Number);

      if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
        date.setHours(hours, minutes, 0, 0);
      }
    }

    return date;
  };

  const upcomingBookings = [...bookings]
    .filter((booking) => {
      const sessionDate = getSessionDateTime(booking);

      if (!sessionDate) {
        return false;
      }

      if (
        ["Cancelled", "Rejected", "Completed"].includes(booking.bookingStatus)
      ) {
        return false;
      }

      return sessionDate >= new Date();
    })
    .sort((a, b) => getSessionDateTime(a) - getSessionDateTime(b));

  const session = upcomingBookings[0] || null;

  if (loading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-8 w-56 rounded bg-slate-200" />

          <div className="mt-7 flex gap-5">
            <div className="h-20 w-20 rounded-2xl bg-slate-200" />

            <div className="flex-1">
              <div className="h-6 w-52 rounded bg-slate-200" />
              <div className="mt-3 h-4 w-36 rounded bg-slate-200" />
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-24 rounded-2xl bg-slate-100" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
          <CalendarDays size={30} className="text-blue-600" />
        </div>

        <h2 className="mt-5 text-2xl font-bold text-slate-900">
          No Upcoming Session
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Book your next mentorship session and connect with experienced
          professionals.
        </p>

        <button
          onClick={() => navigate("/mentors")}
          className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          Explore Mentors
        </button>
      </section>
    );
  }

  const mentor = session.mentor || {};

  const mentorName =
    `${mentor.firstName || ""} ${mentor.lastName || ""}`.trim() || "Mentor";

  const statusClasses = {
    Confirmed: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
  };

  const formattedDate = new Date(session.sessionDate).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Upcoming Mentorship
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Your Next Session
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-4 py-2 text-xs font-bold ${
              statusClasses[session.bookingStatus] ||
              "bg-slate-100 text-slate-600"
            }`}
          >
            {session.bookingStatus}
          </span>

          <button
            onClick={() => navigate("/my-bookings")}
            className="flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            All Sessions
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-5 sm:p-6">
        <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={getMentorImage(mentor)}
              alt={mentorName}
              className="h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-md"
              onError={(event) => {
                event.currentTarget.onerror = null;

                event.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  mentorName
                )}&background=2563eb&color=fff`;
              }}
            />

            <div>
              <h3 className="text-xl font-bold text-slate-900">{mentorName}</h3>

              {mentor.profession && (
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  <Briefcase size={15} />
                  {mentor.profession}
                </p>
              )}

              {mentor.company && (
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  <Building2 size={15} />
                  {mentor.company}
                </p>
              )}

              <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-amber-600">
                <BadgeCheck size={15} />
                {mentor.averageRating || 0}/5 Rating
              </div>
            </div>
          </div>

          <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:max-w-2xl xl:grid-cols-4">
            {[
              {
                icon: CalendarDays,
                label: "Date",
                value: formattedDate,
                color: "text-blue-600",
              },
              {
                icon: Clock,
                label: "Time",
                value: session.startTime || "Not Available",
                color: "text-emerald-600",
              },
              {
                icon: Video,
                label: "Session",
                value: session.sessionType || "Mentorship",
                color: "text-violet-600",
              },
              {
                icon: Clock,
                label: "Duration",
                value: `${session.duration || 0} mins`,
                color: "text-orange-600",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-xl bg-white p-4 shadow-sm"
                >
                  <Icon size={20} className={item.color} />

                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {item.label}
                  </p>

                  <p className="mt-1 truncate text-sm font-bold text-slate-800">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {session.meetingLink && session.bookingStatus !== "Cancelled" ? (
            <a
              href={session.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              <Video size={17} />
              Join Meeting
            </a>
          ) : (
            <button
              disabled
              className="flex-1 cursor-not-allowed rounded-xl bg-slate-200 py-3 text-sm font-bold text-slate-500"
            >
              Meeting Link Not Available
            </button>
          )}

          <button
            onClick={() => navigate("/my-bookings")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            View Booking
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingSession;
