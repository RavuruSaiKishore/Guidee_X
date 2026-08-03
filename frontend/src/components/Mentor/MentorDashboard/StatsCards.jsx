import {
  IndianRupee,
  Users,
  CalendarDays,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export default function StatsCards({ stats }) {
  const cards = [
    {
      title: "Total Earnings",
      value: `₹${stats?.totalEarnings?.toLocaleString() || 0}`,
      subtitle: "Lifetime Earnings",
      icon: IndianRupee,
      bg: "from-emerald-500 to-green-600",
      iconBg: "bg-white/20",
    },

    {
      title: "Total Students",
      value: stats?.totalStudents || 0,
      subtitle: "Students Mentored",
      icon: Users,
      bg: "from-blue-500 to-cyan-600",
      iconBg: "bg-white/20",
    },

    {
      title: "Completed Sessions",
      value: stats?.completedSessions || 0,
      subtitle: "Sessions Completed",
      icon: CheckCircle2,
      bg: "from-violet-500 to-purple-600",
      iconBg: "bg-white/20",
    },

    {
      title: "Upcoming Sessions",
      value: stats?.upcomingSessions || 0,
      subtitle: "Scheduled Sessions",
      icon: CalendarDays,
      bg: "from-amber-500 to-orange-500",
      iconBg: "bg-white/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4 xl:gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className={`
              group
              relative
              min-w-0
              overflow-hidden
              rounded-2xl
              sm:rounded-3xl
              bg-gradient-to-r
              ${card.bg}
              p-4
              sm:p-5
              lg:p-6
              text-white
              shadow-md
              sm:shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
              xl:hover:-translate-y-2
              xl:hover:shadow-2xl
            `}
          >
            {/* Decorative Circle */}

            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125 sm:h-32 sm:w-32" />

            <div className="pointer-events-none absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-white/5 sm:h-32 sm:w-32" />

            {/* Content */}

            <div className="relative z-10">
              {/* Top */}

              <div className="flex items-start justify-between gap-3">
                {/* Title & Value */}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-white/85 sm:text-sm">
                    {card.title}
                  </p>

                  <h2 className="mt-2 break-words text-2xl font-bold tracking-tight sm:mt-3 sm:text-3xl lg:text-4xl">
                    {card.value}
                  </h2>
                </div>

                {/* Icon */}

                <div
                  className={`
                    shrink-0
                    rounded-xl
                    ${card.iconBg}
                    p-2.5
                    backdrop-blur-sm
                    transition-transform
                    duration-300
                    group-hover:scale-105
                    sm:rounded-2xl
                    sm:p-3
                    lg:p-4
                  `}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-[30px] lg:w-[30px]" />
                </div>
              </div>

              {/* Bottom */}

              <div className="mt-5 flex items-center justify-between gap-2 sm:mt-7 lg:mt-8">
                <p className="min-w-0 truncate text-xs text-white/85 sm:text-sm">
                  {card.subtitle}
                </p>

                <div className="flex shrink-0 items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-[10px] backdrop-blur-sm sm:px-3 sm:text-xs">
                  <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />

                  <span>Live</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
