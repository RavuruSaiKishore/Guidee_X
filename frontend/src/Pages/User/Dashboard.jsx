import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import WelcomeBanner from "../../components/StudentDashboard/WelcomeBanner";
import StatsCards from "../../components/StudentDashboard/StatsCards";
import UpcomingSession from "../../components/StudentDashboard/UpcomingSession";
import RecentBookings from "../../components/StudentDashboard/RecentBookings";
import RecommendedMentors from "../../components/StudentDashboard/RecommendedMentors";
import LearningAnalytics from "../../components/StudentDashboard/LearningAnalytics";
import RescheduleRequests from "../../components/StudentDashboard/RescheduleRequest";
import Notifications from "../../components/StudentDashboard/Notifications";

const Dashboard = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // =========================================================
  // DASHBOARD STATE
  // =========================================================

  const [dashboard, setDashboard] = useState({
    student: null,

    stats: {
      totalBookings: 0,
      completedSessions: 0,
      cancelledSessions: 0,
      pendingSessions: 0,
      rejectedSessions: 0,
      confirmedSessions: 0,
      upcomingSessions: 0,
      totalInvestment: 0,
      learningMinutes: 0,
      learningHours: 0,
      completionRate: 0,
      averageSessionDuration: 0,
      mentorsConsulted: 0,
      averageRating: 0,
    },

    progress: {
      percentage: 0,
      completedSessions: 0,
      totalSessions: 0,
      nextMilestone: 10,
      nextMilestoneTarget: 10,
    },

    upcomingSessions: [],
    recentBookings: [],

    learningAnalytics: {
      totalSessions: 0,
      completedSessions: 0,
      upcomingSessions: 0,
      learningMinutes: 0,
      learningHours: 0,
      totalInvestment: 0,
      mentorsConsulted: 0,
      averageRating: 0,
      completionRate: 0,
      averageSessionDuration: 0,
    },

    rescheduleRequests: [],

    eventRegistrations: [],
    upcomingEvents: [],

    badges: {
      unlocked: [],
      available: [],
    },

    notifications: [],

    recommendedMentors: [],
  });

  const [loading, setLoading] = useState(true);

  // =========================================================
  // FETCH DASHBOARD
  // =========================================================

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("UserToken");

      if (!token) {
        toast.error("Please login again.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/user/dashboard`, {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log("Student Dashboard API Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load dashboard.");
      }

      // =====================================================
      // IMPORTANT
      // Backend response:
      //
      // {
      //   success: true,
      //   dashboard: {
      //      student,
      //      stats,
      //      progress,
      //      upcomingSessions,
      //      recentBookings,
      //      learningAnalytics,
      //      rescheduleRequests,
      //      eventRegistrations,
      //      upcomingEvents,
      //      badges,
      //      notifications,
      //      recommendedMentors
      //   }
      // }
      // =====================================================

      const dashboardData = data.dashboard || {};

      setDashboard({
        student: dashboardData.student || null,

        stats: dashboardData.stats || {
          totalBookings: 0,
          completedSessions: 0,
          cancelledSessions: 0,
          pendingSessions: 0,
          rejectedSessions: 0,
          confirmedSessions: 0,
          upcomingSessions: 0,
          totalInvestment: 0,
          learningMinutes: 0,
          learningHours: 0,
          completionRate: 0,
          averageSessionDuration: 0,
          mentorsConsulted: 0,
          averageRating: 0,
        },

        progress: dashboardData.progress || {
          percentage: 0,
          completedSessions: 0,
          totalSessions: 0,
          nextMilestone: 10,
          nextMilestoneTarget: 10,
        },

        upcomingSessions: Array.isArray(dashboardData.upcomingSessions)
          ? dashboardData.upcomingSessions
          : [],

        recentBookings: Array.isArray(dashboardData.recentBookings)
          ? dashboardData.recentBookings
          : [],

        learningAnalytics: dashboardData.learningAnalytics || {
          totalSessions: 0,
          completedSessions: 0,
          upcomingSessions: 0,
          learningMinutes: 0,
          learningHours: 0,
          totalInvestment: 0,
          mentorsConsulted: 0,
          averageRating: 0,
          completionRate: 0,
          averageSessionDuration: 0,
        },

        // ===================================================
        // RESCHEDULE REQUESTS
        // ===================================================

        rescheduleRequests: Array.isArray(dashboardData.rescheduleRequests)
          ? dashboardData.rescheduleRequests
          : [],

        eventRegistrations: Array.isArray(dashboardData.eventRegistrations)
          ? dashboardData.eventRegistrations
          : [],

        upcomingEvents: Array.isArray(dashboardData.upcomingEvents)
          ? dashboardData.upcomingEvents
          : [],

        badges: dashboardData.badges || {
          unlocked: [],
          available: [],
        },

        notifications: Array.isArray(dashboardData.notifications)
          ? dashboardData.notifications
          : [],

        recommendedMentors: Array.isArray(dashboardData.recommendedMentors)
          ? dashboardData.recommendedMentors
          : [],
      });
    } catch (error) {
      console.error("Student dashboard error:", error);

      toast.error(error.message || "Failed to load dashboard.");

      setDashboard({
        student: null,

        stats: {
          totalBookings: 0,
          completedSessions: 0,
          cancelledSessions: 0,
          pendingSessions: 0,
          rejectedSessions: 0,
          confirmedSessions: 0,
          upcomingSessions: 0,
          totalInvestment: 0,
          learningMinutes: 0,
          learningHours: 0,
          completionRate: 0,
          averageSessionDuration: 0,
          mentorsConsulted: 0,
          averageRating: 0,
        },

        progress: {
          percentage: 0,
          completedSessions: 0,
          totalSessions: 0,
          nextMilestone: 10,
          nextMilestoneTarget: 10,
        },

        upcomingSessions: [],
        recentBookings: [],

        learningAnalytics: {
          totalSessions: 0,
          completedSessions: 0,
          upcomingSessions: 0,
          learningMinutes: 0,
          learningHours: 0,
          totalInvestment: 0,
          mentorsConsulted: 0,
          averageRating: 0,
          completionRate: 0,
          averageSessionDuration: 0,
        },

        rescheduleRequests: [],

        eventRegistrations: [],
        upcomingEvents: [],

        badges: {
          unlocked: [],
          available: [],
        },

        notifications: [],
        recommendedMentors: [],
      });
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // =========================================================
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // =========================================================
  // DATA FROM DASHBOARD
  // =========================================================

  const {
    student,
    stats,
    progress,
    upcomingSessions,
    recentBookings,
    learningAnalytics,
    rescheduleRequests,
    eventRegistrations,
    upcomingEvents,
    badges,
    notifications,
    recommendedMentors,
  } = dashboard;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 xl:px-10">
        <div className="space-y-6">
          {/* =================================================
              WELCOME BANNER
          ================================================== */}

          <WelcomeBanner student={student} loading={loading} />

          {/* =================================================
              STATS CARDS
          ================================================== */}

          <StatsCards
            bookings={recentBookings}
            stats={stats}
            loading={loading}
          />

          {/* =================================================
              UPCOMING SESSION
          ================================================== */}

          <UpcomingSession bookings={upcomingSessions} loading={loading} />

          {/* =================================================
              RECENT BOOKINGS
          ================================================== */}

          <RecentBookings bookings={recentBookings} loading={loading} />

          {/* =================================================
              RESCHEDULE REQUESTS
              DATA COMES DIRECTLY FROM BACKEND DASHBOARD
          ================================================== */}

          <RescheduleRequests
            requests={rescheduleRequests}
            loading={loading}
            onRefresh={fetchDashboardData}
          />

          {/* =================================================
              RECOMMENDED MENTORS
          ================================================== */}

          <RecommendedMentors mentors={recommendedMentors} loading={loading} />

          {/* =================================================
              LEARNING ANALYTICS
          ================================================== */}

          <LearningAnalytics
            bookings={recentBookings}
            analytics={learningAnalytics}
            loading={loading}
          />

          {/* =================================================
              NOTIFICATIONS
          ================================================== */}

          <Notifications notifications={notifications} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
