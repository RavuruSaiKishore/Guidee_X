import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import {
  ArrowLeft,
  Save,
  RefreshCw,
  User,
  Briefcase,
  GraduationCap,
  MapPin,
  Clock3,
  IndianRupee,
  ShieldCheck,
  FileText,
  Upload,
  X,
  Plus,
  Trash2,
} from "lucide-react";

import "react-toastify/dist/ReactToastify.css";

const EditMentor = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const token = localStorage.getItem("AdminToken");

  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [newProfileImage, setNewProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [mentor, setMentor] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",

    location: {
      city: "",
      state: "",
      country: "",
    },

    profession: "",
    company: "",
    experience: "",
    industry: "",
    linkedin: "",

    primarySkill: [],
    category: "",

    languages: [],

    skillExperience: "",
    skillLevel: "",

    education: {
      degree: "",
      college: "",
      graduationYear: "",
      cgpa: "",
    },

    certifications: [],

    headline: "",
    about: "",
    teachingStyle: "",

    availability: {
      availableDays: [],
      preferredTime: "",
      startTime: "",
      endTime: "",
      timezone: "Asia/Kolkata",
      sessionDuration: "",
    },

    pricing: {
      sessionTypes: [],
      sessionPrice: "",
      currency: "INR",
      freeTrial: false,
      pricingNote: "",
    },

    verificationStatus: "Pending",
    accountStatus: "Active",
    suspensionReason: "",
    isVerified: false,
    rejectionReason: "",
    agreement: false,

    averageRating: 0,
    totalReviews: 0,
  });

  // =====================================================
  // FETCH MENTOR
  // =====================================================

  useEffect(() => {
    fetchMentor();
  }, [id]);

  const fetchMentor = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/mentors/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch mentor");
      }

      const m = data.mentor || data.data;

      if (!m) {
        throw new Error("Mentor data not found");
      }

      setMentor({
        firstName: m.firstName || "",
        lastName: m.lastName || "",
        email: m.email || "",
        profileImage: m.profileImage || "",
        phone: m.phone || "",
        dob: m.dob ? m.dob.substring(0, 10) : "",
        gender: m.gender || "",

        location: {
          city: m.location?.city || "",
          state: m.location?.state || "",
          country: m.location?.country || "",
        },

        profession: m.profession || "",
        company: m.company || "",
        experience: m.experience ?? "",
        industry: m.industry || "",
        linkedin: m.linkedin || "",

        primarySkill: Array.isArray(m.primarySkill) ? m.primarySkill : [],

        category: m.category || "",

        languages: Array.isArray(m.languages) ? m.languages : [],

        skillExperience: m.skillExperience ?? "",
        skillLevel: m.skillLevel || "",

        education: {
          degree: m.education?.degree || "",
          college: m.education?.college || "",
          graduationYear: m.education?.graduationYear || "",
          cgpa: m.education?.cgpa || "",
        },

        certifications: Array.isArray(m.certifications) ? m.certifications : [],

        headline: m.headline || "",
        about: m.about || "",
        teachingStyle: m.teachingStyle || "",

        availability: {
          availableDays: Array.isArray(m.availability?.availableDays)
            ? m.availability.availableDays
            : [],

          preferredTime: m.availability?.preferredTime || "",

          startTime: m.availability?.startTime || "",

          endTime: m.availability?.endTime || "",

          timezone: m.availability?.timezone || "Asia/Kolkata",

          sessionDuration: m.availability?.sessionDuration ?? "",
        },

        pricing: {
          sessionTypes: Array.isArray(m.pricing?.sessionTypes)
            ? m.pricing.sessionTypes
            : [],

          sessionPrice: m.pricing?.sessionPrice ?? "",

          currency: m.pricing?.currency || "INR",

          freeTrial: m.pricing?.freeTrial || false,

          pricingNote: m.pricing?.pricingNote || "",
        },

        verificationStatus: m.verificationStatus || "Pending",

        accountStatus: m.accountStatus || "Active",

        suspensionReason: m.suspensionReason || "",

        isVerified: m.isVerified || false,

        rejectionReason: m.rejectionReason || "",

        agreement: m.agreement || false,

        averageRating: m.averageRating || 0,

        totalReviews: m.totalReviews || 0,
      });
      setPreviewImage(getProfileImage(m.profileImage));

    if (m.profileImage) {
      setPreviewImage(getProfileImage(m.profileImage));
    } else {
      setPreviewImage("/default-avatar.png");
    }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to load mentor details");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // BASIC FIELD HANDLER
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMentor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // LOCATION HANDLER
  // =====================================================

  const handleLocationChange = (e) => {
    const { name, value } = e.target;

    setMentor((prev) => ({
      ...prev,

      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  // =====================================================
  // EDUCATION HANDLER
  // =====================================================

  const handleEducationChange = (e) => {
    const { name, value } = e.target;

    setMentor((prev) => ({
      ...prev,

      education: {
        ...prev.education,
        [name]: value,
      },
    }));
  };

  // =====================================================
  // AVAILABILITY HANDLER
  // =====================================================

  const handleAvailabilityChange = (e) => {
    const { name, value } = e.target;

    setMentor((prev) => ({
      ...prev,

      availability: {
        ...prev.availability,
        [name]: value,
      },
    }));
  };

  // =====================================================
  // PRICING HANDLER
  // =====================================================

  const handlePricingChange = (e) => {
    const { name, value } = e.target;

    setMentor((prev) => ({
      ...prev,

      pricing: {
        ...prev.pricing,
        [name]: value,
      },
    }));
  };

  // =====================================================
  // ARRAY HELPERS
  // =====================================================

  const addArrayItem = (field, value = "") => {
    if (!value.trim()) return;

    setMentor((prev) => ({
      ...prev,

      [field]: [...(prev[field] || []), value.trim()],
    }));
  };

  const removeArrayItem = (field, index) => {
    setMentor((prev) => ({
      ...prev,

      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const updateArrayItem = (field, index, value) => {
    setMentor((prev) => ({
      ...prev,

      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  // =====================================================
  // SESSION TYPES
  // =====================================================

  const addSessionType = () => {
    setMentor((prev) => ({
      ...prev,

      pricing: {
        ...prev.pricing,

        sessionTypes: [...prev.pricing.sessionTypes, ""],
      },
    }));
  };

  const updateSessionType = (index, value) => {
    setMentor((prev) => ({
      ...prev,

      pricing: {
        ...prev.pricing,

        sessionTypes: prev.pricing.sessionTypes.map((item, i) =>
          i === index ? value : item
        ),
      },
    }));
  };

  const removeSessionType = (index) => {
    setMentor((prev) => ({
      ...prev,

      pricing: {
        ...prev.pricing,

        sessionTypes: prev.pricing.sessionTypes.filter((_, i) => i !== index),
      },
    }));
  };

  // =====================================================
  // AVAILABLE DAYS
  // =====================================================

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const toggleDay = (day) => {
    setMentor((prev) => {
      const exists = prev.availability.availableDays.includes(day);

      return {
        ...prev,

        availability: {
          ...prev.availability,

          availableDays: exists
            ? prev.availability.availableDays.filter((item) => item !== day)
            : [...prev.availability.availableDays, day],
        },
      };
    });
  };

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setNewProfileImage(file);

    setPreviewImage(URL.createObjectURL(file));
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mentor.firstName.trim()) {
      toast.error("First name is required");
      return;
    }

    if (!mentor.lastName.trim()) {
      toast.error("Last name is required");
      return;
    }

    if (!mentor.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!mentor.profession.trim()) {
      toast.error("Profession is required");
      return;
    }

    if (
      !mentor.pricing.sessionPrice ||
      Number(mentor.pricing.sessionPrice) < 0
    ) {
      toast.error("Enter a valid session price");
      return;
    }

    try {
      setUpdating(true);

      const formData = new FormData();

      // Basic
      formData.append("firstName", mentor.firstName);

      formData.append("lastName", mentor.lastName);

      formData.append("email", mentor.email);

      formData.append("phone", mentor.phone);

      formData.append("dob", mentor.dob);

      formData.append("gender", mentor.gender);

      // Location
      formData.append("location", JSON.stringify(mentor.location));

      // Professional
      formData.append("profession", mentor.profession);

      formData.append("company", mentor.company);

      formData.append("experience", mentor.experience);

      formData.append("industry", mentor.industry);

      formData.append("linkedin", mentor.linkedin);

      // Expertise
      formData.append("primarySkill", JSON.stringify(mentor.primarySkill));

      formData.append("category", mentor.category);

      formData.append("languages", JSON.stringify(mentor.languages));

      formData.append("skillExperience", mentor.skillExperience);

      formData.append("skillLevel", mentor.skillLevel);

      // Education
      formData.append("education", JSON.stringify(mentor.education));

      formData.append("certifications", JSON.stringify(mentor.certifications));

      // About
      formData.append("headline", mentor.headline);

      formData.append("about", mentor.about);

      formData.append("teachingStyle", mentor.teachingStyle);

      // Availability
      formData.append("availability", JSON.stringify(mentor.availability));

      // Pricing
      formData.append("pricing", JSON.stringify(mentor.pricing));

      // Verification
      formData.append("verificationStatus", mentor.verificationStatus);

      formData.append("accountStatus", mentor.accountStatus);

      formData.append("suspensionReason", mentor.suspensionReason);

      formData.append("isVerified", mentor.isVerified);

      formData.append("rejectionReason", mentor.rejectionReason);

      formData.append("agreement", mentor.agreement);

      // Profile image
      if (newProfileImage) {
        formData.append("profileImage", newProfileImage);
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/mentors/${id}`, {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update mentor");
      }

      toast.success("Mentor updated successfully");

      setTimeout(() => {
        navigate(`/admin/mentors/${id}`);
      }, 1000);
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Failed to update mentor");
    } finally {
      setUpdating(false);
    }
  };

 const getProfileImage = (image) => {
   if (!image) {
     return "/default-avatar.png";
   }

   // Already a full URL
   if (image.startsWith("http://") || image.startsWith("https://")) {
     return image;
   }

   // Remove leading slash
   const cleanPath = image.replace(/^\/+/, "");

   // API_BASE_URL should be something like:
   // http://localhost:8080
   return `${API_BASE_URL}/${cleanPath}`;
 };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-emerald-100" />

          <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-emerald-600" />
        </div>

        <p className="mt-5 font-semibold text-slate-700">
          Loading mentor details...
        </p>

        <p className="mt-1 text-sm text-slate-400">
          Please wait while we prepare the edit page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ToastContainer />

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
              >
                <ArrowLeft size={19} />
              </button>

              <div>
                <p className="text-sm font-medium text-indigo-300">
                  Mentor Management
                </p>

                <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                  Edit Mentor
                </h1>

                <p className="mt-1 text-sm text-indigo-200">
                  Update mentor profile and account information
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fetchMentor(true)}
              disabled={refreshing}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* FORM */}
      {/* ================================================= */}

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
      >
        {/* ================================================= */}
        {/* PROFILE CARD */}
        {/* ================================================= */}

        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-violet-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <User className="text-indigo-600" size={21} />

              <div>
                <h2 className="font-bold text-slate-800">
                  Profile Information
                </h2>

                <p className="text-xs text-slate-500">
                  Basic mentor identity and profile photo
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="relative shrink-0">
                <img
                  src={previewImage || getProfileImage(mentor.profileImage)}
                  alt={`${mentor.firstName} ${mentor.lastName}`}
                  className="h-28 w-28 rounded-3xl border-4 border-indigo-100 object-cover shadow-lg"
                  onError={(e) => {
                    console.error(
                      "Profile image failed to load:",
                      e.currentTarget.src
                    );

                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/default-avatar.png";
                  }}
                />

                <label className="absolute -bottom-2 -right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg transition hover:bg-indigo-700">
                  <Upload size={17} />

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    hidden
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {mentor.firstName} {mentor.lastName}
                </h3>

                <p className="mt-1 text-sm text-slate-500">{mentor.email}</p>

                <p className="mt-3 text-xs text-slate-400">
                  Upload a new profile image if required.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* PERSONAL */}
        {/* ================================================= */}

        <Section
          icon={<User size={20} />}
          title="Personal Information"
          description="Update the mentor's personal details."
        >
          <Input
            label="First Name"
            name="firstName"
            value={mentor.firstName}
            onChange={handleChange}
            required
          />

          <Input
            label="Last Name"
            name="lastName"
            value={mentor.lastName}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={mentor.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Phone"
            name="phone"
            value={mentor.phone}
            onChange={handleChange}
          />

          <Input
            label="Date of Birth"
            name="dob"
            type="date"
            value={mentor.dob}
            onChange={handleChange}
          />

          <Select
            label="Gender"
            name="gender"
            value={mentor.gender}
            onChange={handleChange}
            options={["", "Male", "Female", "Other"]}
          />
        </Section>

        {/* ================================================= */}
        {/* LOCATION */}
        {/* ================================================= */}

        <Section
          icon={<MapPin size={20} />}
          title="Location"
          description="Mentor location information."
        >
          <Input
            label="City"
            name="city"
            value={mentor.location.city}
            onChange={handleLocationChange}
          />

          <Input
            label="State"
            name="state"
            value={mentor.location.state}
            onChange={handleLocationChange}
          />

          <Input
            label="Country"
            name="country"
            value={mentor.location.country}
            onChange={handleLocationChange}
          />
        </Section>

        {/* ================================================= */}
        {/* PROFESSIONAL */}
        {/* ================================================= */}

        <Section
          icon={<Briefcase size={20} />}
          title="Professional Information"
          description="Manage professional background and expertise."
        >
          <Input
            label="Profession"
            name="profession"
            value={mentor.profession}
            onChange={handleChange}
            required
          />

          <Input
            label="Company"
            name="company"
            value={mentor.company}
            onChange={handleChange}
          />

          <Input
            label="Experience (Years)"
            name="experience"
            type="number"
            value={mentor.experience}
            onChange={handleChange}
          />

          <Input
            label="Industry"
            name="industry"
            value={mentor.industry}
            onChange={handleChange}
          />

          <Input
            label="LinkedIn URL"
            name="linkedin"
            value={mentor.linkedin}
            onChange={handleChange}
          />

          <Input
            label="Category"
            name="category"
            value={mentor.category}
            onChange={handleChange}
          />

          <Input
            label="Skill Experience (Years)"
            name="skillExperience"
            type="number"
            value={mentor.skillExperience}
            onChange={handleChange}
          />

          <Input
            label="Skill Level"
            name="skillLevel"
            value={mentor.skillLevel}
            onChange={handleChange}
          />
        </Section>

        {/* ================================================= */}
        {/* SKILLS */}
        {/* ================================================= */}

        <ArraySection
          title="Primary Skills"
          items={mentor.primarySkill}
          onAdd={(value) => addArrayItem("primarySkill", value)}
          onRemove={(index) => removeArrayItem("primarySkill", index)}
          onUpdate={(index, value) =>
            updateArrayItem("primarySkill", index, value)
          }
        />

        <ArraySection
          title="Languages"
          items={mentor.languages}
          onAdd={(value) => addArrayItem("languages", value)}
          onRemove={(index) => removeArrayItem("languages", index)}
          onUpdate={(index, value) =>
            updateArrayItem("languages", index, value)
          }
        />

        {/* ================================================= */}
        {/* EDUCATION */}
        {/* ================================================= */}

        <Section
          icon={<GraduationCap size={20} />}
          title="Education"
          description="Mentor academic background."
        >
          <Input
            label="Degree"
            name="degree"
            value={mentor.education.degree}
            onChange={handleEducationChange}
          />

          <Input
            label="College"
            name="college"
            value={mentor.education.college}
            onChange={handleEducationChange}
          />

          <Input
            label="Graduation Year"
            name="graduationYear"
            type="number"
            value={mentor.education.graduationYear}
            onChange={handleEducationChange}
          />

          <Input
            label="CGPA"
            name="cgpa"
            value={mentor.education.cgpa}
            onChange={handleEducationChange}
          />
        </Section>

        {/* ================================================= */}
        {/* CERTIFICATIONS */}
        {/* ================================================= */}

        <ArraySection
          title="Certifications"
          items={mentor.certifications}
          onAdd={(value) => addArrayItem("certifications", value)}
          onRemove={(index) => removeArrayItem("certifications", index)}
          onUpdate={(index, value) =>
            updateArrayItem("certifications", index, value)
          }
        />

        {/* ================================================= */}
        {/* ABOUT */}
        {/* ================================================= */}

        <Section
          title="About Mentor"
          description="Manage mentor introduction and teaching information."
        >
          <div className="md:col-span-2">
            <TextArea
              label="Headline"
              name="headline"
              value={mentor.headline}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              label="About"
              name="about"
              value={mentor.about}
              onChange={handleChange}
              rows={6}
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              label="Teaching Style"
              name="teachingStyle"
              value={mentor.teachingStyle}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </Section>

        {/* ================================================= */}
        {/* AVAILABILITY */}
        {/* ================================================= */}

        <Section
          icon={<Clock3 size={20} />}
          title="Availability"
          description="Manage mentor availability and session timing."
        >
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Available Days
            </label>

            <div className="flex flex-wrap gap-2">
              {days.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    mentor.availability.availableDays.includes(day)
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Preferred Time"
            name="preferredTime"
            value={mentor.availability.preferredTime}
            onChange={handleAvailabilityChange}
          />

          <Input
            label="Start Time"
            name="startTime"
            type="time"
            value={mentor.availability.startTime}
            onChange={handleAvailabilityChange}
          />

          <Input
            label="End Time"
            name="endTime"
            type="time"
            value={mentor.availability.endTime}
            onChange={handleAvailabilityChange}
          />

          <Input
            label="Timezone"
            name="timezone"
            value={mentor.availability.timezone}
            onChange={handleAvailabilityChange}
          />

          <Input
            label="Session Duration (Minutes)"
            name="sessionDuration"
            type="number"
            value={mentor.availability.sessionDuration}
            onChange={handleAvailabilityChange}
          />
        </Section>

        {/* ================================================= */}
        {/* PRICING */}
        {/* ================================================= */}

        <Section
          icon={<IndianRupee size={20} />}
          title="Pricing"
          description="Configure session pricing and payment settings."
        >
          <Input
            label="Session Price"
            name="sessionPrice"
            type="number"
            value={mentor.pricing.sessionPrice}
            onChange={handlePricingChange}
            required
          />

          <Input
            label="Currency"
            name="currency"
            value={mentor.pricing.currency}
            onChange={handlePricingChange}
          />

          <div className="flex items-center gap-3">
            <input
              id="freeTrial"
              type="checkbox"
              checked={mentor.pricing.freeTrial}
              onChange={(e) =>
                setMentor((prev) => ({
                  ...prev,

                  pricing: {
                    ...prev.pricing,

                    freeTrial: e.target.checked,
                  },
                }))
              }
              className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />

            <label
              htmlFor="freeTrial"
              className="text-sm font-semibold text-slate-700"
            >
              Free Trial Available
            </label>
          </div>

          <div className="md:col-span-2">
            <TextArea
              label="Pricing Note"
              name="pricingNote"
              value={mentor.pricing.pricingNote}
              onChange={(e) => handlePricingChange(e)}
            />
          </div>

          <div className="md:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">
                Session Types
              </label>

              <button
                type="button"
                onClick={addSessionType}
                className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <Plus size={16} />
                Add
              </button>
            </div>

            <div className="space-y-2">
              {mentor.pricing.sessionTypes.map((type, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={type}
                    onChange={(e) => updateSessionType(index, e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    placeholder="Session type"
                  />

                  <button
                    type="button"
                    onClick={() => removeSessionType(index)}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ================================================= */}
        {/* ACCOUNT & VERIFICATION */}
        {/* ================================================= */}

        <Section
          icon={<ShieldCheck size={20} />}
          title="Account & Verification"
          description="Manage mentor account access and verification."
        >
          <Select
            label="Verification Status"
            name="verificationStatus"
            value={mentor.verificationStatus}
            onChange={handleChange}
            options={["Pending", "Approved", "Rejected"]}
          />

          <Select
            label="Account Status"
            name="accountStatus"
            value={mentor.accountStatus}
            onChange={handleChange}
            options={["Active", "Suspended"]}
          />

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={mentor.isVerified}
              onChange={(e) =>
                setMentor((prev) => ({
                  ...prev,
                  isVerified: e.target.checked,
                }))
              }
              className="h-5 w-5 rounded border-slate-300 text-indigo-600"
            />

            <span className="text-sm font-semibold text-slate-700">
              Mentor Verified
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={mentor.agreement}
              onChange={(e) =>
                setMentor((prev) => ({
                  ...prev,
                  agreement: e.target.checked,
                }))
              }
              className="h-5 w-5 rounded border-slate-300 text-indigo-600"
            />

            <span className="text-sm font-semibold text-slate-700">
              Agreement Accepted
            </span>
          </div>

          <div className="md:col-span-2">
            <TextArea
              label="Suspension Reason"
              name="suspensionReason"
              value={mentor.suspensionReason}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              label="Rejection Reason"
              name="rejectionReason"
              value={mentor.rejectionReason}
              onChange={handleChange}
            />
          </div>
        </Section>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="sticky bottom-0 z-20 mt-6 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={updating}
              className="flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updating}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updating ? (
                <>
                  <RefreshCw size={17} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditMentor;

// =====================================================
// SECTION COMPONENT
// =====================================================

const Section = ({ icon, title, description, children }) => {
  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50 px-5 py-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              {icon}
            </div>
          )}

          <div>
            <h2 className="font-bold text-slate-800">{title}</h2>

            {description && (
              <p className="mt-0.5 text-xs text-slate-500">{description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 md:grid-cols-2">
        {children}
      </div>
    </div>
  );
};

// =====================================================
// INPUT
// =====================================================

const Input = ({ label, ...props }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        {...props}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
      />
    </div>
  );
};

// =====================================================
// TEXTAREA
// =====================================================

const TextArea = ({ label, rows = 3, ...props }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <textarea
        {...props}
        rows={rows}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
      />
    </div>
  );
};

// =====================================================
// SELECT
// =====================================================

const Select = ({ label, options, ...props }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        {...props}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option || "Select"}
          </option>
        ))}
      </select>
    </div>
  );
};

// =====================================================
// ARRAY SECTION
// =====================================================

const ArraySection = ({ title, items, onAdd, onRemove, onUpdate }) => {
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (!newItem.trim()) return;

    onAdd(newItem);

    setNewItem("");
  };

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50 px-5 py-4">
        <h2 className="font-bold text-slate-800">{title}</h2>
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-4 flex gap-2">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder={`Add ${title.toLowerCase()}...`}
            className="h-11 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
          />

          <button
            type="button"
            onClick={handleAdd}
            className="flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <Plus size={17} />
            Add
          </button>
        </div>

        <div className="space-y-2">
          {items.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">
              No {title.toLowerCase()} added.
            </p>
          ) : (
            items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={item}
                  onChange={(e) => onUpdate(index, e.target.value)}
                  className="h-11 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />

                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
