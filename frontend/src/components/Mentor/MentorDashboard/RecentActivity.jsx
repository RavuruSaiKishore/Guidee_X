import {
  CalendarCheck2,
  Star,
  IndianRupee,
  User,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

export default function RecentActivity({ activities = [] }) {
  const getIcon = (type) => {
    switch (type) {
      case "booking":
        return CalendarCheck2;

      case "review":
        return Star;

      case "payment":
        return IndianRupee;

      case "profile":
        return User;

      case "completed":
        return CheckCircle2;

      case "cancelled":
        return XCircle;

      default:
        return Clock3;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "booking":
        return "bg-blue-100 text-blue-600";

      case "review":
        return "bg-yellow-100 text-yellow-600";

      case "payment":
        return "bg-green-100 text-green-600";

      case "profile":
        return "bg-purple-100 text-purple-600";

      case "completed":
        return "bg-emerald-100 text-emerald-600";

      case "cancelled":
        return "bg-red-100 text-red-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const activityDate = new Date(date);

    const diff = Math.floor((now - activityDate) / 1000);

    if (diff < 60) return "Just now";

    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;

    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;

    return activityDate.toLocaleDateString();
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-lg">
      {/* Header */}

      <div className="border-b px-6 py-5">
        <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>

        <p className="mt-1 text-sm text-gray-500">
          Latest updates from your mentor account
        </p>
      </div>

      {/* Empty */}

      {activities.length === 0 && (
        <div className="flex h-72 flex-col items-center justify-center">
          <Clock3 size={60} className="text-gray-300" />

          <h3 className="mt-5 text-xl font-semibold text-gray-700">
            No Recent Activity
          </h3>

          <p className="mt-2 text-gray-500">Activities will appear here.</p>
        </div>
      )}

      {/* Timeline */}

      <div className="relative p-6">
        {activities.map((activity, index) => {
          const Icon = getIcon(activity.type);

          return (
            <div
              key={activity._id}
              className="relative flex gap-5 pb-8 last:pb-0"
            >
              {/* Timeline */}

              <div className="flex flex-col items-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${getColor(
                    activity.type
                  )}`}
                >
                  <Icon size={20} />
                </div>

                {index !== activities.length - 1 && (
                  <div className="mt-2 h-full w-[2px] bg-gray-200"></div>
                )}
              </div>

              {/* Content */}

              <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 p-5 transition hover:border-orange-300 hover:bg-white hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {activity.title}
                  </h3>

                  <span className="text-sm text-gray-500">
                    {formatTime(activity.createdAt)}
                  </span>
                </div>

                <p className="mt-3 leading-7 text-gray-600">
                  {activity.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
