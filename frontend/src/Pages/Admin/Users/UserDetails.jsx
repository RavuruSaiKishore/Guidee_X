import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Award,
  BadgeCheck,
  Ban,
  CalendarDays,
  Check,
  CheckCircle2,
  Pencil,
  Clock3,
  CreditCard,
  Crown,
  GraduationCap,
  Heart,
  History,
  LockKeyhole,
  Mail,
  Medal,
  Phone,
  RefreshCw,
  RotateCcw,
  School,
  Search,
  Sparkles,
  Star,
  Target,
  TicketCheck,
  Trophy,
  UserRound,
  Users,
  Video,
  X,
  XCircle,
  Zap,
} from "lucide-react";

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("overview");

  const [searchTerm, setSearchTerm] = useState("");

  const [refreshing, setRefreshing] = useState(false);

  // =====================================================
  // FETCH STUDENT DETAILS
  // =====================================================

  const fetchStudentDetails = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token =
        localStorage.getItem("AdminToken") || localStorage.getItem("UserToken");

      const response = await fetch(
        `${API_BASE_URL}/api/admin/students/${id}/details`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch student details.");
      }

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch student details.");
      }

      setData(result);
    } catch (err) {
      console.error("Student details error:", err);

      setError(err.message || "Unable to load student details.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchStudentDetails();
    }
  }, [id]);

  // =====================================================
  // HELPERS
  // =====================================================

  const student = data?.student || {};

  const statistics = data?.statistics || {};

  const gamification = data?.gamification || {};

  const badges = gamification.badges || [];

  const bookings = data?.bookings || [];

  const meetings = data?.meetings || [];

  const reviews = data?.reviews || [];

  const rescheduleRequests = data?.rescheduleRequests || [];

  const eventRegistrations = data?.eventRegistrations || [];

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getFullName = (user) => {
    return (
      `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
      "Unknown Student"
    );
  };

  const getProfileImage = (image) => {
    if (!image) {
      return "/default-avatar.png";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_BASE_URL}${image}`;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
      case "Paid":
      case "Accepted":
      case "Registered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "Confirmed":
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Pending":
      case "Scheduled":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "Cancelled":
      case "Rejected":
      case "Failed":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

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
  // FILTERED DATA
  // =====================================================

  const filteredBookings = useMemo(() => {
    if (!searchTerm.trim()) {
      return bookings;
    }

    const search = searchTerm.toLowerCase();

    return bookings.filter((booking) => {
      const mentorName = getFullName(booking.mentor);

      return (
        mentorName.toLowerCase().includes(search) ||
        booking.sessionType?.toLowerCase().includes(search) ||
        booking.bookingStatus?.toLowerCase().includes(search)
      );
    });
  }, [bookings, searchTerm]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fc]">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 animate-spin items-center justify-center rounded-2xl border-4 border-indigo-100 border-t-indigo-600">
              <RefreshCw size={24} className="text-indigo-600" />
            </div>

            <p className="mt-4 text-sm font-semibold text-gray-700">
              Loading student details...
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Please wait while we prepare the profile
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f8fc]">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-4">
          <div className="w-full rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <XCircle size={28} />
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Unable to load student
            </h2>

            <p className="mt-2 text-sm text-gray-500">{error}</p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Go Back
              </button>

              <button
                onClick={() => fetchStudentDetails()}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="relative overflow-hidden bg-gradient-to-br from-[#111827] via-[#312e81] to-[#581c87]">
        {/* Decorative Background */}

        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="absolute -bottom-28 left-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="absolute right-1/3 top-1/2 h-40 w-40 rounded-full bg-purple-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* TOP NAV */}

          <div className="flex items-center justify-between gap-3">
            {/* BACK BUTTON */}

            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              <ArrowLeft size={17} />
              Back to Users
            </button>

            {/* RIGHT ACTIONS */}

            <div className="flex items-center gap-2">
              {/* EDIT BUTTON */}

              <button
                onClick={() => navigate(`/admin/students/${student._id}/edit`)}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                <Pencil size={17} />

                <span className="hidden sm:inline">Edit Student</span>

                <span className="sm:hidden">Edit</span>
              </button>

              {/* REFRESH BUTTON */}

              <button
                onClick={() => fetchStudentDetails(true)}
                disabled={refreshing}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={refreshing ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>

          {/* PROFILE */}

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative">
                <img
                  src={getProfileImage(student.profileImage)}
                  alt={getFullName(student)}
                  className="h-24 w-24 rounded-3xl border-4 border-white/20 object-cover shadow-2xl"
                  onError={(e) => {
                    e.currentTarget.src = "/default-avatar.png";
                  }}
                />

                {student.isActive && (
                  <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-[#312e81] bg-emerald-500" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {getFullName(student)}
                  </h1>

                  {student.isVerified && (
                    <BadgeCheck size={22} className="text-sky-300" />
                  )}
                </div>

                <p className="mt-1 text-sm text-indigo-200">{student.email}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${
                      student.isActive
                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                        : "border-gray-400/20 bg-gray-400/10 text-gray-300"
                    }`}
                  >
                    {student.isActive ? "Active" : "Inactive"}
                  </span>

                  {student.isBlocked && (
                    <span className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-xs font-bold text-red-300">
                      Blocked
                    </span>
                  )}

                  {student.isVerified && (
                    <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-bold text-sky-300">
                      Verified
                    </span>
                  )}

                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-indigo-100">
                    Student
                  </span>
                </div>
              </div>
            </div>

            {/* HEADER STATS */}

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <HeaderStat
                value={statistics.bookings?.completed || 0}
                label="Completed"
              />

              <HeaderStat value={gamification.xp || 0} label="XP" />

              <HeaderStat
                value={gamification.badgeStats?.unlocked || 0}
                label="Badges"
              />
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          PAGE CONTENT
      ================================================= */}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* TABS */}

        <div className="mb-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm">
          <div className="flex min-w-max gap-1">
            <TabButton
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
              icon={<UserRound size={16} />}
              label="Overview"
            />

            <TabButton
              active={activeTab === "bookings"}
              onClick={() => setActiveTab("bookings")}
              icon={<CalendarDays size={16} />}
              label="Bookings"
              count={bookings.length}
            />

            <TabButton
              active={activeTab === "meetings"}
              onClick={() => setActiveTab("meetings")}
              icon={<Video size={16} />}
              label="Meetings"
              count={meetings.length}
            />

            <TabButton
              active={activeTab === "events"}
              onClick={() => setActiveTab("events")}
              icon={<TicketCheck size={16} />}
              label="Events"
              count={eventRegistrations.length}
            />

            <TabButton
              active={activeTab === "reviews"}
              onClick={() => setActiveTab("reviews")}
              icon={<Heart size={16} />}
              label="Reviews"
              count={reviews.length}
            />

            <TabButton
              active={activeTab === "reschedules"}
              onClick={() => setActiveTab("reschedules")}
              icon={<RotateCcw size={16} />}
              label="Reschedules"
              count={rescheduleRequests.length}
            />
          </div>
        </div>

        {/* =================================================
            OVERVIEW
        ================================================= */}

        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* STAT CARDS */}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <StatCard
                icon={<CalendarDays />}
                label="Bookings"
                value={statistics.bookings?.total || 0}
                iconClass="bg-indigo-50 text-indigo-600"
              />

              <StatCard
                icon={<CheckCircle2 />}
                label="Completed"
                value={statistics.bookings?.completed || 0}
                iconClass="bg-emerald-50 text-emerald-600"
              />

              <StatCard
                icon={<CreditCard />}
                label="Paid"
                value={formatCurrency(statistics.payments?.totalAmountPaid)}
                iconClass="bg-amber-50 text-amber-600"
              />

              <StatCard
                icon={<Video />}
                label="Meetings"
                value={statistics.meetings?.completed || 0}
                iconClass="bg-sky-50 text-sky-600"
              />

              <StatCard
                icon={<TicketCheck />}
                label="Events"
                value={statistics.events?.attended || 0}
                iconClass="bg-fuchsia-50 text-fuchsia-600"
              />

              <StatCard
                icon={<Star />}
                label="Reviews"
                value={statistics.reviews?.total || 0}
                iconClass="bg-orange-50 text-orange-600"
              />
            </div>

            {/* PERSONAL + LEARNING */}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* PERSONAL */}

              <SectionCard
                title="Personal Information"
                subtitle="Basic student profile details"
                icon={<UserRound size={19} />}
                iconClass="bg-indigo-50 text-indigo-600"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoItem
                    label="First Name"
                    value={student.firstName}
                    icon={<UserRound size={15} />}
                  />

                  <InfoItem
                    label="Last Name"
                    value={student.lastName}
                    icon={<UserRound size={15} />}
                  />

                  <InfoItem
                    label="Email"
                    value={student.email}
                    icon={<Mail size={15} />}
                  />

                  <InfoItem
                    label="Phone"
                    value={student.phone}
                    icon={<Phone size={15} />}
                  />

                  <InfoItem
                    label="Education"
                    value={student.education}
                    icon={<School size={15} />}
                  />

                  <InfoItem
                    label="Career Goal"
                    value={student.careerGoal}
                    icon={<Target size={15} />}
                  />
                </div>
              </SectionCard>

              {/* LEARNING */}

              <SectionCard
                title="Learning Progress"
                subtitle="Gamification and learning activity"
                icon={<Sparkles size={19} />}
                iconClass="bg-violet-50 text-violet-600"
              >
                <div className="grid grid-cols-2 gap-3">
                  <MiniStat
                    label="Total XP"
                    value={gamification.xp || 0}
                    icon={<Zap size={16} />}
                  />

                  <MiniStat
                    label="Level"
                    value={gamification.level || 1}
                    icon={<Award size={16} />}
                  />

                  <MiniStat
                    label="Current Streak"
                    value={`${gamification.streak?.current || 0} days`}
                    icon={<Sparkles size={16} />}
                  />

                  <MiniStat
                    label="Longest Streak"
                    value={`${gamification.streak?.longest || 0} days`}
                    icon={<Trophy size={16} />}
                  />
                </div>

                <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">
                      Last Activity
                    </span>

                    <span className="text-xs font-bold text-gray-700">
                      {formatDateTime(gamification.streak?.lastActivity)}
                    </span>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* =================================================
                BADGES
            ================================================= */}

            <SectionCard
              title="Badges & Achievements"
              subtitle="Student progress through mentorship sessions"
              icon={<Trophy size={19} />}
              iconClass="bg-amber-50 text-amber-600"
              rightContent={
                <div className="flex gap-2">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    {gamification.badgeStats?.unlocked || 0} Unlocked
                  </span>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
                    {gamification.badgeStats?.locked || 0} Locked
                  </span>
                </div>
              }
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {badges.map((badge) => {
                  const style = badgeStyles[badge.title] || {
                    icon: Award,
                    gradient: "from-gray-500 to-gray-700",
                    bg: "bg-gray-50",
                    border: "border-gray-200",
                    text: "text-gray-700",
                  };

                  const Icon = style.icon;

                  return (
                    <div
                      key={badge.id}
                      className={`relative overflow-hidden rounded-2xl border p-4 transition hover:-translate-y-1 hover:shadow-lg ${
                        badge.unlocked
                          ? `${style.bg} ${style.border}`
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      {!badge.unlocked && (
                        <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm">
                          <LockKeyhole size={14} />
                        </div>
                      )}

                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${
                          badge.unlocked
                            ? style.gradient
                            : "from-gray-300 to-gray-400"
                        } text-white shadow-md`}
                      >
                        <Icon size={23} />
                      </div>

                      <h3
                        className={`mt-4 text-sm font-bold ${
                          badge.unlocked ? style.text : "text-gray-500"
                        }`}
                      >
                        {badge.title}
                      </h3>

                      <p className="mt-1 min-h-[40px] text-xs leading-5 text-gray-500">
                        {badge.description}
                      </p>

                      <div className="mt-4">
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                            Progress
                          </span>

                          <span
                            className={`text-xs font-bold ${
                              badge.unlocked ? style.text : "text-gray-500"
                            }`}
                          >
                            {badge.progress}/{badge.required}
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-white">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${
                              badge.unlocked
                                ? style.gradient
                                : "from-gray-300 to-gray-400"
                            }`}
                            style={{
                              width: `${badge.progressPercentage || 0}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        {badge.unlocked ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <CheckCircle2 size={13} />
                            Unlocked
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
                            <LockKeyhole size={13} />
                            Locked
                          </span>
                        )}

                        {badge.unlockedAt && (
                          <span className="text-[10px] text-gray-400">
                            {formatDate(badge.unlockedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            {/* =================================================
                XP HISTORY
            ================================================= */}

            <SectionCard
              title="Recent XP Activity"
              subtitle="Latest XP earned by the student"
              icon={<Zap size={19} />}
              iconClass="bg-yellow-50 text-yellow-600"
            >
              {gamification.xpHistory?.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {gamification.xpHistory.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
                          <Sparkles size={16} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {item.reason}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            {formatDateTime(item.createdAt)}
                          </p>
                        </div>
                      </div>

                      <span className="font-bold text-emerald-600">
                        +{item.xp || 0} XP
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Zap size={24} />}
                  text="No XP activity found."
                />
              )}
            </SectionCard>

            {/* =================================================
                ACHIEVEMENT HISTORY
            ================================================= */}

            <SectionCard
              title="Achievement History"
              subtitle="Badges unlocked by this student"
              icon={<History size={19} />}
              iconClass="bg-purple-50 text-purple-600"
            >
              {gamification.achievementHistory?.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {gamification.achievementHistory.map((achievement, index) => (
                    <div
                      key={achievement._id || index}
                      className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                        <Trophy size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {achievement.title}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-400">
                          Unlocked on {formatDate(achievement.unlockedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Trophy size={24} />}
                  text="No achievements unlocked yet."
                />
              )}
            </SectionCard>
          </div>
        )}

        {/* =================================================
            BOOKINGS
        ================================================= */}

        {activeTab === "bookings" && (
          <div className="space-y-5">
            <SectionCard
              title="Student Bookings"
              subtitle={`${bookings.length} total booking records`}
              icon={<CalendarDays size={19} />}
              iconClass="bg-indigo-50 text-indigo-600"
              rightContent={
                <div className="relative">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search bookings..."
                    className="w-52 rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-indigo-400"
                  />
                </div>
              }
            >
              {filteredBookings.length > 0 ? (
                <div className="space-y-3">
                  {filteredBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-indigo-100 hover:bg-white hover:shadow-sm"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={getProfileImage(booking.mentor?.profileImage)}
                            alt=""
                            className="h-11 w-11 rounded-xl object-cover"
                          />

                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {getFullName(booking.mentor)}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-500">
                              {booking.sessionType}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <div className="text-xs text-gray-500">
                            <CalendarDays size={13} className="mr-1 inline" />

                            {formatDate(booking.sessionDate)}
                          </div>

                          <span className="text-xs font-semibold text-gray-600">
                            {booking.startTime} - {booking.endTime}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1 text-[11px] font-bold ${getStatusStyle(
                              booking.bookingStatus
                            )}`}
                          >
                            {booking.bookingStatus}
                          </span>

                          <span className="font-bold text-gray-800">
                            {formatCurrency(booking.amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<CalendarDays size={24} />}
                  text="No bookings found."
                />
              )}
            </SectionCard>
          </div>
        )}

        {/* =================================================
            MEETINGS
        ================================================= */}

        {activeTab === "meetings" && (
          <SectionCard
            title="Meeting History"
            subtitle={`${meetings.length} meeting records`}
            icon={<Video size={19} />}
            iconClass="bg-sky-50 text-sky-600"
          >
            {meetings.length > 0 ? (
              <div className="space-y-3">
                {meetings.map((meeting) => (
                  <div
                    key={meeting._id}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {getFullName(meeting.mentor)}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {meeting.booking?.sessionType || "Mentorship Meeting"}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs text-gray-500">
                          {meeting.booking?.sessionDate
                            ? formatDate(meeting.booking.sessionDate)
                            : "Date unavailable"}
                        </span>

                        <span className="text-xs font-semibold text-gray-600">
                          {meeting.scheduledStartTime}

                          {" - "}

                          {meeting.scheduledEndTime}
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1 text-[11px] font-bold ${getStatusStyle(
                            meeting.status
                          )}`}
                        >
                          {meeting.status}
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1 text-[11px] font-bold ${
                            meeting.studentJoined
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-gray-200 bg-gray-50 text-gray-500"
                          }`}
                        >
                          {meeting.studentJoined ? "Attended" : "Not Joined"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Video size={24} />}
                text="No meeting history found."
              />
            )}
          </SectionCard>
        )}

        {/* =================================================
            EVENTS
        ================================================= */}

        {activeTab === "events" && (
          <SectionCard
            title="Event Registrations"
            subtitle={`${eventRegistrations.length} event registrations`}
            icon={<TicketCheck size={19} />}
            iconClass="bg-fuchsia-50 text-fuchsia-600"
          >
            {eventRegistrations.length > 0 ? (
              <div className="space-y-3">
                {eventRegistrations.map((registration) => (
                  <div
                    key={registration._id}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {registration.event?.title || "Event"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Speaker:{" "}
                          {registration.event?.speaker || "Not specified"}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs text-gray-500">
                          Registered {formatDate(registration.registeredAt)}
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1 text-[11px] font-bold ${getStatusStyle(
                            registration.status
                          )}`}
                        >
                          {registration.status}
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1 text-[11px] font-bold ${
                            registration.attended
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-gray-200 bg-gray-50 text-gray-500"
                          }`}
                        >
                          {registration.attended ? "Attended" : "Not Attended"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<TicketCheck size={24} />}
                text="No event registrations found."
              />
            )}
          </SectionCard>
        )}

        {/* =================================================
            REVIEWS
        ================================================= */}

        {activeTab === "reviews" && (
          <SectionCard
            title="Student Reviews"
            subtitle={`${reviews.length} reviews submitted`}
            icon={<Heart size={19} />}
            iconClass="bg-rose-50 text-rose-600"
          >
            {reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {getFullName(review.mentorId)}
                        </p>

                        <div className="mt-1 flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={
                                star <= review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}

                          <span className="ml-1 text-xs font-bold text-gray-600">
                            {review.rating}/5
                          </span>
                        </div>
                      </div>

                      <span className="text-xs text-gray-400">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    {review.review && (
                      <p className="mt-3 rounded-xl bg-white p-3 text-sm leading-6 text-gray-600">
                        "{review.review}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Heart size={24} />}
                text="No reviews submitted by this student."
              />
            )}
          </SectionCard>
        )}

        {/* =================================================
            RESCHEDULES
        ================================================= */}

        {activeTab === "reschedules" && (
          <SectionCard
            title="Reschedule Requests"
            subtitle={`${rescheduleRequests.length} reschedule requests`}
            icon={<RotateCcw size={19} />}
            iconClass="bg-orange-50 text-orange-600"
          >
            {rescheduleRequests.length > 0 ? (
              <div className="space-y-3">
                {rescheduleRequests.map((request) => (
                  <div
                    key={request._id}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {getFullName(request.mentor)}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {request.booking?.sessionType ||
                              "Mentorship Session"}
                          </p>
                        </div>

                        <span
                          className={`w-fit rounded-full border px-3 py-1 text-[11px] font-bold ${getStatusStyle(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-red-100 bg-red-50 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-red-400">
                            Original Schedule
                          </p>

                          <p className="mt-2 text-sm font-bold text-gray-700">
                            {formatDate(request.originalSessionDate)}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {request.originalStartTime}

                            {" - "}

                            {request.originalEndTime}
                          </p>
                        </div>

                        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-500">
                            Requested Schedule
                          </p>

                          <p className="mt-2 text-sm font-bold text-gray-700">
                            {formatDate(request.requestedSessionDate)}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {request.requestedStartTime}

                            {" - "}

                            {request.requestedEndTime}
                          </p>
                        </div>
                      </div>

                      {request.reason && (
                        <div className="rounded-xl bg-white p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                            Reason
                          </p>

                          <p className="mt-1 text-sm text-gray-600">
                            {request.reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<RotateCcw size={24} />}
                text="No reschedule requests found."
              />
            )}
          </SectionCard>
        )}
      </main>
    </div>
  );
};

// =====================================================
// HEADER STAT
// =====================================================

const HeaderStat = ({ value, label }) => {
  return (
    <div className="min-w-[82px] rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center backdrop-blur-md">
      <p className="text-lg font-bold text-white">{value}</p>

      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-200">
        {label}
      </p>
    </div>
  );
};

// =====================================================
// TAB BUTTON
// =====================================================

const TabButton = ({ active, onClick, icon, label, count }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
      }`}
    >
      {icon}

      {label}

      {count !== undefined && (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] ${
            active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({ icon, label, value, iconClass }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <p className="mt-3 text-xs font-medium text-gray-400">{label}</p>

      <p className="mt-1 truncate text-lg font-bold text-gray-900">{value}</p>
    </div>
  );
};

// =====================================================
// SECTION CARD
// =====================================================

const SectionCard = ({
  title,
  subtitle,
  icon,
  iconClass,
  children,
  rightContent,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
          >
            {icon}
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-900">{title}</h2>

            {subtitle && (
              <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
            )}
          </div>
        </div>

        {rightContent}
      </div>

      <div className="p-5">{children}</div>
    </div>
  );
};

// =====================================================
// INFO ITEM
// =====================================================

const InfoItem = ({ label, value, icon }) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
      <div className="flex items-center gap-2 text-gray-400">
        {icon}

        <span className="text-[10px] font-bold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-2 break-words text-sm font-semibold text-gray-800">
        {value || "Not provided"}
      </p>
    </div>
  );
};

// =====================================================
// MINI STAT
// =====================================================

const MiniStat = ({ label, value, icon }) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">{label}</span>

        <span className="text-violet-500">{icon}</span>
      </div>

      <p className="mt-2 text-lg font-bold text-gray-900">{value}</p>
    </div>
  );
};

// =====================================================
// EMPTY STATE
// =====================================================

const EmptyState = ({ icon, text }) => {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gray-300 shadow-sm">
        {icon}
      </div>

      <p className="mt-3 text-sm font-medium text-gray-500">{text}</p>
    </div>
  );
};

export default StudentDetails;
