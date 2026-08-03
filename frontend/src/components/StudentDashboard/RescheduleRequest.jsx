import { useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";

const RescheduleRequests = ({ requests = [], loading = false, onRefresh }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [processingId, setProcessingId] = useState(null);

  // =========================================================
  // SAFE REQUEST LIST
  // =========================================================

  const requestList = Array.isArray(requests) ? requests : [];

  // =========================================================
  // HANDLE ACCEPT / REJECT
  // =========================================================

  const handleResponse = async (requestId, status) => {
    try {
      const token = localStorage.getItem("UserToken");

      if (!token) {
        toast.error("Your session has expired. Please login again.");
        return;
      }

      setProcessingId(requestId);

      const response = await fetch(
        `${API_BASE_URL}/api/reschedule/respond/${requestId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update reschedule request.");
      }

      // =====================================================
      // SUCCESS MESSAGE
      // =====================================================

      if (status === "Accepted") {
        toast.success("New session time accepted successfully.");
      } else {
        toast.success("Reschedule request rejected.");
      }

      // =====================================================
      // REFRESH MAIN DASHBOARD DATA
      // =====================================================

      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error("Reschedule response error:", error);

      toast.error(
        error.message || "Something went wrong while updating the request."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // STATUS CONFIG
  // =========================================================

  const getStatus = (status) => {
    switch (status) {
      case "Accepted":
        return {
          icon: CheckCircle2,
          className: "bg-emerald-100 text-emerald-700",
        };

      case "Rejected":
        return {
          icon: XCircle,
          className: "bg-red-100 text-red-700",
        };

      case "Cancelled":
        return {
          icon: XCircle,
          className: "bg-slate-100 text-slate-600",
        };

      case "Pending":
      default:
        return {
          icon: Clock3,
          className: "bg-amber-100 text-amber-700",
        };
    }
  };

  // =========================================================
  // PENDING COUNT
  // =========================================================

  const pendingCount = requestList.filter(
    (request) => request?.status === "Pending"
  ).length;

  // =========================================================
  // LOADING SKELETON
  // =========================================================

  if (loading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        {/* Header Skeleton */}

        <div className="animate-pulse">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-slate-200" />

              <div>
                <div className="h-3 w-28 rounded bg-slate-200" />

                <div className="mt-2 h-7 w-56 rounded bg-slate-200" />
              </div>
            </div>

            <div className="h-16 w-24 rounded-xl bg-slate-200" />
          </div>

          {/* Request Skeletons */}

          <div className="mt-6 space-y-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <div className="h-5 w-40 rounded bg-slate-200" />

                <div className="mt-2 h-4 w-72 rounded bg-slate-200" />

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="h-28 rounded-xl bg-slate-100" />

                  <div className="h-28 rounded-xl bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* LEFT */}

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-md">
            <RefreshCw size={22} className="text-white" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
              Schedule Updates
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Reschedule Requests
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review schedule changes suggested by your mentors.
            </p>
          </div>
        </div>

        {/* PENDING COUNT */}

        <div className="rounded-xl border border-orange-100 bg-orange-50 px-5 py-3 text-center">
          <p className="text-xs font-medium text-slate-500">Pending Requests</p>

          <p className="mt-1 text-2xl font-extrabold text-orange-600">
            {pendingCount}
          </p>
        </div>
      </div>

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {requestList.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-5 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <AlertCircle size={32} className="text-slate-400" />
          </div>

          <h3 className="mt-4 font-bold text-slate-900">
            No Reschedule Requests
          </h3>

          <p className="mt-1 max-w-md text-sm text-slate-500">
            You don't have any pending schedule change requests from your
            mentors.
          </p>
        </div>
      ) : (
        /* ===================================================
           REQUEST LIST
        ==================================================== */

        <div className="space-y-4">
          {requestList.map((request) => {
            // =================================================
            // MENTOR
            // =================================================

            const mentorName =
              `${request?.mentor?.firstName || ""} ${
                request?.mentor?.lastName || ""
              }`.trim() || "Your Mentor";

            // =================================================
            // STATUS
            // =================================================

            const statusConfig = getStatus(request?.status);

            const StatusIcon = statusConfig.icon;

            // =================================================
            // PROCESSING
            // =================================================

            const isProcessing = processingId === request?._id;

            // =================================================
            // BOOKING
            // =================================================

            const booking = request?.booking || {};

            return (
              <div
                key={request?._id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 hover:shadow-sm"
              >
                {/* =================================================
                      TOP SECTION
                  ================================================== */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {mentorName}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Your mentor suggested a new session schedule.
                    </p>

                    {/* SESSION TYPE */}

                    {booking.sessionType && (
                      <div className="mt-3 inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                        {booking.sessionType}
                      </div>
                    )}
                  </div>

                  {/* STATUS */}

                  <span
                    className={`flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${statusConfig.className}`}
                  >
                    <StatusIcon size={14} />

                    {request?.status || "Pending"}
                  </span>
                </div>

                {/* =================================================
                      SCHEDULE COMPARISON
                  ================================================== */}

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {/* ORIGINAL */}

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Original Schedule
                    </p>

                    <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <CalendarDays size={16} className="text-slate-500" />

                      {formatDate(request?.originalSessionDate)}
                    </p>

                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                      <Clock3 size={16} className="text-slate-400" />
                      {request?.originalStartTime || "N/A"} -{" "}
                      {request?.originalEndTime || "N/A"}
                    </p>
                  </div>

                  {/* REQUESTED */}

                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-500">
                      Requested Schedule
                    </p>

                    <p className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-800">
                      <CalendarDays size={16} className="text-blue-600" />

                      {formatDate(request?.requestedSessionDate)}
                    </p>

                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                      <Clock3 size={16} className="text-blue-600" />
                      {request?.requestedStartTime || "N/A"} -{" "}
                      {request?.requestedEndTime || "N/A"}
                    </p>
                  </div>
                </div>

                {/* =================================================
                      REASON
                  ================================================== */}

                {request?.reason && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Mentor's Reason
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {request.reason}
                    </p>
                  </div>
                )}

                {/* =================================================
                      ACTIONS
                  ================================================== */}

                {request?.status === "Pending" && (
                  <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                    {/* REJECT */}

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleResponse(request._id, "Rejected")}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <XCircle size={16} />
                      )}
                      Reject
                    </button>

                    {/* ACCEPT */}

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleResponse(request._id, "Accepted")}
                      className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}

                      {isProcessing ? "Updating..." : "Accept New Time"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RescheduleRequests;
