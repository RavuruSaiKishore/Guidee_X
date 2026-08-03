import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import { CalendarCheck2 } from "lucide-react";

const COLORS = [
  "#10B981", // Completed
  "#3B82F6", // Confirmed
  "#F59E0B", // Pending
  "#EF4444", // Cancelled
  "#6B7280", // Rejected
];

export default function BookingStatusChart({ data = [] }) {
  const totalBookings = data.reduce((sum, item) => sum + (item.value || 0), 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 min-h-[550px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Booking Status</h2>

          <p className="text-gray-500 mt-1">Current booking distribution</p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center shrink-0">
          <CalendarCheck2 className="text-violet-600" size={28} />
        </div>
      </div>

      {/* Doughnut Chart */}
      <div className="relative h-[280px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="status"
              innerRadius={75}
              outerRadius={105}
              paddingAngle={3}
              stroke="none"
              isAnimationActive
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [value, "Bookings"]}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-sm text-gray-500">Total</p>

          <h2 className="text-4xl font-bold text-gray-800">{totalBookings}</h2>

          <p className="text-xs text-gray-400">Bookings</p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 flex-1 overflow-y-auto pr-1 space-y-1">
        {data.length > 0 ? (
          data.map((item, index) => {
            const percentage =
              totalBookings === 0
                ? 0
                : ((item.value / totalBookings) * 100).toFixed(1);

            return (
              <div
                key={index}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />

                  <span className="font-medium text-gray-700">
                    {item.status}
                  </span>
                </div>

                <div className="text-right">
                  <p className="font-bold text-gray-800">{item.value}</p>

                  <p className="text-sm text-gray-500">{percentage}%</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No booking data available.
          </div>
        )}
      </div>
    </div>
  );
}
