import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  UserRound,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Video,
  Users,
  RefreshCw,
  TicketCheck,
  CircleAlert,
  Sparkles,
  DollarSign,
  Building2,
} from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyRegistrations = () => {
  const navigate = useNavigate();

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  // =========================================================
  // STATE
  // =========================================================

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedAttendance, setSelectedAttendance] = useState("All");

  // =========================================================
  // TOKEN
  // =========================================================

  const getUserToken = () => {
    return localStorage.getItem("UserToken");
  };

  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    const cleanPath = imagePath.replace(/^\/+/, "");
    const cleanBaseUrl = API_BASE_URL.replace(/\/+$/, "");

    return `${cleanBaseUrl}/${cleanPath}`;
  };

  // =========================================================
  // FETCH REGISTRATIONS
  // =========================================================

  const fetchMyRegistrations = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = getUserToken();

      if (!token) {
        toast.error("Please login to view your registrations");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/event-registration/my-registrations`,
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
        throw new Error(data.message || "Failed to load your registrations");
      }

      setRegistrations(
        data.registrations || data.data || data.eventRegistrations || []
      );
    } catch (error) {
      console.error("Fetch My Registrations Error:", error);

      toast.error(error.message || "Failed to load your registrations");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchMyRegistrations();
  }, []);

  // =========================================================
  // GET EVENT
  // =========================================================

  const getEvent = (registration) => {
    return registration?.event || registration?.eventId || {};
  };

  // =========================================================
  // DATE FORMATS
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "N/A";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatTime = (date) => {
    if (!date) return "N/A";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getEventStart = (event) => {
    return event?.startDateTime;
  };

  const getEventEnd = (event) => {
    return event?.endDateTime;
  };

  // Check if event is strictly in the past
  const isEventCompleted = (registration) => {
    const event = getEvent(registration);
    if (!event) return false;

    if (event.computedStatus === "Completed" || event.status === "Completed") {
      return true;
    }

    const end = getEventEnd(event);
    if (end) {
      const eventEnd = new Date(end);
      if (!isNaN(eventEnd.getTime()) && Date.now() > eventEnd.getTime()) {
        return true;
      }
    }

    return false;
  };

  const canJoinEvent = (registration) => {
    const event = getEvent(registration);
    if (!event) return false;

    if (
      registration.status === "Cancelled" ||
      registration.status === "cancelled" ||
      event.status === "Cancelled"
    ) {
      return false;
    }

    // If event is already finished, joining is disabled
    if (isEventCompleted(registration)) {
      return false;
    }

    const start = getEventStart(event);
    if (!start) return false;

    const eventStart = new Date(start);
    if (isNaN(eventStart.getTime())) return false;

    const joinTime = eventStart.getTime() - 10 * 60 * 1000;
    const now = Date.now();

    if (event.computedStatus === "Live Now") return true;

    return now >= joinTime;
  };

  // =========================================================
  // STYLES
  // =========================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-violet-500/90 text-white border-white/30";
      case "Live Now":
        return "bg-teal-500/90 text-white border-white/30";
      case "Completed":
        return "bg-slate-700/90 text-white border-white/30";
      case "Cancelled":
        return "bg-rose-500/90 text-white border-white/30";
      case "Registration Closed":
        return "bg-amber-500/90 text-white border-white/30";
      case "Housefull":
        return "bg-orange-500/90 text-white border-white/30";
      default:
        return "bg-white/90 text-slate-700 border-white/30";
    }
  };

  const getRegistrationStatusStyle = (status) => {
    switch (status) {
      case "Registered":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getAttendanceStyle = (attended) => {
    if (attended) {
      return "bg-teal-50 text-teal-700 border-teal-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  // =========================================================
  // FILTERING & STATS
  // =========================================================

  const filteredRegistrations = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return registrations.filter((registration) => {
      const event = getEvent(registration);
      const title = event?.title?.toLowerCase() || "";
      const description = event?.description?.toLowerCase() || "";
      const speakerName = event?.speakerName?.toLowerCase() || "";
      const speakerOrg = event?.speakerOrganization?.toLowerCase() || "";
      const eventStatus = event?.computedStatus || "Upcoming";

      const matchesSearch =
        !search ||
        title.includes(search) ||
        description.includes(search) ||
        speakerName.includes(search) ||
        speakerOrg.includes(search);

      const matchesStatus =
        selectedStatus === "All" || eventStatus === selectedStatus;

      const matchesAttendance =
        selectedAttendance === "All" ||
        (selectedAttendance === "Attended" && registration.attended === true) ||
        (selectedAttendance === "Not Attended" &&
          registration.attended === false);

      return matchesSearch && matchesStatus && matchesAttendance;
    });
  }, [registrations, searchTerm, selectedStatus, selectedAttendance]);

  const statistics = useMemo(() => {
    const total = registrations.length;
    const now = Date.now();

    const upcoming = registrations.filter((r) => {
      const event = getEvent(r);
      const startTime = event?.startDateTime
        ? new Date(event.startDateTime).getTime()
        : 0;
      return (
        r.status === "Registered" &&
        startTime > now &&
        event?.status !== "Cancelled"
      );
    }).length;

    const live = registrations.filter((r) => {
      const event = getEvent(r);
      const startTime = event?.startDateTime
        ? new Date(event.startDateTime).getTime()
        : 0;
      const endTime = event?.endDateTime
        ? new Date(event.endDateTime).getTime()
        : 0;
      return r.status === "Registered" && now >= startTime && now <= endTime;
    }).length;

    const completed = registrations.filter((r) => {
      const event = getEvent(r);
      const endTime = event?.endDateTime
        ? new Date(event.endDateTime).getTime()
        : 0;
      return (
        r.status === "Registered" &&
        (now > endTime || event?.status === "Completed")
      );
    }).length;

    const attended = registrations.filter((r) => r.attended === true).length;

    return { total, upcoming, live, completed, attended };
  }, [registrations]);

  const handleViewEvent = (registration) => {
    const registrationId = registration._id || registration.registrationId;

    if (!registrationId) {
      toast.error("Registration information is unavailable");
      return;
    }

    navigate(`/my-registrations/${registrationId}`);
  };

  const handleJoinEvent = (registration) => {
    const event = getEvent(registration);
    if (!canJoinEvent(registration)) {
      toast.info(
        "The event meeting will be available 10 minutes before the event."
      );
      return;
    }

    const activeLink = registration.meetingLink || event.meetingUrl;
    if (activeLink) {
      window.open(activeLink, "_blank", "noopener,noreferrer");
      return;
    }

    toast.error("Meeting link is not available");
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-violet-100" />
          <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-violet-600" />
        </div>
        <p className="mt-6 text-center text-lg font-semibold text-slate-700">
          Loading your registrations data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 px-6 py-8 sm:px-10 sm:py-10 text-white shadow-xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-xs font-semibold text-violet-200 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-md shadow-inner">
                <TicketCheck size={27} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-fuchsia-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-violet-300">
                    Your Events Hub
                  </span>
                </div>

                <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-4xl">
                  My Registrations
                </h1>

                <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-slate-300 sm:text-sm">
                  Keep track of all your event bookings, join live rooms, and
                  review participation statuses in one place.
                </p>
              </div>
            </div>

            <button
              onClick={() => fetchMyRegistrations(true)}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* STATISTICS */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Registered
                </p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {statistics.total}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <TicketCheck size={19} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Upcoming
                </p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {statistics.upcoming}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-50 text-fuchsia-600">
                <CalendarDays size={19} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Live Now
                </p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {statistics.live}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Video size={19} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Completed
                </p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {statistics.completed}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <CheckCircle2 size={19} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Attended
                </p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {statistics.attended}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Users size={19} />
              </div>
            </div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search your registered events..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-700 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-50"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-violet-500"
            >
              <option value="All">All Status</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Live Now">Live Now</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={selectedAttendance}
              onChange={(e) => setSelectedAttendance(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-violet-500"
            >
              <option value="All">All Attendance</option>
              <option value="Attended">Attended</option>
              <option value="Not Attended">Not Attended</option>
            </select>
          </div>
        </div>

        {/* SECTION HEADER */}
        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">
            Registered Events List
          </h2>
          <span className="text-xs font-medium text-slate-500">
            Showing{" "}
            <strong className="text-violet-600">
              {filteredRegistrations.length}
            </strong>{" "}
            items
          </span>
        </div>

        {/* EMPTY STATE */}
        {filteredRegistrations.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">
              <CalendarDays size={30} />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              No registrations found
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-xs text-slate-500">
              You don't have any registered events matching your current search
              or filters.
            </p>
          </div>
        ) : (
          /* LIST OF CARDS */
          <div className="mt-6 space-y-4">
            {filteredRegistrations.map((registration) => {
              const event = getEvent(registration);
              const bannerUrl = getImageUrl(event?.bannerImage);
              const speakerImage = getImageUrl(event?.speakerImage);
              const eventStart = getEventStart(event);
              const eventEnd = getEventEnd(event);
              const eventStatus = event?.computedStatus || "Upcoming";
              const eventLive = eventStatus === "Live Now";
              const eventCompleted = isEventCompleted(registration);
              const joinAvailable = canJoinEvent(registration);

              return (
                <article
                  key={registration._id}
                  className="group flex flex-col lg:flex-row overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  {/* LEFT: BANNER IMAGE */}
                  <div className="relative lg:w-72 h-48 lg:h-auto shrink-0 overflow-hidden bg-slate-900">
                    {bannerUrl ? (
                      <img
                        src={bannerUrl}
                        alt={event.title || "Registered event"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-700">
                        <CalendarDays size={45} className="text-white/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />

                    {/* BADGES ON BANNER */}
                    <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur-md ${getStatusStyle(
                          eventCompleted ? "Completed" : eventStatus
                        )}`}
                      >
                        {eventCompleted ? "Completed" : eventStatus}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold shadow-sm ${getRegistrationStatusStyle(
                          registration.status
                        )}`}
                      >
                        {registration.status || "Registered"}
                      </span>
                    </div>

                    {eventLive && !eventCompleted && (
                      <div className="absolute left-3 bottom-3 flex items-center gap-1.5 rounded-full bg-teal-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                        LIVE NOW
                      </div>
                    )}
                  </div>

                  {/* RIGHT: CONTENT BODY */}
                  <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                    <div>
                      {/* DOMAIN & PRICING TAGS */}
                      <div className="mb-2 flex items-center gap-2">
                        {event.domain && (
                          <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700">
                            {event.domain}
                          </span>
                        )}
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            event.isPaid
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {event.isPaid ? `₹${event.ticketPrice}` : "Free"}
                        </span>
                      </div>

                      {/* TITLE */}
                      <h3 className="text-lg font-black tracking-tight text-slate-900 sm:text-xl">
                        {event.title || "Event Title Unavailable"}
                      </h3>

                      {/* DESCRIPTION */}
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-500 line-clamp-1">
                        {event.description || "No event description available."}
                      </p>

                      {/* SCHEDULE & SPEAKER GRID */}
                      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                        {/* DATE */}
                        <div className="flex items-center gap-2.5 rounded-xl bg-violet-50/50 p-2.5 border border-violet-100/40">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                            <CalendarDays size={15} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                              Date
                            </p>
                            <p className="truncate text-xs font-bold text-slate-800">
                              {formatDate(eventStart)}
                            </p>
                          </div>
                        </div>

                        {/* TIME */}
                        <div className="flex items-center gap-2.5 rounded-xl bg-fuchsia-50/50 p-2.5 border border-fuchsia-100/40">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fuchsia-100 text-fuchsia-600">
                            <Clock3 size={15} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                              Time
                            </p>
                            <p className="truncate text-xs font-bold text-slate-800">
                              {formatTime(eventStart)}
                              {eventEnd && ` - ${formatTime(eventEnd)}`}
                            </p>
                          </div>
                        </div>

                        {/* SPEAKER */}
                        <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                          {speakerImage ? (
                            <img
                              src={speakerImage}
                              alt={event.speakerName}
                              className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-violet-50"
                            />
                          ) : (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-700">
                              <UserRound size={15} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                              Speaker
                            </p>
                            <p className="truncate text-xs font-bold text-slate-800">
                              {event.speakerName || "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* FOOTER METRICS & ACTIONS */}
                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      {/* METRICS */}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-500">
                        <span>
                          Registered:{" "}
                          <strong className="text-slate-800">
                            {formatDateTime(registration.registeredAt)}
                          </strong>
                        </span>
                        <span className="text-slate-300">|</span>
                        <span>
                          Attendance:{" "}
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold border ${getAttendanceStyle(
                              registration.attended
                            )}`}
                          >
                            {registration.attended ? (
                              <>
                                <CheckCircle2 size={12} /> Attended
                              </>
                            ) : (
                              <>
                                <Clock size={12} /> Not Attended
                              </>
                            )}
                          </span>
                        </span>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewEvent(registration)}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                        >
                          <ExternalLink size={15} />
                          View Event
                        </button>

                        {eventCompleted ? (
                          <button
                            disabled
                            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-400 cursor-not-allowed"
                          >
                            <CheckCircle2 size={15} />
                            Completed
                          </button>
                        ) : (
                          joinAvailable && (
                            <button
                              onClick={() => handleJoinEvent(registration)}
                              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-100 transition hover:-translate-y-0.5 hover:shadow-lg"
                            >
                              <Video size={15} />
                              {eventLive ? "Join Live" : "Join Event"}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* STATUS NOTICES */}
                    {eventCompleted && registration.status !== "Cancelled" && (
                      <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
                        <CheckCircle2 size={14} className="text-slate-600" />
                        <span>
                          Event completed. Thank you for participating!
                        </span>
                      </div>
                    )}

                    {!eventCompleted &&
                      !eventLive &&
                      registration.status !== "Cancelled" &&
                      !joinAvailable && (
                        <div className="mt-3 flex items-center gap-2 text-[11px] text-violet-700 bg-violet-50 p-2 rounded-lg">
                          <CircleAlert size={14} className="text-violet-600" />
                          <span>
                            Meeting link unlocks 10 minutes prior to event
                            start.
                          </span>
                        </div>
                      )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegistrations;
