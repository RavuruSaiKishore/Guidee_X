import React, { useEffect, useState, useMemo } from "react";
import {
  ShieldAlert,
  MessageSquare,
  ArrowRight,
  User,
  Filter,
  Calendar,
  Search,
  Loader2,
  Sparkles,
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
        return "border-amber-200 bg-amber-50 text-amber-700";
      case "Under Review":
        return "border-blue-200 bg-blue-50 text-blue-700";
      case "Resolved - Refunded":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
      case "Resolved - Dismissed":
        return "border-slate-200 bg-slate-100 text-slate-700";
      default:
        return "border-slate-200 bg-slate-50 text-slate-600";
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
      <div
        className="w-full flex-1 flex items-center justify-center p-12 bg-slate-50 min-h-screen text-slate-900"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={42} />
          <p
            className="text-xs font-semibold text-slate-900 tracking-tight"
            style={{ fontWeight: 600 }}
          >
            Loading platform disputes...
          </p>
          <p
            className="mt-1 text-xs text-slate-500 font-medium"
            style={{ fontWeight: 600 }}
          >
            Please wait a moment
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-12 bg-slate-50 min-h-screen text-slate-900"
      style={{ fontFamily: "'Poppins', sans-serif", fontStyle: "normal" }}
    >
      <ToastContainer position="top-right" autoClose={3000} />

      {/* =====================================================
          HEADER BANNER (High-End Black, White & Blue Theme)
      ====================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-black p-6 sm:p-8 text-white shadow-md">
        {/* Background Accents */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl" />

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/15 flex items-center justify-center shrink-0 shadow-inner"
              style={{ fontWeight: 600 }}
            >
              <ShieldAlert size={26} className="text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-blue-300 backdrop-blur"
                  style={{ fontWeight: 600 }}
                >
                  <Sparkles size={13} className="text-blue-400" />
                  Resolution Suite
                </span>
              </div>
              <h1
                className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-2"
                style={{ fontWeight: 600 }}
              >
                Admin Dispute Center
              </h1>
              <p
                className="text-xs sm:text-sm text-slate-300 font-medium mt-1 max-w-xl leading-relaxed"
                style={{ fontWeight: 600 }}
              >
                Moderate multi-party chats, review session logs, communicate
                with users, and issue refunds or dismissals securely.
              </p>
            </div>
          </div>

          <div
            className="w-full sm:w-auto rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur shadow-inner shrink-0"
            style={{ fontWeight: 600 }}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-base font-semibold text-black shadow-xs">
                {filteredDisputes.length}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Active
                </p>
                <h3 className="text-sm font-semibold text-white">
                  Dispute Cases
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          SEARCH & FILTER CONTROLS
      ====================================================== */}
      <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative min-w-0 flex-1">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by student, mentor, subject, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            style={{ fontWeight: 600 }}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter size={15} className="text-slate-400 ml-1" />
            <span
              className="text-[10px] font-semibold uppercase tracking-wider text-slate-500"
              style={{ fontWeight: 600 }}
            >
              Status:
            </span>
          </div>
          <div className="flex gap-1.5">
            {["All", "Open", "Under Review", "Resolved"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 shadow-2xs ${
                  statusFilter === status
                    ? "bg-black text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                style={{ fontWeight: 600 }}
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
          <div className="w-full bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
              <ShieldAlert size={26} />
            </div>
            <h3
              className="text-base font-semibold text-slate-900 tracking-tight"
              style={{ fontWeight: 600 }}
            >
              {searchTerm || statusFilter !== "All"
                ? "No Matching Dispute Cases Found"
                : "No Disputes Recorded"}
            </h3>
            <p
              className="text-slate-500 text-xs font-medium mt-1 max-w-sm mx-auto leading-relaxed"
              style={{ fontWeight: 600 }}
            >
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
                className="mt-5 rounded-xl bg-black px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 shadow-xs"
                style={{ fontWeight: 600 }}
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
                className="w-full bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                        d.status
                      )}`}
                      style={{ fontWeight: 600 }}
                    >
                      {d.status}
                    </span>
                    <span
                      className="text-[11px] font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200"
                      style={{ fontWeight: 600 }}
                    >
                      {d.category}
                    </span>
                  </div>

                  <div>
                    <h3
                      className="font-semibold text-slate-900 text-base tracking-tight group-hover:text-blue-600 transition"
                      style={{ fontWeight: 600 }}
                    >
                      {d.subject || "Session Dispute Case"}
                    </h3>
                    <div
                      className="flex flex-wrap items-center gap-4 mt-2 mb-3 text-xs text-slate-500 font-semibold"
                      style={{ fontWeight: 600 }}
                    >
                      <span className="flex items-center gap-1.5">
                        <User size={14} className="text-blue-600" />
                        Student: {d.student?.firstName || "Unknown"}{" "}
                        {d.student?.lastName || ""}
                      </span>
                      {d.booking && (
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-blue-600" />
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
                    <p
                      className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 line-clamp-2 font-medium leading-relaxed"
                      style={{ fontWeight: 600 }}
                    >
                      <strong className="text-slate-900 font-semibold">
                        Reason:
                      </strong>{" "}
                      {d.reason}
                    </p>
                  </div>
                </div>

                <div
                  className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400"
                  style={{ fontWeight: 600 }}
                >
                  <span>
                    Created:{" "}
                    {new Date(d.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    onClick={() => navigate(`/admin/disputes/${d._id}`)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all shadow-xs"
                    style={{ fontWeight: 600 }}
                  >
                    <MessageSquare size={14} className="text-blue-400" />{" "}
                    Moderate Chat{" "}
                    <ArrowRight size={14} className="text-blue-400" />
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
