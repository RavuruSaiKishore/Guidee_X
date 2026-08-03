import { useEffect, useMemo, useState } from "react";
import {
  Mail,
  Phone,
  Edit3,
  Save,
  X,
  Camera,
  User,
  ShieldCheck,
  Calendar,
  Award,
  BookOpen,
  Star,
  CheckCircle2,
  TrendingUp,
  GraduationCap,
  LockKeyhole,
  ChevronRight,
  Loader2,
  AlertCircle,
  Ban,
  Clock3,
  Flame,
  Medal,
  Trophy,
  Crown,
  Sparkles,
  Lock,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const badgeStyles = {
  "First Step": {
    icon: Medal,
    gradient: "from-emerald-500 via-green-500 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },

  "Consistent Learner": {
    icon: Award,
    gradient: "from-sky-500 via-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },

  "Dedicated Learner": {
    icon: Trophy,
    gradient: "from-yellow-400 via-orange-500 to-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },

  "Knowledge Explorer": {
    icon: Star,
    gradient: "from-fuchsia-500 via-purple-500 to-violet-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },

  "Mentorship Champion": {
    icon: Crown,
    gradient: "from-indigo-600 via-violet-600 to-purple-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
};

const Profile = () => {
  const { fetchUser } = useAuth();

  // =========================================================
  // PROFILE STATE
  // =========================================================

  const [profile, setProfile] = useState(null);

  // =========================================================
  // PROFILE STATS STATE
  // Comes from:
  // GET /api/user/profile/stats
  // =========================================================

  const [stats, setStats] = useState({
    completedSessions: 0,
    upcomingSessions: 0,
    totalBookings: 0,
    cancelledSessions: 0,
    totalReviews: 0,
    averageRating: 0,
    xp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    badges: 0,
  });

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [statsError, setStatsError] = useState("");

  // =========================================================
  // EDIT FORM
  // =========================================================

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    profileImage: "",
    education: "",
    careerGoal: "",
  });

  // =========================================================
  // TOKEN
  // =========================================================

  const getToken = () => {
    return localStorage.getItem("UserToken");
  };

  // =========================================================
  // PROFILE IMAGE URL
  // =========================================================

  const getProfileImageUrl = (image, name) => {
    if (!image) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name || "Student"
      )}&background=4f46e5&color=fff&size=300`;
    }

    if (image instanceof File) {
      return URL.createObjectURL(image);
    }

    if (
      typeof image === "string" &&
      (image.startsWith("http://") || image.startsWith("https://"))
    ) {
      return image;
    }

    return `${API_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
  };

  // =========================================================
  // FETCH PROFILE
  // GET /api/user/profile
  // =========================================================

  const fetchProfile = async () => {
    const token = getToken();

    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Profile Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to fetch profile information.");
      }

      const userData = data.profile || data.user;

      if (!userData) {
        throw new Error("Profile information not found.");
      }

      // Update profile state
      setProfile(userData);

      // Update edit form
      setForm({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phone: userData.phone || "",
        education: userData.education || "",
        careerGoal: userData.careerGoal || "",
        profileImage: userData.profileImage || "",
      });
    } catch (error) {
      console.error("Profile fetch error:", error);

      setError(error.message || "Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH PROFILE STATS
  // GET /api/user/profile/stats
  // =========================================================

  const fetchProfileStats = async () => {
    const token = getToken();

    if (!token) {
      setStatsError("Authentication token not found.");
      setStatsLoading(false);
      return;
    }

    try {
      setStatsLoading(true);
      setStatsError("");

      const response = await fetch(`${API_BASE_URL}/api/user/profile/stats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Profile Stats Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to fetch profile statistics.");
      }

      const backendStats = data.stats || {};

      setStats({
        completedSessions: backendStats.completedSessions || 0,
        upcomingSessions: backendStats.upcomingSessions || 0,
        totalBookings: backendStats.totalBookings || 0,
        cancelledSessions: backendStats.cancelledSessions || 0,
        totalReviews: backendStats.totalReviews || 0,
        averageRating: backendStats.averageRating || 0,
        xp: backendStats.xp || 0,
        level: backendStats.level || 1,
        currentStreak: backendStats.currentStreak || 0,
        longestStreak: backendStats.longestStreak || 0,
        badges: backendStats.badges || 0,
      });
    } catch (error) {
      console.error("Profile stats fetch error:", error);

      setStatsError(error.message || "Unable to load your profile statistics.");
    } finally {
      setStatsLoading(false);
    }
  };

  // =========================================================
  // INITIAL DATA FETCH
  // Fetch profile and stats independently
  // =========================================================

  useEffect(() => {
    const loadProfileData = async () => {
      await Promise.all([fetchProfile(), fetchProfileStats()]);
    };

    loadProfileData();
  }, []);

  // =========================================================
  // HANDLE FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // HANDLE PROFILE IMAGE
  // =========================================================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile image must be under 5MB.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      profileImage: file,
    }));
  };

  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const handleCancel = () => {
    setEdit(false);

    setForm({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      phone: profile?.phone || "",
      education: profile?.education || "",
      careerGoal: profile?.careerGoal || "",
      profileImage: profile?.profileImage || "",
    });
  };

  // =========================================================
  // SAVE PROFILE
  //
  // IMPORTANT:
  // No fetchProfile()
  // No fetchProfileStats()
  //
  // We update local state directly from PUT response.
  // =========================================================

  const handleSave = async () => {
    const token = getToken();

    if (!token) {
      toast.error("Authentication required.");
      return;
    }

    if (!form.firstName.trim()) {
      toast.error("First name is required.");
      return;
    }

    if (!form.lastName.trim()) {
      toast.error("Last name is required.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("firstName", form.firstName.trim());
      formData.append("lastName", form.lastName.trim());
      formData.append("phone", form.phone.trim());
      formData.append("education", form.education.trim());
      formData.append("careerGoal", form.careerGoal.trim());

      if (form.profileImage instanceof File) {
        formData.append("profileImage", form.profileImage);
      }

      const response = await fetch(`${API_BASE_URL}/api/user/updateProfile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      console.log("Updated Profile Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update profile.");
      }

      // =====================================================
      // UPDATED USER
      // =====================================================

      const updatedUser = data.profile || data.user;

      if (!updatedUser) {
        throw new Error("Updated profile data not returned by server.");
      }

      // =====================================================
      // UPDATE PROFILE STATE
      // =====================================================

      setProfile(updatedUser);

      // =====================================================
      // UPDATE FORM STATE
      // =====================================================

      setForm({
        firstName: updatedUser.firstName || "",
        lastName: updatedUser.lastName || "",
        phone: updatedUser.phone || "",
        education: updatedUser.education || "",
        careerGoal: updatedUser.careerGoal || "",
        profileImage: updatedUser.profileImage || "",
      });

      // =====================================================
      // CLOSE EDIT MODE
      // =====================================================

      setEdit(false);

      // =====================================================
      // UPDATE AUTH CONTEXT
      // =====================================================

      await fetchUser();

      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(error.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // PROFILE COMPLETION
  // =========================================================

  const profileCompletion = useMemo(() => {
    if (!profile) return 0;

    if (typeof profile.profileCompletion === "number") {
      return profile.profileCompletion;
    }

    const fields = [
      profile.firstName,
      profile.lastName,
      profile.email,
      profile.phone,
      profile.profileImage,
    ];

    const completed = fields.filter(Boolean).length;

    return Math.round((completed / fields.length) * 100);
  }, [profile]);

  // =========================================================
  // PROFILE IMAGE
  // =========================================================

  const profileImage = getProfileImageUrl(
    form.profileImage,
    `${form.firstName} ${form.lastName}`
  );

  // =========================================================
  // ACCOUNT STATUS
  // =========================================================

  const accountStatus = profile?.isBlocked
    ? "Blocked"
    : profile?.isActive
    ? "Active"
    : "Inactive";

  // =========================================================
  // LAST LOGIN
  // =========================================================

  const lastLogin = profile?.lastLogin
    ? new Date(profile.lastLogin).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not Available";

  // =========================================================
  // MEMBER SINCE
  // =========================================================

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not Available";

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg">
            <Loader2 size={30} className="animate-spin text-white" />
          </div>

          <h2 className="mt-6 text-xl font-bold text-slate-800">
            Loading Your Profile
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Fetching your latest account information...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR SCREEN
  // =========================================================

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <AlertCircle size={32} />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-slate-800">
            Unable to Load Profile
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            {error || "Profile information was not found."}
          </p>

          <button
            onClick={() => {
              fetchProfile();
              fetchProfileStats();
            }}
            className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 mt-12 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="mx-auto max-w-6xl space-y-7">
        {/* ================================================= */}
        {/* PAGE HEADER */}
        {/* ================================================= */}

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Manage your personal information, track your learning activity, and
            view your GuideX journey.
          </p>
        </div>

        {/* ================================================= */}
        {/* PROFILE HERO */}
        {/* ================================================= */}

        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-700 via-blue-700 to-violet-700 shadow-xl">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              {/* PROFILE INFORMATION */}

              <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                <div className="relative group">
                  <input
                    id="profileUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <img
                    src={profileImage}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="h-28 w-28 rounded-3xl border-4 border-white/80 object-cover shadow-2xl sm:h-32 sm:w-32"
                  />

                  {edit && (
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("profileUpload")?.click()
                      }
                      className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/50 text-white opacity-0 transition group-hover:opacity-100"
                    >
                      <Camera size={28} />
                    </button>
                  )}

                  <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border-4 border-white bg-emerald-500 text-white shadow-lg">
                    <CheckCircle2 size={18} />
                  </div>
                </div>

                <div className="text-center text-white sm:text-left">
                  <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                    <h2 className="text-2xl font-black sm:text-3xl">
                      {profile.firstName} {profile.lastName}
                    </h2>

                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold capitalize backdrop-blur">
                      {profile.role || "Student"}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap justify-center gap-4 text-sm text-blue-100 sm:justify-start">
                    <span className="flex items-center gap-2">
                      <Mail size={16} />
                      {profile.email}
                    </span>

                    {profile.phone && (
                      <span className="flex items-center gap-2">
                        <Phone size={16} />
                        {profile.phone}
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
                    <span
                      className={`rounded-full px-4 py-2 text-xs font-bold text-white ${
                        profile.isBlocked
                          ? "bg-red-500/90"
                          : profile.isActive
                          ? "bg-emerald-500/90"
                          : "bg-slate-500/90"
                      }`}
                    >
                      {accountStatus}
                    </span>

                    <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur">
                      {profileCompletion}% Complete
                    </span>

                    {profile.isVerified && (
                      <span className="rounded-full bg-blue-500/80 px-4 py-2 text-xs font-bold text-white">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ACTIONS */}

              <div className="flex flex-col gap-4">
                {!edit ? (
                  <button
                    onClick={() => setEdit(true)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-bold text-indigo-700 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <Edit3 size={18} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 font-bold text-white shadow-lg transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Save size={18} />
                      )}

                      {saving ? "Saving..." : "Save"}
                    </button>

                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-bold text-slate-700 shadow-lg transition hover:bg-slate-100"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                )}

                {/* COMPLETION */}

                <div className="min-w-[230px]">
                  <div className="mb-2 flex justify-between text-xs font-semibold text-blue-100">
                    <span>Profile Completion</span>

                    <span>{profileCompletion}%</span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-white transition-all duration-700"
                      style={{
                        width: `${profileCompletion}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* STATISTICS */}
        {/* ================================================= */}

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            title="Completed"
            value={stats.completedSessions}
            subtitle="Sessions completed"
            icon={CheckCircle2}
            iconStyle="bg-emerald-50 text-emerald-600"
            loading={statsLoading}
          />

          <StatCard
            title="Upcoming"
            value={stats.upcomingSessions}
            subtitle="Sessions scheduled"
            icon={Calendar}
            iconStyle="bg-blue-50 text-blue-600"
            loading={statsLoading}
          />

          <StatCard
            title="Bookings"
            value={stats.totalBookings}
            subtitle="Total bookings"
            icon={BookOpen}
            iconStyle="bg-violet-50 text-violet-600"
            loading={statsLoading}
          />

          <StatCard
            title="Reviews"
            value={stats.totalReviews}
            subtitle={`Average ${Number(stats.averageRating || 0).toFixed(
              1
            )} rating`}
            icon={Star}
            iconStyle="bg-amber-50 text-amber-600"
            loading={statsLoading}
          />
        </section>

        {/* ================================================= */}
        {/* MAIN GRID */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* ================================================= */}
          {/* LEFT */}
          {/* ================================================= */}

          <div className="space-y-6 xl:col-span-2">
            {/* PERSONAL INFORMATION */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                icon={User}
                title="Personal Information"
                description="Manage your personal details and contact information."
                iconStyle="bg-indigo-50 text-indigo-600"
              />

              <div className="grid gap-5 md:grid-cols-2">
                {/* FIRST NAME */}

                <ProfileInput
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  disabled={!edit}
                />

                {/* LAST NAME */}

                <ProfileInput
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  disabled={!edit}
                />

                {/* PHONE */}

                <ProfileInput
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={!edit}
                  icon={Phone}
                />

                {/* EMAIL */}

                <ProfileInput
                  label="Email Address"
                  value={profile.email}
                  disabled
                  icon={Mail}
                />

                {/* EDUCATION */}

                <ProfileInput
                  label="Education"
                  name="education"
                  value={form.education}
                  onChange={handleChange}
                  disabled={!edit}
                  icon={GraduationCap}
                  placeholder="Enter your education"
                />

                {/* CAREER GOAL */}

                <ProfileInput
                  label="Career Goal"
                  name="careerGoal"
                  value={form.careerGoal}
                  onChange={handleChange}
                  disabled={!edit}
                  icon={TrendingUp}
                  placeholder="Enter your career goal"
                />
              </div>
            </section>

            {/* ACCOUNT INFORMATION */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                icon={ShieldCheck}
                title="Account Information"
                description="Your GuideX account and membership information."
                iconStyle="bg-blue-50 text-blue-600"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard
                  icon={Mail}
                  title="Email Address"
                  value={profile.email}
                />

                <InfoCard
                  icon={User}
                  title="Account Type"
                  value={profile.role || "Student"}
                  capitalize
                />

                <InfoCard
                  icon={Calendar}
                  title="Member Since"
                  value={memberSince}
                />

                <InfoCard icon={Clock3} title="Last Login" value={lastLogin} />

                <InfoCard
                  icon={profile.isBlocked ? Ban : ShieldCheck}
                  title="Account Status"
                  value={accountStatus}
                  success={profile.isActive && !profile.isBlocked}
                />

                <InfoCard
                  icon={CheckCircle2}
                  title="Verification"
                  value={profile.isVerified ? "Verified" : "Not Verified"}
                  success={profile.isVerified}
                />
              </div>
            </section>

            {/* LEARNING PROGRESS */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                icon={TrendingUp}
                title="Learning Progress"
                description="Track your mentoring and learning journey."
                iconStyle="bg-emerald-50 text-emerald-600"
              />

              {statsError ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                  {statsError}
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <ProgressCard
                    icon={BookOpen}
                    title="Total Bookings"
                    value={stats.totalBookings}
                    description="All mentoring sessions booked"
                  />

                  <ProgressCard
                    icon={CheckCircle2}
                    title="Completed"
                    value={stats.completedSessions}
                    description="Sessions completed"
                  />

                  <ProgressCard
                    icon={Star}
                    title="Reviews Given"
                    value={stats.totalReviews}
                    description={`Average rating ${Number(
                      stats.averageRating || 0
                    ).toFixed(1)}`}
                  />

                  <ProgressCard
                    icon={X}
                    title="Cancelled"
                    value={stats.cancelledSessions}
                    description="Cancelled bookings"
                  />
                </div>
              )}

              <div className="mt-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
                <div className="flex items-center justify-between gap-5">
                  <div>
                    <p className="text-sm font-medium text-blue-100">
                      Your Learning Journey
                    </p>

                    <h3 className="mt-2 text-2xl font-black">
                      Keep Growing 🚀
                    </h3>

                    <p className="mt-2 max-w-lg text-sm text-blue-100">
                      Continue attending mentoring sessions, learning new
                      skills, and building your professional network.
                    </p>
                  </div>

                  <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:flex">
                    <GraduationCap size={32} />
                  </div>
                </div>
              </div>
            </section>

            {/* LEARNING ACHIEVEMENTS */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                icon={Award}
                title="Learning Achievements"
                description="Your progress and learning milestones."
                iconStyle="bg-amber-50 text-amber-600"
              />

              <div className="space-y-3">
                <AchievementItem
                  icon={TrendingUp}
                  title="Experience Points"
                  value={stats.xp}
                />

                <AchievementItem
                  icon={GraduationCap}
                  title="Learning Level"
                  value={stats.level}
                />

                <AchievementItem
                  icon={Flame}
                  title="Current Streak"
                  value={`${stats.currentStreak} days`}
                />

                <AchievementItem
                  icon={Award}
                  title="Longest Streak"
                  value={`${stats.longestStreak} days`}
                />

                <AchievementItem
                  icon={Award}
                  title="Badges Earned"
                  value={stats.badges}
                />

                <AchievementItem
                  icon={Star}
                  title="Reviews Given"
                  value={stats.totalReviews}
                />
              </div>
            </section>

            {/* ================================================= */}
            {/* BADGES */}
            {/* ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                icon={Award}
                title="My Badges"
                description="Achievements unlocked during your learning journey."
                iconStyle="bg-indigo-50 text-indigo-600"
              />

              {profile.badges?.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {profile.badges.map((badge) => {
                    const style = badgeStyles[badge.title] || {
                      icon: Award,
                      gradient: "from-indigo-500 via-blue-500 to-violet-600",
                      bg: "bg-indigo-50",
                      border: "border-indigo-200",
                    };

                    const BadgeIcon = style.icon;

                    return (
                      <div
                        key={badge._id || badge.id || badge.title}
                        className={`group relative overflow-hidden rounded-2xl border ${style.border} ${style.bg} p-5 text-center transition hover:-translate-y-1 hover:shadow-lg`}
                      >
                        {/* Badge Icon */}

                        <div
                          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${style.gradient} shadow-lg transition duration-300 group-hover:scale-110`}
                        >
                          <BadgeIcon size={30} className="text-white" />
                        </div>

                        {/* Badge Title */}

                        <h3 className="mt-4 text-sm font-black text-slate-800">
                          {badge.title}
                        </h3>

                        {/* Badge Description */}

                        {badge.description && (
                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {badge.description}
                          </p>
                        )}

                        {/* Unlocked Status */}

                        <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                          <CheckCircle2 size={12} />
                          Unlocked
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm">
                    <Award size={32} />
                  </div>

                  <p className="mt-4 text-sm font-bold text-slate-600">
                    No badges earned yet.
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Complete mentoring sessions to unlock your first
                    achievement.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* ================================================= */}
          {/* RIGHT SIDEBAR */}
          {/* ================================================= */}

          <aside className="space-y-6">
            {/* QUICK PROFILE */}

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white">
                <div className="flex items-center gap-4">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-16 w-16 rounded-2xl border-2 border-white/50 object-cover"
                  />

                  <div>
                    <h3 className="text-xl font-black">{profile.firstName}</h3>

                    <p className="mt-1 text-sm capitalize text-indigo-100">
                      {profile.role || "Student"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    Profile Completion
                  </span>

                  <span className="text-sm font-black text-indigo-600">
                    {profileCompletion}%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-700"
                    style={{
                      width: `${profileCompletion}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  Complete your profile to improve your GuideX experience.
                </p>
              </div>
            </section>

            {/* CONTACT */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                icon={Phone}
                title="Contact Details"
                description="Your registered contact information."
                iconStyle="bg-emerald-50 text-emerald-600"
              />

              <div className="space-y-4">
                <ContactItem icon={Mail} label="Email" value={profile.email} />

                <ContactItem
                  icon={Phone}
                  label="Phone"
                  value={profile.phone || "Not Added"}
                />
              </div>
            </section>

            {/* ACHIEVEMENTS */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                icon={Award}
                title="Achievements"
                description="Your learning milestones."
                iconStyle="bg-amber-50 text-amber-600"
              />

              <div className="space-y-3">
                <AchievementItem
                  icon={CheckCircle2}
                  title="Sessions Completed"
                  value={stats.completedSessions}
                />

                <AchievementItem
                  icon={Award}
                  title="Badges Earned"
                  value={stats.badges}
                />

                <AchievementItem
                  icon={TrendingUp}
                  title="Current XP"
                  value={stats.xp}
                />

                <AchievementItem
                  icon={GraduationCap}
                  title="Learning Level"
                  value={stats.level}
                />

                <AchievementItem
                  icon={Flame}
                  title="Current Streak"
                  value={`${stats.currentStreak} days`}
                />
              </div>
            </section>

            {/* SECURITY */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <LockKeyhole size={22} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-800">Security</h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Protect your account.
                  </p>
                </div>
              </div>

              <button className="mt-5 flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600">
                <span>Manage Security</span>

                <ChevronRight size={18} />
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

// =========================================================
// STAT CARD
// =========================================================

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconStyle,
  loading,
}) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            {title}
          </p>

          {loading ? (
            <div className="mt-3 h-9 w-16 animate-pulse rounded-lg bg-slate-100" />
          ) : (
            <h3 className="mt-2 text-3xl font-black text-slate-900">{value}</h3>
          )}

          <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
};

// =========================================================
// SECTION HEADER
// =========================================================

const SectionHeader = ({ icon: Icon, title, description, iconStyle }) => {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
      >
        <Icon size={21} />
      </div>

      <div>
        <h2 className="text-xl font-black text-slate-900">{title}</h2>

        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
};

// =========================================================
// PROFILE INPUT
// =========================================================

const ProfileInput = ({
  label,
  name,
  value,
  onChange,
  disabled,
  icon: Icon,
  placeholder,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-600">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}

        <input
          name={name}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition ${
            Icon ? "pl-11" : ""
          } ${
            disabled
              ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-500"
              : "border-indigo-200 bg-white text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
          }`}
        />
      </div>
    </div>
  );
};

// =========================================================
// INFO CARD
// =========================================================

const InfoCard = ({ icon: Icon, title, value, capitalize, success }) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
        <Icon size={20} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">{title}</p>

        <p
          className={`mt-1 truncate text-sm font-bold ${
            success ? "text-emerald-600" : "text-slate-800"
          } ${capitalize ? "capitalize" : ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

// =========================================================
// PROGRESS CARD
// =========================================================

const ProgressCard = ({ icon: Icon, title, value, description }) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
        <Icon size={20} />
      </div>

      <h3 className="mt-4 text-2xl font-black text-slate-900">{value}</h3>

      <p className="mt-1 text-sm font-bold text-slate-700">{title}</p>

      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </div>
  );
};

// =========================================================
// CONTACT ITEM
// =========================================================

const ContactItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>

        <p className="mt-1 break-all text-sm font-semibold text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
};

// =========================================================
// ACHIEVEMENT ITEM
// =========================================================

const AchievementItem = ({ icon: Icon, title, value }) => {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon size={18} />
        </div>

        <span className="text-sm font-semibold text-slate-700">{title}</span>
      </div>

      <span className="font-black text-slate-900">{value}</span>
    </div>
  );
};

export default Profile;
