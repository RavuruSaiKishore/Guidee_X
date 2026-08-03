import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  Award,
  Trophy,
  Crown,
  Medal,
  Star,
  Sparkles,
  BookOpenCheck,
  Lock,
  CheckCircle2,
  Target,
  Flame,
  Gem,
  Zap,
  Users,
  Clock,
  ChevronRight,
} from "lucide-react";

// =====================================================
// BADGE STYLES
// =====================================================

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

// =====================================================
// CURRENT BADGE
// =====================================================

const getCurrentBadge = (badges) => {
  const unlocked = badges.filter((badge) => badge.unlocked);

  if (!unlocked.length) {
    return badges[0];
  }

  return unlocked[unlocked.length - 1];
};

// =====================================================
// NEXT BADGE
// =====================================================

const getNextBadge = (badges) => {
  return badges.find((badge) => !badge.unlocked);
};

// =====================================================
// LEVEL DATA
// =====================================================

const getLevelData = (xp) => {
  const level = Math.floor(xp / 500) + 1;

  const currentXP = xp % 500;

  const nextXP = 500;

  const progress = (currentXP / nextXP) * 100;

  const titles = [
    "New Learner",
    "Beginner",
    "Explorer",
    "Dedicated",
    "Expert",
    "Champion",
    "Master",
  ];

  return {
    level,
    currentXP,
    nextXP,
    progress,
    title: titles[level - 1] || "Legend",
  };
};

// =====================================================
// CIRCULAR PROGRESS
// =====================================================

const CircularProgress = ({ progress }) => {
  const radius = 52;

  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div className="relative h-36 w-36">
      <svg
        className="-rotate-90"
        width="144"
        height="144"
        viewBox="0 0 144 144"
      >
        <circle
          cx="72"
          cy="72"
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="9"
          fill="transparent"
        />

        <circle
          cx="72"
          cy="72"
          r={radius}
          stroke="url(#badgeProgressGradient)"
          strokeWidth="9"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />

        <defs>
          <linearGradient
            id="badgeProgressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#9333EA" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-slate-900">
          {Math.round(progress)}%
        </span>

        <span className="text-xs font-medium text-slate-500">Completed</span>
      </div>
    </div>
  );
};

// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({ title, value, icon: Icon, iconStyle }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">{title}</p>

          <h3 className="mt-2 text-2xl font-black text-slate-900">{value}</h3>
        </div>

        <div className={`rounded-xl p-3 ${iconStyle}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const Badges = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [badges, setBadges] = useState([]);

  const [completedSessions, setCompletedSessions] = useState(0);

  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("All");

  const [gamification, setGamification] = useState(null);

  const [xpHistory, setXpHistory] = useState([]);

  // =====================================================
  // FETCH BADGES
  // =====================================================

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("UserToken");

      const res = await fetch(`${API_BASE_URL}/api/user/badges`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log("Badges Response:", data);

      if (data.success) {
        setBadges(data.badges || []);

        setCompletedSessions(data.completedSessions || 0);

        setGamification(data.gamification);

        setXpHistory(data.xpHistory || []);
      } else {
        toast.error(data.message || "Failed to load achievements");
      }
    } catch (error) {
      console.error(error);

      toast.error("Unable to load achievements.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DATA
  // =====================================================

  const xp = gamification?.xp || 0;

  const level = gamification?.level || 1;

  const streak = gamification?.streak?.current || 0;

  const currentBadge = useMemo(() => getCurrentBadge(badges), [badges]);

  const nextBadge = useMemo(() => getNextBadge(badges), [badges]);

  const unlockedBadges = badges.filter((badge) => badge.unlocked).length;

  const totalBadges = badges.length;

  const levelData = getLevelData(xp);

  const filteredBadges = badges.filter((badge) => {
    if (filter === "All") {
      return true;
    }

    if (filter === "Unlocked") {
      return badge.unlocked;
    }

    if (filter === "Locked") {
      return !badge.unlocked;
    }

    return true;
  });

  const overallProgress =
    totalBadges === 0 ? 0 : (unlockedBadges / totalBadges) * 100;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
            <Sparkles size={26} className="animate-pulse text-indigo-600" />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-500">
            Loading your achievements...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 mt-19">
      {/* ================================================= */}
      {/* PREMIUM HEADER */}
      {/* ================================================= */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">
          {/* Breadcrumb */}

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>GuideX</span>

            <ChevronRight size={14} />

            <span className="text-indigo-600">Achievements</span>
          </div>

          {/* Header Content */}

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left */}

            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-200">
                <Trophy size={27} className="text-white" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                    Learning Achievements
                  </h1>

                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
                    Level {levelData.level}
                  </span>
                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Track your learning journey, unlock badges, earn XP, and build
                  your mentorship achievements.
                </p>
              </div>
            </div>

            {/* Header Stats */}

            <div className="flex flex-wrap gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-indigo-600" />

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      XP
                    </p>

                    <p className="text-sm font-black text-slate-900">{xp}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Flame size={16} className="text-orange-500" />

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Streak
                    </p>

                    <p className="text-sm font-black text-slate-900">
                      {streak} days
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Medal size={16} className="text-emerald-600" />

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Badges
                    </p>

                    <p className="text-sm font-black text-slate-900">
                      {unlockedBadges}/{totalBadges}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8">
        {/* ================================================= */}
        {/* TOP STATS */}
        {/* ================================================= */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Sessions Completed"
            value={completedSessions}
            icon={BookOpenCheck}
            iconStyle="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="Learning Hours"
            value={`${completedSessions}h`}
            icon={Clock}
            iconStyle="bg-purple-50 text-purple-600"
          />

          <StatCard
            title="Mentors Connected"
            value={Math.min(completedSessions, 10)}
            icon={Users}
            iconStyle="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            title="Current Streak"
            value={`${streak} 🔥`}
            icon={Flame}
            iconStyle="bg-orange-50 text-orange-600"
          />
        </div>

        {/* ================================================= */}
        {/* LEVEL + PROGRESS */}
        {/* ================================================= */}

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {/* LEVEL CARD */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg">
                  <Zap size={24} className="text-white" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Current Level
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-slate-900">
                    Level {levelData.level}
                  </h2>

                  <p className="text-sm font-semibold text-slate-500">
                    {levelData.title}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs font-semibold text-slate-400">
                  Experience
                </p>

                <p className="mt-1 text-xl font-black text-indigo-600">
                  {levelData.currentXP}
                  <span className="text-sm font-semibold text-slate-400">
                    {" "}
                    / {levelData.nextXP} XP
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Level Progress</span>

                <span>{Math.round(levelData.progress)}%</span>
              </div>

              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 transition-all duration-700"
                  style={{
                    width: `${levelData.progress}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* BADGE PROGRESS */}

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Achievements
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-900">
                {unlockedBadges}
                <span className="text-base text-slate-400">
                  {" "}
                  / {totalBadges}
                </span>
              </h2>

              <p className="mt-1 text-sm text-slate-500">Badges unlocked</p>
            </div>

            <CircularProgress progress={overallProgress} />
          </div>
        </div>

        {/* ================================================= */}
        {/* CURRENT + NEXT ACHIEVEMENT */}
        {/* ================================================= */}

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {/* CURRENT BADGE */}

          {currentBadge && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Current Achievement
                  </p>

                  <h2 className="mt-2 text-xl font-black text-slate-900">
                    {currentBadge.title}
                  </h2>
                </div>

                <div
                  className={`rounded-xl bg-gradient-to-br ${
                    badgeStyles[currentBadge.title]?.gradient
                  } p-3`}
                >
                  {(() => {
                    const Icon = badgeStyles[currentBadge.title]?.icon || Crown;

                    return <Icon size={24} className="text-white" />;
                  })()}
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {currentBadge.description}
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-emerald-600">
                <CheckCircle2 size={17} />
                Achievement unlocked
              </div>
            </div>
          )}

          {/* NEXT BADGE */}

          {nextBadge ? (
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                    Next Achievement
                  </p>

                  <h2 className="mt-2 text-xl font-black">{nextBadge.title}</h2>
                </div>

                <Target size={26} />
              </div>

              <p className="mt-3 text-sm leading-6 text-indigo-100">
                {nextBadge.description}
              </p>

              <div className="mt-5">
                <div className="flex justify-between text-xs font-semibold text-indigo-100">
                  <span>Progress</span>

                  <span>
                    {completedSessions} / {nextBadge.required}
                  </span>
                </div>

                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white transition-all"
                    style={{
                      width: `${Math.min(
                        (completedSessions / nextBadge.required) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <div className="rounded-xl bg-emerald-500 p-3">
                <Crown size={25} className="text-white" />
              </div>

              <div>
                <h3 className="font-black text-emerald-800">
                  All Achievements Unlocked!
                </h3>

                <p className="mt-1 text-sm text-emerald-700">
                  You have completed every available achievement.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ================================================= */}
        {/* BADGE COLLECTION */}
        {/* ================================================= */}

        <section className="mt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Your Collection
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-900">
                Achievement Gallery
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Unlock badges by continuing your learning journey.
              </p>
            </div>

            {/* FILTER */}

            <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              {["All", "Unlocked", "Locked"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                    filter === item
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* BADGES */}

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredBadges.map((badge) => {
              const style =
                badgeStyles[badge.title] || badgeStyles["First Step"];

              const Icon = style.icon || Trophy;

              const progress = Math.min(
                (badge.progress / badge.required) * 100,
                100
              );

              return (
                <div
                  key={badge.id}
                  className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    badge.unlocked ? style.border : "border-slate-200"
                  }`}
                >
                  {/* TOP */}

                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${
                        style.gradient
                      } ${!badge.unlocked ? "grayscale" : ""}`}
                    >
                      <Icon size={26} className="text-white" />
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

                  {/* CONTENT */}

                  <h3 className="mt-5 text-lg font-black text-slate-900">
                    {badge.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 min-h-[48px] text-sm leading-6 text-slate-500">
                    {badge.description}
                  </p>

                  {/* PROGRESS */}

                  <div className="mt-5">
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>Progress</span>

                      <span>
                        {badge.progress} / {badge.required}
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${style.gradient} transition-all duration-500`}
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* FOOTER */}

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    {badge.unlocked ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                        <CheckCircle2 size={16} />
                        Achievement unlocked
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <Target size={15} />
                        {Math.max(badge.required - completedSessions, 0)} more
                        session
                        {Math.max(badge.required - completedSessions, 0) !== 1
                          ? "s"
                          : ""}{" "}
                        needed
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* EMPTY FILTER */}

          {filteredBadges.length === 0 && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <Gem size={35} className="mx-auto text-slate-300" />

              <h3 className="mt-4 font-bold text-slate-800">No badges found</h3>

              <p className="mt-1 text-sm text-slate-500">
                There are no badges in the selected category.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Badges;
