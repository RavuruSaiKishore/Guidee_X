import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  UserRound,
  Building2,
  Briefcase,
  CalendarCheck2,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Users,
  UserCheck,
  UserX,
  Search,
  Mail,
  Phone,
  GraduationCap,
  ExternalLink,
  CircleCheck,
  CircleX,
  Save,
  Loader2,
  Settings2,
} from "lucide-react";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const AdminEventDetails = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();

  const { id } = useParams();

  // =====================================================
  // EVENT STATUS OPTIONS
  // =====================================================

  const EVENT_STATUS_OPTIONS = [
    "Upcoming",
    "Registration Closed",
    "Live",
    "Completed",
    "Cancelled",
  ];

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

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("All");

  const [selectedAttendance, setSelectedAttendance] = useState("All");

  // =====================================================
  // ADMIN TOKEN
  // =====================================================

  const getAdminToken = () => {
    return localStorage.getItem("AdminToken");
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

    const cleanBaseUrl = API_BASE_URL?.replace(/\/+$/, "");

    if (!cleanBaseUrl) {
      return `/${cleanPath}`;
    }

    return `${cleanBaseUrl}/${cleanPath}`;
  };

  // =====================================================
  // FETCH EVENT DETAILS
  // =====================================================

  const fetchEventDetails = async () => {
    try {
      setLoading(true);

      const token = getAdminToken();

      if (!token) {
        throw new Error("Admin authentication token not found");
      }

      if (!id) {
        throw new Error("Event ID is missing");
      }

      const response = await fetch(`${API_BASE_URL}/api/events/details/${id}`, {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("EVENT DETAILS RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to load event details");
      }

      setEvent(data.event || null);

      setSelectedEventStatus(data.event?.status || "Upcoming");

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

  // =====================================================
  // UPDATE EVENT STATUS
  // =====================================================

  const updateEventStatus = async () => {
    try {
      if (!event?._id) {
        toast.error("Event ID not found");
        return;
      }

      if (!selectedEventStatus) {
        toast.error("Please select an event status");
        return;
      }

      if (selectedEventStatus === event.status) {
        toast.info("Event already has this status");
        return;
      }

      const confirmed = window.confirm(
        `Are you sure you want to change the event status to "${selectedEventStatus}"?`
      );

      if (!confirmed) {
        return;
      }

      setUpdatingStatus(true);

      const token = getAdminToken();

      if (!token) {
        throw new Error("Admin authentication token not found");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/events/update-status/${event._id}`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: selectedEventStatus,
          }),
        }
      );

      const data = await response.json();

      console.log("UPDATE EVENT STATUS RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to update event status");
      }

      // =====================================================
      // UPDATE EVENT IN UI
      // =====================================================

      setEvent((previousEvent) => ({
        ...previousEvent,
        status: data.event?.status || selectedEventStatus,
      }));

      setSelectedEventStatus(data.event?.status || selectedEventStatus);

      toast.success(data.message || "Event status updated successfully");
    } catch (error) {
      console.error("Update Event Status Error:", error);

      toast.error(error.message || "Failed to update event status");

      // Reset dropdown to original event status
      setSelectedEventStatus(event?.status || "Upcoming");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // =====================================================
  // LOAD EVENT
  // =====================================================

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

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
      month: "long",
      year: "numeric",
    });
  };

  // =====================================================
  // FORMAT DATE AND TIME
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
  // EVENT STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-50 text-blue-600 border-blue-200";

      case "Registration Closed":
        return "bg-orange-50 text-orange-600 border-orange-200";

      case "Live":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";

      case "Completed":
        return "bg-gray-100 text-gray-600 border-gray-200";

      case "Cancelled":
        return "bg-red-50 text-red-600 border-red-200";

      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 size={22} />;

      case "Cancelled":
        return <XCircle size={22} />;

      case "Live":
        return <CircleCheck size={22} />;

      case "Registration Closed":
        return <XCircle size={22} />;

      default:
        return <CalendarDays size={22} />;
    }
  };

  // =====================================================
  // REGISTRATION STATUS STYLE
  // =====================================================

  const getRegistrationStatusStyle = (status) => {
    if (status === "Registered") {
      return "bg-emerald-50 text-emerald-600 border-emerald-200";
    }

    return "bg-red-50 text-red-600 border-red-200";
  };

  // =====================================================
  // GET STUDENT NAME
  // =====================================================

  const getStudentName = (student) => {
    if (!student) {
      return "Unknown Student";
    }

    if (student.name) {
      return student.name;
    }

    const fullName = [student.firstName, student.lastName]
      .filter(Boolean)
      .join(" ");

    return fullName || "Unknown Student";
  };

  // =====================================================
  // FILTER REGISTRATIONS
  // =====================================================

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

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <div className="mx-auto max-w-[1400px] p-4 sm:p-6 lg:p-8">
          <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />

          <div className="mt-6 h-[380px] animate-pulse rounded-3xl bg-white" />

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // EVENT NOT FOUND
  // =====================================================

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-6">
        <div className="text-center">
          <CalendarDays size={50} className="mx-auto text-gray-300" />

          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Event not found
          </h2>

          <button
            onClick={() => navigate("/admin/Events")}
            className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const bannerUrl = getImageUrl(event.bannerImage);

  const speakerUrl = getImageUrl(event.speakerImage);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <div className="mx-auto max-w-[1400px] p-4 sm:p-6 lg:p-8">
        {/* =====================================================
            BACK BUTTON
        ====================================================== */}

        <button
          onClick={() => navigate("/admin/Events")}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-indigo-600"
        >
          <ArrowLeft size={18} />
          Back to Events
        </button>

        {/* =====================================================
            EVENT HERO
        ====================================================== */}

        <div className="relative overflow-hidden rounded-3xl bg-gray-200 shadow-lg">
          {bannerUrl ? (
            <img
              src={bannerUrl}
              alt={event.title}
              className="h-[280px] w-full object-cover sm:h-[400px]"
            />
          ) : (
            <div className="flex h-[280px] items-center justify-center bg-gradient-to-r from-indigo-600 to-blue-600 sm:h-[400px]">
              <ImageIcon size={70} className="text-white/50" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* STATUS */}

          <div className="absolute left-6 top-6">
            <span
              className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${getStatusStyle(
                event.status
              )}`}
            >
              {event.status}
            </span>
          </div>

          {/* TITLE */}

          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="max-w-5xl text-2xl font-bold text-white sm:text-4xl">
              {event.title}
            </h1>
          </div>
        </div>

        {/* =====================================================
            ADMIN STATUS CONTROL
        ====================================================== */}

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* LEFT */}

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Settings2 size={23} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Manage Event Status
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Admin can manually update the current status of this event.
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-400">
                    Current Status:
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      event.status
                    )}`}
                  >
                    {event.status}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT */}

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <select
                value={selectedEventStatus}
                onChange={(e) => setSelectedEventStatus(e.target.value)}
                disabled={updatingStatus}
                className="min-w-[220px] rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {EVENT_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={updateEventStatus}
                disabled={
                  updatingStatus || selectedEventStatus === event.status
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {updatingStatus ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Update Status
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            STATISTICS
        ====================================================== */}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {/* TOTAL */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Registrations</p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {statistics.totalRegistrations}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Users size={22} />
              </div>
            </div>
          </div>

          {/* REGISTERED */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Registered</p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {statistics.registeredCount}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UserCheck size={22} />
              </div>
            </div>
          </div>

          {/* CANCELLED */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cancelled</p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {statistics.cancelledCount}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <UserX size={22} />
              </div>
            </div>
          </div>

          {/* ATTENDED */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Attended</p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {statistics.attendedCount}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>

          {/* NOT ATTENDED */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Not Attended</p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {statistics.notAttendedCount}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <UserX size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            EVENT INFORMATION
        ====================================================== */}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT */}

          <div className="space-y-6 lg:col-span-2">
            {/* DESCRIPTION */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                About This Event
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
                {event.description || "No description available."}
              </p>
            </div>

            {/* SCHEDULE */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Event Schedule
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* DATE */}

                <div className="rounded-xl bg-gray-50 p-4">
                  <CalendarDays size={20} className="text-indigo-600" />

                  <p className="mt-3 text-xs text-gray-400">Event Date</p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {formatDate(event.startDateTime)}
                  </p>
                </div>

                {/* START */}

                <div className="rounded-xl bg-gray-50 p-4">
                  <Clock3 size={20} className="text-blue-600" />

                  <p className="mt-3 text-xs text-gray-400">Start Time</p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {formatTime(event.startDateTime)}
                  </p>
                </div>

                {/* END */}

                <div className="rounded-xl bg-gray-50 p-4">
                  <Clock3 size={20} className="text-purple-600" />

                  <p className="mt-3 text-xs text-gray-400">End Time</p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {formatTime(event.endDateTime)}
                  </p>
                </div>

                {/* DEADLINE */}

                <div className="rounded-xl bg-gray-50 p-4">
                  <CalendarCheck2 size={20} className="text-emerald-600" />

                  <p className="mt-3 text-xs text-gray-400">
                    Registration Deadline
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {formatDate(event.registrationDeadline)}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {formatTime(event.registrationDeadline)}
                  </p>
                </div>
              </div>
            </div>

            {/* SPEAKER */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Speaker Information
              </h2>

              <div className="mt-5 flex flex-col gap-5 sm:flex-row">
                {speakerUrl ? (
                  <img
                    src={speakerUrl}
                    alt={event.speaker}
                    className="h-24 w-24 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <UserRound size={36} />
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {event.speaker || "No speaker"}
                  </h3>

                  {event.speakerRole && (
                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase size={16} />

                      {event.speakerRole}
                    </p>
                  )}

                  {event.speakerCompany && (
                    <p className="mt-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
                      <Building2 size={16} />

                      {event.speakerCompany}
                    </p>
                  )}
                </div>
              </div>

              {/* BIO */}

              {event.speakerBio && (
                <div className="mt-6 border-t border-gray-100 pt-5">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Speaker Bio
                  </h3>

                  <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-600">
                    {event.speakerBio}
                  </p>
                </div>
              )}

              {/* EXPERIENCE */}

              {event.speakerExperience && (
                <div className="mt-6 border-t border-gray-100 pt-5">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Experience
                  </h3>

                  <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-600">
                    {event.speakerExperience}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}

          <div className="space-y-6">
            {/* EVENT STATUS */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Event Status
              </p>

              <div className="mt-4 flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${getStatusStyle(
                    event.status
                  )}`}
                >
                  {getStatusIcon(event.status)}
                </span>

                <span
                  className={`rounded-full border px-3 py-1 text-sm font-semibold ${getStatusStyle(
                    event.status
                  )}`}
                >
                  {event.status}
                </span>
              </div>
            </div>

            {/* EVENT META */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Event Information
              </h2>

              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-xs text-gray-400">Event ID</p>

                  <p className="mt-1 break-all text-sm font-medium text-gray-700">
                    {event._id}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Created At</p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {formatDateTime(event.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Last Updated</p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {formatDateTime(event.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* EDIT EVENT */}

            <button
              onClick={() => navigate(`/admin/Events/edit/${event._id}`)}
              className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Edit Event
            </button>
          </div>
        </div>

        {/* =====================================================
            REGISTERED USERS
        ====================================================== */}

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* HEADER */}

          <div className="border-b border-gray-100 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Registered Students
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  View all students registered for this event.
                </p>
              </div>

              <div className="rounded-xl bg-indigo-50 px-4 py-3">
                <p className="text-xs text-indigo-500">Showing</p>

                <p className="text-lg font-bold text-indigo-700">
                  {filteredRegistrations.length} / {registrations.length}
                </p>
              </div>
            </div>

            {/* FILTERS */}

            <div className="mt-5 flex flex-col gap-3 xl:flex-row">
              {/* SEARCH */}

              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search students by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              {/* STATUS */}

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-indigo-500"
              >
                <option value="All">All Status</option>

                <option value="Registered">Registered</option>

                <option value="Cancelled">Cancelled</option>
              </select>

              {/* ATTENDANCE */}

              <select
                value={selectedAttendance}
                onChange={(e) => setSelectedAttendance(e.target.value)}
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-indigo-500"
              >
                <option value="All">All Attendance</option>

                <option value="Attended">Attended</option>

                <option value="Not Attended">Not Attended</option>
              </select>
            </div>
          </div>

          {/* USERS */}

          {filteredRegistrations.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Users size={45} className="mx-auto text-gray-300" />

              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No registered students found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try changing your search or filter settings.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredRegistrations.map((registration) => {
                const student = registration.student;

                const studentName = getStudentName(student);

                const studentImage = getImageUrl(
                  student?.profileImage || student?.avatar
                );

                return (
                  <div
                    key={registration._id}
                    className="p-6 transition hover:bg-gray-50"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      {/* STUDENT */}

                      <div className="flex min-w-0 items-center gap-4">
                        {studentImage ? (
                          <img
                            src={studentImage}
                            alt={studentName}
                            className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-gray-100"
                          />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                            <UserRound size={25} />
                          </div>
                        )}

                        <div className="min-w-0">
                          <h3 className="truncate text-base font-bold text-gray-900">
                            {studentName}
                          </h3>

                          {student?.email && (
                            <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                              <Mail size={14} />

                              {student.email}
                            </p>
                          )}

                          {student?.phone && (
                            <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                              <Phone size={14} />

                              {student.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* EDUCATION */}

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:min-w-[300px]">
                        {(student?.college || student?.university) && (
                          <div>
                            <p className="text-xs text-gray-400">Institution</p>

                            <p className="mt-1 flex items-center gap-1 text-sm font-medium text-gray-700">
                              <GraduationCap size={14} />

                              {student.college || student.university}
                            </p>
                          </div>
                        )}

                        {(student?.course || student?.branch) && (
                          <div>
                            <p className="text-xs text-gray-400">Course</p>

                            <p className="mt-1 text-sm font-medium text-gray-700">
                              {student.course || student.branch}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* REGISTRATION */}

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:min-w-[320px]">
                        <div>
                          <p className="text-xs text-gray-400">Registered At</p>

                          <p className="mt-1 text-sm font-medium text-gray-700">
                            {formatDateTime(registration.registeredAt)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">Joined At</p>

                          <p className="mt-1 text-sm font-medium text-gray-700">
                            {registration.joinedAt
                              ? formatDateTime(registration.joinedAt)
                              : "Not joined"}
                          </p>
                        </div>
                      </div>

                      {/* STATUS */}

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold ${getRegistrationStatusStyle(
                            registration.status
                          )}`}
                        >
                          {registration.status === "Registered" ? (
                            <CircleCheck size={14} />
                          ) : (
                            <CircleX size={14} />
                          )}

                          {registration.status}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                            registration.attended
                              ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                              : "border-orange-200 bg-orange-50 text-orange-600"
                          }`}
                        >
                          {registration.attended ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <Clock3 size={14} />
                          )}

                          {registration.attended ? "Attended" : "Not Attended"}
                        </span>
                      </div>
                    </div>

                    {/* MEETING LINK */}

                    {registration.meetingLink && (
                      <div className="mt-5 border-t border-gray-100 pt-4">
                        <a
                          href={registration.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                          <ExternalLink size={15} />
                          Open Meeting Link
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEventDetails;
