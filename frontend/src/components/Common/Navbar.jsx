import { useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  GraduationCap,
  Home,
  BookOpen,
  Users,
  BadgeDollarSign,
  Info,
  User,
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  LogOut,
  Menu,
  X,
  ChevronDown,
  MessageCircle,
  ClipboardList,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dropdownRef = useRef(null);
  const moreDropdownRef = useRef(null);

  const { user, loading, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showMobileMore, setShowMobileMore] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  // ==========================================
  // PROFILE IMAGE
  // ==========================================

  const profileImage = user?.profileImage
    ? `${API_BASE_URL}${user.profileImage}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${user?.firstName || "User"} ${user?.lastName || ""}`
      )}`;

  // ==========================================
  // MAIN NAVIGATION
  // ==========================================

  const navItems = [
    {
      title: "Home",
      path: "/",
      icon: Home,
    },
    {
      title: "Mentors",
      path: "/mentors",
      icon: Users,
    },
    {
      title: "Blogs",
      path: "/blogs",
      icon: BookOpen,
    },
    {
      title: "Events",
      path: "/upComingEvents",
      icon: CalendarDays,
    },
  ];

  // ==========================================
  // MORE NAVIGATION
  // ==========================================

  const moreItems = [
    {
      title: "Become a Mentor",
      path: "/landingPage",
      icon: BadgeDollarSign,
    },
    {
      title: "About GuideX",
      path: "/about",
      icon: Info,
    },
    {
      title: "Contact Us",
      path: "/contact",
      icon: MessageCircle,
    },
    {
      title: "Resources",
      path: "/career-resources",
      icon: BookOpen,
    },
  ];

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    setShowDropdown(false);
    setMobileOpen(false);

    await logout();

    navigate("/login");
  };

  // ==========================================
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Profile dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }

      // More dropdown
      if (
        moreDropdownRef.current &&
        !moreDropdownRef.current.contains(event.target)
      ) {
        setShowMoreDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ==========================================
  // HANDLE SCROLL
  // ==========================================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ==========================================
  // CLOSE MENUS ON ROUTE CHANGE
  // ==========================================

  useEffect(() => {
    setMobileOpen(false);
    setShowMoreDropdown(false);
    setShowMobileMore(false);
    setShowDropdown(false);
  }, [location.pathname]);

  // ==========================================
  // ACTIVE MAIN NAV
  // ==========================================

  const isMainNavActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  // ==========================================
  // ACTIVE MORE NAV
  // ==========================================

  const isMoreActive = () => {
    return moreItems.some(
      (item) =>
        location.pathname === item.path ||
        location.pathname.startsWith(`${item.path}/`)
    );
  };

  // ==========================================
  // ACTIVE PROFILE ITEM
  // ==========================================

  const isProfileActive = (path) => {
    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <>
      {/* =========================================================
          DESKTOP / MAIN NAVBAR
      ========================================================= */}

      <header className="fixed top-2 left-0 right-0 z-50 px-4 lg:px-8">
        <div
          className={`max-w-7xl mx-auto h-20 rounded-3xl border backdrop-blur-3xl transition-all duration-500 flex items-center justify-between px-5 sm:px-8 ${
            scrolled
              ? "bg-white/85 border-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
              : "bg-white/70 border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.12)]"
          }`}
        >
          {/* =====================================================
              LOGO
          ===================================================== */}

          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg group-hover:rotate-6 transition duration-500">
              <GraduationCap size={28} className="text-white sm:w-8 sm:h-8" />
            </div>

            <div className="hidden sm:block">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Guide
                </span>

                <span className="text-gray-900">X</span>
              </h1>

              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.35em] text-gray-500 font-semibold">
                Learn • Connect • Grow
              </p>
            </div>
          </Link>

          {/* =====================================================
              DESKTOP NAVIGATION
          ===================================================== */}

          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isMainNavActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300 overflow-hidden ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200"
                      : "text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-lg"
                  }`}
                >
                  <Icon size={18} />

                  {item.title}
                </Link>
              );
            })}

            {/* =================================================
                MORE DROPDOWN
            ================================================= */}

            <div ref={moreDropdownRef} className="relative">
              <button
                onClick={() => setShowMoreDropdown((prev) => !prev)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isMoreActive() || showMoreDropdown
                    ? "bg-white text-blue-600 shadow-lg"
                    : "text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-lg"
                }`}
              >
                <span>More</span>

                <ChevronDown
                  size={17}
                  className={`transition-transform duration-300 ${
                    showMoreDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`absolute right-0 top-full mt-3 w-64 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-2 overflow-hidden transition-all duration-300 ${
                  showMoreDropdown
                    ? "visible opacity-100 translate-y-0"
                    : "invisible opacity-0 -translate-y-3"
                }`}
              >
                {moreItems.map((item) => {
                  const Icon = item.icon;

                  const active =
                    location.pathname === item.path ||
                    location.pathname.startsWith(`${item.path}/`);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setShowMoreDropdown(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        active
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      <div
                        className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                          active
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <span className="font-medium text-sm">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* =====================================================
              RIGHT SIDE
          ===================================================== */}

          <div className="flex items-center gap-3 sm:gap-4">
            {loading ? null : !user ? (
              <Link
                to="/login"
                className="hidden lg:flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Login
              </Link>
            ) : (
              /* =================================================
                 PROFILE DROPDOWN
              ================================================= */

              <div className="relative" ref={dropdownRef}>
                {/* PROFILE BUTTON */}

                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 rounded-full bg-white/70 border border-white/40 px-3 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white ring-4 ring-blue-100"
                  />

                  <div className="hidden xl:block text-left">
                    <h3 className="text-sm font-bold text-gray-800">
                      {user?.firstName}
                    </h3>

                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role}
                    </p>
                  </div>

                  <ChevronDown
                    size={18}
                    className={`text-gray-500 transition-transform duration-300 ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* =================================================
                    PROFILE DROPDOWN
                    SCROLLABLE
                ================================================= */}

                <div
                  className={`absolute right-0 mt-5 w-72 max-h-[calc(100vh-120px)] rounded-3xl bg-white/95 backdrop-blur-3xl border border-white/30 shadow-[0_25px_70px_rgba(0,0,0,0.16)] overflow-hidden transition-all duration-300 ${
                    showDropdown
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-3"
                  }`}
                >
                  {/* HEADER - FIXED */}

                  <div className="flex items-center gap-4 px-5 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white">
                    <img
                      src={profileImage}
                      alt="profile"
                      className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-lg flex-shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold truncate">
                        {user?.firstName} {user?.lastName}
                      </h3>

                      <p className="mt-1 text-sm text-blue-100 truncate">
                        {user?.email}
                      </p>

                      <span className="inline-flex mt-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold capitalize">
                        {user?.role}
                      </span>
                    </div>
                  </div>

                  {/* =================================================
                      SCROLLABLE PROFILE MENU
                  ================================================= */}

                  <div className="max-h-[calc(100vh-310px)] overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {/* PROFILE */}

                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className={`mx-2 flex items-center gap-3 rounded-xl px-4 py-2.5 transition ${
                        isProfileActive("/profile")
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <User size={18} />
                      </div>

                      <span className="font-medium">My Profile</span>
                    </Link>

                    {/* DASHBOARD */}

                    <Link
                      to="/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className={`mx-2 flex items-center gap-3 rounded-xl px-4 py-2.5 transition ${
                        isProfileActive("/dashboard")
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                      }`}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                        <LayoutDashboard size={18} />
                      </div>

                      <span className="font-medium">Dashboard</span>
                    </Link>

                    {/* MY BOOKINGS */}

                    <Link
                      to="/my-bookings"
                      onClick={() => setShowDropdown(false)}
                      className={`mx-2 flex items-center gap-3 rounded-xl px-4 py-2.5 transition ${
                        isProfileActive("/my-bookings")
                          ? "bg-green-50 text-green-600"
                          : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                      }`}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-600">
                        <CalendarCheck size={18} />
                      </div>

                      <span className="font-medium">My Bookings</span>
                    </Link>

                    {/* =================================================
                        MY REGISTRATIONS
                    ================================================= */}

                    <Link
                      to="/my-registrations"
                      onClick={() => setShowDropdown(false)}
                      className={`mx-2 flex items-center gap-3 rounded-xl px-4 py-2.5 transition ${
                        isProfileActive("/my-registrations")
                          ? "bg-orange-50 text-orange-600"
                          : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      }`}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                        <ClipboardList size={18} />
                      </div>

                      <span className="font-medium">My Registrations</span>
                    </Link>

                    {/* MY EVENTS */}

                    <Link
                      to="/rescheduleRequest"
                      onClick={() => setShowDropdown(false)}
                      className={`mx-2 flex items-center gap-3 rounded-xl px-4 py-2.5 transition ${
                        isProfileActive("/rescheduleRequest")
                          ? "bg-cyan-50 text-cyan-600"
                          : "text-gray-700 hover:bg-cyan-50 hover:text-cyan-600"
                      }`}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                        <CalendarDays size={18} />
                      </div>

                      <span className="font-medium">Reschedule Requests</span>
                    </Link>

                    {/* ACHIEVEMENTS */}

                    <Link
                      to="/badges"
                      onClick={() => setShowDropdown(false)}
                      className={`mx-2 flex items-center gap-3 rounded-xl px-4 py-2.5 transition ${
                        isProfileActive("/badges")
                          ? "bg-yellow-50 text-yellow-600"
                          : "text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                      }`}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                        <BookOpen size={18} />
                      </div>

                      <span className="font-medium">My Achievements</span>
                    </Link>

                    <Link
                      to="/analytics"
                      onClick={() => setShowDropdown(false)}
                      className={`mx-2 flex items-center gap-3 rounded-xl px-4 py-2.5 transition ${
                        isProfileActive("/analytics")
                          ? "bg-yellow-50 text-yellow-600"
                          : "text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                      }`}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                        <BookOpen size={18} />
                      </div>

                      <span className="font-medium">My Analytics</span>
                    </Link>

                    {/* STUDENT SUPPORT */}

                    <Link
                      to="/support-inbox"
                      onClick={() => setShowDropdown(false)}
                      className={`mx-2 flex items-center gap-3 rounded-xl px-4 py-2.5 transition ${
                        isProfileActive("/support-inbox")
                          ? "bg-purple-50 text-purple-600"
                          : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                      }`}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                        <MessageCircle size={18} />
                      </div>

                      <span className="font-medium">Student Support</span>
                    </Link>

                    <div className="mx-4 my-2 border-t"></div>

                    {/* LOGOUT */}

                    <button
                      onClick={handleLogout}
                      className="mx-2 mb-2 flex w-[calc(100%-16px)] items-center gap-3 rounded-xl px-4 py-2.5 text-red-600 hover:bg-red-50 transition"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600">
                        <LogOut size={18} />
                      </div>

                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex items-center justify-center w-12 h-12 rounded-2xl bg-white/70 border border-white/40 shadow-lg"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          MOBILE MENU
      ========================================================= */}

      <div
        className={`fixed top-28 left-4 right-4 z-40 lg:hidden rounded-3xl bg-white/95 backdrop-blur-3xl border border-white/40 shadow-2xl transition-all duration-300 overflow-hidden ${
          mobileOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-5"
        }`}
      >
        <div className="p-4 max-h-[calc(100vh-140px)] overflow-y-auto">
          {/* MAIN NAV */}

          {navItems.map((item) => {
            const Icon = item.icon;

            const active = isMainNavActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300 mb-2 ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                <Icon size={20} />

                {item.title}
              </Link>
            );
          })}

          {/* MOBILE MORE */}

          <button
            onClick={() => setShowMobileMore((prev) => !prev)}
            className={`w-full flex items-center justify-between gap-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300 mb-2 ${
              isMoreActive()
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-blue-50 text-gray-700"
            }`}
          >
            <span className="flex items-center gap-4">
              <Info size={20} />
              More
            </span>

            <ChevronDown
              size={20}
              className={`transition-transform duration-300 ${
                showMobileMore ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* MOBILE MORE ITEMS */}

          <div
            className={`overflow-hidden transition-all duration-300 ${
              showMobileMore ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="ml-4 pl-3 border-l-2 border-blue-100">
              {moreItems.map((item) => {
                const Icon = item.icon;

                const active =
                  location.pathname === item.path ||
                  location.pathname.startsWith(`${item.path}/`);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition mb-2 ${
                      active
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <Icon size={18} />

                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* MOBILE LOGIN */}

          {!loading && !user && (
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-3 flex justify-center items-center rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white py-4 font-semibold"
            >
              Login
            </Link>
          )}

          {/* =================================================
              MOBILE AUTHENTICATED MENU
          ================================================= */}

          {!loading && user && (
            <>
              <div className="my-4 border-t"></div>

              {/* PROFILE */}

              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition mb-2 ${
                  isProfileActive("/profile")
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                <User size={20} />
                Profile
              </Link>

              {/* DASHBOARD */}

              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition mb-2 ${
                  isProfileActive("/dashboard")
                    ? "bg-indigo-50 text-indigo-600"
                    : "hover:bg-indigo-50 text-gray-700"
                }`}
              >
                <LayoutDashboard size={20} />
                Dashboard
              </Link>

              {/* MY BOOKINGS */}

              <Link
                to="/my-bookings"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition mb-2 ${
                  isProfileActive("/my-bookings")
                    ? "bg-green-50 text-green-600"
                    : "hover:bg-green-50 text-gray-700"
                }`}
              >
                <CalendarCheck size={20} />
                My Bookings
              </Link>

              {/* =================================================
                  MOBILE MY REGISTRATIONS
              ================================================= */}

              <Link
                to="/my-registrations"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition mb-2 ${
                  isProfileActive("/my-registrations")
                    ? "bg-orange-50 text-orange-600"
                    : "hover:bg-orange-50 text-gray-700"
                }`}
              >
                <ClipboardList size={20} />
                My Registrations
              </Link>

              {/* MY EVENTS */}

              <Link
                to="/rescheduleRequest"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition mb-2 ${
                  isProfileActive("/rescheduleRequest")
                    ? "bg-cyan-50 text-cyan-600"
                    : "hover:bg-cyan-50 text-gray-700"
                }`}
              >
                <CalendarDays size={20} />
                Reschedule Requests
              </Link>

              {/* BADGES */}

              <Link
                to="/badges"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition mb-2 ${
                  isProfileActive("/badges")
                    ? "bg-yellow-50 text-yellow-600"
                    : "hover:bg-yellow-50 text-gray-700"
                }`}
              >
                <BookOpen size={20} />
                My Achievements
              </Link>

              <Link
                to="/analytics"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition mb-2 ${
                  isProfileActive("/analytics")
                    ? "bg-purple-50 text-purple-600"
                    : "hover:bg-purple-50 text-gray-700"
                }`}
              >
                <MessageCircle size={20} />
                My Analytics
              </Link>

              {/* SUPPORT */}

              <Link
                to="/support-inbox"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition mb-2 ${
                  isProfileActive("/support-inbox")
                    ? "bg-purple-50 text-purple-600"
                    : "hover:bg-purple-50 text-gray-700"
                }`}
              >
                <MessageCircle size={20} />
                Student Support
              </Link>

              {/* LOGOUT */}

              <button
                onClick={handleLogout}
                className="mt-3 w-full flex items-center justify-center gap-3 rounded-2xl bg-red-500 text-white py-4 font-semibold hover:bg-red-600 transition"
              >
                <LogOut size={20} />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
