import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Save,
  CalendarDays,
  Clock3,
  UserRound,
  Image as ImageIcon,
  Building2,
  Briefcase,
  FileText,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditEvent = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();

  const { id } = useParams();

  // =====================================================
  // INITIAL FORM DATA
  // =====================================================

  const initialFormData = {
    title: "",
    description: "",

    bannerImage: null,

    // EVENT DATE & TIME
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",

    // SPEAKER
    speaker: "",
    speakerImage: null,

    speakerRole: "",
    speakerCompany: "",
    speakerBio: "",
    speakerExperience: "",

    // REGISTRATION DEADLINE
    registrationDeadlineDate: "",
    registrationDeadlineTime: "",

    // STATUS
    status: "Upcoming",
  };

  // =====================================================
  // STATE
  // =====================================================

  const [formData, setFormData] = useState(initialFormData);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [bannerPreview, setBannerPreview] = useState("");

  const [speakerPreview, setSpeakerPreview] = useState("");

  // =====================================================
  // GET ADMIN TOKEN
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
  // CONVERT 24-HOUR TIME TO 12-HOUR AM/PM
  // =====================================================

  const convertTo12Hour = (time) => {
    if (!time) {
      return "";
    }

    const match = time.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);

    if (!match) {
      return time;
    }

    let hours = parseInt(match[1], 10);

    const minutes = match[2];

    if (hours < 0 || hours > 23) {
      return time;
    }

    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;

    if (hours === 0) {
      hours = 12;
    }

    return `${String(hours).padStart(2, "0")}:${minutes} ${period}`;
  };

  // =====================================================
  // CONVERT 12-HOUR AM/PM TO 24-HOUR
  // Used only for HTML time input
  // =====================================================

  const convertTo24Hour = (time) => {
    if (!time) {
      return "";
    }

    const match = time.trim().match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);

    if (!match) {
      // Already 24-hour format
      if (/^\d{2}:\d{2}$/.test(time)) {
        return time;
      }

      return "";
    }

    let hours = parseInt(match[1], 10);

    const minutes = match[2];

    const period = match[3].toUpperCase();

    if (hours < 1 || hours > 12) {
      return "";
    }

    if (period === "AM" && hours === 12) {
      hours = 0;
    }

    if (period === "PM" && hours !== 12) {
      hours += 12;
    }

    return `${String(hours).padStart(2, "0")}:${minutes}`;
  };

  // =====================================================
  // FORMAT TIME FOR HTML TIME INPUT
  // =====================================================

  const formatTimeForInput = (time) => {
    if (!time) {
      return "";
    }

    // Backend stores 12-hour format
    if (/AM|PM/i.test(time)) {
      return convertTo24Hour(time);
    }

    // Backend may already contain 24-hour format
    if (/^\d{2}:\d{2}$/.test(time)) {
      return time;
    }

    return "";
  };

  // =====================================================
  // FORMAT DATE FOR HTML DATE INPUT
  // =====================================================

  const formatDateForInput = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    // If already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue;
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      return "";
    }

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =====================================================
  // FORMAT DISPLAY TIME
  // =====================================================

  const formatTimeWithAmPm = (time) => {
    if (!time) {
      return "N/A";
    }

    // Already 12-hour format
    if (/AM|PM/i.test(time)) {
      return time;
    }

    return convertTo12Hour(time);
  };

  // =====================================================
  // FETCH EVENT DETAILS
  // =====================================================

  const fetchEvent = async () => {
    try {
      setLoading(true);

      const token = getAdminToken();

      if (!token) {
        toast.error("Admin authentication token not found");

        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/events/eventDetails/${id}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("EVENT DETAILS RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to load event");
      }

      // =====================================================
      // GET EVENT
      // =====================================================

      const event = data.event || data.data || data;

      if (!event) {
        throw new Error("Event details not found");
      }

      console.log("EVENT TO EDIT:", event);

      // =====================================================
      // EVENT START DATE
      // =====================================================

      const startDate = formatDateForInput(event.startDate);

      // =====================================================
      // EVENT END DATE
      // =====================================================

      const endDate = formatDateForInput(event.endDate);

      // =====================================================
      // EVENT START TIME
      // Backend:
      // 10:30 AM
      //
      // HTML time input:
      // 10:30
      // =====================================================

      const startTime = formatTimeForInput(event.startTime);

      // =====================================================
      // EVENT END TIME
      // =====================================================

      const endTime = formatTimeForInput(event.endTime);

      // =====================================================
      // REGISTRATION DEADLINE DATE
      // =====================================================

      const registrationDeadlineDate = formatDateForInput(
        event.registrationDeadlineDate
      );

      // =====================================================
      // REGISTRATION DEADLINE TIME
      // =====================================================

      const registrationDeadlineTime = formatTimeForInput(
        event.registrationDeadlineTime
      );

      // =====================================================
      // SET FORM DATA
      // =====================================================

      setFormData({
        title: event.title || "",

        description: event.description || "",

        bannerImage: null,

        startDate,

        startTime,

        endDate,

        endTime,

        speaker: event.speaker || "",

        speakerImage: null,

        speakerRole: event.speakerRole || "",

        speakerCompany: event.speakerCompany || "",

        speakerBio: event.speakerBio || "",

        speakerExperience: event.speakerExperience || "",

        registrationDeadlineDate,

        registrationDeadlineTime,

        status: event.status || "Upcoming",
      });

      // =====================================================
      // EXISTING BANNER IMAGE
      // =====================================================

      setBannerPreview(getImageUrl(event.bannerImage));

      // =====================================================
      // EXISTING SPEAKER IMAGE
      // =====================================================

      setSpeakerPreview(getImageUrl(event.speakerImage));
    } catch (error) {
      console.error("Fetch Event Error:", error);

      toast.error(error.message || "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH EVENT ON PAGE LOAD
  // =====================================================

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // =====================================================
    // BANNER IMAGE
    // =====================================================

    if (name === "bannerImage") {
      const file = files?.[0];

      if (!file) {
        return;
      }

      if (bannerPreview && bannerPreview.startsWith("blob:")) {
        URL.revokeObjectURL(bannerPreview);
      }

      const previewUrl = URL.createObjectURL(file);

      setFormData((prev) => ({
        ...prev,

        bannerImage: file,
      }));

      setBannerPreview(previewUrl);

      return;
    }

    // =====================================================
    // SPEAKER IMAGE
    // =====================================================

    if (name === "speakerImage") {
      const file = files?.[0];

      if (!file) {
        return;
      }

      if (speakerPreview && speakerPreview.startsWith("blob:")) {
        URL.revokeObjectURL(speakerPreview);
      }

      const previewUrl = URL.createObjectURL(file);

      setFormData((prev) => ({
        ...prev,

        speakerImage: file,
      }));

      setSpeakerPreview(previewUrl);

      return;
    }

    // =====================================================
    // NORMAL INPUT
    // =====================================================

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  // =====================================================
  // VALIDATE FORM
  // =====================================================

  const validateForm = () => {
    // =====================================================
    // REQUIRED FIELDS
    // =====================================================

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.startDate ||
      !formData.startTime ||
      !formData.endDate ||
      !formData.endTime ||
      !formData.speaker.trim() ||
      !formData.registrationDeadlineDate ||
      !formData.registrationDeadlineTime
    ) {
      toast.error("Please fill all required fields");

      return false;
    }

    // =====================================================
    // CREATE EVENT START DATETIME
    // =====================================================

    const eventStartDateTime = new Date(
      `${formData.startDate}T${formData.startTime}:00`
    );

    // =====================================================
    // CREATE EVENT END DATETIME
    // =====================================================

    const eventEndDateTime = new Date(
      `${formData.endDate}T${formData.endTime}:00`
    );

    // =====================================================
    // CREATE REGISTRATION DEADLINE DATETIME
    // =====================================================

    const deadlineDate = new Date(
      `${formData.registrationDeadlineDate}T${formData.registrationDeadlineTime}:00`
    );

    // =====================================================
    // VALIDATE DATES
    // =====================================================

    if (
      isNaN(eventStartDateTime.getTime()) ||
      isNaN(eventEndDateTime.getTime()) ||
      isNaN(deadlineDate.getTime())
    ) {
      toast.error("Please enter valid event dates and times");

      return false;
    }

    // =====================================================
    // END MUST BE AFTER START
    // =====================================================

    if (eventEndDateTime <= eventStartDateTime) {
      toast.error(
        "Event end date and time must be after event start date and time"
      );

      return false;
    }

    // =====================================================
    // DEADLINE MUST BE BEFORE EVENT START
    // =====================================================

    if (deadlineDate >= eventStartDateTime) {
      toast.error(
        "Registration deadline must be before event start date and time"
      );

      return false;
    }

    return true;
  };

  // =====================================================
  // UPDATE EVENT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const token = getAdminToken();

      if (!token) {
        throw new Error("Admin authentication token not found");
      }

      // =====================================================
      // CREATE FORMDATA
      // =====================================================

      const data = new FormData();

      // =====================================================
      // BASIC EVENT INFORMATION
      // =====================================================

      data.append("title", formData.title.trim());

      data.append("description", formData.description.trim());

      // =====================================================
      // EVENT START DATE
      // =====================================================

      data.append("startDate", formData.startDate);

      // =====================================================
      // EVENT START TIME
      // Convert:
      // 10:30
      //
      // To:
      // 10:30 AM
      // =====================================================

      data.append("startTime", convertTo12Hour(formData.startTime));

      // =====================================================
      // EVENT END DATE
      // =====================================================

      data.append("endDate", formData.endDate);

      // =====================================================
      // EVENT END TIME
      // =====================================================

      data.append("endTime", convertTo12Hour(formData.endTime));

      // =====================================================
      // SPEAKER INFORMATION
      // =====================================================

      data.append("speaker", formData.speaker.trim());

      data.append("speakerRole", formData.speakerRole.trim());

      data.append("speakerCompany", formData.speakerCompany.trim());

      data.append("speakerBio", formData.speakerBio.trim());

      data.append("speakerExperience", formData.speakerExperience.trim());

      // =====================================================
      // REGISTRATION DEADLINE DATE
      // =====================================================

      data.append(
        "registrationDeadlineDate",
        formData.registrationDeadlineDate
      );

      // =====================================================
      // REGISTRATION DEADLINE TIME
      // =====================================================

      data.append(
        "registrationDeadlineTime",
        convertTo12Hour(formData.registrationDeadlineTime)
      );

      // =====================================================
      // STATUS
      // =====================================================

      data.append("status", formData.status);

      // =====================================================
      // NEW BANNER IMAGE
      // =====================================================

      if (formData.bannerImage instanceof File) {
        data.append("bannerImage", formData.bannerImage);
      }

      // =====================================================
      // NEW SPEAKER IMAGE
      // =====================================================

      if (formData.speakerImage instanceof File) {
        data.append("speakerImage", formData.speakerImage);
      }

      // =====================================================
      // DEBUG FORMDATA
      // =====================================================

      console.log("========== UPDATE EVENT DATA ==========");

      for (const [key, value] of data.entries()) {
        console.log(key, value);
      }

      console.log("========================================");

      // =====================================================
      // API REQUEST
      // =====================================================

      const response = await fetch(`${API_BASE_URL}/api/events/update/${id}`, {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: data,
      });

      const result = await response.json();

      console.log("UPDATE EVENT RESPONSE:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to update event");
      }

      toast.success("Event updated successfully");

      // =====================================================
      // NAVIGATE BACK
      // =====================================================

      setTimeout(() => {
        navigate("/admin/events");
      }, 1000);
    } catch (error) {
      console.error("Update Event Error:", error);

      toast.error(error.message || "Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // BACK
  // =====================================================

  const handleBack = () => {
    navigate("/admin/events");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <ToastContainer position="top-right" autoClose={3000} theme="light" />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <Loader2
              size={38}
              className="mx-auto animate-spin text-indigo-600"
            />

            <p className="mt-4 text-sm font-medium text-gray-500">
              Loading event details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <div className="mx-auto max-w-[1100px] p-4 sm:p-6 lg:p-8">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">
          <button
            type="button"
            onClick={handleBack}
            className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-indigo-600"
          >
            <ArrowLeft size={17} />
            Back to Events
          </button>

          <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
            <CalendarDays size={17} />

            <span>Events</span>

            <span className="text-gray-300">/</span>

            <span className="text-gray-500">Edit Event</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Edit Event
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Update the event details, schedule, speaker information, images, and
            registration settings.
          </p>
        </div>

        {/* =====================================================
            FORM
        ====================================================== */}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          {/* =====================================================
              EVENT INFORMATION
          ====================================================== */}

          <div className="p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FileText size={20} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">Event Information</h2>

                <p className="mt-1 text-xs text-gray-500">
                  Update the basic event details and schedule.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* TITLE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Event Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Building Your Career in Artificial Intelligence"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Event Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Describe the event and what students will learn..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              {/* =====================================================
                  START DATE & START TIME
              ====================================================== */}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* START DATE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Event Start Date *
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>
                </div>

                {/* START TIME */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Event Start Time *
                  </label>

                  <div className="relative">
                    <Clock3
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>

                  {formData.startTime && (
                    <p className="mt-2 text-xs font-medium text-indigo-600">
                      Start: {formatTimeWithAmPm(formData.startTime)}
                    </p>
                  )}
                </div>
              </div>

              {/* =====================================================
                  END DATE & END TIME
              ====================================================== */}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* END DATE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Event End Date *
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>
                </div>

                {/* END TIME */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Event End Time *
                  </label>

                  <div className="relative">
                    <Clock3
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>

                  {formData.endTime && (
                    <p className="mt-2 text-xs font-medium text-emerald-600">
                      End: {formatTimeWithAmPm(formData.endTime)}
                    </p>
                  )}
                </div>
              </div>

              {/* EVENT SCHEDULE PREVIEW */}

              {formData.startDate &&
                formData.startTime &&
                formData.endDate &&
                formData.endTime && (
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                    <div className="flex items-start gap-3">
                      <Clock3 size={20} className="mt-1 text-indigo-600" />

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                          Event Schedule
                        </p>

                        <p className="mt-1 text-sm font-bold text-indigo-900">
                          {formData.startDate}

                          {" • "}

                          {formatTimeWithAmPm(formData.startTime)}

                          {" — "}

                          {formData.endDate}

                          {" • "}

                          {formatTimeWithAmPm(formData.endTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {/* =====================================================
                  REGISTRATION DEADLINE
              ====================================================== */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Registration Deadline *
                </label>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* DEADLINE DATE */}

                  <div className="relative">
                    <CalendarDays
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="date"
                      name="registrationDeadlineDate"
                      value={formData.registrationDeadlineDate}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>

                  {/* DEADLINE TIME */}

                  <div className="relative">
                    <Clock3
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="time"
                      name="registrationDeadlineTime"
                      value={formData.registrationDeadlineTime}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>
                </div>

                {formData.registrationDeadlineDate &&
                  formData.registrationDeadlineTime && (
                    <p className="mt-2 text-xs font-medium text-emerald-600">
                      Registration closes on {formData.registrationDeadlineDate}
                      {" at "}
                      {formatTimeWithAmPm(formData.registrationDeadlineTime)}
                    </p>
                  )}
              </div>

              {/* =====================================================
                  BANNER IMAGE
              ====================================================== */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Event Banner Image
                </label>

                <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-5">
                  <div className="flex flex-col items-center justify-center text-center">
                    <ImageIcon size={34} className="mb-2 text-indigo-500" />

                    <p className="text-sm font-semibold text-gray-700">
                      Replace Event Banner
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Select a new image only if you want to replace the
                      existing banner.
                    </p>

                    <input
                      type="file"
                      name="bannerImage"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handleChange}
                      className="mt-4 block w-full max-w-sm text-sm text-gray-500"
                    />
                  </div>
                </div>

                {bannerPreview && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Current Banner
                    </p>

                    <div className="overflow-hidden rounded-xl border border-gray-200">
                      <img
                        src={bannerPreview}
                        alt="Event Banner"
                        className="h-56 w-full object-cover"
                        onError={(e) => {
                          console.error("Banner image failed:", bannerPreview);

                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =====================================================
              SPEAKER INFORMATION
          ====================================================== */}

          <div className="border-t border-gray-100 p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <UserRound size={20} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">Speaker Information</h2>

                <p className="mt-1 text-xs text-gray-500">
                  Update the speaker profile and professional details.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* SPEAKER NAME */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Speaker Name *
                </label>

                <input
                  type="text"
                  name="speaker"
                  value={formData.speaker}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              {/* SPEAKER IMAGE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Speaker Profile Image
                </label>

                <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-5">
                  <div className="flex flex-col items-center justify-center text-center">
                    <UserRound size={34} className="mb-2 text-indigo-500" />

                    <p className="text-sm font-semibold text-gray-700">
                      Replace Speaker Image
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Select a new image to replace the existing profile image.
                    </p>

                    <input
                      type="file"
                      name="speakerImage"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handleChange}
                      className="mt-4 block w-full max-w-sm text-sm text-gray-500"
                    />
                  </div>
                </div>

                {speakerPreview && (
                  <div className="mt-5 flex justify-center">
                    <div className="text-center">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Current Speaker Image
                      </p>

                      <img
                        src={speakerPreview}
                        alt={formData.speaker}
                        className="h-32 w-32 rounded-full object-cover ring-4 ring-indigo-50"
                        onError={(e) => {
                          console.error(
                            "Speaker image failed:",
                            speakerPreview
                          );

                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ROLE & COMPANY */}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* ROLE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Speaker Role
                  </label>

                  <div className="relative">
                    <Briefcase
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      name="speakerRole"
                      value={formData.speakerRole}
                      onChange={handleChange}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>
                </div>

                {/* COMPANY */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Speaker Company
                  </label>

                  <div className="relative">
                    <Building2
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      name="speakerCompany"
                      value={formData.speakerCompany}
                      onChange={handleChange}
                      placeholder="e.g. Google"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>
                </div>
              </div>

              {/* BIO */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Speaker Bio
                </label>

                <textarea
                  name="speakerBio"
                  value={formData.speakerBio}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write a short biography of the speaker..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              {/* EXPERIENCE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Speaker Experience
                </label>

                <textarea
                  name="speakerExperience"
                  value={formData.speakerExperience}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe the speaker's professional experience..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>
            </div>
          </div>

          {/* =====================================================
              STATUS
          ====================================================== */}

          <div className="border-t border-gray-100 p-5 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">Event Status</h2>

                <p className="mt-1 text-xs text-gray-500">
                  You can manually update the event status.
                </p>
              </div>
            </div>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            >
              <option value="Upcoming">Upcoming</option>

              <option value="Registration Closed">Registration Closed</option>

              <option value="Live">Live</option>

              <option value="Completed">Completed</option>

              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* =====================================================
              FOOTER
          ====================================================== */}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 p-5 sm:flex-row sm:justify-end sm:p-7">
            <button
              type="button"
              onClick={handleBack}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft size={17} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Update Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
