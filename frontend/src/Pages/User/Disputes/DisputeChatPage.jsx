import React, { useEffect, useState, useRef } from "react";
import {
  ShieldAlert,
  Send,
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Tag,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const DisputeChatPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { disputeId } = useParams();
  const navigate = useNavigate();

  const [dispute, setDispute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Determine user role and active token
  const isAdmin = localStorage.getItem("AdminToken") !== null;
  const token = isAdmin
    ? localStorage.getItem("AdminToken")
    : localStorage.getItem("UserToken") || localStorage.getItem("MentorToken");

  const fetchDisputeDetails = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/disputes/${disputeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load dispute room");
      setDispute(data.dispute);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputeDetails();
    // Poll for real-time messages every 4 seconds
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
      let senderModel = "Student";
      if (isAdmin) senderModel = "Admin";
      // If mentor is logged in, you can check user role or token flavor if needed

      const res = await fetch(`${API_BASE_URL}/api/disputes/${disputeId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: messageText, senderModel }),
      });

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

  const handleResolve = async (action) => {
    if (!resolutionNotes.trim()) {
      return toast.error("Please provide resolution notes before closing.");
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/disputes/${disputeId}/resolve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resolutionAction: action, resolutionNotes }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resolve case");

      toast.success(`Dispute closed: ${action}`);
      setDispute(data.dispute);
      setResolutionNotes("");
    } catch (err) {
      toast.error(err.message || "Failed to resolve dispute");
    }
  };

  if (loading && !dispute) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-slate-500 font-medium text-sm">Opening secure mediation room...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* NAVIGATION & STATUS BAR */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-slate-200 transition font-semibold text-sm"
          >
            <ArrowLeft size={17} /> Back
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full border border-amber-200 shadow-sm">
              Status: {dispute?.status}
            </span>
          </div>
        </div>

        {/* CHAT CONTAINER */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col h-[78vh]">
          
          {/* HEADER */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 shrink-0">
                <ShieldAlert size={24} className="text-amber-400" />
              </div>
              <div>
                <h1 className="font-black text-lg tracking-tight">3-Way Mediation Room</h1>
                <p className="text-xs text-slate-300 font-mono mt-0.5">Case ID: {dispute?._id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-sm text-xs">
              <Tag size={14} className="text-indigo-300" />
              <span>Category: <strong className="text-white">{dispute?.category}</strong></span>
            </div>
          </div>

          {/* TICKET DETAILS BANNER */}
          <div className="bg-amber-50 border-b border-amber-100 px-6 py-4 space-y-1">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <span>Subject: {dispute?.subject}</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong className="font-semibold">Initial Description:</strong> {dispute?.reason}
            </p>
          </div>

          {/* MESSAGE LIST */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/60">
            {dispute?.messages?.map((msg, index) => {
              const isMe =
                (isAdmin && msg.senderModel === "Admin") ||
                (!isAdmin && msg.senderModel === "Student");

              return (
                <div
                  key={index}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-xs font-bold text-slate-700">{msg.senderName}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-600 rounded-md font-semibold">
                      {msg.senderModel}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div
                    className={`max-w-lg px-4 py-3 rounded-2xl text-sm shadow-sm leading-relaxed ${
                      msg.senderModel === "Admin"
                        ? "bg-indigo-600 text-white rounded-tr-none"
                        : isMe
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA OR RESOLUTION BANNER */}
          {dispute?.status.startsWith("Resolved") ? (
            <div className="p-5 bg-slate-100 border-t border-slate-200 text-center space-y-1">
              <p className="text-sm font-bold text-slate-700">This dispute case has been closed.</p>
              <p className="text-xs text-slate-500 font-medium">Resolution Notes: {dispute.resolutionNotes}</p>
            </div>
          ) : (
            <div className="p-4 sm:p-5 bg-white border-t border-slate-100 space-y-3">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message to participants..."
                  className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition text-slate-700"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition flex items-center gap-2 shadow-md shadow-indigo-200 shrink-0"
                >
                  <Send size={16} /> Send
                </button>
              </form>

              {/* ADMIN RESOLUTION CONTROLS */}
              {isAdmin && (
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <input
                    type="text"
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Enter mandatory resolution notes before closing..."
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition text-slate-700"
                  />
                  <div className="flex flex-col sm:flex-row gap-2 justify-end">
                    <button
                      onClick={() => handleResolve("Dismiss")}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <XCircle size={16} /> Dismiss Case
                    </button>
                    <button
                      onClick={() => handleResolve("Refund")}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-200"
                    >
                      <CheckCircle size={16} /> Issue Refund & Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisputeChatPage;