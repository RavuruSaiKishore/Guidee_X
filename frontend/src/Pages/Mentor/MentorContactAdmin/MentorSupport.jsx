import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  MessageSquare,
  Plus,
  Search,
  Loader2,
  Calendar,
  Clock3,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Filter,
  Sparkles,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const MentorSupport = () => {
  const token = localStorage.getItem("MentorToken");

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/mentor-contact/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch requests");
      }

      setRequests(data.contacts || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      const matchesSearch =
        item.subject.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter ? item.status === statusFilter : true;

      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === "Pending").length,
      progress: requests.filter((r) => r.status === "In Progress").length,
      resolved: requests.filter((r) => r.status === "Resolved").length,
    };
  }, [requests]);

  const badgeColor = (status) => {
    switch (status) {
      case "Pending":
        return "border-amber-200 bg-amber-50 text-amber-700";

      case "In Progress":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "Resolved":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";

      default:
        return "border-slate-200 bg-slate-50 text-slate-700";
    }
  };

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
            Loading Support Center...
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
      <main className="w-full max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8 space-y-4 sm:space-y-6">
        {/* ===================== HEADER ===================== */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-black p-4 sm:p-8 text-white shadow-md w-full">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 min-w-0">
              <div
                className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur shadow-inner text-blue-400"
                style={{ fontWeight: 600 }}
              >
                <MessageSquare size={22} className="sm:w-[26px] sm:h-[26px]" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-blue-300 backdrop-blur"
                    style={{ fontWeight: 600 }}
                  >
                    <Sparkles size={12} className="text-blue-400" />
                    GuideX Support
                  </span>
                </div>

                <h1
                  className="mt-1.5 sm:mt-2 text-xl sm:text-3xl font-semibold tracking-tight text-white"
                  style={{ fontWeight: 600 }}
                >
                  Support Center
                </h1>

                <p
                  className="mt-0.5 sm:mt-1 text-[11px] sm:text-sm text-slate-300 font-medium leading-relaxed"
                  style={{ fontWeight: 600 }}
                >
                  Connect directly with the GuideX Administration Team.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={fetchRequests}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/25 border border-white/15 text-xs font-semibold text-white backdrop-blur transition shadow-xs"
                style={{ fontWeight: 600 }}
              >
                <RefreshCw size={14} className="text-blue-400" />
                Refresh
              </button>

              <Link
                to="/mentor/create-request"
                className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-black hover:bg-slate-800 border border-white/20 text-xs font-semibold text-white transition shadow-xs"
                style={{ fontWeight: 600 }}
              >
                <Plus size={14} className="text-blue-400" />
                New Request
              </Link>
            </div>
          </div>
        </section>

        {/* ===================== STATS ===================== */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 text-xs font-semibold w-full">
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shrink-0">
                <MessageSquare size={18} />
              </div>
              <div className="min-w-0">
                <p
                  className="text-[9px] sm:text-[10px] uppercase tracking-wide text-slate-400"
                  style={{ fontWeight: 600 }}
                >
                  Total Requests
                </p>
                <p
                  className="text-sm sm:text-base font-semibold text-slate-900 mt-0.5"
                  style={{ fontWeight: 600 }}
                >
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-amber-600 shrink-0">
                <AlertCircle size={18} />
              </div>
              <div className="min-w-0">
                <p
                  className="text-[9px] sm:text-[10px] uppercase tracking-wide text-slate-400"
                  style={{ fontWeight: 600 }}
                >
                  Pending
                </p>
                <p
                  className="text-sm sm:text-base font-semibold text-amber-600 mt-0.5"
                  style={{ fontWeight: 600 }}
                >
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shrink-0">
                <Clock3 size={18} />
              </div>
              <div className="min-w-0">
                <p
                  className="text-[9px] sm:text-[10px] uppercase tracking-wide text-slate-400"
                  style={{ fontWeight: 600 }}
                >
                  In Progress
                </p>
                <p
                  className="text-sm sm:text-base font-semibold text-blue-600 mt-0.5"
                  style={{ fontWeight: 600 }}
                >
                  {stats.progress}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div className="min-w-0">
                <p
                  className="text-[9px] sm:text-[10px] uppercase tracking-wide text-slate-400"
                  style={{ fontWeight: 600 }}
                >
                  Resolved
                </p>
                <p
                  className="text-sm sm:text-base font-semibold text-emerald-600 mt-0.5"
                  style={{ fontWeight: 600 }}
                >
                  {stats.resolved}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== SEARCH ===================== */}
        <section className="space-y-3 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs w-full">
            <div className="relative min-w-0 flex-1 w-full">
              <Search
                size={16}
                className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by subject or category..."
                className="w-full h-10 sm:h-11 pl-10 sm:pl-11 pr-3 sm:pr-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                style={{ fontWeight: 600 }}
              />
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
              <Filter size={15} className="text-slate-400" />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full lg:w-48 h-10 sm:h-11 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                style={{ fontWeight: 600 }}
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </section>

        {/* ===================== REQUESTS ===================== */}
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-xs w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6 border-b border-slate-100">
            <div>
              <h2
                className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight"
                style={{ fontWeight: 600 }}
              >
                Your Support Conversations
              </h2>

              <p
                className="text-xs text-slate-500 font-medium mt-0.5"
                style={{ fontWeight: 600 }}
              >
                Track all conversations with the GuideX Administration Team.
              </p>
            </div>

            <span
              className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 w-fit"
              style={{ fontWeight: 600 }}
            >
              {filteredRequests.length} Conversation
              {filteredRequests.length !== 1 && "s"}
            </span>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3 sm:mb-4">
                <MessageSquare size={24} />
              </div>

              <h3
                className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight"
                style={{ fontWeight: 600 }}
              >
                No Conversations Found
              </h3>

              <p
                className="mt-1 max-w-sm mx-auto text-xs text-slate-500 font-medium leading-relaxed"
                style={{ fontWeight: 600 }}
              >
                You haven't started any conversations with the administration
                team yet.
              </p>

              <Link
                to="/mentor/create-request"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-black hover:bg-slate-800 px-5 py-2.5 text-xs font-semibold text-white transition shadow-xs"
                style={{ fontWeight: 600 }}
              >
                Create First Request
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredRequests.map((item) => (
                <article
                  key={item._id}
                  className="p-4 sm:p-6 hover:bg-slate-50 transition space-y-4"
                >
                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                    {/* LEFT */}
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div
                        className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-black text-white text-base font-semibold shadow-2xs"
                        style={{ fontWeight: 600 }}
                      >
                        {item.subject?.charAt(0).toUpperCase() || "S"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className="text-xs sm:text-sm font-semibold text-slate-900 tracking-tight truncate"
                            style={{ fontWeight: 600 }}
                          >
                            {item.subject}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-[10px] sm:text-[11px] font-semibold border ${badgeColor(
                              item.status
                            )}`}
                            style={{ fontWeight: 600 }}
                          >
                            {item.status}
                          </span>
                        </div>

                        <p
                          className="mt-0.5 text-[11px] text-slate-500 font-medium truncate"
                          style={{ fontWeight: 600 }}
                        >
                          {item.category}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 mt-2 text-[11px] text-slate-400 font-medium">
                          <span
                            className="flex items-center gap-1.5"
                            style={{ fontWeight: 600 }}
                          >
                            <Calendar size={13} className="text-blue-600" />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>

                          <span
                            className="flex items-center gap-1.5"
                            style={{ fontWeight: 600 }}
                          >
                            <Clock3 size={13} className="text-blue-600" />
                            {new Date(
                              item.lastMessageAt || item.createdAt
                            ).toLocaleString()}
                          </span>

                          <span
                            className="flex items-center gap-1.5"
                            style={{ fontWeight: 600 }}
                          >
                            <MessageSquare
                              size={13}
                              className="text-blue-600"
                            />
                            {item.conversation?.length || 1} Messages
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col sm:flex-row xl:flex-col items-start sm:items-center xl:items-end justify-between xl:justify-center gap-2.5 pt-2 xl:pt-0 border-t xl:border-t-0 border-slate-100">
                      <Link
                        to={`/mentor/admin-chat/${item._id}`}
                        className="w-full sm:w-auto xl:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-black hover:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white transition shadow-xs"
                        style={{ fontWeight: 600 }}
                      >
                        <span>Open Chat</span>
                        <ArrowRight size={13} className="text-blue-400" />
                      </Link>

                      {item.replied && (
                        <div
                          className="text-[11px] text-emerald-600 font-semibold"
                          style={{ fontWeight: 600 }}
                        >
                          ✓ Admin Replied
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MentorSupport;
