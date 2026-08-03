import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import { CalendarCheck, Clock3, Loader2, XCircle, Ban } from "lucide-react";

export default function SessionAnalytics({ analytics }) {
  const completed = Number(analytics?.completed) || 0;
  const upcoming = Number(analytics?.upcoming) || 0;
  const pending = Number(analytics?.pending) || 0;
  const cancelled = Number(analytics?.cancelled) || 0;
  const rejected = Number(analytics?.rejected) || 0;

  const total = completed + upcoming + pending + cancelled + rejected;

  const completionRate =
    total === 0 ? 0 : ((completed / total) * 100).toFixed(1);

  const chartData = [
    {
      name: "Completed",
      value: completed,
      color: "#10B981",
    },
    {
      name: "Upcoming",
      value: upcoming,
      color: "#3B82F6",
    },
    {
      name: "Pending",
      value: pending,
      color: "#F59E0B",
    },
    {
      name: "Cancelled",
      value: cancelled,
      color: "#EF4444",
    },
    {
      name: "Rejected",
      value: rejected,
      color: "#8B5CF6",
    },
  ];

  const statusCards = [
    {
      title: "Completed",
      value: completed,
      icon: CalendarCheck,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Upcoming",
      value: upcoming,
      icon: Clock3,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Pending",
      value: pending,
      icon: Loader2,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Cancelled",
      value: cancelled,
      icon: XCircle,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Rejected",
      value: rejected,
      icon: Ban,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-md sm:rounded-3xl sm:p-5 lg:p-6 lg:shadow-lg">
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="mb-4 sm:mb-5">
        <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
          Session Analytics
        </h2>

        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Overview of all mentorship sessions
        </p>
      </div>

      {/* ==========================================
          COMPLETION RATE
      ========================================== */}

      <div className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white sm:rounded-2xl sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs opacity-90 sm:text-sm">Completion Rate</p>

            <h2 className="mt-1 text-3xl font-bold sm:mt-2 sm:text-4xl">
              {completionRate}%
            </h2>

            <p className="mt-1 text-xs sm:mt-2 sm:text-sm">
              {completed} completed out of {total} sessions
            </p>
          </div>

          {/* Mini Progress Circle */}

          <div className="relative hidden h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-white/30 sm:flex">
            <div
              className="absolute inset-0 rounded-full border-4 border-white"
              style={{
                clipPath: `inset(${100 - Number(completionRate)}% 0 0 0)`,
              }}
            />

            <span className="text-xs font-bold">{completionRate}%</span>
          </div>
        </div>
      </div>

      {/* ==========================================
          PIE CHART
      ========================================== */}

      <div className="relative mt-4 h-[220px] w-full sm:mt-5 sm:h-[260px] md:h-[280px]">
        {total > 0 ? (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius="50%"
                  outerRadius="75%"
                  dataKey="value"
                  paddingAngle={3}
                  stroke="none"
                >
                  {chartData.map((item, index) => (
                    <Cell key={`${item.name}-${index}`} fill={item.color} />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [value, name]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Text */}

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs text-gray-400">Total</p>

                <p className="text-2xl font-bold text-gray-800 sm:text-3xl">
                  {total}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl bg-gray-50">
            <div className="text-center">
              <CalendarCheck className="mx-auto h-10 w-10 text-gray-300" />

              <p className="mt-3 text-sm font-medium text-gray-500">
                No session data available
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Your session analytics will appear here
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ==========================================
          STATUS LIST
      ========================================== */}

      <div className="mt-4 space-y-2 sm:mt-5 sm:space-y-3">
        {statusCards.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={`${item.title}-${index}`}
              className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-gray-100 p-3 transition hover:bg-gray-50 sm:p-3.5"
            >
              {/* Left */}

              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                <div
                  className={`shrink-0 rounded-lg p-2 sm:rounded-xl sm:p-2.5 ${item.color}`}
                >
                  <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                </div>

                <span className="truncate text-sm font-medium text-gray-700 sm:text-base">
                  {item.title}
                </span>
              </div>

              {/* Value */}

              <span className="shrink-0 text-lg font-bold text-gray-800 sm:text-xl">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* ==========================================
          TOTAL SESSIONS
      ========================================== */}

      <div className="mt-5 rounded-xl bg-gray-50 p-3.5 sm:mt-6 sm:rounded-2xl sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-gray-500 sm:text-base">
            Total Sessions
          </span>

          <span className="text-xl font-bold text-gray-800 sm:text-2xl">
            {total}
          </span>
        </div>
      </div>
    </div>
  );
}
