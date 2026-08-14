import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Search,
  RefreshCw,
  MessageSquare,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Eye,
  Calendar,
  Loader2,
  Plus,
  Filter,
  Trash2,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const AdminMentorRequests = () => {
  const token = localStorage.getItem("AdminToken");
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [search, status]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (status) params.append("status", status);

      const res = await fetch(
        `${API_BASE_URL}/api/mentor-contact/admin/all?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error(data.message);

      setRequests(data.contacts || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE CHAT =================

  const deleteChat = async () => {
    if (!selectedChatId) return;

    try {
      setDeleting(true);

      const res = await fetch(
        `${API_BASE_URL}/api/mentor-contact/admin/${selectedChatId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Conversation deleted successfully");

      setShowDeleteModal(false);
      setSelectedChatId(null);

      fetchRequests();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const openModal = () => {
    setShowDeleteModal(true);
  };

  const stats = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter((r) => r.status === "Pending").length,
      progress: requests.filter((r) => r.status === "In Progress").length,
      resolved: requests.filter((r) => r.status === "Resolved").length,
    }),
    [requests]
  );

  const badge = (value) => {
    const style = {
      Pending: "bg-slate-100 text-slate-800 border-slate-300 shadow-xs",
      "In Progress": "bg-blue-50 text-blue-700 border-blue-200 shadow-xs",
      Resolved: "bg-black text-white border-black shadow-xs",
    };

    return style[value] || "bg-slate-50 text-slate-700 border-slate-200";
  };

  if (loading && requests.length === 0) {
    return (
      <div
        className="h-screen flex items-center justify-center bg-slate-50"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <Loader2 className="animate-spin text-blue-600" size={42} />
      </div>
    );
  }

  return (
    <div
      className="p-4 sm:p-6 lg:p-8 w-full max-w-[1600px] mx-auto space-y-6 bg-slate-50 min-h-screen text-slate-900"
      style={{ fontFamily: "'Poppins', sans-serif", fontStyle: "normal" }}
    >
      {/* ================= HEADER ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-black shadow-md">
        {/* Background Accents */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur shadow-inner shrink-0">
              <MessageSquare size={28} className="text-blue-400" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1
                  className="text-2xl sm:text-3xl font-semibold tracking-tight text-white"
                  style={{ fontWeight: 600 }}
                >
                  Mentor Conversations
                </h1>

                <span
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-blue-300 backdrop-blur"
                  style={{ fontWeight: 600 }}
                >
                  Admin Portal
                </span>
              </div>

              <p
                className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-300 font-medium leading-relaxed"
                style={{ fontWeight: 600 }}
              >
                Manage mentor support conversations, respond to queries, and
                keep communication organized from one secure workspace.
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={fetchRequests}
              className="flex justify-center items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/10"
              style={{ fontWeight: 600 }}
            >
              <RefreshCw
                size={15}
                className={
                  loading ? "animate-spin text-blue-400" : "text-blue-400"
                }
              />
              Refresh
            </button>

            <button
              onClick={() => navigate("/admin/mentor-chat/create")}
              className="flex justify-center items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-semibold text-white shadow-md transition hover:bg-blue-700"
              style={{ fontWeight: 600 }}
            >
              <Plus size={15} />
              New Conversation
            </button>
          </div>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs transition hover:shadow-sm">
          <div>
            <p
              className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500"
              style={{ fontWeight: 600 }}
            >
              Total Chats
            </p>
            <h2
              className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-1 tracking-tight"
              style={{ fontWeight: 600 }}
            >
              {stats.total}
            </h2>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-slate-50 border border-slate-100 text-blue-600 flex items-center justify-center">
            <MessageSquare size={18} />
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs transition hover:shadow-sm">
          <div>
            <p
              className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500"
              style={{ fontWeight: 600 }}
            >
              Pending Review
            </p>
            <h2
              className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-1 tracking-tight"
              style={{ fontWeight: 600 }}
            >
              {stats.pending}
            </h2>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 flex items-center justify-center">
            <AlertCircle size={18} />
          </div>
        </div>

        {/* In Progress Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs transition hover:shadow-sm">
          <div>
            <p
              className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500"
              style={{ fontWeight: 600 }}
            >
              In Progress
            </p>
            <h2
              className="text-2xl sm:text-3xl font-semibold text-blue-600 mt-1 tracking-tight"
              style={{ fontWeight: 600 }}
            >
              {stats.progress}
            </h2>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
            <Clock3 size={18} />
          </div>
        </div>

        {/* Resolved Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs transition hover:shadow-sm">
          <div>
            <p
              className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500"
              style={{ fontWeight: 600 }}
            >
              Resolved
            </p>
            <h2
              className="text-2xl sm:text-3xl font-semibold text-black mt-1 tracking-tight"
              style={{ fontWeight: 600 }}
            >
              {stats.resolved}
            </h2>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-black text-white flex items-center justify-center">
            <CheckCircle2 size={18} />
          </div>
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mentor name, email, or subject..."
            className="w-full h-11 border border-slate-200 rounded-xl pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 bg-slate-50 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
            style={{ fontWeight: 600 }}
          />
        </div>

        <div className="relative w-full sm:w-56 shrink-0">
          <Filter
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full h-11 appearance-none border border-slate-200 rounded-xl pl-10 pr-8 text-xs font-semibold text-slate-800 bg-slate-50 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition cursor-pointer"
            style={{ fontWeight: 600 }}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th
                  className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                  style={{ fontWeight: 600 }}
                >
                  Mentor
                </th>
                <th
                  className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                  style={{ fontWeight: 600 }}
                >
                  Subject & Category
                </th>
                <th
                  className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                  style={{ fontWeight: 600 }}
                >
                  Status
                </th>
                <th
                  className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                  style={{ fontWeight: 600 }}
                >
                  Created Date
                </th>
                <th
                  className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-center"
                  style={{ fontWeight: 600 }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-16 text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <MessageSquare size={24} />
                      </div>
                      <p
                        className="font-semibold text-slate-900 text-sm tracking-tight"
                        style={{ fontWeight: 600 }}
                      >
                        No conversations found
                      </p>
                      <p
                        className="text-xs text-slate-500 font-medium"
                        style={{ fontWeight: 600 }}
                      >
                        Try adjusting your filters or search criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/50 transition duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3.5">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-black text-white flex items-center justify-center text-xs shadow-sm">
                          {item.mentorId?.profileImage ? (
                            <img
                              src={`${API_BASE_URL}${item.mentorId?.profileImage}`}
                              alt={`${item.mentorId?.firstName} ${item.mentorId?.lastName}`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <span style={{ fontWeight: 600 }}>
                              {item.mentorId?.firstName?.charAt(0) || "M"}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-xs font-semibold text-slate-900 truncate"
                            style={{ fontWeight: 600 }}
                          >
                            {item.mentorId?.firstName} {item.mentorId?.lastName}
                          </p>
                          <p
                            className="text-[11px] text-slate-500 font-medium truncate"
                            style={{ fontWeight: 600 }}
                          >
                            {item.mentorId?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p
                        className="text-xs font-semibold text-slate-900 truncate max-w-xs"
                        style={{ fontWeight: 600 }}
                      >
                        {item.subject}
                      </p>
                      <span
                        className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                        style={{ fontWeight: 600 }}
                      >
                        {item.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${badge(
                          item.status
                        )}`}
                        style={{ fontWeight: 600 }}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg w-fit">
                        <Calendar size={13} className="text-blue-600" />
                        <span
                          className="text-[11px] font-semibold text-slate-700"
                          style={{ fontWeight: 600 }}
                        >
                          {new Date(item.createdAt).toLocaleDateString("en-GB")}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center items-center gap-2">
                        <Link
                          to={`/admin/mentor-chats/${item._id}`}
                          className="inline-flex items-center gap-1.5 bg-black hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm"
                          style={{ fontWeight: 600 }}
                        >
                          <Eye size={14} className="text-blue-400" />
                          View
                        </Link>

                        <button
                          onClick={() => {
                            setSelectedChatId(item._id);
                            setShowDeleteModal(true);
                          }}
                          className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-black flex items-center justify-center transition shadow-sm"
                          title="Delete Conversation"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= DELETE MODAL ================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white shadow-xl border border-slate-200 p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 text-black mx-auto mb-4 border border-slate-200">
              <Trash2 size={24} />
            </div>

            <h2
              className="text-base font-semibold text-center text-slate-900 tracking-tight"
              style={{ fontWeight: 600 }}
            >
              Delete Conversation?
            </h2>

            <p
              className="mt-2 text-xs text-center text-slate-500 font-medium leading-relaxed"
              style={{ fontWeight: 600 }}
            >
              Are you sure you want to delete this mentor conversation? This
              action cannot be undone.
            </p>

            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedChatId(null);
                }}
                className="w-1/2 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                style={{ fontWeight: 600 }}
              >
                Cancel
              </button>

              <button
                disabled={deleting}
                onClick={deleteChat}
                className="w-1/2 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-black hover:bg-slate-800 text-white text-xs font-semibold transition disabled:opacity-50 shadow-sm"
                style={{ fontWeight: 600 }}
              >
                {deleting ? (
                  <Loader2 size={14} className="animate-spin text-blue-400" />
                ) : (
                  <Trash2 size={14} className="text-blue-400" />
                )}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMentorRequests;
