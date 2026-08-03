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
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "Resolved":
        return "bg-green-100 text-green-700 border-green-200";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 size={45} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!ticket) return null;
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Hero Section */}

      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 py-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>

          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <Link
            to="/support-inbox"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition font-medium"
          >
            <ArrowLeft size={18} />
            Back to Support Inbox
          </Link>

          <div className="mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm font-medium">
                <MessageCircle size={16} />
                Support Ticket
              </div>

              <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-white">
                Support Conversation
              </h1>

              <p className="mt-3 text-blue-100 text-lg">
                Ticket #{ticket._id.slice(-8).toUpperCase()}
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur rounded-2xl px-6 py-5 text-white border border-white/20">
              <p className="text-sm text-blue-100">Created On</p>

              <p className="mt-1 font-semibold text-lg">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Ticket Summary */}

      <section className="max-w-6xl mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left Content */}

            <div>
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${statusStyle(
                  ticket.status
                )}`}
              >
                {ticket.status === "Resolved" ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <CircleAlert size={16} />
                )}

                {ticket.status}
              </span>

              <h2 className="mt-6 text-3xl font-bold text-slate-900">
                {ticket.subject}
              </h2>

              <p className="mt-3 text-slate-500 leading-7 max-w-xl">
                Your support request is being handled by the GuideX support
                team. You can continue the conversation below.
              </p>
            </div>

            {/* Right Information */}

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-5">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Tag className="text-indigo-600" />
                </div>

                <div>
                  <p className="text-sm text-slate-400">Category</p>

                  <p className="font-semibold text-slate-800">
                    {ticket.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-5">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Clock className="text-blue-600" />
                </div>

                <div>
                  <p className="text-sm text-slate-400">Last Updated</p>

                  <p className="font-semibold text-slate-800">
                    {new Date(ticket.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conversation Section */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}

          <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <MessageCircle size={28} className="text-white" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Support Conversation
                  </h2>

                  <p className="text-indigo-100">
                    Chat history with GuideX Support Team
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                <div className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-sm font-medium text-white">
                  Active Ticket
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}

          <div className="bg-slate-50 px-8 py-8 max-h-[700px] overflow-y-auto">
            <div className="space-y-8">
              {ticket.conversation?.map((chat) =>
                chat.sender === "Student" ? (
                  <div key={chat._id} className="flex justify-end">
                    <div className="flex items-end gap-3 max-w-2xl">
                      <div>
                        <div className="flex justify-end mb-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            You
                          </span>
                        </div>

                        <div className="rounded-[28px] rounded-br-md bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 shadow-xl">
                          <p className="text-white leading-7 whitespace-pre-line">
                            {chat.message}
                          </p>

                          <div className="mt-4 flex justify-end">
                            <span className="text-xs text-indigo-200">
                              {new Date(chat.sentAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-600 shadow-lg">
                        <User size={22} className="text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={chat._id} className="flex justify-start">
                    <div className="flex items-end gap-3 max-w-2xl">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-600 shadow-lg">
                        <ShieldCheck size={22} className="text-white" />
                      </div>

                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <span className="font-semibold text-slate-800">
                            GuideX Support
                          </span>

                          <span className="rounded-full bg-green-100 px-2 py-1 text-[11px] font-semibold text-green-700">
                            VERIFIED
                          </span>
                        </div>

                        <div className="rounded-[28px] rounded-bl-md border border-green-200 bg-white px-6 py-5 shadow-lg">
                          <p className="leading-7 text-slate-700 whitespace-pre-line">
                            {chat.message}
                          </p>

                          <div className="mt-4">
                            <span className="text-xs text-slate-400">
                              {new Date(chat.sentAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
              <div ref={messagesEndRef}></div>
            </div>
          </div>
        </div>
      </section>
      {/* Reply Box */}

      {ticket.status === "Resolved" || ticket.status === "Closed" ? (
        <div className="border-t border-slate-200 bg-green-50 p-5">
          <div className="flex items-center gap-4 rounded-2xl border border-green-200 bg-white p-4 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 size={24} className="text-green-600" />
            </div>

            <div>
              <h3 className="font-semibold text-green-700">Ticket Resolved</h3>

              <p className="mt-1 text-sm text-slate-600">
                This support request has been resolved. Replies are disabled.
                Create a new ticket if you need further assistance.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-t border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
              <MessageCircle size={20} className="text-indigo-600" />
            </div>

            <div>
              <h3 className="font-semibold text-slate-800">
                Reply to GuideX Support
              </h3>

              <p className="text-xs text-slate-500">
                Continue your conversation.
              </p>
            </div>
          </div>

          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="
      w-full
      resize-none
      rounded-xl
      border
      border-slate-300
      p-4
      text-sm
      outline-none
      transition
      focus:border-indigo-500
      focus:ring-2
      focus:ring-indigo-500
      "
          />

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Enter to send • Shift + Enter for a new line
            </span>

            <button
              onClick={sendReply}
              disabled={sending || !message.trim()}
              className="
        flex
        items-center
        gap-2
        rounded-xl
        bg-gradient-to-r
        from-indigo-600
        to-violet-600
        px-6
        py-2.5
        text-sm
        font-medium
        text-white
        transition
        hover:shadow-lg
        disabled:opacity-50
        "
            >
              {sending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportDetails;
