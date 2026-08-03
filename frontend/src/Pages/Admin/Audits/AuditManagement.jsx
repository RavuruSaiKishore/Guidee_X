import { useEffect, useState } from "react";
import axios from "axios";
import {
  ShieldCheck,
  Search,
  Activity,
  User,
  Clock,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuditLogs = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [selectedLog, setSelectedLog] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [stats, setStats] = useState({
    totalLogs: 0,
    todayLogs: 0,
    authLogs: 0,
    bookingLogs: 0,
  });

  // ==========================================
  // FETCH LOGS
  // ==========================================

  const fetchLogs = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("AdminToken");

      const queryParams = new URLSearchParams({
        page,
        search,
        module: moduleFilter,
        action: actionFilter,
        date: dateFilter,
      });

      const response = await fetch(
        `${API_BASE_URL}/api/admin/audit-logs?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch audit logs");
      }

      setLogs(data.logs || []);
      setPages(data.pages || 1);

      setStats({
        totalLogs: data.totalLogs || 0,
        todayLogs: data.todayLogs || 0,
        authLogs: data.authLogs || 0,
        bookingLogs: data.bookingLogs || 0,
      });
    } catch (err) {
      console.error("Fetch audit logs error:", err);

      toast.error(err.message || "Failed to fetch audit logs.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH WHEN FILTERS CHANGE
  // ==========================================

  useEffect(() => {
    fetchLogs();
  }, [page, search, moduleFilter, actionFilter, dateFilter]);

  // ==========================================
  // DELETE SINGLE LOG
  // ==========================================

  const handleDeleteLog = async () => {
    if (!selectedLogId) return;

    try {
      const token = localStorage.getItem("AdminToken");

      const res = await fetch(
        `${API_BASE_URL}/api/admin/auditlogs/${selectedLogId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete audit log.");
      }

      setLogs((prev) => prev.filter((log) => log._id !== selectedLogId));

      toast.success("Audit log deleted successfully.");

      setShowDeleteModal(false);
      setSelectedLogId(null);
      setSelectedLog(null);

      fetchLogs();
    } catch (err) {
      console.error("Delete audit log error:", err);

      toast.error(err.message || "Failed to delete audit log.");
    }
  };

  // ==========================================
  // DELETE FILTERED LOGS
  // ==========================================

  const handleDeleteFiltered = async () => {
    if (logs.length === 0) return;

    try {
      const token = localStorage.getItem("AdminToken");

      const ids = logs.map((log) => log._id);

      await axios.delete(`${API_BASE_URL}/api/admin/deleteFilterLogs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          ids,
        },
      });

      toast.success(`${ids.length} audit logs deleted`);

      setLogs([]);

      setSearch("");
      setModuleFilter("");
      setActionFilter("");
      setDateFilter("");
      setPage(1);

      fetchLogs();
    } catch (err) {
      console.error("Delete filtered logs error:", err);

      toast.error("Failed to delete logs");
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col justify-center items-center px-6 text-center">
        <div className="relative">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-4 border-emerald-100"></div>

          <div className="absolute inset-0 h-14 w-14 sm:h-16 sm:w-16 rounded-full border-4 border-transparent border-t-emerald-600 animate-spin"></div>
        </div>

        <p className="mt-6 text-base sm:text-lg font-semibold text-gray-700">
          Loading Audit Logs...
        </p>

        <p className="text-sm text-gray-400 mt-1 max-w-sm">
          Please wait while we fetch your audit log data.
        </p>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 p-3 sm:p-5 lg:p-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      <div className="w-full max-w-[1600px] mx-auto">
        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-5 sm:mb-6">
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-indigo-700 shadow-xl">
            <div className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* LEFT CONTENT */}

                <div className="flex items-start sm:items-center gap-3 sm:gap-5 min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>

                  <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                      Audit Logs
                    </h1>

                    <p className="mt-2 text-slate-200 text-sm sm:text-base leading-6 max-w-3xl">
                      Monitor every important activity performed across the
                      GuideX platform. Track user actions, mentor operations,
                      bookings, reviews, and administrative events.
                    </p>
                  </div>
                </div>

                {/* REFRESH BUTTON */}

                <button
                  onClick={fetchLogs}
                  className="w-full lg:w-auto h-11 sm:h-12 px-5 sm:px-6 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-semibold flex items-center justify-center gap-2 shadow-lg transition shrink-0"
                >
                  <RefreshCw size={18} />
                  Refresh Logs
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            STATS
        ========================================== */}

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 mb-5 sm:mb-7 lg:mb-8">
          {/* TOTAL */}

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-gray-500 text-xs sm:text-sm">Total Logs</p>

                <h2 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 text-gray-900">
                  {stats.totalLogs}
                </h2>
              </div>

              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <Activity className="text-indigo-600" size={22} />
              </div>
            </div>
          </div>

          {/* TODAY */}

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-gray-500 text-xs sm:text-sm">Today's Logs</p>

                <h2 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 text-gray-900">
                  {stats.todayLogs}
                </h2>
              </div>

              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <Clock className="text-green-600" size={22} />
              </div>
            </div>
          </div>

          {/* AUTH */}

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-gray-500 text-xs sm:text-sm">
                  Authentication
                </p>

                <h2 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 text-gray-900">
                  {stats.authLogs}
                </h2>
              </div>

              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <ShieldCheck className="text-blue-600" size={22} />
              </div>
            </div>
          </div>

          {/* BOOKING */}

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-gray-500 text-xs sm:text-sm">Booking</p>

                <h2 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 text-gray-900">
                  {stats.bookingLogs}
                </h2>
              </div>

              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                <User className="text-purple-600" size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            FILTERS
        ========================================== */}

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 mb-5 sm:mb-7 lg:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {/* SEARCH */}

            <div className="relative sm:col-span-2 lg:col-span-2">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={17}
              />

              <input
                type="text"
                placeholder="Search by user or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full h-11 pl-10 pr-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm sm:text-base transition"
              />
            </div>

            {/* MODULE */}

            <select
              value={moduleFilter}
              onChange={(e) => {
                setModuleFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-11 border border-gray-200 rounded-xl px-3 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm sm:text-base"
            >
              <option value="">All Modules</option>
              <option>Authentication</option>
              <option>Booking</option>
              <option>Payment</option>
              <option>Mentor</option>
              <option>Student</option>
              <option>Profile</option>
              <option>Review</option>
              <option>Admin</option>
            </select>

            {/* ACTION */}

            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-11 border border-gray-200 rounded-xl px-3 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm sm:text-base"
            >
              <option value="">All Actions</option>
              <option>Login</option>
              <option>Logout</option>
              <option>Register</option>
              <option>Create Booking</option>
              <option>Cancel Booking</option>
              <option>Delete Booking</option>
              <option>Payment Success</option>
              <option>Approve Mentor</option>
              <option>Delete Mentor</option>
              <option>Delete Student</option>
            </select>

            {/* DATE */}

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-11 border border-gray-200 rounded-xl px-3 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm sm:text-base"
            />

            {/* DELETE FILTERED */}

            <button
              disabled={logs.length === 0}
              onClick={handleDeleteFiltered}
              className={`w-full h-11 rounded-xl px-4 flex items-center justify-center gap-2 font-semibold transition text-sm sm:text-base ${
                logs.length === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white shadow-sm"
              }`}
            >
              <Trash2 size={18} />

              <span className="truncate">
                Delete Filtered ({stats.totalLogs})
              </span>
            </button>
          </div>
        </div>

        {/* ==========================================
            LOGS
        ========================================== */}

        <div className="space-y-3 sm:space-y-5">
          {logs.length === 0 ? (
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-10 sm:p-16 text-center">
              <ShieldCheck size={50} className="mx-auto text-gray-300 mb-5" />

              <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
                No Audit Logs Found
              </h2>

              <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-md mx-auto">
                Try changing your filters or perform some actions in the
                platform.
              </p>
            </div>
          ) : (
            logs.map((log) => {
              const moduleColor = {
                Authentication: "bg-blue-100 text-blue-700",
                Booking: "bg-purple-100 text-purple-700",
                Payment: "bg-green-100 text-green-700",
                Mentor: "bg-orange-100 text-orange-700",
                Student: "bg-cyan-100 text-cyan-700",
                Review: "bg-pink-100 text-pink-700",
                Profile: "bg-indigo-100 text-indigo-700",
                Admin: "bg-red-100 text-red-700",
              };

              const actionColor = {
                Login: "bg-green-100 text-green-700",
                Logout: "bg-gray-200 text-gray-700",
                Register: "bg-blue-100 text-blue-700",
                "Create Booking": "bg-purple-100 text-purple-700",
                "Cancel Booking": "bg-red-100 text-red-700",
                "Delete Booking": "bg-red-100 text-red-700",
                "Payment Success": "bg-emerald-100 text-emerald-700",
                "Approve Mentor": "bg-yellow-100 text-yellow-700",
                "Delete Mentor": "bg-red-100 text-red-700",
                "Delete Student": "bg-red-100 text-red-700",
                "Update Profile": "bg-indigo-100 text-indigo-700",
              };

              return (
                <div
                  key={log._id}
                  className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all duration-300"
                >
                  <div className="p-4 sm:p-5 lg:p-6">
                    {/* ==========================================
                        TOP SECTION
                    ========================================== */}

                    <div className="flex flex-col lg:flex-row lg:justify-between gap-5">
                      {/* USER INFO */}

                      <div className="flex items-start gap-3 sm:gap-5 min-w-0">
                        {/* AVATAR */}

                        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-indigo-100 flex items-center justify-center text-base sm:text-xl font-bold text-indigo-700 shrink-0">
                          {log.userName?.charAt(0).toUpperCase() || "U"}
                        </div>

                        {/* DETAILS */}

                        <div className="min-w-0 flex-1">
                          {/* NAME + BADGES */}

                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-base sm:text-lg font-semibold text-gray-800 break-words">
                              {log.userName || "Unknown User"}
                            </h2>

                            <span
                              className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap ${
                                moduleColor[log.module] ||
                                "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {log.module}
                            </span>

                            <span
                              className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap ${
                                actionColor[log.action] ||
                                "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {log.action}
                            </span>
                          </div>

                          {/* EMAIL */}

                          <p className="text-gray-500 mt-2 text-sm break-all">
                            {log.email || "--"}
                          </p>

                          {/* DESCRIPTION */}

                          <p className="mt-3 text-gray-700 text-sm sm:text-base leading-6 break-words">
                            {log.description || "--"}
                          </p>
                        </div>
                      </div>

                      {/* ==========================================
                          RIGHT ACTION AREA
                      ========================================== */}

                      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3 border-t lg:border-t-0 pt-4 lg:pt-0 shrink-0">
                        {/* DELETE BUTTON */}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            setSelectedLog(log);
                            setSelectedLogId(log._id);
                            setShowDeleteModal(true);
                          }}
                          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition text-sm font-medium"
                        >
                          <Trash2 size={16} />

                          <span>Delete</span>
                        </button>

                        {/* DATE */}

                        <div className="text-right">
                          <p className="text-xs sm:text-sm text-gray-500">
                            {new Date(log.createdAt).toLocaleDateString()}
                          </p>

                          <p className="font-medium text-gray-700 text-sm sm:text-base">
                            {new Date(log.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ==========================================
                        META INFORMATION
                    ========================================== */}

                    <div className="mt-5 sm:mt-6 border-t border-gray-100 pt-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {/* USER TYPE */}

                        <div className="min-w-0">
                          <span className="text-xs text-gray-400">
                            User Type
                          </span>

                          <p className="font-medium text-sm text-gray-800 mt-1 truncate">
                            {log.userType || "--"}
                          </p>
                        </div>

                        {/* TARGET */}

                        <div className="min-w-0">
                          <span className="text-xs text-gray-400">Target</span>

                          <p className="font-medium text-sm text-gray-800 mt-1 truncate">
                            {log.targetType || "--"}
                          </p>
                        </div>

                        {/* IP */}

                        <div className="min-w-0">
                          <span className="text-xs text-gray-400">
                            IP Address
                          </span>

                          <p className="font-medium text-sm text-gray-800 mt-1 truncate">
                            {log.ipAddress || "--"}
                          </p>
                        </div>

                        {/* STATUS / MODULE */}

                        <div className="min-w-0">
                          <span className="text-xs text-gray-400">Module</span>

                          <p className="font-medium text-sm text-gray-800 mt-1 truncate">
                            {log.module || "--"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ==========================================
            PAGINATION
        ========================================== */}

        {pages > 1 && (
          <div className="mt-7 sm:mt-10 flex flex-wrap justify-center items-center gap-2 sm:gap-3">
            {/* PREVIOUS */}

            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className={`px-3 sm:px-5 py-2 rounded-xl border transition text-sm sm:text-base ${
                page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-indigo-50"
              }`}
            >
              Previous
            </button>

            {/* PAGE NUMBERS */}

            <div className="flex flex-wrap justify-center gap-2">
              {[...Array(pages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index + 1)}
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl font-semibold transition text-sm sm:text-base ${
                    page === index + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-white border hover:bg-indigo-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* NEXT */}

            <button
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
              className={`px-3 sm:px-5 py-2 rounded-xl border transition text-sm sm:text-base ${
                page === pages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-indigo-50"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ==========================================
          DELETE MODAL
      ========================================== */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
            {/* MODAL HEADER */}

            <div className="bg-red-50 flex flex-col items-center py-6 sm:py-8 px-5 sm:px-6 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="text-red-600" size={32} />
              </div>

              <h2 className="mt-4 sm:mt-5 text-xl sm:text-2xl font-bold text-gray-800">
                Delete Audit Log?
              </h2>

              <p className="text-gray-500 text-sm sm:text-base mt-2 leading-6">
                This action cannot be undone. The selected audit log will be
                permanently removed.
              </p>
            </div>

            {/* MODAL BUTTONS */}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedLogId(null);
                  setSelectedLog(null);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 transition font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteLog}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition flex items-center justify-center gap-2"
              >
                <Trash2 size={17} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
