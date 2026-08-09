import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CalendarDays,
  Clock3,
  UserRound,
  X,
  CalendarCheck2,
  CheckCircle2,
  ImageIcon,
  Radio,
  CircleCheck,
  Ban,
  Sparkles,
  Video,
  GraduationCap,
  Award,
  MessageCircle,
  Lightbulb,
  ChevronRight,
  Bell,
  Users,
  Search,
} from "lucide-react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpcomingEvents = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
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
  // STATUS STYLE MAPPER
  // =====================================================
  const getStatusStyle = (status) => {
    switch (status) {
      case "Upcoming":
        return {
          container: "bg-indigo-50 text-indigo-700 border border-indigo-200",
          dot: "bg-indigo-500",
          icon: <CalendarDays size={14} />,
        };

      case "Live Now":
      case "Live":
        return {
          container: "bg-emerald-50 text-emerald-700 border border-emerald-200",
          dot: "bg-emerald-500 animate-pulse",
          icon: <Radio size={14} />,
        };

      case "Registration Closed":
      case "Housefull":
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
  // SEARCH FILTERING
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
      const domain = event.domain?.toLowerCase() || "";
      const status = (event.displayStatus || event.status)?.toLowerCase() || "";

      const matchesSpeaker = event.speakers?.some(
        (spk) =>
          spk.name?.toLowerCase().includes(search) ||
          spk.organization?.toLowerCase().includes(search)
      );

      return (
        title.includes(search) ||
        description.includes(search) ||
        domain.includes(search) ||
        status.includes(search) ||
        matchesSpeaker
      );
    });

    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  // =====================================================
  // FORMAT DATE & TIME HELPERS
  // =====================================================
  const formatDate = (dateValue) => {
    if (!dateValue) return "Date not available";
    const parsedDate = new Date(dateValue);
    if (isNaN(parsedDate.getTime())) return "Date not available";

    return parsedDate.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatEventTimeRange = (startDateTime, endDateTime) => {
    if (!startDateTime || !endDateTime) return "Time not available";
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

  const formatDeadline = (dateValue) => {
    if (!dateValue) return "Not available";
    const parsedDate = new Date(dateValue);
    if (isNaN(parsedDate.getTime())) return "Not available";

    return parsedDate.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getDaysLeft = (dateValue) => {
    if (!dateValue) return null;
    const eventDate = new Date(dateValue);
    if (isNaN(eventDate.getTime())) return null;

    const currentDate = new Date();
    const difference = eventDate.getTime() - currentDate.getTime();
    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  };

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
              placeholder="Search events, speakers, domains, or status..."
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
          MAIN EVENTS SECTION (FULL HORIZONTAL CARDS)
      ====================================================== */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
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

          <div className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-600">
            <CalendarCheck2 size={17} />
            {filteredEvents.length}{" "}
            {filteredEvents.length === 1
              ? "Event Available"
              : "Events Available"}
          </div>
        </div>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}
        {filteredEvents.length === 0 ? (
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
              HORIZONTAL EVENT LIST
          ====================================================== */
          <div className="space-y-6">
            {filteredEvents.map((event) => {
              const startDateTime = event.startDateTime;
              const endDateTime = event.endDateTime;
              const bannerUrl = getImageUrl(event.bannerImage);

              const primarySpeaker =
                event.speakers && event.speakers.length > 0
                  ? event.speakers[0]
                  : null;
              const speakerUrl = getImageUrl(primarySpeaker?.profileImage);

              const daysLeft = getDaysLeft(startDateTime);
              const alreadyRegistered = event.isRegistered === true;

              const displayStatus =
                event.displayStatus || event.status || "Upcoming";
              const statusStyle = getStatusStyle(displayStatus);

              return (
                <div
                  key={event._id}
                  className="group flex flex-col lg:flex-row overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:border-indigo-200 hover:shadow-xl"
                >
                  {/* LEFT SIDE: BANNER IMAGE */}
                  <div className="relative lg:w-[380px] h-60 lg:h-auto shrink-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 overflow-hidden">
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
                        <ImageIcon size={50} className="text-white/50" />
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/30" />

                    {/* STATUS BADGE OVERLAY */}
                    <div className="absolute top-4 left-4">
                      <div
                        className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold shadow-lg backdrop-blur-md ${statusStyle.container}`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${statusStyle.dot}`}
                        />
                        {statusStyle.icon}
                        <span>{displayStatus}</span>
                      </div>
                    </div>

                    {/* DAYS LEFT OVERLAY */}
                    {displayStatus === "Upcoming" &&
                      daysLeft !== null &&
                      daysLeft >= 0 && (
                        <div className="absolute top-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                          {daysLeft === 0
                            ? "Today"
                            : daysLeft === 1
                            ? "Tomorrow"
                            : `${daysLeft} days left`}
                        </div>
                      )}
                  </div>

                  {/* RIGHT SIDE: DETAILS & ACTIONS */}
                  <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                    <div>
                      {/* TOP METADATA */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-md bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
                          {event.eventType || "Guest Lecture"}
                        </span>
                        <span className="rounded-md bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                          {event.domain || "General"}
                        </span>
                        <span className="text-xs font-bold text-emerald-600">
                          {event.isPaid
                            ? `₹${event.ticketPrice}`
                            : "Free Entry"}
                        </span>
                      </div>

                      {/* TITLE */}
                      <h3 className="mt-3 text-xl font-bold tracking-tight text-gray-900 transition group-hover:text-indigo-600 sm:text-2xl">
                        {event.title || "Untitled Event"}
                      </h3>

                      {/* DESCRIPTION */}
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                        {event.shortSummary ||
                          event.description ||
                          "No description available for this event."}
                      </p>

                      {/* GRID INFO (Speaker, Time, Date) */}
                      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {/* Speaker Box */}
                        <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3.5">
                          {speakerUrl ? (
                            <img
                              src={speakerUrl}
                              alt={primarySpeaker?.name || "Speaker"}
                              className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-white"
                            />
                          ) : (
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                              <UserRound size={20} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              Speaker
                            </p>
                            <p className="truncate text-xs font-bold text-gray-900">
                              {primarySpeaker?.name || "Guest Speaker"}
                            </p>
                            {primarySpeaker?.organization && (
                              <p className="truncate text-[11px] font-semibold text-indigo-600">
                                {primarySpeaker.organization}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Date Box */}
                        <div className="flex items-center gap-3 rounded-2xl bg-indigo-50/60 p-3.5">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                            <CalendarDays size={20} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              Date
                            </p>
                            <p className="truncate text-xs font-bold text-gray-900">
                              {formatDate(startDateTime)}
                            </p>
                          </div>
                        </div>

                        {/* Time Box */}
                        <div className="flex items-center gap-3 rounded-2xl bg-blue-50/60 p-3.5">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <Clock3 size={20} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              Time Range
                            </p>
                            <p className="truncate text-xs font-bold text-gray-900">
                              {formatEventTimeRange(startDateTime, endDateTime)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* FOOTER ACTIONS & DEADLINE */}
                    <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Users size={15} className="text-gray-400" />
                          <span>
                            {event.registeredCount || 0} /{" "}
                            {event.maxSeats || 100} Registered
                          </span>
                        </div>

                        {event.registrationDeadline && (
                          <div className="flex items-center gap-1.5 font-medium">
                            <Bell size={15} className="text-amber-500" />
                            <span>
                              Deadline:{" "}
                              {formatDeadline(event.registrationDeadline)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* BUTTON GROUP */}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleViewEvent(event._id)}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-indigo-600"
                        >
                          View Details
                        </button>

                        {alreadyRegistered && (
                          <div className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-xs font-bold text-emerald-700">
                            <CheckCircle2 size={15} />
                            Registered
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* =====================================================
          WHY JOIN GUIDEX EVENTS
      ====================================================== */}
      <section className="border-t border-gray-200 bg-white mt-16">
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
              window.scrollTo({ top: 0, behavior: "smooth" });
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
