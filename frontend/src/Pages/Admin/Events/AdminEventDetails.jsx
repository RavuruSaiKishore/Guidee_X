import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  UserRound,
  Building2,
  CalendarCheck2,
  Image as ImageIcon,
  CheckCircle2,
  Users,
  UserCheck,
  UserX,
  Search,
  ExternalLink,
  Save,
  Loader2,
  Settings2,
  Video,
  Layers,
  Sparkles,
  Briefcase,
  Edit3,
  ChevronRight,
  ShieldCheck,
  Filter,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminEventDetails = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { id } = useParams();

  // Strict Database Status Options for Admin Toggle
  const ADMIN_STATUS_OPTIONS = ["Draft", "Published", "Cancelled"];

  // =====================================================
  // STATE
  // =====================================================
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [statistics, setStatistics] = useState({
    totalRegistrations: 0,
    registeredCount: 0,
    cancelledCount: 0,
    attendedCount: 0,
    notAttendedCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedEventStatus, setSelectedEventStatus] = useState("");

  // Table Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedAttendance, setSelectedAttendance] = useState("All");

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

  // =====================================================
  // FETCH EVENT DETAILS
  // =====================================================
  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const token = getAdminToken();

      if (!token) throw new Error("Admin authentication token not found");
      if (!id) throw new Error("Event ID is missing");

      const response = await fetch(`${API_BASE_URL}/api/events/details/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to load event details");
      }

      const fetchedEvent = data.event || null;
      setEvent(fetchedEvent);
      // Default select current database status
      setSelectedEventStatus(fetchedEvent?.status || "Draft");
      setRegistrations(data.registrations || []);
      setStatistics(
        data.statistics || {
          totalRegistrations: 0,
          registeredCount: 0,
          cancelledCount: 0,
          attendedCount: 0,
          notAttendedCount: 0,
        }
      );
    } catch (error) {
      console.error("Fetch Event Details Error:", error);
      toast.error(error.message || "Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEventDetails();
  }, [id]);

  // =====================================================
  // UPDATE EVENT STATUS
  // =====================================================
  const updateEventStatus = async () => {
    try {
      if (!event?._id) return toast.error("Event ID not found");
      if (!selectedEventStatus)
        return toast.error("Please select an event status");
      if (selectedEventStatus === event.status) {
        return toast.info("Event already has this status");
      }

      const confirmed = window.confirm(
        `Are you sure you want to change database event status to "${selectedEventStatus}"?`
      );
      if (!confirmed) return;

      setUpdatingStatus(true);
      const token = getAdminToken();

      const response = await fetch(
        `${API_BASE_URL}/api/events/update-status/${event._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: selectedEventStatus }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update event status");
      }

      setEvent((prev) => ({
        ...prev,
        status: data.event?.status || selectedEventStatus,
        computedStatus: data.event?.computedStatus || prev.computedStatus,
      }));
      setSelectedEventStatus(data.event?.status || selectedEventStatus);
      toast.success(data.message || "Event status updated successfully");
    } catch (error) {
      console.error("Update Event Status Error:", error);
      toast.error(error.message || "Failed to update status");
      setSelectedEventStatus(event?.status || "Draft");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // =====================================================
  // FORMATTING HELPERS
  // =====================================================
  const formatDate = (date) => {
    if (!date) return "N/A";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "N/A";
    return parsed.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "N/A";
    return parsed.toLocaleString("en-US", {
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
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "N/A";
    return parsed.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Published":
      case "Upcoming":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "Draft":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "Registration Closed":
      case "Housefull":
        return "bg-orange-50 text-orange-600 border-orange-200";
      case "Live Now":
        return "bg-emerald-50 text-emerald-600 border-emerald-200 animate-pulse";
      case "Completed":
        return "bg-gray-100 text-gray-600 border-gray-200";
      case "Cancelled":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStudentName = (student) => {
    if (!student) return "Unknown Student";
    const fullName = [student.firstName, student.lastName]
      .filter(Boolean)
      .join(" ");
    return fullName || student.name || "Unknown Student";
  };

  // Filter registrations list for search and count matching
  const filteredRegistrations = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return registrations.filter((registration) => {
      const student = registration.student;
      const studentName = getStudentName(student).toLowerCase();
      const email = student?.email?.toLowerCase() || "";
      const phone = student?.phone?.toLowerCase() || "";

      const matchesSearch =
        !search ||
        studentName.includes(search) ||
        email.includes(search) ||
        phone.includes(search);

      const matchesStatus =
        selectedStatus === "All" || registration.status === selectedStatus;

      const matchesAttendance =
        selectedAttendance === "All" ||
        (selectedAttendance === "Attended" && registration.attended === true) ||
        (selectedAttendance === "Not Attended" &&
          registration.attended === false);

      return matchesSearch && matchesStatus && matchesAttendance;
    });
  }, [registrations, searchTerm, selectedStatus, selectedAttendance]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
          <div className="mt-6 h-[380px] animate-pulse rounded-3xl bg-white" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-6">
        <div className="text-center">
          <CalendarDays size={50} className="mx-auto text-gray-300" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Event not found
          </h2>
          <button
            onClick={() => navigate("/admin/events")}
            className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const bannerUrl = getImageUrl(event.bannerImage);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <div className="mx-auto max-w-[1400px] p-4 sm:p-6 lg:p-8">
        {/* BACK & ACTIONS BAR */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigate("/admin/events")}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-indigo-600"
          >
            <ArrowLeft size={18} /> Back to Events
          </button>

          <button
            onClick={() => navigate(`/admin/events/edit/${event._id}`)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-indigo-700"
          >
            <Edit3 size={15} /> Edit Event Details
          </button>
        </div>

        {/* HERO BANNER SECTION */}
        <div className="relative overflow-hidden rounded-3xl bg-gray-900 shadow-xl">
          {bannerUrl ? (
            <img
              src={bannerUrl}
              alt={event.title}
              className="h-[280px] w-full object-cover sm:h-[380px] opacity-90"
            />
          ) : (
            <div className="flex h-[280px] items-center justify-center bg-gradient-to-br from-indigo-900 to-blue-900 sm:h-[380px]">
              <ImageIcon size={70} className="text-white/30" />
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* TOP BADGES */}
          <div className="absolute left-6 top-6 flex flex-wrap gap-2.5">
            <span
              className={`inline-flex rounded-full border px-4 py-1.5 text-xs font-bold backdrop-blur-md ${getStatusStyle(
                event.status
              )}`}
            >
              DB: {event.status}
            </span>
            <span
              className={`inline-flex rounded-full border px-4 py-1.5 text-xs font-bold backdrop-blur-md ${getStatusStyle(
                event.computedStatus
              )}`}
            >
              Live State: {event.computedStatus}
            </span>
            <span className="inline-flex rounded-full border border-white/20 bg-black/50 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              {event.domain}
            </span>
            {event.isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                <Sparkles size={13} /> Featured
              </span>
            )}
          </div>

          {/* TITLE & META OVERLAY */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-indigo-300">
              <Layers size={14} />
              <span>{event.eventType || "Guest Lecture"}</span>
              <span>•</span>
              <span>Created by {event.createdByAdmin || "Guideex Admin"}</span>
            </div>
            <h1 className="max-w-5xl text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              {event.title}
            </h1>
          </div>
        </div>

        {/* ADMIN STATUS & VIRTUAL ROOM MANAGEMENT */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* STATUS CHANGE */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Settings2 size={22} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Manage Event Publication Status
                  </h2>
                  <p className="text-xs text-gray-500">
                    Control whether this event is Draft, Published, or
                    Cancelled.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 sm:flex-row">
                <select
                  value={selectedEventStatus}
                  onChange={(e) => setSelectedEventStatus(e.target.value)}
                  disabled={updatingStatus}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-medium text-gray-700 outline-none focus:border-indigo-500 focus:bg-white"
                >
                  {ADMIN_STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={updateEventStatus}
                  disabled={
                    updatingStatus || selectedEventStatus === event.status
                  }
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:bg-gray-300 shadow-sm"
                >
                  {updatingStatus ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Save size={15} />
                  )}
                  Save Status
                </button>
              </div>
            </div>
          </div>

          {/* QUICK MEETING LINK ACCESS */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video size={18} className="text-indigo-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  Virtual Meeting Room
                </h3>
              </div>
              {event.isPaid ? (
                <span className="text-xs font-bold text-amber-600">
                  ${event.ticketPrice} Ticket
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-600">
                  Free Entry
                </span>
              )}
            </div>

            {event.meetingUrl ? (
              <a
                href={event.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
              >
                <span className="truncate">{event.meetingUrl}</span>
                <ExternalLink size={14} className="shrink-0" />
              </a>
            ) : (
              <p className="mt-3 text-xs italic text-gray-400">
                No meeting link configured yet.
              </p>
            )}
          </div>
        </div>

        {/* REGISTRATION STATISTICS */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">
                  Total Registrations
                </p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  {statistics.totalRegistrations}
                </h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Users size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">
                  Active Registered
                </p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  {statistics.registeredCount} / {event.maxSeats || 100} Seats
                </h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UserCheck size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Cancelled</p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  {statistics.cancelledCount}
                </h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <UserX size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">
                  Attended Session
                </p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  {statistics.attendedCount}
                </h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Absent</p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  {statistics.notAttendedCount}
                </h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <UserX size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* EVENT INFORMATION GRID */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT 2-COLUMNS: ABOUT, SCHEDULE & GUEST SPEAKERS */}
          <div className="space-y-6 lg:col-span-2">
            {/* ABOUT EVENT */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900">
                About This Session
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                {event.description || "No description available."}
              </p>

              {/* TAGS & PREREQUISITES */}
              {((event.tags && event.tags.length > 0) ||
                (event.targetAudience?.prerequisites &&
                  event.targetAudience.prerequisites.length > 0)) && (
                <div className="mt-6 border-t border-gray-100 pt-4 space-y-3">
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold uppercase text-gray-400">
                        Tags:
                      </span>
                      {event.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {event.targetAudience?.prerequisites &&
                    event.targetAudience.prerequisites.length > 0 && (
                      <div className="text-xs text-gray-600">
                        <span className="font-bold uppercase text-gray-400">
                          Prerequisites:
                        </span>{" "}
                        {event.targetAudience.prerequisites.join(", ")}
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* SCHEDULE GRID */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900">
                Timing & Deadlines
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <CalendarDays size={20} className="text-indigo-600" />
                  <p className="mt-2 text-xs font-semibold uppercase text-gray-400">
                    Event Date
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-gray-800">
                    {formatDate(event.startDateTime)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <Clock3 size={20} className="text-blue-600" />
                  <p className="mt-2 text-xs font-semibold uppercase text-gray-400">
                    Duration / Time
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-gray-800">
                    {formatTime(event.startDateTime)} —{" "}
                    {formatTime(event.endDateTime)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 sm:col-span-2">
                  <CalendarCheck2 size={20} className="text-emerald-600" />
                  <p className="mt-2 text-xs font-semibold uppercase text-gray-400">
                    Registration Deadline
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-gray-800">
                    {formatDate(event.registrationDeadline)} at{" "}
                    {formatTime(event.registrationDeadline)}
                  </p>
                </div>
              </div>
            </div>

            {/* MULTI-SPEAKER / FACULTY SECTION */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900">
                Guest Speakers & Faculty ({event.speakers?.length || 0})
              </h2>

              <div className="mt-5 space-y-6">
                {event.speakers && event.speakers.length > 0 ? (
                  event.speakers.map((spk, idx) => {
                    const spkImg = getImageUrl(spk.profileImage);
                    return (
                      <div
                        key={idx}
                        className="flex flex-col gap-4 border-b border-gray-100 pb-5 last:border-0 last:pb-0 sm:flex-row sm:items-start"
                      >
                        {spkImg ? (
                          <img
                            src={spkImg}
                            alt={spk.name}
                            className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-2 ring-indigo-50"
                          />
                        ) : (
                          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                            <UserRound size={32} />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">
                              {spk.name}
                            </h3>
                            {spk.linkedinUrl && (
                              <a
                                href={spk.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-indigo-600"
                              >
                                <Briefcase size={18} />
                              </a>
                            )}
                          </div>

                          {spk.title && (
                            <p className="mt-0.5 text-xs font-medium text-gray-600">
                              {spk.title}
                            </p>
                          )}

                          {spk.organization && (
                            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
                              <Building2 size={13} /> {spk.organization}
                            </p>
                          )}

                          {spk.bio && (
                            <p className="mt-2 text-xs leading-5 text-gray-500">
                              {spk.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs italic text-gray-400">
                    No guest speaker information attached to this event.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: STATUS & METADATA */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Database Status
                </p>
                <div className="mt-2">
                  <span
                    className={`inline-flex rounded-full border px-3.5 py-1.5 text-xs font-bold ${getStatusStyle(
                      event.status
                    )}`}
                  >
                    {event.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Live Computed Timeline
                </p>
                <div className="mt-2">
                  <span
                    className={`inline-flex rounded-full border px-3.5 py-1.5 text-xs font-bold ${getStatusStyle(
                      event.computedStatus
                    )}`}
                  >
                    {event.computedStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* RECORDING URL IF AVAILABLE */}
            {event.recordingUrl && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Post-Event Recording
                </h3>
                <a
                  href={event.recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-between rounded-xl border border-purple-100 bg-purple-50 p-3 text-xs font-semibold text-purple-700 hover:bg-purple-100"
                >
                  <span className="truncate">{event.recordingUrl}</span>
                  <ExternalLink size={14} className="shrink-0" />
                </a>
              </div>
            )}

            {/* EVENT METADATA */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900">
                Event Metadata
              </h2>

              <div className="mt-4 space-y-4 text-xs">
                <div>
                  <p className="font-medium text-gray-400">Event ID</p>
                  <p className="mt-0.5 break-all font-mono font-semibold text-gray-700">
                    {event._id}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-gray-400">URL Slug</p>
                  <p className="mt-0.5 break-all font-mono text-gray-700">
                    {event.slug || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-gray-400">
                    Target Audience Level
                  </p>
                  <p className="mt-0.5 font-semibold text-gray-700">
                    {event.targetAudience?.experienceLevel || "All Levels"}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-gray-400">Created At</p>
                  <p className="mt-0.5 font-medium text-gray-700">
                    {formatDateTime(event.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-gray-400">Last Updated</p>
                  <p className="mt-0.5 font-medium text-gray-700">
                    {formatDateTime(event.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================== */}
        {/* STUDENTS ENGAGEMENT NAVIGATION SECTION                */}
        {/* ===================================================== */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-xl shadow-gray-100/50">
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-gray-50/60 via-white to-gray-50/60">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
                <Users size={24} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-gray-900">
                  Students Engagement & Registrations
                </h2>
                <p className="mt-1 text-xs font-medium text-gray-500">
                  Manage and inspect all student enrollments, attendance status,
                  and payment logs for this event.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(`/admin/events/details/${event._id}/registrations`)
              }
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <Users size={16} />
              <span>Students Engagement</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEventDetails;
