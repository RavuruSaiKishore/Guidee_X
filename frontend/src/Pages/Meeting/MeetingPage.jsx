import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { toast } from "react-toastify";
import { CheckCircle2, Plus, Trash2, Clock, AlertTriangle } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const MeetingPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const meetingRef = useRef(null);
  const zegoInstanceRef = useRef(null); // Keep track of Zego instance to force-destroy it

  // Wrap-up modal states for mentors
  const [showWrapUpModal, setShowWrapUpModal] = useState(false);
  const [sessionNotes, setSessionNotes] = useState("");
  const [actionItems, setActionItems] = useState([""]);
  const [isMentorUser, setIsMentorUser] = useState(false);
  const [activeMeetingData, setActiveMeetingData] = useState(null);
  const [submittingWrapUp, setSubmittingWrapUp] = useState(false);

  // Timer States
  const [timeLeft, setTimeLeft] = useState(null); // Time remaining in seconds
  const [isGracePeriod, setIsGracePeriod] = useState(false); // Indicates if we are in the extra 10 mins

  useEffect(() => {
    let zp = null;

    const startMeeting = async () => {
      try {
        const authToken =
          localStorage.getItem("UserToken") ||
          localStorage.getItem("MentorToken") ||
          localStorage.getItem("AdminToken");

        setIsMentorUser(Boolean(localStorage.getItem("MentorToken")));

        const response = await fetch(`${API_BASE_URL}/api/meeting/${roomId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          toast.error(data.message || "Unable to join meeting.");
          navigate(-1);
          return;
        }

        setActiveMeetingData(data.meeting);

        // --- TIMER SETUP ---
        if (data.meeting.scheduledEndTime) {
          const scheduledEnd = new Date(data.meeting.scheduledEndTime).getTime();
          const forceEndTime = scheduledEnd + 10 * 60 * 1000; // Add 10-minute grace period
          const now = Date.now();
          
          const remainingSeconds = Math.floor((forceEndTime - now) / 1000);
          
          if (remainingSeconds <= 0) {
            toast.error("This meeting link has expired.");
            navigate(-1);
            return;
          }
          
          setTimeLeft(remainingSeconds);
        }

        const {
          appID,
          roomId: meetingRoomId,
          bookingId,
          userID,
          userName,
          token,
        } = data.meeting;

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
          appID,
          token,
          meetingRoomId,
          userID,
          userName
        );

        zp = ZegoUIKitPrebuilt.create(kitToken);
        zegoInstanceRef.current = zp; // Store in ref for auto-close

        zp.joinRoom({
          container: meetingRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showLeavingView: true,
          showLeaveRoomConfirmDialog: true,

          onLeaveRoom: async () => {
            if (localStorage.getItem("MentorToken")) {
              setShowWrapUpModal(true);
            } else {
              await finalizeLeave(authToken, meetingRoomId, bookingId, "", []);
            }
          },

          onReturnToHomeScreenClicked: () => {
            if (localStorage.getItem("UserToken")) {
              navigate(`/review/${bookingId}`, { replace: true });
            } else {
              navigate("/mentor/CompletedBookings", { replace: true });
            }
          },
        });
      } catch (error) {
        console.error(error);
        toast.error("Unable to join meeting.");
        navigate(-1);
      }
    };

    startMeeting();

    return () => {
      if (zp) {
        zp.destroy();
      }
    };
  }, [roomId, navigate]);

  // --- COUNTDOWN TIMER EFFECT ---
  useEffect(() => {
    if (timeLeft === null || showWrapUpModal) return;

    // Auto-Close Meeting when time reaches 0
    if (timeLeft <= 0) {
      handleAutoEndMeeting();
      return;
    }

    // Check if we entered the 10-minute grace period (600 seconds)
    if (timeLeft <= 600 && !isGracePeriod) {
      setIsGracePeriod(true);
      toast.warning("Session time ended. 10 minute grace period started.", { autoClose: 5000 });
    }

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeLeft, showWrapUpModal, isGracePeriod]);

  // Handle forcing the meeting to end
  const handleAutoEndMeeting = () => {
    toast.error("Meeting time has expired. Room is closing.");
    
    if (zegoInstanceRef.current) {
      zegoInstanceRef.current.destroy(); // Force disconnect from Zego
    }

    if (isMentorUser) {
      setShowWrapUpModal(true);
    } else {
      const authToken = localStorage.getItem("UserToken");
      finalizeLeave(authToken, activeMeetingData?.roomId, activeMeetingData?.bookingId, "", []);
    }
  };

  const finalizeLeave = async (token, meetingRoomId, bookingId, notes = "", tasks = []) => {
    try {
      const formattedTasks = tasks
        .filter((t) => t.trim() !== "")
        .map((t) => ({ task: t }));

      await fetch(`${API_BASE_URL}/api/meeting/${meetingRoomId}/end`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sharedNotes: notes,
          actionItems: formattedTasks,
        }),
      });

      if (localStorage.getItem("UserToken")) {
        navigate(`/review/${bookingId}`, { replace: true });
      } else {
        navigate("/mentor/CompletedBookings", { replace: true });
      }
    } catch (err) {
      console.error("Error finalizing meeting end:", err);
      navigate(-1);
    }
  };

  const handleAddActionItem = () => setActionItems([...actionItems, ""]);
  const handleActionItemChange = (index, value) => {
    const updated = [...actionItems];
    updated[index] = value;
    setActionItems(updated);
  };
  const handleRemoveActionItem = (index) => setActionItems(actionItems.filter((_, i) => i !== index));

  const handleMentorSubmitWrapUp = async (e) => {
    e.preventDefault();
    setSubmittingWrapUp(true);

    const authToken = localStorage.getItem("MentorToken");
    if (!activeMeetingData) return;

    await finalizeLeave(
      authToken,
      activeMeetingData.roomId,
      activeMeetingData.bookingId,
      sessionNotes,
      actionItems
    );
  };

  // Helper to format remaining time
  const formatTime = (seconds) => {
    if (seconds === null) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950">
      
      {/* ================= TIMER OVERLAY ================= */}
      {!showWrapUpModal && timeLeft !== null && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className={`backdrop-blur-md px-5 py-2.5 rounded-full border flex items-center gap-2.5 shadow-xl transition-colors duration-500 ${
            isGracePeriod 
              ? "bg-red-500/20 border-red-500/50 text-red-100" 
              : "bg-slate-900/60 border-white/10 text-white"
          }`}>
            {isGracePeriod ? <AlertTriangle size={18} className="text-red-400 animate-pulse" /> : <Clock size={18} className="text-indigo-400" />}
            <span className="font-mono text-lg font-bold tracking-wider">
              {formatTime(timeLeft)}
            </span>
            {isGracePeriod && <span className="text-xs font-bold uppercase tracking-wider text-red-300 ml-1">Grace Period</span>}
          </div>
        </div>
      )}

      {/* ZEGO MEETING CONTAINER */}
      <div
        ref={meetingRef}
        style={{
          width: "100%",
          height: "100vh",
        }}
      />

      {/* ================= MENTOR POST-SESSION WRAP-UP MODAL ================= */}
      {showWrapUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-7 relative border border-slate-100">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    Session Wrap-Up & Action Items
                  </h3>
                  <p className="text-xs text-slate-500">
                    Provide session summaries and homework tasks for the student.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleMentorSubmitWrapUp} className="space-y-5">
              {/* Session Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Session Summary / Key Takeaways
                </label>
                <textarea
                  rows={3}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Summarize what was discussed, feedback given, or architecture insights..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition shadow-inner"
                />
              </div>

              {/* Action Items List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Assigned Action Items / Tasks
                  </label>
                  <button
                    type="button"
                    onClick={handleAddActionItem}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl transition"
                  >
                    <Plus size={14} /> Add Task
                  </button>
                </div>

                <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                  {actionItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleActionItemChange(index, e.target.value)}
                        placeholder={`Task #${index + 1} (e.g., Refactor React component)`}
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition"
                      />
                      {actionItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveActionItem(index)}
                          className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition shrink-0"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-7 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={submittingWrapUp}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-md shadow-indigo-200 transition active:scale-95 disabled:opacity-50"
                >
                  {submittingWrapUp ? "Saving & Closing..." : "Complete & Exit Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingPage;