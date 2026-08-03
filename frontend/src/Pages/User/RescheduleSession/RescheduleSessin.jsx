import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Loader2,
  MessageSquareText,
  RefreshCw,
  UserRound,
  X,
  XCircle,
  ArrowRight,
  Hourglass,
  ShieldCheck,
} from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RescheduleRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  // ==========================================================
  // ACTION STATE
  // ==========================================================

  const [processingId, setProcessingId] = useState(null);

  // ==========================================================
  // CONFIRMATION MODAL
  // ==========================================================

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null);

  // ==========================================================
  // FETCH RESCHEDULE REQUESTS
  // ==========================================================

  useEffect(() => {
    fetchRescheduleRequests();
  }, []);

  const fetchRescheduleRequests = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = localStorage.getItem("UserToken");

      if (!token) {
        toast.error("Please login again.");
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}/api/reschedule/my-requests`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      console.log("RESCHEDULE REQUESTS:", data);

      if (!res.ok) {
        throw new Error(
          data.message || "Unable to fetch reschedule requests."
        );
      }

      setRequests(data.requests || []);
    } catch (error) {
      console.error("FETCH RESCHEDULE REQUESTS ERROR:", error);

      toast.error(
        error.message || "Unable to load reschedule requests."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================================
  // OPEN CONFIRMATION MODAL
  // ==========================================================

  const openConfirmModal = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setShowConfirmModal(true);
  };

  // ==========================================================
  // CLOSE CONFIRMATION MODAL
  // ==========================================================

  const closeConfirmModal = () => {
    if (processingId) return;

    setShowConfirmModal(false);
    setSelectedRequest(null);
    setActionType(null);
  };

  // ==========================================================
  // ACCEPT REQUEST
  // ==========================================================

 const handleAcceptRequest = async () => {
   if (!selectedRequest) return;

   try {
     setProcessingId(selectedRequest._id);

     const token = localStorage.getItem("UserToken");

     if (!token) {
       toast.error("Authentication token not found.");
       return;
     }

     const res = await fetch(
       `${API_BASE_URL}/api/reschedule/${selectedRequest._id}/accept`,
       {
         method: "PATCH",
         headers: {
           Authorization: `Bearer ${token}`,
         },
       }
     );

     const data = await res.json();

     console.log("ACCEPT RESPONSE:", data);

     if (!res.ok) {
       throw new Error(data.message || "Unable to accept reschedule request.");
     }

     // Update UI immediately
     setRequests((prev) =>
       prev.map((request) =>
         request._id === selectedRequest._id
           ? {
               ...request,
               status: "Accepted",
               respondedAt: new Date().toISOString(),
             }
           : request
       )
     );

     closeConfirmModal();

     toast.success(data.message || "Reschedule request accepted successfully.");

     // Navigate to My Bookings after successful acceptance
     setTimeout(() => {
       navigate("/my-bookings");
     }, 1000);
   } catch (error) {
     console.error("ACCEPT RESCHEDULE ERROR:", error);

     toast.error(error.message || "Unable to accept reschedule request.");
   } finally {
     setProcessingId(null);
   }
 };
  // ==========================================================
  // REJECT REQUEST
  // ==========================================================

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;

    try {
      setProcessingId(selectedRequest._id);

      const token = localStorage.getItem("UserToken");

      const res = await fetch(
        `${API_BASE_URL}/api/reschedule/${selectedRequest._id}/reject`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Unable to reject reschedule request."
        );
      }

      toast.success(
        data.message || "Reschedule request rejected."
      );

      // Update UI immediately
      setRequests((prev) =>
        prev.map((request) =>
          request._id === selectedRequest._id
            ? {
                ...request,
                status: "Rejected",
                respondedAt: new Date().toISOString(),
              }
            : request
        )
      );

      closeConfirmModal();
    } catch (error) {
      console.error("REJECT RESCHEDULE ERROR:", error);

      toast.error(
        error.message || "Unable to reject reschedule request."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================================================
  // CONFIRM ACTION
  // ==========================================================

  const handleConfirmAction = () => {
    if (actionType === "accept") {
      handleAcceptRequest();
    }

    if (actionType === "reject") {
      handleRejectRequest();
    }
  };

  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================================
  // FORMAT REQUESTED DATE
  // ==========================================================

  const formatFullDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================================
  // MENTOR IMAGE
  // ==========================================================

  const getMentorImage = (mentor) => {
    if (!mentor?.profileImage) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${mentor?.firstName || ""} ${mentor?.lastName || ""}`
      )}&background=4f46e5&color=ffffff`;
    }

    if (mentor.profileImage.startsWith("http")) {
      return mentor.profileImage;
    }

    return `${API_BASE_URL}/${mentor.profileImage.replace(/^\/+/, "")}`;
  };

  // ==========================================================
  // STATUS CONFIG
  // ==========================================================

  const getStatusConfig = (status) => {
    switch (status) {
      case "Pending":
        return {
          label: "Awaiting Your Response",
          icon: Hourglass,
          badge:
            "bg-amber-50 text-amber-700 border-amber-200",
          iconBg: "bg-amber-100",
          iconColor: "text-amber-600",
        };

      case "Accepted":
        return {
          label: "Accepted",
          icon: CheckCircle2,
          badge:
            "bg-emerald-50 text-emerald-700 border-emerald-200",
          iconBg: "bg-emerald-100",
          iconColor: "text-emerald-600",
        };

      case "Rejected":
        return {
          label: "Rejected",
          icon: XCircle,
          badge: "bg-red-50 text-red-700 border-red-200",
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
        };

      case "Cancelled":
        return {
          label: "Cancelled",
          icon: XCircle,
          badge:
            "bg-slate-100 text-slate-600 border-slate-200",
          iconBg: "bg-slate-100",
          iconColor: "text-slate-500",
        };

      default:
        return {
          label: status || "Unknown",
          icon: AlertCircle,
          badge:
            "bg-slate-100 text-slate-600 border-slate-200",
          iconBg: "bg-slate-100",
          iconColor: "text-slate-500",
        };
    }
  };

  // ==========================================================
  // FILTER COUNTS
  // ==========================================================

  const counts = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter(
        (request) => request.status === "Pending"
      ).length,
      accepted: requests.filter(
        (request) => request.status === "Accepted"
      ).length,
      rejected: requests.filter(
        (request) => request.status === "Rejected"
      ).length,
    };
  }, [requests]);

  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto">
            <Loader2
              size={34}
              className="text-indigo-600 animate-spin"
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-800">
            Loading Reschedule Requests
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Checking if any mentor has requested a schedule change.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-10 mt-15">
      <ToastContainer
        position="top-right"
        autoClose={2500}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ======================================================
            HEADER
        ======================================================= */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <RefreshCw
                size={27}
                className="text-white"
              />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Reschedule Requests
              </h1>

              <p className="text-slate-500 mt-1">
                Review schedule changes requested by your mentors.
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchRescheduleRequests(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition disabled:opacity-60"
          >
            <RefreshCw
              size={18}
              className={refreshing ? "animate-spin" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* ======================================================
            SUMMARY CARDS
        ======================================================= */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          {/* Total */}

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Total Requests
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {counts.total}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center">
                <RefreshCw
                  size={21}
                  className="text-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Pending */}

          <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Pending
                </p>

                <p className="text-3xl font-bold text-amber-600 mt-2">
                  {counts.pending}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
                <Hourglass
                  size={21}
                  className="text-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Accepted */}

          <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Accepted
                </p>

                <p className="text-3xl font-bold text-emerald-600 mt-2">
                  {counts.accepted}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2
                  size={21}
                  className="text-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Rejected */}

          <div className="bg-white rounded-2xl border border-red-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Rejected
                </p>

                <p className="text-3xl font-bold text-red-600 mt-2">
                  {counts.rejected}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center">
                <XCircle
                  size={21}
                  className="text-red-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            EMPTY STATE
        ======================================================= */}

        {requests.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 md:p-20 text-center">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center mx-auto">
              <CheckCircle2
                size={42}
                className="text-indigo-500"
              />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-7">
              No Reschedule Requests
            </h2>

            <p className="text-slate-500 mt-3 max-w-md mx-auto">
              You don't have any schedule change requests from your
              mentors at the moment.
            </p>
          </div>
        ) : (
          /* ======================================================
             REQUEST LIST
          ======================================================= */

          <div className="space-y-6">
            {requests.map((request) => {
              const statusConfig = getStatusConfig(
                request.status
              );

              const StatusIcon = statusConfig.icon;

              const isPending =
                request.status === "Pending";

              const isProcessing =
                processingId === request._id;

              return (
                <div
                  key={request._id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* ==================================================
                      REQUEST HEADER
                  =================================================== */}

                  <div className="p-6 md:p-7 border-b border-slate-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                      {/* Mentor */}

                      <div className="flex items-center gap-4">
                        <img
                          src={getMentorImage(
                            request.mentor
                          )}
                          alt={`${request.mentor?.firstName || ""} ${
                            request.mentor?.lastName || ""
                          }`}
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                        />

                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-slate-900">
                              {request.mentor?.firstName}{" "}
                              {request.mentor?.lastName}
                            </h2>

                            <ShieldCheck
                              size={18}
                              className="text-indigo-500"
                            />
                          </div>

                          <p className="text-sm text-slate-500 mt-1">
                            {request.mentor?.profession ||
                              "Mentor"}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            Request sent on{" "}
                            {formatDate(
                              request.createdAt
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Status */}

                      <div
                        className={`inline-flex items-center gap-2 self-start lg:self-center px-4 py-2 rounded-full border font-semibold text-sm ${statusConfig.badge}`}
                      >
                        <StatusIcon size={17} />

                        {statusConfig.label}
                      </div>
                    </div>
                  </div>

                  {/* ==================================================
                      REQUEST BODY
                  =================================================== */}

                  <div className="p-6 md:p-7">

                    {/* ==================================================
                        SCHEDULE COMPARISON
                    =================================================== */}

                    <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">

                      {/* ORIGINAL */}

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <div className="flex items-center gap-2 mb-5">
                          <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center">
                            <CalendarDays
                              size={18}
                              className="text-slate-600"
                            />
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-wide font-bold text-slate-400">
                              Current Schedule
                            </p>

                            <p className="text-sm font-semibold text-slate-700 mt-0.5">
                              Your existing booking
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <CalendarDays
                              size={19}
                              className="text-slate-500"
                            />

                            <div>
                              <p className="text-xs text-slate-400">
                                Date
                              </p>

                              <p className="font-bold text-slate-800">
                                {formatFullDate(
                                  request.originalSessionDate
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Clock3
                              size={19}
                              className="text-slate-500"
                            />

                            <div>
                              <p className="text-xs text-slate-400">
                                Start Time
                              </p>

                              <p className="font-bold text-slate-800">
                                {request.originalStartTime ||
                                  "Not available"}
                              </p>
                            </div>
                          </div>

                          {request.originalEndTime && (
                            <div>
                              <p className="text-xs text-slate-400">
                                End Time
                              </p>

                              <p className="font-semibold text-slate-700">
                                {request.originalEndTime}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ARROW */}

                      <div className="hidden lg:flex items-center justify-center">
                        <div className="w-11 h-11 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                          <ArrowRight
                            size={21}
                            className="text-indigo-600"
                          />
                        </div>
                      </div>

                      {/* REQUESTED */}

                      <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/50 p-5">
                        <div className="flex items-center gap-2 mb-5">
                          <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                            <RefreshCw
                              size={18}
                              className="text-indigo-600"
                            />
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-wide font-bold text-indigo-500">
                              Proposed Schedule
                            </p>

                            <p className="text-sm font-semibold text-indigo-800 mt-0.5">
                              Mentor's new proposal
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <CalendarDays
                              size={19}
                              className="text-indigo-600"
                            />

                            <div>
                              <p className="text-xs text-indigo-400">
                                New Date
                              </p>

                              <p className="font-bold text-slate-900">
                                {formatFullDate(
                                  request.requestedSessionDate
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Clock3
                              size={19}
                              className="text-indigo-600"
                            />

                            <div>
                              <p className="text-xs text-indigo-400">
                                New Start Time
                              </p>

                              <p className="font-bold text-slate-900">
                                {request.requestedStartTime ||
                                  "Not available"}
                              </p>
                            </div>
                          </div>

                          {request.requestedEndTime && (
                            <div>
                              <p className="text-xs text-indigo-400">
                                New End Time
                              </p>

                              <p className="font-semibold text-slate-800">
                                {request.requestedEndTime}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ==================================================
                        REASON
                    =================================================== */}

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="flex items-center gap-2">
                        <MessageSquareText
                          size={19}
                          className="text-indigo-600"
                        />

                        <p className="text-sm font-bold text-slate-800">
                          Mentor's Reason
                        </p>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {request.reason ||
                          "The mentor did not provide a reason for this schedule change."}
                      </p>
                    </div>

                    {/* ==================================================
                        PENDING WARNING
                    =================================================== */}

                    {isPending && (
                      <div className="mt-6 flex items-start gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4">
                        <AlertCircle
                          size={21}
                          className="text-amber-600 flex-shrink-0 mt-0.5"
                        />

                        <div>
                          <p className="font-bold text-amber-800">
                            Your booking has not changed yet
                          </p>

                          <p className="text-sm text-amber-700 mt-1 leading-5">
                            The original booking will remain active
                            at its current date and time until you
                            accept this request.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* ==================================================
                        ACCEPTED MESSAGE
                    =================================================== */}

                    {request.status === "Accepted" && (
                      <div className="mt-6 flex items-start gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
                        <CheckCircle2
                          size={21}
                          className="text-emerald-600 flex-shrink-0 mt-0.5"
                        />

                        <div>
                          <p className="font-bold text-emerald-800">
                            Reschedule accepted
                          </p>

                          <p className="text-sm text-emerald-700 mt-1">
                            Your booking has been moved to the
                            proposed date and time.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* ==================================================
                        REJECTED MESSAGE
                    =================================================== */}

                    {request.status === "Rejected" && (
                      <div className="mt-6 flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 p-4">
                        <XCircle
                          size={21}
                          className="text-red-600 flex-shrink-0 mt-0.5"
                        />

                        <div>
                          <p className="font-bold text-red-800">
                            Reschedule request rejected
                          </p>

                          <p className="text-sm text-red-700 mt-1">
                            Your original booking remains unchanged.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* ==================================================
                        ACTION BUTTONS
                    =================================================== */}

                    {isPending && (
                      <div className="mt-7 flex flex-col sm:flex-row justify-end gap-3">

                        {/* Reject */}

                        <button
                          onClick={() =>
                            openConfirmModal(
                              request,
                              "reject"
                            )
                          }
                          disabled={isProcessing}
                          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-red-200 bg-white text-red-600 font-semibold hover:bg-red-50 transition disabled:opacity-50"
                        >
                          <X size={18} />

                          Reject Request
                        </button>

                        {/* Accept */}

                        <button
                          onClick={() =>
                            openConfirmModal(
                              request,
                              "accept"
                            )
                          }
                          disabled={isProcessing}
                          className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition disabled:opacity-50"
                        >
                          <Check size={18} />

                          Accept Reschedule
                        </button>
                      </div>
                    )}

                    {/* ==================================================
                        RESPONSE DATE
                    =================================================== */}

                    {request.respondedAt && (
                      <div className="mt-5 text-right">
                        <p className="text-xs text-slate-400">
                          Responded on{" "}
                          {formatDate(
                            request.respondedAt
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ==========================================================
          CONFIRMATION MODAL
      =========================================================== */}

      {showConfirmModal && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

            {/* Modal Header */}

            <div
              className={`p-6 ${
                actionType === "accept"
                  ? "bg-indigo-50"
                  : "bg-red-50"
              }`}
            >
              <div className="flex items-center gap-4">

                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    actionType === "accept"
                      ? "bg-indigo-100"
                      : "bg-red-100"
                  }`}
                >
                  {actionType === "accept" ? (
                    <CheckCircle2
                      size={25}
                      className="text-indigo-600"
                    />
                  ) : (
                    <XCircle
                      size={25}
                      className="text-red-600"
                    />
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {actionType === "accept"
                      ? "Accept Reschedule?"
                      : "Reject Reschedule?"}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Please confirm your decision.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}

            <div className="p-6">

              {actionType === "accept" ? (
                <p className="text-sm leading-6 text-slate-600">
                  Are you sure you want to accept this
                  reschedule request? Your booking will be
                  updated to the mentor's proposed date and
                  time.
                </p>
              ) : (
                <p className="text-sm leading-6 text-slate-600">
                  Are you sure you want to reject this
                  reschedule request? Your original booking
                  date and time will remain unchanged.
                </p>
              )}

              {/* Schedule Preview */}

              <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <UserRound
                    size={18}
                    className="text-indigo-600"
                  />

                  <p className="font-semibold text-slate-800">
                    {selectedRequest.mentor?.firstName}{" "}
                    {selectedRequest.mentor?.lastName}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400">
                      Current
                    </p>

                    <p className="text-sm font-semibold text-slate-700 mt-1">
                      {formatDate(
                        selectedRequest.originalSessionDate
                      )}
                    </p>

                    <p className="text-sm text-slate-500">
                      {selectedRequest.originalStartTime}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-indigo-500">
                      Proposed
                    </p>

                    <p className="text-sm font-semibold text-indigo-700 mt-1">
                      {formatDate(
                        selectedRequest.requestedSessionDate
                      )}
                    </p>

                    <p className="text-sm text-indigo-600">
                      {selectedRequest.requestedStartTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">

                <button
                  onClick={closeConfirmModal}
                  disabled={processingId}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirmAction}
                  disabled={!!processingId}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition disabled:opacity-60 ${
                    actionType === "accept"
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {processingId ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Processing...
                    </>
                  ) : actionType === "accept" ? (
                    <>
                      <Check size={18} />

                      Confirm Accept
                    </>
                  ) : (
                    <>
                      <X size={18} />

                      Confirm Reject
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RescheduleRequests;
