import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

import Header from "../../../components/Admin/Analytics/Header";
import KPICards from "../../../components/Admin/Analytics/KPICards";
import QuickInsights from "../../../components/Admin/Analytics/QuickInsights";
import UserGrowthChart from "../../../components/Admin/Analytics/UserGrowthChart";
import BookingStatusChart from "../../../components/Admin/Analytics/BookingStatusChart";
import RevenueChart from "../../../components/Admin/Analytics/RevenueChart";
import MentorPerformance from "../../../components/Admin/Analytics/MentorPerformance";
import TopMentorsTable from "../../../components/Admin/Analytics/TopMentorsTable";
import RatingDistribution from "../../../components/Admin/Analytics/RatingDistribution";
import PopularSkills from "../../../components/Admin/Analytics/PopularSkills";
// import RecentActivity from "../../../components/Admin/Analytics/RecentActivity";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // ==========================================
  // FETCH ANALYTICS
  // ==========================================

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("AdminToken");

      const response = await fetch(
        `${API_BASE_URL}/api/admin/analytics`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Analytics response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load analytics."
        );
      }

      if (data.success) {
        setAnalytics(data);
      } else {
        throw new Error(
          data.message || "Failed to load analytics."
        );
      }
    } catch (err) {
      console.error("Analytics error:", err);

      setError(
        err.message || "Failed to load analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL FETCH
  // ==========================================

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col justify-center items-center px-5 text-center">
        <div className="relative">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-4 border-emerald-100" />

          <div className="absolute inset-0 h-14 w-14 sm:h-16 sm:w-16 rounded-full border-4 border-transparent border-t-emerald-600 animate-spin" />
        </div>

        <p className="mt-5 sm:mt-6 text-base sm:text-lg font-semibold text-gray-700">
          Loading Analytics page...!
        </p>

        <p className="text-xs sm:text-sm text-gray-400 mt-2 max-w-sm">
          Please wait while we fetch your analytics data.
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 md:p-10 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertTriangle
              className="text-red-500"
              size={30}
            />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mt-5">
            Something went wrong
          </h2>

          <p className="text-sm sm:text-base text-gray-500 mt-2 leading-relaxed break-words">
            {error}
          </p>

          <button
            onClick={fetchAnalytics}
            className="mt-6 w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 active:bg-cyan-800 transition font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-100">
      {/* ==========================================
          MAIN RESPONSIVE CONTAINER
      ========================================== */}

      <div className="w-full max-w-[1600px] mx-auto px-3 py-4 sm:px-4 mt-9 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
        {/* ==========================================
            HERO HEADER
        ========================================== */}

        <div className="w-full min-w-0">
          <Header analytics={analytics} />
        </div>

        {/* ==========================================
            KPI CARDS
        ========================================== */}

        <section className="mt-5 sm:mt-6 md:mt-8 w-full min-w-0">
          <KPICards
            stats={analytics?.stats}
            bookingStatus={analytics?.bookingStatus}
          />
        </section>

        {/* ==========================================
            QUICK INSIGHTS
        ========================================== */}

        <section className="mt-5 sm:mt-6 md:mt-8 w-full min-w-0">
          <QuickInsights
            stats={analytics?.stats}
            popularSkills={analytics?.popularSkills}
          />
        </section>

        {/* ==========================================
            USER GROWTH CHART
        ========================================== */}

        <section className="mt-5 sm:mt-6 md:mt-8 w-full min-w-0 overflow-hidden">
          <UserGrowthChart
            data={analytics?.userGrowth}
          />
        </section>

        {/* ==========================================
            BOOKING STATUS CHART
        ========================================== */}

        <section className="mt-5 sm:mt-6 md:mt-8 w-full min-w-0 overflow-hidden">
          <BookingStatusChart
            data={analytics?.bookingStatus}
          />
        </section>

        {/* ==========================================
            REVENUE CHART
        ========================================== */}

        <section className="mt-5 sm:mt-6 md:mt-8 w-full min-w-0 overflow-hidden">
          <RevenueChart
            data={analytics?.monthlyRevenue}
          />
        </section>

        {/* ==========================================
            MENTOR PERFORMANCE
        ========================================== */}

        <section className="mt-5 sm:mt-6 md:mt-8 w-full min-w-0 overflow-hidden">
          <MentorPerformance
            data={analytics?.mentorPerformance}
          />
        </section>

        {/* ==========================================
            TOP MENTORS TABLE
        ========================================== */}

        <section className="mt-5 sm:mt-6 md:mt-8 w-full min-w-0 overflow-hidden">
          <div className="w-full max-w-full overflow-x-auto">
            <TopMentorsTable
              mentors={analytics?.topMentors}
            />
          </div>
        </section>

        {/* ==========================================
            RATING DISTRIBUTION
        ========================================== */}

        <section className="mt-5 sm:mt-6 md:mt-8 w-full min-w-0 overflow-hidden">
          <RatingDistribution
            data={analytics?.ratingDistribution}
          />
        </section>

        {/* ==========================================
            POPULAR SKILLS
        ========================================== */}

        <section className="mt-5 sm:mt-6 md:mt-8 w-full min-w-0 overflow-hidden">
          <PopularSkills
            skills={analytics?.popularSkills}
          />
        </section>

        {/* ==========================================
            RECENT ACTIVITIES
            Uncomment when required
        ========================================== */}

        {/*
        <section className="mt-5 sm:mt-6 md:mt-8 w-full min-w-0 overflow-hidden">
          <RecentActivity
            activities={analytics?.recentActivities}
          />
        </section>
        */}
      </div>
    </div>
  );
}
