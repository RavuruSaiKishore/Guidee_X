import {
  TrendingUp,
  CalendarCheck,
  Clock3,
  Users,
  Star,
  BarChart3, 
  IndianRupee,
  Award,
} from "lucide-react";

const LearningAnalytics = ({ bookings = [] }) => {
  // =========================
  // Analytics
  // =========================

  const totalSessions = bookings.length;
  console.log(totalSessions);

  const completedSessions = bookings.filter(
    (booking) => booking.bookingStatus === "Completed"
  ).length;

  const upcomingSessions = bookings.filter(
    (booking) =>
      (booking.bookingStatus === "Confirmed" ||
        booking.bookingStatus === "Pending") &&
      new Date(booking.sessionDate) >= new Date()
  ).length;

  const learningMinutes = bookings
    .filter((booking) => booking.bookingStatus === "Completed")
    .reduce((sum, booking) => sum + (booking.duration || 0), 0);

  const learningHours = (learningMinutes / 60).toFixed(1);

  const totalInvestment = bookings
    .filter(
      (booking) =>
        booking.paymentStatus === "Paid" &&
        booking.bookingStatus === "Completed"
    )
    .reduce((sum, booking) => sum + (booking.amount || 0), 0);

  // Unique mentors
  const mentorsConsulted = new Set(
    bookings
      .filter(
        (booking) =>
          (booking.bookingStatus === "Completed" ||
            booking.bookingStatus === "Confirmed" ||
            booking.bookingStatus === "Pending") &&
          booking.mentor?._id
      )
      .map((booking) => booking.mentor._id)
  ).size;

  // Average mentor rating
  const ratings = bookings
    .filter(
      (booking) =>
        booking.bookingStatus === "Completed" && booking.mentor?.averageRating
    )
    .map((booking) => booking.mentor.averageRating);

  const averageRating = ratings.length
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
    : "0.0";

  const progress =
    totalSessions === 0
      ? 0
      : Math.round((completedSessions / totalSessions) * 100);

  const nextMilestone = Math.max(0, 10 - completedSessions);

  const completionRate =
    totalSessions === 0
      ? 0
      : Math.round((completedSessions / totalSessions) * 100);

  const averageSessionDuration =
    completedSessions === 0
      ? 0
      : Math.round(learningMinutes / completedSessions);

  const analytics = [
    {
      label: "Sessions Completed",
      value: completedSessions,
      icon: CalendarCheck,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Upcoming Sessions",
      value: upcomingSessions,
      icon: Clock3,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      label: "Learning Hours",
      value: `${learningHours}h`,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Mentors Consulted",
      value: mentorsConsulted,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Average Rating",
      value: `${averageRating} ★`,
      icon: Star,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      icon: Award,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      label: "Avg Session",
      value: `${averageSessionDuration} mins`,
      icon: Clock3,
      color: "text-pink-600",
      bg: "bg-pink-100",
    },
    {
      label: "Investment",
      value: `₹${totalInvestment.toLocaleString()}`,
      icon: IndianRupee,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
  ];

  return (
    <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      {/* Header */}
      <div className="mb-10 rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-white p-7 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                Student Analytics
              </p>

              <h2 className="mt-1 text-3xl font-bold text-gray-900">
                Learning Analytics
              </h2>

              <p className="mt-2 max-w-2xl text-gray-500">
                Track your mentorship journey, monitor learning progress, and
                gain valuable insights into your overall growth.
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="rounded-3xl border border-blue-100 bg-white px-7 py-5 shadow-md min-w-[220px]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Overall Progress
                </p>

                <h3 className="mt-2 text-4xl font-bold text-blue-600">
                  {progress}%
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Based on completed sessions
                </p>
              </div>

              <div className="rounded-2xl bg-blue-100 p-3">
                <TrendingUp className="h-7 w-7 text-blue-600" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-blue-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="mb-3 flex justify-between">
          <span className="font-semibold text-gray-700">
            Mentorship Progress
          </span>

          <span className="font-bold text-blue-600">{progress}%</span>
        </div>

        <div className="h-4 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Analytics */}
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {analytics.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex items-center gap-4 rounded-2xl border border-gray-200 p-5 transition hover:shadow-lg"
            >
              <div className={`${item.bg} rounded-2xl p-4`}>
                <Icon className={item.color} size={28} />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {item.value}
                </h3>

                <p className="mt-1 text-sm text-gray-500">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Milestone */}
      <div className="mt-10 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
        <div className="flex items-center gap-3">
          <Award size={34} />

          <div>
            <h3 className="text-2xl font-bold">Next Milestone</h3>

            <p className="mt-2 text-blue-100">
              {nextMilestone === 0
                ? "Congratulations! You've unlocked the Dedicated Learner badge."
                : `Complete ${nextMilestone} more session${
                    nextMilestone > 1 ? "s" : ""
                  } to unlock the "Dedicated Learner" badge.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningAnalytics;
