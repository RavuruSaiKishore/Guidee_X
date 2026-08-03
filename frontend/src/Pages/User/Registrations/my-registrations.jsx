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
  // DATE FORMAT
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

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

  // =========================================================
  // DATE TIME FORMAT
  // =========================================================

  const formatDateTime = (date) => {
    if (!date) return "N/A";

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

  // =========================================================
  // TIME FORMAT
  // =========================================================

  const formatTime = (date) => {
    if (!date) return "N/A";

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

  // =========================================================
  // EVENT START
  // =========================================================

  const getEventStart = (event) => {
    return (
      event?.startDateTime || event?.dateTime || event?.startTime || event?.date
    );
  };

  // =========================================================
  // EVENT END
  // =========================================================

  const getEventEnd = (event) => {
    return event?.endDateTime || event?.endTime;
  };

  // =========================================================
  // EVENT STATUS
  // =========================================================

  const getCalculatedEventStatus = (event) => {
    if (!event) return "Unknown";

    if (event.status === "Cancelled") {
      return "Cancelled";
    }

    const start = getEventStart(event);
    const end = getEventEnd(event);

    if (!start) {
      return event.status || "Upcoming";
    }

    const startDate = new Date(start);

    if (isNaN(startDate.getTime())) {
      return event.status || "Upcoming";
    }

    const now = Date.now();

    if (end) {
      const endDate = new Date(end);

      if (!isNaN(endDate.getTime())) {
        if (now >= endDate.getTime()) {
          return "Completed";
        }

        if (now >= startDate.getTime() && now < endDate.getTime()) {
          return "Live";
        }
      }
    }

    if (now < startDate.getTime()) {
      return "Upcoming";
    }

    if (event.status === "Live") {
      return "Live";
    }

    if (event.status === "Completed") {
      return "Completed";
    }

    return event.status || "Upcoming";
  };

  // =========================================================
  // UPCOMING
  // =========================================================

  const isUpcoming = (event) => {
    return getCalculatedEventStatus(event) === "Upcoming";
  };

  // =========================================================
  // LIVE
  // =========================================================

  const isLive = (event) => {
    return getCalculatedEventStatus(event) === "Live";
  };

  // =========================================================
  // ENDED
  // =========================================================

  const isEnded = (event) => {
    return getCalculatedEventStatus(event) === "Completed";
  };

  // =========================================================
  // CAN JOIN EVENT
  // =========================================================

  const canJoinEvent = (registration) => {
    const event = getEvent(registration);

    if (!event) return false;

    if (
      registration.status === "Cancelled" ||
      registration.status === "cancelled"
    ) {
      return false;
    }

    if (event.status === "Cancelled") {
      return false;
    }

    const start = getEventStart(event);

    if (!start) return false;

    const eventStart = new Date(start);

    if (isNaN(eventStart.getTime())) {
      return false;
    }

    const joinTime = eventStart.getTime() - 10 * 60 * 1000;

    const now = Date.now();

    if (isLive(event)) {
      return true;
    }

    if (isEnded(event)) {
      return false;
    }

    return now >= joinTime;
  };

  // =========================================================
  // EVENT STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-violet-500/90 text-white border-white/30";

      case "Live":
        return "bg-teal-500/90 text-white border-white/30";

      case "Completed":
        return "bg-slate-700/90 text-white border-white/30";

      case "Cancelled":
        return "bg-rose-500/90 text-white border-white/30";

      case "Registration Closed":
        return "bg-amber-500/90 text-white border-white/30";

      default:
        return "bg-white/90 text-slate-700 border-white/30";
    }
  };

  // =========================================================
  // REGISTRATION STATUS STYLE
  // =========================================================

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

  // =========================================================
  // ATTENDANCE STYLE
  // =========================================================

  const getAttendanceStyle = (attended) => {
    if (attended) {
      return "bg-teal-50 text-teal-700 border-teal-200";
    }

    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  // =========================================================
  // FILTER
  // =========================================================

  const filteredRegistrations = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return registrations.filter((registration) => {
      const event = getEvent(registration);

      const title = event?.title?.toLowerCase() || "";
      const description = event?.description?.toLowerCase() || "";
      const speaker = event?.speaker?.toLowerCase() || "";
      const company = event?.speakerCompany?.toLowerCase() || "";

      const eventStatus = getCalculatedEventStatus(event);

      const matchesSearch =
        !search ||
        title.includes(search) ||
        description.includes(search) ||
        speaker.includes(search) ||
        company.includes(search);

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

  // =========================================================
  // STATISTICS
  // =========================================================

  const statistics = useMemo(() => {
    const total = registrations.length;

    const upcoming = registrations.filter((registration) =>
      isUpcoming(getEvent(registration))
    ).length;

    const live = registrations.filter((registration) =>
      isLive(getEvent(registration))
    ).length;

    const completed = registrations.filter((registration) =>
      isEnded(getEvent(registration))
    ).length;

    const attended = registrations.filter(
      (registration) => registration.attended === true
    ).length;

    return {
      total,
      upcoming,
      live,
      completed,
      attended,
    };
  }, [registrations]);

  // =========================================================
  // VIEW EVENT
  // =========================================================

  const handleViewEvent = (registration) => {
    if (!registration?._id) {
      toast.error("Registration information is unavailable");
      return;
    }

    navigate(`/my-registrations/${registration._id}`);
  };

  // =========================================================
  // JOIN EVENT
  // =========================================================

  const handleJoinEvent = (registration) => {
    const event = getEvent(registration);

    if (!canJoinEvent(registration)) {
      toast.info(
        "The event meeting will be available 10 minutes before the event."
      );

      return;
    }

    if (registration.meetingLink) {
      window.open(registration.meetingLink, "_blank", "noopener,noreferrer");

      return;
    }

    if (event.meetingLink) {
      window.open(event.meetingLink, "_blank", "noopener,noreferrer");

      return;
    }

    if (event._id) {
      navigate(`/events/${event._id}/meeting`);
      return;
    }

    toast.error("Meeting link is not available");
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="fixed inset-0 flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-violet-100" />

          <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-violet-600" />
        </div>

        <p className="mt-6 text-center text-lg font-semibold text-slate-700">
          Loading your registration's data...
        </p>

        <p className="mt-1 text-center text-sm text-slate-400">
          Please wait while we fetch the registrations data.
        </p>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-violet-600"
            >
              <ArrowLeft size={17} />
              Back
            </button>

            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-lg shadow-violet-200">
                <TicketCheck size={27} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Sparkles size={17} className="text-fuchsia-500" />

                  <span className="text-sm font-bold uppercase tracking-wider text-violet-600">
                    Your Events
                  </span>
                </div>

                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  My Registrations
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Keep track of all the events you've registered for and never
                  miss an opportunity to learn, connect, and grow.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => fetchMyRegistrations(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Registered
                </p>

                <p className="mt-2 text-3xl font-black text-slate-900">
                  {statistics.total}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <TicketCheck size={21} />
              </div>
            </div>
          </div>

          {/* UPCOMING */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Upcoming
                </p>

                <p className="mt-2 text-3xl font-black text-slate-900">
                  {statistics.upcoming}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-fuchsia-50 text-fuchsia-600">
                <CalendarDays size={21} />
              </div>
            </div>
          </div>

          {/* LIVE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Live Now
                </p>

                <p className="mt-2 text-3xl font-black text-slate-900">
                  {statistics.live}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Video size={21} />
              </div>
            </div>
          </div>

          {/* COMPLETED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-black text-slate-900">
                  {statistics.completed}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <CheckCircle2 size={21} />
              </div>
            </div>
          </div>

          {/* ATTENDED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Attended
                </p>

                <p className="mt-2 text-3xl font-black text-slate-900">
                  {statistics.attended}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Users size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            FILTER BAR
        ===================================================== */}

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search your registered events..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-50"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-500"
            >
              <option value="All">All Event Status</option>

              <option value="Upcoming">Upcoming</option>

              <option value="Live">Live</option>

              <option value="Completed">Completed</option>

              <option value="Cancelled">Cancelled</option>

              <option value="Registration Closed">Registration Closed</option>
            </select>

            <select
              value={selectedAttendance}
              onChange={(e) => setSelectedAttendance(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-500"
            >
              <option value="All">All Attendance</option>

              <option value="Attended">Attended</option>

              <option value="Not Attended">Not Attended</option>
            </select>
          </div>
        </div>

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <div className="mt-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Your Registered Events
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Showing{" "}
              <span className="font-bold text-violet-600">
                {filteredRegistrations.length}
              </span>{" "}
              of {registrations.length} registrations
            </p>
          </div>
        </div>

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {filteredRegistrations.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-50 text-violet-500">
              <CalendarDays size={36} />
            </div>

            <h3 className="mt-6 text-2xl font-black text-slate-900">
              No registrations found
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              You don't have any registered events matching your current search
              or filters.
            </p>

            <button
              onClick={() => navigate("/upComingEvents")}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-100 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Explore Upcoming Events
              <ArrowRight size={17} />
            </button>
          </div>
        ) : (
          /* ===================================================
             EVENT GRID
          =================================================== */

          <div className="mt-8 grid grid-cols-1 gap-7 md:grid-cols-2">
            {filteredRegistrations.map((registration) => {
              const event = getEvent(registration);

              const bannerUrl = getImageUrl(event?.bannerImage);

              const speakerImage = getImageUrl(event?.speakerImage);

              const eventStart = getEventStart(event);

              const eventEnd = getEventEnd(event);

              const eventStatus = getCalculatedEventStatus(event);

              const eventLive = isLive(event);

              const eventCompleted = isEnded(event);

              const joinAvailable = canJoinEvent(registration);

              return (
                <article
                  key={registration._id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                >
                  {/* =================================================
                        BANNER
                    ================================================= */}

                  <div className="relative h-64 overflow-hidden">
                    {bannerUrl ? (
                      <img
                        src={bannerUrl}
                        alt={event.title || "Registered event"}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-700">
                        <CalendarDays size={70} className="text-white/30" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* TOP BADGES */}

                    <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-3">
                      <span
                        className={`rounded-full border px-3.5 py-1.5 text-xs font-bold shadow-lg backdrop-blur-md ${getStatusStyle(
                          eventStatus
                        )}`}
                      >
                        {eventStatus}
                      </span>

                      <span
                        className={`rounded-full border px-3.5 py-1.5 text-xs font-bold shadow-lg ${getRegistrationStatusStyle(
                          registration.status
                        )}`}
                      >
                        {registration.status || "Registered"}
                      </span>
                    </div>

                    {/* LIVE INDICATOR */}

                    {eventLive && (
                      <div className="absolute left-5 top-16 flex items-center gap-2 rounded-full bg-teal-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                        LIVE NOW
                      </div>
                    )}

                    {/* TITLE */}

                    <div className="absolute bottom-5 left-5 right-5">
                      <h3 className="line-clamp-2 text-xl font-black leading-tight text-white sm:text-2xl">
                        {event.title || "Event Title Unavailable"}
                      </h3>
                    </div>
                  </div>

                  {/* =================================================
                        CONTENT
                    ================================================= */}

                  <div className="p-5 sm:p-6">
                    {/* DESCRIPTION */}

                    <p className="line-clamp-2 text-sm leading-6 text-slate-500">
                      {event.description || "No event description available."}
                    </p>

                    {/* EVENT META */}

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {/* DATE */}

                      <div className="flex items-center gap-3 rounded-2xl bg-violet-50/70 p-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                          <CalendarDays size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Date
                          </p>

                          <p className="mt-1 truncate text-sm font-bold text-slate-800">
                            {formatDate(eventStart)}
                          </p>
                        </div>
                      </div>

                      {/* TIME */}

                      <div className="flex items-center gap-3 rounded-2xl bg-fuchsia-50/70 p-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fuchsia-100 text-fuchsia-600">
                          <Clock3 size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Time
                          </p>

                          <p className="mt-1 truncate text-sm font-bold text-slate-800">
                            {formatTime(eventStart)}

                            {eventEnd && ` - ${formatTime(eventEnd)}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* SPEAKER */}

                    <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                      {speakerImage ? (
                        <img
                          src={speakerImage}
                          alt={event.speaker || "Speaker"}
                          className="h-11 w-11 rounded-full object-cover ring-2 ring-violet-50"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                          <UserRound size={20} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                          Speaker
                        </p>

                        <p className="truncate text-sm font-bold text-slate-800">
                          {event.speaker || "Speaker not specified"}
                        </p>

                        {(event.speakerRole || event.speakerCompany) && (
                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {event.speakerRole}

                            {event.speakerRole && event.speakerCompany && " • "}

                            {event.speakerCompany}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* REGISTRATION INFO */}

                    <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Registered On
                          </p>

                          <p className="mt-1 text-xs font-bold text-slate-700">
                            {formatDateTime(registration.registeredAt)}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Attendance
                          </p>

                          <span
                            className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${getAttendanceStyle(
                              registration.attended
                            )}`}
                          >
                            {registration.attended ? (
                              <>
                                <CheckCircle2 size={12} />
                                Attended
                              </>
                            ) : (
                              <>
                                <Clock size={12} />
                                Not Attended
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                          ACTIONS
                      ================================================= */}

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      {/* VIEW */}

                      <button
                        onClick={() => handleViewEvent(registration)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
                      >
                        <ExternalLink size={17} />
                        View Event
                      </button>

                      {/* JOIN */}

                      {joinAvailable && (
                        <button
                          onClick={() => handleJoinEvent(registration)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-teal-100 transition hover:-translate-y-0.5 hover:shadow-xl"
                        >
                          <Video size={17} />

                          {eventLive ? "Join Live Event" : "Join Event"}
                        </button>
                      )}
                    </div>

                    {/* =================================================
                          EVENT ENDED
                      ================================================= */}

                    {eventCompleted && registration.status !== "Cancelled" && (
                      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                          <CheckCircle2 size={17} />
                        </div>

                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            Event completed
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-500">
                            Thank you for participating in this event.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* =================================================
                          CANCELLED
                      ================================================= */}

                    {(registration.status === "Cancelled" ||
                      event.status === "Cancelled") && (
                      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                          <XCircle size={17} />
                        </div>

                        <div>
                          <p className="text-xs font-bold text-rose-700">
                            Registration Cancelled
                          </p>

                          <p className="mt-0.5 text-[11px] text-rose-600">
                            This registration is no longer active.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* =================================================
                          JOINING SOON
                      ================================================= */}

                    {!eventCompleted &&
                      !eventLive &&
                      registration.status !== "Cancelled" &&
                      !joinAvailable && (
                        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50 p-3.5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                            <CircleAlert size={17} />
                          </div>

                          <div>
                            <p className="text-xs font-bold text-violet-700">
                              Event starts soon
                            </p>

                            <p className="mt-0.5 text-[11px] text-violet-600">
                              The meeting will be available 10 minutes before
                              the event.
                            </p>
                          </div>
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
