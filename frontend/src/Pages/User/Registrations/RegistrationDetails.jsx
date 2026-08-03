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
    if (!imagePath) {
      return "";
    }

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

      console.log("REGISTRATION DETAILS RESPONSE:", data);

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

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
    fetchRegistrationDetails();
  }, [id]);

  // =====================================================
  // LIVE CLOCK
  // =====================================================

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // =====================================================
  // EVENT DATA
  // =====================================================

  const event = useMemo(() => {
    if (!registration) {
      return {};
    }

    return registration.event || {};
  }, [registration]);

  // =====================================================
  // EVENT START
  // =====================================================

  const eventStart = event?.startDateTime || null;

  // =====================================================
  // EVENT END
  // =====================================================

  const eventEnd = event?.endDateTime || null;

  // =====================================================
  // REGISTRATION DEADLINE
  // =====================================================

  const registrationDeadline = event?.registrationDeadline || null;

  // =====================================================
  // DATE OBJECTS
  // =====================================================

  const startDate = useMemo(() => {
    if (!eventStart) {
      return null;
    }

    const date = new Date(eventStart);

    return isNaN(date.getTime()) ? null : date;
  }, [eventStart]);

  const endDate = useMemo(() => {
    if (!eventEnd) {
      return null;
    }

    const date = new Date(eventEnd);

    return isNaN(date.getTime()) ? null : date;
  }, [eventEnd]);

  const deadlineDate = useMemo(() => {
    if (!registrationDeadline) {
      return null;
    }

    const date = new Date(registrationDeadline);

    return isNaN(date.getTime()) ? null : date;
  }, [registrationDeadline]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
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
  // FORMAT DATE TIME
  // =====================================================

  const formatDateTime = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // =====================================================
  // EVENT STATUS
  //
  // IMPORTANT:
  // Status is dynamically calculated using start/end time.
  // This means UI automatically changes:
  //
  // Upcoming
  //    ↓
  // Live
  //    ↓
  // Completed
  //
  // =====================================================

  const eventStatus = useMemo(() => {
    if (event?.status === "Cancelled") {
      return "Cancelled";
    }

    if (
      registration?.status === "Cancelled" ||
      registration?.status === "cancelled"
    ) {
      return "Registration Cancelled";
    }

    const currentTime = now.getTime();

    if (startDate && endDate) {
      if (currentTime < startDate.getTime()) {
        return "Upcoming";
      }

      if (
        currentTime >= startDate.getTime() &&
        currentTime < endDate.getTime()
      ) {
        return "Live";
      }

      if (currentTime >= endDate.getTime()) {
        return "Completed";
      }
    }

    if (startDate) {
      if (currentTime < startDate.getTime()) {
        return "Upcoming";
      }

      return "Live";
    }

    return event?.status || "Unknown";
  }, [now, event, registration, startDate, endDate]);

  // =====================================================
  // REGISTRATION STATUS
  // =====================================================

  const registrationCancelled =
    registration?.status === "Cancelled" ||
    registration?.status === "cancelled";

  const isRegistered = registration?.status === "Registered";

  // =====================================================
  // EVENT STATES
  // =====================================================

  const isLive = eventStatus === "Live";

  const isEnded = eventStatus === "Completed";

  const isEventCancelled = event?.status === "Cancelled";

  // =====================================================
  // REGISTRATION DEADLINE PASSED
  // =====================================================

  const isRegistrationDeadlinePassed =
    deadlineDate && now.getTime() >= deadlineDate.getTime();

  // =====================================================
  // CAN CANCEL REGISTRATION
  //
  // Registered
  // + Event Upcoming
  // + Deadline not passed
  //
  // =====================================================

  const canCancelRegistration =
    isRegistered &&
    !isEventCancelled &&
    !isLive &&
    !isEnded &&
    !isRegistrationDeadlinePassed;

  // =====================================================
  // CAN JOIN EVENT
  //
  // User can join 10 minutes before start.
  //
  // =====================================================

  const canJoinEvent = () => {
    if (!registration) {
      return false;
    }

    if (!isRegistered) {
      return false;
    }

    if (registrationCancelled) {
      return false;
    }

    if (isEventCancelled) {
      return false;
    }

    if (isEnded) {
      return false;
    }

    if (!startDate) {
      return false;
    }

    const joinTime = startDate.getTime() - 10 * 60 * 1000;

    return now.getTime() >= joinTime;
  };

  // =====================================================
  // JOIN EVENT
  // =====================================================

  const handleJoinEvent = () => {
    if (!canJoinEvent()) {
      toast.info("The event meeting is not available yet.");

      return;
    }

    // Meeting link belongs to EventRegistration
    // according to your schema.

    const meetingLink = registration?.meetingLink;

    if (meetingLink) {
      window.open(meetingLink, "_blank", "noopener,noreferrer");

      return;
    }

    // If your application uses an internal
    // meeting page instead of a direct link.

    if (event?._id) {
      navigate(`/events/${event._id}/meeting`);

      return;
    }

    toast.error("Meeting link is not available");
  };

  // =====================================================
  // CANCEL REGISTRATION
  //
  // IMPORTANT:
  // We DO NOT delete the registration.
  //
  // Backend changes:
  //
  // Registered
  //     ↓
  // Cancelled
  //
  // Then user can register again.
  //
  // =====================================================

  const handleCancelRegistration = async () => {
    try {
      if (!registration?._id) {
        toast.error("Registration ID is missing");

        return;
      }

      if (!event?._id) {
        toast.error("Event ID is missing");

        return;
      }

      if (!canCancelRegistration) {
        toast.error("This registration can no longer be cancelled.");

        return;
      }

      setCancelling(true);

      const token = getUserToken();

      if (!token) {
        toast.error("Please login again");

        navigate("/login");

        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/event-registration/cancel/${event._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            registrationId: registration._id,
          }),
        }
      );

      const data = await response.json();

      console.log("CANCEL REGISTRATION RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel registration");
      }

      // Update UI immediately if backend
      // returns updated registration.

      if (data.registration) {
        setRegistration((previous) => ({
          ...previous,
          ...data.registration,
          event: previous?.event || event,
        }));
      }

      setShowCancelModal(false);

      toast.success("Registration cancelled successfully.");

      // Fetch latest data
      await fetchRegistrationDetails(true);
    } catch (error) {
      console.error("Cancel Registration Error:", error);

      toast.error(error.message || "Failed to cancel registration");
    } finally {
      setCancelling(false);
    }
  };

  // =====================================================
  // COPY REGISTRATION ID
  // =====================================================

  const handleCopyId = async () => {
    try {
      if (!registration?._id) {
        return;
      }

      await navigator.clipboard.writeText(registration._id);

      setCopied(true);

      toast.success("Registration ID copied");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy Registration ID Error:", error);

      toast.error("Unable to copy registration ID");
    }
  };

  // =====================================================
  // COUNTDOWN
  // =====================================================

  const getCountdown = (targetDate) => {
    if (!targetDate) {
      return null;
    }

    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      return null;
    }

    const totalSeconds = Math.floor(difference / 1000);

    const days = Math.floor(totalSeconds / 86400);

    const hours = Math.floor((totalSeconds % 86400) / 3600);

    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const seconds = totalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const eventCountdown = getCountdown(startDate);

  const deadlineCountdown = getCountdown(deadlineDate);

  // =====================================================
  // EVENT STATUS STYLE
  // =====================================================

  const getEventStatusStyle = () => {
    switch (eventStatus) {
      case "Upcoming":
        return {
          wrapper: "border-blue-200 bg-blue-50 text-blue-700",
          dot: "bg-blue-500",
        };

      case "Live":
        return {
          wrapper: "border-emerald-200 bg-emerald-50 text-emerald-700",
          dot: "bg-emerald-500 animate-pulse",
        };

      case "Completed":
        return {
          wrapper: "border-gray-200 bg-gray-100 text-gray-600",
          dot: "bg-gray-500",
        };

      case "Cancelled":
      case "Registration Cancelled":
        return {
          wrapper: "border-red-200 bg-red-50 text-red-700",
          dot: "bg-red-500",
        };

      default:
        return {
          wrapper: "border-gray-200 bg-gray-50 text-gray-600",
          dot: "bg-gray-400",
        };
    }
  };

  const eventStatusStyle = getEventStatusStyle();

  // =====================================================
  // REGISTRATION STYLE
  // =====================================================

  const getRegistrationStatusStyle = () => {
    if (registrationCancelled) {
      return "border-red-200 bg-red-50 text-red-700";
    }

    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fc]">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-200">
              <Loader2 size={30} className="animate-spin text-white" />
            </div>

            <h2 className="mt-6 text-xl font-black text-gray-900">
              Loading Registration
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Fetching your event registration details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // REGISTRATION NOT FOUND
  // =====================================================

  if (!registration) {
    return (
      <div className="min-h-screen bg-[#f7f9fc]">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <CircleAlert size={32} />
            </div>

            <h2 className="mt-6 text-2xl font-black text-gray-900">
              Registration Not Found
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              We couldn't find this registration. It may have been deleted or
              you may not have permission to view it.
            </p>

            <button
              onClick={() => navigate("/my-registrations")}
              className="mt-7 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-black text-white transition hover:bg-indigo-700"
            >
              Back to My Registrations
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // IMAGE URLS
  // =====================================================

  const bannerUrl = getImageUrl(event?.bannerImage);

  const speakerImage = getImageUrl(event?.speakerImage);

  // =====================================================
  // JOIN AVAILABLE
  // =====================================================

  const joinAvailable = canJoinEvent();

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        {/* =================================================
            TOP BAR
        ================================================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigate("/my-registrations")}
            className="group flex w-fit items-center gap-2 text-sm font-bold text-gray-500 transition hover:text-indigo-600"
          >
            <ArrowLeft
              size={18}
              className="transition group-hover:-translate-x-1"
            />
            My Registrations
          </button>

          <button
            onClick={() => fetchRegistrationDetails(true)}
            disabled={refreshing}
            className="flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-60"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* =================================================
            HERO
        ================================================= */}

        <section className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm">
          <div className="relative h-[420px] sm:h-[500px]">
            {bannerUrl ? (
              <img
                src={bannerUrl}
                alt={event?.title || "Event"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700">
                <CalendarDays size={120} className="text-white/20" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />

            {/* HERO TOP */}

            <div className="absolute left-5 right-5 top-5 flex flex-wrap items-center justify-between gap-3 sm:left-8 sm:right-8 sm:top-8">
              <div className="flex flex-wrap gap-2">
                {/* EVENT STATUS */}

                <span
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black backdrop-blur-sm ${eventStatusStyle.wrapper}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${eventStatusStyle.dot}`}
                  />

                  {eventStatus}
                </span>

                {/* REGISTRATION STATUS */}

                <span
                  className={`rounded-full border px-4 py-2 text-xs font-black ${getRegistrationStatusStyle()}`}
                >
                  {registration?.status || "Registered"}
                </span>
              </div>

              {/* VERIFIED */}

              <div className="hidden items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs font-bold text-white backdrop-blur-md sm:flex">
                <ShieldCheck size={15} />
                Verified Registration
              </div>
            </div>

            {/* HERO BOTTOM */}

            <div className="absolute bottom-7 left-5 right-5 sm:bottom-10 sm:left-8 sm:right-8">
              <div className="max-w-4xl">
                <p className="mb-3 flex items-center gap-2 text-sm font-bold text-indigo-200">
                  <TicketCheck size={17} />

                  {registrationCancelled
                    ? "Your registration was cancelled"
                    : "You're registered for this event"}
                </p>

                <h1 className="text-3xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                  {event?.title || "Event Title"}
                </h1>

                <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-white/90">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={17} />

                    {formatDate(eventStart)}
                  </span>

                  <span className="text-white/40">•</span>

                  <span className="flex items-center gap-2">
                    <Clock3 size={17} />

                    {formatTime(eventStart)}
                  </span>

                  {eventEnd && (
                    <>
                      <span className="text-white/40">•</span>

                      <span>Ends {formatTime(eventEnd)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            COUNTDOWN
        ================================================= */}

        {eventStatus === "Upcoming" &&
          eventCountdown &&
          !registrationCancelled && (
            <section className="mt-6 overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white shadow-lg shadow-indigo-100 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold text-indigo-100">
                    <Timer size={18} />
                    EVENT STARTS IN
                  </div>

                  <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                    Get ready for the event
                  </h2>

                  <p className="mt-2 text-sm text-indigo-100">
                    You can join the event 10 minutes before the scheduled start
                    time.
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {[
                    ["Days", eventCountdown.days],
                    ["Hours", eventCountdown.hours],
                    ["Minutes", eventCountdown.minutes],
                    ["Seconds", eventCountdown.seconds],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="min-w-[60px] rounded-2xl border border-white/20 bg-white/10 p-3 text-center backdrop-blur-sm sm:min-w-[75px] sm:p-4"
                    >
                      <p className="text-xl font-black sm:text-2xl">
                        {String(value).padStart(2, "0")}
                      </p>

                      <p className="mt-1 text-[10px] font-bold uppercase text-indigo-100">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

        {/* =================================================
            CANCEL REGISTRATION NOTICE
        ================================================= */}

        {canCancelRegistration && deadlineCountdown && (
          <section className="mt-6 flex flex-col gap-4 rounded-3xl border border-orange-200 bg-orange-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <AlertTriangle size={21} />
              </div>

              <div>
                <h3 className="font-black text-orange-800">
                  Need to cancel your registration?
                </h3>

                <p className="mt-1 text-sm text-orange-700">
                  You can cancel your registration before the registration
                  deadline.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCancelModal(true)}
              className="flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-5 py-3 text-sm font-black text-orange-700 transition hover:bg-orange-100"
            >
              <Ban size={17} />
              Cancel Registration
            </button>
          </section>
        )}

        {/* =================================================
            CANCELLED NOTICE
        ================================================= */}

        {registrationCancelled && (
          <section className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                  <XCircle size={24} />
                </div>

                <div>
                  <h3 className="font-black text-red-800">
                    Registration Cancelled
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-red-700">
                    You cancelled your registration for this event. You can
                    register again from the event page if registration is still
                    open.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (event?._id) {
                    navigate(`/upComingEvents/${event._id}`);
                  }
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-black text-white transition hover:bg-indigo-700"
              >
                <TicketCheck size={17} />
                Register Again
              </button>
            </div>
          </section>
        )}

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="space-y-6 lg:col-span-2">
            {/* ABOUT */}

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Info size={23} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-gray-900">
                    About This Event
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Everything you need to know about this event
                  </p>
                </div>
              </div>

              <p className="mt-6 text-sm leading-8 text-gray-600">
                {event?.description || "No event description is available."}
              </p>
            </section>

            {/* EVENT INFORMATION */}

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-black text-gray-900">
                Event Information
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoCard
                  icon={<CalendarDays size={20} />}
                  title="Event Date"
                  value={formatDate(eventStart)}
                  iconClass="bg-indigo-50 text-indigo-600"
                />

                <InfoCard
                  icon={<Clock3 size={20} />}
                  title="Event Time"
                  value={
                    eventStart
                      ? `${formatTime(eventStart)}${
                          eventEnd ? ` - ${formatTime(eventEnd)}` : ""
                        }`
                      : "N/A"
                  }
                  iconClass="bg-blue-50 text-blue-600"
                />

                <InfoCard
                  icon={<Users size={20} />}
                  title="Event Status"
                  value={eventStatus}
                  iconClass="bg-purple-50 text-purple-600"
                />

                <InfoCard
                  icon={<Clock size={20} />}
                  title="Registration Deadline"
                  value={formatDateTime(registrationDeadline)}
                  iconClass="bg-red-50 text-red-600"
                />

                <InfoCard
                  icon={<Video size={20} />}
                  title="Meeting"
                  value={
                    registration?.meetingLink
                      ? "Meeting Link Available"
                      : "Meeting Link Pending"
                  }
                  iconClass="bg-emerald-50 text-emerald-600"
                />

                <InfoCard
                  icon={<ShieldCheck size={20} />}
                  title="Created By"
                  value={event?.createdBy || "TeamGuideex"}
                  iconClass="bg-orange-50 text-orange-600"
                />
              </div>
            </section>

            {/* SPEAKER */}

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-black text-gray-900">
                Event Speaker
              </h2>

              <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  {speakerImage ? (
                    <img
                      src={speakerImage}
                      alt={event?.speaker || "Speaker"}
                      className="h-24 w-24 rounded-2xl object-cover ring-4 ring-white shadow-sm"
                    />
                  ) : (
                    <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                      <UserRound size={38} />
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-black text-gray-900">
                      {event?.speaker || "Speaker not specified"}
                    </h3>

                    {(event?.speakerRole || event?.speakerCompany) && (
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                        {event?.speakerRole && (
                          <span className="flex items-center gap-2">
                            <Briefcase size={15} />

                            {event.speakerRole}
                          </span>
                        )}

                        {event?.speakerCompany && (
                          <span className="flex items-center gap-2">
                            <Building2 size={15} />

                            {event.speakerCompany}
                          </span>
                        )}
                      </div>
                    )}

                    {event?.speakerExperience && (
                      <p className="mt-3 text-sm font-bold text-indigo-600">
                        {event.speakerExperience} experience
                      </p>
                    )}

                    {event?.speakerBio && (
                      <p className="mt-4 text-sm leading-7 text-gray-600">
                        {event.speakerBio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="space-y-6">
            {/* ACTION CARD */}

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-gray-900">
                Event Actions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your participation
              </p>

              <div className="mt-6 space-y-3">
                {/* JOIN EVENT */}

                {joinAvailable && isRegistered && !isEventCancelled && (
                  <button
                    onClick={handleJoinEvent}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700"
                  >
                    <Video size={19} />

                    {isLive ? "Join Live Event" : "Join Event"}
                  </button>
                )}

                {/* WAITING */}

                {!joinAvailable &&
                  eventStatus === "Upcoming" &&
                  isRegistered &&
                  !registrationCancelled &&
                  !isEventCancelled && (
                    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                      <div className="flex gap-3">
                        <Clock
                          size={19}
                          className="mt-0.5 flex-shrink-0 text-blue-600"
                        />

                        <div>
                          <p className="text-sm font-black text-blue-800">
                            Event starts soon
                          </p>

                          <p className="mt-1 text-xs leading-5 text-blue-700">
                            The join button will be available 10 minutes before
                            the event starts.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {/* VIEW EVENT */}

                {event?._id && (
                  <button
                    onClick={() => navigate(`/events/${event._id}`)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-bold text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <ExternalLink size={17} />
                    View Event Page
                  </button>
                )}

                {/* CANCEL */}

                {canCancelRegistration && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm font-black text-red-600 transition hover:bg-red-100"
                  >
                    <Ban size={17} />
                    Cancel Registration
                  </button>
                )}

                {/* REGISTER AGAIN */}

                {registrationCancelled &&
                  !isEventCancelled &&
                  !isEnded &&
                  !isRegistrationDeadlinePassed && (
                    <button
                      onClick={() => {
                        navigate(`/events/${event._id}`);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-4 text-sm font-black text-white transition hover:bg-indigo-700"
                    >
                      <TicketCheck size={19} />
                      Register Again
                    </button>
                  )}
              </div>
            </section>

            {/* REGISTRATION CARD */}

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <TicketCheck size={21} />
                </div>

                <div>
                  <h2 className="font-black text-gray-900">Registration</h2>

                  <p className="text-xs text-gray-500">
                    Your registration status
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                {/* STATUS */}

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Status
                  </p>

                  <span
                    className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-black ${getRegistrationStatusStyle()}`}
                  >
                    {registrationCancelled ? (
                      <XCircle size={15} />
                    ) : (
                      <CheckCircle2 size={15} />
                    )}

                    {registration?.status || "Registered"}
                  </span>
                </div>

                {/* REGISTERED ON */}

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Registered On
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-sm font-bold text-gray-700">
                    <CalendarCheck2 size={16} className="text-indigo-500" />

                    {formatDateTime(
                      registration?.registeredAt || registration?.createdAt
                    )}
                  </p>
                </div>

                {/* ATTENDANCE */}

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Attendance
                  </p>

                  <div className="mt-2">
                    {registration?.attended ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-600">
                        <CheckCircle2 size={15} />
                        Attended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-black text-orange-600">
                        <Clock size={15} />
                        Not Attended
                      </span>
                    )}
                  </div>
                </div>

                {/* JOINED AT */}

                {registration?.joinedAt && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                      Joined At
                    </p>

                    <p className="mt-2 text-sm font-bold text-gray-700">
                      {formatDateTime(registration.joinedAt)}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* COMPLETED */}

            {isEnded && !registrationCancelled && (
              <section className="rounded-3xl border border-gray-200 bg-gray-100 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-gray-600">
                  <CheckCircle2 size={21} />
                </div>

                <h3 className="mt-4 font-black text-gray-800">
                  Event Completed
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  This event has ended. Thank you for participating.
                </p>
              </section>
            )}

            {/* EVENT CANCELLED */}

            {isEventCancelled && (
              <section className="rounded-3xl border border-red-100 bg-red-50 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <XCircle size={21} />
                </div>

                <h3 className="mt-4 font-black text-red-700">
                  Event Cancelled
                </h3>

                <p className="mt-2 text-sm leading-6 text-red-600">
                  This event has been cancelled by the administration.
                </p>
              </section>
            )}
          </aside>
        </div>

        {/* =================================================
            REGISTRATION ID
        ================================================= */}

        <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                Registration ID
              </p>

              <p className="mt-2 break-all font-mono text-xs font-bold text-gray-600">
                {registration?._id}
              </p>
            </div>

            <button
              onClick={handleCopyId}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}

              {copied ? "Copied" : "Copy ID"}
            </button>
          </div>

          {registration?.student?.email && (
            <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-5 text-xs text-gray-500">
              <Mail size={15} />

              {registration.student.email}
            </div>
          )}
        </section>
      </main>

      {/* =====================================================
          CANCEL CONFIRMATION MODAL
      ===================================================== */}

      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* MODAL HEADER */}

            <div className="border-b border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <AlertTriangle size={22} />
                  </div>

                  <div>
                    <h3 className="font-black text-gray-900">
                      Cancel Registration
                    </h3>

                    <p className="text-xs text-gray-500">
                      You can register again later if registration is open
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelling}
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>

            {/* MODAL BODY */}

            <div className="p-6">
              <p className="text-sm leading-7 text-gray-600">
                Are you sure you want to cancel your registration for{" "}
                <span className="font-black text-gray-900">
                  {event?.title || "this event"}
                </span>
                ?
              </p>

              <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50 p-4">
                <div className="flex gap-3">
                  <Info
                    size={18}
                    className="mt-0.5 flex-shrink-0 text-orange-600"
                  />

                  <p className="text-xs leading-6 text-orange-700">
                    Your registration will be marked as cancelled. If the
                    registration deadline has not passed, you can register for
                    this event again from the event page.
                  </p>
                </div>
              </div>
            </div>

            {/* MODAL ACTIONS */}

            <div className="flex gap-3 border-t border-gray-100 bg-gray-50 p-5">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
              >
                Keep Registration
              </button>

              <button
                onClick={handleCancelRegistration}
                disabled={cancelling}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelling ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <Ban size={17} />
                    Cancel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// INFO CARD COMPONENT
// =====================================================

const InfoCard = ({ icon, title, value, iconClass }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 transition hover:border-gray-200 hover:bg-white hover:shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
            {title}
          </p>

          <p className="mt-2 break-words text-sm font-black text-gray-800">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationDetails;
