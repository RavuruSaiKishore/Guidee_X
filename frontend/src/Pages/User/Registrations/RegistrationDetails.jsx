import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  UserRound,
  Building2,
  Briefcase,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Video,
  Users,
  TicketCheck,
  RefreshCw,
  CircleAlert,
  CalendarCheck2,
  Mail,
  Info,
  AlertTriangle,
  ShieldCheck,
  Copy,
  Check,
  Ban,
  Loader2,
  Timer,
  DollarSign,
  CreditCard,
  Sparkles,
  Target,
  CheckSquare,
  HelpCircle,
  Headphones,
} from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegistrationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  // =====================================================
  // STATE
  // =====================================================

  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(new Date());

  // =====================================================
  // TOKEN
  // =====================================================

  const getUserToken = () => {
    return localStorage.getItem("UserToken");
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    const cleanPath = imagePath.replace(/^\/+/, "");
    const cleanBaseUrl = API_BASE_URL.replace(/\/+$/, "");
    return `${cleanBaseUrl}/${cleanPath}`;
  };

  // =====================================================
  // FETCH REGISTRATION DETAILS
  // =====================================================

  const fetchRegistrationDetails = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = getUserToken();
      if (!token) {
        toast.error("Please login to view registration details");
        navigate("/login");
        return;
      }

      if (!id) {
        throw new Error("Registration ID is missing");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/event-registration/my-registrations/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to load registration details");
      }

      const registrationData =
        data.registration || data.data || data.eventRegistration || null;

      setRegistration(registrationData);
    } catch (error) {
      console.error("Registration Details Error:", error);
      toast.error(error.message || "Failed to load registration details");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRegistrationDetails();
  }, [id]);

  // LIVE CLOCK
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // EVENT & SPEAKER MAPPING
  const event = useMemo(() => registration?.event || {}, [registration]);
  const leadSpeaker = useMemo(() => event?.speakers?.[0] || {}, [event]);

  const eventStart = event?.startDateTime || null;
  const eventEnd = event?.endDateTime || null;
  const registrationDeadline = event?.registrationDeadline || null;

  const startDate = useMemo(
    () => (eventStart ? new Date(eventStart) : null),
    [eventStart]
  );
  const endDate = useMemo(
    () => (eventEnd ? new Date(eventEnd) : null),
    [eventEnd]
  );
  const deadlineDate = useMemo(
    () => (registrationDeadline ? new Date(registrationDeadline) : null),
    [registrationDeadline]
  );

  // FORMATTERS
  const formatDate = (date) =>
    !date || isNaN(new Date(date).getTime())
      ? "N/A"
      : new Date(date).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  const formatDateTime = (date) =>
    !date || isNaN(new Date(date).getTime())
      ? "N/A"
      : new Date(date).toLocaleString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
  const formatTime = (date) =>
    !date || isNaN(new Date(date).getTime())
      ? "N/A"
      : new Date(date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

  // STATUS CALCULATIONS
  const eventStatus = useMemo(() => {
    if (event?.status === "Cancelled") return "Cancelled";
    if (registration?.status === "Cancelled") return "Registration Cancelled";

    const currentTime = now.getTime();
    if (startDate && endDate) {
      if (currentTime < startDate.getTime()) return "Upcoming";
      if (currentTime >= startDate.getTime() && currentTime < endDate.getTime())
        return "Live Now";
      if (currentTime >= endDate.getTime()) return "Completed";
    }
    return event?.computedStatus || "Upcoming";
  }, [now, event, registration, startDate, endDate]);

  const registrationCancelled = registration?.status === "Cancelled";
  const isRegistered = registration?.status === "Registered";
  const isLive = eventStatus === "Live Now";
  const isEnded = eventStatus === "Completed";
  const isEventCancelled = event?.status === "Cancelled";
  const isRegistrationDeadlinePassed =
    deadlineDate && now.getTime() >= deadlineDate.getTime();

  const canCancelRegistration =
    isRegistered &&
    !isEventCancelled &&
    !isLive &&
    !isEnded &&
    !isRegistrationDeadlinePassed;

  const canJoinEvent = () => {
    if (
      !registration ||
      !isRegistered ||
      registrationCancelled ||
      isEventCancelled ||
      isEnded ||
      !startDate
    )
      return false;
    const joinTime = startDate.getTime() - 10 * 60 * 1000;
    return isLive || now.getTime() >= joinTime;
  };

  const handleJoinEvent = () => {
    if (!canJoinEvent()) {
      toast.info(
        "The event meeting is available 10 minutes before start time."
      );
      return;
    }
    const meetingLink = registration?.meetingLink || event?.meetingUrl;
    if (meetingLink) {
      window.open(meetingLink, "_blank", "noopener,noreferrer");
      return;
    }
    toast.error("Meeting link is not available");
  };

  const handleCancelRegistration = async () => {
    try {
      if (!registration?._id || !event?._id) return;
      setCancelling(true);
      const token = getUserToken();

      const response = await fetch(
        `${API_BASE_URL}/api/event-registration/cancel/${event._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ registrationId: registration._id }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to cancel registration");

      if (data.registration) {
        setRegistration((prev) => ({ ...prev, ...data.registration }));
      }

      setShowCancelModal(false);
      toast.success("Registration cancelled successfully.");
      await fetchRegistrationDetails(true);
    } catch (error) {
      toast.error(error.message || "Failed to cancel registration");
    } finally {
      setCancelling(false);
    }
  };

  const handleCopyId = async () => {
    if (!registration?._id) return;
    await navigator.clipboard.writeText(registration._id);
    setCopied(true);
    toast.success("Registration ID copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const getCountdown = (targetDate) => {
    if (!targetDate) return null;
    const difference = targetDate.getTime() - now.getTime();
    if (difference <= 0) return null;
    const totalSeconds = Math.floor(difference / 1000);
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  };

  const eventCountdown = getCountdown(startDate);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <Loader2 size={40} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <CircleAlert size={48} className="mx-auto text-red-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Registration Not Found
          </h2>
          <button
            onClick={() => navigate("/my-registrations")}
            className="mt-5 rounded-xl bg-indigo-600 px-6 py-3 text-base font-bold text-white"
          >
            Back to Registrations
          </button>
        </div>
      </div>
    );
  }

  const bannerUrl = getImageUrl(event?.bannerImage);
  const speakerImage = getImageUrl(leadSpeaker?.profileImage);
  const joinAvailable = canJoinEvent();

  return (
    <div className="min-h-screen bg-slate-50">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        {/* TOP BAR */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/my-registrations")}
            className="flex items-center gap-2 text-base font-bold text-slate-600 transition hover:text-indigo-600"
          >
            <ArrowLeft size={19} /> My Registrations
          </button>
          <button
            onClick={() => fetchRegistrationDetails(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-indigo-300"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />{" "}
            Refresh
          </button>
        </div>

        {/* HERO BANNER */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-[420px]">
            {bannerUrl ? (
              <img
                src={bannerUrl}
                alt={event?.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-800">
                <CalendarDays size={90} className="text-white/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

            <div className="absolute left-6 right-6 top-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2.5">
                <span className="rounded-full bg-indigo-500 px-4 py-1.5 text-sm font-bold text-white shadow">
                  {eventStatus}
                </span>
                <span
                  className={`rounded-full px-4 py-1.5 text-sm font-bold shadow ${
                    registrationCancelled
                      ? "bg-rose-500 text-white"
                      : "bg-emerald-500 text-white"
                  }`}
                >
                  {registration?.status || "Registered"}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-sm font-bold text-white backdrop-blur-md">
                <ShieldCheck size={16} /> Verified Booking
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                {event?.domain && (
                  <span className="rounded-full bg-white/20 backdrop-blur px-3.5 py-1 text-xs font-semibold text-white">
                    {event.domain}
                  </span>
                )}
                <span
                  className={`rounded-full px-3.5 py-1 text-xs font-bold ${
                    event.isPaid
                      ? "bg-emerald-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {event.isPaid ? `₹${event.ticketPrice}` : "Free Event"}
                </span>
              </div>
              <h1 className="text-3xl font-black text-white sm:text-5xl">
                {event?.title}
              </h1>
              <div className="mt-3.5 flex flex-wrap items-center gap-4 text-sm font-semibold text-indigo-200">
                <span className="flex items-center gap-2">
                  <CalendarDays size={17} /> {formatDate(eventStart)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-2">
                  <Clock3 size={17} /> {formatTime(eventStart)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* COUNTDOWN */}
        {eventStatus === "Upcoming" &&
          eventCountdown &&
          !registrationCancelled && (
            <section className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-lg sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-indigo-200 flex items-center gap-2">
                    <Timer size={18} /> Event Countdown
                  </p>
                  <h2 className="mt-1.5 text-2xl font-black sm:text-3xl">
                    Prepare for the session
                  </h2>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    ["Days", eventCountdown.days],
                    ["Hours", eventCountdown.hours],
                    ["Mins", eventCountdown.minutes],
                    ["Secs", eventCountdown.seconds],
                  ].map(([label, val]) => (
                    <div
                      key={label}
                      className="rounded-2xl bg-white/10 p-3.5 text-center backdrop-blur-sm min-w-[70px]"
                    >
                      <p className="text-2xl font-black">
                        {String(val).padStart(2, "0")}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-indigo-200">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

        {/* MAIN BODY GRID */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT CONTENT */}
          <div className="space-y-6 lg:col-span-2">
            {/* ABOUT EVENT */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                About This Event
              </h2>
              <p className="text-base leading-8 text-slate-600 whitespace-pre-line">
                {event?.description || "No description provided."}
              </p>
            </section>

            {/* SPEAKER DETAILS */}
            {leadSpeaker?.name && (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  Guest Speaker
                </h2>
                <div className="flex flex-col sm:flex-row gap-6 rounded-2xl bg-slate-50 border border-slate-100 p-6">
                  {speakerImage ? (
                    <img
                      src={speakerImage}
                      alt={leadSpeaker.name}
                      className="h-24 w-24 rounded-2xl object-cover shadow"
                    />
                  ) : (
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 font-bold text-2xl">
                      {leadSpeaker.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {leadSpeaker.name}
                    </h3>
                    <p className="text-base font-medium text-indigo-600 mt-0.5">
                      {leadSpeaker.title}{" "}
                      {leadSpeaker.organization &&
                        `@ ${leadSpeaker.organization}`}
                    </p>
                    {leadSpeaker.bio && (
                      <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                        {leadSpeaker.bio}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* RIGHT SIDEBAR ACTIONS */}
          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-slate-900">
                Participation Actions
              </h2>

              {joinAvailable && isRegistered && !isEventCancelled && (
                <button
                  onClick={handleJoinEvent}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-teal-600 px-5 py-4 text-base font-bold text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700"
                >
                  <Video size={20} />{" "}
                  {isLive ? "Join Live Meeting Now" : "Join Meeting"}
                </button>
              )}

              {canCancelRegistration && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-5 py-3.5 text-base font-bold text-red-600 transition hover:bg-red-100"
                >
                  <Ban size={19} /> Cancel Registration
                </button>
              )}

              {/* REGISTER AGAIN BUTTON WHEN CANCELLED */}
              {registrationCancelled &&
                !isEventCancelled &&
                !isEnded &&
                !isRegistrationDeadlinePassed && (
                  <button
                    onClick={() => navigate(`/upComingEvents/${event._id}`)}
                    className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-indigo-600 px-5 py-4 text-base font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700"
                  >
                    <TicketCheck size={20} /> Register Event Again
                  </button>
                )}

              <button
                onClick={() => navigate(`/events/${event._id}`)}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-base font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <ExternalLink size={19} /> View Event Page
              </button>
            </section>

            {/* REGISTRATION SUMMARY */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-slate-900">
                Registration Details
              </h2>
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-500 font-medium">Status</span>
                  <span className="font-bold text-slate-900">
                    {registration.status}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-500 font-medium">
                    Registered At
                  </span>
                  <span className="font-bold text-slate-900">
                    {formatDateTime(
                      registration.registeredAt || registration.createdAt
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-500 font-medium">Attendance</span>
                  <span
                    className={`font-bold ${
                      registration.attended
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  >
                    {registration.attended ? "Attended" : "Not Attended"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-500 font-medium">Payment</span>
                  <span
                    className={`font-bold ${
                      event.isPaid ? "text-emerald-600" : "text-blue-600"
                    }`}
                  >
                    {event.isPaid ? `Paid (₹${event.ticketPrice})` : "Free"}
                  </span>
                </div>
                {event.isPaid && registration.paymentId && (
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="text-slate-500 font-medium">
                      Payment ID
                    </span>
                    <span className="font-mono text-xs text-slate-800 truncate max-w-[160px]">
                      {registration.paymentId}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-400 truncate max-w-[180px]">
                  ID: {registration._id}
                </span>
                <button
                  onClick={handleCopyId}
                  className="flex items-center gap-1.5 text-sm font-bold text-violet-600 hover:text-violet-700"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </section>
          </aside>
        </div>

        {/* EXTRA SECTIONS */}
        <div className="mt-12 space-y-8">
          {/* 1. AGENDA */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <CalendarCheck2 size={22} />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Event Agenda & Schedule
              </h3>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <span className="text-xs font-bold text-violet-600 tracking-wider uppercase">
                  Phase 1
                </span>
                <h4 className="mt-1.5 text-base font-bold text-slate-900">
                  Introduction & Keynote
                </h4>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                  Overview of core principles, industry landscape, and initial
                  roadmap walkthrough.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <span className="text-xs font-bold text-violet-600 tracking-wider uppercase">
                  Phase 2
                </span>
                <h4 className="mt-1.5 text-base font-bold text-slate-900">
                  Deep Dive & Practical Demo
                </h4>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                  Live case studies, architectural workflows, and hands-on
                  demonstrations.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <span className="text-xs font-bold text-violet-600 tracking-wider uppercase">
                  Phase 3
                </span>
                <h4 className="mt-1.5 text-base font-bold text-slate-900">
                  Interactive Q&A Session
                </h4>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                  Direct mentorship query clearing, career guidance, and
                  networking closing.
                </p>
              </div>
            </div>
          </section>

          {/* 2. KEY TAKEAWAYS */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Target size={22} />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                What You Will Take Away
              </h3>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex items-start gap-3.5 rounded-2xl border border-slate-100 p-5 bg-emerald-50/40">
                <CheckSquare
                  size={20}
                  className="text-emerald-600 mt-0.5 shrink-0"
                />
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  Actionable blueprints and frameworks directly implementable in
                  your career or projects.
                </p>
              </div>
              <div className="flex items-start gap-3.5 rounded-2xl border border-slate-100 p-5 bg-emerald-50/40">
                <CheckSquare
                  size={20}
                  className="text-emerald-600 mt-0.5 shrink-0"
                />
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  Exclusive access to session recordings, presentation decks,
                  and supplementary reading materials.
                </p>
              </div>
              <div className="flex items-start gap-3.5 rounded-2xl border border-slate-100 p-5 bg-emerald-50/40">
                <CheckSquare
                  size={20}
                  className="text-emerald-600 mt-0.5 shrink-0"
                />
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  Verified certificate of participation upon completion of the
                  live broadcast.
                </p>
              </div>
              <div className="flex items-start gap-3.5 rounded-2xl border border-slate-100 p-5 bg-emerald-50/40">
                <CheckSquare
                  size={20}
                  className="text-emerald-600 mt-0.5 shrink-0"
                />
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  Networking opportunity with peers, domain experts, and
                  industry leaders.
                </p>
              </div>
            </div>
          </section>

          {/* 3. SUPPORT */}
          <section className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
                <Headphones size={24} />
              </div>
              <div>
                <h4 className="text-lg font-black text-blue-900">
                  Need Assistance with your Booking?
                </h4>
                <p className="mt-1.5 text-sm text-blue-700 leading-relaxed max-w-xl">
                  If you have any trouble joining the meeting room, require
                  invoice verification, or have questions regarding your
                  registration status, reach out to our support desk.
                </p>
              </div>
            </div>
            <a
              href="mailto:support@guidex.com"
              className="rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-blue-700 transition shrink-0"
            >
              Contact Support
            </a>
          </section>
        </div>
      </main>

      {/* CANCEL MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-900">
              Cancel Registration
            </h3>
            <p className="mt-3 text-base text-slate-600">
              Are you sure you want to cancel your spot for{" "}
              <strong className="text-slate-900">{event?.title}</strong>?
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3.5">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="rounded-xl border border-slate-200 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Keep Registration
              </button>
              <button
                onClick={handleCancelRegistration}
                disabled={cancelling}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-sm font-bold text-white hover:bg-red-700"
              >
                {cancelling ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationDetails;
