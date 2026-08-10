import {
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import { IndianRupee, TrendingUp, Wallet, Receipt } from "lucide-react";

export default function EarningsChart({ earnings = [], stats = {} }) {
  // =========================================================
  // TOTAL EARNINGS & COMMISSIONS FROM STATS OR FALLBACK
  // =========================================================

  const totalEarnings =
    stats.totalEarnings ??
    earnings.reduce((sum, item) => sum + (Number(item.earnings) || 0), 0);

  const totalCommissions =
    stats.totalCommissionsPaid ??
    earnings.reduce((sum, item) => sum + (Number(item.commission) || 0), 0);

  // =========================================================
  // HIGHEST EARNING MONTH
  // =========================================================

  const highestMonth =
    earnings.length > 0
      ? earnings.reduce((prev, current) =>
          Number(prev.earnings) > Number(current.earnings) ? prev : current
        )
      : null;

  // =========================================================
  // CURRENT MONTH
  // =========================================================

  const currentMonth =
    earnings.length > 0
      ? Number(earnings[earnings.length - 1].earnings) || 0
      : 0;

  // =========================================================
  // PREVIOUS MONTH
  // =========================================================

  const previousMonth =
    earnings.length > 1
      ? Number(earnings[earnings.length - 2].earnings) || 0
      : 0;

  // =========================================================
  // MONTHLY GROWTH
  // =========================================================

  const growth =
    previousMonth === 0
      ? 0
      : (((currentMonth - previousMonth) / previousMonth) * 100).toFixed(1);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="mx-auto w-full max-w-5xl min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-md sm:rounded-3xl sm:p-5 lg:p-6 lg:shadow-lg">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* TITLE */}

        <div className="min-w-0">
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Earnings & Fee Breakdown
          </h2>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500 sm:text-sm">
            Monthly net revenue and platform deductions overview
          </p>
        </div>

        {/* TOTAL CARDS CONTAINER */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* TOTAL NET EARNINGS */}
          <div className="rounded-xl bg-amber-50 p-3 sm:rounded-2xl sm:p-4 min-w-[180px]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                <Wallet className="h-5 w-5 text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Total Net Earnings</p>
                <h3 className="mt-0.5 truncate text-lg font-bold text-gray-800">
                  ₹{totalEarnings.toLocaleString("en-IN")}
                </h3>
              </div>
            </div>
          </div>

          {/* TOTAL COMMISSIONS / FEES */}
          <div className="rounded-xl bg-blue-50 p-3 sm:rounded-2xl sm:p-4 min-w-[180px]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                <Receipt className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Platform Fees & Cuts</p>
                <h3 className="mt-0.5 truncate text-lg font-bold text-gray-800">
                  ₹{totalCommissions.toLocaleString("en-IN")}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4">
        {/* CURRENT MONTH */}
        <div className="min-w-0 rounded-xl bg-green-50 p-4 sm:rounded-2xl sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-gray-500 sm:text-sm">
                Current Month (Net)
              </p>
              <h3 className="mt-1 truncate text-2xl font-bold text-gray-800 sm:mt-2 sm:text-3xl">
                ₹{currentMonth.toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100">
              <IndianRupee className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        {/* MONTHLY GROWTH */}
        <div className="min-w-0 rounded-xl bg-blue-50 p-4 sm:rounded-2xl sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-gray-500 sm:text-sm">Monthly Growth</p>
              <h3
                className={`mt-1 text-2xl font-bold sm:mt-2 sm:text-3xl ${
                  Number(growth) >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {Number(growth) > 0 ? "+" : ""}
                {growth}%
              </h3>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* BEST MONTH */}
        <div className="min-w-0 rounded-xl bg-orange-50 p-4 sm:rounded-2xl sm:p-5">
          <p className="text-xs text-gray-500 sm:text-sm">Best Month</p>
          <h3 className="mt-1 truncate text-xl font-bold text-gray-800 sm:mt-2 sm:text-2xl">
            {highestMonth?.month || "--"}
          </h3>
          <p className="mt-1 text-base font-semibold text-orange-600 sm:mt-2 sm:text-lg">
            ₹{Number(highestMonth?.earnings || 0).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* =====================================================
          CHART
      ====================================================== */}

      <div className="mt-5 h-[240px] w-full min-w-0 sm:mt-6 sm:h-[280px] md:h-[300px] lg:h-[320px]">
        {earnings.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={earnings}
              margin={{ top: 10, right: 5, left: -15, bottom: 5 }}
            >
              <defs>
                <linearGradient
                  id="earningGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient
                  id="commissionGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="4 4" vertical={false} />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                tickMargin={8}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />

              <YAxis
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={45}
                tickFormatter={(value) =>
                  value >= 1000 ? `₹${(value / 1000).toFixed(0)}k` : `₹${value}`
                }
              />

              <Tooltip
                formatter={(value, name) => [
                  `₹${Number(value).toLocaleString("en-IN")}`,
                  name === "earnings" ? "Net Earnings" : "Platform Fees",
                ]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                }}
              />

              <Legend verticalAlign="top" height={36} />

              {/* Net Earnings Area */}
              <Area
                type="monotone"
                dataKey="earnings"
                name="Net Earnings"
                stroke="#f59e0b"
                strokeWidth={3}
                fill="url(#earningGradient)"
                activeDot={{ r: 5 }}
              />

              {/* Platform Fees / Commissions Area */}
              <Area
                type="monotone"
                dataKey="commission"
                name="Platform Fees"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#commissionGradient)"
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl bg-gray-50">
            <div className="text-center">
              <Wallet className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-3 text-sm font-medium text-gray-500">
                No earnings data available
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Your financial metrics will appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
