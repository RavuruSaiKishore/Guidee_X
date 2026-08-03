import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { Users } from "lucide-react";

export default function UserGrowthChart({ data = [] }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 h-[420px]">
      {/* Header */}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Growth</h2>

          <p className="text-gray-500 mt-1">Monthly student registrations</p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
          <Users className="text-blue-600" size={28} />
        </div>
      </div>

      {/* Chart */}

      <ResponsiveContainer width="100%" height="82%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

          <XAxis
            dataKey="month"
            tick={{
              fill: "#6B7280",
            }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            tick={{
              fill: "#6B7280",
            }}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            }}
          />

          <Line
            type="monotone"
            dataKey="users"
            stroke="#2563EB"
            strokeWidth={4}
            dot={{
              r: 5,
              fill: "#2563EB",
            }}
            activeDot={{
              r: 8,
            }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
