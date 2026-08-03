import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  Award,
  BarChart3,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  IndianRupee,
  RefreshCw,
  Star,
  Target,
  TrendingUp,
  Users,
  Video,
  Activity,
  AlertCircle,
  Trophy,
  Crown,
  Medal,
  Flame,
  Zap,
  Lock,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// ==========================================================
// BADGE STYLES
// ==========================================================

const badgeStyles = {
  "First Step": {
    icon: Medal,
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
  },

  "Consistent Learner": {
    icon: Award,
    gradient: "from-sky-500 to-indigo-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
  },

  "Dedicated Learner": {
    icon: Trophy,
    gradient: "from-yellow-400 to-orange-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
  },

  "Knowledge Explorer": {
    icon: Star,
    gradient: "from-fuchsia-500 to-violet-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
  },

  "Mentorship Champion": {
    icon: Crown,
    gradient: "from-indigo-600 to-purple-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
  },
};

// ==========================================================
// MAIN COMPONENT
// ==========================================================

const StudentAnalytics = () => {
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [period, setPeriod] = useState("6months");

  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==========================================================
  // FETCH ANALYTICS
  // ==========================================================

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);

      setError("");

      const token = localStorage.getItem("UserToken");

      if (!token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/user/student-analytics?period=${period}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Student Analytics:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load analytics.");
      }

      setAnalytics(data.analytics);
    } catch (error) {
      console.error("Analytics error:", error);

      setError(error.message || "Failed to load analytics.");

      toast.error(error.message || "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // ==========================================================
  // DATA
  // ==========================================================

  const overview = analytics?.overview || {};

  const trends = analytics?.trends || [];

  const bookingStatus = analytics?.bookingStatus || [];

  const sessionTypes = analytics?.sessionTypes || [];

  const mentorPerformance = analytics?.mentorPerformance || [];

  const rescheduleAnalytics = analytics?.rescheduleAnalytics || [];

  const eventAnalytics = analytics?.eventAnalytics || [];

  const meetingAnalytics = analytics?.meetingAnalytics || [];

  const badgeAnalytics = analytics?.badgeAnalytics || [];

  const badgeSummary = analytics?.badgeSummary || {};

  const gamification = analytics?.gamification || {};

  const student = analytics?.student || {};

  // ==========================================================
  // STUDENT INFO
  // ==========================================================

  const studentName =
    `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Student";

  const profileImage = student.profileImage || null;

  const careerGoal = student.careerGoal || "Continue your learning journey";

  // ==========================================================
  // GAMIFICATION
  // ==========================================================

  const xp = gamification.xp || 0;

  const level = gamification.level || 1;

  const levelTitle = gamification.levelTitle || "New Learner";

  const currentXP = gamification.currentXP || 0;

  const nextXP = gamification.nextXP || 500;

  const levelProgress = gamification.levelProgress || 0;

  const currentStreak = gamification.streak?.current || 0;

  const longestStreak = gamification.streak?.longest || 0;

  const xpHistory = gamification.xpHistory || [];

  // ==========================================================
  // BADGE INFO
  // ==========================================================

  const unlockedBadges =
    badgeSummary.unlockedBadges ||
    badgeAnalytics.filter((badge) => badge.unlocked).length;

  const totalBadges = badgeSummary.totalBadges || badgeAnalytics.length;

  const overallBadgeProgress = badgeSummary.overallProgress || 0;

  const currentBadge = badgeSummary.currentBadge || null;

  const nextBadge = badgeSummary.nextBadge || null;

  // ==========================================================
  // PERIOD LABEL
  // ==========================================================

  const formatPeriodLabel = useMemo(() => {
    const labels = {
      all: "All Time",

      "30days": "Last 30 Days",

      "6months": "Last 6 Months",

      "12months": "Last 12 Months",

      custom: "Custom Range",
    };

    return labels[period] || "Selected Period";
  }, [period]);

  // ==========================================================
  // TREND LABEL
  // ==========================================================

  const formatTrendLabel = (value) => {
    if (!value) {
      return "";
    }

    if (period === "30days") {
      return new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });
    }

    const [year, month] = value.split("-");

    return new Date(Number(year), Number(month) - 1).toLocaleDateString(
      "en-IN",
      {
        month: "short",
        year: "numeric",
      }
    );
  };

  const chartTrendData = trends.map((item) => ({
    ...item,

    label: formatTrendLabel(item.period),
  }));

  // ==========================================================
  // STAT CARDS
  // ==========================================================

  const statCards = [
    {
      label: "Total Sessions",

      value: overview.totalBookings || 0,

      icon: CalendarDays,

      bg: "bg-blue-100",

      text: "text-blue-600",
    },

    {
      label: "Completed",

      value: overview.completedSessions || 0,

      icon: CheckCircle2,

      bg: "bg-emerald-100",

      text: "text-emerald-600",
    },

    {
      label: "Learning Hours",

      value: `${overview.learningHours || 0}h`,

      icon: Clock3,

      bg: "bg-purple-100",

      text: "text-purple-600",
    },

    {
      label: "Mentors Consulted",

      value: overview.mentorsConsulted || 0,

      icon: Users,

      bg: "bg-indigo-100",

      text: "text-indigo-600",
    },

    {
      label: "Completion Rate",

      value: `${overview.completionRate || 0}%`,

      icon: Target,

      bg: "bg-amber-100",

      text: "text-amber-600",
    },

    {
      label: "Average Rating",

      value: `${overview.averageRating || 0} ★`,

      icon: Star,

      bg: "bg-yellow-100",

      text: "text-yellow-600",
    },

    {
      label: "Investment",

      value: `₹${Number(overview.totalInvestment || 0).toLocaleString(
        "en-IN"
      )}`,

      icon: IndianRupee,

      bg: "bg-emerald-100",

      text: "text-emerald-600",
    },

    {
      label: "Upcoming Sessions",

      value: overview.upcomingSessions || 0,

      icon: CalendarCheck,

      bg: "bg-pink-100",

      text: "text-pink-600",
    },
  ];

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-5">
            <div className="h-32 rounded-2xl bg-white" />

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({
                length: 8,
              }).map((_, index) => (
                <div key={index} className="h-28 rounded-xl bg-white" />
              ))}
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <div className="h-80 rounded-2xl bg-white" />

              <div className="h-80 rounded-2xl bg-white" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
          <div className="w-full rounded-2xl border border-red-100 bg-white p-7 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-red-100">
              <AlertCircle size={27} className="text-red-600" />
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Unable to Load Analytics
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error || "Something went wrong while loading your analytics."}
            </p>

            <button
              onClick={fetchAnalytics}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-50 mt-9">
      <main className="mx-auto max-w-[1570px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-5 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-lg">
          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* STUDENT PROFILE */}

              <div>
                <button
                  onClick={() => navigate(-1)}
                  className="mb-4 flex items-center gap-2 text-xs font-semibold text-blue-100 transition hover:text-white"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                <div className="flex items-center gap-4">
                  {/* PROFILE IMAGE / LOGO */}

                  <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur">
                    {profileImage ? (
                      <img
                        src={
                          profileImage.startsWith("http")
                            ? profileImage
                            : `${API_BASE_URL}${profileImage}`
                        }
                        alt={studentName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-black text-white">
                        {studentName
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100">
                      Student Performance
                    </p>

                    <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
                      {studentName}
                    </h1>

                    <p className="mt-1 text-sm font-semibold text-blue-100">
                      {careerGoal}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur">
                        Level {level}
                      </span>

                      <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur">
                        {levelTitle}
                      </span>

                      <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur">
                        {xp} XP
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-4 max-w-2xl text-xs leading-5 text-blue-100 sm:text-sm">
                  Track your mentorship journey, learning progress, investment,
                  mentor engagement, and achievements.
                </p>
              </div>

              {/* FILTERS */}

              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <div className="rounded-xl border border-white/20 bg-white/10 p-1 backdrop-blur">
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="all">All Time</option>

                    <option value="30days">Last 30 Days</option>

                    <option value="6months">Last 6 Months</option>

                    <option value="12months">Last 12 Months</option>
                  </select>
                </div>

                <button
                  onClick={fetchAnalytics}
                  className="flex items-center justify-center gap-2 rounded-lg bg-white/15 px-4 py-2.5 text-xs font-bold backdrop-blur transition hover:bg-white/25"
                >
                  <RefreshCw size={15} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-blue-100">
              <div className="flex items-center gap-2">
                <Activity size={14} />
                Showing analytics for
                <span className="font-bold text-white">
                  {formatPeriodLabel}
                </span>
              </div>

              <span className="h-1 w-1 rounded-full bg-white/40" />

              <div className="flex items-center gap-2">
                <Flame size={14} />
                <span className="font-bold text-white">{currentStreak}</span>
                day streak
              </div>

              <span className="h-1 w-1 rounded-full bg-white/40" />

              <div className="flex items-center gap-2">
                <Award size={14} />
                <span className="font-bold text-white">
                  {unlockedBadges}/{totalBadges}
                </span>
                badges
              </div>
            </div>
          </div>

          {/* LEVEL PROGRESS */}

          <div className="border-t border-white/10 bg-black/10 px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Zap size={14} />

                <span className="font-bold">Level {level} Progress</span>
              </div>

              <span className="font-bold">
                {currentXP} / {nextXP} XP
              </span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-700"
                style={{
                  width: `${levelProgress}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* =====================================================
            OVERVIEW CARDS
        ====================================================== */}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg}`}
                  >
                    <Icon size={19} className={item.text} />
                  </div>

                  <TrendingUp size={15} className="text-slate-300" />
                </div>

                <p className="mt-3 text-xs font-medium text-slate-500">
                  {item.label}
                </p>

                <h3 className="mt-0.5 text-xl font-extrabold text-slate-900">
                  {item.value}
                </h3>
              </div>
            );
          })}
        </div>

        {/* =====================================================
            BADGE + GAMIFICATION SUMMARY
        ====================================================== */}

        <div className="mt-5 grid gap-5 xl:grid-cols-3">
          {/* CURRENT LEVEL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  Current Level
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  Level {level}
                </h2>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {levelTitle}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600">
                <Zap size={23} className="text-white" />
              </div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                <span>XP Progress</span>

                <span>
                  {currentXP}/{nextXP}
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 transition-all"
                  style={{
                    width: `${levelProgress}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-400">
                  Total XP
                </p>

                <p className="mt-1 text-lg font-black text-indigo-600">{xp}</p>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase text-slate-400">
                  Longest Streak
                </p>

                <p className="mt-1 text-lg font-black text-orange-500">
                  {longestStreak} 🔥
                </p>
              </div>
            </div>
          </div>

          {/* BADGE SUMMARY */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  Achievement Progress
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  {unlockedBadges}
                  <span className="text-base text-slate-400">
                    {" "}
                    / {totalBadges}
                  </span>
                </h2>

                <p className="mt-1 text-sm text-slate-500">Badges unlocked</p>
              </div>

              <div className="relative flex h-20 w-20 items-center justify-center">
                <svg
                  className="-rotate-90"
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                >
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="#E5E7EB"
                    strokeWidth="7"
                    fill="transparent"
                  />

                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="#F59E0B"
                    strokeWidth="7"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 32}
                    strokeDashoffset={
                      2 * Math.PI * 32 * (1 - overallBadgeProgress / 100)
                    }
                  />
                </svg>

                <span className="absolute text-sm font-black text-slate-900">
                  {overallBadgeProgress}%
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-amber-50 p-3">
              <div className="flex items-center gap-2">
                <Trophy size={17} className="text-amber-600" />

                <p className="text-xs font-bold text-amber-800">
                  {unlockedBadges === totalBadges
                    ? "All achievements unlocked!"
                    : `${totalBadges - unlockedBadges} achievements remaining`}
                </p>
              </div>
            </div>
          </div>

          {/* STREAK */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                  Learning Streak
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  {currentStreak} Days
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Keep learning consistently.
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                <Flame size={25} className="text-orange-500" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-orange-50 p-3">
                <p className="text-[10px] font-semibold text-orange-600">
                  Current
                </p>

                <p className="mt-1 text-lg font-black text-orange-700">
                  {currentStreak}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[10px] font-semibold text-slate-500">Best</p>

                <p className="mt-1 text-lg font-black text-slate-800">
                  {longestStreak}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            CURRENT + NEXT BADGE
        ====================================================== */}

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {/* CURRENT BADGE */}

          {currentBadge ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    Current Achievement
                  </p>

                  <h2 className="mt-1 text-xl font-black text-slate-900">
                    {currentBadge.title}
                  </h2>
                </div>

                {(() => {
                  const style =
                    badgeStyles[currentBadge.title] ||
                    badgeStyles["First Step"];

                  const Icon = style.icon || Trophy;

                  return (
                    <div
                      className={`rounded-xl bg-gradient-to-br ${style.gradient} p-3`}
                    >
                      <Icon size={24} className="text-white" />
                    </div>
                  );
                })()}
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {currentBadge.description}
              </p>

              <div className="mt-5 flex items-center gap-2 text-xs font-bold text-emerald-600">
                <CheckCircle2 size={16} />
                Achievement unlocked
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">
                Complete your first mentorship session to unlock your first
                achievement.
              </p>
            </div>
          )}

          {/* NEXT BADGE */}

          {nextBadge ? (
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-5 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">
                    Next Achievement
                  </p>

                  <h2 className="mt-1 text-xl font-black">{nextBadge.title}</h2>
                </div>

                <Target size={25} />
              </div>

              <p className="mt-3 text-sm leading-6 text-indigo-100">
                {nextBadge.description}
              </p>

              <div className="mt-5">
                <div className="flex justify-between text-xs font-semibold text-indigo-100">
                  <span>Progress</span>

                  <span>
                    {nextBadge.currentProgress} / {nextBadge.required}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white transition-all"
                    style={{
                      width: `${nextBadge.progressPercentage}%`,
                    }}
                  />
                </div>
              </div>

              <p className="mt-3 text-xs font-semibold text-indigo-100">
                {nextBadge.remaining} more session
                {nextBadge.remaining !== 1 ? "s" : ""} needed
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="rounded-xl bg-emerald-500 p-3">
                <Crown size={24} className="text-white" />
              </div>

              <div>
                <h3 className="font-black text-emerald-800">
                  All Achievements Unlocked!
                </h3>

                <p className="mt-1 text-xs text-emerald-700">
                  You have completed every available achievement.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* =====================================================
            MAIN TRENDS
        ====================================================== */}

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <AnalyticsCard
            title="Session Activity Trend"
            description="Track your mentorship sessions over time."
            icon={TrendingUp}
          >
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="label"
                  tick={{
                    fontSize: 11,
                  }}
                />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="bookings"
                  name="Sessions"
                  strokeWidth={2.5}
                  stroke="#2563eb"
                  dot={{
                    r: 3,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="completed"
                  name="Completed"
                  strokeWidth={2.5}
                  stroke="#10b981"
                  dot={{
                    r: 3,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="cancelled"
                  name="Cancelled"
                  strokeWidth={2}
                  stroke="#ef4444"
                  dot={{
                    r: 3,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </AnalyticsCard>

          <AnalyticsCard
            title="Learning Hours Trend"
            description="See how your completed mentorship time has grown."
            icon={Clock3}
          >
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="label"
                  tick={{
                    fontSize: 11,
                  }}
                />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="learningHours"
                  name="Learning Hours"
                  stroke="#7c3aed"
                  strokeWidth={2.5}
                  dot={{
                    r: 3,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </AnalyticsCard>

          <AnalyticsCard
            title="Learning Investment"
            description="Track your completed paid mentorship investment."
            icon={IndianRupee}
          >
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="label"
                  tick={{
                    fontSize: 11,
                  }}
                />

                <YAxis />

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                />

                <Line
                  type="monotone"
                  dataKey="investment"
                  name="Investment"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={{
                    r: 3,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </AnalyticsCard>

          <AnalyticsCard
            title="Session Status"
            description="Understand how your bookings are distributed."
            icon={BarChart3}
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={bookingStatus}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="status"
                  tick={{
                    fontSize: 10,
                  }}
                />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Bar
                  dataKey="count"
                  name="Sessions"
                  fill="#4f46e5"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </AnalyticsCard>
        </div>

        {/* =====================================================
            SESSION TYPES + MENTORS
        ====================================================== */}

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <AnalyticsCard
            title="Session Types"
            description="Your mentorship sessions grouped by session type."
            icon={CalendarDays}
          >
            {sessionTypes.length === 0 ? (
              <EmptyChartState />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={sessionTypes}
                  layout="vertical"
                  margin={{
                    left: 15,
                    right: 15,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />

                  <XAxis type="number" allowDecimals={false} />

                  <YAxis
                    type="category"
                    dataKey="type"
                    width={110}
                    tick={{
                      fontSize: 11,
                    }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="count"
                    name="Sessions"
                    fill="#2563eb"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </AnalyticsCard>

          <AnalyticsCard
            title="Mentor Engagement"
            description="Mentors you have consulted most frequently."
            icon={Users}
          >
            {mentorPerformance.length === 0 ? (
              <EmptyChartState />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={mentorPerformance}
                  layout="vertical"
                  margin={{
                    left: 15,
                    right: 15,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />

                  <XAxis type="number" allowDecimals={false} />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{
                      fontSize: 11,
                    }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="sessions"
                    name="Sessions"
                    fill="#7c3aed"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </AnalyticsCard>
        </div>

        {/* =====================================================
            PERFORMANCE SUMMARY
        ====================================================== */}

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <ProgressCard
            title="Session Completion"
            value={overview.completionRate || 0}
            suffix="%"
            icon={Target}
            description="Percentage of bookings that you successfully completed."
          />

          <ProgressCard
            title="Meeting Completion"
            value={
              overview.totalMeetings
                ? Math.round(
                    (overview.meetingsCompleted / overview.totalMeetings) * 100
                  )
                : 0
            }
            suffix="%"
            icon={Video}
            description="Percentage of scheduled meetings completed successfully."
          />

          <ProgressCard
            title="Average Rating"
            value={overview.averageRating || 0}
            suffix=" / 5"
            icon={Star}
            description={`${
              overview.totalReviews || 0
            } review(s) submitted during this period.`}
          />
        </div>

        {/* =====================================================
            RESCHEDULE + EVENTS + MEETINGS
        ====================================================== */}

        <div className="mt-5 grid gap-5 xl:grid-cols-3">
          <AnalyticsCard
            title="Reschedule Activity"
            description="Overview of your session reschedule requests."
            icon={RefreshCw}
          >
            <SimpleBarChart
              data={rescheduleAnalytics}
              dataKey="count"
              categoryKey="status"
            />
          </AnalyticsCard>

          <AnalyticsCard
            title="Event Participation"
            description="Your participation in GuideX events."
            icon={CalendarDays}
          >
            <SimpleBarChart
              data={eventAnalytics}
              dataKey="count"
              categoryKey="category"
            />
          </AnalyticsCard>

          <AnalyticsCard
            title="Meeting Activity"
            description="Your mentorship meeting outcomes."
            icon={Video}
          >
            <SimpleBarChart
              data={meetingAnalytics}
              dataKey="count"
              categoryKey="status"
            />
          </AnalyticsCard>
        </div>

        {/* =====================================================
            BADGE COLLECTION
        ====================================================== */}

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                <Award size={21} className="text-amber-600" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Achievement Progress
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Continue your learning journey to unlock new badges.
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-amber-50 px-3 py-2">
              <span className="text-xs font-bold text-amber-700">
                {unlockedBadges} / {totalBadges} Unlocked
              </span>
            </div>
          </div>

          {badgeAnalytics.length === 0 ? (
            <EmptyChartState />
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {badgeAnalytics.map((badge) => {
                const style =
                  badgeStyles[badge.title] || badgeStyles["First Step"];

                const Icon = style.icon || Trophy;

                return (
                  <div
                    key={badge.id}
                    className={`group relative overflow-hidden rounded-2xl border bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg ${
                      badge.unlocked ? style.border : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${
                          style.gradient
                        } ${!badge.unlocked ? "grayscale" : ""}`}
                      >
                        <Icon size={24} className="text-white" />
                      </div>

                      {badge.unlocked ? (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-600">
                          UNLOCKED
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-slate-500">
                          <Lock size={11} />
                          LOCKED
                        </span>
                      )}
                    </div>

                    <h3 className="mt-5 text-base font-black text-slate-900">
                      {badge.title}
                    </h3>

                    <p className="mt-2 min-h-[40px] text-xs leading-5 text-slate-500">
                      {badge.description}
                    </p>

                    <div className="mt-5">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                        <span>Progress</span>

                        <span>
                          {badge.currentProgress} / {badge.required}
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${style.gradient} transition-all duration-500`}
                          style={{
                            width: `${badge.progressPercentage}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-4">
                      {badge.unlocked ? (
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                          <CheckCircle2 size={15} />
                          Achievement unlocked
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                          <Target size={15} />
                          {badge.remaining} more session
                          {badge.remaining !== 1 ? "s" : ""} needed
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* =====================================================
            XP HISTORY
        ====================================================== */}

        {xpHistory.length > 0 && (
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                <Sparkles size={20} className="text-indigo-600" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent XP Activity
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Your latest learning experience points.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {xpHistory.map((item, index) => (
                <div
                  key={item._id || index}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">XP</span>

                    <span className="text-sm font-black text-indigo-600">
                      +{item.xp || item.amount || 0}
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-xs font-semibold text-slate-700">
                    {item.reason || item.description || "Learning activity"}
                  </p>

                  {item.createdAt && (
                    <p className="mt-2 text-[10px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

// ==========================================================
// ANALYTICS CARD
// ==========================================================

const AnalyticsCard = ({ title, description, icon: Icon, children }) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
          <Icon size={18} className="text-blue-600" />
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-900">{title}</h2>

          <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
};

// ==========================================================
// PROGRESS CARD
// ==========================================================

const ProgressCard = ({ title, value, suffix, icon: Icon, description }) => {
  const percentage = Math.min(
    100,
    Number(value || 0) * (suffix === " / 5" ? 20 : 1)
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
          <Icon size={18} className="text-blue-600" />
        </div>

        <span className="text-xl font-extrabold text-slate-900">
          {value}
          {suffix}
        </span>
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-900">{title}</h3>

      <p className="mt-1 text-[11px] leading-4 text-slate-500">{description}</p>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};

// ==========================================================
// SIMPLE BAR CHART
// ==========================================================

const SimpleBarChart = ({ data, dataKey, categoryKey }) => {
  if (!data?.length) {
    return <EmptyChartState />;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        <XAxis
          dataKey={categoryKey}
          tick={{
            fontSize: 10,
          }}
        />

        <YAxis allowDecimals={false} />

        <Tooltip />

        <Bar dataKey={dataKey} fill="#2563eb" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// ==========================================================
// EMPTY CHART
// ==========================================================

const EmptyChartState = () => {
  return (
    <div className="flex h-[240px] flex-col items-center justify-center text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
        <BarChart3 size={19} className="text-slate-400" />
      </div>

      <p className="mt-3 text-xs font-semibold text-slate-700">
        No data available
      </p>

      <p className="mt-1 max-w-xs text-[11px] text-slate-400">
        There is not enough activity in the selected period to display this
        chart.
      </p>
    </div>
  );
};

export default StudentAnalytics;
