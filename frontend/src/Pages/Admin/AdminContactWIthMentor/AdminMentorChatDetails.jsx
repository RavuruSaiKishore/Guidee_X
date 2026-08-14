import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Send,
  Loader2,
  Trash2,
  ShieldCheck,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const AdminMentorChatDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const token = localStorage.getItem("AdminToken");

  const chatRef = useRef(null);

  const [request, setRequest] = useState(null);

  const [loading, setLoading] = useState(true);

  const [reply, setReply] = useState("");

  const [status, setStatus] = useState("Pending");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  // =========================
  // FETCH CHAT
  // =========================

  const fetchRequest = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/mentor-contact/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setRequest(data.contact);

      setStatus(data.contact.status || "Pending");

      setTimeout(() => {
        chatRef.current?.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 300);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ADMIN REPLY
  // =========================

  const sendReply = async () => {
    if (!reply.trim()) {
      return toast.error("Enter message");
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_BASE_URL}/api/mentor-contact/admin/${id}/reply`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            adminReply: reply,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      toast.success("Reply sent");

      setRequest((prev) => ({
        ...prev,
        status,
        conversation: [
          ...(prev.conversation || []),
          {
            _id: Date.now(),
            sender: "Admin",
            message: reply,
            sentAt: new Date(),
          },
        ],
      }));

      setReply("");

      setTimeout(() => {
        chatRef.current?.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE CHAT
  // =========================

  const deleteRequest = async () => {
    const confirmDelete = window.confirm("Delete this conversation?");

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/mentor-contact/admin/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Delete failed");

      toast.success("Conversation deleted");

      navigate("/admin/mentor-requests");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusUI = {
    Pending: {
      icon: AlertCircle,
      badge: "border-amber-200 bg-amber-50 text-amber-700",
    },
    "In Progress": {
      icon: Clock,
      badge: "border-blue-200 bg-blue-50 text-blue-700",
    },
    Resolved: {
      icon: CheckCircle2,
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
  };

  if (loading) {
    return (
      <div
        className="h-screen flex items-center justify-center bg-slate-50"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <Loader2 size={45} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (!request) {
    return (
      <div
        className="h-screen flex items-center justify-center bg-slate-50 text-slate-900"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <h2 className="text-base font-semibold" style={{ fontWeight: 600 }}>
          Chat Not Found
        </h2>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-950 pb-12"
      style={{ fontFamily: "'Poppins', sans-serif", fontStyle: "normal" }}
    >
      {/* ================= REFINED PREMIUM HEADER ================= */}
      <section className="border-b border-slate-200 bg-white shadow-xs">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-6">
          <div className="relative overflow-hidden rounded-3xl bg-black px-6 py-7 sm:px-8 text-white shadow-md">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl" />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
                <Link
                  to="/admin/mentor-requests"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 border border-white/15 text-white hover:bg-white/20 transition backdrop-blur shadow-inner"
                >
                  <ArrowLeft size={20} className="text-blue-400" />
                </Link>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1
                      className="text-xl sm:text-2xl font-semibold tracking-tight text-white"
                      style={{ fontWeight: 600 }}
                    >
                      Mentor Support #{request._id?.slice(-8).toUpperCase()}
                    </h1>
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold border backdrop-blur ${
                        status === "Pending"
                          ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                          : status === "In Progress"
                          ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                          : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {status}
                    </span>
                  </div>
                  <p
                    className="mt-1.5 text-xs text-slate-300 font-medium truncate max-w-xl"
                    style={{ fontWeight: 600 }}
                  >
                    {request.subject ||
                      request.category ||
                      "Secure Support Channel"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={deleteRequest}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 backdrop-blur"
                  style={{ fontWeight: 600 }}
                >
                  <Trash2 size={15} className="text-red-400" />
                  <span>Delete Conversation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN LAYOUT: SPLIT WORKSPACE ================= */}
      <main className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT COLUMN: MENTOR & TICKET METADATA (4 Cols) ================= */}
          <div className="lg:col-span-4 space-y-6">
            {/* Mentor Profile Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs">
              <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black text-white text-sm font-semibold shadow-xs"
                  style={{ fontWeight: 600 }}
                >
                  {request.mentorId?.profileImage ? (
                    <img
                      src={`${API_BASE_URL}${request.mentorId?.profileImage}`}
                      alt=""
                      className="h-full w-full object-cover rounded-2xl"
                    />
                  ) : (
                    <span>{request.mentorId?.firstName?.charAt(0) || "M"}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <h2
                    className="text-xs font-semibold text-slate-900 truncate tracking-tight"
                    style={{ fontWeight: 600 }}
                  >
                    {request.mentorId?.firstName} {request.mentorId?.lastName}
                  </h2>
                  <p
                    className="text-[11px] text-blue-600 font-medium"
                    style={{ fontWeight: 600 }}
                  >
                    Registered Mentor
                  </p>
                </div>
              </div>

              <div
                className="mt-5 space-y-3.5 text-xs font-semibold text-slate-700"
                style={{ fontWeight: 600 }}
              >
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Mail size={15} className="text-blue-600 shrink-0" />
                  <span className="truncate">
                    {request.mentorId?.email || "No email provided"}
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Phone size={15} className="text-blue-600 shrink-0" />
                  <span>{request.mentorId?.phone || "No phone provided"}</span>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Calendar size={15} className="text-blue-600 shrink-0" />
                  <span>
                    Opened:{" "}
                    {new Date(request.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Ticket Metadata Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs">
              <h3
                className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4"
                style={{ fontWeight: 600 }}
              >
                Inquiry Details
              </h3>

              <div
                className="space-y-3 text-xs font-semibold text-slate-700"
                style={{ fontWeight: 600 }}
              >
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-400">Category</span>
                  <span className="text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {request.category || "General"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-400">Database ID</span>
                  <span className="text-slate-900 font-mono text-[10px]">
                    #{request._id.slice(-6).toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400">Messages Count</span>
                  <span className="text-slate-900">
                    {request.conversation?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: MERGED CHAT & REPLY HUB (8 Cols) ================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* Original Subject Banner */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xs">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-blue-600 mb-2">
                <HelpCircle size={14} />
                Subject: {request.subject}
              </div>
              <p
                className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-2"
                style={{ fontWeight: 600 }}
              >
                {request.subject}
              </p>
            </div>

            {/* Merged Interactive Chat Stream & Reply Hub */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="bg-slate-50/70 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-black text-white flex items-center justify-center shadow-xs">
                    <MessageSquare size={17} className="text-blue-400" />
                  </div>
                  <div>
                    <h3
                      className="text-xs font-semibold text-slate-900 tracking-tight"
                      style={{ fontWeight: 600 }}
                    >
                      Conversation Stream & Response Hub
                    </h3>
                    <p
                      className="text-[11px] text-slate-500 font-medium"
                      style={{ fontWeight: 600 }}
                    >
                      Official log and reply interface
                    </p>
                  </div>
                </div>

                <div
                  className="hidden sm:flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-[11px] font-semibold text-blue-700"
                  style={{ fontWeight: 600 }}
                >
                  <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                  Live Sync
                </div>
              </div>

              {/* Chat Messages Display (Fit width to content) */}
              <div
                ref={chatRef}
                className="p-6 space-y-4 max-h-[450px] overflow-y-auto bg-slate-50/30"
              >
                {request.conversation?.length > 0 ? (
                  request.conversation.map((chat) => (
                    <div
                      key={chat._id}
                      className={`flex ${
                        chat.sender === "Admin"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`
                          w-fit
                          max-w-[85%]
                          sm:max-w-md
                          p-4
                          rounded-2xl
                          shadow-xs
                          ${
                            chat.sender === "Admin"
                              ? "bg-black text-white rounded-br-xs"
                              : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs"
                          }
                        `}
                      >
                        <div
                          className="flex items-center justify-between gap-4 mb-2"
                          style={{ fontWeight: 600 }}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`
                                w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-semibold
                                ${
                                  chat.sender === "Admin"
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-700 border border-slate-200"
                                }
                              `}
                            >
                              {chat.sender === "Admin" ? "A" : "M"}
                            </div>
                            <span className="text-xs">
                              {chat.sender === "Admin"
                                ? "GuideX Admin (You)"
                                : `${request.mentorId?.firstName || "Mentor"}`}
                            </span>
                          </div>

                          <span className="text-[10px] opacity-60">
                            {new Date(chat.sentAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        <p
                          className="text-xs leading-relaxed whitespace-pre-line font-medium"
                          style={{ fontWeight: 600 }}
                        >
                          {chat.message}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    className="text-center py-8 text-xs text-slate-400 font-semibold"
                    style={{ fontWeight: 600 }}
                  >
                    No message exchanges logged yet.
                  </div>
                )}
              </div>

              {/* Integrated Reply Box inside the Chat Container */}
              <div className="border-t border-slate-200 bg-white p-5 sm:p-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4
                        className="text-xs font-semibold text-slate-900 tracking-tight"
                        style={{ fontWeight: 600 }}
                      >
                        Reply & Update Status
                      </h4>
                      <p
                        className="text-[11px] text-slate-500 font-medium"
                        style={{ fontWeight: 600 }}
                      >
                        Dispatch a response directly to the mentor account
                      </p>
                    </div>

                    <div className="w-full sm:w-48">
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        style={{ fontWeight: 600 }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <textarea
                      rows={3}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Type your official reply here..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 resize-none"
                      style={{ fontWeight: 600 }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end pt-3 border-t border-slate-100">
                  <button
                    onClick={sendReply}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-black hover:bg-slate-800 px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition disabled:opacity-50"
                    style={{ fontWeight: 600 }}
                  >
                    {saving ? (
                      <>
                        <Loader2
                          size={15}
                          className="animate-spin text-blue-400"
                        />
                        Dispatching...
                      </>
                    ) : (
                      <>
                        <Send size={15} className="text-blue-400" />
                        Send Reply & Save
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminMentorChatDetails;
