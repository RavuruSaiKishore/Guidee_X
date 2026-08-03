import {
  Award,
  BarChart3,
  CalendarCheck,
  Clock3,
  IndianRupee,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

const LearningAnalytics = ({ bookings = [] }) => {
  const completedBookings = bookings.filter(
    (booking) => booking.bookingStatus === "Completed"
  );

  const completedSessions = completedBookings.length;

  const upcomingSessions = bookings.filter((booking) => {
    if (!booking.sessionDate || !booking.startTime) {
      return false;
    }

    if (booking.bookingStatus !== "Confirmed") {
      return false;
    }

    const date = new Date(booking.sessionDate);

    const [hours, minutes] = String(booking.startTime).split(":").map(Number);

    if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
      date.setHours(hours, minutes, 0, 0);
    }

    return date >= new Date();
  }).length;

  const learningMinutes = completedBookings.reduce(
    (sum, booking) => sum + Number(booking.duration || 0),
    0
  );

  const learningHours = (learningMinutes / 60).toFixed(1);

  const totalInvestment = completedBookings
    .filter((booking) => booking.paymentStatus === "Paid")
    .reduce((sum, booking) => sum + Number(booking.amount || 0), 0);

  const mentorsConsulted = new Set(
    bookings
      .filter((booking) => booking.mentor?._id)
      .map((booking) => booking.mentor._id)
  ).size;

  const ratings = completedBookings
    .map((booking) => Number(booking.mentor?.averageRating))
    .filter((rating) => !Number.isNaN(rating) && rating > 0);

  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        ).toFixed(1)
      : "0.0";

  const completionRate =
    bookings.length > 0
      ? Math.round((completedSessions / bookings.length) * 100)
      : 0;

  const averageSessionDuration =
    completedSessions > 0 ? Math.round(learningMinutes / completedSessions) : 0;

  const nextMilestone = Math.max(0, 10 - completedSessions);

  const analytics = [
    {
      label: "Sessions Completed",
      value: completedSessions,
      icon: CalendarCheck,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Upcoming Sessions",
      value: upcomingSessions,
      icon: Clock3,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Learning Hours",
      value: `${learningHours}h`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Mentors Consulted",
      value: mentorsConsulted,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Average Rating",
      value: `${averageRating} ★`,
      icon: Star,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      icon: Award,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Avg Session",
      value: `${averageSessionDuration} mins`,
      icon: Clock3,
      color: "text-pink-600",
      bg: "bg-pink-50",
    },
    {
      label: "Investment",
      value: `₹${totalInvestment.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-col gap-5 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
            <BarChart3 size={23} className="text-white" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Student Analytics
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Learning Analytics
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Track your mentorship progress.
            </p>
          </div>
        </div>

        <div className="min-w-[180px] rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Overall Progress
            </p>

            <span className="text-lg font-extrabold text-blue-600">
              {completionRate}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
              style={{
                width: `${Math.min(completionRate, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {analytics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`rounded-xl p-3 ${item.bg}`}>
                <Icon size={22} className={item.color} />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {item.value}
                </h3>

                <p className="mt-1 text-xs text-slate-500">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 text-white">
        <div className="flex items-start gap-3">
          <Award size={27} className="mt-0.5 flex-shrink-0" />

          <div>
            <h3 className="font-bold">Next Milestone</h3>

            <p className="mt-1 text-sm leading-6 text-blue-100">
              {nextMilestone === 0
                ? "Congratulations! You've unlocked the Dedicated Learner milestone."
                : `Complete ${nextMilestone} more session${
                    nextMilestone > 1 ? "s" : ""
                  } to unlock the Dedicated Learner milestone.`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningAnalytics;
