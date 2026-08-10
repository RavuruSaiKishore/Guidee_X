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
  Users,
  ArrowRight,
  Video,
  DollarSign,
  Layers,
  Sparkles,
  ShieldCheck,
  Receipt,
  IndianRupee,
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

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDomain, setSelectedDomain] = useState("All");

  const DOMAINS = [
    "All",
    "Software Engineering",
    "Data Science & AI",
    "Product Management",
    "UI/UX Design",
    "Cybersecurity",
    "DevOps & Cloud",
    "Career Guidance & Resume",
    "Study Abroad",
    "Research & Academia",
    "Other",
  ];

  const getAdminToken = () => localStorage.getItem("AdminToken");

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    const cleanPath = imagePath.replace(/^\/+/, "");
    const cleanBaseUrl = API_BASE_URL?.replace(/\/+$/, "");
    return cleanBaseUrl ? `${cleanBaseUrl}/${cleanPath}` : `/${cleanPath}`;
  };

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
      if (!response.ok) {
        throw new Error(data.message || "Failed to load events");
      }

      setEvents(data.events || data.data || []);
    } catch (error) {
      console.error("Fetch Events Error:", error);
      toast.error(error.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = () => navigate("/admin/Events/create");

  const handleEventClick = (event) => {
    navigate(`/admin/Events/details/${event._id}`);
  };

  const handleEditEvent = (event) => {
    navigate(`/admin/Events/edit/${event._id}`);
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;

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

      setEvents((prev) => prev.filter((ev) => ev._id !== eventToDelete._id));
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

  const formatDate = (date) => {
    if (!date) return "N/A";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "N/A";
    return parsed.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTimeRange = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return "N/A";

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

  const getStatusStyle = (status) => {
    switch (status) {
      case "Upcoming":
      case "Published":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Registration Closed":
      case "Housefull":
        return "bg-orange-50 text-orange-600 border-orange-100";
      case "Live":
      case "Live Now":
        return "bg-emerald-50 text-emerald-600 border-emerald-100 animate-pulse";
      case "Completed":
        return "bg-gray-100 text-gray-600 border-gray-200";
      case "Cancelled":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const filteredEvents = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSpeaker = event.speakers?.some(
        (spk) =>
          spk.name?.toLowerCase().includes(search) ||
          spk.organization?.toLowerCase().includes(search) ||
          spk.title?.toLowerCase().includes(search)
      );

      const matchesSearch =
        !search ||
        event.title?.toLowerCase().includes(search) ||
        event.description?.toLowerCase().includes(search) ||
        event.domain?.toLowerCase().includes(search) ||
        matchesSpeaker;

      const matchesStatus =
        selectedStatus === "All" ||
        event.status === selectedStatus ||
        event.computedStatus === selectedStatus;

      const matchesDomain =
        selectedDomain === "All" || event.domain === selectedDomain;

      return matchesSearch && matchesStatus && matchesDomain;
    });
  }, [events, searchTerm, selectedStatus, selectedDomain]);

  // Calculations for Stats Overview Cards
  const totalEventsCount = events.length;
  const upcomingCount = events.filter(
    (ev) => ev.status === "Published" || ev.computedStatus === "Upcoming"
  ).length;
  const liveCount = events.filter(
    (ev) => ev.computedStatus === "Live Now" || ev.status === "Live"
  ).length;
  const completedCount = events.filter(
    (ev) => ev.computedStatus === "Completed" || ev.status === "Completed"
  ).length;

  const totalGrossRevenueCollected = events.reduce(
    (sum, ev) => sum + (Number(ev.totalGrossRevenue) || 0),
    0
  );
  const totalPlatformFeesCollected = events.reduce(
    (sum, ev) => sum + (Number(ev.totalPlatformFees) || 0),
    0
  );
  const totalAdminCommissionsCollected = events.reduce(
    (sum, ev) => sum + (Number(ev.totalAdminCommissions) || 0),
    0
  );

  const totalCombinedCuts =
    totalPlatformFeesCollected + totalAdminCommissionsCollected;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <CalendarDays size={17} />
              <span>Events</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-500">Event Management</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Guest Lectures & Events
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Manage guest lectures, masterclasses, and field workshops hosted
              by external speakers for Guideex students.
            </p>
          </div>

          <button
            onClick={handleCreateEvent}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 sm:w-auto"
          >
            <span className="text-lg leading-none">+</span> Create Event
          </button>
        </div>

        {/* STATS OVERVIEW CARDS (Arranged in 2 Rows: 4 Cards Top, 3 Cards Bottom) */}
        <div className="mb-8 space-y-4">
          {/* Row 1: Session counts & status metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Events</p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {totalEventsCount}
                  </h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <CalendarDays size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Upcoming Sessions</p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {upcomingCount}
                  </h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <CalendarCheck2 size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Live Now</p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {liveCount}
                  </h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Video size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
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

          {/* Row 2: Financial metrics (Total Volume + Combined Fee/Commission Card with Total) */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Total Event Revenue Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Event Volume</p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    ₹{totalGrossRevenueCollected.toLocaleString("en-IN")}
                  </h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <IndianRupee size={22} />
                </div>
              </div>
            </div>

            {/* Combined Platform Fee & Admin Commission Card with Total */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between pr-4">
                    <p className="text-sm text-gray-500">
                      Platform Cuts & Fees
                    </p>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      Total: ₹{totalCombinedCuts.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1">
                    <div>
                      <span className="text-xs text-gray-400 font-medium">
                        Platform Fee:{" "}
                      </span>
                      <span className="text-base font-bold text-teal-600">
                        ₹{totalPlatformFeesCollected.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="hidden sm:inline-block text-gray-300">
                      |
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 font-medium">
                        Admin Comm:{" "}
                      </span>
                      <span className="text-base font-bold text-amber-600">
                        ₹
                        {totalAdminCommissionsCollected.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <Receipt size={22} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by title, domain, speaker, or university..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            <div className="relative">
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 lg:w-48"
              >
                <option value="All">All Domains</option>
                {DOMAINS.filter((d) => d !== "All").map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            >
              <option value="All">All Status</option>
              <option value="Published">Published / Upcoming</option>
              <option value="Live">Live</option>
              <option value="Completed">Completed</option>
              <option value="Draft">Draft</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* EVENTS LISTING */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-52 w-full animate-pulse rounded-2xl border border-gray-200 bg-white"
              />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-20 text-center">
            <CalendarDays size={40} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-900">No events found</h3>
            <p className="mt-2 text-sm text-gray-500">
              Create your first guest lecture or adjust your search filters.
            </p>
            <button
              onClick={handleCreateEvent}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => {
              const bannerUrl = getImageUrl(event.bannerImage);
              const displayStatus = event.computedStatus || event.status;
              const primarySpeaker = event.speakers?.[0];
              const speakerUrl = getImageUrl(primarySpeaker?.profileImage);

              return (
                <div
                  key={event._id}
                  onClick={() => handleEventClick(event)}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:border-indigo-200 hover:shadow-lg"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* LEFT COLUMN: BANNER */}
                    <div className="relative flex h-56 w-full shrink-0 items-center justify-center overflow-hidden bg-gray-900 lg:h-auto lg:min-h-[100%] lg:w-72 xl:w-80">
                      {bannerUrl ? (
                        <img
                          src={bannerUrl}
                          alt={event.title}
                          className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-105 opacity-90"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-900 to-blue-900 p-8">
                          <ImageIcon size={44} className="text-white/30" />
                        </div>
                      )}

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/40" />

                      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 z-10">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-md ${getStatusStyle(
                            displayStatus
                          )}`}
                        >
                          {displayStatus}
                        </span>
                        <span className="inline-flex rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                          {event.domain}
                        </span>
                      </div>

                      {event.isFeatured && (
                        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm shadow-md">
                          <Sparkles size={11} /> Featured
                        </div>
                      )}
                    </div>

                    {/* MIDDLE COLUMN: CONTENT & METRICS */}
                    <div className="flex flex-1 flex-col justify-between p-5 lg:p-6">
                      <div>
                        <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-indigo-600">
                          <Layers size={14} />
                          <span>{event.eventType || "Guest Lecture"}</span>
                          {event.tags && event.tags.length > 0 && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-gray-500 font-normal">
                                {event.tags.slice(0, 3).join(", ")}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 sm:text-lg">
                          {event.title}
                        </h3>

                        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-gray-600 sm:text-sm sm:leading-6">
                          {event.shortSummary || event.description}
                        </p>
                      </div>

                      {/* METRICS GRID */}
                      <div className="mt-4 grid grid-cols-1 gap-2.5 border-t border-gray-100 pt-3.5 sm:grid-cols-2">
                        <div className="flex items-center gap-2.5 rounded-xl bg-gray-50/80 p-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100/70 text-indigo-600">
                            <CalendarDays size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              Date & Time
                            </p>
                            <p className="truncate text-xs font-semibold text-gray-800">
                              {formatDate(event.startDateTime)} •{" "}
                              {formatTimeRange(
                                event.startDateTime,
                                event.endDateTime
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 rounded-xl bg-gray-50/80 p-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100/70 text-emerald-600">
                            <Users size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              Registrations
                            </p>
                            <p className="truncate text-xs font-semibold text-gray-800">
                              {event.registeredStudentsCount || 0} /{" "}
                              {event.maxSeats || 100} Seats booked
                            </p>
                          </div>
                        </div>

                        {/* FINANCIAL BREAKDOWN DISPLAY */}
                        {event.isPaid && (
                          <div className="flex items-center gap-2.5 rounded-xl bg-amber-50/50 p-2.5 sm:col-span-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                              <DollarSign size={16} />
                            </div>
                            <div className="min-w-0 flex-1 flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600/80">
                                  Financial Breakdown
                                </p>
                                <p className="text-xs font-bold text-gray-900">
                                  Gross: ₹
                                  {Number(
                                    event.totalGrossRevenue || 0
                                  ).toLocaleString("en-IN")}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-[11px] font-medium text-gray-600">
                                  Platform Fee:{" "}
                                  <strong className="text-gray-900">
                                    ₹{event.totalPlatformFees || 0}
                                  </strong>
                                </span>
                                <span className="mx-2 text-gray-300">|</span>
                                <span className="text-[11px] font-medium text-gray-600">
                                  Admin Comm:{" "}
                                  <strong className="text-gray-900">
                                    ₹{event.totalAdminCommissions || 0}
                                  </strong>
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RIGHT COLUMN: SPEAKER & ACTIONS */}
                    <div className="flex flex-col justify-between border-t border-gray-100 bg-gray-50/60 p-5 lg:w-72 xl:w-80 lg:border-l lg:border-t-0">
                      <div>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Guest Speaker
                        </p>
                        {primarySpeaker ? (
                          <div className="flex items-center gap-3">
                            {speakerUrl ? (
                              <img
                                src={speakerUrl}
                                alt={primarySpeaker.name}
                                className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm"
                              />
                            ) : (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                <UserRound size={18} />
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <h4 className="truncate text-xs font-bold text-gray-900">
                                {primarySpeaker.name}
                              </h4>
                              {primarySpeaker.title && (
                                <p className="truncate text-[11px] text-gray-500">
                                  {primarySpeaker.title}
                                </p>
                              )}
                              {primarySpeaker.organization && (
                                <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] font-semibold text-indigo-600">
                                  <Building2 size={11} />
                                  {primarySpeaker.organization}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs italic text-gray-400">
                            No speaker details
                          </p>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-gray-200/70 pt-3.5">
                        <div>
                          {event.isPaid ? (
                            <span className="flex items-center gap-0.5 text-xs font-bold text-amber-600">
                              <DollarSign size={14} /> {event.ticketPrice}
                            </span>
                          ) : (
                            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                              Free Event
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditEvent(event);
                            }}
                            title="Edit Event"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <Edit3 size={14} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(event);
                            }}
                            title="Delete Event"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </button>

                          <div className="flex h-8 items-center gap-1 rounded-lg bg-indigo-600 px-2.5 text-xs font-semibold text-white transition group-hover:bg-indigo-700">
                            Details <ArrowRight size={13} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
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
              ? This action cannot be undone and will cancel all student
              registrations.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setEventToDelete(null);
                }}
                disabled={deleting}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteEvent}
                disabled={deleting}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                <Trash2 size={16} />
                {deleting ? "Deleting..." : "Delete Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;
