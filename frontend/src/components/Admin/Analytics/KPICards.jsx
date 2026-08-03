import {
  Users,
  GraduationCap,
  CalendarCheck2,
  IndianRupee,
  Star,
  UserCheck,
  Clock3,
  TrendingUp,
  BadgeCheck,
} from "lucide-react";

export default function KPICards({ stats, bookingStatus = [] }) {
  
  const pendingBookings =
    bookingStatus.find((item) => item.status === "Pending")?.value || 0;

  const confirmedBookings =
    bookingStatus.find((item) => item.status === "Confirmed")?.value || 0;

  const completedBookings =
    bookingStatus.find((item) => item.status === "Completed")?.value || 0;


  const cards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-100",
      trend: "+12%",
      subtitle: "This Month",
    },
    {
      title: "Total Mentors",
      value: stats?.totalMentors || 0,
      icon: GraduationCap,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      border: "border-emerald-100",
      trend: "+6%",
      subtitle: "Verified",
    },
    {
      title: "Pending Bookings",
      value: pendingBookings,
      icon: Clock3,
      color: "text-amber-600",
      bg: "bg-amber-100",
      border: "border-amber-100",
      trend: `${pendingBookings}`,
      subtitle: "Awaiting Approval",
    },

    {
      title: "Confirmed Bookings",
      value: confirmedBookings,
      icon: BadgeCheck,
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-100",
      trend: `${confirmedBookings}`,
      subtitle: "Upcoming Sessions",
    },

    {
      title: "Completed Bookings",
      value: completedBookings,
      icon: CalendarCheck2,
      color: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-100",
      trend: `${completedBookings}`,
      subtitle: "Successfully Finished",
    },
    {
      title: "Revenue",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-100",
      trend: "+23%",
      subtitle: "Overall",
    },
    {
      title: "Reviews",
      value: stats?.totalReviews || 0,
      icon: Star,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      border: "border-yellow-100",
      trend: "+9%",
      subtitle: "Received",
    },
    {
      title: "Avg Rating",
      value: stats?.averageRating?.toFixed(1) || "0.0",
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-100",
      border: "border-orange-100",
      trend: "+0.2",
      subtitle: "Overall",
    },
    {
      title: "Active Mentors",
      value: stats?.activeMentors || 0,
      icon: UserCheck,
      color: "text-cyan-600",
      bg: "bg-cyan-100",
      border: "border-cyan-100",
      trend: "+4%",
      subtitle: "Available",
    },
    {
      title: "Pending Requests",
      value: stats?.pendingMentors || 0,
      icon: Clock3,
      color: "text-red-600",
      bg: "bg-red-100",
      border: "border-red-100",
      trend: "-2",
      subtitle: "Needs Approval",
    },
  ];


 
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className={`
              group
              relative
              overflow-hidden
              rounded-3xl
              bg-white
              border
              ${card.border}
              shadow-sm
              hover:shadow-xl
              hover:-translate-y-1
              transition-all
              duration-300
              p-6
            `}
          >
            {/* Glow */}

            <div
              className={`
                absolute
                -right-10
                -top-10
                w-32
                h-32
                rounded-full
                opacity-10
                ${card.bg}
                group-hover:scale-125
                transition-all
                duration-500
              `}
            ></div>

            {/* Header */}

            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>

                <h2 className="text-3xl font-bold text-gray-800 mt-3">
                  {card.value}
                </h2>
              </div>

              <div
                className={`
                  w-14
                  h-14
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  ${card.bg}
                  ${card.color}
                  group-hover:rotate-6
                  transition
                `}
              >
                <Icon size={28} />
              </div>
            </div>

            {/* Bottom */}

            <div className="mt-6 flex justify-between items-center">
              <div>
                <span className="text-green-600 font-semibold">
                  {card.trend}
                </span>

                <span className="text-gray-400 ml-2 text-sm">
                  {card.subtitle}
                </span>
              </div>

              <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`
                    h-full
                    rounded-full
                    ${card.bg.replace("100", "500")}
                  `}
                  style={{
                    width: `${65 + index * 3}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
