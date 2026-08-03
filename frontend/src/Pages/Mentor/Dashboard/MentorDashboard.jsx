import { useEffect, useState } from "react";

import HeroSection from "../../../components/Mentor/MentorDashboard/HeroSection";
import StatsCards from "../../../components/Mentor/MentorDashboard/StatsCards";
import EarningsChart from "../../../components/Mentor/MentorDashboard/EarningsChart";
import SessionAnalytics from "../../../components/Mentor/MentorDashboard/SessionAnalytics";
import UpcomingSessions from "../../../components/Mentor/MentorDashboard/UpcomingSessions";
import TodaySchedule from "../../../components/Mentor/MentorDashboard/TodaySchedule";
import RecentReviews from "../../../components/Mentor/MentorDashboard/RecentReviews";
import RecentStudents from "../../../components/Mentor/MentorDashboard/RecentStudents";
import ProfileCompletion from "../../../components/Mentor/MentorDashboard/ProfileCompletion";
import MentorInfo from "../../../components/Mentor/MentorDashboard/MentorInfo";
import QuickActions from "../../../components/Mentor/MentorDashboard/QuickActions";

export default function MentorDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("MentorToken");

      if (!token) {
        throw new Error("Mentor authentication token not found");
      }

      const res = await fetch(`${API_BASE_URL}/api/mentor/dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      console.log("Mentor Dashboard:", data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch dashboard");
      }

      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 lg:ml-64 pt-16 lg:pt-0 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white border border-gray-100 shadow-sm p-8 text-center">
          {/* Spinner */}
          <div className="relative mx-auto w-14 h-14">
            <div className="w-14 h-14 rounded-full border-4 border-emerald-100" />

            <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-transparent border-t-emerald-600 animate-spin" />
          </div>

          {/* Loading Text */}
          <p className="mt-5 text-gray-800 font-semibold text-sm sm:text-base">
            Loading your Dashboard...
          </p>

          {/* Sub Text */}
          <p className="mt-1 text-xs sm:text-sm text-gray-400">
            Please wait a moment
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // EMPTY STATE
  // ==========================================

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 lg:ml-64 pt-16 lg:pt-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 text-center shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Something went wrong while loading your dashboard.
          </p>

          <button
            onClick={() => {
              setLoading(true);
              fetchDashboard();
            }}
            className="mt-5 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:ml-64 pt-16 lg:pt-0">
      <main className="w-full max-w-none p-3 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-10">
        {/* ==========================================
            HERO
        ========================================== */}
        <section className="mb-5 sm:mb-6 lg:mb-8">
          <HeroSection mentor={dashboardData.mentor} />
        </section>
        {/* ==========================================
            STATS
        ========================================== */}
        <section className="mb-5 sm:mb-6 lg:mb-8">
          <StatsCards stats={dashboardData.stats} />
        </section>
        {/* ==========================================
            EARNINGS + SESSION ANALYTICS
        ========================================== */}
        <section className="grid grid-cols-1 gap-5 sm:gap-6 lg:gap-8 mb-5 sm:mb-6 lg:mb-8">
          {/* Earnings Chart */}
          <div className="min-w-0 w-full">
            <EarningsChart earnings={dashboardData.earningsByMonth} />
          </div>

          {/* Session Analytics */}
          <div className="min-w-0 w-full">
            <SessionAnalytics analytics={dashboardData.sessionAnalytics} />
          </div>
        </section>
        {/* ==========================================
            UPCOMING + TODAY
        ========================================== */}
        <section className="grid grid-cols-1 gap-5 sm:gap-6 lg:gap-8 mb-5 sm:mb-6 lg:mb-8">
          {/* Upcoming Sessions */}
          <div className="min-w-0 w-full">
            <UpcomingSessions bookings={dashboardData.upcomingBookings} />
          </div>

          {/* Today's Schedule */}
          <div className="min-w-0 w-full">
            <TodaySchedule bookings={dashboardData.todayBookings} />
          </div>
        </section>
        {/* ==========================================
            REVIEWS + STUDENTS
        ========================================== */}
        {/* ==========================================
    RECENT REVIEWS + RECENT STUDENTS
========================================== */}

        <section className="grid grid-cols-1 gap-5 sm:gap-6 lg:gap-8 mb-5 sm:mb-6 lg:mb-8">
          {/* Recent Reviews */}
          <div className="min-w-0 w-full">
            <RecentReviews reviews={dashboardData.recentReviews} />
          </div>

          {/* Recent Students */}
          <div className="min-w-0 w-full">
            <RecentStudents students={dashboardData.recentStudents} />
          </div>
        </section>

        {/* ==========================================
    PROFILE COMPLETION + MENTOR INFO
========================================== */}

        <section className="grid grid-cols-1 gap-5 sm:gap-6 lg:gap-8 mb-5 sm:mb-6 lg:mb-8">
          {/* Profile Completion */}
          <div className="min-w-0 w-full">
            <ProfileCompletion
              percentage={dashboardData.profileCompletion}
              mentor={dashboardData.mentor}
            />
          </div>

          {/* Mentor Info */}
          <div className="min-w-0 w-full">
            <MentorInfo mentor={dashboardData.mentor} />
          </div>
        </section>
        {/* ==========================================
            QUICK ACTIONS
        ========================================== */}
        <section className="mb-5 sm:mb-6 lg:mb-8">
          <QuickActions />
        </section>
        {/* ==========================================
            RECENT ACTIVITY
        ========================================== */}
        {/* 
        <section>
          <RecentActivity
            activities={dashboardData.activities}
          />
        </section>
        */}
      </main>
    </div>
  );
}
