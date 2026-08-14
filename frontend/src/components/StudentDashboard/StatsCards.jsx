import {
  CalendarCheck,
  CheckCircle,
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

const StatsCards = ({ bookings = [], loading }) => {
  const now = new Date();

  const totalBookings = bookings.length;
  const completedSessions = bookings.filter(
    (b) => b.bookingStatus === "Completed"
  ).length;
  const cancelledSessions = bookings.filter(
    (b) => b.bookingStatus === "Cancelled"
  ).length;
  const pendingSessions = bookings.filter(
    (b) => b.bookingStatus === "Pending"
  ).length;

  const totalSpent = bookings
    .filter(
      (b) => b.paymentStatus === "Paid" && b.bookingStatus === "Completed"
    )
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);

  const upcomingSessions = bookings.filter((b) => {
    if (!b.sessionDate || !b.startTime) return false;
    if (!["Confirmed", "Pending"].includes(b.bookingStatus)) return false;
    const sessionDate = new Date(b.sessionDate);
    const [h, m] = String(b.startTime).split(":").map(Number);
    sessionDate.setHours(h, m, 0, 0);
    return sessionDate >= now;
  }).length;

  const cards = [
    {
      title: "Total Bookings",
      value: totalBookings,
      subtitle: "Lifetime sessions",
      icon: CalendarCheck,
      color: "blue",
    },
    {
      title: "Total Spent",
      value: `₹${totalSpent.toLocaleString("en-IN")}`,
      subtitle: "Investment to date",
      icon: IndianRupee,
      color: "emerald",
    },
    {
      title: "Completed",
      value: completedSessions,
      subtitle: "Successfully finished",
      icon: CheckCircle,
      color: "indigo",
    },
    {
      title: "Upcoming",
      value: upcomingSessions,
      subtitle: "Next appointments",
      icon: TrendingUp,
      color: "amber",
    },
  ];

  const getColorStyles = (color) => {
    const map = {
      blue: "bg-blue-50 text-blue-600 border-blue-100",
      emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
      indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
      amber: "bg-amber-50 text-amber-600 border-amber-100",
    };
    return map[color];
  };

  if (loading) {
    return (
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl bg-slate-50 border border-slate-100"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
            Overview
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Insights
          </h2>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-4 py-2">
          <span className="text-xs font-semibold text-slate-500">
            Cancelled Sessions:
          </span>
          <span className="text-sm font-black text-slate-900">
            {cancelledSessions}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="relative rounded-2xl border border-slate-200/60 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-2.5 rounded-xl border ${getColorStyles(
                    card.color
                  )}`}
                >
                  <Icon size={20} strokeWidth={2.5} />
                </div>
                <ArrowUpRight size={16} className="text-slate-300" />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </p>
                <h3 className="mt-1 text-2xl font-black text-slate-900">
                  {card.value}
                </h3>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                  {card.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StatsCards;
