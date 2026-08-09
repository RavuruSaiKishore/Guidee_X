import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Save,
  CalendarDays,
  Clock3,
  UserRound,
  Image as ImageIcon,
  FileText,
  X,
  Upload,
  Layers,
  Video,
  Users,
  Plus,
  Trash2,
  Tag,
  DollarSign,
  Globe,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateEvent = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  // =====================================================
  // DOMAINS ENUM (Matches Mongoose Schema)
  // =====================================================
  const DOMAINS = [
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

  // =====================================================
  // INITIAL FORM STATE (Contains ALL Mongoose Fields)
  // =====================================================
  const initialFormData = {
    title: "",
    slug: "",
    shortSummary: "",
    description: "",
    domain: "Software Engineering",
    tags: "",
    bannerImage: null,

    createdByAdmin: "Guideex Admin",

    speakers: [
      {
        name: "",
        title: "",
        organization: "",
        bio: "",
        linkedinUrl: "",
        profileImage: null,
        previewUrl: "",
        existingImage: "",
      },
    ],

    experienceLevel: "All Levels",
    prerequisites: "",

    eventType: "Guest Lecture",
    meetingUrl: "",
    recordingUrl: "",

    startDateTime: "",
    endDateTime: "",
    registrationDeadline: "",

    maxSeats: 100,
    registeredStudentsCount: 0,
    isPaid: false,
    ticketPrice: 0,

    status: "Draft",
    isFeatured: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);

  // Banner Preview
  const [bannerPreview, setBannerPreview] = useState("");
  const [existingBannerImage, setExistingBannerImage] = useState("");

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

  const formatDateTimeLocal = (dateValue) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // =====================================================
  // FETCH EVENT DETAILS FOR EDIT
  // =====================================================
  const fetchEvent = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const token = getAdminToken();

      const response = await fetch(
        `${API_BASE_URL}/api/events/eventDetails/${id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to load event");
      }

      const event = data.event || data.data || data;

      setFormData({
        title: event.title || "",
        slug: event.slug || "",
        shortSummary: event.shortSummary || "",
        description: event.description || "",
        domain: event.domain || "Software Engineering",
        tags: Array.isArray(event.tags) ? event.tags.join(", ") : "",
        bannerImage: null,

        createdByAdmin: event.createdByAdmin || "Guideex Admin",

        speakers:
          event.speakers && event.speakers.length > 0
            ? event.speakers.map((spk) => ({
                name: spk.name || "",
                title: spk.title || "",
                organization: spk.organization || "",
                bio: spk.bio || "",
                linkedinUrl: spk.linkedinUrl || "",
                profileImage: null,
                previewUrl: spk.profileImage
                  ? getImageUrl(spk.profileImage)
                  : "",
                existingImage: spk.profileImage || "",
              }))
            : [
                {
                  name: "",
                  title: "",
                  organization: "",
                  bio: "",
                  linkedinUrl: "",
                  profileImage: null,
                  previewUrl: "",
                  existingImage: "",
                },
              ],

        experienceLevel: event.targetAudience?.experienceLevel || "All Levels",
        prerequisites: Array.isArray(event.targetAudience?.prerequisites)
          ? event.targetAudience.prerequisites.join(", ")
          : "",

        eventType: event.eventType || "Guest Lecture",
        meetingUrl: event.meetingUrl || "",
        recordingUrl: event.recordingUrl || "",

        startDateTime: formatDateTimeLocal(event.startDateTime),
        endDateTime: formatDateTimeLocal(event.endDateTime),
        registrationDeadline: formatDateTimeLocal(event.registrationDeadline),

        maxSeats: event.maxSeats ?? 100,
        registeredStudentsCount: event.registeredStudentsCount ?? 0,
        isPaid: Boolean(event.isPaid),
        ticketPrice: event.ticketPrice ?? 0,

        status: event.status || "Draft",
        isFeatured: Boolean(event.isFeatured),
      });

      if (event.bannerImage) {
        setExistingBannerImage(event.bannerImage);
        setBannerPreview(getImageUrl(event.bannerImage));
      }
      setAutoSlug(false);
    } catch (error) {
      console.error("Fetch Event Error:", error);
      toast.error(error.message || "Failed to load event");
      setTimeout(() => navigate("/admin/events"), 1500);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode) fetchEvent();
  }, [id]);

  // =====================================================
  // AUTO GENERATE SLUG FROM TITLE
  // =====================================================
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, title: val };
      if (autoSlug) {
        updated.slug = val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      }
      return updated;
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================================================
  // BANNER IMAGE HANDLERS
  // =====================================================
  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Upload a PNG, JPG, or WEBP image.");
      return;
    }

    if (bannerPreview && bannerPreview.startsWith("blob:")) {
      URL.revokeObjectURL(bannerPreview);
    }

    setFormData((prev) => ({ ...prev, bannerImage: file }));
    setBannerPreview(URL.createObjectURL(file));
  };

  const removeBanner = () => {
    if (bannerPreview && bannerPreview.startsWith("blob:")) {
      URL.revokeObjectURL(bannerPreview);
    }
    setBannerPreview("");
    setExistingBannerImage("");
    setFormData((prev) => ({ ...prev, bannerImage: null }));
  };

  // =====================================================
  // DYNAMIC SPEAKERS HANDLERS
  // =====================================================
  const handleSpeakerChange = (idx, field, val) => {
    setFormData((prev) => {
      const updated = [...prev.speakers];
      updated[idx][field] = val;
      return { ...prev, speakers: updated };
    });
  };

  const handleSpeakerImageChange = (idx, file) => {
    if (!file) return;
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Upload a PNG, JPG, or WEBP photo.");
      return;
    }

    setFormData((prev) => {
      const updated = [...prev.speakers];
      if (
        updated[idx].previewUrl &&
        updated[idx].previewUrl.startsWith("blob:")
      ) {
        URL.revokeObjectURL(updated[idx].previewUrl);
      }
      updated[idx].profileImage = file;
      updated[idx].previewUrl = URL.createObjectURL(file);
      return { ...prev, speakers: updated };
    });
  };

  const removeSpeakerImage = (idx) => {
    setFormData((prev) => {
      const updated = [...prev.speakers];
      if (
        updated[idx].previewUrl &&
        updated[idx].previewUrl.startsWith("blob:")
      ) {
        URL.revokeObjectURL(updated[idx].previewUrl);
      }
      updated[idx].profileImage = null;
      updated[idx].previewUrl = "";
      updated[idx].existingImage = "";
      return { ...prev, speakers: updated };
    });
  };

  const addSpeaker = () => {
    setFormData((prev) => ({
      ...prev,
      speakers: [
        ...prev.speakers,
        {
          name: "",
          title: "",
          organization: "",
          bio: "",
          linkedinUrl: "",
          profileImage: null,
          previewUrl: "",
          existingImage: "",
        },
      ],
    }));
  };

  const removeSpeaker = (idx) => {
    if (formData.speakers.length === 1) {
      toast.error("At least one guest speaker is required.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      speakers: prev.speakers.filter((_, i) => i !== idx),
    }));
  };

  // =====================================================
  // FORM VALIDATION
  // =====================================================
  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Event title is required.");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Event description is required.");
      return false;
    }
    if (!formData.domain) {
      toast.error("Domain field is required.");
      return false;
    }
    if (!formData.startDateTime) {
      toast.error("Start Date/Time is required.");
      return false;
    }
    if (!formData.endDateTime) {
      toast.error("End Date/Time is required.");
      return false;
    }
    if (!formData.registrationDeadline) {
      toast.error("Registration deadline is required.");
      return false;
    }

    for (let i = 0; i < formData.speakers.length; i++) {
      const s = formData.speakers[i];
      if (!s.name.trim() || !s.title.trim() || !s.organization.trim()) {
        toast.error(
          `Speaker #${i + 1} requires Name, Title, and Organization.`
        );
        return false;
      }
    }

    const start = new Date(formData.startDateTime);
    const end = new Date(formData.endDateTime);
    const deadline = new Date(formData.registrationDeadline);

    if (
      isNaN(start.getTime()) ||
      isNaN(end.getTime()) ||
      isNaN(deadline.getTime())
    ) {
      toast.error("Please enter valid dates.");
      return false;
    }

    if (deadline >= start) {
      toast.error("Registration deadline must be before event start time.");
      return false;
    }

    if (end <= start) {
      toast.error("Event end time must be after start time.");
      return false;
    }

    return true;
  };

  // =====================================================
  // SUBMIT FORM
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      const token = getAdminToken();
      const url = isEditMode
        ? `${API_BASE_URL}/api/events/update/${id}`
        : `${API_BASE_URL}/api/events/create`;

      const method = isEditMode ? "PUT" : "POST";
      const data = new FormData();

      // Basic Information
      data.append("title", formData.title.trim());
      data.append("slug", formData.slug.trim());
      data.append("shortSummary", formData.shortSummary.trim());
      data.append("description", formData.description.trim());
      data.append("domain", formData.domain);
      data.append("eventType", formData.eventType);
      data.append("meetingUrl", formData.meetingUrl.trim());
      data.append("recordingUrl", formData.recordingUrl.trim());
      data.append("createdByAdmin", formData.createdByAdmin.trim());

      // Parse tags
      const tagArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      data.append("tags", JSON.stringify(tagArray));

      // Target Audience Object
      const targetAudienceObj = {
        experienceLevel: formData.experienceLevel,
        prerequisites: formData.prerequisites
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
      };
      data.append("targetAudience", JSON.stringify(targetAudienceObj));

      // Schedule & Timings
      data.append("startDateTime", formData.startDateTime);
      data.append("endDateTime", formData.endDateTime);
      data.append("registrationDeadline", formData.registrationDeadline);

      // Seats & Ticket Pricing
      data.append("maxSeats", Number(formData.maxSeats));
      data.append(
        "registeredStudentsCount",
        Number(formData.registeredStudentsCount)
      );
      data.append("isPaid", formData.isPaid);
      data.append(
        "ticketPrice",
        formData.isPaid ? Number(formData.ticketPrice) : 0
      );

      // Status & Featured
      data.append("status", formData.status);
      data.append("isFeatured", formData.isFeatured);

      // Banner Image
      if (formData.bannerImage instanceof File) {
        data.append("bannerImage", formData.bannerImage);
      } else if (isEditMode && existingBannerImage) {
        data.append("existingBannerImage", existingBannerImage);
      }

      // Speakers Data Array
      const speakersTextData = formData.speakers.map((spk) => ({
        name: spk.name.trim(),
        title: spk.title.trim(),
        organization: spk.organization.trim(),
        bio: spk.bio.trim(),
        linkedinUrl: spk.linkedinUrl.trim(),
        existingImage: spk.existingImage || "",
      }));
      data.append("speakers", JSON.stringify(speakersTextData));

      // Append individual speaker image files
      formData.speakers.forEach((spk) => {
        if (spk.profileImage instanceof File) {
          data.append("speakerImages", spk.profileImage);
        }
      });

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to save event");
      }

      toast.success(
        isEditMode
          ? "Event updated successfully!"
          : "Event created successfully!"
      );
      setTimeout(() => navigate("/admin/events"), 1000);
    } catch (error) {
      console.error("Save Event Error:", error);
      toast.error(error.message || "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-8">
        <ToastContainer position="top-right" autoClose={3000} theme="light" />
        <div className="mx-auto max-w-[1000px] animate-pulse">
          <div className="h-8 w-56 rounded-lg bg-gray-200" />
          <div className="mt-8 h-[700px] rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <div className="mx-auto max-w-[1000px] p-4 sm:p-6 lg:p-8">
        {/* TOP HEADER */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/admin/events")}
            className="mb-5 flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-indigo-600"
          >
            <ArrowLeft size={18} /> Back to Events
          </button>

          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <CalendarDays size={17} />
              <span>Guideex Events</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-500">
                {isEditMode ? "Edit Event" : "Create Event"}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {isEditMode ? "Edit Event Details" : "Create New Guest Event"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Configure guest lectures, workshops, masterclasses, and field
              webinars for Guideex students.
            </p>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          {/* SECTION 1: BASIC INFO, SLUG & DOMAIN */}
          <div className="space-y-5 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">
                  Event Details & Domain
                </h2>
                <p className="text-xs text-gray-500">
                  Basic event identification, slug, and category.
                </p>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Masterclass: System Design and Microservices in 2026"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            {/* Slug */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700">
                  URL Slug
                </label>
                <button
                  type="button"
                  onClick={() => setAutoSlug(!autoSlug)}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  <Sparkles size={13} />
                  {autoSlug ? "Manual Edit" : "Auto Generate"}
                </button>
              </div>
              <div className="relative">
                <Globe
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  readOnly={autoSlug}
                  placeholder="masterclass-system-design-2026"
                  className={`w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none ${
                    autoSlug
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-gray-50 text-gray-800 focus:border-indigo-500 focus:bg-white"
                  }`}
                />
              </div>
            </div>

            {/* Domain & Event Type */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Domain Field *
                </label>
                <div className="relative">
                  <Layers
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    name="domain"
                    value={formData.domain}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  >
                    {DOMAINS.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Format / Event Type
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                >
                  <option value="Guest Lecture">Guest Lecture</option>
                  <option value="Masterclass">Masterclass</option>
                  <option value="Panel Discussion">Panel Discussion</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>
            </div>

            {/* Created By Admin */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Created By (Admin Name)
              </label>
              <input
                type="text"
                name="createdByAdmin"
                value={formData.createdByAdmin}
                onChange={handleChange}
                placeholder="e.g. Guideex Admin"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            {/* Short Summary */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Short Summary (Card Preview - max 300 chars)
              </label>
              <input
                type="text"
                name="shortSummary"
                value={formData.shortSummary}
                onChange={handleChange}
                maxLength={300}
                placeholder="A quick 1-2 sentence overview shown on event cards..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Full Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Full event overview, key learning takeaways, agenda, and outcomes..."
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            {/* Tags & Prerequisites */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Tags (Comma-separated)
                </label>
                <div className="relative">
                  <Tag
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="react, system-design, ai"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Prerequisites (Comma-separated)
                </label>
                <input
                  type="text"
                  name="prerequisites"
                  value={formData.prerequisites}
                  onChange={handleChange}
                  placeholder="Basic JavaScript, Knowledge of SQL"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Target Audience Experience Level
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              >
                <option value="All Levels">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Banner Image */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Event Banner Image
              </label>
              <div className="overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
                {bannerPreview ? (
                  <div className="relative">
                    <img
                      src={bannerPreview}
                      alt="Banner Preview"
                      className="h-56 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeBanner}
                      className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-600 shadow-lg transition hover:bg-red-50 hover:text-red-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center p-8 text-center transition hover:bg-indigo-50">
                    <ImageIcon size={32} className="text-indigo-600" />
                    <p className="mt-2 text-sm font-bold text-gray-700">
                      Upload Event Banner
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: GUEST SPEAKERS */}
          <div className="space-y-6 border-b border-gray-100 pb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <UserRound size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">
                    Guest Speakers / Faculty
                  </h2>
                  <p className="text-xs text-gray-500">
                    External experts delivering the lecture or masterclass.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={addSpeaker}
                className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100"
              >
                <Plus size={16} /> Add Speaker
              </button>
            </div>

            {formData.speakers.map((speaker, idx) => (
              <div
                key={idx}
                className="relative space-y-4 rounded-2xl border border-gray-200 bg-gray-50/50 p-5"
              >
                <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Speaker #{idx + 1}
                  </span>
                  {formData.speakers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpeaker(idx)}
                      className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={15} /> Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                      Speaker Name *
                    </label>
                    <input
                      type="text"
                      value={speaker.name}
                      onChange={(e) =>
                        handleSpeakerChange(idx, "name", e.target.value)
                      }
                      placeholder="e.g. Dr. Aris Thorne"
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                      Title / Designation *
                    </label>
                    <input
                      type="text"
                      value={speaker.title}
                      onChange={(e) =>
                        handleSpeakerChange(idx, "title", e.target.value)
                      }
                      placeholder="e.g. Senior AI Researcher"
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                      Organization / University *
                    </label>
                    <input
                      type="text"
                      value={speaker.organization}
                      onChange={(e) =>
                        handleSpeakerChange(idx, "organization", e.target.value)
                      }
                      placeholder="e.g. Google / Stanford"
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                      LinkedIn URL
                    </label>
                    <input
                      type="text"
                      value={speaker.linkedinUrl}
                      onChange={(e) =>
                        handleSpeakerChange(idx, "linkedinUrl", e.target.value)
                      }
                      placeholder="https://linkedin.com/in/username"
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                      Bio
                    </label>
                    <input
                      type="text"
                      value={speaker.bio}
                      onChange={(e) =>
                        handleSpeakerChange(idx, "bio", e.target.value)
                      }
                      placeholder="Short professional biography..."
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Speaker Photo */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Profile Image
                  </label>
                  <div className="flex items-center gap-4">
                    {speaker.previewUrl ? (
                      <div className="relative">
                        <img
                          src={speaker.previewUrl}
                          alt="Speaker"
                          className="h-14 w-14 rounded-full object-cover ring-2 ring-indigo-100"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpeakerImage(idx)}
                          className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-indigo-50 hover:text-indigo-600">
                        <Upload size={14} /> Upload Speaker Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleSpeakerImageChange(idx, e.target.files?.[0])
                          }
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SECTION 3: SCHEDULE, TIMINGS & MEETING ROOMS */}
          <div className="space-y-5 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Clock3 size={20} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">
                  Schedule & Virtual Links
                </h2>
                <p className="text-xs text-gray-500">
                  Event date, registration deadline, live meeting, and recording
                  links.
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Live Meeting URL (Google Meet / Zoom)
                </label>
                <div className="relative">
                  <Video
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="url"
                    name="meetingUrl"
                    value={formData.meetingUrl}
                    onChange={handleChange}
                    placeholder="https://meet.google.com/xyz-abc-def"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Post-Event Recording URL
                </label>
                <input
                  type="url"
                  name="recordingUrl"
                  value={formData.recordingUrl}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=xyz or Drive link"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="startDateTime"
                  value={formData.startDateTime}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="endDateTime"
                  value={formData.endDateTime}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Registration Deadline *
                </label>
                <input
                  type="datetime-local"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: CAPACITY, REGISTRATIONS & TICKETING */}
          <div className="space-y-5 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Users size={20} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Capacity & Pricing</h2>
                <p className="text-xs text-gray-500">
                  Seat thresholds and ticket prices.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Max Seats Limit *
                </label>
                <input
                  type="number"
                  name="maxSeats"
                  min={1}
                  value={formData.maxSeats}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Current Registered Count
                </label>
                <input
                  type="number"
                  name="registeredStudentsCount"
                  min={0}
                  value={formData.registeredStudentsCount}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Pricing Type
                </label>
                <select
                  name="isPaid"
                  value={formData.isPaid}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPaid: e.target.value === "true",
                    }))
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:bg-white"
                >
                  <option value="false">Free Event</option>
                  <option value="true">Paid Event</option>
                </select>
              </div>

              {formData.isPaid && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Ticket Price ($)
                  </label>
                  <div className="relative">
                    <DollarSign
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="number"
                      name="ticketPrice"
                      min={0}
                      value={formData.ticketPrice}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 5: PUBLISH STATUS & FEATURED TOGGLE */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">
                  Publish & Visibility
                </h2>
                <p className="text-xs text-gray-500">
                  Set publication status and feature flag.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Publish Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:bg-white"
                >
                  <option value="Draft">Draft (Hidden from students)</option>
                  <option value="Published">
                    Published (Live for registration)
                  </option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center pt-6">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-semibold text-gray-800">
                    Feature on Guideex Landing Page Carousel
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/events")}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-60"
            >
              <X size={17} /> Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:opacity-60"
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
