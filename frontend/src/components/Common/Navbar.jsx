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
  ShieldAlert,
  BarChart3,
  Award,
  Contact,
  Brain,
  Database,
  Code,
  Briefcase,
  Zap,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dropdownRef = useRef(null);
  const programsDropdownRef = useRef(null);

  const { user, loading, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProgramsDropdown, setShowProgramsDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Popular");

  // Dynamic courses state from backend API
  const [coursesData, setCoursesData] = useState({
    categories: [],
    courses: {},
  });
  const [coursesLoading, setCoursesLoading] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  // ==========================================
  // FETCH COURSES DYNAMICALLY FROM BACKEND
  // ==========================================

  useEffect(() => {
    const fetchCoursesForNavbar = async () => {
      try {
        setCoursesLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/courses`);
        const data = await res.json();

        if (res.ok && data.success) {
          const fetchedCourses = data.courses || [];

          const grouped = {};
          const categoriesSet = new Set(["Popular"]);

          fetchedCourses.forEach((course) => {
            const cat = course.category || "General";
            categoriesSet.add(cat);
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push({
              title: course.title,
              duration: course.duration || "Self Paced",
              mode: course.mode || "Online",
              _id: course._id,
            });
          });

          grouped["Popular"] = fetchedCourses.slice(0, 4).map((course) => ({
            title: course.title,
            duration: course.duration || "Self Paced",
            mode: course.mode || "Online",
            _id: course._id,
          }));

          const catList = Array.from(categoriesSet).map((cat) => ({
            title: cat,
            icon: getCategoryIcon(cat),
          }));

          setCoursesData({ categories: catList, courses: grouped });
          if (catList.length > 0) {
            setActiveCategory(catList[0].title);
          }
        }
      } catch (error) {
        console.error("Failed to fetch navbar courses:", error);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCoursesForNavbar();
  }, [API_BASE_URL]);

  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes("ai") || name.includes("artificial")) return Brain;
    if (name.includes("data") || name.includes("analytics")) return Database;
    if (
      name.includes("software") ||
      name.includes("tech") ||
      name.includes("code")
    )
      return Code;
    if (name.includes("management") || name.includes("business"))
      return Briefcase;
    return Zap;
  };

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
      title: "Course",
      path: "/courses",
      icon: BookOpen,
    },
    {
      title: "Events",
      path: "/upComingEvents",
      icon: CalendarDays,
    },
  ];

  // ==========================================
  // MORE NAVIGATION (Integrated into Explore Programs Dropdown)
  // ==========================================

  const moreItems = [
    {
      title: "Become a Mentor",
      path: "/landingPage",
      icon: BadgeDollarSign,
    },
    {
      title: "Blogs",
      path: "/blogs",
      icon: BookOpen,
    },
    {
      title: "About GuideX",
      path: "/about",
      icon: Info,
    },
    {
      title: "Contact Us",
      path: "/contact",
      icon: Contact,
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }

      if (
        programsDropdownRef.current &&
        !programsDropdownRef.current.contains(event.target)
      ) {
        setShowProgramsDropdown(false);
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
    setShowDropdown(false);
    setShowProgramsDropdown(false);
  }, [location.pathname]);

  // ==========================================
  // ACTIVE MAIN NAV
  // ==========================================

  const isMainNavActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  // ==========================================
  // ACTIVE PROFILE ITEM
  // ==========================================

  const isProfileActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <>
      {/* =========================================================
          DESKTOP / MAIN NAVBAR
      ========================================================= */}

      <header className="fixed top-2 left-0 right-0 z-50 px-3 sm:px-4 lg:px-8 font-sans">
        <div
          className={`max-w-7xl mx-auto h-16 sm:h-20 rounded-2xl sm:rounded-3xl border backdrop-blur-3xl transition-all duration-500 flex items-center justify-between px-4 sm:px-8 ${
            scrolled
              ? "bg-white/85 border-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
              : "bg-white/70 border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.12)]"
          }`}
        >
          {/* =====================================================
              LOGO
          ===================================================== */}

          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0"
          >
            <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg group-hover:rotate-6 transition duration-500">
              <GraduationCap size={22} className="text-white sm:w-8 sm:h-8" />
            </div>

            <div className="block">
              <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-none">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Guide
                </span>

                <span className="text-gray-900">X</span>
              </h1>

              <p className="hidden sm:block text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.35em] text-gray-500 font-semibold mt-0.5">
                Learn • Connect • Grow
              </p>
            </div>
          </Link>

          {/* =====================================================
              DESKTOP NAVIGATION
          ===================================================== */}

          <nav className="hidden lg:flex items-center gap-2">
            {/* EXPLORE PROGRAMS & MORE DROPDOWN (3-Column Layout: Categories | Courses | More Links) */}
            <div
              ref={programsDropdownRef}
              className="relative"
              onMouseEnter={() => setShowProgramsDropdown(true)}
              onMouseLeave={() => setShowProgramsDropdown(false)}
            >
              <button
                onClick={() => setShowProgramsDropdown((prev) => !prev)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  showProgramsDropdown || location.pathname === "/courses"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200"
                    : "text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-lg"
                }`}
              >
                <span>Explore Programs</span>
                <ChevronDown
                  size={17}
                  className={`transition-transform duration-300 ${
                    showProgramsDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* 3-COLUMN MEGA DROPDOWN PANEL */}
              <div
                className={`absolute left-0 top-full mt-3 w-[1140px] -translate-x-[25%] rounded-3xl bg-white border border-gray-100 shadow-[0_25px_70px_rgba(0,0,0,0.18)] overflow-hidden transition-all duration-300 z-50 ${
                  showProgramsDropdown
                    ? "visible opacity-100 translate-y-0"
                    : "invisible opacity-0 -translate-y-3"
                }`}
              >
                <div className="grid grid-cols-12 min-h-[500px]">
                  {/* 1. LEFT CATEGORY SIDEBAR (Col span 3) */}
                  <div className="col-span-3 bg-gray-50/90 border-r border-gray-100 p-3 space-y-1 overflow-y-auto max-h-[500px]">
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Categories
                    </div>
                    {coursesLoading && coursesData.categories.length === 0 ? (
                      <div className="p-4 text-xs text-gray-400 text-center">
                        Loading categories...
                      </div>
                    ) : (
                      coursesData.categories.map((cat) => {
                        const CatIcon = cat.icon;
                        const isSelected = activeCategory === cat.title;

                        return (
                          <button
                            key={cat.title}
                            onMouseEnter={() => setActiveCategory(cat.title)}
                            onClick={() => setActiveCategory(cat.title)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left text-xs font-semibold transition-all ${
                              isSelected
                                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                : "text-gray-700 hover:bg-blue-50/70 hover:text-blue-600"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <CatIcon size={16} className="shrink-0" />
                              <span className="truncate">{cat.title}</span>
                            </div>
                            <ChevronDown
                              size={13}
                              className={`-rotate-90 shrink-0 ${
                                isSelected ? "text-white" : "text-gray-400"
                              }`}
                            />
                          </button>
                        );
                      })
                    )}
                  </div>

                  {/* 2. MIDDLE COURSES LIST CONTENT (Col span 6) */}
                  <div className="col-span-6 p-6 bg-white flex flex-col justify-between border-r border-gray-100">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                        <span>{activeCategory} Courses</span>
                        <Link
                          to="/courses"
                          onClick={() => setShowProgramsDropdown(false)}
                          className="text-xs font-semibold text-blue-600 hover:underline"
                        >
                          View All
                        </Link>
                      </h3>

                      <div className="grid grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1">
                        {coursesLoading ? (
                          <div className="col-span-2 py-20 text-center text-sm text-gray-400">
                            Loading courses...
                          </div>
                        ) : (coursesData.courses[activeCategory] || [])
                            .length === 0 ? (
                          <div className="col-span-2 py-20 text-center text-sm text-gray-400">
                            No courses available in this category.
                          </div>
                        ) : (
                          (coursesData.courses[activeCategory] || []).map(
                            (course, idx) => (
                              <Link
                                key={course._id || idx}
                                to={`/courses/${course._id || ""}`}
                                onClick={() => setShowProgramsDropdown(false)}
                                className="group p-4 rounded-2xl border border-gray-200/80 bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between"
                              >
                                <div>
                                  <h4 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-blue-600 line-clamp-2 transition-colors">
                                    {course.title}
                                  </h4>
                                </div>

                                <div className="mt-4 pt-2.5 border-t border-gray-100 text-[11px] text-gray-500 font-medium flex items-center justify-between">
                                  <span>{course.duration}</span>
                                  <span className="text-blue-600 font-semibold">
                                    {course.mode}
                                  </span>
                                </div>
                              </Link>
                            )
                          )
                        )}
                      </div>
                    </div>

                    {/* BOTTOM CORPORATE TRAINING ENQUIRE LINK */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                      <span className="text-gray-500 text-[11px]">
                        Need tailored corporate training?
                      </span>
                      <Link
                        to="/contact"
                        onClick={() => setShowProgramsDropdown(false)}
                        className="flex items-center gap-1 hover:underline"
                      >
                        Enquire Now <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>

                  {/* 3. RIGHT END SIDE: MORE ITEMS (Col span 3) */}
                  <div className="col-span-3 bg-gray-50/50 p-5 flex flex-col justify-between">
                    <div>
                      <div className="px-1 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                        Quick Links & More
                      </div>
                      <div className="space-y-1.5">
                        {moreItems.map((item) => {
                          const Icon = item.icon;
                          const active =
                            location.pathname === item.path ||
                            location.pathname.startsWith(`${item.path}/`);

                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setShowProgramsDropdown(false)}
                              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-xs font-semibold ${
                                active
                                  ? "bg-blue-600 text-white shadow-sm"
                                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                              }`}
                            >
                              <div
                                className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                                  active
                                    ? "bg-white/20 text-white"
                                    : "bg-gray-200/70 text-gray-600"
                                }`}
                              >
                                <Icon size={14} />
                              </div>
                              <span className="truncate">{item.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-4 text-white text-center">
                      <h4 className="text-xs font-bold">Have Questions?</h4>
                      <p className="text-[10px] text-blue-100 mt-1 leading-relaxed">
                        Speak directly with our career counselors today.
                      </p>
                      <Link
                        to="/contact"
                        onClick={() => setShowProgramsDropdown(false)}
                        className="mt-3 inline-block rounded-xl bg-white px-3 py-1.5 text-[11px] font-bold text-blue-600 shadow transition hover:bg-slate-100"
                      >
                        Get in Touch
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* REST OF STANDARD NAV ITEMS */}
            {navItems
              .filter((item) => item.title !== "Home")
              .map((item) => {
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
          </nav>

          {/* =====================================================
              RIGHT SIDE
          ===================================================== */}

          <div className="flex items-center gap-2.5 sm:gap-4">
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
                  className="flex items-center gap-2 sm:gap-3 rounded-full bg-white/70 border border-white/40 p-1.5 sm:px-3 sm:py-2 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-9 h-9 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white ring-2 sm:ring-4 ring-blue-100"
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
                    size={16}
                    className={`text-gray-500 hidden sm:block transition-transform duration-300 ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* =================================================
                    PROFILE DROPDOWN SCROLLABLE
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

                  {/* SCROLLABLE PROFILE MENU */}

                  <div className="max-h-[calc(100vh-310px)] overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
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

                    <Link
                      to="/my-Courses"
                      onClick={() => setShowDropdown(false)}
                      className={`mx-2 flex items-center gap-3 rounded-xl px-4 py-2.5 transition ${
                        isProfileActive("/my-courses")
                          ? "bg-green-50 text-green-600"
                          : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                      }`}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-600">
                        <CalendarCheck size={18} />
                      </div>
                      <span className="font-medium">My Courses</span>
                    </Link>

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

                    <Link
                      to="/disputes"
                      onClick={() => setShowDropdown(false)}
                      className={`mx-2 flex items-center gap-3 rounded-xl px-4 py-2.5 transition ${
                        isProfileActive("/disputes")
                          ? "bg-amber-50 text-amber-600"
                          : "text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                      }`}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                        <ShieldAlert size={18} />
                      </div>
                      <span className="font-medium">Disputes</span>
                    </Link>

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
                        <Award size={18} />
                      </div>
                      <span className="font-medium">My Achievements</span>
                    </Link>

                    <Link
                      to="/analytics"
                      onClick={() => setShowDropdown(false)}
                      className={`mx-2 flex items-center gap-3 rounded-xl px-4 py-2.5 transition ${
                        isProfileActive("/analytics")
                          ? "bg-violet-50 text-violet-600"
                          : "text-gray-700 hover:bg-violet-50 hover:text-violet-600"
                      }`}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                        <BarChart3 size={18} />
                      </div>
                      <span className="font-medium">My Analytics</span>
                    </Link>

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

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/70 border border-white/40 shadow-sm text-gray-700 hover:bg-white transition-all"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          MOBILE MENU (Responsive drawer for small screens)
      ========================================================= */}

      <div
        className={`fixed top-20 sm:top-24 left-3 right-3 sm:left-4 sm:right-4 z-40 lg:hidden rounded-3xl bg-white/95 backdrop-blur-3xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 overflow-hidden font-sans ${
          mobileOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-5"
        }`}
      >
        <div className="p-3 sm:p-5 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-none">
          {/* USER MINI HEADER IF LOGGED IN */}
          {!loading && user && (
            <div className="flex items-center gap-3 p-3 mb-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50">
              <img
                src={profileImage}
                alt="profile"
                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </h4>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-semibold uppercase tracking-wider">
                {user?.role}
              </span>
            </div>
          )}

          {/* MAIN NAV ITEMS */}
          <div className="space-y-1 mb-2">
            <Link
              to="/courses"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm text-gray-700 hover:bg-blue-50/80"
            >
              <BookOpen size={18} />
              Explore Programs
            </Link>

            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isMainNavActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200"
                      : "hover:bg-blue-50/80 text-gray-700"
                  }`}
                >
                  <Icon size={18} />
                  {item.title}
                </Link>
              );
            })}
          </div>

          <div className="my-2 border-t border-gray-100"></div>

          {/* MORE ITEMS SECTION IN MOBILE */}
          <div className="px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Quick Links & More
          </div>
          <div className="space-y-1 mb-2">
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
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    active
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-blue-50/80"
                  }`}
                >
                  <Icon size={18} />
                  {item.title}
                </Link>
              );
            })}
          </div>

          {/* MOBILE LOGIN BUTTON */}
          {!loading && !user && (
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-4 flex justify-center items-center rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white py-3.5 font-semibold shadow-md shadow-blue-200"
            >
              Login / Sign Up
            </Link>
          )}

          {/* MOBILE AUTHENTICATED MENU (STUDENT PORTAL) */}

          {!loading && user && (
            <>
              <div className="my-3 border-t border-gray-100"></div>

              <div className="space-y-1 pb-1">
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    isProfileActive("/profile")
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  <User size={18} />
                  My Profile
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    isProfileActive("/dashboard")
                      ? "bg-indigo-50 text-indigo-600 font-semibold"
                      : "text-gray-700 hover:bg-indigo-50"
                  }`}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <Link
                  to="/my-bookings"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    isProfileActive("/my-bookings")
                      ? "bg-green-50 text-green-600 font-semibold"
                      : "text-gray-700 hover:bg-green-50"
                  }`}
                >
                  <CalendarCheck size={18} />
                  My Bookings
                </Link>
                <Link
                  to="/my-courses"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    isProfileActive("/my-courses")
                      ? "bg-green-50 text-green-600 font-semibold"
                      : "text-gray-700 hover:bg-green-50"
                  }`}
                >
                  <CalendarCheck size={18} />
                  My Courses
                </Link>

                <Link
                  to="/my-registrations"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    isProfileActive("/my-registrations")
                      ? "bg-orange-50 text-orange-600 font-semibold"
                      : "text-gray-700 hover:bg-orange-50"
                  }`}
                >
                  <ClipboardList size={18} />
                  My Registrations
                </Link>

                <Link
                  to="/disputes"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    isProfileActive("/disputes")
                      ? "bg-amber-50 text-amber-600 font-semibold"
                      : "text-gray-700 hover:bg-amber-50"
                  }`}
                >
                  <ShieldAlert size={18} />
                  Disputes
                </Link>

                <Link
                  to="/rescheduleRequest"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    isProfileActive("/rescheduleRequest")
                      ? "bg-cyan-50 text-cyan-600 font-semibold"
                      : "text-gray-700 hover:bg-cyan-50"
                  }`}
                >
                  <CalendarDays size={18} />
                  Reschedule Requests
                </Link>

                <Link
                  to="/badges"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    isProfileActive("/badges")
                      ? "bg-yellow-50 text-yellow-600 font-semibold"
                      : "text-gray-700 hover:bg-yellow-50"
                  }`}
                >
                  <Award size={18} />
                  My Achievements
                </Link>

                <Link
                  to="/analytics"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    isProfileActive("/analytics")
                      ? "bg-violet-50 text-violet-600 font-semibold"
                      : "text-gray-700 hover:bg-violet-50"
                  }`}
                >
                  <BarChart3 size={18} />
                  My Analytics
                </Link>

                <Link
                  to="/support-inbox"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    isProfileActive("/support-inbox")
                      ? "bg-purple-50 text-purple-600 font-semibold"
                      : "text-gray-700 hover:bg-purple-50"
                  }`}
                >
                  <MessageCircle size={18} />
                  Student Support
                </Link>
              </div>

              {/* LOGOUT */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-red-50 text-red-600 py-3 font-semibold text-sm hover:bg-red-100 transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
