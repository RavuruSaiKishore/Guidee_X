import { useEffect, useMemo, useState } from "react";
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
  X,
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
        return "bg-amber-100 text-amber-700";

      case "In Progress":
        return "bg-blue-100 text-blue-700";

      case "Resolved":
        return "bg-green-100 text-green-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin text-indigo-600" size={42} />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 pt-16 lg:ml-64 lg:pt-0">
      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-6 md:px-6 lg:px-8 lg:py-8 xl:px-10 space-y-6">
        {/* HEADER */}

        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 p-8 flex justify-between items-center overflow-hidden relative">
          <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>

          <div className="flex items-center gap-5 z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
              <MessageSquare size={30} className="text-white" />
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white">
                  Support Center
                </h1>

                <span className="px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs flex items-center gap-1">
                  <Sparkles size={13} />
                  GuideX
                </span>
              </div>

              <p className="text-slate-300 mt-2">
                Connect directly with the GuideX Administration Team
              </p>
            </div>
          </div>

          <div className="flex gap-3 z-10">
            <button
              onClick={fetchRequests}
              className="px-5 py-3 rounded-xl bg-white text-indigo-700 font-semibold flex items-center gap-2 hover:bg-slate-100 transition"
            >
              <RefreshCw size={18} />
              Refresh
            </button>

            <Link
              to="/mentor/create-request"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold flex items-center gap-2 shadow-lg"
            >
              <Plus size={18} />
              New Request
            </Link>
          </div>
        </div>
        {/* ===================== STATS ===================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500 font-medium">
                  Total Requests
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  {stats.total}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
                <MessageSquare className="text-indigo-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500 font-medium">Pending</p>

                <h2 className="text-3xl font-bold text-amber-600 mt-2">
                  {stats.pending}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
                <AlertCircle className="text-amber-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500 font-medium">
                  In Progress
                </p>

                <h2 className="text-3xl font-bold text-blue-600 mt-2">
                  {stats.progress}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                <Clock3 className="text-blue-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500 font-medium">Resolved</p>

                <h2 className="text-3xl font-bold text-green-600 mt-2">
                  {stats.resolved}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="text-green-600" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SEARCH ===================== */}

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 w-full">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by subject or category..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            <div className="relative">
              <Filter
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-10 py-3 rounded-2xl border border-slate-200 outline-none"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* ===================== NEW REQUEST MODAL ===================== */}
        {/* ===================== REQUESTS ===================== */}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Your Support Conversations
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                Track all conversations with the GuideX Administration Team.
              </p>
            </div>

            <div className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-semibold">
              {filteredRequests.length} Conversation
              {filteredRequests.length !== 1 && "s"}
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="py-20 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center">
                <MessageSquare size={42} className="text-indigo-500" />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-800">
                No Conversations Found
              </h3>

              <p className="text-slate-500 mt-2 max-w-md text-center">
                You haven't started any conversations with the administration
                team yet.
              </p>

              <Link
                to="/mentor/create-request"
                className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-7 py-3 rounded-2xl font-semibold hover:scale-105 transition"
              >
                Create First Request
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredRequests.map((item) => (
                <div
                  key={item._id}
                  className="px-8 py-6 hover:bg-slate-50 transition"
                >
                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                    {/* LEFT */}

                    <div className="flex gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                        {item.subject?.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold text-slate-900">
                            {item.subject}
                          </h3>

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <p className="mt-2 text-slate-600">{item.category}</p>

                        <div className="flex flex-wrap gap-6 mt-4 text-sm text-slate-500">
                          <span className="flex items-center gap-2">
                            <Calendar size={15} />

                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>

                          <span className="flex items-center gap-2">
                            <Clock3 size={15} />

                            {new Date(
                              item.lastMessageAt || item.createdAt
                            ).toLocaleString()}
                          </span>

                          <span className="flex items-center gap-2">
                            <MessageSquare size={15} />
                            {item.conversation?.length || 1} Messages
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}

                    <div className="flex flex-col items-end gap-4">
                      <Link
                        to={`/mentor/admin-chat/${item._id}`}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition"
                      >
                        Open Chat
                        <ArrowRight size={18} />
                      </Link>

                      {item.replied && (
                        <div className="text-sm text-green-600 font-medium">
                          ✓ Admin Replied
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorSupport;
