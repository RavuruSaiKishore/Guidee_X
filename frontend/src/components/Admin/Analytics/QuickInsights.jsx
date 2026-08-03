import {
  TrendingUp,
  Users,
  IndianRupee,
  Clock3,
  Star,
  Flame,
} from "lucide-react";

export default function QuickInsights({ stats, popularSkills = [] }) {
  const topSkill =
    popularSkills.length > 0 ? popularSkills[0].skill : "No Skills";

  const insights = [
    {
      icon: TrendingUp,
      title: "Platform Growth",
      value: `${stats?.totalUsers || 0} Students`,
      description: "User base continues to grow steadily.",
      color: "bg-blue-100 text-blue-600",
    },

    {
      icon: IndianRupee,
      title: "Revenue Generated",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString("en-IN")}`,
      description: "Completed bookings revenue.",
      color: "bg-green-100 text-green-600",
    },

    {
      icon: Clock3,
      title: "Pending Approvals",
      value: stats?.pendingMentors || 0,
      description: "Mentors awaiting verification.",
      color: "bg-orange-100 text-orange-600",
    },

    {
      icon: Star,
      title: "Average Rating",
      value: `${stats?.averageRating?.toFixed(1) || "0.0"} / 5`,
      description: "Overall mentor rating.",
      color: "bg-yellow-100 text-yellow-600",
    },

    {
      icon: Flame,
      title: "Trending Skill",
      value: topSkill,
      description: "Most common mentor expertise.",
      color: "bg-pink-100 text-pink-600",
    },

    {
      icon: Users,
      title: "Active Mentors",
      value: stats?.activeMentors || 0,
      description: "Currently approved mentors.",
      color: "bg-cyan-100 text-cyan-600",
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quick Insights</h2>

          <p className="text-gray-500 mt-1">
            AI-powered summary of your platform performance.
          </p>
        </div>

        <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
          <TrendingUp className="text-cyan-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {insights.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="
                group
                rounded-2xl
                border
                border-slate-200
                p-5
                hover:shadow-lg
                hover:-translate-y-1
                transition-all
                duration-300
                bg-slate-50
              "
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${item.color}`}
              >
                <Icon size={26} />
              </div>

              <h3 className="font-semibold text-gray-800 mt-4">{item.title}</h3>

              <p className="text-3xl font-bold mt-2 text-gray-900">
                {item.value}
              </p>

              <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
