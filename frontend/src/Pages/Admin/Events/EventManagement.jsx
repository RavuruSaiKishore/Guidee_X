import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Edit3,
  Trash2,
  CalendarDays,
  Clock3,
  UserRound,
  CheckCircle2,
  CalendarCheck2,
  Image as ImageIcon,
  Building2,
  Briefcase,
  Users,
  ArrowRight,
} from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EventManagement = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [deleting, setDeleting] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [eventToDelete, setEventToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("All");

  // =====================================================
  // TOKEN
  // =====================================================

  const getAdminToken = () => {
    return localStorage.getItem("AdminToken");
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
      imagePath.startsWith("https://")
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
  // FETCH EVENTS
  // =====================================================

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const token = getAdminToken();

      const response = await fetch(`${API_BASE_URL}/api/events/all`, {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("EVENT API RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to load events");
      }

      setEvents(data.events || []);
    } catch (error) {
      console.error("Fetch Events Error:", error);

      toast.error(error.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD EVENTS
  // =====================================================

  useEffect(() => {
    fetchEvents();
  }, []);

  // =====================================================
  // CREATE EVENT
  // =====================================================

  const handleCreateEvent = () => {
    navigate("/admin/Events/create");
  };

  // =====================================================
  // EVENT CARD CLICK
  // =====================================================

  const handleEventClick = (event) => {
    navigate(`/admin/Events/details/${event._id}`);
  };

  // =====================================================
  // EDIT EVENT
  // =====================================================

  const handleEditEvent = (event) => {
    navigate(`/admin/Events/edit/${event._id}`);
  };

  // =====================================================
  // DELETE CLICK
  // =====================================================

  const handleDeleteClick = (event) => {
    setEventToDelete(event);

    setShowDeleteModal(true);
  };

  // =====================================================
  // DELETE EVENT
  // =====================================================

  const handleDeleteEvent = async () => {
    if (!eventToDelete) {
      return;
    }

    try {
      setDeleting(true);

      const token = getAdminToken();

      const response = await fetch(
        `${API_BASE_URL}/api/events/delete/${eventToDelete._id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete event");
      }

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventToDelete._id)
      );

      toast.success("Event deleted successfully");

      setShowDeleteModal(false);

      setEventToDelete(null);
    } catch (error) {
      console.error("Delete Event Error:", error);

      toast.error(error.message || "Failed to delete event");
    } finally {
      setDeleting(false);
    }
  };

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
  // FORMAT TIME RANGE
  // =====================================================

  const formatTimeRange = (startDate, endDate) => {
    if (!startDate || !endDate) {
      return "N/A";
    }

    const start = new Date(startDate);

    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "N/A";
    }

    return `${start.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })} - ${end.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-50 text-blue-600 border-blue-100";

      case "Registration Closed":
        return "bg-orange-50 text-orange-600 border-orange-100";

      case "Live":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";

      case "Completed":
        return "bg-gray-100 text-gray-600 border-gray-200";

      case "Cancelled":
        return "bg-red-50 text-red-600 border-red-100";

      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  // =====================================================
  // FILTER EVENTS
  // =====================================================

  const filteredEvents = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        !search ||
        event.title?.toLowerCase().includes(search) ||
        event.description?.toLowerCase().includes(search) ||
        event.speaker?.toLowerCase().includes(search) ||
        event.speakerCompany?.toLowerCase().includes(search) ||
        event.speakerRole?.toLowerCase().includes(search);

      const matchesStatus =
        selectedStatus === "All" || event.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [events, searchTerm, selectedStatus]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const upcomingCount = events.filter(
    (event) => event.status === "Upcoming"
  ).length;

  const liveCount = events.filter(
    (event) => event.status === "Live"
  ).length;

  const completedCount = events.filter(
    (event) => event.status === "Completed"
  ).length;

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
      />

      <div className="mx-auto max-w-[1400px] p-4 sm:p-6 lg:p-8">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <CalendarDays size={17} />

              <span>Events</span>

              <span className="text-gray-300">/</span>

              <span className="text-gray-500">
                Event Management
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Events & Webinars
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Create and manage webinars, workshops, mentoring sessions,
              and other events for GuideX students.
            </p>
          </div>

          <button
            onClick={handleCreateEvent}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 sm:w-auto"
          >
            <span className="text-lg leading-none">+</span>

            Create Event
          </button>
        </div>

        {/* =====================================================
            STATS
        ====================================================== */}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* TOTAL */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Events
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {events.length}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <CalendarDays size={22} />
              </div>
            </div>
          </div>

          {/* UPCOMING */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Upcoming
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {upcomingCount}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CalendarCheck2 size={22} />
              </div>
            </div>
          </div>

          {/* LIVE */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Live Now
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {liveCount}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CalendarDays size={22} />
              </div>
            </div>
          </div>

          {/* COMPLETED */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Completed
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {completedCount}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            SEARCH
        ====================================================== */}

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search events, speakers, companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            >
              <option value="All">
                All Status
              </option>

              <option value="Upcoming">
                Upcoming
              </option>

              <option value="Registration Closed">
                Registration Closed
              </option>

              <option value="Live">
                Live
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>
        </div>

        {/* =====================================================
            EVENTS HORIZONTAL SCROLL
        ====================================================== */}

        {loading ? (
          <div className="flex gap-5 overflow-hidden">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[650px] min-w-[420px] animate-pulse rounded-2xl border border-gray-200 bg-white"
              />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-20 text-center">
            <CalendarDays
              size={40}
              className="mx-auto mb-4 text-gray-300"
            />

            <h3 className="text-lg font-bold text-gray-900">
              No events found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Create your first event or adjust your search filters.
            </p>

            <button
              onClick={handleCreateEvent}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Create Your First Event
            </button>
          </div>
        ) : (

          /*
           * IMPORTANT:
           * Cards are now horizontally scrollable.
           *
           * The card itself is clickable.
           */

          <div className="relative">

            <div
              className="
                flex
                gap-5
                overflow-x-auto
                pb-6
                snap-x
                snap-mandatory
                scrollbar-thin
                scrollbar-thumb-gray-300
                scrollbar-track-gray-100
              "
            >
              {filteredEvents.map((event) => {
                const bannerUrl = getImageUrl(
                  event.bannerImage
                );

                const speakerUrl = getImageUrl(
                  event.speakerImage
                );

                return (
                  <div
                    key={event._id}
                    onClick={() => handleEventClick(event)}
                    className="
                      group
                      w-[90vw]
                      min-w-[90vw]
                      snap-start
                      cursor-pointer
                      overflow-hidden
                      rounded-2xl
                      border
                      border-gray-200
                      bg-white
                      shadow-sm
                      transition
                      hover:-translate-y-1
                      hover:border-indigo-200
                      hover:shadow-xl
                      sm:w-[520px]
                      sm:min-w-[520px]
                      lg:w-[580px]
                      lg:min-w-[580px]
                    "
                  >

                    {/* =====================================================
                        BANNER
                    ====================================================== */}

                    <div className="relative h-52 overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600">

                      {bannerUrl ? (
                        <img
                          src={bannerUrl}
                          alt={event.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon
                            size={48}
                            className="text-white/50"
                          />
                        </div>
                      )}

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                      {/* STATUS */}

                      <div className="absolute left-5 top-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            event.status
                          )}`}
                        >
                          {event.status}
                        </span>
                      </div>

                      {/* ACTION BUTTONS */}

                      <div className="absolute right-5 top-5 flex gap-2">

                        {/* EDIT */}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            handleEditEvent(event);
                          }}
                          title="Edit Event"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm transition hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <Edit3 size={16} />
                        </button>

                        {/* DELETE */}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            handleDeleteClick(event);
                          }}
                          title="Delete Event"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* TITLE */}

                      <div className="absolute bottom-5 left-5 right-5">
                        <h3 className="text-xl font-bold text-white">
                          {event.title}
                        </h3>
                      </div>
                    </div>

                    {/* =====================================================
                        BODY
                    ====================================================== */}

                    <div className="p-6">

                      <p className="line-clamp-3 text-sm leading-6 text-gray-600">
                        {event.description}
                      </p>

                      {/* DETAILS */}

                      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

                        {/* DATE */}

                        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                          <CalendarDays
                            size={18}
                            className="text-indigo-600"
                          />

                          <div>
                            <p className="text-xs text-gray-400">
                              Event Date
                            </p>

                            <p className="text-sm font-semibold text-gray-700">
                              {formatDate(
                                event.startDateTime
                              )}
                            </p>
                          </div>
                        </div>

                        {/* TIME */}

                        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                          <Clock3
                            size={18}
                            className="text-blue-600"
                          />

                          <div>
                            <p className="text-xs text-gray-400">
                              Time
                            </p>

                            <p className="text-sm font-semibold text-gray-700">
                              {formatTimeRange(
                                event.startDateTime,
                                event.endDateTime
                              )}
                            </p>
                          </div>
                        </div>

                        {/* SPEAKER */}

                        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                          <UserRound
                            size={18}
                            className="text-orange-600"
                          />

                          <div>
                            <p className="text-xs text-gray-400">
                              Speaker
                            </p>

                            <p className="text-sm font-semibold text-gray-700">
                              {event.speaker}
                            </p>
                          </div>
                        </div>

                        {/* REGISTRATION DEADLINE */}

                        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                          <CalendarCheck2
                            size={18}
                            className="text-emerald-600"
                          />

                          <div>
                            <p className="text-xs text-gray-400">
                              Registration Deadline
                            </p>

                            <p className="text-sm font-semibold text-gray-700">
                              {formatDate(
                                event.registrationDeadline
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* SPEAKER */}

                      <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <div className="flex items-start gap-4">

                          {speakerUrl ? (
                            <img
                              src={speakerUrl}
                              alt={event.speaker}
                              className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-white"
                            />
                          ) : (
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                              <UserRound size={24} />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Speaker
                            </p>

                            <h4 className="mt-1 font-bold text-gray-900">
                              {event.speaker}
                            </h4>

                            {event.speakerRole && (
                              <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                                <Briefcase size={13} />

                                {event.speakerRole}
                              </p>
                            )}

                            {event.speakerCompany && (
                              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-indigo-600">
                                <Building2 size={13} />

                                {event.speakerCompany}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* VIEW DETAILS */}

                      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                          <Users size={17} />

                          View registrations and event details
                        </div>

                        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 transition group-hover:gap-3">
                          View Details

                          <ArrowRight size={17} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SCROLL HINT */}

            {filteredEvents.length > 1 && (
              <div className="mt-1 flex items-center justify-center gap-2 text-xs text-gray-400">
                <span>Scroll horizontally to view more events</span>
                <ArrowRight size={14} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          DELETE MODAL
      ====================================================== */}

      {showDeleteModal && eventToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 size={22} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              Delete Event?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-700">
                "{eventToDelete.title}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setEventToDelete(null);
                }}
                disabled={deleting}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteEvent}
                disabled={deleting}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={16} />

                {deleting
                  ? "Deleting..."
                  : "Delete Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;