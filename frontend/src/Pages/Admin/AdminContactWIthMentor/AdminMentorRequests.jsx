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
  X,
  Send,
  Filter,
  Sparkles,
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
    setShowModal(true);
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
      Pending: "bg-amber-100 text-amber-800 border-amber-300 shadow-xs",
      "In Progress":
        "bg-indigo-100 text-indigo-800 border-indigo-300 shadow-xs",
      Resolved: "bg-emerald-100 text-emerald-800 border-emerald-300 shadow-xs",
    };

    return style[value] || "bg-slate-100 text-slate-700 border-slate-300";
  };

  if (loading && requests.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
        <Loader2 className="animate-spin text-indigo-600" size={42} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50/50 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-950 via-indigo-900 to-violet-900 shadow-2xl">
        {/* Background Glow */}
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-purple-500/20 blur-[120px]" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative z-10 flex flex-col gap-8 p-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-xl">
              <MessageSquare size={36} className="text-white" />
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight text-white">
                  Mentor Conversations
                </h1>

                <span className="rounded-full border border-indigo-300/20 bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200 backdrop-blur">
                  Admin Portal
                </span>
              </div>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                Manage mentor support conversations, respond to queries, and
                keep communication organized from one secure workspace.
              </p>
            </div>
          </div>

          {/* Right */}

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={fetchRequests}
              className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/20"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              onClick={() => navigate("/admin/mentor-chat/create")}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Plus size={18} />
              New Conversation
            </button>
          </div>
        </div>
      </div>
      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Card */}
        <div className="bg-white border border-indigo-100 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition group">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Total Chats
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              {stats.total}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition duration-300">
            <MessageSquare size={22} />
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white border border-amber-100 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition group">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
              Pending Review
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              {stats.pending}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition duration-300">
            <AlertCircle size={22} />
          </div>
        </div>

        {/* In Progress Card */}
        <div className="bg-white border border-blue-100 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition group">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              In Progress
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              {stats.progress}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition duration-300">
            <Clock3 size={22} />
          </div>
        </div>

        {/* Resolved Card */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition group">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Resolved
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              {stats.resolved}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition duration-300">
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search
            size={18}
            className="absolute left-4 top-3.5 text-indigo-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mentor name or email..."
            className="w-full border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-indigo-500 hidden sm:block" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full sm:w-48 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 bg-slate-50/50 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gradient-to-r from-slate-100 to-indigo-50/50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="px-6 py-4">Mentor</th>
                <th className="px-6 py-4">Subject & Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-16 text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                        <MessageSquare size={30} />
                      </div>
                      <p className="font-semibold text-slate-700 text-base">
                        No conversations found
                      </p>
                      <p className="text-xs text-slate-400">
                        Try adjusting your filters or search criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-indigo-50/40 transition duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-2xl border border-slate-200 shadow-md">
                          <img
                            src={`${API_BASE_URL}${item.mentorId?.profileImage}`}
                            alt={`${item.mentorId?.firstName} ${item.mentorId?.lastName}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://ui-avatars.com/api/?name=Mentor&background=6366f1&color=fff";
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">
                            {item.mentorId?.firstName} {item.mentorId?.lastName}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {item.mentorId?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800 truncate max-w-xs">
                        {item.subject}
                      </p>
                      <span className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/60">
                        {item.category}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badge(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={15} className="text-indigo-400" />
                        <span className="text-xs font-medium">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div
                        className="
flex
justify-center
items-center
gap-2
"
                      >
                        <Link
                          to={`/admin/mentor-chats/${item._id}`}
                          className="
inline-flex
items-center
gap-1.5
bg-indigo-600
hover:bg-indigo-700
text-white
px-4
py-2
rounded-xl
text-xs
font-semibold
transition
"
                        >
                          <Eye size={15} />
                          View
                        </Link>

                        <button
                          onClick={() => {
                            setSelectedChatId(item._id);
                            setShowDeleteModal(true);
                          }}
                          className="
w-9
h-9
rounded-xl
bg-red-50
text-red-600
hover:bg-red-100
flex
items-center
justify-center
transition
"
                          title="Delete Conversation"
                        >
                          <Trash2 size={16} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 p-7 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-100 text-red-600 mx-auto mb-5">
              <Trash2 size={28} />
            </div>

            <h2 className="text-xl font-bold text-center text-slate-900">
              Delete Conversation?
            </h2>

            <p className="mt-3 text-sm text-center text-slate-500 leading-6">
              Are you sure you want to delete this mentor conversation? This
              action cannot be undone.
            </p>

            <div className="flex justify-center gap-3 mt-7">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedChatId(null);
                }}
                className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
              >
                Cancel
              </button>

              <button
                disabled={deleting}
                onClick={deleteChat}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
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
