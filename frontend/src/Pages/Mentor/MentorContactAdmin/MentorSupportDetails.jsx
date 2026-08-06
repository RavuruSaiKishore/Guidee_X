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
      color: "bg-rose-50 text-rose-700 border-rose-200",
      dot: "bg-rose-500",
      icon: AlertCircle,
    },
    Resolved: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
      icon: CheckCircle2,
    },
    Open: {
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      dot: "bg-indigo-500",
      icon: Clock,
    },
    "In Progress": {
      color: "bg-sky-50 text-sky-700 border-sky-200",
      dot: "bg-sky-500",
      icon: Clock,
    },
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/70 p-4">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-8 border border-slate-200/80 shadow-sm">
          <Loader2 size={40} className="animate-spin text-indigo-600" />
          <p className="text-sm font-semibold text-slate-600 animate-pulse">
            Loading support thread...
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50/70 p-4">
        <div className="max-w-md w-full rounded-3xl bg-white p-8 text-center border border-slate-200/80 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <AlertCircle size={32} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-800">
            Conversation Not Found
          </h2>

          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            This support conversation doesn't exist or may have been removed.
          </p>

          <Link
            to="/mentor/admin-chat"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-500 shadow-md shadow-indigo-500/20"
          >
            <ArrowLeft size={16} />
            Back to Support Desk
          </Link>
        </div>
      </div>
    );
  }

  const currentStatus = statusUI[request.status] || statusUI["Open"];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 p-4 sm:p-6 lg:p-8 font-sans antialiased lg:ml-64">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ========================= HEADER ========================= */}
        <header className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-600 border border-indigo-500/20 rounded-3xl p-5 sm:p-6 shadow-xl text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner shrink-0">
                <Ticket size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight text-white">
                    Support Desk
                  </h1>
                  <span className="inline-flex items-center gap-1 bg-white/20 border border-white/30 text-white text-xs px-2.5 py-0.5 rounded-full font-medium shadow-sm">
                    <Sparkles size={12} /> GuideX Help
                  </span>
                </div>
                <p className="text-indigo-100 text-xs sm:text-sm mt-0.5">
                  Direct inquiry & assistance thread
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 pt-3 sm:pt-0 border-white/10">
              <div
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-2 shadow-sm ${currentStatus.color}`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${currentStatus.dot} animate-pulse`}
                />
                <StatusIcon size={14} />
                <span>{request.status || "Open"}</span>
              </div>

              <Link
                to="/mentor/admin-chat"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 backdrop-blur-md"
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </Link>
            </div>
          </div>
        </header>

        {/* ========================= MAIN CONTENT LAYOUT ========================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ========================= TICKET METADATA SIDEBAR ========================= */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                Ticket Details
              </h2>

              <div className="space-y-3">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
                  <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Ticket Ref
                  </span>
                  <p className="mt-0.5 text-sm font-mono font-bold text-slate-800">
                    #
                    {request.ticketNumber ||
                      request._id.slice(-8).toUpperCase()}
                  </p>
                </div>

                <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
                    <Tag size={12} />
                    Category
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    {request.category || "General Inquiry"}
                  </p>
                </div>

                <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-3.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-600 uppercase tracking-wider mb-1">
                    <BookOpen size={12} />
                    Subject
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    {request.subject || "No Subject Provided"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Messages
                    </span>
                    <span className="text-base font-bold text-indigo-600">
                      {request.conversation?.length || 0}
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Created
                    </span>
                    <span className="text-xs font-semibold text-slate-700 block mt-0.5">
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
          <main className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl shadow-sm flex flex-col h-[650px] overflow-hidden">
            {/* CHAT HEADER */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white bg-emerald-500"></span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">
                    GuideX Support Team
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Verified Administrative Channel
                  </p>
                </div>
              </div>

              <span className="text-xs text-slate-600 bg-slate-200/60 font-semibold px-3 py-1 rounded-full">
                {request.conversation?.length || 0} Messages
              </span>
            </div>

            {/* CHAT MESSAGES STREAM */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/60 custom-scrollbar">
              {request.conversation?.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-500 flex items-center justify-center mb-4">
                    <MessageSquare size={28} />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">
                    No Messages Yet
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-xs leading-relaxed">
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
                      className={`flex ${
                        isMentor ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm transition-all ${
                          isMentor
                            ? "bg-indigo-600 text-white rounded-tr-none border border-indigo-500"
                            : "bg-white text-slate-800 rounded-tl-none border border-slate-200"
                        }`}
                      >
                        <div
                          className={`flex items-center justify-between gap-4 mb-2 pb-1.5 border-b ${
                            isMentor ? "border-white/20" : "border-slate-100"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                                isMentor
                                  ? "bg-white/20 text-white"
                                  : "bg-indigo-100 text-indigo-700"
                              }`}
                            >
                              {isMentor ? "M" : "A"}
                            </span>
                            <span className="text-xs font-bold tracking-wide">
                              {isMentor ? "You" : "GuideX Support"}
                            </span>
                          </div>

                          <time
                            className={`text-[10px] font-mono ${
                              isMentor ? "text-indigo-100" : "text-slate-400"
                            }`}
                          >
                            {new Date(chat.sentAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </time>
                        </div>

                        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words font-medium">
                          {chat.message}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}

              {/* SENDING ANIMATION BUBBLE */}
              {sending && (
                <div className="flex justify-end">
                  <div className="rounded-2xl rounded-tr-none bg-indigo-600 px-5 py-3.5 shadow-sm">
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
            <div className="border-t border-slate-200/80 bg-white p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-medium">
                  <span>Type your message to support</span>
                  <span className="hidden sm:inline-flex items-center gap-1">
                    Press{" "}
                    <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono">
                      Enter
                    </kbd>{" "}
                    to send
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Write your response..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none"
                  />

                  <button
                    onClick={sendMessage}
                    disabled={sending || !message.trim()}
                    className="h-full min-h-[48px] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] disabled:opacity-50 text-white rounded-2xl px-5 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-500/20 shrink-0"
                  >
                    {sending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={15} />
                    )}
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MentorSupportDetails;
