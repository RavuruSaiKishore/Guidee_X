import React, { useEffect, useState } from "react";
import {
  ShieldAlert,
  MessageSquare,
  ArrowRight,
  PlusCircle,
  AlertTriangle,
  X,
  Filter,
  UserCheck,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const StudentDisputes = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [disputes, setDisputes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  // Dispute Form Fields
  const [category, setCategory] = useState("Booking Session");
  const [subject, setSubject] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("UserToken");

      const [disputeRes, bookingRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/disputes`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/booking/mybookings`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const disputeData = await disputeRes.json();
      const bookingData = await bookingRes.json();

      if (!disputeRes.ok)
        throw new Error(disputeData.message || "Failed to load disputes");

      setDisputes(disputeData.disputes || []);
      if (bookingRes.ok) {
        setBookings(bookingData.bookings || []);
      }
    } catch (err) {
      toast.error(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateDispute = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !reason.trim()) {
      return toast.error("Please fill in all required fields.");
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("UserToken");

      const res = await fetch(`${API_BASE_URL}/api/disputes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category,
          subject,
          bookingId: selectedBookingId || null,
          reason,
          raisedBy: "Student",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit dispute");

      toast.success("Dispute case opened successfully!");
      setShowCreateModal(false);
      setCategory("Booking Session");
      setSubject("");
      setSelectedBookingId("");
      setReason("");
      fetchData();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
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

  const filteredDisputes =
    statusFilter === "All"
      ? disputes
      : disputes.filter((d) => d.status.includes(statusFilter));

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HERO BANNER HEADER */}
        <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 shadow-2xl p-6 sm:p-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <ShieldAlert size={32} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Dispute & Support Center
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-xl">
                Manage all your inquiries, session disputes, payment queries,
                and platform support tickets in one place.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all duration-300 flex items-center justify-center gap-2 shrink-0 hover:scale-[1.02]"
          >
            <PlusCircle size={18} /> Open New Dispute Ticket
          </button>
        </div>

        {/* CONTROLS & FILTER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400 ml-2" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Filter Status:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", "Open", "Under Review", "Resolved"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === status
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div>
          {loading ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-sm text-slate-500 mt-3">
                Loading all your tickets...
              </p>
            </div>
          ) : filteredDisputes.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm">
              <ShieldAlert size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-700">
                No Dispute Tickets Found
              </h3>
              <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
                You do not have any cases matching this filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDisputes.map((d) => (
                <div
                  key={d._id}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                          d.status
                        )}`}
                      >
                        {d.status}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                        {d.category}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-bold text-slate-800 text-base">
                          {d.subject}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0">
                          <UserCheck size={12} /> Raised by: {d.raisedBy}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100 line-clamp-2">
                        {d.reason}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => navigate(`/disputes/${d._id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-sm"
                    >
                      <MessageSquare size={15} /> Open Room{" "}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CREATE DISPUTE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 relative border border-slate-100 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4 text-amber-600">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Open Dispute / Issue Ticket
                </h2>
                <p className="text-xs text-slate-500">
                  Provide details so our team can resolve it quickly.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateDispute} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium text-slate-700"
                >
                  <option value="Booking Session">Booking Session Issue</option>
                  <option value="Course Content">
                    Course Content / Access
                  </option>
                  <option value="Payment / Refund">
                    Payment / Refund Issue
                  </option>
                  <option value="Technical Issue">
                    Platform / Technical Bug
                  </option>
                  <option value="Other">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Subject Title
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Mentor didn't join session / Course video not loading"
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium text-slate-700"
                  required
                />
              </div>

              {category === "Booking Session" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Attach Booking (Optional)
                  </label>
                  <select
                    value={selectedBookingId}
                    onChange={(e) => setSelectedBookingId(e.target.value)}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium text-slate-700"
                  >
                    <option value="">-- None / General Booking Issue --</option>
                    {bookings.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.sessionDate
                          ? new Date(b.sessionDate).toLocaleDateString()
                          : "Session"}{" "}
                        - {b.startTime} ({b.bookingStatus})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Detailed Description
                </label>
                <textarea
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe the issue in detail..."
                  className="w-full border border-slate-200 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none text-slate-700"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 transition disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDisputes;
