import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Inbox,
  Search,
  Filter,
  Calendar,
  Eye,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Plus,
  ArrowRight,
  Sparkles,
  Ticket,
  RefreshCw,
  ChevronDown,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// =====================================================
// SUPPORT INBOX
// =====================================================

const SupportInbox = () => {
  const token = localStorage.getItem("UserToken");

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  // =====================================================
  // FETCH SUPPORT REQUESTS
  // =====================================================

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/contact/my-requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch tickets");
      }

      setTickets(Array.isArray(data) ? data : data.requests || []);
    } catch (error) {
      console.error("Fetch tickets error:", error);

      toast.error(error.message || "Unable to load support requests");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchTickets();
  }, []);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const keyword = search.toLowerCase().trim();

      const matchStatus = status === "All" || ticket.status === status;

      const matchSearch =
        !keyword ||
        ticket.subject?.toLowerCase().includes(keyword) ||
        ticket.category?.toLowerCase().includes(keyword) ||
        ticket.message?.toLowerCase().includes(keyword);

      return matchStatus && matchSearch;
    });
  }, [tickets, search, status]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const stats = useMemo(() => {
    return {
      total: tickets.length,

      pending: tickets.filter((ticket) => ticket.status === "Pending").length,

      progress: tickets.filter((ticket) => ticket.status === "In Progress")
        .length,

      resolved: tickets.filter((ticket) => ticket.status === "Resolved").length,
    };
  }, [tickets]);

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusConfig = (ticketStatus) => {
    switch (ticketStatus) {
      case "Pending":
        return {
          icon: AlertCircle,
          badge: "border-amber-200 bg-amber-50 text-amber-700",
          dot: "bg-amber-500",
          label: "Awaiting Response",
        };

      case "In Progress":
        return {
          icon: Clock3,
          badge: "border-blue-200 bg-blue-50 text-blue-700",
          dot: "bg-blue-500",
          label: "Being Handled",
        };

      case "Resolved":
        return {
          icon: CheckCircle2,
          badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
          dot: "bg-emerald-500",
          label: "Resolved",
        };

      default:
        return {
          icon: Clock3,
          badge: "border-slate-200 bg-slate-50 text-slate-600",
          dot: "bg-slate-400",
          label: ticketStatus || "Unknown",
        };
    }
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearch("");
    setStatus("All");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      {/* ================================================= */}
      {/* TOP HEADER */}
      {/* ================================================= */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* BRAND */}

            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                <Inbox size={21} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                  GuideX Support
                </p>

                <h1 className="text-lg font-bold text-slate-900">
                  Support Inbox
                </h1>
              </div>
            </div>

            {/* ACTION */}

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700"
            >
              <Plus size={17} />

              <span className="hidden sm:inline">New Ticket</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ================================================= */}
      {/* COMPACT HERO */}
      {/* ================================================= */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 px-6 py-8 sm:px-8">
            {/* DECORATION */}

            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100 backdrop-blur">
                  <Sparkles size={14} />
                  Personalized Support
                </div>

                <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                  How can we help you?
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">
                  Track your support requests, view responses, and stay updated
                  with the GuideX support team.
                </p>
              </div>

              <div className="hidden lg:flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-white backdrop-blur">
                <Ticket size={34} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* STATS */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-5 pt-7 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total
                </p>

                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  {stats.total}
                </h3>

                <p className="mt-1 text-xs text-slate-500">All requests</p>
              </div>

              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <Inbox size={20} />
              </div>
            </div>
          </div>

          {/* PENDING */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Pending
                </p>

                <h3 className="mt-2 text-3xl font-bold text-amber-600">
                  {stats.pending}
                </h3>

                <p className="mt-1 text-xs text-slate-500">Awaiting response</p>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <AlertCircle size={20} />
              </div>
            </div>
          </div>

          {/* IN PROGRESS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  In Progress
                </p>

                <h3 className="mt-2 text-3xl font-bold text-blue-600">
                  {stats.progress}
                </h3>

                <p className="mt-1 text-xs text-slate-500">Being handled</p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Clock3 size={20} />
              </div>
            </div>
          </div>

          {/* RESOLVED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Resolved
                </p>

                <h3 className="mt-2 text-3xl font-bold text-emerald-600">
                  {stats.resolved}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Completed requests
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* SEARCH + FILTER */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* SEARCH */}

            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by subject, category or message..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            {/* FILTER */}

            <div className="relative lg:w-56">
              <Filter
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              >
                <option value="All">All Status</option>

                <option value="Pending">Pending</option>

                <option value="In Progress">In Progress</option>

                <option value="Resolved">Resolved</option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {/* CLEAR */}

            {(search || status !== "All") && (
              <button
                type="button"
                onClick={clearFilters}
                className="h-12 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Clear Filters
              </button>
            )}

            {/* REFRESH */}

            <button
              type="button"
              onClick={fetchTickets}
              className="flex h-12 items-center justify-center rounded-xl border border-slate-200 px-4 text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600"
              title="Refresh"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* TICKET CONTENT */}
      {/* ================================================= */}

      <main className="mx-auto max-w-7xl px-5 pb-12 sm:px-6 lg:px-8">
        {/* RESULT HEADER */}

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Support Requests
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredTickets.length} request
              {filteredTickets.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="flex gap-5">
                  <div className="h-12 w-12 rounded-xl bg-slate-200" />

                  <div className="flex-1 space-y-4">
                    <div className="h-4 w-24 rounded bg-slate-200" />

                    <div className="h-6 w-2/3 rounded bg-slate-200" />

                    <div className="h-4 w-full rounded bg-slate-200" />

                    <div className="h-4 w-1/2 rounded bg-slate-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTickets.length === 0 ? (
          /* ================================================= */
          /* EMPTY */
          /* ================================================= */

          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
              <Inbox size={30} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No support requests found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {search || status !== "All"
                ? "Try changing your search or filter to find another request."
                : "You haven't created any support requests yet."}
            </p>

            {search || status !== "All" ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                <Plus size={17} />
                Create Support Ticket
              </Link>
            )}
          </div>
        ) : (
          /* ================================================= */
          /* TICKET LIST */
          /* ================================================= */

          <div className="space-y-4">
            {filteredTickets.map((ticket) => {
              const statusConfig = getStatusConfig(ticket.status);

              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={ticket._id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-xl"
                >
                  {/* STATUS BAR */}

                  <div
                    className={`absolute left-0 top-0 h-full w-1 ${statusConfig.dot}`}
                  />

                  <div className="p-5 pl-7 sm:p-6 sm:pl-8">
                    {/* TOP */}

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      {/* LEFT */}

                      <div className="min-w-0 flex-1">
                        {/* META */}

                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${statusConfig.badge}`}
                          >
                            <StatusIcon size={13} />

                            {ticket.status}
                          </span>

                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                            {ticket.category}
                          </span>

                          <span className="text-xs text-slate-400">
                            #{ticket._id.slice(-6).toUpperCase()}
                          </span>
                        </div>

                        {/* TITLE */}

                        <h3 className="mt-4 text-xl font-bold text-slate-900 transition group-hover:text-indigo-600">
                          {ticket.subject}
                        </h3>

                        {/* MESSAGE */}

                        <p className="mt-2 max-w-4xl line-clamp-2 text-sm leading-6 text-slate-500">
                          {ticket.message}
                        </p>
                      </div>

                      {/* DATE */}

                      <div className="flex shrink-0 items-center gap-2 text-xs font-medium text-slate-400">
                        <Calendar size={15} />

                        {formatDate(ticket.createdAt)}
                      </div>
                    </div>

                    {/* ADMIN REPLY */}

                    {ticket.replied && (
                      <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                        <div className="flex items-center gap-2">
                          <MessageCircle
                            size={17}
                            className="text-emerald-600"
                          />

                          <span className="text-sm font-bold text-emerald-700">
                            GuideX Support replied
                          </span>
                        </div>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                          {ticket.adminReply}
                        </p>
                      </div>
                    )}

                    {/* FOOTER */}

                    <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock3 size={15} />
                        Last updated
                        <span className="font-semibold text-slate-600">
                          {formatDate(ticket.updatedAt || ticket.createdAt)}
                        </span>
                      </div>

                      <Link
                        to={`/support/${ticket._id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-600"
                      >
                        <Eye size={16} />
                        View Conversation
                        <ArrowRight
                          size={16}
                          className="transition group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default SupportInbox;
