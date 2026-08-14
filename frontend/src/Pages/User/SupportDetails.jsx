import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import {
  ArrowLeft,
  Loader2,
  User,
  ShieldCheck,
  Tag,
  MessageCircle,
  CheckCircle2,
  CircleAlert,
  Send,
  Clock,
  Sparkles,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const SupportDetails = () => {
  const { id } = useParams();

  const token = localStorage.getItem("UserToken");

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchTicket();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [ticket]);

  const fetchTicket = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/contact/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTicket(data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load support ticket"
      );
    } finally {
      setLoading(false);
    }
  };

  const sendReply = async () => {
    if (!message.trim()) return;

    try {
      setSending(true);

      const { data } = await axios.post(
        `${API_BASE_URL}/api/contact/${id}/reply`,
        {
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);

      setTicket((prev) => ({
        ...prev,

        conversation: [
          ...(prev.conversation || []),
          {
            _id: Date.now(),

            sender: "Student",

            message,

            sentAt: new Date(),
          },
        ],
      }));

      setMessage("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      sendReply();
    }
  };

  const statusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-slate-50"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <Loader2 size={45} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 pb-12"
      style={{ fontFamily: "'Poppins', sans-serif", fontStyle: "normal" }}
    >
      {/* ================================================= */}
      {/* HEADER SECTION */}
      {/* ================================================= */}
      <header className="border-b border-slate-200 bg-white shadow-xs">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link
              to="/support-inbox"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 transition hover:text-blue-600"
              style={{ fontWeight: 600 }}
            >
              <ArrowLeft size={16} />
              Back to Support Inbox
            </Link>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${statusStyle(
                  ticket.status
                )}`}
                style={{ fontWeight: 600 }}
              >
                {ticket.status === "Resolved" ? (
                  <CheckCircle2 size={13} />
                ) : (
                  <CircleAlert size={13} />
                )}
                {ticket.status}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ================================================= */}
      {/* TICKET DETAILS HERO CARD */}
      {/* ================================================= */}
      <section className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8 pt-8">
        <div className="bg-black text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold text-blue-300 backdrop-blur"
                style={{ fontWeight: 600 }}
              >
                <Sparkles size={13} className="text-blue-400" />
                Ticket #{ticket._id.slice(-8).toUpperCase()}
              </div>

              <h1
                className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-white"
                style={{ fontWeight: 600 }}
              >
                {ticket.subject}
              </h1>

              <div
                className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300"
                style={{ fontWeight: 600 }}
              >
                <span className="flex items-center gap-1.5">
                  <Tag size={13} className="text-blue-400" />
                  Category:{" "}
                  <span className="text-white">{ticket.category}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-blue-400" />
                  Created:{" "}
                  <span className="text-white">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </span>
              </div>
            </div>

            <div
              className="bg-white/10 border border-white/15 backdrop-blur rounded-2xl px-5 py-4 text-xs font-semibold text-slate-300 shrink-0"
              style={{ fontWeight: 600 }}
            >
              <p className="text-slate-400 text-[10px] uppercase tracking-wider">
                Last Activity
              </p>
              <p className="mt-1 text-white text-sm">
                {new Date(ticket.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* CONVERSATION INTERFACE */}
      {/* ================================================= */}
      <section className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8 py-6">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
          {/* Chat Header */}
          <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-black text-white flex items-center justify-center shadow-xs">
                <MessageCircle size={18} className="text-blue-400" />
              </div>
              <div>
                <h3
                  className="text-xs font-semibold text-slate-900 tracking-tight"
                  style={{ fontWeight: 600 }}
                >
                  Secure Ticket Thread
                </h3>
                <p
                  className="text-[11px] text-slate-500 font-medium"
                  style={{ fontWeight: 600 }}
                >
                  Direct communication channel with GuideX Support
                </p>
              </div>
            </div>

            <div
              className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-[11px] font-semibold text-emerald-700"
              style={{ fontWeight: 600 }}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Secure Link Active
            </div>
          </div>

          {/* Messages Container */}
          <div className="bg-slate-50/30 px-6 py-6 max-h-[600px] overflow-y-auto space-y-6">
            {ticket.conversation?.map((chat) =>
              chat.sender === "Student" ? (
                /* Student Message (Right-aligned, Blue/Black theme) */
                <div key={chat._id} className="flex justify-end">
                  <div className="flex items-end gap-3 max-w-xl">
                    <div>
                      <div className="flex justify-end mb-1">
                        <span
                          className="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                          style={{ fontWeight: 600 }}
                        >
                          You
                        </span>
                      </div>
                      <div className="rounded-2xl rounded-br-xs bg-black text-white px-5 py-3.5 shadow-xs">
                        <p
                          className="text-xs leading-relaxed whitespace-pre-line font-medium"
                          style={{ fontWeight: 600 }}
                        >
                          {chat.message}
                        </p>
                        <div className="mt-2 flex justify-end">
                          <span
                            className="text-[10px] text-slate-400 font-medium"
                            style={{ fontWeight: 600 }}
                          >
                            {new Date(chat.sentAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                      <User size={16} />
                    </div>
                  </div>
                </div>
              ) : (
                /* Support Message (Left-aligned, Clean White border theme) */
                <div key={chat._id} className="flex justify-start">
                  <div className="flex items-end gap-3 max-w-xl">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-blue-400 shadow-xs">
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span
                          className="text-xs font-semibold text-slate-800"
                          style={{ fontWeight: 600 }}
                        >
                          GuideX Support
                        </span>
                        <span
                          className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-semibold text-blue-700"
                          style={{ fontWeight: 600 }}
                        >
                          VERIFIED STAFF
                        </span>
                      </div>
                      <div className="rounded-2xl rounded-bl-xs border border-slate-200 bg-white text-slate-800 px-5 py-3.5 shadow-xs">
                        <p
                          className="text-xs leading-relaxed whitespace-pre-line font-medium"
                          style={{ fontWeight: 600 }}
                        >
                          {chat.message}
                        </p>
                        <div className="mt-2">
                          <span
                            className="text-[10px] text-slate-400 font-medium"
                            style={{ fontWeight: 600 }}
                          >
                            {new Date(chat.sentAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Section / Footer */}
          {ticket.status === "Resolved" || ticket.status === "Closed" ? (
            <div className="border-t border-slate-200 bg-emerald-50/50 p-5">
              <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-white p-4 shadow-xs">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3
                    className="text-xs font-semibold text-emerald-800 tracking-tight"
                    style={{ fontWeight: 600 }}
                  >
                    Support Ticket Resolved
                  </h3>
                  <p
                    className="mt-0.5 text-xs text-slate-600 font-medium leading-relaxed"
                    style={{ fontWeight: 600 }}
                  >
                    This conversation is closed. If you require further help,
                    feel free to open a new ticket from your inbox.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-t border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle size={15} className="text-blue-600" />
                  <span
                    className="text-xs font-semibold text-slate-800"
                    style={{ fontWeight: 600 }}
                  >
                    Reply to Support Team
                  </span>
                </div>
                <span
                  className="text-[10px] text-slate-400 font-semibold"
                  style={{ fontWeight: 600 }}
                >
                  Press Enter to send • Shift + Enter for new line
                </span>
              </div>

              <div className="relative">
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your reply here..."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-semibold text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  style={{ fontWeight: 600 }}
                />
              </div>

              <div className="mt-3 flex items-center justify-end">
                <button
                  onClick={sendReply}
                  disabled={sending || !message.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-black hover:bg-slate-800 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition disabled:opacity-50"
                  style={{ fontWeight: 600 }}
                >
                  {sending ? (
                    <>
                      <Loader2
                        size={15}
                        className="animate-spin text-blue-400"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={15} className="text-blue-400" />
                      Send Reply
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SupportDetails;
