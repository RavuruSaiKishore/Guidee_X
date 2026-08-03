import React, { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  CalendarDays,
  IndianRupee,
  TrendingUp,
  ClipboardCheck,
  BadgeCheck,
  LayoutDashboard,
  Activity,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Headphones,
  Clock3,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  UserRound,
  FileCheck2,
  History,
  Settings2,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    stats: {
      totalUsers: 0,
      totalMentors: 0,
      totalBookings: 0,
      totalRevenue: 0,
      pendingMentorRequests: 0,
      approvedMentors: 0,
      totalRequests: 0,
      pendingRequests: 0,
      inProgressRequests: 0,
      resolvedRequests: 0,
      repliedRequests: 0,
    },
    recentUsers: [],
    recentMentors: [],
    recentBookings: [],
  });

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async () => {
    try {
      const token = localStorage.getItem("AdminToken");

      const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch dashboard");
      }

      setDashboard({
        stats: {
          totalUsers: data.stats?.totalUsers || 0,
          totalMentors: data.stats?.totalMentors || 0,
          totalBookings: data.stats?.totalBookings || 0,
          totalRevenue: data.stats?.totalRevenue || 0,
          pendingMentorRequests: data.stats?.pendingMentorRequests || 0,
          approvedMentors: data.stats?.approvedMentors || 0,
          totalRequests: data.stats?.totalRequests || 0,
          pendingRequests: data.stats?.pendingRequests || 0,
          inProgressRequests: data.stats?.inProgressRequests || 0,
          resolvedRequests: data.stats?.resolvedRequests || 0,
          repliedRequests: data.stats?.repliedRequests || 0,
        },
        recentUsers: data.recentUsers || [],
        recentMentors: data.recentMentors || [],
        recentBookings: data.recentBookings || [],
      });
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Total Users",
      value: dashboard.stats.totalUsers,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      accent: "from-blue-500 to-cyan-500",
      description: "Registered students",
    },
    {
      title: "Total Mentors",
      value: dashboard.stats.totalMentors,
      icon: UserCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      accent: "from-emerald-500 to-teal-500",
      description: "Active mentors",
    },
    {
      title: "Total Bookings",
      value: dashboard.stats.totalBookings,
      icon: CalendarDays,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      accent: "from-violet-500 to-purple-500",
      description: "All sessions",
    },
    {
      title: "Total Revenue",
      value: `₹${Number(dashboard.stats.totalRevenue || 0).toLocaleString(
        "en-IN"
      )}`,
      icon: IndianRupee,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      accent: "from-orange-500 to-amber-500",
      description: "Platform earnings",
    },
    {
      title: "Pending Requests",
      value: dashboard.stats.pendingMentorRequests,
      icon: ClipboardCheck,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      accent: "from-amber-500 to-yellow-500",
      description: "Awaiting approval",
    },
    {
      title: "Approved Mentors",
      value: dashboard.stats.approvedMentors,
      icon: BadgeCheck,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      accent: "from-green-500 to-emerald-500",
      description: "Verified mentors",
    },
  ];

  const supportStats = [
    {
      title: "Total Requests",
      value: dashboard.stats.totalRequests,
      icon: Headphones,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Pending",
      value: dashboard.stats.pendingRequests,
      icon: Clock3,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "In Progress",
      value: dashboard.stats.inProgressRequests,
      icon: Activity,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Resolved",
      value: dashboard.stats.resolvedRequests,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Replied",
      value: dashboard.stats.repliedRequests,
      icon: BadgeCheck,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  const quickActions = [
    {
      title: "Manage Users",
      description: "View and manage students",
      icon: Users,
      color: "blue",
      path: "/admin/users",
    },
    {
      title: "Manage Mentors",
      description: "Manage mentor accounts",
      icon: UserCheck,
      color: "emerald",
      path: "/admin/mentors",
    },
    {
      title: "Mentor Requests",
      description: "Review applications",
      icon: FileCheck2,
      color: "amber",
      path: "/admin/mentor-requests",
    },
    {
      title: "View Bookings",
      description: "Manage all sessions",
      icon: CalendarDays,
      color: "violet",
      path: "/admin/bookings",
    },
    {
      title: "Analytics",
      description: "View platform insights",
      icon: BarChart3,
      color: "orange",
      path: "/admin/analytics",
    },
    {
      title: "Audit Logs",
      description: "Track admin activities",
      icon: History,
      color: "slate",
      path: "/admin/auditslogs",
    },
  ];

  const getActionColor = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        icon: "bg-blue-600",
        text: "text-blue-600",
        hover: "group-hover:bg-blue-700",
      },
      emerald: {
        bg: "bg-emerald-50",
        icon: "bg-emerald-600",
        text: "text-emerald-600",
        hover: "group-hover:bg-emerald-700",
      },
      amber: {
        bg: "bg-amber-50",
        icon: "bg-amber-600",
        text: "text-amber-600",
        hover: "group-hover:bg-amber-700",
      },
      violet: {
        bg: "bg-violet-50",
        icon: "bg-violet-600",
        text: "text-violet-600",
        hover: "group-hover:bg-violet-700",
      },
      orange: {
        bg: "bg-orange-50",
        icon: "bg-orange-600",
        text: "text-orange-600",
        hover: "group-hover:bg-orange-700",
      },
      slate: {
        bg: "bg-slate-100",
        icon: "bg-slate-700",
        text: "text-slate-700",
        hover: "group-hover:bg-slate-800",
      },
    };

    return colors[color];
  };

  const getBookingStatus = (status) => {
    switch (status) {
      case "Completed":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          dot: "bg-emerald-500",
        };

      case "Confirmed":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          dot: "bg-blue-500",
        };

      case "Cancelled":
      case "Rejected":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          dot: "bg-red-500",
        };

      case "Pending":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          dot: "bg-amber-500",
        };

      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          dot: "bg-gray-400",
        };
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex flex-col justify-center items-center z-50">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-emerald-100"></div>

          <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-t-emerald-600 animate-spin"></div>
        </div>

        <p className="mt-6 text-lg font-semibold text-slate-700">
          Loading Admin Dashboard...
        </p>

        <p className="text-sm text-slate-400 mt-1">
          Please wait while we fetch your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700">
      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 shadow-2xl">
          {/* Background Effects */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
              {/* Header Content */}
              <div className="flex items-start gap-5">
                <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 items-center justify-center shadow-xl">
                  <LayoutDashboard className="w-8 h-8 text-white" />
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                      Admin Dashboard
                    </h1>

                    <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/20 text-emerald-300 text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </span>
                  </div>

                  <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                    Manage your GuideX platform, monitor users and mentors,
                    track bookings, review support requests, and keep an eye on
                    overall platform activity.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-6">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 text-sm">
                      <Activity size={15} className="text-emerald-400" />
                      System Active
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 text-sm">
                      <CalendarDays size={15} className="text-blue-400" />
                      {new Date().toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 text-sm">
                      <ShieldCheck size={15} className="text-violet-400" />
                      Platform Healthy
                    </div>
                  </div>
                </div>
              </div>

              {/* Header Mini Stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="min-w-[100px] rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-4 text-center">
                  <p className="text-xs text-slate-400">Users</p>

                  <p className="text-2xl font-bold text-white mt-1">
                    {dashboard.stats.totalUsers}
                  </p>

                  <p className="text-[11px] text-blue-300 mt-1">Registered</p>
                </div>

                <div className="min-w-[100px] rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-4 text-center">
                  <p className="text-xs text-slate-400">Mentors</p>

                  <p className="text-2xl font-bold text-white mt-1">
                    {dashboard.stats.totalMentors}
                  </p>

                  <p className="text-[11px] text-emerald-300 mt-1">Active</p>
                </div>

                <div className="min-w-[100px] rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-4 text-center">
                  <p className="text-xs text-slate-400">Bookings</p>

                  <p className="text-2xl font-bold text-white mt-1">
                    {dashboard.stats.totalBookings}
                  </p>

                  <p className="text-[11px] text-violet-300 mt-1">Sessions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================== */}
        {/* OVERVIEW TITLE */}
        {/* ===================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-10 mb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Platform Overview
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Key metrics and performance indicators
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            Data updated just now
          </div>
        </div>

        {/* ===================================================== */}
        {/* KPI CARDS */}
        {/* ===================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-5">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.accent}`}
                />

                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {item.title}
                    </p>

                    <h3 className="text-2xl font-bold text-slate-900 mt-2">
                      {item.value}
                    </h3>

                    <p className="text-xs text-slate-400 mt-2">
                      {item.description}
                    </p>
                  </div>

                  <div
                    className={`w-11 h-11 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center`}
                  >
                    <Icon size={21} />
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-4 text-xs font-medium text-emerald-600">
                  <TrendingUp size={13} />
                  Platform metric
                </div>
              </div>
            );
          })}
        </div>

        {/* ===================================================== */}
        {/* CONTACT CENTER */}
        {/* ===================================================== */}

        <div className="mt-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <Headphones className="text-blue-600" size={22} />

                <h2 className="text-2xl font-bold text-slate-900">
                  Contact Center
                </h2>
              </div>

              <p className="text-sm text-slate-500 mt-1">
                Monitor and manage student support requests.
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/contact")}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View Support Inbox
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {supportStats.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center mb-4`}
                  >
                    <Icon size={20} />
                  </div>

                  <p className="text-sm text-slate-500">{item.title}</p>

                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================================================== */}
        {/* RECENT USERS & MENTORS */}
        {/* ===================================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">
          {/* Recent Users */}

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-lg text-slate-900">
                  Recent Users
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Latest registered students
                </p>
              </div>

              <button
                onClick={() => navigate("/admin/users")}
                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View All
                <ArrowUpRight size={15} />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {dashboard.recentUsers.length > 0 ? (
                dashboard.recentUsers.slice(0, 4).map((user) => (
                  <div
                    key={user._id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {user.profileImage ? (
                        <img
                          src={
                            user.profileImage.startsWith("http")
                              ? user.profileImage
                              : `${API_BASE_URL}${user.profileImage}`
                          }
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-11 h-11 rounded-full object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {user.firstName?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-800 truncate">
                          {user.firstName} {user.lastName}
                        </h3>

                        <p className="text-xs text-slate-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-medium text-slate-500 capitalize">
                        {user.role}
                      </span>

                      <span
                        className={`text-[11px] font-semibold px-2 py-1 rounded-full ${
                          user.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-14 text-center">
                  <UserRound className="mx-auto text-slate-300" size={35} />

                  <p className="text-sm text-slate-500 mt-3">No users found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Mentors */}

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-lg text-slate-900">
                  Recent Mentors
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Latest approved mentors
                </p>
              </div>

              <button
                onClick={() => navigate("/admin/mentors")}
                className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                View All
                <ArrowUpRight size={15} />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {dashboard.recentMentors.length > 0 ? (
                dashboard.recentMentors.slice(0, 3).map((mentor) => (
                  <div
                    key={mentor._id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {mentor.profileImage ? (
                        <img
                          src={
                            mentor.profileImage.startsWith("http")
                              ? mentor.profileImage
                              : `${API_BASE_URL}/${mentor.profileImage}`
                          }
                          alt={`${mentor.firstName} ${mentor.lastName}`}
                          className="w-11 h-11 rounded-full object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                          {mentor.firstName?.charAt(0)?.toUpperCase() || "M"}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-800 truncate">
                          {mentor.firstName} {mentor.lastName}
                        </h3>

                        <p className="text-xs text-slate-500 truncate">
                          {mentor.profession || "Mentor"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                        ⭐ {mentor.rating || "New"}
                      </div>

                      <p className="text-[11px] text-slate-400 mt-1">Rating</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-14 text-center">
                  <UserCheck className="mx-auto text-slate-300" size={35} />

                  <p className="text-sm text-slate-500 mt-3">
                    No mentors found.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===================================================== */}
        {/* RECENT BOOKINGS */}
        {/* ===================================================== */}

        <div className="mt-10 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-lg text-slate-900">
                Recent Bookings
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Latest mentor session activity
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/bookings")}
              className="flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700"
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Student
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Mentor
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {dashboard.recentBookings.length > 0 ? (
                  dashboard.recentBookings.slice(0, 5).map((booking) => {
                    const statusStyle = getBookingStatus(booking.bookingStatus);

                    return (
                      <tr
                        key={booking._id}
                        className="hover:bg-slate-50 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                              <UserRound size={17} />
                            </div>

                            <div>
                              <p className="font-semibold text-slate-800">
                                {booking.student?.firstName || "Unknown"}{" "}
                                {booking.student?.lastName || ""}
                              </p>

                              <p className="text-xs text-slate-400">Student</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-700">
                            {booking.mentor?.firstName || "Unknown"}{" "}
                            {booking.mentor?.lastName || ""}
                          </p>

                          <p className="text-xs text-slate-400">Mentor</p>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <CalendarDays size={15} />

                            {booking.createdAt
                              ? new Date(booking.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "N/A"}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-800">
                            ₹
                            {Number(booking.amount || 0).toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                            />

                            {booking.bookingStatus || "Unknown"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              navigate(`/admin/bookings/${booking._id}`)
                            }
                            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 inline-flex items-center justify-center transition"
                          >
                            <Eye size={17} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-16 text-center text-slate-500"
                    >
                      <CalendarDays
                        className="mx-auto text-slate-300"
                        size={38}
                      />

                      <p className="mt-3 text-sm">No bookings available.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===================================================== */}
        {/* QUICK ACTIONS */}
        {/* ===================================================== */}

        <div className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>

            <p className="text-sm text-slate-500 mt-1">
              Quickly access frequently used admin tools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const colors = getActionColor(action.color);

              return (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className={`group ${colors.bg} border border-white rounded-2xl p-5 text-left hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-xl ${colors.icon} ${colors.hover} text-white flex items-center justify-center transition`}
                    >
                      <Icon size={22} />
                    </div>

                    <ArrowUpRight
                      size={20}
                      className={`${colors.text} opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition`}
                    />
                  </div>

                  <h3 className="font-bold text-slate-800 mt-5">
                    {action.title}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {action.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================================================== */}
        {/* FOOTER STATUS */}
        {/* ===================================================== */}

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                System Status
              </p>

              <p className="text-xs text-slate-500">
                All core platform services are operational
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Operational
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
