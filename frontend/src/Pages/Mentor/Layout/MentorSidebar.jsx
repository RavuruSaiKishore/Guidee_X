import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarClock,
  CalendarDays,
  BookOpenCheck,
  Clock3,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Inbox,
  Users,
  MessageSquare,
  CalendarX2,
  CalendarCheck2,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const menu = [
  { name: "Dashboard", path: "/mentor", icon: LayoutDashboard, end: true },
  {
    name: "Today's Sessions",
    path: "/mentor/today-sessions",
    icon: CalendarClock,
  },
  {
    name: "Upcoming Sessions",
    path: "/mentor/upcoming-sessions",
    icon: CalendarDays,
  },
  { name: "Bookings", path: "/mentor/bookings", icon: BookOpenCheck },
  { name: "Availability", path: "/mentor/availability", icon: Clock3 },
  { name: "Booking Request", path: "/mentor/BookingRequest", icon: Inbox },
  { name: "Reject Booking", path: "/mentor/RejectBookings", icon: CalendarX2 },
  { name: "Cancel Booking", path: "/mentor/CancelBookings", icon: CalendarX2 },
  {
    name: "Completed Booking",
    path: "/mentor/CompletedBookings",
    icon: CalendarCheck2,
  },
  {
    name: "Reschedule Bookings",
    path: "/mentor/RescheduleBookings",
    icon: RefreshCw,
  },
  {
    name: "My Students",
    path: "/mentor/students",
    icon: Users,
  },
   {
    name: "My Reviews",
    path: "/mentor/reviews",
    icon: MessageSquare,
  },
];

const MentorSidebar = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [notificationCounts, setNotificationCounts] = useState({
    bookingRequest: 0,
    bookingCancelled: 0,
  });

  // =========================================================
  // PROFILE IMAGE
  // =========================================================

  const profileImageUrl = user?.profileImage
    ? user.profileImage.startsWith("http://") ||
      user.profileImage.startsWith("https://")
      ? user.profileImage
      : `${API_BASE_URL}/${user.profileImage}`.replace(/([^:]\/)\/+/g, "$1")
    : null;

  // =========================================================
  // CLOSE MOBILE SIDEBAR
  // =========================================================

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  // =========================================================
  // PROFILE NAVIGATION
  // =========================================================

  const handleProfileClick = () => {
    closeMobileSidebar();

    navigate("/mentor/profile");
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    closeMobileSidebar();

    logout();

    navigate("/login", {
      replace: true,
    });
  };

  // =========================================================
  // FETCH NOTIFICATION COUNT
  // =========================================================

  const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem("MentorToken");

      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/notification/count`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notification count");
      }

      const data = await response.json();

      if (data.success) {
        setNotificationCounts({
          bookingRequest: data.counts?.bookingRequest || 0,

          bookingCancelled: data.counts?.bookingCancelled || 0,
        });
      }
    } catch (error) {
      console.error("Notification count error:", error);
    }
  };

  // =========================================================
  // NOTIFICATION POLLING
  // =========================================================

  useEffect(() => {
    fetchNotificationCount();

    const interval = setInterval(() => {
      fetchNotificationCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // =========================================================
  // CLOSE SIDEBAR WHEN RESIZING TO DESKTOP
  // =========================================================

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // =========================================================
  // PREVENT BODY SCROLL WHEN MOBILE SIDEBAR OPEN
  // =========================================================

  useEffect(() => {
    if (isMobileOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* =====================================================
          MOBILE TOP BAR
      ====================================================== */}

      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-3 shadow-sm sm:px-5 lg:hidden">
        {/* Menu Button */}

        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100 active:scale-95"
          aria-label="Open mentor menu"
        >
          <Menu size={22} />
        </button>

        {/* Logo */}

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 font-bold text-white">
            G
          </div>

          <span className="font-bold text-gray-800">GuideX</span>
        </div>

        {/* Profile */}

        <button
          onClick={handleProfileClick}
          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-emerald-100 bg-emerald-50"
          aria-label="Open mentor profile"
        >
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span className="text-sm font-bold text-emerald-700">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </span>
          )}
        </button>
      </header>

      {/* =====================================================
          MOBILE BACKDROP
      ====================================================== */}

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-[280px]
          flex-col
          border-r
          border-gray-200
          bg-white
          shadow-xl
          transition-transform
          duration-300
          ease-in-out
          sm:w-72
          lg:w-64
          lg:translate-x-0
          lg:shadow-sm
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* =================================================
            SIDEBAR HEADER
        ================================================== */}

        <div className="shrink-0 bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-4 text-white sm:px-5 sm:py-5 lg:px-6">
          {/* Mobile Header */}

          <div className="mb-4 flex items-center justify-between lg:hidden">
            <span className="text-sm font-semibold text-emerald-50">
              Mentor Menu
            </span>

            <button
              onClick={closeMobileSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 transition hover:bg-white/25"
              aria-label="Close mentor menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Profile */}

          <div className="flex min-w-0 items-center gap-3">
            {/* Profile Image */}

            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/40 bg-white/20 sm:h-12 sm:w-12">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="text-base font-bold sm:text-lg">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </span>
              )}
            </div>

            {/* User Info */}

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-bold sm:text-base">
                {user?.firstName} {user?.lastName}
              </h2>

              <p className="mt-0.5 text-xs text-emerald-100">Mentor</p>
            </div>

            {/* Profile Button */}

            <button
              onClick={handleProfileClick}
              className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 transition hover:bg-white/25"
              title="Profile"
            >
              <ChevronRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>

        {/* =================================================
            MENU
        ================================================== */}

        <nav className="min-h-0 flex-1 space-y-1.5 overflow-y-auto overscroll-contain p-3">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                onClick={closeMobileSidebar}
                className={({ isActive }) =>
                  `flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:shadow-sm"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Left Side */}

                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className={`
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          transition-all
                          ${isActive ? "bg-white/15" : "bg-transparent"}
                        `}
                      >
                        <Icon size={17} />
                      </div>

                      <span className="truncate">{item.name}</span>
                    </div>

                    {/* Booking Request Badge */}

                    {item.name === "Booking Request" &&
                      notificationCounts.bookingRequest > 0 && (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                          {notificationCounts.bookingRequest > 99
                            ? "99+"
                            : notificationCounts.bookingRequest}
                        </span>
                      )}

                    {/* Cancel Booking Badge */}

                    {item.name === "Cancel Booking" &&
                      notificationCounts.bookingCancelled > 0 && (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                          {notificationCounts.bookingCancelled > 99
                            ? "99+"
                            : notificationCounts.bookingCancelled}
                        </span>
                      )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* =================================================
            FOOTER
        ================================================== */}

        <div className="shrink-0 border-t border-gray-100 bg-white p-3 sm:p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-100 hover:text-red-600 sm:py-3"
          >
            <LogOut size={18} />

            <span>Logout</span>
          </button>

          <p className="mt-3 text-center text-[11px] text-gray-400">
            © 2026 GuideX
          </p>
        </div>
      </aside>
    </>
  );
};

export default MentorSidebar;
