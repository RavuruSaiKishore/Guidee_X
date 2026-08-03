import { useEffect, useState } from "react";
import {
  UserCircle,
  Mail,
  Phone,
  ShieldCheck,
  BadgeCheck,
  Calendar,
  Clock,
  KeyRound,
  Camera,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const AdminProfile = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { fetchUser } = useAuth();

  // =========================
  // STATE
  // =========================

  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({});
  const [recentLogs, setRecentLogs] = useState([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profileImage: null,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // =========================
  // FETCH PROFILE
  // =========================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("AdminToken");

      if (!token) {
        throw new Error("Admin authentication token not found");
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch admin profile");
      }

      setAdmin(data.admin);
      setStats(data.stats || {});
      setRecentLogs(data.recentLogs || []);
    } catch (error) {
      console.error("Fetch admin profile error:", error);
      toast.error(error.message || "Failed to load admin profile");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // =========================
  // PROFILE UPDATE
  // =========================

  const handleUpdateProfile = async () => {
    if (!profileData.firstName.trim()) {
      toast.error("First name is required");
      return;
    }

    if (!profileData.lastName.trim()) {
      toast.error("Last name is required");
      return;
    }

    if (!profileData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setUpdatingProfile(true);

      const token = localStorage.getItem("AdminToken");

      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const formData = new FormData();

      formData.append("firstName", profileData.firstName.trim());
      formData.append("lastName", profileData.lastName.trim());
      formData.append("email", profileData.email.trim());
      formData.append("phone", profileData.phone.trim());

      if (profileData.profileImage instanceof File) {
        formData.append("profileImage", profileData.profileImage);
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/updateprofile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully");

      setShowEditModal(false);

      setProfileData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        profileImage: null,
      });

      await fetchProfile();

      // Refresh AuthContext / Sidebar
      await fetchUser();
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  // =========================
  // CHANGE PASSWORD
  // =========================

  const handleChangePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("All fields are required");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error("New password must be different from the current password");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+^()_\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!passwordRegex.test(passwordData.newPassword)) {
      toast.error(
        "Password must contain uppercase, lowercase, number and special character"
      );
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setChangingPassword(true);

      const token = localStorage.getItem("AdminToken");

      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/admin/change-password`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to change password");
      }

      toast.success("Password changed successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      setShowPasswordModal(false);
    } catch (error) {
      console.error("Change password error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setChangingPassword(false);
    }
  };

  // =========================
  // OPEN EDIT PROFILE
  // =========================

  const openEditProfile = () => {
    setProfileData({
      firstName: admin?.firstName || "",
      lastName: admin?.lastName || "",
      email: admin?.email || "",
      phone: admin?.phone || "",
      profileImage: null,
    });

    setShowEditModal(true);
  };

  // =========================
  // CLOSE PASSWORD MODAL
  // =========================

  const closePasswordModal = () => {
    if (changingPassword) return;

    setShowPasswordModal(false);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="w-full p-3 sm:p-4 lg:p-6 xl:p-8">
        <div className="animate-pulse space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="h-8 w-48 sm:w-64 rounded-lg bg-gray-200"></div>
            <div className="h-4 w-64 sm:w-96 rounded bg-gray-200"></div>
          </div>

          {/* Profile */}
          <div className="h-72 sm:h-64 rounded-2xl sm:rounded-3xl bg-gray-200"></div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 sm:h-36 rounded-2xl bg-gray-200"
              ></div>
            ))}
          </div>

          {/* Security */}
          <div className="h-80 rounded-2xl sm:rounded-3xl bg-gray-200"></div>

          {/* Activity */}
          <div className="h-72 rounded-2xl sm:rounded-3xl bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 p-3 sm:p-4 lg:p-6 xl:p-8 space-y-6 sm:space-y-8">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Admin Profile
        </h1>

        <p className="text-sm sm:text-base text-gray-500">
          Manage your account settings and security.
        </p>
      </div>

      {/* =====================================================
          PROFILE CARD
      ====================================================== */}

      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Profile Header */}

        <div className="relative px-4 sm:px-6 py-5 sm:py-6 bg-white border-b border-gray-100">
          {/* Accent Bar */}

          <div className="absolute left-0 top-0 h-full w-1.5 sm:w-2 bg-gradient-to-b from-indigo-500 via-sky-500 to-cyan-400"></div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 pl-2">
            {/* Profile Image */}

            <div className="shrink-0">
              {admin?.profileImage ? (
                <img
                  src={`${API_BASE_URL}${admin.profileImage}`}
                  alt="Admin Profile"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-sm">
                  {admin?.firstName?.charAt(0).toUpperCase()}
                  {admin?.lastName?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Admin Details */}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 break-words">
                  {admin?.firstName} {admin?.lastName}
                </h2>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                  <BadgeCheck size={14} />
                  Active
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-gray-500">
                <span>System Administrator</span>

                <span className="hidden sm:block w-1 h-1 rounded-full bg-gray-300"></span>

                <span>
                  Since{" "}
                  {admin?.createdAt
                    ? new Date(admin.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {/* Email */}

            <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-blue-50 border border-blue-100 min-w-0">
              <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Mail className="text-blue-600" size={22} />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-gray-500">Email Address</p>

                <p className="font-semibold text-gray-800 break-all">
                  {admin?.email || "Not Available"}
                </p>
              </div>
            </div>

            {/* Phone */}

            <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-100 min-w-0">
              <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Phone className="text-emerald-600" size={22} />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-gray-500">Phone Number</p>

                <p className="font-semibold text-gray-800 break-words">
                  {admin?.phone || "Not Available"}
                </p>
              </div>
            </div>

            {/* Role */}

            <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-violet-50 border border-violet-100">
              <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                <ShieldCheck className="text-violet-600" size={22} />
              </div>

              <div>
                <p className="text-sm text-gray-500">Role</p>

                <p className="font-semibold text-gray-800">Administrator</p>
              </div>
            </div>

            {/* Last Login */}

            <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-100">
              <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="text-amber-600" size={22} />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-gray-500">Last Login</p>

                <p className="font-semibold text-gray-800 break-words">
                  {formatDate(admin?.lastLogin)}
                </p>
              </div>
            </div>

            {/* Joined */}

            <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-pink-50 border border-pink-100 lg:col-span-2">
              <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                <Calendar className="text-pink-600" size={22} />
              </div>

              <div>
                <p className="text-sm text-gray-500">Joined On</p>

                <p className="font-semibold text-gray-800">
                  {formatDate(admin?.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          DASHBOARD STATISTICS
      ====================================================== */}

      <div>
        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Dashboard Statistics
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            A quick overview of your platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {/* Students */}

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl sm:rounded-3xl text-white shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-blue-100 text-xs sm:text-sm">
                  Total Students
                </p>

                <h3 className="text-3xl sm:text-4xl font-bold mt-2 sm:mt-3">
                  {stats?.totalStudents ?? 0}
                </h3>
              </div>

              <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/20 flex items-center justify-center text-2xl sm:text-3xl">
                👨‍🎓
              </div>
            </div>
          </div>

          {/* Mentors */}

          <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl sm:rounded-3xl text-white shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-green-100 text-xs sm:text-sm">
                  Total Mentors
                </p>

                <h3 className="text-3xl sm:text-4xl font-bold mt-2 sm:mt-3">
                  {stats?.totalMentors ?? 0}
                </h3>
              </div>

              <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/20 flex items-center justify-center text-2xl sm:text-3xl">
                👨‍🏫
              </div>
            </div>
          </div>

          {/* Bookings */}

          <div className="bg-gradient-to-r from-violet-500 to-indigo-600 rounded-2xl sm:rounded-3xl text-white shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-violet-100 text-xs sm:text-sm">
                  Total Bookings
                </p>

                <h3 className="text-3xl sm:text-4xl font-bold mt-2 sm:mt-3">
                  {stats?.totalBookings ?? 0}
                </h3>
              </div>

              <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/20 flex items-center justify-center text-2xl sm:text-3xl">
                📅
              </div>
            </div>
          </div>

          {/* Revenue */}

          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl sm:rounded-3xl text-white shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-orange-100 text-xs sm:text-sm">
                  Total Revenue
                </p>

                <h3 className="text-3xl sm:text-4xl font-bold mt-2 sm:mt-3 break-words">
                  ₹
                  {stats?.totalRevenue
                    ? Number(stats.totalRevenue).toLocaleString("en-IN")
                    : 0}
                </h3>
              </div>

              <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/20 flex items-center justify-center text-2xl sm:text-3xl">
                💰
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          SECURITY SECTION
      ====================================================== */}

      <div className="bg-white rounded-2xl sm:rounded-3xl border shadow-sm p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-100 flex items-center justify-center">
            <ShieldCheck className="text-amber-600" size={24} />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Security
            </h2>

            <p className="text-gray-500 text-sm">
              Keep your account secure and up to date.
            </p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {/* Change Password */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 rounded-2xl border hover:border-amber-300 transition">
            <div className="flex items-center gap-4 min-w-0">
              <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <KeyRound className="text-amber-600" size={22} />
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-gray-800">Change Password</h3>

                <p className="text-sm text-gray-500">
                  Update your account password.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium transition"
            >
              Change
            </button>
          </div>

          {/* Update Profile */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 rounded-2xl border hover:border-indigo-300 transition">
            <div className="flex items-center gap-4 min-w-0">
              <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                <UserCircle className="text-indigo-600" size={22} />
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-gray-800">Update Profile</h3>

                <p className="text-sm text-gray-500">
                  Edit your personal information.
                </p>
              </div>
            </div>

            <button
              onClick={openEditProfile}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
            >
              Edit
            </button>
          </div>

          {/* Two Factor Authentication */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 rounded-2xl border bg-gray-50">
            <div className="flex items-center gap-4 min-w-0">
              <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gray-200 flex items-center justify-center">
                <ShieldCheck className="text-gray-600" size={22} />
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-gray-700">
                  Two Factor Authentication
                </h3>

                <p className="text-sm text-gray-500">
                  Extra security layer for your account.
                </p>
              </div>
            </div>

            <span className="self-start sm:self-auto px-4 py-2 rounded-full bg-gray-200 text-gray-600 text-sm font-medium">
              Coming Soon
            </span>
          </div>

          {/* Login Sessions */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 rounded-2xl border bg-gray-50">
            <div className="flex items-center gap-4 min-w-0">
              <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gray-200 flex items-center justify-center">
                <Clock className="text-gray-600" size={22} />
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-gray-700">Login Sessions</h3>

                <p className="text-sm text-gray-500">
                  View active devices and login history.
                </p>
              </div>
            </div>

            <span className="self-start sm:self-auto px-4 py-2 rounded-full bg-gray-200 text-gray-600 text-sm font-medium">
              Soon
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          RECENT ACTIVITY
      ====================================================== */}

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gray-100 flex items-center justify-center">
            <Clock className="text-gray-700" size={22} />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Recent Activity
            </h2>

            <p className="text-gray-500 text-sm">
              Your latest actions across the admin panel.
            </p>
          </div>
        </div>

        {recentLogs?.length > 0 ? (
          <div className="relative">
            {/* Timeline Line */}

            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div className="space-y-5 sm:space-y-6">
              {recentLogs.slice(0, 2).map((log) => (
                <div key={log._id} className="relative flex gap-3 sm:gap-5">
                  {/* Timeline Dot */}

                  <div className="relative z-10 shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow">
                    <BadgeCheck size={18} className="text-indigo-600" />
                  </div>

                  {/* Activity Card */}

                  <div className="min-w-0 flex-1 rounded-2xl border hover:border-indigo-300 hover:shadow-md transition p-4 sm:p-5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-800 break-words">
                          {log.action}
                        </h3>

                        {log.description && (
                          <p className="text-sm text-gray-500 mt-1 break-words">
                            {log.description}
                          </p>
                        )}
                      </div>

                      <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(log.createdAt)}
                      </div>
                    </div>

                    {(log.targetType || log.targetName) && (
                      <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                        {log.targetType && (
                          <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
                            {log.targetType}
                          </span>
                        )}

                        {log.targetName && (
                          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium break-all">
                            {log.targetName}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 sm:py-16 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-5">
              <Clock className="text-gray-400" size={32} />
            </div>

            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
              No Recent Activity
            </h3>

            <p className="text-gray-500 text-sm sm:text-base mt-2">
              Your recent admin actions will appear here.
            </p>
          </div>
        )}
      </div>

      {/* =====================================================
          EDIT PROFILE MODAL
      ====================================================== */}

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-2xl max-h-[92vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}

            <div className="shrink-0 bg-gradient-to-r from-indigo-600 to-blue-600 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Edit Profile
                </h2>

                <p className="text-indigo-100 text-xs sm:text-sm">
                  Update your personal information
                </p>
              </div>

              <button
                onClick={() => setShowEditModal(false)}
                disabled={updatingProfile}
                className="shrink-0 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white transition flex items-center justify-center disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            {/* Body */}

            <div className="p-4 sm:p-6 overflow-y-auto">
              {/* Profile Image */}

              <div className="flex justify-center mb-6 sm:mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-indigo-100 shadow-lg bg-gray-100">
                    {profileData.profileImage instanceof File ? (
                      <img
                        src={URL.createObjectURL(profileData.profileImage)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : admin?.profileImage ? (
                      <img
                        src={`${API_BASE_URL}${admin.profileImage}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                        {admin?.firstName?.charAt(0).toUpperCase()}
                        {admin?.lastName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Camera Button */}

                  <label
                    htmlFor="profileImage"
                    className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg flex items-center justify-center cursor-pointer transition"
                  >
                    <Camera size={16} />
                  </label>

                  <input
                    id="profileImage"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (!file) return;

                      if (!file.type.startsWith("image/")) {
                        toast.error("Please select a valid image");
                        return;
                      }

                      if (file.size > 5 * 1024 * 1024) {
                        toast.error("Profile image must be less than 5MB");
                        return;
                      }

                      setProfileData((prev) => ({
                        ...prev,
                        profileImage: file,
                      }));
                    }}
                  />
                </div>
              </div>

              {/* Form */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {/* First Name */}

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    First Name
                  </label>

                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    placeholder="Enter first name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>

                {/* Last Name */}

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Last Name
                  </label>

                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    placeholder="Enter last name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>

                {/* Email */}

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="Enter email address"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>

                {/* Phone */}

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="Enter phone number"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}

            <div className="shrink-0 border-t bg-gray-50 px-4 sm:px-6 py-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={updatingProfile}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateProfile}
                disabled={updatingProfile}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {updatingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          CHANGE PASSWORD MODAL
      ====================================================== */}

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-md max-h-[92vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}

            <div className="shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Change Password
                </h2>

                <p className="text-amber-100 text-xs sm:text-sm">
                  Update your account password
                </p>
              </div>

              <button
                onClick={closePasswordModal}
                disabled={changingPassword}
                className="shrink-0 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            {/* Body */}

            <div className="p-4 sm:p-6 space-y-5 overflow-y-auto">
              {/* Current Password */}

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Current Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    placeholder="Enter current password"
                    className="w-full pl-11 pr-11 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  New Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    placeholder="Enter new password"
                    className="w-full pl-11 pr-11 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Minimum 8 characters with uppercase, lowercase, number and
                  special character.
                </p>
              </div>

              {/* Confirm Password */}

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder="Confirm new password"
                    className="w-full pl-11 pr-11 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}

            <div className="shrink-0 border-t bg-gray-50 px-4 sm:px-6 py-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={closePasswordModal}
                disabled={changingPassword}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition font-medium disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {changingPassword ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
