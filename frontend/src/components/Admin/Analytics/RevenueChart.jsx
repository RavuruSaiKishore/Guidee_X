import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { IndianRupee } from "lucide-react";

export default function RevenueChart({ data = [] }) {
  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);

  const highestMonth =
    data.length > 0
      ? data.reduce((max, item) =>
          (item.revenue || 0) > (max.revenue || 0) ? item : max
        )
      : {
          month: "-",
          revenue: 0,
        };

  return (
    <div className="bg-white rounded-3xl border shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Monthly Revenue</h2>

          <p className="text-gray-500">
            Revenue generated from completed bookings
          </p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
          <IndianRupee className="text-green-600" size={28} />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="rounded-2xl bg-green-50 p-5">
          <p className="text-sm text-gray-500">Total Revenue</p>

          <h2 className="text-3xl font-bold text-green-700 mt-2">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="rounded-2xl bg-blue-50 p-5">
          <p className="text-sm text-gray-500">Best Month</p>

          <h2 className="text-xl font-bold text-blue-700 mt-2">
            {highestMonth.month}
          </h2>

          <p className="text-gray-600 mt-1">
            ₹{highestMonth.revenue.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16A34A" stopOpacity={0.45} />

                <stop offset="100%" stopColor="#16A34A" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="month" tickLine={false} axisLine={false} />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />

            <Tooltip
              formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#16A34A"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              activeDot={{
                r: 6,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
