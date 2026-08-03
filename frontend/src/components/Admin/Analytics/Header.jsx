import { BarChart3, CalendarDays, Download, TrendingUp } from "lucide-react";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";



export default function Header({ analytics }) {

const handleExportReport = () => {
  if (!analytics) {
    toast.error("Analytics data is not available.");
    return;
  }

  try {
    // Overview Sheet
    const overview = [
      { Metric: "Total Users", Value: analytics.totalUsers || 0 },
      { Metric: "Total Students", Value: analytics.totalStudents || 0 },
      { Metric: "Total Mentors", Value: analytics.totalMentors || 0 },
      { Metric: "Total Bookings", Value: analytics.totalBookings || 0 },
      { Metric: "Total Revenue", Value: analytics.totalRevenue || 0 },
      { Metric: "Generated On", Value: new Date().toLocaleString() },
    ];

    // Booking Status Sheet
    const bookingStatus = (analytics.bookingStatus || []).map((item) => ({
      Status: item.status,
      Count: item.value,
    }));

    // Revenue Sheet
    const revenue = (analytics.revenue || []).map((item) => ({
      Month: item.month,
      Revenue: item.revenue,
    }));

    // Top Mentors Sheet
    const mentors = (analytics.topMentors || []).map((mentor) => ({
      Name: `${mentor.firstName} ${mentor.lastName}`,
      Profession: mentor.profession,
      Bookings: mentor.bookings,
      Revenue: mentor.revenue,
      Rating: mentor.rating,
      Status: mentor.status,
    }));

    // User Growth Sheet
    const userGrowth = (analytics.userGrowth || []).map((item) => ({
      Month: item.month,
      Users: item.users,
    }));

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(overview),
      "Overview"
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(bookingStatus),
      "Booking Status"
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(revenue),
      "Revenue"
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(mentors),
      "Top Mentors"
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(userGrowth),
      "User Growth"
    );

    const fileName = `Analytics_Report_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    XLSX.writeFile(workbook, fileName);

    toast.success("Analytics report exported successfully!");
  } catch (error) {
    console.error(error);
    toast.error("Failed to export analytics report.");
  }
};


  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-8 text-white shadow-xl">
      {/* Decorative Blobs */}
      <div className="absolute -top-24 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

      <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-cyan-300/10 rounded-full blur-3xl"></div>

      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="35"
              height="35"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M35 0 L0 0 0 35"
                fill="none"
                stroke="white"
                strokeWidth="0.6"
              />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-8">
        {/* Left Side */}

        <div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
              <BarChart3 size={34} />
            </div>

            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Analytics Dashboard
              </h1>

              <p className="text-cyan-100 mt-2 text-lg">
                Track platform growth, mentor performance, bookings, revenue and
                user engagement.
              </p>
            </div>
          </div>

          {/* Small Stats */}

          <div className="flex flex-wrap gap-6 mt-8">
            <div className="bg-white/15 rounded-xl px-5 py-3 backdrop-blur">
              <p className="text-sm text-cyan-100">Platform Status</p>

              <h3 className="font-semibold mt-1">Healthy 🚀</h3>
            </div>

            <div className="bg-white/15 rounded-xl px-5 py-3 backdrop-blur">
              <p className="text-sm text-cyan-100">Last Updated</p>

              <h3 className="font-semibold mt-1">Just Now</h3>
            </div>
          </div>
        </div>

        {/* Right Side */}

        <div className="flex flex-col gap-4 w-full xl:w-auto">
          {/* Date Filter */}

          <button
            className="
            flex items-center justify-center gap-3
            bg-white/15
            hover:bg-white/25
            transition
            rounded-xl
            px-6
            py-3
            backdrop-blur
            "
          >
            <CalendarDays size={20} />
            Last 30 Days
          </button>

          {/* Export */}

          <button
            onClick={handleExportReport}
            className="
            flex items-center justify-center gap-3
            bg-white
            text-cyan-700
            hover:scale-105
            transition-all
            rounded-xl
            px-6
            py-3
            font-semibold
            shadow-lg
            "
          >
            <Download size={20} />
            Export Report
          </button>

          {/* Live Indicator */}

          <div className="bg-white/15 rounded-xl px-5 py-4 flex items-center gap-3 backdrop-blur">
            <TrendingUp className="text-green-300" size={22} />

            <div>
              <p className="text-xs text-cyan-100">Live Analytics</p>

              <h3 className="font-semibold">Connected</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
