import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CalendarDays,
  Clock3,
  UserRound,
  ArrowRight,
  ArrowLeft,
  Users,
  Bell,
  Search,
  X,
  CalendarCheck2,
  CheckCircle2,
  Loader2,
  Briefcase,
  Building2,
  Image as ImageIcon,
  Radio,
  CircleCheck,
  Ban,
  Sparkles,
  Video,
  GraduationCap,
  Lightbulb,
  Award,
  MessageCircle,
  BookOpen,
  Target,
  ChevronRight,
} from "lucide-react";

import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const UpcomingEvents = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();

  // =====================================================
  // HORIZONTAL EVENT SCROLL REF
  // =====================================================

  const eventScrollRef = useRef(null);

  // =====================================================
  // STATE
  // =====================================================

  const [events, setEvents] = useState([]);

  const [filteredEvents, setFilteredEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [registrationLoadingId, setRegistrationLoadingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

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

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://") ||
      imagePath.startsWith("blob:")
    ) {
      return imagePath;
    }

    const cleanPath = imagePath.replace(/^\/+/, "");

    const cleanBaseUrl = API_BASE_URL?.replace(/\/+$/, "");

    if (!cleanBaseUrl) {
      return `/${cleanPath}`;
    }

    return `${cleanBaseUrl}/${cleanPath}`;
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Upcoming":
        return {
          container: "bg-indigo-50 text-indigo-700 border border-indigo-200",
          dot: "bg-indigo-500",
          icon: <CalendarDays size={14} />,
        };

      case "Live":
        return {
          container: "bg-emerald-50 text-emerald-700 border border-emerald-200",
          dot: "bg-emerald-500 animate-pulse",
          icon: <Radio size={14} />,
        };

      case "Registration Closed":
        return {
          container: "bg-orange-50 text-orange-700 border border-orange-200",
          dot: "bg-orange-500",
          icon: <Ban size={14} />,
        };

      case "Completed":
        return {
          container: "bg-gray-100 text-gray-600 border border-gray-200",
          dot: "bg-gray-500",
          icon: <CircleCheck size={14} />,
        };

      case "Cancelled":
        return {
          container: "bg-red-50 text-red-700 border border-red-200",
          dot: "bg-red-500",
          icon: <X size={14} />,
        };

      default:
        return {
          container: "bg-gray-50 text-gray-600 border border-gray-200",
          dot: "bg-gray-400",
          icon: <CalendarDays size={14} />,
        };
    }
  };

  // =====================================================
  // FETCH EVENTS
  // =====================================================

  const fetchUpcomingEvents = async () => {
    try {
      const token = getUserToken();

      if (!token) {
        setEvents([]);
        setFilteredEvents([]);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/events/upcomingEvents`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Events Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch events");
      }

      const eventData = data.events || [];

      setEvents(eventData);

      setFilteredEvents(eventData);
    } catch (error) {
      console.error("Error fetching events:", error);

      throw error;
    }
  };

  // =====================================================
  // LOAD EVENTS
  // =====================================================

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);

        await fetchUpcomingEvents();
      } catch (error) {
        toast.error(error.message || "Unable to load events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  useEffect(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter((event) => {
      const title = event.title?.toLowerCase() || "";

      const description = event.description?.toLowerCase() || "";

      const speaker =
        typeof event.speaker === "string" ? event.speaker.toLowerCase() : "";

      const company = event.speakerCompany?.toLowerCase() || "";

      const status = event.status?.toLowerCase() || "";

      return (
        title.includes(search) ||
        description.includes(search) ||
        speaker.includes(search) ||
        company.includes(search) ||
        status.includes(search)
      );
    });

    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  // =====================================================
  // SCROLL EVENTS LEFT
  // =====================================================

  const scrollEventsLeft = () => {
    if (!eventScrollRef.current) {
      return;
    }

    eventScrollRef.current.scrollBy({
      left: -420,
      behavior: "smooth",
    });
  };

  // =====================================================
  // SCROLL EVENTS RIGHT
  // =====================================================

  const scrollEventsRight = () => {
    if (!eventScrollRef.current) {
      return;
    }

    eventScrollRef.current.scrollBy({
      left: 420,
      behavior: "smooth",
    });
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Date not available";
    }

    const parsedDate = new Date(dateValue);

    if (isNaN(parsedDate.getTime())) {
      return "Date not available";
    }

    return parsedDate.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // SHORT DATE
  // =====================================================

  const formatShortDate = (dateValue) => {
    if (!dateValue) {
      return {
        month: "EVENT",
        day: "--",
      };
    }

    const parsedDate = new Date(dateValue);

    if (isNaN(parsedDate.getTime())) {
      return {
        month: "EVENT",
        day: "--",
      };
    }

    return {
      month: parsedDate.toLocaleDateString("en-US", {
        month: "short",
      }),

      day: parsedDate.getDate(),
    };
  };

  // =====================================================
  // FORMAT TIME RANGE
  // =====================================================

  const formatEventTimeRange = (startDateTime, endDateTime) => {
    if (!startDateTime || !endDateTime) {
      return "Time not available";
    }

    const startDate = new Date(startDateTime);

    const endDate = new Date(endDateTime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return "Time not available";
    }

    const startTime = startDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const endTime = endDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${startTime} - ${endTime}`;
  };

  // =====================================================
  // FORMAT DEADLINE
  // =====================================================

  const formatDeadline = (dateValue) => {
    if (!dateValue) {
      return "Not available";
    }

    const parsedDate = new Date(dateValue);

    if (isNaN(parsedDate.getTime())) {
      return "Not available";
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
  // CHECK REGISTRATION CLOSED
  // =====================================================

  const isRegistrationClosed = (deadline) => {
    if (!deadline) {
      return false;
    }

    const deadlineDate = new Date(deadline);

    if (isNaN(deadlineDate.getTime())) {
      return false;
    }

    return deadlineDate.getTime() <= new Date().getTime();
  };

  // =====================================================
  // DAYS LEFT
  // =====================================================

  const getDaysLeft = (dateValue) => {
    if (!dateValue) {
      return null;
    }

    const eventDate = new Date(dateValue);

    if (isNaN(eventDate.getTime())) {
      return null;
    }

    const currentDate = new Date();

    const difference = eventDate.getTime() - currentDate.getTime();

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  };

  // =====================================================
  // REGISTER EVENT
  // =====================================================

  const handleRegister = async (eventId) => {
    try {
      const token = getUserToken();

      if (!token) {
        toast.error("Please login to register for an event");

        navigate("/login");

        return;
      }

      const selectedEvent = events.find(
        (event) => event._id?.toString() === eventId?.toString()
      );

      if (!selectedEvent) {
        toast.error("Event not found");

        return;
      }

      if (selectedEvent.isRegistered) {
        toast.info("You are already registered for this event");

        return;
      }

      if (selectedEvent.status !== "Upcoming") {
        toast.error(
          `Registration is not available. Event is ${selectedEvent.status}.`
        );

        return;
      }

      if (
        selectedEvent.registrationDeadline &&
        isRegistrationClosed(selectedEvent.registrationDeadline)
      ) {
        toast.error("Registration deadline has passed");

        return;
      }

      setRegistrationLoadingId(eventId);

      const response = await fetch(
        `${API_BASE_URL}/api/event-registration/register/${eventId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Registration Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to register for event");
      }

      setEvents((prevEvents) =>
        prevEvents.map((event) => {
          if (event._id?.toString() === eventId?.toString()) {
            return {
              ...event,

              isRegistered: true,

              registeredCount: (event.registeredCount || 0) + 1,
            };
          }

          return event;
        })
      );

      toast.success(data.message || "Successfully registered for the event");
    } catch (error) {
      console.error("Register Event Error:", error);

      if (error.message?.toLowerCase().includes("already registered")) {
        setEvents((prevEvents) =>
          prevEvents.map((event) => {
            if (event._id?.toString() === eventId?.toString()) {
              return {
                ...event,

                isRegistered: true,
              };
            }

            return event;
          })
        );

        toast.info("You are already registered for this event");

        return;
      }

      toast.error(error.message || "Failed to register for event");
    } finally {
      setRegistrationLoadingId(null);
    }
  };

  // =====================================================
  // VIEW EVENT
  // =====================================================

  const handleViewEvent = (eventId) => {
    navigate(`/upComingEvents/${eventId}`);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex min-h-screen flex-col items-center justify-center bg-white px-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-blue-100" />

          <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
        </div>

        <p className="mt-6 text-center text-lg font-semibold text-gray-700">
          Loading your Event's data...
        </p>

        <p className="mt-1 text-center text-sm text-gray-400">
          Please wait while we fetch the Upcoming Event's data.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
              <CalendarCheck2 size={30} />
            </div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-100">
              GuideX Events
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Upcoming Events & Webinars
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
              Join live webinars, expert sessions, workshops, and learning
              events hosted by industry professionals and experienced mentors.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          SEARCH SECTION
      ====================================================== */}

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="relative max-w-xl">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search events, speakers, companies, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-11 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN EVENTS SECTION
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* HEADER */}

        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays size={22} className="text-indigo-600" />

              <h2 className="text-2xl font-bold text-gray-900">Events</h2>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Discover upcoming events, live sessions, workshops, and learning
              opportunities.
            </p>
          </div>

          {/* SCROLL BUTTONS */}

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-600">
              <CalendarCheck2 size={17} />
              {filteredEvents.length}{" "}
              {filteredEvents.length === 1 ? "Event" : "Events"}
            </div>

            <button
              type="button"
              onClick={scrollEventsLeft}
              disabled={filteredEvents.length === 0}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={18} />
            </button>

            <button
              type="button"
              onClick={scrollEventsRight}
              disabled={filteredEvents.length === 0}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* =====================================================
            LOADING
        ====================================================== */}

        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="w-[350px] shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="h-52 animate-pulse bg-gray-200" />

                <div className="space-y-4 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />

                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />

                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />

                  <div className="h-12 w-full animate-pulse rounded-xl bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
              <CalendarDays size={32} />
            </div>

            <h3 className="text-xl font-bold text-gray-900">No Events Found</h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              {searchTerm
                ? "We couldn't find any events matching your search."
                : "There are no events available right now."}
            </p>

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                View All Events
              </button>
            )}
          </div>
        ) : (
          /* =====================================================
              HORIZONTAL EVENT CARDS
          ====================================================== */

          <div
            ref={eventScrollRef}
            className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {filteredEvents.map((event) => {
              const startDateTime = event.startDateTime;

              const endDateTime = event.endDateTime;

              const bannerUrl = getImageUrl(event.bannerImage);

              const speakerUrl = getImageUrl(event.speakerImage);

              const daysLeft = getDaysLeft(startDateTime);

              const registrationClosed = isRegistrationClosed(
                event.registrationDeadline
              );

              const alreadyRegistered = event.isRegistered === true;

              const shortDate = formatShortDate(startDateTime);

              const statusStyle = getStatusStyle(event.status);

              const isCurrentEventLoading = registrationLoadingId === event._id;

              const canRegister =
                event.status === "Upcoming" &&
                !registrationClosed &&
                !alreadyRegistered;

              return (
                <div
                  key={event._id}
                  className="group w-[340px] shrink-0 snap-start overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-xl sm:w-[390px]"
                >
                  {/* BANNER */}

                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500">
                    {bannerUrl ? (
                      <img
                        src={bannerUrl}
                        alt={event.title || "Event Banner"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon size={45} className="text-white/50" />
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* DATE */}

                    <div className="absolute left-4 top-4 flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-white shadow-lg">
                      <span className="text-xs font-bold uppercase text-indigo-600">
                        {shortDate.month}
                      </span>

                      <span className="text-2xl font-bold text-gray-900">
                        {shortDate.day}
                      </span>
                    </div>

                    {/* DAYS LEFT */}

                    {event.status === "Upcoming" &&
                      daysLeft !== null &&
                      daysLeft >= 0 && (
                        <div className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                          {daysLeft === 0
                            ? "Today"
                            : daysLeft === 1
                            ? "Tomorrow"
                            : `${daysLeft} days left`}
                        </div>
                      )}

                    {/* STATUS */}

                    <div className="absolute bottom-4 left-4">
                      <div
                        className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold shadow-lg backdrop-blur-sm ${statusStyle.container}`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${statusStyle.dot}`}
                        />

                        {statusStyle.icon}

                        <span>{event.status || "Unknown Status"}</span>
                      </div>
                    </div>
                  </div>

                  {/* CONTENT */}

                  <div className="p-5">
                    <h3 className="line-clamp-2 text-lg font-bold leading-7 text-gray-900 transition group-hover:text-indigo-600">
                      {event.title || "Untitled Event"}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
                      {event.description ||
                        "No description available for this event."}
                    </p>

                    {/* SPEAKER */}

                    <div className="mt-5 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                      {speakerUrl ? (
                        <img
                          src={speakerUrl}
                          alt={event.speaker || "Speaker"}
                          className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                          <UserRound size={22} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Speaker
                        </p>

                        <p className="truncate text-sm font-bold text-gray-900">
                          {event.speaker || "Guest Speaker"}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          {event.speakerRole && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Briefcase size={12} />

                              {event.speakerRole}
                            </span>
                          )}

                          {event.speakerCompany && (
                            <span className="flex items-center gap-1 text-xs font-medium text-indigo-600">
                              <Building2 size={12} />

                              {event.speakerCompany}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* DATE TIME */}

                    <div className="mt-5 grid grid-cols-1 gap-3">
                      <div className="rounded-xl bg-indigo-50 p-4">
                        <div className="flex items-start gap-3">
                          <CalendarDays
                            size={19}
                            className="mt-0.5 shrink-0 text-indigo-600"
                          />

                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                              Event Date
                            </p>

                            <p className="mt-1 text-sm font-bold text-gray-800">
                              {formatDate(startDateTime)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl bg-blue-50 p-4">
                        <div className="flex items-start gap-3">
                          <Clock3
                            size={19}
                            className="mt-0.5 shrink-0 text-blue-600"
                          />

                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                              Event Time
                            </p>

                            <p className="mt-1 text-sm font-bold text-gray-800">
                              {formatEventTimeRange(startDateTime, endDateTime)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DEADLINE */}

                    {event.registrationDeadline && (
                      <div className="mt-3 flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <Bell
                          size={18}
                          className={`mt-0.5 shrink-0 ${
                            registrationClosed || event.status !== "Upcoming"
                              ? "text-orange-500"
                              : "text-emerald-600"
                          }`}
                        />

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Registration Deadline
                          </p>

                          <p className="mt-1 text-xs font-semibold text-gray-700">
                            {formatDeadline(event.registrationDeadline)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* REGISTERED COUNT */}

                    <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3">
                      {alreadyRegistered ? (
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
                          <CheckCircle2 size={15} />
                          Registered
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Users size={15} />

                          <span>{event.registeredCount || 0} registered</span>
                        </div>
                      )}

                      <span className="text-xs font-medium text-gray-400">
                        GuideX Events
                      </span>
                    </div>

                    {/* VIEW EVENT */}

                    <button
                      type="button"
                      onClick={() => handleViewEvent(event._id)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.98]"
                    >
                      View Event
                      <ArrowRight size={16} />
                    </button>

                    {/* REGISTER */}

                    {canRegister && (
                      <button
                        type="button"
                        onClick={() => handleRegister(event._id)}
                        disabled={registrationLoadingId !== null}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isCurrentEventLoading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Registering...
                          </>
                        ) : (
                          <>
                            <CalendarCheck2 size={16} />
                            Register for Event
                          </>
                        )}
                      </button>
                    )}

                    {/* ALREADY REGISTERED */}

                    {alreadyRegistered && (
                      <div className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600">
                        <CheckCircle2 size={16} />
                        You are registered
                      </div>
                    )}

                    {/* NON UPCOMING */}

                    {!alreadyRegistered && event.status !== "Upcoming" && (
                      <button
                        type="button"
                        disabled
                        className={`mt-3 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${statusStyle.container}`}
                      >
                        {statusStyle.icon}

                        {event.status || "Event Unavailable"}
                      </button>
                    )}

                    {/* REGISTRATION CLOSED */}

                    {!alreadyRegistered &&
                      event.status === "Upcoming" &&
                      registrationClosed && (
                        <button
                          type="button"
                          disabled
                          className="mt-3 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-600"
                        >
                          <Ban size={16} />
                          Registration Closed
                        </button>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =====================================================
            SCROLL HINT
        ====================================================== */}

        {!loading && filteredEvents.length > 0 && (
          <div className="mt-2 flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
            <ArrowLeft size={14} />

            <span>Scroll horizontally to explore more events</span>

            <ArrowRight size={14} />
          </div>
        )}
      </main>

      {/* =====================================================
          WHY JOIN GUIDEX EVENTS
      ====================================================== */}

      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Sparkles size={24} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Learn Beyond the Classroom
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-500 sm:text-base">
              GuideX events help you connect with experienced professionals,
              gain practical knowledge, and discover new opportunities for your
              career.
            </p>
          </div>

          {/* BENEFIT CARDS */}

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Video size={22} />
              </div>

              <h3 className="mt-5 font-bold text-gray-900">
                Live Expert Sessions
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Learn directly from industry experts through live webinars,
                workshops, and interactive sessions.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <GraduationCap size={22} />
              </div>

              <h3 className="mt-5 font-bold text-gray-900">Career Learning</h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Understand real-world career paths, industry expectations, and
                the skills employers value.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <MessageCircle size={22} />
              </div>

              <h3 className="mt-5 font-bold text-gray-900">Ask & Connect</h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Participate in discussions, ask questions, and gain valuable
                insights from experienced speakers.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <Award size={22} />
              </div>

              <h3 className="mt-5 font-bold text-gray-900">Grow Your Career</h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Build confidence, improve your skills, and stay updated with the
                latest trends in your field.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
              Simple Process
            </p>

            <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              How to Join a GuideX Event
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              Find an event that interests you and start learning in just a few
              simple steps.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* STEP 1 */}

            <div className="relative rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
                01
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                Explore Events
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Browse upcoming webinars, workshops, and expert sessions to find
                the right opportunity for you.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-indigo-600">
                <BookOpen size={16} />
                Discover & Learn
              </div>
            </div>

            {/* STEP 2 */}

            <div className="relative rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
                02
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">Register</h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Check the event details and register before the registration
                deadline to reserve your spot.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
                <CalendarCheck2 size={16} />
                Reserve Your Spot
              </div>
            </div>

            {/* STEP 3 */}

            <div className="relative rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white">
                03
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                Attend & Grow
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Join the session, interact with the speaker, ask questions, and
                take your next step toward your career goals.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-emerald-600">
                <Target size={16} />
                Build Your Future
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
            <Lightbulb size={28} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
            Your Next Learning Opportunity Is Waiting
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
            Stay connected with GuideX events and discover valuable sessions
            that can help you learn, connect, and grow professionally.
          </p>

          <button
            type="button"
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
          >
            Explore Events
            <ChevronRight size={17} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default UpcomingEvents;
