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

  // Get mentor's actual name from localStorage user profile if available
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
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Under Review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Resolved - Refunded":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Resolved - Dismissed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  if (loading && !dispute) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-gray-50 pt-16 lg:ml-64 lg:pt-0">
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative h-14 w-14">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-indigo-600" />
            </div>
            <p className="mt-5 text-base font-semibold text-gray-700">
              Opening secure mediation room...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 pt-16 lg:ml-64 lg:pt-0">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-5 sm:py-6 md:px-6 lg:px-8">
        {/* ================= TOP NAVIGATION BAR ================= */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-gray-200 transition font-semibold text-sm active:scale-95"
          >
            <ArrowLeft size={17} /> Back to Disputes
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowInfoModal(true)}
              className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-indigo-600 px-3.5 py-2.5 rounded-2xl shadow-sm border border-gray-200 transition font-semibold text-xs sm:text-sm"
            >
              <Info size={16} /> Case Info
            </button>
            <span
              className={`text-xs font-bold px-4 py-2 rounded-2xl border shadow-sm ${getStatusBadge(
                dispute?.status
              )}`}
            >
              {dispute?.status}
            </span>
          </div>
        </div>

        {/* ================= CHAT CONTAINER ================= */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden flex flex-col h-[78vh]">
          {/* ================= CHAT HEADER ================= */}
          <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-700 shadow-sm">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-md border border-white/20 shrink-0 shadow-inner">
                <ShieldAlert size={24} className="text-amber-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="font-black text-base sm:text-lg tracking-tight truncate">
                    {dispute?.subject || "3-Way Mediation Room"}
                  </h1>
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-indigo-100 flex-wrap">
                  <span className="font-mono">ID: {dispute?._id}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium">
                    <User size={13} /> Student:{" "}
                    {dispute?.student?.firstName || "Student"}{" "}
                    {dispute?.student?.lastName || ""}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto bg-white/10 px-3.5 py-2 rounded-2xl border border-white/10 backdrop-blur-sm text-xs shrink-0">
              <Tag size={13} className="text-indigo-200" />
              <span>
                Category:{" "}
                <strong className="text-white">{dispute?.category}</strong>
              </span>
            </div>
          </div>

          {/* ================= CHAT MESSAGE AREA ================= */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-gray-100/50">
            {/* System Security Notice Banner Inside Chat */}
            <div className="max-w-md mx-auto my-2 bg-blue-50 border border-blue-100 rounded-2xl p-3 text-center text-xs text-blue-700 flex items-center justify-center gap-2 shadow-xs">
              <Lock size={13} className="shrink-0 text-blue-500" />
              <span>
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
                    <span className="text-xs font-bold text-gray-700">
                      {msg.senderName}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                        isAdmin
                          ? "bg-purple-100 text-purple-700"
                          : isMe
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {msg.senderModel}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div
                    className={`max-w-md sm:max-w-xl px-4 py-3 rounded-2xl text-sm shadow-xs leading-relaxed ${
                      isAdmin
                        ? "bg-purple-600 text-white rounded-tr-none border border-purple-500"
                        : isMe
                        ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-100"
                        : "bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm"
                    }`}
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
            <div className="p-5 bg-gray-100 border-t border-gray-200 text-center space-y-1.5">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 mb-1">
                <CheckCircle2 size={18} />
              </div>
              <p className="text-sm font-bold text-gray-800">
                This dispute case has been officially closed by Administration.
              </p>
              <p className="text-xs text-gray-600 font-medium max-w-lg mx-auto bg-white p-3 rounded-xl border border-gray-200">
                <strong>Resolution Notes:</strong>{" "}
                {dispute.resolutionNotes || "None provided"}
              </p>
            </div>
          ) : (
            <div className="p-4 sm:p-5 bg-white border-t border-gray-200">
              <form
                onSubmit={handleSendMessage}
                className="flex gap-2 sm:gap-3 items-center"
              >
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your response to the student and admin..."
                  className="flex-1 border border-gray-200 bg-gray-50/50 rounded-2xl px-4 py-3.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition text-gray-700 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={sending || !messageText.trim()}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition flex items-center gap-2 shadow-md shadow-indigo-200 shrink-0 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} /> Send
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ================= CASE DETAILS MODAL ================= */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-7 relative border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShieldAlert size={20} className="text-indigo-600" /> Case
                Details & Context
              </h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-600">
              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Subject
                </p>
                <p className="font-bold text-gray-800">{dispute?.subject}</p>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Initial Description / Reason
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {dispute?.reason}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Category
                  </p>
                  <p className="font-semibold text-gray-800 text-xs">
                    {dispute?.category}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Raised By
                  </p>
                  <p className="font-semibold text-gray-800 text-xs">
                    {dispute?.raisedBy}
                  </p>
                </div>
              </div>

              {dispute?.booking && (
                <div className="bg-indigo-50/50 p-3.5 rounded-2xl border border-indigo-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-indigo-900">
                      Linked Booking Session
                    </p>
                    <p className="text-xs text-indigo-700 mt-0.5">
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

            <div className="mt-6 pt-3 flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm"
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
