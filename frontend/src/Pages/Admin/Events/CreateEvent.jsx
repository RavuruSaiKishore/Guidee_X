import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Save,
  CalendarDays,
  Clock3,
  UserRound,
  Image as ImageIcon,
  Briefcase,
  Building2,
  FileText,
  X,
  Upload,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateEvent = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();
  const { id } = useParams();

  // =====================================================
  // EDIT MODE
  // =====================================================

  const isEditMode = Boolean(id);

  // =====================================================
  // INITIAL FORM DATA
  // =====================================================

  const initialFormData = {
    // Event Basic Information
    title: "",
    description: "",

    // Event Banner
    bannerImage: null,

    // Event Date & Time
    startDateTime: "",
    endDateTime: "",

    // Speaker Information
    speaker: "",
    speakerImage: null,
    speakerRole: "",
    speakerCompany: "",
    speakerBio: "",
    speakerExperience: "",

    // Registration
    registrationDeadline: "",
  };

  // =====================================================
  // STATE
  // =====================================================

  const [formData, setFormData] = useState(initialFormData);

  const [loading, setLoading] = useState(isEditMode);

  const [saving, setSaving] = useState(false);

  // Preview URLs
  const [bannerPreview, setBannerPreview] = useState("");

  const [speakerPreview, setSpeakerPreview] = useState("");

  // Existing image paths
  // Used when editing and no new image is selected
  const [existingBannerImage, setExistingBannerImage] = useState("");

  const [existingSpeakerImage, setExistingSpeakerImage] = useState("");

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

    // Already complete URL
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
  // FORMAT DATE FOR DATETIME-LOCAL
  // =====================================================

  const formatDateTimeLocal = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      return "";
    }

    // Convert to local date/time for datetime-local input
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");

    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // =====================================================
  // FETCH SINGLE EVENT FOR EDIT
  // =====================================================

  const fetchEvent = async () => {
    if (!id) {
      return;
    }

    try {
      setLoading(true);

      const token = getAdminToken();

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

      // Handle different backend response structures
      const event = data.event || data.data || data;

      console.log("EVENT FOR EDIT:", event);

      // =====================================================
      // SET FORM DATA
      // =====================================================

      setFormData({
        title: event.title || "",

        description: event.description || "",

        // New image is null
        // Existing image is stored separately
        bannerImage: null,

        // Schema field:
        // startDateTime
        startDateTime: formatDateTimeLocal(event.startDateTime),

        // Schema field:
        // endDateTime
        endDateTime: formatDateTimeLocal(event.endDateTime),

        // Speaker
        speaker: event.speaker || "",

        // New image is null
        // Existing image is stored separately
        speakerImage: null,

        speakerRole: event.speakerRole || "",

        speakerCompany: event.speakerCompany || "",

        speakerBio: event.speakerBio || "",

        speakerExperience: event.speakerExperience || "",

        // Schema field:
        // registrationDeadline
        registrationDeadline: formatDateTimeLocal(event.registrationDeadline),
      });

      // =====================================================
      // EXISTING BANNER IMAGE
      // =====================================================

      if (event.bannerImage) {
        setExistingBannerImage(event.bannerImage);

        setBannerPreview(getImageUrl(event.bannerImage));
      } else {
        setExistingBannerImage("");

        setBannerPreview("");
      }

      // =====================================================
      // EXISTING SPEAKER IMAGE
      // =====================================================

      if (event.speakerImage) {
        setExistingSpeakerImage(event.speakerImage);

        setSpeakerPreview(getImageUrl(event.speakerImage));
      } else {
        setExistingSpeakerImage("");

        setSpeakerPreview("");
      }
    } catch (error) {
      console.error("Fetch Event Error:", error);

      toast.error(error.message || "Failed to load event");

      setTimeout(() => {
        navigate("/admin/events");
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD EVENT IN EDIT MODE
  // =====================================================

  useEffect(() => {
    if (isEditMode) {
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

      // Validate file type
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload JPG, JPEG, PNG, or WEBP image");

        return;
      }

      // Revoke old temporary preview
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

      // Validate file type
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload JPG, JPEG, PNG, or WEBP image");

        return;
      }

      // Revoke old temporary preview
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
  // REMOVE BANNER
  // =====================================================

  const removeBanner = () => {
    if (bannerPreview && bannerPreview.startsWith("blob:")) {
      URL.revokeObjectURL(bannerPreview);
    }

    setBannerPreview("");

    setExistingBannerImage("");

    setFormData((prev) => ({
      ...prev,

      bannerImage: null,
    }));
  };

  // =====================================================
  // REMOVE SPEAKER IMAGE
  // =====================================================

  const removeSpeakerImage = () => {
    if (speakerPreview && speakerPreview.startsWith("blob:")) {
      URL.revokeObjectURL(speakerPreview);
    }

    setSpeakerPreview("");

    setExistingSpeakerImage("");

    setFormData((prev) => ({
      ...prev,

      speakerImage: null,
    }));
  };

  // =====================================================
  // VALIDATE FORM
  // =====================================================

  const validateForm = () => {
    // Required fields
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.startDateTime ||
      !formData.endDateTime ||
      !formData.speaker.trim() ||
      !formData.registrationDeadline
    ) {
      toast.error("Please fill all required fields");

      return false;
    }

    // =====================================================
    // CREATE DATE OBJECTS
    // =====================================================

    const eventStartDate = new Date(formData.startDateTime);

    const eventEndDate = new Date(formData.endDateTime);

    const registrationDeadlineDate = new Date(formData.registrationDeadline);

    // =====================================================
    // CHECK VALID DATES
    // =====================================================

    if (
      isNaN(eventStartDate.getTime()) ||
      isNaN(eventEndDate.getTime()) ||
      isNaN(registrationDeadlineDate.getTime())
    ) {
      toast.error("Please enter valid date and time");

      return false;
    }

    // =====================================================
    // REGISTRATION DEADLINE
    // MUST BE BEFORE EVENT START
    // =====================================================

    if (registrationDeadlineDate >= eventStartDate) {
      toast.error("Registration deadline must be before the event starts");

      return false;
    }

    // =====================================================
    // EVENT END
    // MUST BE AFTER EVENT START
    // =====================================================

    if (eventEndDate <= eventStartDate) {
      toast.error("Event end time must be after the event start time");

      return false;
    }

    return true;
  };

  // =====================================================
  // SUBMIT FORM
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // =====================================================
    // VALIDATE
    // =====================================================

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const token = getAdminToken();

      // =====================================================
      // API URL
      // =====================================================

      const url = isEditMode
        ? `${API_BASE_URL}/api/events/update/${id}`
        : `${API_BASE_URL}/api/events/create`;

      // =====================================================
      // HTTP METHOD
      // =====================================================

      const method = isEditMode ? "PUT" : "POST";

      // =====================================================
      // CREATE FORM DATA
      // =====================================================

      const data = new FormData();

      // =====================================================
      // EVENT BASIC INFORMATION
      // =====================================================

      data.append("title", formData.title.trim());

      data.append("description", formData.description.trim());

      // =====================================================
      // EVENT DATE & TIME
      // Matches Event Schema
      // =====================================================

      data.append("startDateTime", formData.startDateTime);

      data.append("endDateTime", formData.endDateTime);

      // =====================================================
      // SPEAKER INFORMATION
      // =====================================================

      data.append("speaker", formData.speaker.trim());

      data.append("speakerRole", formData.speakerRole.trim());

      data.append("speakerCompany", formData.speakerCompany.trim());

      data.append("speakerBio", formData.speakerBio.trim());

      data.append("speakerExperience", formData.speakerExperience.trim());

      // =====================================================
      // REGISTRATION DEADLINE
      // =====================================================

      data.append("registrationDeadline", formData.registrationDeadline);

      // =====================================================
      // BANNER IMAGE
      //
      // Only send when a new image is selected
      // =====================================================

      if (formData.bannerImage instanceof File) {
        data.append("bannerImage", formData.bannerImage);
      }

      // =====================================================
      // SPEAKER IMAGE
      //
      // Only send when a new image is selected
      // =====================================================

      if (formData.speakerImage instanceof File) {
        data.append("speakerImage", formData.speakerImage);
      }

      // =====================================================
      // EXISTING IMAGES
      //
      // Send these during edit if they were not removed
      // and no new file was selected.
      // =====================================================

      if (
        isEditMode &&
        existingBannerImage &&
        !(formData.bannerImage instanceof File)
      ) {
        data.append("existingBannerImage", existingBannerImage);
      }

      if (
        isEditMode &&
        existingSpeakerImage &&
        !(formData.speakerImage instanceof File)
      ) {
        data.append("existingSpeakerImage", existingSpeakerImage);
      }

      // =====================================================
      // IMPORTANT
      //
      // STATUS IS NOT SENT FROM FRONTEND.
      //
      // Backend should automatically calculate:
      //
      // Upcoming
      // Registration Closed
      // Live
      // Completed
      // Cancelled
      //
      // This prevents admins from manually setting an
      // incorrect status.
      // =====================================================

      // =====================================================
      // DEBUG FORM DATA
      // =====================================================

      for (const [key, value] of data.entries()) {
        console.log("FORM DATA:", key, value);
      }

      // =====================================================
      // API REQUEST
      // =====================================================

      const response = await fetch(url, {
        method,

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: data,
      });

      const result = await response.json();

      console.log("SAVE EVENT RESPONSE:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to save event");
      }

      // =====================================================
      // SUCCESS MESSAGE
      // =====================================================

      toast.success(
        isEditMode ? "Event updated successfully" : "Event created successfully"
      );

      // =====================================================
      // NAVIGATE BACK
      // =====================================================

      setTimeout(() => {
        navigate("/admin/events");
      }, 1000);
    } catch (error) {
      console.error("Save Event Error:", error);

      toast.error(error.message || "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {
    navigate("/admin/events");
  };

  // =====================================================
  // CLEANUP BLOB URLS
  // =====================================================

  useEffect(() => {
    return () => {
      if (bannerPreview && bannerPreview.startsWith("blob:")) {
        URL.revokeObjectURL(bannerPreview);
      }

      if (speakerPreview && speakerPreview.startsWith("blob:")) {
        URL.revokeObjectURL(speakerPreview);
      }
    };
  }, []);

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <ToastContainer position="top-right" autoClose={3000} theme="light" />

        <div className="mx-auto max-w-[1000px] p-4 sm:p-6 lg:p-8">
          <div className="animate-pulse">
            <div className="h-8 w-56 rounded-lg bg-gray-200" />

            <div className="mt-3 h-4 w-80 rounded bg-gray-200" />

            <div className="mt-8 h-[700px] rounded-2xl bg-white" />
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

      <div className="mx-auto max-w-[1000px] p-4 sm:p-6 lg:p-8">
        {/* =====================================================
            TOP HEADER
        ====================================================== */}

        <div className="mb-8">
          <button
            type="button"
            onClick={handleCancel}
            className="mb-5 flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-indigo-600"
          >
            <ArrowLeft size={18} />
            Back to Events
          </button>

          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <CalendarDays size={17} />

              <span>Events</span>

              <span className="text-gray-300">/</span>

              <span className="text-gray-500">
                {isEditMode ? "Edit Event" : "Create Event"}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {isEditMode ? "Edit Event" : "Create New Event"}
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {isEditMode
                ? "Update the event details and speaker information."
                : "Create a new webinar, workshop, mentoring session, or event for GuideX students."}
            </p>
          </div>
        </div>

        {/* =====================================================
            FORM CARD
        ====================================================== */}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          {/* =====================================================
              EVENT INFORMATION
          ====================================================== */}

          <div className="border-b border-gray-100 p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FileText size={20} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">Event Information</h2>

                <p className="mt-1 text-xs text-gray-500">
                  Add the basic details of your event.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* EVENT TITLE */}

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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
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
                  placeholder="Describe what students will learn, who should attend, and what they can expect from this event..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              {/* BANNER IMAGE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Event Banner Image
                </label>

                <div className="overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
                  {bannerPreview ? (
                    <div className="relative">
                      <img
                        src={bannerPreview}
                        alt="Event Banner Preview"
                        className="h-64 w-full object-cover"
                      />

                      <div className="absolute right-4 top-4">
                        <button
                          type="button"
                          onClick={removeBanner}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-600 shadow-lg transition hover:bg-red-50 hover:text-red-600"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                        <p className="text-sm font-semibold text-white">
                          Event Banner
                        </p>

                        <p className="mt-1 text-xs text-white/80">
                          Select another image to replace it.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center px-5 py-12 text-center transition hover:bg-indigo-50">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                        <ImageIcon size={28} />
                      </div>

                      <p className="mt-4 text-sm font-bold text-gray-700">
                        Upload Event Banner
                      </p>

                      <p className="mt-1 max-w-md text-xs leading-5 text-gray-500">
                        Upload a JPG, JPEG, PNG, or WEBP image.
                      </p>

                      <div className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white">
                        <Upload size={15} />
                        Choose Image
                      </div>

                      <input
                        type="file"
                        name="bannerImage"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* EVENT START & END */}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* EVENT START */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Event Start Date & Time *
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="datetime-local"
                      name="startDateTime"
                      value={formData.startDateTime}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    When the event will start.
                  </p>
                </div>

                {/* EVENT END */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Event End Date & Time *
                  </label>

                  <div className="relative">
                    <Clock3
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="datetime-local"
                      name="endDateTime"
                      value={formData.endDateTime}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    When the event will end.
                  </p>
                </div>
              </div>

              {/* REGISTRATION DEADLINE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Registration Deadline *
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="datetime-local"
                    name="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Students cannot register after this time.
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              SPEAKER INFORMATION
          ====================================================== */}

          <div className="border-b border-gray-100 p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <UserRound size={20} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">Speaker Information</h2>

                <p className="mt-1 text-xs text-gray-500">
                  Add information about the event speaker.
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              {/* SPEAKER IMAGE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Speaker Profile Image
                </label>

                <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6">
                  <div className="flex flex-col items-center">
                    {speakerPreview ? (
                      <div className="relative">
                        <img
                          src={speakerPreview}
                          alt="Speaker Preview"
                          className="h-32 w-32 rounded-full object-cover ring-4 ring-indigo-50"
                        />

                        <button
                          type="button"
                          onClick={removeSpeakerImage}
                          className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 shadow-lg transition hover:bg-red-50 hover:text-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                        <UserRound size={40} />
                      </div>
                    )}

                    <label className="mt-5 flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600">
                      <Upload size={17} />

                      {speakerPreview
                        ? "Change Speaker Image"
                        : "Upload Speaker Image"}

                      <input
                        type="file"
                        name="speakerImage"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* ROLE + COMPANY */}

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
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
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
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
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
                  placeholder="Write a short professional biography of the speaker..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
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
                  placeholder="Describe the speaker's professional experience, achievements, or expertise..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>
            </div>
          </div>

          {/* =====================================================
              AUTOMATIC STATUS INFORMATION
          ====================================================== */}

          <div className="border-b border-gray-100 bg-indigo-50/50 p-5 sm:p-7">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Clock3 size={20} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Automatic Event Status
                </h2>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Event status is managed automatically based on the
                  registration deadline, event start time, and event end time.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-gray-600 sm:grid-cols-2">
                  <div className="rounded-lg bg-white px-3 py-2 border border-gray-100">
                    <span className="font-semibold text-gray-800">
                      Upcoming:
                    </span>{" "}
                    Before event starts
                  </div>

                  <div className="rounded-lg bg-white px-3 py-2 border border-gray-100">
                    <span className="font-semibold text-gray-800">
                      Registration Closed:
                    </span>{" "}
                    Deadline passed
                  </div>

                  <div className="rounded-lg bg-white px-3 py-2 border border-gray-100">
                    <span className="font-semibold text-gray-800">Live:</span>{" "}
                    Event is currently running
                  </div>

                  <div className="rounded-lg bg-white px-3 py-2 border border-gray-100">
                    <span className="font-semibold text-gray-800">
                      Completed:
                    </span>{" "}
                    Event end time passed
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              FOOTER
          ====================================================== */}

          <div className="flex flex-col-reverse gap-3 bg-gray-50 p-5 sm:flex-row sm:justify-end sm:p-7">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={17} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />

              {saving
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Event"
                : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
