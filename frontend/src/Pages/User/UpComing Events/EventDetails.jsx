import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  Share2,
  Sparkles,
  UserRound,
  Video,
  Users,
  Bell,
  ShieldCheck,
  Timer,
  Check,
  Loader2,
  ExternalLink,
  Building2,
  Briefcase,
  Image as ImageIcon,
  X,
} from "lucide-react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EventDetails = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { id } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [event, setEvent] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);

  const [loading, setLoading] = useState(true);

  const [registrationLoading, setRegistrationLoading] = useState(false);

  const [isRegistered, setIsRegistered] = useState(false);

  const [registration, setRegistration] = useState(null);

  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const [showCongratulationsModal, setShowCongratulationsModal] =
    useState(false);

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [eventStarted, setEventStarted] = useState(false);

  const [eventEnded, setEventEnded] = useState(false);

  const [canJoinMeeting, setCanJoinMeeting] = useState(false);

  const [joinCountdown, setJoinCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [copied, setCopied] = useState(false);

  // =====================================================
  // GET USER TOKEN
  // =====================================================

  const getUserToken = () => {
    return localStorage.getItem("UserToken");
  };

  // =====================================================
  // IMAGE URL HELPER
  // =====================================================

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "";
    }

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    const cleanBaseUrl = API_BASE_URL?.replace(/\/+$/, "");

    const cleanImagePath = imagePath.replace(/^\/+/, "");

    return `${cleanBaseUrl}/${cleanImagePath}`;
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "Date not available";
    }

    return parsedDate.toLocaleDateString("en-US", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // =====================================================
  // FORMAT SHORT DATE
  // =====================================================

  const formatShortDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (date) => {
    if (!date) {
      return "Time not available";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "Time not available";
    }

    return parsedDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // =====================================================
  // FORMAT DATE + TIME
  // =====================================================

  const formatDateTime = (date) => {
    if (!date) {
      return "Date and time not available";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "Date and time not available";
    }

    return parsedDate.toLocaleString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // =====================================================
  // REGISTRATION CLOSED
  // =====================================================

  const isRegistrationClosed = () => {
    if (!event?.registrationDeadline) {
      return false;
    }

    const deadline = new Date(event.registrationDeadline);

    if (isNaN(deadline.getTime())) {
      return false;
    }

    return Date.now() >= deadline.getTime();
  };

  // =====================================================
  // GET START DATE
  // =====================================================

  const getStartDate = () => {
    if (!event?.startDateTime) {
      return null;
    }

    const date = new Date(event.startDateTime);

    if (isNaN(date.getTime())) {
      return null;
    }

    return date;
  };

  // =====================================================
  // GET END DATE
  // =====================================================

  const getEndDate = () => {
    if (!event?.endDateTime) {
      return null;
    }

    const date = new Date(event.endDateTime);

    if (isNaN(date.getTime())) {
      return null;
    }

    return date;
  };

  // =====================================================
  // EVENT STATUS
  // =====================================================

  useEffect(() => {
    if (!event?.startDateTime || !event?.endDateTime) {
      return;
    }

    const checkEventStatus = () => {
      const now = Date.now();

      const startTime = new Date(event.startDateTime).getTime();

      const endTime = new Date(event.endDateTime).getTime();

      if (isNaN(startTime) || isNaN(endTime)) {
        return;
      }

      // EVENT COMPLETED

      if (event.status === "Completed" || now >= endTime) {
        setEventEnded(true);
        setEventStarted(false);
        setCanJoinMeeting(false);

        return;
      }

      // EVENT LIVE

      if (now >= startTime && now < endTime) {
        setEventEnded(false);
        setEventStarted(true);

        return;
      }

      // EVENT UPCOMING

      setEventEnded(false);
      setEventStarted(false);
    };

    checkEventStatus();

    const timer = setInterval(checkEventStatus, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [event?.startDateTime, event?.endDateTime, event?.status]);

  // =====================================================
  // MAIN EVENT COUNTDOWN
  // =====================================================

  useEffect(() => {
    if (!event?.startDateTime) {
      return;
    }

    const startTime = new Date(event.startDateTime).getTime();

    if (isNaN(startTime)) {
      return;
    }

    const updateCountdown = () => {
      const difference = startTime - Date.now();

      if (difference <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

      const minutes = Math.floor((difference / (1000 * 60)) % 60);

      const seconds = Math.floor((difference / 1000) % 60);

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
      });
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [event?.startDateTime]);

  // =====================================================
  // JOIN MEETING TIMER
  // =====================================================

  useEffect(() => {
    if (!event?.startDateTime || !event?.endDateTime) {
      setCanJoinMeeting(false);
      return;
    }

    const startTime = new Date(event.startDateTime).getTime();

    const endTime = new Date(event.endDateTime).getTime();

    if (isNaN(startTime) || isNaN(endTime)) {
      setCanJoinMeeting(false);
      return;
    }

    const joinTime = startTime - 10 * 60 * 1000;

    const updateJoinTimer = async () => {
      const now = Date.now();

      // EVENT END TIME REACHED

      if (now >= endTime) {
        setCanJoinMeeting(false);

        setJoinCountdown({
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        if (event.status !== "Completed") {
          try {
            const token = getUserToken();

            const response = await fetch(
              `${API_BASE_URL}/api/events/${event._id}/complete`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const data = await response.json();

            if (response.ok) {
              setEvent((prevEvent) => ({
                ...prevEvent,
                status: "Completed",
              }));

              console.log("Event automatically completed");
            } else {
              console.error("Failed to mark event completed:", data.message);
            }
          } catch (error) {
            console.error("Auto complete event error:", error);
          }
        }

        return;
      }

      // EVENT ALREADY COMPLETED

      if (event.status === "Completed") {
        setCanJoinMeeting(false);

        setJoinCountdown({
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      // JOIN AVAILABLE

      if (now >= joinTime) {
        setCanJoinMeeting(true);

        setJoinCountdown({
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      // JOIN NOT AVAILABLE

      setCanJoinMeeting(false);

      const difference = joinTime - now;

      const hours = Math.floor(difference / (1000 * 60 * 60));

      const minutes = Math.floor((difference / (1000 * 60)) % 60);

      const seconds = Math.floor((difference / 1000) % 60);

      setJoinCountdown({
        hours,
        minutes,
        seconds,
      });
    };

    updateJoinTimer();

    const timer = setInterval(updateJoinTimer, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [
    event?.startDateTime,
    event?.endDateTime,
    event?.status,
    event?._id,
    isRegistered,
  ]);

  // =====================================================
  // FETCH EVENT
  // =====================================================

  const fetchEvent = async () => {
    try {
      setLoading(true);

      const token = getUserToken();

      if (!token) {
        toast.error("Please login to view this event");

        navigate("/login");

        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/events/eventDetails/${id}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Event Details Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch event");
      }

      const eventData = data.event || data;

      setEvent(eventData);

      setIsRegistered(Boolean(data.isRegistered));

      setRegistration(data.registration || null);
    } catch (error) {
      console.error("Get Event Error:", error);

      toast.error(error.message || "Failed to load event");

      setTimeout(() => {
        navigate("/events");
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PAGE LOAD
  // =====================================================

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  // =====================================================
  // OPEN REGISTRATION CONFIRMATION MODAL
  // =====================================================

  const handleRegister = () => {
    const token = getUserToken();

    if (!token) {
      toast.error("Please login to register for this event");

      navigate("/login");

      return;
    }

    if (!event?._id) {
      toast.error("Event information is unavailable");

      return;
    }

    if (isRegistered) {
      toast.info("You are already registered for this event");

      return;
    }

    if (eventEnded) {
      toast.error("This event has already ended");

      return;
    }

    if (eventStarted) {
      toast.error("This event has already started");

      return;
    }

    if (isRegistrationClosed()) {
      toast.error("Registration deadline has passed");

      return;
    }

    // OPEN CONFIRMATION MODAL

    setShowRegistrationModal(true);
  };

  // =====================================================
  // CONFIRM REGISTRATION
  // =====================================================

  const confirmRegistration = async () => {
    try {
      const token = getUserToken();

      if (!token) {
        toast.error("Please login to register for this event");

        navigate("/login");

        return;
      }

      setRegistrationLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/event-registration/register/${event._id}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register for this event");
      }

      // UPDATE REGISTRATION STATE

      setIsRegistered(true);

      setRegistration(
        data.registration || {
          status: "Registered",
          registeredAt: new Date(),
          meetingLink: null,
        }
      );

      // CLOSE CONFIRMATION MODAL

      setShowRegistrationModal(false);

      // OPEN CONGRATULATIONS MODAL

      setShowCongratulationsModal(true);
      toast.success("Registered successfully");
    } catch (error) {
      console.error("Register Event Error:", error);

      toast.error(error.message || "Failed to register for the event");
    } finally {
      setRegistrationLoading(false);
    }
  };

  const cancelRegistration = async () => {
    try {
      const token = getUserToken();

      if (!token) {
        toast.error("Please login again");
        return;
      }

      if (!registration?._id) {
        toast.error("Registration details not found");
        return;
      }

      setCancelLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/event-registration/cancel/${event._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            registrationId: registration._id,
          }),
        }
      );

      const data = await response.json();

      console.log("Cancel Registration Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel registration");
      }

      setIsRegistered(false);

      setRegistration(null);

      setShowCancelModal(false);

      toast.success("Registration cancelled successfully");
    } catch (error) {
      console.error("Cancel Registration Error:", error);

      toast.error(error.message || "Failed to cancel registration");
    } finally {
      setCancelLoading(false);
    }
  };

  // =====================================================
  // JOIN MEETING
  // =====================================================

  const handleJoinMeeting = () => {
    if (!isRegistered) {
      toast.error("Please register for the event first");

      return;
    }

    if (eventEnded) {
      toast.error("This event has already ended");

      return;
    }

    if (!canJoinMeeting) {
      toast.info(
        "The meeting will be available 10 minutes before the event starts"
      );

      return;
    }

    if (!registration?.meetingLink) {
      toast.error("Meeting link is not available yet. Please try again later.");

      return;
    }

    window.open(registration.meetingLink, "_blank", "noopener,noreferrer");
  };

  // =====================================================
  // SHARE EVENT
  // =====================================================

  const handleShare = async () => {
    try {
      const shareData = {
        title: event?.title || "GuideX Event",

        text: event?.description || "Check out this upcoming event on GuideX.",

        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);

        setCopied(true);

        toast.success("Event link copied to clipboard");

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Share Error:", error);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

   if (loading) {
     return (
       <div className="fixed inset-0 flex min-h-screen flex-col items-center justify-center bg-white px-4">
         <div className="relative">
           <div className="h-16 w-16 rounded-full border-4 border-blue-100" />

           <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
         </div>

         <p className="mt-6 text-center text-lg font-semibold text-gray-700">
           Loading your Selected Event's Details...
         </p>

         <p className="mt-1 text-center text-sm text-gray-400">
           Please wait while we fetch the Event's data.
         </p>
       </div>
     );
   }

  // =====================================================
  // EVENT NOT FOUND
  // =====================================================

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>

          <p className="mt-2 text-gray-500">
            The event you are looking for does not exist.
          </p>

          <button
            onClick={() => navigate("/events")}
            className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // DERIVED DATA
  // =====================================================

  const bannerImage = getImageUrl(event.bannerImage);

  const speakerImage = getImageUrl(event.speakerImage);

  const startDate = getStartDate();

  const endDate = getEndDate();

  const registrationClosed = isRegistrationClosed();

  const meetingLink = registration?.meetingLink || null;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {/* =====================================================
          REGISTRATION CONFIRMATION MODAL
      ====================================================== */}

      {showRegistrationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* CLOSE BUTTON */}

            <button
              onClick={() => setShowRegistrationModal(false)}
              disabled={registrationLoading}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
            >
              <X size={18} />
            </button>

            {/* MODAL HEADER */}

            <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 px-6 py-8 text-center text-white">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                <CalendarCheck2 size={30} />
              </div>

              <h2 className="mt-5 text-2xl font-bold">Confirm Registration</h2>

              <p className="mt-2 text-sm leading-6 text-blue-100">
                You're about to register for this GuideX event.
              </p>
            </div>

            {/* MODAL BODY */}

            <div className="p-6">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Event
                </p>

                <h3 className="mt-2 text-lg font-bold text-gray-900">
                  {event.title}
                </h3>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CalendarDays size={17} className="text-indigo-600" />

                    {formatDate(event.startDateTime)}
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Clock3 size={17} className="text-indigo-600" />

                    {formatTime(event.startDateTime)}
                  </div>

                  {event.speaker && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <UserRound size={17} className="text-indigo-600" />

                      {event.speaker}
                    </div>
                  )}
                </div>
              </div>

              <p className="mt-5 text-center text-sm leading-6 text-gray-500">
                Would you like to confirm your registration for this event?
              </p>

              {/* BUTTONS */}

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowRegistrationModal(false)}
                  disabled={registrationLoading}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmRegistration}
                  disabled={registrationLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {registrationLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      Confirm
                      <Check size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900">
              Cancel Registration?
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Are you sure you want to cancel your registration for this event?
              You will lose your reserved spot.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelLoading}
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                No, Keep It
              </button>

              <button
                onClick={cancelRegistration}
                disabled={cancelLoading}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {cancelLoading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Cancelling
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          CONGRATULATIONS MODAL
      ====================================================== */}

      {showCongratulationsModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* CLOSE BUTTON */}

            <button
              onClick={() => setShowCongratulationsModal(false)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
            >
              <X size={18} />
            </button>

            {/* SUCCESS HEADER */}

            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 px-6 py-10 text-center text-white">
              {/* DECORATION */}

              <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/10" />

              <div className="absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-white/10" />

              {/* SUCCESS ICON */}

              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl">
                <CheckCircle2 size={48} className="text-emerald-500" />
              </div>

              <h2 className="relative mt-6 text-3xl font-bold">
                Congratulations! 🎉
              </h2>

              <p className="relative mt-3 text-sm leading-6 text-emerald-50">
                You have successfully registered for the event.
              </p>
            </div>

            {/* SUCCESS BODY */}

            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900">
                You're All Set!
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Your spot has been successfully reserved for:
              </p>

              <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <p className="text-sm font-bold text-emerald-800">
                  {event.title}
                </p>

                <div className="mt-3 flex flex-col items-center gap-2 text-xs text-emerald-600">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={15} />

                    {formatDate(event.startDateTime)}
                  </span>

                  <span className="flex items-center gap-2">
                    <Clock3 size={15} />

                    {formatTime(event.startDateTime)}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-xl bg-blue-50 p-4 text-left">
                <Bell size={18} className="mt-0.5 shrink-0 text-blue-600" />

                <p className="text-xs leading-5 text-blue-700">
                  The meeting will be available 10 minutes before the event
                  starts. You can join from this page when the meeting becomes
                  available.
                </p>
              </div>

              <button
                onClick={() => setShowCongratulationsModal(false)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700"
              >
                Continue
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          HERO / BANNER
      ====================================================== */}

      <section className="relative overflow-hidden bg-slate-950">
        {bannerImage ? (
          <div className="absolute inset-0">
            <img
              src={bannerImage}
              alt={event.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            <div className="absolute inset-0 bg-slate-950/50" />

            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/40" />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-blue-900 to-cyan-900">
            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />

            <div className="absolute -bottom-40 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl" />
          </div>
        )}

        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/events")}
            className="mb-10 flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <ArrowLeft size={17} />
            Back to Events
          </button>

          <div className="grid gap-10 pb-16 lg:grid-cols-3 lg:items-center">
            <div className="lg:col-span-2">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <div
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${
                    eventEnded
                      ? "border-gray-400/20 bg-gray-400/10 text-gray-300"
                      : eventStarted
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                      : "border-blue-400/20 bg-blue-400/10 text-blue-200"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      eventEnded
                        ? "bg-gray-400"
                        : eventStarted
                        ? "animate-pulse bg-emerald-400"
                        : "bg-blue-400"
                    }`}
                  />

                  {eventEnded
                    ? "Completed"
                    : eventStarted
                    ? "Live Now"
                    : "Upcoming"}
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur">
                  <Video size={14} />
                  Live Online Event
                </div>

                {isRegistered && (
                  <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-300">
                    <CheckCircle2 size={14} />
                    Registered
                  </div>
                )}
              </div>

              <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                {event.title}
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                {event.description}
              </p>

              <div className="mt-8 flex items-center gap-4">
                {speakerImage ? (
                  <img
                    src={speakerImage}
                    alt={event.speaker || "Speaker"}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-white/20"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg">
                    <UserRound size={22} />
                  </div>
                )}

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Featured Speaker
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {event.speaker || "GuideX Expert"}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    {event.speakerRole && (
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Briefcase size={12} />
                        {event.speakerRole}
                      </span>
                    )}

                    {event.speakerCompany && (
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Building2 size={12} />
                        {event.speakerCompany}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* COUNTDOWN */}

            <div className="relative">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-300">
                      {eventEnded
                        ? "Event Status"
                        : eventStarted
                        ? "Event Status"
                        : "Event Starts In"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {eventEnded
                        ? "This event has ended"
                        : eventStarted
                        ? "The event is currently live"
                        : "Get ready for the event"}
                    </p>
                  </div>

                  <Timer size={24} className="text-indigo-300" />
                </div>

                {eventEnded ? (
                  <div className="mt-6 rounded-2xl border border-gray-400/20 bg-gray-400/10 p-5 text-center">
                    <CheckCircle2 size={32} className="mx-auto text-gray-300" />

                    <p className="mt-3 text-lg font-bold text-gray-200">
                      Event Completed
                    </p>
                  </div>
                ) : eventStarted ? (
                  <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-center">
                    <div className="flex items-center justify-center gap-2 text-lg font-bold text-emerald-300">
                      <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-400" />
                      Event is Live Now
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 grid grid-cols-4 gap-2">
                    <CountdownBox value={countdown.days} label="Days" />

                    <CountdownBox value={countdown.hours} label="Hours" />

                    <CountdownBox value={countdown.minutes} label="Min" />

                    <CountdownBox value={countdown.seconds} label="Sec" />
                  </div>
                )}

                <div className="mt-7 space-y-5 border-t border-white/10 pt-6">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-indigo-300">
                      <CalendarDays size={19} />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Event Date</p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        {formatDate(event.startDateTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-300">
                      <Clock3 size={19} />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Starts At</p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        {formatTime(event.startDateTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-orange-300">
                      <Clock3 size={19} />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Ends At</p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        {formatTime(event.endDateTime)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 border-t border-white/10 pt-5">
                  <button
                    onClick={handleShare}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    {copied ? <Check size={17} /> : <Share2 size={17} />}

                    {copied ? "Link Copied" : "Share Event"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {/* EVENT SCHEDULE */}

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <CalendarCheck2 size={21} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Event Schedule
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Complete date and timing details
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <ScheduleCard
                  icon={<CalendarDays size={20} />}
                  label="Event Date"
                  value={formatDate(event.startDateTime)}
                />

                <ScheduleCard
                  icon={<Clock3 size={20} />}
                  label="Start Time"
                  value={formatTime(event.startDateTime)}
                />

                <ScheduleCard
                  icon={<Clock3 size={20} />}
                  label="End Time"
                  value={formatTime(event.endDateTime)}
                />
              </div>

              <div className="mt-5 rounded-2xl bg-indigo-50 p-4">
                <p className="text-xs font-medium text-indigo-500">
                  Complete Schedule
                </p>

                <p className="mt-1 text-sm font-bold text-indigo-700">
                  {formatDateTime(event.startDateTime)} —{" "}
                  {formatTime(event.endDateTime)}
                </p>
              </div>
            </section>

            {/* ABOUT */}

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Sparkles size={21} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    About This Event
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Everything you need to know
                  </p>
                </div>
              </div>

              <p className="text-sm leading-8 text-gray-600 sm:text-base">
                {event.description}
              </p>
            </section>

            {/* HIGHLIGHTS */}

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-gray-900">
                Event Highlights
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <HighlightCard
                  icon={<Video size={19} />}
                  title="Live Online Session"
                  description="Join the event online from anywhere and learn directly from the speaker."
                />

                <HighlightCard
                  icon={<Users size={19} />}
                  title="Interactive Learning"
                  description="Participate in an engaging learning experience with other GuideX learners."
                />

                <HighlightCard
                  icon={<UserRound size={19} />}
                  title="Expert Speaker"
                  description="Learn from an experienced speaker and gain practical knowledge."
                />

                <HighlightCard
                  icon={<ShieldCheck size={19} />}
                  title="GuideX Community"
                  description="Connect with learners and become part of the GuideX learning community."
                />
              </div>
            </section>

            {/* SPEAKER */}

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-gray-900">
                Meet Your Speaker
              </h2>

              <div className="mt-6 flex flex-col gap-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 p-6 sm:flex-row sm:items-center">
                {speakerImage ? (
                  <img
                    src={speakerImage}
                    alt={event.speaker || "Speaker"}
                    className="h-20 w-20 shrink-0 rounded-2xl object-cover shadow-lg"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-lg">
                    <UserRound size={34} />
                  </div>
                )}

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    Featured Speaker
                  </p>

                  <h3 className="mt-1 text-2xl font-bold text-gray-900">
                    {event.speaker || "GuideX Expert"}
                  </h3>

                  {event.speakerRole && (
                    <p className="mt-1 text-sm font-medium text-indigo-600">
                      {event.speakerRole}
                    </p>
                  )}

                  {event.speakerCompany && (
                    <p className="mt-1 text-sm text-gray-500">
                      {event.speakerCompany}
                    </p>
                  )}

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {event.speakerBio ||
                      "Join this expert-led session and explore valuable insights designed to support your learning journey."}
                  </p>

                  {event.speakerExperience && (
                    <p className="mt-3 text-xs font-medium text-gray-500">
                      Experience: {event.speakerExperience}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* =====================================================
              RIGHT SIDEBAR
          ====================================================== */}

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
              {/* BANNER */}

              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-600 to-cyan-500">
                {bannerImage ? (
                  <img
                    src={bannerImage}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon size={50} className="text-white/50" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs font-medium text-white/70">
                    GuideX Event
                  </p>

                  <p className="mt-1 line-clamp-2 text-lg font-bold text-white">
                    {event.title}
                  </p>
                </div>
              </div>

              {/* HEADER */}

              <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-6 text-white">
                <div className="flex items-center gap-2 text-sm font-semibold text-indigo-100">
                  <CalendarCheck2 size={18} />
                  Event Registration
                </div>

                <h3 className="mt-3 text-2xl font-bold">
                  {eventEnded
                    ? "Event Completed"
                    : isRegistered
                    ? "You're All Set!"
                    : "Ready to Join?"}
                </h3>

                <p className="mt-2 text-sm leading-6 text-blue-100">
                  {eventEnded
                    ? "This GuideX event has already ended."
                    : isRegistered
                    ? "Your spot has already been reserved."
                    : "Register now and secure your place in this upcoming event."}
                </p>
              </div>

              {/* BODY */}

              <div className="p-6">
                {/* DATE */}

                <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <CalendarDays size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Event Date</p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {formatShortDate(event.startDateTime)}
                    </p>
                  </div>
                </div>

                {/* START */}

                <div className="flex items-center gap-4 border-b border-gray-100 py-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <Clock3 size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Starts At</p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {formatTime(event.startDateTime)}
                    </p>
                  </div>
                </div>

                {/* END */}

                <div className="flex items-center gap-4 border-b border-gray-100 py-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <Clock3 size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Ends At</p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {formatTime(event.endDateTime)}
                    </p>
                  </div>
                </div>

                {/* REGISTERED */}

                {isRegistered && (
                  <div className="my-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <CheckCircle2 size={21} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-emerald-700">
                          Registered
                        </p>

                        <p className="mt-1 text-xs text-emerald-600">
                          Your spot is reserved.
                        </p>
                      </div>
                    </div>

                    {registration?.registeredAt && (
                      <p className="mt-4 border-t border-emerald-200 pt-3 text-xs text-emerald-600">
                        Registered on{" "}
                        {formatShortDate(registration.registeredAt)}
                      </p>
                    )}
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="mt-5 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
                    >
                      Cancel Registration
                    </button>
                  </div>
                )}

                {/* DEADLINE */}

                {!isRegistered && !eventEnded && (
                  <div className="flex items-center gap-4 border-b border-gray-100 py-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                      <Bell size={20} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Registration Deadline
                      </p>

                      <p
                        className={`mt-1 text-sm font-semibold ${
                          registrationClosed ? "text-red-600" : "text-gray-800"
                        }`}
                      >
                        {formatShortDate(event.registrationDeadline)}
                      </p>

                      {registrationClosed && (
                        <p className="mt-1 text-xs font-medium text-red-500">
                          Registration is closed
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* SPEAKER */}

                <div className="flex items-center gap-4 border-b border-gray-100 py-5">
                  {speakerImage ? (
                    <img
                      src={speakerImage}
                      alt={event.speaker || "Speaker"}
                      className="h-11 w-11 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <UserRound size={20} />
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-gray-400">Speaker</p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {event.speaker || "GuideX Expert"}
                    </p>

                    {event.speakerCompany && (
                      <p className="mt-1 text-xs text-gray-500">
                        {event.speakerCompany}
                      </p>
                    )}
                  </div>
                </div>

                {/* REGISTRATION / MEETING */}

                <div className="pt-6">
                  {isRegistered ? (
                    <div className="space-y-4">
                      {/* COMPLETED */}

                      {event.status === "Completed" || eventEnded ? (
                        <div className="rounded-2xl border border-gray-200 bg-gray-100 p-5 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                            <CheckCircle2 size={24} />
                          </div>

                          <p className="mt-3 text-sm font-bold text-gray-600">
                            Event Completed
                          </p>

                          <p className="mt-2 text-xs text-gray-500">
                            This event has ended and meeting access is closed.
                          </p>
                        </div>
                      ) : event.status === "Live" || eventStarted ? (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <Video size={24} />
                          </div>

                          <p className="mt-3 text-sm font-bold text-emerald-700">
                            Event is Live Now
                          </p>

                          <p className="mt-2 text-xs text-emerald-600">
                            You are registered for this event.
                          </p>

                          {meetingLink && (
                            <button
                              onClick={handleJoinMeeting}
                              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700"
                            >
                              <Video size={18} />
                              Join Meeting
                              <ExternalLink size={16} />
                            </button>
                          )}
                        </div>
                      ) : !canJoinMeeting ? (
                        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                            <Timer size={23} />
                          </div>

                          <h4 className="mt-3 text-sm font-bold text-indigo-700">
                            Meeting Starts Soon
                          </h4>

                          <p className="mt-2 text-xs leading-5 text-indigo-600">
                            The meeting will be available 10 minutes before the
                            event starts.
                          </p>

                          <div className="mt-4 rounded-xl bg-white px-4 py-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                              Join Available In
                            </p>

                            <p className="mt-1 text-2xl font-bold tabular-nums text-indigo-600">
                              {String(joinCountdown.hours).padStart(2, "0")}:
                              {String(joinCountdown.minutes).padStart(2, "0")}:
                              {String(joinCountdown.seconds).padStart(2, "0")}
                            </p>
                          </div>
                        </div>
                      ) : meetingLink ? (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                          <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                              <Video size={24} />
                            </div>

                            <h4 className="mt-3 text-base font-bold text-emerald-700">
                              Meeting is Ready
                            </h4>

                            <p className="mt-2 text-xs leading-5 text-emerald-600/80">
                              You can now join the event.
                            </p>
                          </div>

                          <button
                            onClick={handleJoinMeeting}
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700 active:scale-[0.98]"
                          >
                            <Video size={18} />
                            Join Meeting
                            <ExternalLink size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                            <Video size={23} />
                          </div>

                          <h4 className="mt-3 text-sm font-bold text-orange-700">
                            Meeting Link Pending
                          </h4>

                          <p className="mt-2 text-xs leading-5 text-orange-600/80">
                            The meeting link has not been added yet.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {event.status === "Upcoming" ? (
                        registrationClosed ? (
                          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                              <Bell size={23} />
                            </div>

                            <p className="mt-3 text-sm font-bold text-red-600">
                              Registration Closed
                            </p>

                            <p className="mt-2 text-xs text-red-500">
                              The registration deadline has passed.
                            </p>
                          </div>
                        ) : (
                          <button
                            onClick={handleRegister}
                            disabled={registrationLoading}
                            className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <CalendarCheck2 size={19} />
                            Register for Event
                            <ArrowRight
                              size={18}
                              className="transition group-hover:translate-x-1"
                            />
                          </button>
                        )
                      ) : event.status === "Live" ? (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-500" />
                          </div>

                          <p className="mt-3 text-sm font-bold text-emerald-700">
                            Event is Live Now
                          </p>

                          <p className="mt-2 text-xs text-emerald-600">
                            Registration is no longer available.
                          </p>
                        </div>
                      ) : event.status === "Registration Closed" ? (
                        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                            <Bell size={23} />
                          </div>

                          <p className="mt-3 text-sm font-bold text-orange-700">
                            Registration Closed
                          </p>

                          <p className="mt-2 text-xs text-orange-600">
                            Registration for this event is no longer available.
                          </p>
                        </div>
                      ) : event.status === "Completed" ? (
                        <div className="rounded-2xl border border-gray-200 bg-gray-100 p-5 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                            <CheckCircle2 size={24} />
                          </div>

                          <p className="mt-3 text-sm font-bold text-gray-600">
                            Event Completed
                          </p>

                          <p className="mt-2 text-xs text-gray-500">
                            This event has already ended.
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-gray-200 bg-gray-100 p-5 text-center">
                          <p className="text-sm font-bold text-gray-600">
                            {event.status || "Event Unavailable"}
                          </p>

                          <p className="mt-2 text-xs text-gray-500">
                            Registration is not available for this event.
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <ShieldCheck size={14} />
                    Secure registration with GuideX
                  </div>
                </div>
              </div>
            </div>

            {/* ORGANIZER */}

            <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                  <UserRound size={18} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">Organized By</p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {typeof event.createdBy === "string"
                      ? event.createdBy
                      : event.createdBy
                      ? `${event.createdBy.firstName || ""} ${
                          event.createdBy.lastName || ""
                        }`.trim()
                      : "Team GuideX"}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

// =====================================================
// COUNTDOWN BOX
// =====================================================

const CountdownBox = ({ value, label }) => {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 px-2 py-3 text-center">
      <div className="text-2xl font-bold tabular-nums text-white">
        {String(value).padStart(2, "0")}
      </div>

      <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">
        {label}
      </div>
    </div>
  );
};

// =====================================================
// SCHEDULE CARD
// =====================================================

const ScheduleCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
        {icon}
      </div>

      <p className="mt-4 text-xs font-medium text-gray-400">{label}</p>

      <p className="mt-1 text-sm font-bold leading-6 text-gray-800">{value}</p>
    </div>
  );
};

// =====================================================
// HIGHLIGHT CARD
// =====================================================

const HighlightCard = ({ icon, title, description }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
        {icon}
      </div>

      <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
    </div>
  );
};

export default EventDetails;
