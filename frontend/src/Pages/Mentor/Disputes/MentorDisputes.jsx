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
      <div className="min-h-screen overflow-x-hidden bg-gray-50 pt-16 lg:ml-64 lg:pt-0">
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 lg:min-h-screen">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative h-14 w-14">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-emerald-600" />
            </div>
            <p className="mt-5 text-base font-semibold text-gray-700">
              Loading your Session Inquiries...
            </p>
            <p className="mt-1 text-sm text-gray-400">Please wait a moment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 pt-16 lg:ml-64 lg:pt-0">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-6 md:px-6 lg:px-8 lg:py-8 xl:px-10">
        {/* =====================================================
            HEADER BANNER (Color changed to Indigo/Blue theme)
        ====================================================== */}
        <div className="mb-5 sm:mb-7 lg:mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-4 text-white shadow-lg sm:rounded-3xl sm:p-6 md:p-7 lg:p-8">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl sm:h-44 sm:w-44" />
            <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl sm:h-56 sm:w-56" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
              <div className="flex min-w-0 items-start gap-3 sm:gap-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/20 backdrop-blur-md sm:h-14 sm:w-14 sm:rounded-2xl lg:h-16 lg:w-16">
                  <ShieldAlert
                    size={23}
                    className="text-amber-300 sm:h-7 sm:w-7 lg:h-[34px] lg:w-[34px]"
                  />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl font-bold leading-tight sm:text-2xl md:text-3xl lg:text-4xl">
                    Session Inquiries & Disputes
                  </h1>
                  <p className="mt-2 max-w-2xl text-xs leading-5 text-indigo-100 sm:text-sm sm:leading-6 md:text-base">
                    Review and respond to session complaints filed by students.
                    Provide your statements in the 3-way moderation room.
                  </p>
                </div>
              </div>

              <div className="w-full rounded-xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-md sm:rounded-2xl sm:px-5 sm:py-4 lg:w-auto lg:min-w-[210px] lg:px-6 lg:py-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-lg font-bold text-indigo-700 sm:h-14 sm:w-14 sm:text-2xl">
                    {filteredDisputes.length}
                  </div>
                  <div className="flex-1 lg:flex-none">
                    <p className="text-[10px] uppercase tracking-wider text-indigo-100 sm:text-xs sm:text-sm">
                      Total
                    </p>
                    <h3 className="text-base font-semibold sm:text-lg lg:text-xl">
                      Inquiries
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            SEARCH & FILTER CONTROLS
        ====================================================== */}
        <div className="mb-5 space-y-4 sm:mb-7 lg:mb-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
            <div className="relative min-w-0 flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by student name, subject, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-13 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-700 shadow-sm outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:h-14 sm:rounded-2xl sm:text-base"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto bg-white p-2 rounded-xl border border-gray-200 shadow-sm sm:rounded-2xl sm:p-3">
              <Filter size={18} className="text-gray-400 ml-2 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 shrink-0 mr-1">
                Status:
              </span>
              {["All", "Open", "Under Review", "Resolved"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    statusFilter === status
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
        {filteredDisputes.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-12 shadow-sm sm:rounded-3xl sm:p-14 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 sm:h-20 sm:w-20 mb-4">
                <ShieldAlert
                  size={32}
                  className="text-indigo-300 sm:h-[38px] sm:w-[38px]"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 sm:text-2xl">
                {searchTerm || statusFilter !== "All"
                  ? "No Matching Inquiries Found"
                  : "No Inquiries Found"}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
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
                  className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredDisputes.map((d) => (
              <div
                key={d._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl sm:rounded-3xl flex flex-col justify-between p-5 sm:p-6"
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
                    <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md">
                      {d.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800 text-base sm:text-lg">
                      {d.subject}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 mb-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <User size={14} className="text-indigo-600" />
                        Student: {d.student?.firstName || "Unknown"}{" "}
                        {d.student?.lastName || ""}
                      </span>
                      {d.booking && (
                        <span className="flex items-center gap-1.5 font-semibold">
                          <Calendar size={14} className="text-indigo-600" />
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
                    <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 rounded-2xl border border-gray-100 line-clamp-2">
                      <strong className="text-gray-700">Reason:</strong>{" "}
                      {d.reason}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Created:{" "}
                    {new Date(d.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    onClick={() => navigate(`/mentor/disputes/${d._id}`)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-sm active:scale-95"
                  >
                    <MessageSquare size={15} /> Enter Room{" "}
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

export default MentorDisputes;
