import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  ArrowLeft,
  MessageSquare,
  Send,
  Loader2,
  ShieldCheck,
  Calendar,
  Ticket,
  Clock,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Tag,
  BookOpen,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const MentorSupportDetails = () => {
  const { id } = useParams();
  const token = localStorage.getItem("MentorToken");

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [request?.conversation]);

  // ==========================================
  // FETCH CONVERSATION
  // ==========================================
  const fetchRequest = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/mentor-contact/my/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setRequest(data.contact);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SEND MESSAGE
  // ==========================================
  const sendMessage = async () => {
    if (!message.trim()) {
      return toast.error("Please enter your message");
    }

    try {
      setSending(true);

      const response = await fetch(
        `${API_BASE_URL}/api/mentor-contact/${id}/reply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success("Message sent successfully");

      setRequest((prev) => ({
        ...prev,
        conversation: [
          ...(prev.conversation || []),
          {
            _id: Date.now(),
            sender: "Mentor",
            message,
            sentAt: new Date(),
          },
        ],
      }));

      setMessage("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!sending) {
        sendMessage();
      }
    }
  };

  const statusUI = {
    Closed: {
      color: "border-red-200 bg-red-50 text-red-700",
      dot: "bg-red-500",
      icon: AlertCircle,
    },
    Resolved: {
      color: "border-emerald-200 bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-500",
      icon: CheckCircle2,
    },
    Open: {
      color: "border-blue-200 bg-blue-50 text-blue-700",
      dot: "bg-blue-500",
      icon: Clock,
    },
    "In Progress": {
      color: "border-blue-200 bg-blue-50 text-blue-700",
      dot: "bg-blue-500",
      icon: Clock,
    },
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div
        className="min-h-screen bg-slate-50 pt-16 sm:pt-20 lg:ml-64 lg:pt-0 text-slate-900"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-2 sm:px-5">
          <div className="relative">
            <div className="h-14 w-14 rounded-full border-4 border-slate-200" />
            <div className="absolute inset-0 h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
          </div>
          <p
            className="mt-5 text-center text-xs font-semibold tracking-tight"
            style={{ fontWeight: 600 }}
          >
            Loading support thread...
          </p>
          <p
            className="mt-1 text-center text-[11px] text-slate-400 font-medium"
            style={{ fontWeight: 600 }}
          >
            Please wait a moment
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // NOT FOUND
  // ==========================================
  if (!request) {
    return (
      <div
        className="min-h-screen bg-slate-50 pt-16 sm:pt-20 lg:ml-64 lg:pt-0 text-slate-900 flex items-center justify-center px-4"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="text-center bg-white p-8 rounded-3xl border border-slate-200 shadow-xs max-w-sm w-full">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-4 border border-red-200">
            <AlertCircle size={26} />
          </div>
          <h2
            className="text-base font-semibold text-slate-900 tracking-tight"
            style={{ fontWeight: 600 }}
          >
            Conversation Not Found
          </h2>
          <p
            className="mt-1 text-xs text-slate-500 font-medium"
            style={{ fontWeight: 600 }}
          >
            This support conversation doesn't exist or may have been removed.
          </p>

          <Link
            to="/mentor/admin-chat"
            className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-black hover:bg-slate-800 px-5 py-2.5 text-xs font-semibold text-white transition shadow-xs"
            style={{ fontWeight: 600 }}
          >
            <ArrowLeft size={15} />
            Back to Support Desk
          </Link>
        </div>
      </div>
    );
  }

  const currentStatus = statusUI[request.status] || statusUI["Open"];
  const StatusIcon = currentStatus.icon;

  return (
    <div
      className="min-h-screen bg-slate-50 pt-16 sm:pt-20 lg:ml-64 lg:pt-0 text-slate-950 pb-16"
      style={{ fontFamily: "'Poppins', sans-serif", fontStyle: "normal" }}
    >
      <main className="w-full max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8 space-y-4 sm:space-y-6">
        {/* ========================= HEADER NAVIGATION & STATUS ========================= */}
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/mentor/admin-chat"
            className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 bg-white px-4 py-2.5 rounded-xl shadow-xs border border-slate-200 transition font-semibold text-xs active:scale-95"
            style={{ fontWeight: 600 }}
          >
            <ArrowLeft size={15} /> Back to Support Desk
          </Link>

          <div
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-2 shadow-2xs ${currentStatus.color}`}
            style={{ fontWeight: 600 }}
          >
            <span
              className={`w-2 h-2 rounded-full ${currentStatus.dot} animate-pulse`}
            />
            <StatusIcon size={13} />
            <span>{request.status || "Open"}</span>
          </div>
        </div>

        {/* ========================= MAIN CHAT & METADATA LAYOUT ========================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          {/* ========================= TICKET METADATA SIDEBAR ========================= */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
              <h2
                className="text-xs sm:text-sm font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3"
                style={{ fontWeight: 600 }}
              >
                Ticket Details
              </h2>

              <div className="space-y-3 text-xs font-semibold">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
                  <span
                    className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block mb-0.5"
                    style={{ fontWeight: 600 }}
                  >
                    Ticket Ref
                  </span>
                  <p
                    className="text-slate-900 font-mono font-bold"
                    style={{ fontWeight: 600 }}
                  >
                    #
                    {request.ticketNumber ||
                      request._id.slice(-8).toUpperCase()}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
                  <div
                    className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-1"
                    style={{ fontWeight: 600 }}
                  >
                    <Tag size={13} />
                    Category
                  </div>
                  <p className="text-slate-800" style={{ fontWeight: 600 }}>
                    {request.category || "General Inquiry"}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
                  <div
                    className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-1"
                    style={{ fontWeight: 600 }}
                  >
                    <BookOpen size={13} />
                    Subject
                  </div>
                  <p className="text-slate-800" style={{ fontWeight: 600 }}>
                    {request.subject || "No Subject Provided"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                    <span
                      className="text-[10px] font-semibold uppercase text-slate-400 block mb-0.5"
                      style={{ fontWeight: 600 }}
                    >
                      Messages
                    </span>
                    <span
                      className="text-sm font-bold text-blue-600"
                      style={{ fontWeight: 600 }}
                    >
                      {request.conversation?.length || 0}
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                    <span
                      className="text-[10px] font-semibold uppercase text-slate-400 block mb-0.5"
                      style={{ fontWeight: 600 }}
                    >
                      Created
                    </span>
                    <span
                      className="text-xs font-semibold text-slate-700 block mt-0.5"
                      style={{ fontWeight: 600 }}
                    >
                      {new Date(request.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ========================= CHAT STREAM & INPUT ========================= */}
          <main className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-xs flex flex-col h-[75vh] sm:h-[80vh] overflow-hidden">
            {/* CHAT HEADER */}
            <section className="relative overflow-hidden bg-black p-4 sm:p-5 text-white shadow-xs w-full border-b border-slate-800 shrink-0">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />
              <div className="absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl" />

              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-white/15 bg-white/10 backdrop-blur flex items-center justify-center text-blue-400 shadow-inner"
                      style={{ fontWeight: 600 }}
                    >
                      <ShieldCheck size={20} />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black bg-emerald-500"></span>
                  </div>
                  <div className="min-w-0">
                    <h3
                      className="text-xs sm:text-sm font-semibold text-white tracking-tight truncate"
                      style={{ fontWeight: 600 }}
                    >
                      GuideX Support Team
                    </h3>
                    <p
                      className="text-[10px] sm:text-[11px] text-slate-300 font-medium truncate"
                      style={{ fontWeight: 600 }}
                    >
                      Verified Administrative Channel
                    </p>
                  </div>
                </div>

                <span
                  className="text-[11px] text-slate-300 bg-white/10 border border-white/15 font-semibold px-3 py-1 rounded-full shrink-0"
                  style={{ fontWeight: 600 }}
                >
                  {request.conversation?.length || 0} Messages
                </span>
              </div>
            </section>

            {/* CHAT MESSAGES STREAM */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 bg-slate-50/50">
              {request.conversation?.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-3">
                    <MessageSquare size={22} />
                  </div>
                  <h3
                    className="text-xs sm:text-sm font-semibold text-slate-900"
                    style={{ fontWeight: 600 }}
                  >
                    No Messages Yet
                  </h3>
                  <p
                    className="mt-1 text-xs text-slate-500 font-medium max-w-xs leading-relaxed"
                    style={{ fontWeight: 600 }}
                  >
                    Start the conversation below. The GuideX Support team will
                    review and reply promptly.
                  </p>
                </div>
              ) : (
                request.conversation.map((chat) => {
                  const isMentor = chat.sender === "Mentor";

                  return (
                    <div
                      key={chat._id}
                      className={`flex flex-col ${
                        isMentor ? "items-end" : "items-start"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span
                          className="text-xs font-semibold text-slate-700"
                          style={{ fontWeight: 600 }}
                        >
                          {isMentor ? "You" : "GuideX Support"}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                            isMentor
                              ? "border-blue-200 bg-blue-50 text-blue-700"
                              : "border-purple-200 bg-purple-50 text-purple-700"
                          }`}
                          style={{ fontWeight: 600 }}
                        >
                          {isMentor ? "Mentor" : "Admin"}
                        </span>
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

                      <div
                        className={`max-w-[85%] sm:max-w-xl px-4 py-3 rounded-2xl text-xs sm:text-sm shadow-2xs leading-relaxed ${
                          isMentor
                            ? "bg-black text-white rounded-tr-none font-medium"
                            : "bg-white border border-slate-200 text-slate-800 rounded-tl-none font-medium shadow-xs"
                        }`}
                        style={{ fontWeight: 600 }}
                      >
                        {chat.message}
                      </div>
                    </div>
                  );
                })
              )}

              {/* SENDING ANIMATION BUBBLE */}
              {sending && (
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span
                      className="text-xs font-semibold text-slate-700"
                      style={{ fontWeight: 600 }}
                    >
                      You
                    </span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-md font-semibold border border-blue-200 bg-blue-50 text-blue-700"
                      style={{ fontWeight: 600 }}
                    >
                      Mentor
                    </span>
                  </div>
                  <div className="rounded-2xl rounded-tr-none bg-black px-4 py-3 shadow-2xs">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-white"></div>
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:0.2s]"></div>
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* MESSAGE INPUT DOCK */}
            <div className="border-t border-slate-200 bg-white p-3 sm:p-4 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!sending && message.trim()) sendMessage();
                }}
                className="flex gap-2 sm:gap-3 items-center"
              >
                <textarea
                  rows={1}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Write your response..."
                  className="flex-1 border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition text-slate-800 font-semibold resize-none"
                  style={{ fontWeight: 600 }}
                />

                <button
                  type="submit"
                  disabled={sending || !message.trim()}
                  className="px-4 sm:px-6 py-3 bg-black hover:bg-slate-800 text-white rounded-xl font-semibold text-xs sm:text-sm transition flex items-center gap-1.5 sm:gap-2 shadow-xs shrink-0 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontWeight: 600 }}
                >
                  {sending ? (
                    <Loader2 size={15} className="animate-spin text-blue-400" />
                  ) : (
                    <Send size={15} className="text-blue-400" />
                  )}
                  <span>Send</span>
                </button>
              </form>
            </div>
          </main>
        </div>
      </main>
    </div>
  );
};

export default MentorSupportDetails;
