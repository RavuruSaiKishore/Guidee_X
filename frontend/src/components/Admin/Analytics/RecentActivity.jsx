import {
  Shield,
  User,
  CalendarCheck,
  GraduationCap,
  MessageSquare,
  CreditCard,
  LogIn,
  Clock3,
} from "lucide-react";

const moduleIcons = {
  Authentication: LogIn,
  Admin: Shield,
  Mentor: GraduationCap,
  Student: User,
  Booking: CalendarCheck,
  Review: MessageSquare,
  Payment: CreditCard,
  Profile: User,
};

const moduleColors = {
  Authentication: "bg-blue-100 text-blue-600",
  Admin: "bg-red-100 text-red-600",
  Mentor: "bg-emerald-100 text-emerald-600",
  Student: "bg-violet-100 text-violet-600",
  Booking: "bg-cyan-100 text-cyan-600",
  Review: "bg-yellow-100 text-yellow-600",
  Payment: "bg-green-100 text-green-600",
  Profile: "bg-indigo-100 text-indigo-600",
};

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  const intervals = [
    { label: "year", value: 31536000 },
    { label: "month", value: 2592000 },
    { label: "day", value: 86400 },
    { label: "hour", value: 3600 },
    { label: "minute", value: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.value);

    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
}

export default function RecentActivity({ activities = [] }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
      {/* Header */}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>

          <p className="text-gray-500 mt-1">Latest platform events</p>
        </div>

        <Clock3 size={30} className="text-slate-500" />
      </div>

      {/* Timeline */}

      <div className="space-y-6 max-h-[550px] overflow-y-auto pr-2">
        {activities.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No recent activities found.
          </div>
        )}

        {activities.map((activity) => {
          const Icon = moduleIcons[activity.module] || User;

          const color =
            moduleColors[activity.module] || "bg-gray-100 text-gray-600";

          return (
            <div key={activity._id} className="flex gap-4">
              {/* Timeline */}

              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}
                >
                  <Icon size={22} />
                </div>

                <div className="w-px flex-1 bg-slate-200 mt-2"></div>
              </div>

              {/* Content */}

              <div className="flex-1 pb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {activity.action}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      {activity.description}
                    </p>
                  </div>

                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {timeAgo(activity.createdAt)}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs">
                    {activity.userName}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                    {activity.module}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                    {activity.userType}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
