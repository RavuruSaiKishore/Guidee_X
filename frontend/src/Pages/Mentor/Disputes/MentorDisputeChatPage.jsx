import React, { useEffect, useState, useRef } from "react";
import {
  ShieldAlert,
  Send,
  ArrowLeft,
  Tag,
  Calendar,
  User,
  CheckCircle2,
  Lock,
  Info,
  Sparkles,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const MentorDisputeChatPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { disputeId } = useParams();
  const navigate = useNavigate();

  const [dispute, setDispute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const messagesEndRef = useRef(null);

  const token =
    localStorage.getItem("MentorToken") || localStorage.getItem("UserToken");

  const getMentorName = () => {
    try {
      const storedUser =
        localStorage.getItem("userInfo") || localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed?.firstName) {
          return `${parsed.firstName} ${parsed.lastName || ""}`.trim();
        }
      }
    } catch (e) {
      console.error("Error parsing user data", e);
    }
    return "Mentor";
  };

  const fetchDisputeDetails = async () => {
    if (!disputeId || disputeId === "undefined") return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/disputes/${disputeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to load dispute room");
      setDispute(data.dispute);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputeDetails();
    const interval = setInterval(fetchDisputeDetails, 4000);
    return () => clearInterval(interval);
  }, [disputeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dispute]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const mentorFullName = getMentorName();

    try {
      setSending(true);
      const res = await fetch(
        `${API_BASE_URL}/api/disputes/${disputeId}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: messageText,
            senderModel: "Mentor",
            senderName: mentorFullName,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send message");

      setDispute(data.dispute);
      setMessageText("");
    } catch (err) {
      toast.error(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
        return "border-amber-200 bg-amber-50 text-amber-700";
      case "Under Review":
        return "border-blue-200 bg-blue-50 text-blue-700";
      case "Resolved - Refunded":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
      case "Resolved - Dismissed":
        return "border-slate-200 bg-slate-100 text-slate-700";
      default:
        return "border-slate-200 bg-slate-50 text-slate-700";
    }
  };

  if (loading && !dispute) {
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
            Opening secure mediation room...
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

  return (
    <div
      className="min-h-screen bg-slate-50 pt-16 sm:pt-20 lg:ml-64 lg:pt-0 text-slate-950 pb-16"
      style={{ fontFamily: "'Poppins', sans-serif", fontStyle: "normal" }}
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <main className="w-full max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8 space-y-4 sm:space-y-6">
        {/* ================= TOP NAVIGATION BAR ================= */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 bg-white px-4 py-2.5 rounded-xl shadow-xs border border-slate-200 transition font-semibold text-xs active:scale-95"
            style={{ fontWeight: 600 }}
          >
            <ArrowLeft size={15} /> Back to Disputes
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfoModal(true)}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2.5 rounded-xl shadow-xs border border-slate-200 transition font-semibold text-xs"
              style={{ fontWeight: 600 }}
            >
              <Info size={14} className="text-blue-600" /> Case Info
            </button>
            <span
              className={`text-[10px] sm:text-xs font-semibold px-3.5 py-1.5 rounded-full border shadow-2xs ${getStatusBadge(
                dispute?.status
              )}`}
              style={{ fontWeight: 600 }}
            >
              {dispute?.status}
            </span>
          </div>
        </div>

        {/* ================= CHAT CONTAINER ================= */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xs border border-slate-200 overflow-hidden flex flex-col h-[82vh] sm:h-[84vh]">
          {/* ================= CHAT HEADER ================= */}
          <section className="relative overflow-hidden bg-black p-4 sm:p-6 text-white shadow-xs w-full border-b border-slate-800 shrink-0">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div
                  className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur shadow-inner text-blue-400"
                  style={{ fontWeight: 600 }}
                >
                  <ShieldAlert size={22} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-300 backdrop-blur"
                      style={{ fontWeight: 600 }}
                    >
                      <Sparkles size={11} className="text-blue-400" />
                      Mediation Room
                    </span>
                  </div>
                  <h1
                    className="mt-1 text-sm sm:text-base font-semibold tracking-tight text-white truncate"
                    style={{ fontWeight: 600 }}
                  >
                    {dispute?.subject || "3-Way Mediation Room"}
                  </h1>
                  <div className="flex items-center gap-2.5 mt-1 text-[11px] text-slate-300 font-medium flex-wrap">
                    <span className="font-mono">ID: {dispute?._id}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User size={12} className="text-blue-400" /> Student:{" "}
                      {dispute?.student?.firstName || "Student"}{" "}
                      {dispute?.student?.lastName || ""}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl border border-white/15 backdrop-blur-sm text-xs shrink-0"
                style={{ fontWeight: 600 }}
              >
                <Tag size={13} className="text-blue-400" />
                <span>
                  Category:{" "}
                  <strong className="text-white">{dispute?.category}</strong>
                </span>
              </div>
            </div>
          </section>

          {/* ================= CHAT MESSAGE AREA ================= */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
            {/* System Security Notice Banner Inside Chat */}
            <div className="max-w-md mx-auto my-1 bg-blue-50 border border-blue-200 rounded-xl p-2.5 text-center text-xs text-blue-700 flex items-center justify-center gap-2 shadow-2xs">
              <Lock size={13} className="shrink-0 text-blue-600" />
              <span style={{ fontWeight: 600 }}>
                Secure 3-Way Moderation Room. Admins oversee all messages.
              </span>
            </div>

            {dispute?.messages?.map((msg, index) => {
              const isMe = msg.senderModel === "Mentor";
              const isAdmin = msg.senderModel === "Admin";

              return (
                <div
                  key={index}
                  className={`flex flex-col ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span
                      className="text-xs font-semibold text-slate-700"
                      style={{ fontWeight: 600 }}
                    >
                      {msg.senderName}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                        isAdmin
                          ? "border-purple-200 bg-purple-50 text-purple-700"
                          : isMe
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-slate-100 text-slate-600"
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {msg.senderModel}
                    </span>
                    <span
                      className="text-[10px] text-slate-400 font-medium"
                      style={{ fontWeight: 600 }}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-xl px-4 py-3 rounded-2xl text-xs sm:text-sm shadow-2xs leading-relaxed ${
                      isAdmin
                        ? "bg-purple-600 text-white rounded-tr-none border border-purple-500 font-medium"
                        : isMe
                        ? "bg-black text-white rounded-tr-none font-medium"
                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-none font-medium shadow-xs"
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* ================= INPUT OR RESOLUTION BANNER ================= */}
          {dispute?.status.startsWith("Resolved") ? (
            <div className="p-4 sm:p-5 bg-slate-100 border-t border-slate-200 text-center space-y-1.5 shrink-0">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 mb-1 border border-emerald-200">
                <CheckCircle2 size={16} />
              </div>
              <p
                className="text-xs sm:text-sm font-semibold text-slate-900"
                style={{ fontWeight: 600 }}
              >
                This dispute case has been officially closed by Administration.
              </p>
              <p
                className="text-xs text-slate-600 font-medium max-w-lg mx-auto bg-white p-3 rounded-xl border border-slate-200"
                style={{ fontWeight: 600 }}
              >
                <strong>Resolution Notes:</strong>{" "}
                {dispute.resolutionNotes || "None provided"}
              </p>
            </div>
          ) : (
            <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 shrink-0">
              <form
                onSubmit={handleSendMessage}
                className="flex gap-2 sm:gap-3 items-center"
              >
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your response to the student and admin..."
                  className="flex-1 border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition text-slate-800 font-semibold"
                  style={{ fontWeight: 600 }}
                />
                <button
                  type="submit"
                  disabled={sending || !messageText.trim()}
                  className="px-4 sm:px-6 py-3 bg-black hover:bg-slate-800 text-white rounded-xl font-semibold text-xs sm:text-sm transition flex items-center gap-1.5 sm:gap-2 shadow-xs shrink-0 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontWeight: 600 }}
                >
                  <Send size={15} className="text-blue-400" /> Send
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* ================= CASE DETAILS MODAL ================= */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-6 sm:p-7 relative border border-slate-200 animate-in fade-in zoom-in duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3
                className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2 tracking-tight"
                style={{ fontWeight: 600 }}
              >
                <ShieldAlert size={18} className="text-blue-600" /> Case Details
                & Context
              </h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs font-semibold text-slate-600">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <p
                  className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1"
                  style={{ fontWeight: 600 }}
                >
                  Subject
                </p>
                <p
                  className="font-semibold text-slate-900"
                  style={{ fontWeight: 600 }}
                >
                  {dispute?.subject}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <p
                  className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1"
                  style={{ fontWeight: 600 }}
                >
                  Initial Description / Reason
                </p>
                <p
                  className="text-slate-700 leading-relaxed font-medium"
                  style={{ fontWeight: 600 }}
                >
                  {dispute?.reason}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p
                    className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5"
                    style={{ fontWeight: 600 }}
                  >
                    Category
                  </p>
                  <p
                    className="font-semibold text-slate-900 text-xs"
                    style={{ fontWeight: 600 }}
                  >
                    {dispute?.category}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p
                    className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5"
                    style={{ fontWeight: 600 }}
                  >
                    Raised By
                  </p>
                  <p
                    className="font-semibold text-slate-900 text-xs"
                    style={{ fontWeight: 600 }}
                  >
                    {dispute?.raisedBy}
                  </p>
                </div>
              </div>

              {dispute?.booking && (
                <div className="bg-blue-50/50 p-3.5 rounded-2xl border border-blue-200 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                    <Calendar size={16} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-xs font-semibold text-blue-900"
                      style={{ fontWeight: 600 }}
                    >
                      Linked Booking Session
                    </p>
                    <p
                      className="text-[11px] text-blue-700 mt-0.5 font-medium truncate"
                      style={{ fontWeight: 600 }}
                    >
                      Date:{" "}
                      {new Date(dispute.booking.sessionDate).toLocaleDateString(
                        "en-GB",
                        { day: "2-digit", month: "short", year: "numeric" }
                      )}{" "}
                      | Status: {dispute.booking.bookingStatus}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-5 py-2.5 rounded-xl bg-black hover:bg-slate-800 text-white text-xs font-semibold transition shadow-xs"
                style={{ fontWeight: 600 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorDisputeChatPage;
