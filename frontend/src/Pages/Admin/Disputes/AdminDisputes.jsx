import React, { useEffect, useState, useMemo } from "react";
import {
  ShieldAlert,
  MessageSquare,
  ArrowRight,
  User,
  Filter,
  Calendar,
  Search,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const AdminDisputes = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("AdminToken");

      if (!token) {
        toast.error("Admin authentication token not found.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/disputes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load platform disputes");
      }

      setDisputes(data.disputes || []);
    } catch (err) {
      console.error("Error fetching disputes:", err);
      toast.error(err.message || "Failed to fetch disputes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Under Review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Resolved - Refunded":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Resolved - Dismissed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const filteredDisputes = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return disputes.filter((d) => {
      const matchesStatus =
        statusFilter === "All" || d.status.includes(statusFilter);

      const studentName = `${d.student?.firstName || ""} ${
        d.student?.lastName || ""
      }`.toLowerCase();
      const mentorName = `${d.mentor?.firstName || ""} ${
        d.mentor?.lastName || ""
      }`.toLowerCase();
      const subject = (d.subject || "").toLowerCase();
      const reason = (d.reason || "").toLowerCase();
      const category = (d.category || "").toLowerCase();

      const matchesSearch =
        !search ||
        studentName.includes(search) ||
        mentorName.includes(search) ||
        subject.includes(search) ||
        reason.includes(search) ||
        category.includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [disputes, statusFilter, searchTerm]);

  if (loading) {
    return (
      <div className="w-full flex-1 flex items-center justify-center p-12 bg-gray-50">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative h-14 w-14">
            <div className="absolute inset-0 rounded-full border-4 border-purple-100" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-purple-600" />
          </div>
          <p className="mt-5 text-base font-semibold text-gray-700">
            Loading platform disputes...
          </p>
          <p className="mt-1 text-sm text-gray-400">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none space-y-6 pb-12">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* =====================================================
          HEADER BANNER (Unique Purple / Violet Theme for Admin)
      ====================================================== */}
      <div className="w-full rounded-3xl overflow-hidden bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <ShieldAlert size={28} className="text-amber-300" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Admin Dispute Center
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm mt-1">
              Moderate 3-way chats, review session logs, communicate with
              parties, and issue refunds or dismissals.
            </p>
          </div>
        </div>

        <div className="w-full sm:w-auto rounded-2xl border border-white/20 bg-white/15 px-5 py-4 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-lg font-bold text-purple-700 sm:text-xl">
              {filteredDisputes.length}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-purple-100 sm:text-xs">
                Total
              </p>
              <h3 className="text-base font-semibold sm:text-lg">Cases</h3>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          SEARCH & FILTER CONTROLS
      ====================================================== */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative min-w-0 flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by student, mentor, subject, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <Filter size={16} className="text-slate-400 ml-1" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Status:
            </span>
          </div>
          <div className="flex gap-1.5">
            {["All", "Open", "Under Review", "Resolved"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  statusFilter === status
                    ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT SECTION
      ====================================================== */}
      <div className="w-full">
        {filteredDisputes.length === 0 ? (
          <div className="w-full bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm">
            <ShieldAlert size={44} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-700">
              {searchTerm || statusFilter !== "All"
                ? "No Matching Dispute Cases Found"
                : "No Disputes Recorded"}
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== "All"
                ? "No dispute cases match your current filter or search criteria."
                : "All platform transactions and sessions are clear. No disputes have been raised."}
            </p>
            {(searchTerm || statusFilter !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
                className="mt-5 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-purple-700 active:scale-95"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDisputes.map((d) => (
              <div
                key={d._id}
                className="w-full bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                        d.status
                      )}`}
                    >
                      {d.status}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                      {d.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 text-base">
                      {d.subject || "Session Dispute Case"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 mb-3 text-xs text-slate-500 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <User size={14} className="text-purple-500" />
                        Student: {d.student?.firstName || "Unknown"}{" "}
                        {d.student?.lastName || ""}
                      </span>
                      {d.booking && (
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-purple-500" />
                          Session Date:{" "}
                          {new Date(d.booking.sessionDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 line-clamp-2">
                      <strong className="text-slate-700">Reason:</strong>{" "}
                      {d.reason}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Created:{" "}
                    {new Date(d.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    onClick={() => navigate(`/admin/disputes/${d._id}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-sm active:scale-95"
                  >
                    <MessageSquare size={15} /> Moderate Chat{" "}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDisputes;
