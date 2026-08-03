import { useNavigate } from "react-router-dom";
import {
  UserPen,
  CalendarClock,
  BookOpenCheck,
  MessageSquare,
  Star,
  BarChart3,
  ArrowRight,
} from "lucide-react";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Edit Profile",
      description: "Update profile",
      icon: UserPen,
      color: "from-orange-500 to-amber-500",
      route: "/mentor/profile",
    },
    {
      title: "Availability",
      description: "Manage schedule",
      icon: CalendarClock,
      color: "from-blue-500 to-cyan-500",
      route: "/mentor/availability",
    },
    {
      title: "Bookings",
      description: "View sessions",
      icon: BookOpenCheck,
      color: "from-green-500 to-emerald-500",
      route: "/mentor/bookings",
    },
    {
      title: "Requests",
      description: "Student requests",
      icon: MessageSquare,
      color: "from-purple-500 to-violet-500",
      route: "/mentor/requests",
    },
    {
      title: "Reviews",
      description: "Student feedback",
      icon: Star,
      color: "from-yellow-500 to-orange-500",
      route: "/mentor/reviews",
    },
    {
      title: "Analytics",
      description: "Performance",
      icon: BarChart3,
      color: "from-pink-500 to-rose-500",
      route: "/mentor/analytics",
    },
  ];

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b px-4 py-4 sm:px-5 sm:py-5">
        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
          Quick Actions
        </h2>

        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Frequently used shortcuts
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-3 p-4 min-[400px]:grid-cols-2 sm:gap-4 sm:p-5 lg:grid-cols-3">
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <button
              key={index}
              type="button"
              onClick={() => navigate(action.route)}
              className="group w-full min-w-0 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-md active:scale-[0.98] sm:p-5"
            >
              {/* Top */}
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r ${action.color} text-white shadow-sm sm:h-11 sm:w-11`}
                >
                  <Icon size={19} className="sm:h-5 sm:w-5" />
                </div>

                <ArrowRight
                  size={17}
                  className="mt-1 shrink-0 text-gray-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-orange-500 sm:h-[18px] sm:w-[18px]"
                />
              </div>

              {/* Content */}
              <div className="min-w-0">
                <h3 className="mt-3 truncate text-sm font-semibold text-gray-800 sm:text-base">
                  {action.title}
                </h3>

                <p className="mt-1 truncate text-xs text-gray-500 sm:text-sm">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
