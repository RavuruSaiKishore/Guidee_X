import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BarChart3,
  LogOut,
  ClipboardCheck,
  CalendarDays,
  Logs,
  ChevronRight,
  MessageSquareMore,
  BookOpen,
  FileText,
  Menu,
  X,
  HelpCircle,
  Star,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";

const menu = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    name: "Students",
    path: "/admin/users",
    icon: Users,
  },
  {
    name: "Student Chats",
    path: "/admin/contact-requests",
    icon: MessageSquareMore,
  },
  {
    name: "Mentors",
    path: "/admin/mentors",
    icon: UserCheck,
  },
  {
    name: "Mentor Chats",
    path: "/admin/mentor-chats",
    icon: MessageCircle,
  },
  {
    name: "Bookings",
    path: "/admin/bookings",
    icon: CalendarDays,
  },
  {
    name: "Blogs",
    path: "/admin/blogs",
    icon: FileText,
  },
  {
    name: "Audits Logs",
    path: "/admin/auditslogs",
    icon: Logs,
  },
  {
    name: "Analytics",
    path: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Mentor Requests",
    path: "/admin/mentor-requests",
    icon: ClipboardCheck,
  },
  {
    name: "FAQ'S",
    path: "/admin/FAQ",
    icon: HelpCircle,
  },
  {
    name: "Events",
    path: "/admin/Events",
    icon: CalendarDays,
  },
  {
    name: "Career Resouces",
    path: "/admin/careerResources",
    icon: BookOpen,
  },
  {
    name: "Reviews",
    path: "/admin/reviews",
    icon: Star,
  },
];


const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login", { replace: true });
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* ================= MOBILE TOP BAR ================= */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm lg:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-100"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div>
            <h1 className="text-lg font-bold text-slate-900">GuideX</h1>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
        </div>

        {/* Mobile Profile */}
        <button
          onClick={() => handleNavigation("/admin/adminprofile")}
          className="h-10 w-10 overflow-hidden rounded-full border-2 border-blue-100 bg-blue-50"
        >
          {user?.profileImage ? (
            <img
              src={`${API_BASE_URL}${user.profileImage}`}
              alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/default-avatar.png";
              }}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-sm font-bold text-blue-600">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </span>
          )}
        </button>
      </div>

      {/* ================= MOBILE OVERLAY ================= */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-72 flex-col
          bg-gradient-to-b from-slate-50 via-white to-blue-50
          border-r border-slate-200
          shadow-2xl
          transition-transform duration-300 ease-in-out

          lg:static
          lg:z-auto
          lg:w-64
          lg:translate-x-0
          lg:shadow-xl

          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* ================= HEADER ================= */}
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 px-5 py-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            {/* Profile */}
            <button
              onClick={() => handleNavigation("/admin/adminprofile")}
              className="flex min-w-0 items-center gap-3 text-left"
            >
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-white/40 bg-white/20 shadow-lg backdrop-blur">
                {user?.profileImage ? (
                  <img
                    src={`${API_BASE_URL}${user.profileImage}`}
                    alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/default-avatar.png";
                    }}
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-lg font-bold text-white">
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold tracking-wide">
                  {user?.firstName} {user?.lastName}
                </h2>

                <p className="text-xs font-medium text-blue-100">
                  Administrator
                </p>
              </div>
            </button>

            {/* Desktop Profile Button */}
            <button
              onClick={() => handleNavigation("/admin/adminprofile")}
              className="group hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-white/30 sm:flex"
              title="Admin Profile"
            >
              <ChevronRight
                size={22}
                className="text-white transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            {/* Mobile Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 transition hover:bg-white/25 lg:hidden"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* ================= MENU ================= */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto p-3">
          {menu.map((item) => {
            const Icon = item.icon;

            const isActive = item.end
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                onClick={() => setIsOpen(false)}
                className={`
                  group flex items-center gap-3 rounded-xl
                  px-3 py-2.5
                  text-sm font-medium
                  transition-all duration-300

                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm"
                  }
                `}
              >
                <div
                  className={`
                    flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-all

                    ${
                      isActive
                        ? "bg-white/20"
                        : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                    }
                  `}
                >
                  <Icon size={17} />
                </div>

                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* ================= FOOTER ================= */}
        <div className="border-t border-slate-200 bg-white/70 p-4 backdrop-blur">
          <button
            onClick={handleLogout}
            className="
              flex w-full items-center justify-center gap-2
              rounded-2xl
              bg-gradient-to-r from-red-500 to-rose-500
              py-3
              font-semibold text-white
              shadow-md
              transition-all duration-300
              hover:scale-[1.02]
              hover:shadow-xl
            "
          >
            <LogOut size={18} />
            Logout
          </button>

          <p className="mt-4 text-center text-[11px] tracking-wide text-slate-400">
            © 2026 GuideX
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
