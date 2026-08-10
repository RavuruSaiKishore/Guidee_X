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
  Check,
  Sparkles,
  Scale,
  FileText,
  Clock,
  CheckCheck,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const AdminDisputeChatPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { disputeId } = useParams();
  const navigate = useNavigate();

  const [dispute, setDispute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("");
  const [resolvingAction, setResolvingAction] = useState("");
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("AdminToken");

  const fetchDisputeDetails = async () => {
    if (!disputeId || disputeId === "undefined") return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/disputes/${disputeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.message || "Failed to load dispute moderation room"
        );
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
            senderModel: "Admin",
            senderName: "Platform Administration",
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

  const handleResolveCase = async (actionType) => {
    try {
      const statusValue =
        actionType === "refund"
          ? "Resolved - Refunded"
          : "Resolved - Dismissed";
      const res = await fetch(
        `${API_BASE_URL}/api/disputes/${disputeId}/resolve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: statusValue,
            resolutionNotes:
              resolutionNote ||
              "Case concluded by administration moderation team.",
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resolve case");

      toast.success("Dispute case successfully concluded!");
      setDispute(data.dispute);
      setShowResolveModal(false);
    } catch (err) {
      toast.error(err.message || "Failed to update case status");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
        return "bg-amber-500/10 text-amber-600 border-amber-200/60";
      case "Under Review":
        return "bg-blue-500/10 text-blue-600 border-blue-200/60";
      case "Resolved - Refunded":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-200/60";
      case "Resolved - Dismissed":
        return "bg-slate-500/10 text-slate-600 border-slate-200/60";
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-200/60";
    }
  };

  if (loading && !dispute) {
    return (
      <div className="w-full flex-1 flex items-center justify-center p-12 bg-slate-50">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative h-14 w-14">
            <div className="absolute inset-0 rounded-full border-4 border-purple-100" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-purple-600" />
          </div>
          <p className="mt-5 text-sm font-medium text-slate-600 animate-pulse">
            Establishing secure arbitration link...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none flex flex-col h-[calc(100vh-5rem)] pb-2">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ================= MODERN CHAT WINDOW WRAPPER ================= */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden flex flex-col flex-1 max-w-7xl mx-auto w-full">
        {/* ================= HIGH-END CHAT HEADER ================= */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 shadow-sm shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition shrink-0 border border-slate-700/50"
              title="Back to Disputes"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-purple-500/20">
              <Scale size={20} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg tracking-tight text-white truncate">
                  {dispute?.subject || "Arbitration Chamber"}
                </h1>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                    dispute?.status
                  )}`}
                >
                  {dispute?.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5 flex items-center gap-2">
                <span className="font-mono text-slate-400">
                  Case #{dispute?._id?.slice(-6)}
                </span>
                <span>•</span>
                <span className="text-purple-400 font-medium">
                  Category: {dispute?.category}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowInfoModal(true)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700/50 transition shadow-xs"
            >
              <Info size={15} className="text-purple-400" /> Case Evidence
            </button>

            {!dispute?.status.startsWith("Resolved") && (
              <button
                onClick={() => setShowResolveModal(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20 flex items-center gap-1.5 active:scale-95"
              >
                <Sparkles size={14} /> Conclude Case
              </button>
            )}
          </div>
        </div>

        {/* ================= IMMERSIVE MESSAGE TIMELINE ================= */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/40">
          {/* Security Banner */}
          <div className="max-w-md mx-auto bg-purple-50/80 backdrop-blur-sm border border-purple-100 rounded-2xl py-2 px-4 text-center text-xs text-purple-700 flex items-center justify-center gap-2 shadow-2xs">
            <Lock size={13} className="shrink-0 text-purple-500" />
            <span>
              Official Admin Moderation Channel • All statements are legally
              recorded
            </span>
          </div>

          {/* Messages Mapping */}
          {dispute?.messages?.map((msg, index) => {
            const isAdmin = msg.senderModel === "Admin";
            const isMentor = msg.senderModel === "Mentor";

            return (
              <div
                key={index}
                className={`flex flex-col ${
                  isAdmin ? "items-end" : "items-start"
                } group animate-in fade-in duration-300`}
              >
                {/* Sender Tag Header */}
                <div
                  className={`flex items-center gap-2 mb-1.5 px-1 ${
                    isAdmin ? "flex-row-reverse" : ""
                  }`}
                >
                  <span className="text-xs font-bold text-slate-700">
                    {msg.senderName}
                  </span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${
                      isAdmin
                        ? "bg-purple-100 text-purple-700 border border-purple-200/50"
                        : isMentor
                        ? "bg-indigo-100 text-indigo-700 border border-indigo-200/50"
                        : "bg-emerald-100 text-emerald-700 border border-emerald-200/50"
                    }`}
                  >
                    {msg.senderModel}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Bubble Container */}
                <div
                  className={`flex items-end gap-2 max-w-xl ${
                    isAdmin ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`px-5 py-3.5 rounded-3xl text-sm leading-relaxed shadow-sm transition-all ${
                      isAdmin
                        ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-br-xs shadow-purple-500/10"
                        : "bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs shadow-slate-100"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {msg.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* ================= REAL-TIME INPUT BAR / RESOLUTION BANNER ================= */}
        {dispute?.status.startsWith("Resolved") ? (
          <div className="p-5 bg-slate-50 border-t border-slate-200 text-center space-y-2 shrink-0">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 mb-0.5">
              <CheckCircle2 size={18} />
            </div>
            <p className="text-sm font-bold text-slate-800">
              This dispute has been officially closed and resolved.
            </p>
            <p className="text-xs text-slate-600 max-w-md mx-auto bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
              <strong className="text-slate-900 block mb-0.5">
                Administrative Verdict:
              </strong>
              {dispute.resolutionNotes || "No notes provided."}
            </p>
          </div>
        ) : (
          <div className="p-4 sm:p-5 bg-white border-t border-slate-200/80 shrink-0">
            <form
              onSubmit={handleSendMessage}
              className="flex gap-3 items-center"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type an official moderation response..."
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-5 py-3.5 text-sm outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition text-slate-800 placeholder:text-slate-400 shadow-inner"
                />
              </div>
              <button
                type="submit"
                disabled={sending || !messageText.trim()}
                className="h-12 px-7 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-purple-600/25 shrink-0 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} /> Send Ruling
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ================= CASE EVIDENCE MODAL ================= */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-7 relative border border-slate-100">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <ShieldAlert size={18} />
                </div>
                Case Dossier & Evidence
              </h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  Subject Issue
                </p>
                <p className="font-bold text-slate-900">{dispute?.subject}</p>
              </div>

              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  Student Complaint Statement
                </p>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                  {dispute?.reason}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">
                    Category
                  </p>
                  <p className="font-bold text-slate-800 text-xs">
                    {dispute?.category}
                  </p>
                </div>
                <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">
                    Originator
                  </p>
                  <p className="font-bold text-slate-800 text-xs">
                    {dispute?.raisedBy}
                  </p>
                </div>
              </div>

              {dispute?.booking && (
                <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-purple-900">
                      Attached Booking Record
                    </p>
                    <p className="text-xs text-purple-700 mt-0.5 truncate">
                      Date:{" "}
                      {new Date(dispute.booking.sessionDate).toLocaleDateString(
                        "en-GB",
                        { day: "2-digit", month: "short", year: "numeric" }
                      )}{" "}
                      • Status:{" "}
                      <span className="font-semibold">
                        {dispute.booking.bookingStatus}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
              >
                Dismiss Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CONCLUDE CASE MODAL ================= */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-7 relative border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Issue Final Verdict
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Select an official resolution outcome and record your closing
              notes.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                  Verdict Outcome
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setResolvingAction("refund")}
                    className={`py-3.5 px-4 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                      resolvingAction === "refund"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Approve Refund
                  </button>
                  <button
                    onClick={() => setResolvingAction("dismiss")}
                    className={`py-3.5 px-4 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                      resolvingAction === "dismiss"
                        ? "bg-slate-900 text-white border-slate-900 shadow-md"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Dismiss Claim
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                  Official Closing Notes
                </label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Record summary of arbitration decision..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 transition text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowResolveModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition"
              >
                Abort
              </button>
              <button
                disabled={!resolvingAction}
                onClick={() => handleResolveCase(resolvingAction)}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-md shadow-purple-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Lock & Enforce Verdict
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDisputeChatPage;
