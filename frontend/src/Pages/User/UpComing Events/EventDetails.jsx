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
  UserRound,
  Video,
  Users,
  Bell,
  Timer,
  Check,
  Loader2,
  ExternalLink,
  Building2,
  X,
  Tag,
  DollarSign,
  CheckSquare,
  PlayCircle,
  Briefcase,
  Sparkles,
  Target,
} from "lucide-react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/AuthContext"; // Adjust path to match your AuthContext

const EventDetails = () => {
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // =====================================================
  // STATE
  // =====================================================

  const [event, setEvent] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentRegistration, setCurrentRegistration] = useState(null);
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
  const [copied, setCopied] = useState(false);

  // =====================================================
  // GET USER TOKEN
  // =====================================================

  const getUserToken = () => localStorage.getItem("UserToken");

  // =====================================================
  // IMAGE URL HELPER
  // =====================================================

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    const cleanBaseUrl = API_BASE_URL?.replace(/\/+$/, "");
    const cleanImagePath = imagePath.replace(/^\/+/, "");
    return `${cleanBaseUrl}/${cleanImagePath}`;
  };

  // =====================================================
  // FORMAT DATE UTILS
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "Date not available";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "Date not available";

    return parsedDate.toLocaleDateString("en-US", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatShortDate = (date) => {
    if (!date) return "N/A";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "Time not available";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "Time not available";

    return parsedDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isRegistrationClosed = () => {
    if (!event?.registrationDeadline) return false;
    const deadline = new Date(event.registrationDeadline);
    if (isNaN(deadline.getTime())) return false;
    return Date.now() >= deadline.getTime();
  };

  const canJoinEarly = (startDateTime) => {
    if (!startDateTime) return false;
    const diff = new Date(startDateTime).getTime() - Date.now();
    return diff <= 10 * 60 * 1000 && diff > -4 * 60 * 60 * 1000;
  };

  // =====================================================
  // EVENT STATUS EFFECT
  // =====================================================

  useEffect(() => {
    if (!event?.startDateTime || !event?.endDateTime) return;

    const checkEventStatus = () => {
      const now = Date.now();
      const startTime = new Date(event.startDateTime).getTime();
      const endTime = new Date(event.endDateTime).getTime();

      if (isNaN(startTime) || isNaN(endTime)) return;

      if (event.computedStatus === "Completed" || now >= endTime) {
        setEventEnded(true);
        setEventStarted(false);
        return;
      }

      if (now >= startTime && now < endTime) {
        setEventEnded(false);
        setEventStarted(true);
        return;
      }

      setEventEnded(false);
      setEventStarted(false);
    };

    checkEventStatus();
    const timer = setInterval(checkEventStatus, 1000);
    return () => clearInterval(timer);
  }, [event?.startDateTime, event?.endDateTime, event?.computedStatus]);

  // =====================================================
  // MAIN EVENT COUNTDOWN
  // =====================================================

  useEffect(() => {
    if (!event?.startDateTime) return;
    const startTime = new Date(event.startDateTime).getTime();
    if (isNaN(startTime)) return;

    const updateCountdown = () => {
      const difference = startTime - Date.now();
      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setCountdown({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [event?.startDateTime]);

  // =====================================================
  // FETCH EVENT DETAILS
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

      const response = await fetch(`${API_BASE_URL}/api/events/details/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch event");

      setEvent(data.event);
      setIsRegistered(data.isRegistered || false);
      setCurrentRegistration(data.currentRegistration || null);
    } catch (error) {
      console.error("Get Event Error:", error);
      toast.error(error.message || "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  // =====================================================
  // ACTIONS (REGISTER / RAZORPAY / CANCEL / JOIN)
  // =====================================================

  const handleRegister = () => {
    const token = getUserToken();
    if (!token) {
      toast.error("Please login to register for this event");
      navigate("/login");
      return;
    }
    if (!event?._id) return;
    if (isRegistered) {
      toast.info("You are already registered for this event");
      return;
    }
    if (eventEnded) {
      toast.error("This event has already ended");
      return;
    }
    if (isRegistrationClosed()) {
      toast.error("Registration deadline has passed");
      return;
    }

    setShowRegistrationModal(true);
  };

  const confirmRegistration = async () => {
    try {
      const token = getUserToken();
      setRegistrationLoading(true);

      // Check if event is paid
      if (event.isPaid && event.ticketPrice > 0) {
        // 1. Create order on backend payment routes
        const orderRes = await fetch(
          `${API_BASE_URL}/api/event-payment/create-order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ eventId: event._id }),
          }
        );

        const orderData = await orderRes.json();
        if (!orderRes.ok || !orderData.success) {
          throw new Error(
            orderData.message || "Unable to create payment order."
          );
        }

        // 2. Open Razorpay Checkout Gateway
        openRazorpayCheckout(orderData.order);
      } else {
        // Free Event Direct Registration
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
        if (!response.ok) throw new Error(data.message || "Failed to register");

        setShowRegistrationModal(false);
        setShowCongratulationsModal(true);
        toast.success("Registered successfully");
        fetchEvent();
        setRegistrationLoading(false);
      }
    } catch (error) {
      toast.error(error.message || "Failed to process registration");
      setRegistrationLoading(false);
    }
  };

  const openRazorpayCheckout = (order) => {
    const token = getUserToken();
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: order.amount,
      currency: order.currency,
      name: "GuideX",
      description: `Registration for ${event.title}`,
      order_id: order.id,

      handler: async function (response) {
        try {
          toast.loading("Verifying Payment...", { toastId: "verify_event" });

          const verifyRes = await fetch(
            `${API_BASE_URL}/api/event-payment/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                eventId: event._id,
              }),
            }
          );

          const data = await verifyRes.json();
          toast.dismiss("verify_event");

          if (verifyRes.ok && data.success) {
            setShowRegistrationModal(false);
            setShowCongratulationsModal(true);
            toast.success("Payment & Registration Successful!");
            fetchEvent();
          } else {
            toast.error(data.message || "Payment Verification Failed");
          }
        } catch (err) {
          toast.dismiss("verify_event");
          toast.error("Payment Verification Failed");
        } finally {
          setRegistrationLoading(false);
        }
      },

      modal: {
        ondismiss: function () {
          toast.info("Payment Cancelled");
          setRegistrationLoading(false);
        },
      },

      prefill: {
        name: user?.firstName ? `${user.firstName} ${user.lastName}` : "",
        email: user?.email || "",
        contact: user?.phone || "",
      },

      theme: {
        color: "#4f46e5",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const cancelRegistration = async () => {
    try {
      const token = getUserToken();
      if (!currentRegistration?._id) {
        toast.error("Registration ID not found");
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
          body: JSON.stringify({ registrationId: currentRegistration._id }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to cancel registration");

      setShowCancelModal(false);
      toast.success("Registration cancelled successfully");
      fetchEvent();
    } catch (error) {
      toast.error(error.message || "Failed to cancel registration");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleJoinMeeting = () => {
    const activeLink = currentRegistration?.meetingLink || event?.meetingUrl;
    if (!isRegistered) {
      toast.error("Please register for the event first");
      return;
    }
    if (eventEnded) {
      toast.error("This event has already ended");
      return;
    }
    if (!activeLink) {
      toast.error("Meeting link is not available yet.");
      return;
    }

    window.open(activeLink, "_blank", "noopener,noreferrer");
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: event?.title || "GuideX Event",
        text:
          event?.shortSummary ||
          event?.description ||
          "Check out this upcoming event on GuideX.",
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Event link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Share Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex min-h-screen flex-col items-center justify-center bg-white px-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-blue-100" />
          <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
        </div>
        <p className="mt-6 text-center text-lg font-semibold text-gray-700">
          Loading Event Details...
        </p>
      </div>
    );
  }

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

  const bannerImage = getImageUrl(event.bannerImage);
  const primarySpeaker = event.speakers?.[0] || {};
  const registrationClosed = isRegistrationClosed();
  const meetingLink =
    currentRegistration?.meetingLink || event.meetingUrl || null;

  return (
    <div className="min-h-screen bg-slate-50">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {/* REGISTRATION MODAL */}
      {showRegistrationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <button
              onClick={() => setShowRegistrationModal(false)}
              disabled={registrationLoading}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
            >
              <X size={18} />
            </button>
            <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 px-6 py-8 text-center text-white">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                <CalendarCheck2 size={30} />
              </div>
              <h2 className="mt-5 text-2xl font-bold">Confirm Registration</h2>
              <p className="mt-2 text-sm text-blue-100">
                You're about to register for this event.
              </p>
            </div>
            <div className="p-6">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <h3 className="text-lg font-bold text-gray-900">
                  {event.title}
                </h3>
                <div className="mt-4 space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <CalendarDays size={17} className="text-indigo-600" />
                    {formatDate(event.startDateTime)}
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock3 size={17} className="text-indigo-600" />
                    {formatTime(event.startDateTime)}
                  </div>
                  {event.isPaid && (
                    <div className="flex items-center gap-3 text-emerald-600 font-bold">
                      <DollarSign size={17} />
                      Ticket Price: ₹{event.ticketPrice}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowRegistrationModal(false)}
                  disabled={registrationLoading}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRegistration}
                  disabled={registrationLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-60"
                >
                  {registrationLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      {event.isPaid ? `Pay ₹${event.ticketPrice}` : "Confirm"}{" "}
                      <Check size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900">
              Cancel Registration?
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Are you sure you want to cancel? You will lose your reserved spot.
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
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONGRATULATIONS MODAL */}
      {showCongratulationsModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <button
              onClick={() => setShowCongratulationsModal(false)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white"
            >
              <X size={18} />
            </button>
            <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 px-6 py-10 text-center text-white">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl">
                <CheckCircle2 size={48} className="text-emerald-500" />
              </div>
              <h2 className="mt-6 text-3xl font-bold">Congratulations! 🎉</h2>
              <p className="mt-3 text-sm text-emerald-50">
                You have successfully registered for the event.
              </p>
            </div>
            <div className="p-6 text-center">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <p className="text-sm font-bold text-emerald-800">
                  {event.title}
                </p>
                <div className="mt-3 flex flex-col items-center gap-2 text-xs text-emerald-600">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={15} /> {formatDate(event.startDateTime)}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock3 size={15} /> {formatTime(event.startDateTime)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowCongratulationsModal(false)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950">
        {bannerImage ? (
          <div className="absolute inset-0">
            <img
              src={bannerImage}
              alt={event.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-950/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/40" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-blue-900 to-cyan-900" />
        )}

        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/events")}
            className="mb-10 flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <ArrowLeft size={17} /> Back to Events
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
                      eventStarted
                        ? "animate-pulse bg-emerald-400"
                        : "bg-blue-400"
                    }`}
                  />
                  {event.computedStatus ||
                    (eventEnded
                      ? "Completed"
                      : eventStarted
                      ? "Live Now"
                      : "Upcoming")}
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur">
                  <Video size={14} /> {event.eventType || "Online Event"}
                </div>

                <div className="flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-xs font-semibold text-indigo-300">
                  {event.domain}
                </div>

                {isRegistered && (
                  <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-300">
                    <CheckCircle2 size={14} /> Registered
                  </div>
                )}
              </div>

              <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                {event.title}
              </h1>

              {event.shortSummary && (
                <p className="mt-4 text-lg font-medium text-indigo-200">
                  {event.shortSummary}
                </p>
              )}

              {event.tags && event.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {event.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 text-xs text-slate-300"
                    >
                      <Tag size={12} /> #{tag}
                    </span>
                  ))}
                </div>
              )}

              {primarySpeaker.name && (
                <div className="mt-8 flex items-center gap-4">
                  {primarySpeaker.profileImage ? (
                    <img
                      src={getImageUrl(primarySpeaker.profileImage)}
                      alt={primarySpeaker.name}
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-white/20"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-white">
                      <UserRound size={22} />
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Lead Speaker
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {primarySpeaker.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {primarySpeaker.title} @ {primarySpeaker.organization}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* COUNTDOWN SIDE PANEL */}
            <div className="relative">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-300">
                      Event Starts In
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Get ready for the session
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
                      <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-400" />{" "}
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

                <div className="mt-7 space-y-4 border-t border-white/10 pt-6 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Pricing:</span>
                    <span className="font-semibold">
                      {event.isPaid ? `₹${event.ticketPrice}` : "Free Event"}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Seat Availability:</span>
                    <span className="font-semibold">
                      {event.registeredStudentsCount || 0} / {event.maxSeats}{" "}
                      Booked
                    </span>
                  </div>
                </div>

                <div className="mt-5 border-t border-white/10 pt-5">
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

      {/* MAIN BODY CONTENT */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {/* SCHEDULE DETAILS */}
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-gray-900">
                Event Schedule & Timeline
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <ScheduleCard
                  icon={<CalendarDays size={20} />}
                  label="Date"
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
            </section>

            {/* FULL DESCRIPTION */}
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About This Event
              </h2>
              <div className="text-sm leading-8 text-gray-600 whitespace-pre-line">
                {event.description}
              </div>
            </section>

            {/* RAW DATA INFO SECTIONS: BENEFITS, WHAT YOU LEARN, TARGET */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 text-indigo-600 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                    <Sparkles size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Key Benefits
                  </h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                    Direct mentorship and practical insights from industry
                    experts.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                    Interactive Q&A session to clear domain-specific doubts.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                    Certificate of participation upon session completion.
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 text-emerald-600 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                    <Target size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    What You Will Learn
                  </h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                    Core industry workflows and modern framework best practices.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                    Real-world case studies and architectural problem solving.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                    Actionable strategies to level up your career trajectory.
                  </li>
                </ul>
              </div>
            </div>

            {/* TARGET AUDIENCE & PREREQUISITES */}
            {event.targetAudience && (
              <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Audience & Requirements
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-2xl bg-indigo-50/50 border border-indigo-100 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 flex items-center gap-2">
                      <Users size={16} /> Experience Level
                    </p>
                    <p className="mt-2 text-base font-bold text-gray-800">
                      {event.targetAudience.experienceLevel || "All Levels"}
                    </p>
                  </div>

                  {event.targetAudience.prerequisites &&
                    event.targetAudience.prerequisites.length > 0 && (
                      <div className="rounded-2xl bg-amber-50/50 border border-amber-100 p-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 flex items-center gap-2">
                          <CheckSquare size={16} /> Prerequisites
                        </p>
                        <ul className="mt-2 space-y-1">
                          {event.targetAudience.prerequisites.map(
                            (req, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-gray-700 flex items-center gap-2"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />{" "}
                                {req}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              </section>
            )}

            {/* GUEST SPEAKERS ARRAY */}
            {event.speakers && event.speakers.length > 0 && (
              <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Guest Speakers & Faculty ({event.speakers.length})
                </h2>
                <div className="space-y-6">
                  {event.speakers.map((sp, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row gap-5 rounded-2xl bg-slate-50 border border-slate-100 p-6"
                    >
                      {sp.profileImage ? (
                        <img
                          src={getImageUrl(sp.profileImage)}
                          alt={sp.name}
                          className="h-20 w-20 shrink-0 rounded-2xl object-cover shadow-md"
                        />
                      ) : (
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold text-xl">
                          {sp.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-gray-900">
                            {sp.name}
                          </h3>
                          {sp.linkedinUrl && (
                            <a
                              href={sp.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Briefcase size={18} />
                            </a>
                          )}
                        </div>
                        <p className="text-sm font-medium text-indigo-600">
                          {sp.title} at {sp.organization}
                        </p>
                        {sp.bio && (
                          <p className="mt-3 text-sm leading-6 text-gray-600">
                            {sp.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* RECORDING URL */}
            {event.recordingUrl && (
              <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6 sm:p-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
                    <PlayCircle size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-blue-900">
                      Session Recording Available
                    </h3>
                    <p className="text-xs text-blue-700 mt-0.5">
                      Watch or review the complete archived session video.
                    </p>
                  </div>
                  <a
                    href={event.recordingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-700 transition"
                  >
                    Watch Recording
                  </a>
                </div>
              </section>
            )}
          </div>

          {/* RIGHT SIDEBAR ACTION CARD */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
              <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-6 text-white">
                <h3 className="text-2xl font-bold">
                  {eventEnded
                    ? "Event Completed"
                    : isRegistered
                    ? "You're All Set!"
                    : "Ready to Join?"}
                </h3>
                <p className="mt-2 text-sm text-blue-100">
                  {isRegistered
                    ? "Your spot has been reserved."
                    : "Secure your place in this session."}
                </p>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <CalendarDays size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {formatShortDate(event.startDateTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <Clock3 size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Time</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {formatTime(event.startDateTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Bell size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">
                      Registration Deadline
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        registrationClosed ? "text-red-600" : "text-gray-800"
                      }`}
                    >
                      {formatShortDate(event.registrationDeadline)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Host / Admin</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {event.createdByAdmin || "Guideex Admin"}
                    </p>
                  </div>
                </div>

                {isRegistered ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                    <p className="text-sm font-bold text-emerald-700">
                      Registered
                    </p>
                    <p className="mt-1 text-xs text-emerald-600">
                      Your spot is confirmed.
                    </p>

                    {meetingLink && (
                      <button
                        onClick={handleJoinMeeting}
                        disabled={
                          !eventStarted && !canJoinEarly(event.startDateTime)
                        }
                        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold shadow-lg transition ${
                          eventStarted || canJoinEarly(event.startDateTime)
                            ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none"
                        }`}
                      >
                        <Video size={17} />{" "}
                        {eventStarted
                          ? "Join Live Meeting Now"
                          : "Meeting Link (Locks until Start)"}
                        <ExternalLink size={15} />
                      </button>
                    )}

                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="mt-3 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100"
                    >
                      Cancel Registration
                    </button>
                  </div>
                ) : (
                  <div>
                    {registrationClosed ? (
                      <div className="rounded-2xl bg-red-50 p-4 text-center text-red-600 text-xs font-bold">
                        Registration Closed
                      </div>
                    ) : (
                      <button
                        onClick={handleRegister}
                        disabled={registrationLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
                      >
                        <CalendarCheck2 size={18} /> Register for Event{" "}
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

const CountdownBox = ({ value, label }) => (
  <div className="rounded-xl border border-white/10 bg-white/10 px-2 py-3 text-center">
    <div className="text-2xl font-bold tabular-nums text-white">
      {String(value).padStart(2, "0")}
    </div>
    <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">
      {label}
    </div>
  </div>
);

const ScheduleCard = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
      {icon}
    </div>
    <p className="mt-4 text-xs font-medium text-gray-400">{label}</p>
    <p className="mt-1 text-sm font-bold leading-6 text-gray-800">{value}</p>
  </div>
);

export default EventDetails;
