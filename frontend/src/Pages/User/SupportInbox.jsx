import { useCallback, useEffect, useMemo, useState } from "react";
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
  X,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// =====================================================
// SUPPORT INBOX (High-End GuideX Theme with Modal Ticket Creation & Hero Button)
// =====================================================

const SupportInbox = () => {
  const token = localStorage.getItem("UserToken");

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "General Inquiry",
    subject: "",
    message: "",
  });

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
  // CREATE TICKET HANDLER
  // =====================================================

  const handleCreateTicket = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.category ||
      !formData.subject ||
      !formData.message
    ) {
      return toast.error("Please fill all required fields.");
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create support ticket");
      }

      toast.success(data.message || "Support request created successfully.");
      setIsModalOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "General Inquiry",
        subject: "",
        message: "",
      });
      fetchTickets();
    } catch (error) {
      console.error("Create ticket error:", error);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

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
          dot: "bg-blue-600",
          label: "Being Handled",
        };

      case "Resolved":
        return {
          icon: CheckCircle2,
          badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
          dot: "bg-emerald-600",
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
    <div
      className="min-h-screen bg-slate-50 text-slate-900"
      style={{ fontFamily: "'Poppins', sans-serif", fontStyle: "normal" }}
    >
      {/* ================================================= */}
      {/* TOP HEADER */}
      {/* ================================================= */}

      <header className="border-b border-slate-200 bg-white shadow-xs">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* BRAND */}

            <div className="flex items-center gap-3.5">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white shadow-md shadow-slate-200"
                style={{ fontWeight: 600 }}
              >
                <Inbox size={20} className="text-blue-400" />
              </div>

              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-widest text-blue-600"
                  style={{ fontWeight: 600 }}
                >
                  GuideX Support
                </p>

                <h1
                  className="text-lg font-semibold text-slate-900 tracking-tight"
                  style={{ fontWeight: 600 }}
                >
                  Support Inbox
                </h1>
              </div>
            </div>

            {/* ACTION IN HEADER */}

            {/* <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
              style={{ fontWeight: 600 }}
            >
              <Plus size={15} className="text-blue-400" />

              <span>New Ticket</span>
            </button> */}
          </div>
        </div>
      </header>

      {/* ================================================= */}
      {/* COMPACT HERO */}
      {/* ================================================= */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-black px-6 py-7 sm:px-8 text-white shadow-md">
            {/* DECORATION */}

            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />

            <div className="absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold text-blue-300 backdrop-blur"
                  style={{ fontWeight: 600 }}
                >
                  <Sparkles size={13} className="text-blue-400" />
                  Personalized Support Suite
                </div>

                <h2
                  className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                  style={{ fontWeight: 600 }}
                >
                  How can we assist you today?
                </h2>

                <p
                  className="mt-1.5 max-w-xl text-xs sm:text-sm text-slate-300 font-medium leading-relaxed"
                  style={{ fontWeight: 600 }}
                >
                  Track active inquiries, communicate directly with supervisors,
                  and manage all your technical support tickets in one
                  streamlined place.
                </p>
              </div>

              {/* REPLACED ONE LOGO BOX WITH NEW TICKET BUTTON */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-xs font-semibold text-white shadow-md transition hover:bg-blue-700"
                  style={{ fontWeight: 600 }}
                >
                  <Plus size={16} />
                  <span>Create Ticket</span>
                </button>

                <div
                  className="hidden lg:flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur shadow-inner"
                  style={{ fontWeight: 600 }}
                >
                  <Ticket size={28} className="text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* STATS */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-5 pt-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                  style={{ fontWeight: 600 }}
                >
                  Total Tickets
                </p>

                <h3
                  className="mt-1.5 text-2xl font-semibold text-slate-900 tracking-tight"
                  style={{ fontWeight: 600 }}
                >
                  {stats.total}
                </h3>

                <p
                  className="mt-0.5 text-[11px] text-slate-500 font-medium"
                  style={{ fontWeight: 600 }}
                >
                  All-time requests
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 p-3 text-slate-900">
                <Inbox size={18} />
              </div>
            </div>
          </div>

          {/* PENDING */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                  style={{ fontWeight: 600 }}
                >
                  Pending
                </p>

                <h3
                  className="mt-1.5 text-2xl font-semibold text-amber-600 tracking-tight"
                  style={{ fontWeight: 600 }}
                >
                  {stats.pending}
                </h3>

                <p
                  className="mt-0.5 text-[11px] text-slate-500 font-medium"
                  style={{ fontWeight: 600 }}
                >
                  Awaiting response
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <AlertCircle size={18} />
              </div>
            </div>
          </div>

          {/* IN PROGRESS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                  style={{ fontWeight: 600 }}
                >
                  In Progress
                </p>

                <h3
                  className="mt-1.5 text-2xl font-semibold text-blue-600 tracking-tight"
                  style={{ fontWeight: 600 }}
                >
                  {stats.progress}
                </h3>

                <p
                  className="mt-0.5 text-[11px] text-slate-500 font-medium"
                  style={{ fontWeight: 600 }}
                >
                  Being handled
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Clock3 size={18} />
              </div>
            </div>
          </div>

          {/* RESOLVED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                  style={{ fontWeight: 600 }}
                >
                  Resolved
                </p>

                <h3
                  className="mt-1.5 text-2xl font-semibold text-emerald-600 tracking-tight"
                  style={{ fontWeight: 600 }}
                >
                  {stats.resolved}
                </h3>

                <p
                  className="mt-0.5 text-[11px] text-slate-500 font-medium"
                  style={{ fontWeight: 600 }}
                >
                  Closed successfully
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 size={18} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* SEARCH + FILTER */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* SEARCH */}

            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tickets by subject, category, or description..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-xs font-semibold text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                style={{ fontWeight: 600 }}
              />
            </div>

            {/* FILTER */}

            <div className="relative lg:w-52">
              <Filter
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-xs font-semibold text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                style={{ fontWeight: 600 }}
              >
                <option value="All">All Status</option>

                <option value="Pending">Pending</option>

                <option value="In Progress">In Progress</option>

                <option value="Resolved">Resolved</option>
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {/* CLEAR */}

            {(search || status !== "All") && (
              <button
                type="button"
                onClick={clearFilters}
                className="h-11 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                style={{ fontWeight: 600 }}
              >
                Clear Filters
              </button>
            )}

            {/* REFRESH */}

            <button
              type="button"
              onClick={fetchTickets}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
              title="Refresh Tickets"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* TICKET CONTENT */}
      {/* ================================================= */}

      <main className="mx-auto max-w-7xl px-5 pb-12 sm:px-6 lg:px-8">
        {/* RESULT HEADER */}

        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2
              className="text-base font-semibold text-slate-900 tracking-tight"
              style={{ fontWeight: 600 }}
            >
              Support Tickets
            </h2>

            <p
              className="text-xs text-slate-500 font-medium"
              style={{ fontWeight: 600 }}
            >
              Showing {filteredTickets.length} matching request
              {filteredTickets.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-100" />

                  <div className="flex-1 space-y-3">
                    <div className="h-3 w-20 rounded bg-slate-100" />

                    <div className="h-5 w-1/2 rounded bg-slate-100" />

                    <div className="h-3 w-full rounded bg-slate-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTickets.length === 0 ? (
          /* ================================================= */
          /* EMPTY */
          /* ================================================= */

          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Inbox size={26} />
            </div>

            <h3
              className="mt-4 text-base font-semibold text-slate-900 tracking-tight"
              style={{ fontWeight: 600 }}
            >
              No support requests found
            </h3>

            <p
              className="mx-auto mt-1 max-w-sm text-xs text-slate-500 font-medium leading-relaxed"
              style={{ fontWeight: 600 }}
            >
              {search || status !== "All"
                ? "Try clearing your filters or altering search keywords to see results."
                : "You haven't submitted any support requests yet. Our support team is always ready to help."}
            </p>

            {search || status !== "All" ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-black px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 shadow-xs"
                style={{ fontWeight: 600 }}
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 shadow-xs"
                style={{ fontWeight: 600 }}
              >
                <Plus size={15} className="text-blue-400" />
                Create Support Ticket
              </button>
            )}
          </div>
        ) : (
          /* ================================================= */
          /* TICKET LIST */
          /* ================================================= */

          <div className="space-y-3">
            {filteredTickets.map((ticket) => {
              const statusConfig = getStatusConfig(ticket.status);

              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={ticket._id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:border-blue-300 hover:shadow-md p-5 sm:p-6"
                >
                  {/* TOP */}

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    {/* LEFT */}

                    <div className="min-w-0 flex-1">
                      {/* META */}

                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${statusConfig.badge}`}
                          style={{ fontWeight: 600 }}
                        >
                          <StatusIcon size={12} />

                          {ticket.status}
                        </span>

                        <span
                          className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200"
                          style={{ fontWeight: 600 }}
                        >
                          {ticket.category}
                        </span>

                        <span
                          className="text-[11px] font-semibold text-slate-400"
                          style={{ fontWeight: 600 }}
                        >
                          ID: #{ticket._id.slice(-6).toUpperCase()}
                        </span>
                      </div>

                      {/* TITLE */}

                      <h3
                        className="mt-3 text-base font-semibold text-slate-900 group-hover:text-blue-600 transition tracking-tight"
                        style={{ fontWeight: 600 }}
                      >
                        {ticket.subject}
                      </h3>

                      {/* MESSAGE */}

                      <p
                        className="mt-1.5 max-w-4xl line-clamp-2 text-xs text-slate-600 font-medium leading-relaxed"
                        style={{ fontWeight: 600 }}
                      >
                        {ticket.message}
                      </p>
                    </div>

                    {/* DATE */}

                    <div
                      className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 self-start"
                      style={{ fontWeight: 600 }}
                    >
                      <Calendar size={13} className="text-slate-400" />

                      {formatDate(ticket.createdAt)}
                    </div>
                  </div>

                  {/* ADMIN REPLY */}

                  {ticket.replied && (
                    <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                      <div
                        className="flex items-center gap-2 text-xs font-semibold text-emerald-800"
                        style={{ fontWeight: 600 }}
                      >
                        <MessageCircle size={15} className="text-emerald-600" />
                        GuideX Support Responded
                      </div>

                      <p
                        className="mt-1.5 line-clamp-2 text-xs text-slate-700 font-medium leading-relaxed"
                        style={{ fontWeight: 600 }}
                      >
                        {ticket.adminReply}
                      </p>
                    </div>
                  )}

                  {/* FOOTER */}

                  <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div
                      className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold"
                      style={{ fontWeight: 600 }}
                    >
                      <Clock3 size={13} />
                      Last updated:{" "}
                      <span className="text-slate-700">
                        {formatDate(ticket.updatedAt || ticket.createdAt)}
                      </span>
                    </div>

                    <Link
                      to={`/support/${ticket._id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 shadow-xs"
                      style={{ fontWeight: 600 }}
                    >
                      <Eye size={14} className="text-blue-400" />
                      View Conversation
                      <ArrowRight
                        size={14}
                        className="transition group-hover:translate-x-0.5 text-blue-400"
                      />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ================================================= */}
      {/* NEW TICKET MODAL */}
      {/* ================================================= */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-6 sm:p-8 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-widest text-blue-600"
                  style={{ fontWeight: 600 }}
                >
                  Help Center
                </p>
                <h2
                  className="text-lg font-semibold text-slate-900 tracking-tight"
                  style={{ fontWeight: 600 }}
                >
                  Create Support Ticket
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1"
                    style={{ fontWeight: 600 }}
                  >
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter full name"
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-slate-50"
                    style={{ fontWeight: 600 }}
                  />
                </div>

                <div>
                  <label
                    className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1"
                    style={{ fontWeight: 600 }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter your email"
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-slate-50"
                    style={{ fontWeight: 600 }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1"
                    style={{ fontWeight: 600 }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Optional phone number"
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-slate-50"
                    style={{ fontWeight: 600 }}
                  />
                </div>

                <div>
                  <label
                    className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1"
                    style={{ fontWeight: 600 }}
                  >
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-slate-50"
                    style={{ fontWeight: 600 }}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Payment & Billing">Payment & Billing</option>
                    <option value="Mentorship Issues">Mentorship Issues</option>
                    <option value="Course Feedback">Course Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1"
                  style={{ fontWeight: 600 }}
                >
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="Summary of your issue"
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-slate-50"
                  style={{ fontWeight: 600 }}
                />
              </div>

              <div>
                <label
                  className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1"
                  style={{ fontWeight: 600 }}
                >
                  Message Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Provide precise details about your request..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-slate-50"
                  style={{ fontWeight: 600 }}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 font-semibold text-xs text-slate-700 transition"
                  style={{ fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 py-3 bg-black hover:bg-slate-800 text-white rounded-xl font-semibold text-xs shadow-sm transition disabled:opacity-50"
                  style={{ fontWeight: 600 }}
                >
                  {submitting ? "Submitting..." : "Submit Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportInbox;