import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

import { GraduationCap, Star } from "lucide-react";

const COLORS = ["#06B6D4", "#3B82F6", "#8B5CF6", "#10B981", "#F59E0B"];
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MentorPerformance({ data = [] }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 min-h-[540px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Mentor Performance
          </h2>

          <p className="text-gray-500 mt-1">
            Top mentors by completed bookings
          </p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0">
          <GraduationCap className="text-indigo-600" size={28} />
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 10,
              right: 20,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis type="number" axisLine={false} tickLine={false} />

            <YAxis
              type="category"
              dataKey="name"
              width={90}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              formatter={(value) => [`${value} Bookings`, "Completed"]}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
              }}
            />

            <Bar dataKey="bookings" radius={[0, 8, 8, 0]}>
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Divider */}
      <div className="border-t my-6"></div>

      {/* Mentor List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {data.map((mentor, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                {mentor.profileImage ? (
                  <img
                    src={
                      mentor.profileImage.startsWith("http")
                        ? mentor.profileImage
                        : `${API_BASE_URL}/${mentor.profileImage.replace(
                            /^\/+/,
                            ""
                          )}`
                    }
                    alt={mentor.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling.style.display = "flex";
                    }}
                  />
                ) : null}

                <div
                  className="w-full h-full items-center justify-center text-white font-semibold"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                    display: mentor.profileImage ? "none" : "flex",
                  }}
                >
                  {mentor.name?.charAt(0)?.toUpperCase() || "M"}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">{mentor.name}</h3>

                <div className="flex items-center gap-1 text-yellow-500 text-sm">
                  <Star size={14} fill="currentColor" />

                  {mentor.rating ? mentor.rating.toFixed(1) : "0.0"}
                </div>
              </div>
            </div>

            <div className="text-right">
              <h3 className="font-bold text-gray-800">
                ₹{(mentor.revenue || 0).toLocaleString("en-IN")}
              </h3>

              <p className="text-sm text-gray-500">
                {mentor.bookings || 0} Sessions
              </p>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="flex items-center justify-center h-40 text-gray-400">
            No mentor performance data available.
          </div>
        )}
      </div>
    </div>
  );
}
