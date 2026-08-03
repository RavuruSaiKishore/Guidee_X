import { ArrowRight, CalendarDays, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusColors = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Completed: "bg-blue-50 text-blue-700 border-blue-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
  Rejected: "bg-slate-100 text-slate-600 border-slate-200",
};

const RecentBookings = ({ bookings = [], loading }) => {
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const SERVER_BASE_URL = API_BASE_URL?.replace(/\/api\/?$/, "").replace(
    /\/$/,
    ""
  );

  const getMentorImage = (mentor) => {
    const name =
      `${mentor?.firstName || ""} ${mentor?.lastName || ""}`.trim() || "Mentor";

    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=2563eb&color=fff`;

    if (!mentor?.profileImage) {
      return fallback;
    }

    if (
      mentor.profileImage.startsWith("http://") ||
      mentor.profileImage.startsWith("https://")
    ) {
      return mentor.profileImage;
    }

    return `${SERVER_BASE_URL}/${mentor.profileImage.replace(/^\/+/, "")}`;
  };

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.sessionDate) -
        new Date(a.createdAt || a.sessionDate)
    )
    .slice(0, 5);

  if (loading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-7 w-52 rounded bg-slate-200" />

          <div className="mt-6 space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-16 rounded-xl bg-slate-100" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Booking History
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Recent Bookings
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your latest mentorship sessions.
          </p>
        </div>

        <button
          onClick={() => navigate("/my-bookings")}
          className="flex items-center gap-2 self-start rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 sm:self-auto"
        >
          View All
          <ArrowRight size={16} />
        </button>
      </div>

      {recentBookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center">
          <CalendarDays size={34} className="mx-auto text-slate-300" />

          <h3 className="mt-4 font-bold text-slate-900">No Bookings Yet</h3>

          <p className="mt-1 text-sm text-slate-500">
            Book your first mentorship session.
          </p>

          <button
            onClick={() => navigate("/mentors")}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white"
          >
            Explore Mentors
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3">Mentor</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {recentBookings.map((booking) => {
                const mentor = booking.mentor;

                const mentorName =
                  `${mentor?.firstName || ""} ${
                    mentor?.lastName || ""
                  }`.trim() || "Mentor";

                return (
                  <tr
                    key={booking._id}
                    className="border-b border-slate-50 transition hover:bg-slate-50"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getMentorImage(mentor)}
                          alt={mentorName}
                          className="h-11 w-11 rounded-xl object-cover"
                          onError={(event) => {
                            event.currentTarget.onerror = null;

                            event.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              mentorName
                            )}&background=2563eb&color=fff`;
                          }}
                        />

                        <div>
                          <p className="font-semibold text-slate-900">
                            {mentorName}
                          </p>

                          <p className="text-xs text-slate-500">
                            {booking.sessionType || "Mentorship Session"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {booking.sessionDate
                        ? new Date(booking.sessionDate).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "--"}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {booking.startTime || "--"}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${
                          statusColors[booking.bookingStatus] ||
                          "border-slate-200 bg-slate-100 text-slate-600"
                        }`}
                      >
                        {booking.bookingStatus || "Unknown"}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm font-bold text-emerald-600">
                      ₹{Number(booking.amount || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => navigate("/my-bookings")}
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default RecentBookings;
