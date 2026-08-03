import {
  CalendarCheck,
  CheckCircle,
  IndianRupee,
  TrendingUp,
  XCircle,
} from "lucide-react";

const StatsCards = ({ bookings = [], loading }) => {
  const now = new Date();

  const totalBookings = bookings.length;

  const completedSessions = bookings.filter(
    (booking) => booking.bookingStatus === "Completed"
  ).length;

  const cancelledSessions = bookings.filter(
    (booking) => booking.bookingStatus === "Cancelled"
  ).length;

  const pendingSessions = bookings.filter(
    (booking) => booking.bookingStatus === "Pending"
  ).length;

  const totalSpent = bookings
    .filter(
      (booking) =>
        booking.paymentStatus === "Paid" &&
        booking.bookingStatus === "Completed"
    )
    .reduce((sum, booking) => sum + Number(booking.amount || 0), 0);

  const upcomingSessions = bookings.filter((booking) => {
    if (!booking.sessionDate || !booking.startTime) {
      return false;
    }

    if (!["Confirmed", "Pending"].includes(booking.bookingStatus)) {
      return false;
    }

    const sessionDate = new Date(booking.sessionDate);

    const [hours, minutes] = String(booking.startTime).split(":").map(Number);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return sessionDate >= now;
    }

    sessionDate.setHours(hours, minutes, 0, 0);

    return sessionDate >= now;
  }).length;

  const cards = [
    {
      title: "Total Bookings",
      value: totalBookings,
      subtitle: "Mentorship sessions",
      icon: CalendarCheck,
      gradient: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: `${totalBookings} total`,
    },
    {
      title: "Total Spent",
      value: `₹${totalSpent.toLocaleString("en-IN")}`,
      subtitle: "Completed sessions",
      icon: IndianRupee,
      gradient: "from-emerald-500 to-green-500",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      trend: "Paid",
    },
    {
      title: "Completed",
      value: completedSessions,
      subtitle: "Finished sessions",
      icon: CheckCircle,
      gradient: "from-violet-500 to-fuchsia-500",
      bg: "bg-violet-50",
      iconColor: "text-violet-600",
      trend: "Learning progress",
    },
    {
      title: "Upcoming",
      value: upcomingSessions,
      subtitle: "Scheduled sessions",
      icon: TrendingUp,
      gradient: "from-amber-500 to-orange-500",
      bg: "bg-amber-50",
      iconColor: "text-orange-600",
      trend: `${pendingSessions} pending`,
    },
  ];

  if (loading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Your Activity
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Dashboard Overview
          </h2>
        </div>

        <div className="rounded-xl bg-blue-50 px-4 py-2 text-sm">
          <span className="text-slate-500">Cancelled:</span>{" "}
          <span className="font-bold text-red-600">{cancelledSessions}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${card.gradient}`}
              />

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {card.title}
                  </p>

                  <h3 className="mt-2 text-3xl font-extrabold text-slate-900">
                    {card.value}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">{card.subtitle}</p>
                </div>

                <div className={`rounded-xl p-3 ${card.bg}`}>
                  <Icon size={23} className={card.iconColor} />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <TrendingUp size={14} />
                {card.trend}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StatsCards;
