import React, { useEffect, useState, useMemo } from "react";
import {
  ShieldAlert,
  MessageSquare,
  ArrowRight,
  User,
  Filter,
  Calendar,
  Search,
  Sparkles,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const MentorDisputes = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("MentorToken");

      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/disputes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load mentor disputes");
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
        return "border-slate-200 bg-slate-50 text-slate-700";
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
      const subject = (d.subject || "").toLowerCase();
      const reason = (d.reason || "").toLowerCase();
      const category = (d.category || "").toLowerCase();

      const matchesSearch =
        !search ||
        studentName.includes(search) ||
        subject.includes(search) ||
        reason.includes(search) ||
        category.includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [disputes, statusFilter, searchTerm]);

  if (loading) {
    return (
      <div
        className="min-h-screen bg-slate-50 pt-16 sm:pt-20 lg:ml-64 lg:pt-0 text-slate-900"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-2 sm:px-5">
          <div className="relative">
            <div className="h-14 w-14 rounded-full border-4 border-slate-200" />
            <div className="absolute inset-0 h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
          </div>
          <p
            className="mt-5 text-center text-xs font-semibold tracking-tight"
            style={{ fontWeight: 600 }}
          >
            Loading your Session Inquiries...
          </p>
          <p
            className="mt-1 text-center text-[11px] text-slate-400 font-medium"
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
      className="min-h-screen bg-slate-50 pt-16 sm:pt-20 lg:ml-64 lg:pt-0 text-slate-900 pb-16"
      style={{ fontFamily: "'Poppins', sans-serif", fontStyle: "normal" }}
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <main className="w-full max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8 space-y-4 sm:space-y-6">
        {/* =====================================================
            HEADER
        ====================================================== */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-black p-4 sm:p-8 text-white shadow-md w-full">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 min-w-0">
              <div
                className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur shadow-inner text-blue-400"
                style={{ fontWeight: 600 }}
              >
                <ShieldAlert size={22} className="sm:w-[26px] sm:h-[26px]" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-blue-300 backdrop-blur"
                    style={{ fontWeight: 600 }}
                  >
                    <Sparkles size={12} className="text-blue-400" />
                    Moderation Suite
                  </span>
                </div>

                <h1
                  className="mt-1.5 sm:mt-2 text-xl sm:text-3xl font-semibold tracking-tight text-white"
                  style={{ fontWeight: 600 }}
                >
                  Session Inquiries & Disputes
                </h1>

                <p
                  className="mt-0.5 sm:mt-1 text-[11px] sm:text-sm text-slate-300 font-medium leading-relaxed"
                  style={{ fontWeight: 600 }}
                >
                  Review and respond to session complaints filed by students.
                  Provide your statements in the 3-way moderation room.
                </p>
              </div>
            </div>

            <div
              className="flex items-center gap-3.5 sm:gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 sm:px-5 py-3.5 sm:py-4 backdrop-blur shadow-inner shrink-0"
              style={{ fontWeight: 600 }}
            >
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-white text-sm sm:text-base font-semibold text-black shadow-xs">
                {filteredDisputes.length}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Total
                </p>
                <h3 className="text-xs sm:text-sm font-semibold text-white">
                  Inquiries
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SEARCH & FILTER CONTROLS
        ====================================================== */}
        <section className="space-y-3 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs w-full">
            <div className="relative min-w-0 flex-1 w-full">
              <Search
                size={16}
                className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by student name, subject, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                style={{ fontWeight: 600 }}
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto bg-slate-50 p-2 rounded-xl border border-slate-200 shadow-2xs shrink-0">
              <Filter size={15} className="text-slate-400 ml-1 shrink-0" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 shrink-0 mr-1">
                Status:
              </span>
              {["All", "Open", "Under Review", "Resolved"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    statusFilter === status
                      ? "bg-black text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTENT SECTION
        ====================================================== */}
        {filteredDisputes.length === 0 ? (
          <section className="flex min-h-[350px] w-full flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-4 py-12 text-center shadow-xs">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3 sm:mb-4">
              <ShieldAlert size={24} />
            </div>
            <h2
              className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight"
              style={{ fontWeight: 600 }}
            >
              {searchTerm || statusFilter !== "All"
                ? "No Matching Inquiries Found"
                : "No Inquiries Found"}
            </h2>
            <p
              className="mt-1 max-w-sm text-center text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed"
              style={{ fontWeight: 600 }}
            >
              {searchTerm || statusFilter !== "All"
                ? "No student disputes match your current filter or search criteria."
                : "Your track record is completely clear. You have no active student disputes for your sessions."}
            </p>
            {(searchTerm || statusFilter !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
                className="mt-4 flex items-center justify-center rounded-xl bg-black hover:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white transition shadow-xs"
                style={{ fontWeight: 600 }}
              >
                Reset Filters
              </button>
            )}
          </section>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDisputes.map((d) => (
              <article
                key={d._id}
                className="w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-xs transition duration-200 hover:border-blue-300 hover:shadow-md p-4 sm:p-6 flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold border ${getStatusBadge(
                        d.status
                      )}`}
                      style={{ fontWeight: 600 }}
                    >
                      {d.status}
                    </span>
                    <span
                      className="text-[10px] sm:text-[11px] font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200"
                      style={{ fontWeight: 600 }}
                    >
                      {d.category}
                    </span>
                  </div>

                  <div>
                    <h3
                      className="text-xs sm:text-sm font-semibold text-slate-900 tracking-tight"
                      style={{ fontWeight: 600 }}
                    >
                      {d.subject}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 mb-3 text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <User size={13} className="text-blue-600" />
                        Student: {d.student?.firstName || "Unknown"}{" "}
                        {d.student?.lastName || ""}
                      </span>
                      {d.booking && (
                        <span className="flex items-center gap-1.5 font-semibold">
                          <Calendar size={13} className="text-blue-600" />
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
                      className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 font-medium leading-relaxed"
                      style={{ fontWeight: 600 }}
                    >
                      <strong className="text-slate-900">Reason:</strong>{" "}
                      {d.reason}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span
                    className="text-[10px] text-slate-400 font-medium"
                    style={{ fontWeight: 600 }}
                  >
                    Created:{" "}
                    {new Date(d.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    onClick={() => navigate(`/mentor/disputes/${d._id}`)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition shadow-xs"
                    style={{ fontWeight: 600 }}
                  >
                    <MessageSquare size={13} className="text-blue-400" /> Enter
                    Room <ArrowRight size={13} className="text-blue-400" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MentorDisputes;
