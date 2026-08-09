import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Search,
  RefreshCw,
  Mail,
  Clock3,
  CheckCircle2,
  Loader2,
  Eye,
  MessageSquareMore,
  User,
  Calendar,
  AlertCircle,
  Inbox,
  Filter,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const AdminContactRequests = () => {
  const token = localStorage.getItem("AdminToken");

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 10;

  // =========================
  // FETCH CONTACT REQUESTS
  // =========================

  useEffect(() => {
    fetchContacts();
  }, [page, search, status, category]);

  const fetchContacts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) {
        params.append("search", search);
      }

      if (status) {
        params.append("status", status);
      }

      if (category) {
        params.append("category", category);
      }

      const response = await fetch(
        `${API_BASE_URL}/api/admin/contact-requests?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch contact requests.");
      }

      setContacts(data.contacts || []);
      setPages(data.pages || 1);
      setTotal(data.count || 0);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load contact requests.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // STATISTICS
  // =========================

  const stats = useMemo(() => {
    return {
      total: contacts.length,

      pending: contacts.filter((item) => item.status === "Pending").length,

      progress: contacts.filter((item) => item.status === "In Progress").length,

      resolved: contacts.filter((item) => item.status === "Resolved").length,

      replied: contacts.filter((item) => item.replied).length,
    };
  }, [contacts]);

  // =========================
  // STATUS BADGE
  // =========================

  const getBadgeColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border border-amber-200/60";

      case "In Progress":
        return "bg-sky-50 text-sky-700 border border-sky-200/60";

      case "Resolved":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";

      default:
        return "bg-slate-100 text-slate-700 border border-slate-200/60";
    }
  };

  // =========================
  // RESET FILTERS
  // =========================

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
    setCategory("");
    setPage(1);
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-indigo-100"></div>
          <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>
        </div>
        <p className="mt-6 text-base font-medium text-slate-700">
          Loading contact requests...
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Please wait while we secure your data.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-indigo-500 selection:text-white pb-16">
      {/* ================================================= */}
      {/* HERO HEADER */}
      {/* ================================================= */}

      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Inbox className="w-7 h-7 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Contact Requests Inbox
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Review, filter, and respond to learner inquiries, technical
                  tickets, and support logs.
                </p>
              </div>
            </div>

            <button
              onClick={fetchContacts}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold transition active:scale-95 shadow-sm"
            >
              <RefreshCw
                size={16}
                className={`${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh Inquiries</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* ================================================= */}
        {/* STATISTICS METRICS GRID */}
        {/* ================================================= */}

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {/* TOTAL */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Mail size={18} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-bold text-slate-900">{total}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Total tickets recorded
              </p>
            </div>
          </div>

          {/* PENDING */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                Pending
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <AlertCircle size={18} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-bold text-slate-900">
                {stats.pending}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Awaiting initial action
              </p>
            </div>
          </div>

          {/* IN PROGRESS */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-500">
                In Progress
              </span>
              <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                <Clock3 size={18} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-bold text-slate-900">
                {stats.progress}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Currently being addressed
              </p>
            </div>
          </div>

          {/* RESOLVED */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
                Resolved
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-bold text-slate-900">
                {stats.resolved}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Successfully closed
              </p>
            </div>
          </div>

          {/* REPLIED */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-500">
                Replied
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <MessageSquareMore size={18} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-bold text-slate-900">
                {stats.replied}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Admin responses sent
              </p>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* FILTERS BAR */}
        {/* ================================================= */}

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row items-center gap-3">
            {/* SEARCH */}
            <div className="relative w-full flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by student name, email, or content..."
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition"
              />
            </div>

            {/* STATUS FILTER */}
            <div className="w-full lg:w-48">
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm text-slate-700 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* CATEGORY FILTER */}
            <div className="w-full lg:w-56">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm text-slate-700 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Mentorship">Mentorship</option>
                <option value="Course Support">Course Support</option>
                <option value="Booking Issue">Booking Issue</option>
                <option value="Payment Issue">Payment Issue</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Career Guidance">Career Guidance</option>
                <option value="Feedback / Suggestions">
                  Feedback / Suggestions
                </option>
              </select>
            </div>

            {/* CLEAR FILTERS */}
            {(search || status || category) && (
              <button
                onClick={handleResetFilters}
                className="w-full lg:w-auto h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition shrink-0"
              >
                <X size={14} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* ================================================= */}
        {/* DATA TABLE CONTAINER */}
        {/* ================================================= */}

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Inquiry List
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {contacts.length} requests on current view
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Filter size={14} />
              <span>
                Page {page} of {pages || 1}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-indigo-600" size={32} />
              <p className="mt-3 text-sm font-medium text-slate-600">
                Fetching records...
              </p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400 mb-4">
                <Mail size={26} />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No contact requests found
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Try modifying your search criteria or clearing active filters to
                view available logs.
              </p>
              {(search || status || category) && (
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-3.5">Student</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Reply Status</th>
                    <th className="px-6 py-3.5">Submitted Date</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {contacts.map((contact) => (
                    <tr
                      key={contact._id}
                      className="hover:bg-slate-50/80 transition group"
                    >
                      {/* STUDENT INFO */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 font-bold text-sm">
                            {contact.name ? (
                              contact.name.charAt(0).toUpperCase()
                            ) : (
                              <User size={18} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-slate-900 truncate max-w-[200px]">
                              {contact.name}
                            </h4>
                            <p className="text-xs text-slate-500 truncate max-w-[220px]">
                              {contact.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                          {contact.category}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(
                            contact.status
                          )}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              contact.status === "Pending"
                                ? "bg-amber-500"
                                : contact.status === "In Progress"
                                ? "bg-sky-500"
                                : "bg-emerald-500"
                            }`}
                          />
                          {contact.status}
                        </span>
                      </td>

                      {/* REPLY STATUS */}
                      <td className="px-6 py-4">
                        {contact.replied ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                            <CheckCircle2
                              size={13}
                              className="text-emerald-600"
                            />
                            Replied
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/60">
                            <Clock3 size={13} className="text-rose-600" />
                            Awaiting Reply
                          </span>
                        )}
                      </td>

                      {/* SUBMITTED DATE */}
                      <td className="px-6 py-4 text-xs font-medium text-slate-600">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <Calendar size={13} className="text-slate-400" />
                          {new Date(contact.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/admin/contact-requests-details/${contact._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white text-xs font-semibold transition shadow-sm active:scale-95"
                        >
                          <Eye size={14} />
                          <span>View Details</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================================================= */}
          {/* PAGINATION BAR */}
          {/* ================================================= */}

          {!loading && contacts.length > 0 && pages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 font-medium">
                Showing page{" "}
                <span className="font-bold text-slate-700">{page}</span> of{" "}
                <span className="font-bold text-slate-700">{pages}</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
                >
                  <ChevronLeft size={14} />
                  <span>Previous</span>
                </button>

                <button
                  disabled={page === pages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContactRequests;
