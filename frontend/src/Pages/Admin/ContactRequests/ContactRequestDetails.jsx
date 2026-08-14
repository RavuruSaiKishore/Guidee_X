import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Tag,
  Clock,
  Trash2,
  Send,
  Loader2,
  MessageSquare,
  ShieldCheck,
  Ticket,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const AdminContactDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("AdminToken");

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    fetchContact();
  }, [id]);

  // ==========================
  // FETCH CONTACT
  // ==========================

  const fetchContact = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/admin/contact-requests/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load request");
      }

      setContact(data.contact);
      setReply(data.contact.adminReply || "");
      setStatus(data.contact.status || "Pending");
    } catch (error) {
      toast.error(error.message || "Unable to load request");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // SEND REPLY
  // ==========================

  const handleReply = async () => {
    if (!reply.trim()) {
      return toast.error("Please enter reply message");
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_BASE_URL}/api/admin/contact-requests/${id}/reply`,
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

      if (!response.ok) {
        throw new Error(data.message || "Reply failed");
      }

      toast.success("Reply sent successfully");

      const newMessage = {
        _id: Date.now(),
        sender: "Admin",
        message: reply,
        sentAt: new Date(),
      };

      setContact((prev) => ({
        ...prev,
        status,
        replied: true,
        repliedAt: new Date(),
        adminReply: reply,
        conversation: [...(prev.conversation || []), newMessage],
      }));
    } catch (error) {
      toast.error(error.message || "Reply failed");
    } finally {
      setSaving(false);
    }
  };

  // ==========================
  // DELETE REQUEST
  // ==========================

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this contact request?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/contact-requests/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      toast.success("Request deleted");

      navigate("/admin/contact-requests");
    } catch (error) {
      toast.error(error.message || "Delete failed");
    }
  };

  // ==========================
  // LOADING
  // ==========================

  if (loading) {
    return (
      <div
        className="fixed inset-0 flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-slate-200" />
          <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
        </div>
        <p
          className="mt-6 text-center text-xs font-semibold text-slate-900 tracking-tight"
          style={{ fontWeight: 600 }}
        >
          Loading Support Request Details...
        </p>
      </div>
    );
  }

  // ==========================
  // NOT FOUND
  // ==========================

  if (!contact) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 text-center text-slate-900"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
          <Ticket size={28} />
        </div>
        <h2
          className="text-base font-semibold text-slate-900 tracking-tight"
          style={{ fontWeight: 600 }}
        >
          Contact request not found
        </h2>
        <Link
          to="/admin/contact-requests"
          className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-slate-800 transition shadow-xs"
          style={{ fontWeight: 600 }}
        >
          <ArrowLeft size={14} className="text-blue-400" />
          Back to Requests
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 pb-12"
      style={{ fontFamily: "'Poppins', sans-serif", fontStyle: "normal" }}
    >
      {/* =====================================================
          PROFESSIONAL SPLIT HEADER BAR
      ====================================================== */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-2xs">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Link
                to="/admin/contact-requests"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
                title="Back to Requests"
              >
                <ArrowLeft size={17} />
              </Link>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1
                    className="text-sm font-semibold text-slate-900 tracking-tight truncate"
                    style={{ fontWeight: 600 }}
                  >
                    Ticket #{contact._id.slice(-8).toUpperCase()}
                  </h1>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${
                      status === "Pending"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : status === "In Progress"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {status}
                  </span>
                </div>
                <p
                  className="text-[11px] text-slate-500 font-medium truncate mt-0.5"
                  style={{ fontWeight: 600 }}
                >
                  {contact.subject || contact.category}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 shadow-2xs"
                style={{ fontWeight: 600 }}
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline">Delete Ticket</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN LAYOUT: SPLIT WORKSPACE
      ====================================================== */}
      <main className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* =================================================
              LEFT COLUMN: TICKET & STUDENT METADATA (4 Cols)
          ================================================== */}
          <div className="lg:col-span-4 space-y-6">
            {/* Student Profile Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs">
              <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black text-white text-sm font-semibold shadow-xs"
                  style={{ fontWeight: 600 }}
                >
                  {contact.studentId?.profileImage ? (
                    <img
                      src={`${API_BASE_URL}${contact.studentId.profileImage}`}
                      alt=""
                      className="h-full w-full object-cover rounded-2xl"
                    />
                  ) : (
                    <span>
                      {contact.studentId?.firstName?.charAt(0) ||
                        contact.name?.charAt(0) ||
                        "U"}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <h2
                    className="text-xs font-semibold text-slate-900 truncate tracking-tight"
                    style={{ fontWeight: 600 }}
                  >
                    {contact.studentId?.firstName || contact.name}{" "}
                    {contact.studentId?.lastName || ""}
                  </h2>
                  <p
                    className="text-[11px] text-blue-600 font-medium"
                    style={{ fontWeight: 600 }}
                  >
                    Student Inquirer
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
                    {contact.studentId?.email || contact.email}
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Phone size={15} className="text-blue-600 shrink-0" />
                  <span>{contact.phone || "No phone provided"}</span>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Calendar size={15} className="text-blue-600 shrink-0" />
                  <span>
                    Opened:{" "}
                    {new Date(contact.createdAt).toLocaleDateString("en-GB", {
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
                Ticket Information
              </h3>

              <div
                className="space-y-3 text-xs font-semibold text-slate-700"
                style={{ fontWeight: 600 }}
              >
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-400">Category</span>
                  <span className="text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {contact.category}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-400">Database ID</span>
                  <span className="text-slate-900 font-mono text-[10px]">
                    #{contact._id.slice(-6).toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400">Last Updated</span>
                  <span className="text-slate-900">
                    {new Date(
                      contact.updatedAt || contact.createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT COLUMN: CONVERSATION & REPLY HUB (8 Cols)
          ================================================== */}
          <div className="lg:col-span-8 space-y-6">
            {/* Original Problem Statement Banner */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xs">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-blue-600 mb-2">
                <HelpCircle size={14} />
                Initial Subject: {contact.subject}
              </div>
              <p
                className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-2"
                style={{ fontWeight: 600 }}
              >
                {contact.message}
              </p>
            </div>

            {/* Interactive Chat Stream */}
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
                      Conversation Stream
                    </h3>
                    <p
                      className="text-[11px] text-slate-500 font-medium"
                      style={{ fontWeight: 600 }}
                    >
                      Official logs between admin and student
                    </p>
                  </div>
                </div>

                <div
                  className="hidden sm:flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-[11px] font-semibold text-blue-700"
                  style={{ fontWeight: 600 }}
                >
                  <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                  Active Channel
                </div>
              </div>

              {/* Chat Messages Display */}
              <div className="p-6 space-y-4 max-h-[450px] overflow-y-auto bg-slate-50/30">
                {contact.conversation?.length > 0 ? (
                  contact.conversation.map((chat) => (
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
                          w-full
                          sm:max-w-xl
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
                          className="flex items-center justify-between gap-3 mb-2"
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
                              {chat.sender === "Admin" ? "A" : "S"}
                            </div>
                            <span className="text-xs">
                              {chat.sender === "Admin"
                                ? "GuideX Support (You)"
                                : contact.name}
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
            </div>

            {/* Admin Response & Control Box */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">
                  <ShieldCheck size={18} className="text-blue-400" />
                </div>
                <div>
                  <h3
                    className="text-sm font-semibold text-slate-900 tracking-tight"
                    style={{ fontWeight: 600 }}
                  >
                    Send Reply & Update Status
                  </h3>
                  <p
                    className="text-[11px] text-slate-500 font-medium"
                    style={{ fontWeight: 600 }}
                  >
                    Dispatch a response directly to the student dashboard
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
                    style={{ fontWeight: 600 }}
                  >
                    Target Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full sm:w-56 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    style={{ fontWeight: 600 }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
                    style={{ fontWeight: 600 }}
                  >
                    Message Reply *
                  </label>
                  <textarea
                    rows={4}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your official reply here..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 resize-none"
                    style={{ fontWeight: 600 }}
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end pt-4 border-t border-slate-100">
                <button
                  onClick={handleReply}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-black hover:bg-slate-800 px-6 py-3 text-xs font-semibold text-white shadow-sm transition disabled:opacity-50"
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
      </main>
    </div>
  );
};

export default AdminContactDetails;
