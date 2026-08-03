import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building2,
  CalendarDays,
  BadgeCheck,
  ShieldCheck,
  Star,
  Save,
  X,
  Loader2,
  ArrowLeft,
  Globe2,
  GraduationCap,
  Languages,
  Camera,
  Link as LinkIcon,
  DollarSign,
  Clock3,
  BookOpen,
} from "lucide-react";

const EditMentorProfile = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [mentor, setMentor] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    headline: "",
    about: "",
    teachingStyle: "",
    linkedin: "",
    profession: "",
    company: "",
    industry: "",
    experience: "",
    skillLevel: "",
    skillExperience: "",
    category: "",
    primarySkill: [],
    languages: [],
    location: {
      city: "",
      state: "",
      country: "",
    },
    education: {
      degree: "",
      college: "",
      graduationYear: "",
      cgpa: "",
    },
    pricing: {
      sessionPrice: "",
    },
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");

  const [skillInput, setSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");

  // =========================================================
  // AUTH HEADERS
  // =========================================================

  const authHeaders = () => {
    const token = localStorage.getItem("MentorToken");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // =========================================================
  // FILE URL
  // =========================================================

  const getFileUrl = (filePath) => {
    if (!filePath) return "";

    if (
      filePath.startsWith("http://") ||
      filePath.startsWith("https://") ||
      filePath.startsWith("blob:")
    ) {
      return filePath;
    }

    return `${API_BASE_URL}/${filePath.replace(/^\/+/, "")}`;
  };

  // =========================================================
  // DEFAULT PROFILE IMAGE
  // =========================================================

  const getDefaultAvatar = (data = mentor) => {
    const name = `${data?.firstName || "Mentor"} ${
      data?.lastName || ""
    }`.trim();

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=C9A227&color=14213D&size=300`;
  };

  // =========================================================
  // FETCH PROFILE
  // =========================================================

  const fetchMentorProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("MentorToken");

      if (!token) {
        setError("Mentor authentication token not found.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/mentor/profile`, {
        method: "GET",
        headers: authHeaders(),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch mentor profile");
      }

      const mentorData = data.mentor;

      setMentor(mentorData);

      setFormData({
        firstName: mentorData.firstName || "",
        lastName: mentorData.lastName || "",
        email: mentorData.email || "",
        phone: mentorData.phone || "",

        headline: mentorData.headline || "",
        about: mentorData.about || "",
        teachingStyle: mentorData.teachingStyle || "",
        linkedin: mentorData.linkedin || "",

        profession: mentorData.profession || "",
        company: mentorData.company || "",
        industry: mentorData.industry || "",
        experience: mentorData.experience || "",
        skillLevel: mentorData.skillLevel || "",
        skillExperience: mentorData.skillExperience || "",
        category: mentorData.category || "",

        primarySkill: Array.isArray(mentorData.primarySkill)
          ? mentorData.primarySkill
          : [],

        languages: Array.isArray(mentorData.languages)
          ? mentorData.languages
          : [],

        location: {
          city: mentorData.location?.city || "",
          state: mentorData.location?.state || "",
          country: mentorData.location?.country || "",
        },

        education: {
          degree: mentorData.education?.degree || "",
          college: mentorData.education?.college || "",
          graduationYear: mentorData.education?.graduationYear || "",
          cgpa: mentorData.education?.cgpa || "",
        },

        pricing: {
          sessionPrice: mentorData.pricing?.sessionPrice || "",
        },
      });

      setProfilePreview(
        mentorData.profileImage
          ? getFileUrl(mentorData.profileImage)
          : getDefaultAvatar(mentorData)
      );
    } catch (err) {
      console.error("Error fetching mentor profile:", err);

      setError(err.message || "Unable to load mentor profile.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchMentorProfile();
  }, []);

  // =========================================================
  // NORMAL INPUT CHANGE
  // =========================================================

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================================================
  // NESTED INPUT CHANGE
  // =========================================================

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // =========================================================
  // PROFILE IMAGE CHANGE
  // =========================================================

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Optional validation
    if (!file.type.startsWith("image/")) {
      setSaveError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSaveError("Profile image must be smaller than 5MB.");
      return;
    }

    setProfileImage(file);

    const previewUrl = URL.createObjectURL(file);

    setProfilePreview(previewUrl);

    setSaveError("");
  };

  // =========================================================
  // ADD SKILL
  // =========================================================

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    if (formData.primarySkill.includes(skill)) {
      setSkillInput("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      primarySkill: [...prev.primarySkill, skill],
    }));

    setSkillInput("");
  };

  // =========================================================
  // REMOVE SKILL
  // =========================================================

  const removeSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      primarySkill: prev.primarySkill.filter((_, i) => i !== index),
    }));
  };

  // =========================================================
  // ADD LANGUAGE
  // =========================================================

  const addLanguage = () => {
    const language = languageInput.trim();

    if (!language) return;

    if (formData.languages.includes(language)) {
      setLanguageInput("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      languages: [...prev.languages, language],
    }));

    setLanguageInput("");
  };

  // =========================================================
  // REMOVE LANGUAGE
  // =========================================================

  const removeLanguage = (index) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  // =========================================================
  // CANCEL
  // =========================================================

  const handleCancel = () => {
    setSaveError("");

    if (profilePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(profilePreview);
    }

    navigate("/mentor/profile");
  };

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError("");

      const formPayload = new FormData();

      // =====================================================
      // BASIC INFORMATION
      // =====================================================

      formPayload.append("firstName", formData.firstName || "");
      formPayload.append("lastName", formData.lastName || "");
      formPayload.append("email", formData.email || "");
      formPayload.append("phone", formData.phone || "");

      // =====================================================
      // PROFILE DETAILS
      // =====================================================

      formPayload.append("headline", formData.headline || "");
      formPayload.append("about", formData.about || "");
      formPayload.append(
        "teachingStyle",
        formData.teachingStyle || ""
      );
      formPayload.append("linkedin", formData.linkedin || "");

      // =====================================================
      // PROFESSIONAL INFORMATION
      // =====================================================

      formPayload.append(
        "profession",
        formData.profession || ""
      );

      formPayload.append(
        "company",
        formData.company || ""
      );

      formPayload.append(
        "industry",
        formData.industry || ""
      );

      formPayload.append(
        "experience",
        formData.experience || ""
      );

      formPayload.append(
        "skillLevel",
        formData.skillLevel || ""
      );

      formPayload.append(
        "skillExperience",
        formData.skillExperience || ""
      );

      formPayload.append(
        "category",
        formData.category || ""
      );

      // =====================================================
      // ARRAYS
      // =====================================================

      formPayload.append(
        "primarySkill",
        JSON.stringify(formData.primarySkill || [])
      );

      formPayload.append(
        "languages",
        JSON.stringify(formData.languages || [])
      );

      // =====================================================
      // LOCATION
      // =====================================================

      formPayload.append(
        "location",
        JSON.stringify(formData.location || {})
      );

      // =====================================================
      // EDUCATION
      // =====================================================

      formPayload.append(
        "education",
        JSON.stringify(formData.education || {})
      );

      // =====================================================
      // PRICING
      // =====================================================

      formPayload.append(
        "pricing",
        JSON.stringify(formData.pricing || {})
      );

      // =====================================================
      // PROFILE IMAGE
      // =====================================================

      if (profileImage) {
        formPayload.append("profileImage", profileImage);
      }

      // =====================================================
      // API REQUEST
      // =====================================================

      const response = await fetch(`${API_BASE_URL}/api/mentor/editprofile`, {
        method: "PATCH",
        headers: authHeaders(),
        body: formPayload,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Could not save profile changes."
        );
      }

      // =====================================================
      // UPDATE LOCAL STATE
      // =====================================================

      setMentor(data.mentor);

      setProfileImage(null);

      setProfilePreview(
        data.mentor.profileImage
          ? getFileUrl(data.mentor.profileImage)
          : getDefaultAvatar(data.mentor)
      );

      // =====================================================
      // NAVIGATE BACK
      // =====================================================

      navigate("/mentor/profile");
    } catch (err) {
      console.error("Error saving profile:", err);

      setSaveError(
        err.message || "Something went wrong while saving."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-full w-full min-w-0 max-w-full overflow-x-hidden bg-[#F6F5F2] lg:ml-64 lg:w-[calc(100%-16rem)]">
        <div className="flex min-h-[70vh] w-full items-center justify-center px-4">
          <div className="flex flex-col items-center">
            <Loader2
              size={42}
              className="animate-spin text-[#0F766E]"
            />

            <p className="mt-4 text-sm font-medium text-gray-600">
              Loading mentor profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !mentor) {
    return (
      <div className="min-h-full w-full min-w-0 max-w-full overflow-x-hidden bg-[#F6F5F2] lg:ml-64 lg:w-[calc(100%-16rem)]">
        <div className="flex min-h-[70vh] w-full items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <User size={30} className="text-red-500" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-800">
              Unable to Load Profile
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {error || "Mentor profile could not be found."}
            </p>

            <button
              onClick={fetchMentorProfile}
              className="mt-6 rounded-xl bg-[#14213D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1B2B4A]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');

        .font-display {
          font-family: 'Fraunces', serif;
        }
      `}</style>

      {/* =====================================================
          SIDEBAR SPACE
      ====================================================== */}

      <div className="min-h-full w-full min-w-0 max-w-full overflow-x-hidden bg-[#F6F5F2] lg:ml-64 lg:w-[calc(100%-16rem)]">
        <main className="mx-auto w-full max-w-6xl min-w-0 px-3 py-4 sm:px-5 sm:py-6 md:px-6 lg:px-8 xl:px-10">

          {/* =====================================================
              HEADER
          ====================================================== */}

          <div className="mb-5 flex min-w-0 flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <button
                onClick={() => navigate("/mentor/profile")}
                className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#0F766E]"
              >
                <ArrowLeft size={17} />
                Back to Profile
              </button>

              <h1 className="font-display break-words text-2xl font-semibold text-[#14213D] sm:text-3xl">
                Edit Mentor Profile
              </h1>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Update all your professional information and profile details.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <X size={18} />
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0c5f58] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {saving ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={18} />
                )}

                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* =====================================================
              SAVE ERROR
          ====================================================== */}

          {saveError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {saveError}
            </div>
          )}

          {/* =====================================================
              PROFILE IMAGE + HEADER
          ====================================================== */}

          <section className="w-full min-w-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#14213D] to-[#1B2B4A] p-5 shadow-lg sm:rounded-3xl sm:p-7">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">

              <div className="relative shrink-0">
                <img
                  src={
                    profilePreview ||
                    getDefaultAvatar(mentor)
                  }
                  alt={`${mentor.firstName} ${mentor.lastName}`}
                  className="mx-auto h-24 w-24 rounded-full border-4 border-[#C9A227] object-cover shadow-lg sm:mx-0 sm:h-28 sm:w-28"
                  onError={(e) => {
                    e.currentTarget.src =
                      getDefaultAvatar(mentor);
                  }}
                />

                <label
                  htmlFor="profileImage"
                  className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#0F766E] text-white shadow-lg transition hover:bg-[#0c5f58]"
                  title="Change profile picture"
                >
                  <Camera size={17} />

                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="min-w-0 text-center sm:text-left">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#C9A227]">
                  Mentor Profile
                </p>

                <h2 className="font-display mt-1 break-words text-2xl font-semibold text-white sm:text-3xl">
                  {formData.firstName} {formData.lastName}
                </h2>

                <p className="mt-1 break-words text-sm text-white/70">
                  {formData.profession || "Mentor"}
                </p>

                <label
                  htmlFor="profileImage"
                  className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/20"
                >
                  <Camera size={15} />
                  Change Profile Picture
                </label>
              </div>
            </div>
          </section>

          {/* =====================================================
              BASIC INFORMATION
          ====================================================== */}

          <section className="mt-5 w-full min-w-0 rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5 sm:mt-6 sm:p-6">
            <SectionHeader
              icon={User}
              title="Basic Information"
              color="teal"
            />

            <div className="grid min-w-0 gap-5 md:grid-cols-2">

              <EditableField
                icon={User}
                label="First Name"
                value={formData.firstName}
                onChange={(value) =>
                  handleChange("firstName", value)
                }
              />

              <EditableField
                icon={User}
                label="Last Name"
                value={formData.lastName}
                onChange={(value) =>
                  handleChange("lastName", value)
                }
              />

              <EditableField
                icon={Mail}
                label="Email Address"
                value={formData.email}
                onChange={(value) =>
                  handleChange("email", value)
                }
              />

              <EditableField
                icon={Phone}
                label="Phone Number"
                value={formData.phone}
                onChange={(value) =>
                  handleChange("phone", value)
                }
              />

            </div>
          </section>

          {/* =====================================================
              LOCATION
          ====================================================== */}

          <section className="mt-5 w-full min-w-0 rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5 sm:mt-6 sm:p-6">
            <SectionHeader
              icon={MapPin}
              title="Location"
              color="teal"
            />

            <div className="grid gap-5 md:grid-cols-3">

              <EditableField
                icon={MapPin}
                label="City"
                value={formData.location.city}
                onChange={(value) =>
                  handleNestedChange(
                    "location",
                    "city",
                    value
                  )
                }
              />

              <EditableField
                icon={MapPin}
                label="State"
                value={formData.location.state}
                onChange={(value) =>
                  handleNestedChange(
                    "location",
                    "state",
                    value
                  )
                }
              />

              <EditableField
                icon={Globe2}
                label="Country"
                value={formData.location.country}
                onChange={(value) =>
                  handleNestedChange(
                    "location",
                    "country",
                    value
                  )
                }
              />

            </div>
          </section>

          {/* =====================================================
              PROFESSIONAL INFORMATION
          ====================================================== */}

          <section className="mt-5 w-full min-w-0 rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5 sm:mt-6 sm:p-6">
            <SectionHeader
              icon={Briefcase}
              title="Professional Information"
              color="teal"
            />

            <div className="grid min-w-0 gap-5 md:grid-cols-2">

              <EditableField
                icon={Briefcase}
                label="Profession"
                value={formData.profession}
                onChange={(value) =>
                  handleChange("profession", value)
                }
              />

              <EditableField
                icon={Building2}
                label="Company"
                value={formData.company}
                onChange={(value) =>
                  handleChange("company", value)
                }
              />

              <EditableField
                icon={Briefcase}
                label="Industry"
                value={formData.industry}
                onChange={(value) =>
                  handleChange("industry", value)
                }
              />

              <EditableField
                icon={Star}
                label="Experience (Years)"
                value={formData.experience}
                onChange={(value) =>
                  handleChange("experience", value)
                }
              />

              <EditableField
                icon={BadgeCheck}
                label="Skill Level"
                value={formData.skillLevel}
                onChange={(value) =>
                  handleChange("skillLevel", value)
                }
              />

              <EditableField
                icon={BadgeCheck}
                label="Skill Experience (Years)"
                value={formData.skillExperience}
                onChange={(value) =>
                  handleChange("skillExperience", value)
                }
              />

              <EditableField
                icon={BookOpen}
                label="Category"
                value={formData.category}
                onChange={(value) =>
                  handleChange("category", value)
                }
              />

            </div>
          </section>

          {/* =====================================================
              PROFILE DETAILS
          ====================================================== */}

          <section className="mt-5 w-full min-w-0 rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5 sm:mt-6 sm:p-6">
            <SectionHeader
              icon={BadgeCheck}
              title="Profile Details"
              color="teal"
            />

            <div className="space-y-5">

              <EditableField
                icon={BadgeCheck}
                label="Headline"
                value={formData.headline}
                onChange={(value) =>
                  handleChange("headline", value)
                }
              />

              <EditableField
                icon={LinkIcon}
                label="LinkedIn Profile"
                value={formData.linkedin}
                onChange={(value) =>
                  handleChange("linkedin", value)
                }
                placeholder="https://www.linkedin.com/in/your-profile"
              />

              <TextAreaField
                label="About"
                value={formData.about}
                onChange={(value) =>
                  handleChange("about", value)
                }
                placeholder="Tell students about your experience, background, and expertise..."
                rows={7}
              />

              <TextAreaField
                label="Teaching Style"
                value={formData.teachingStyle}
                onChange={(value) =>
                  handleChange("teachingStyle", value)
                }
                placeholder="Describe how you teach and interact with students..."
                rows={6}
              />

            </div>
          </section>

          {/* =====================================================
              PRIMARY SKILLS
          ====================================================== */}

          <section className="mt-5 w-full min-w-0 rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5 sm:mt-6 sm:p-6">
            <SectionHeader
              icon={BadgeCheck}
              title="Primary Skills"
              color="teal"
            />

            <div className="flex flex-col gap-3 sm:flex-row">

              <input
                type="text"
                value={skillInput}
                onChange={(e) =>
                  setSkillInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Enter a skill"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#0F766E] focus:bg-white focus:ring-2 focus:ring-[#0F766E]/20"
              />

              <button
                type="button"
                onClick={addSkill}
                className="rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0c5f58]"
              >
                Add Skill
              </button>

            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {formData.primarySkill.length > 0 ? (
                formData.primarySkill.map(
                  (skill, index) => (
                    <span
                      key={index}
                      className="inline-flex max-w-full items-center gap-2 break-words rounded-full bg-[#0F766E]/10 px-4 py-2 text-xs font-semibold text-[#0F766E]"
                    >
                      {skill}

                      <button
                        type="button"
                        onClick={() =>
                          removeSkill(index)
                        }
                        className="rounded-full hover:bg-[#0F766E]/20"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )
                )
              ) : (
                <p className="text-sm text-gray-500">
                  No skills added.
                </p>
              )}
            </div>
          </section>

          {/* =====================================================
              EDUCATION
          ====================================================== */}

          <section className="mt-5 w-full min-w-0 rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5 sm:mt-6 sm:p-6">
            <SectionHeader
              icon={GraduationCap}
              title="Education"
              color="gold"
            />

            <div className="grid gap-5 sm:grid-cols-2">

              <EditableField
                icon={GraduationCap}
                label="Degree"
                value={formData.education.degree}
                onChange={(value) =>
                  handleNestedChange(
                    "education",
                    "degree",
                    value
                  )
                }
              />

              <EditableField
                icon={Building2}
                label="College"
                value={formData.education.college}
                onChange={(value) =>
                  handleNestedChange(
                    "education",
                    "college",
                    value
                  )
                }
              />

              <EditableField
                icon={CalendarDays}
                label="Graduation Year"
                value={formData.education.graduationYear}
                onChange={(value) =>
                  handleNestedChange(
                    "education",
                    "graduationYear",
                    value
                  )
                }
              />

              <EditableField
                icon={Star}
                label="CGPA / Grade"
                value={formData.education.cgpa}
                onChange={(value) =>
                  handleNestedChange(
                    "education",
                    "cgpa",
                    value
                  )
                }
              />

            </div>
          </section>

          {/* =====================================================
              LANGUAGES
          ====================================================== */}

          <section className="mt-5 w-full min-w-0 rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5 sm:mt-6 sm:p-6">
            <SectionHeader
              icon={Languages}
              title="Languages"
              color="gold"
            />

            <div className="flex flex-col gap-3 sm:flex-row">

              <input
                type="text"
                value={languageInput}
                onChange={(e) =>
                  setLanguageInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addLanguage();
                  }
                }}
                placeholder="Enter a language"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#0F766E] focus:bg-white focus:ring-2 focus:ring-[#0F766E]/20"
              />

              <button
                type="button"
                onClick={addLanguage}
                className="rounded-xl bg-[#C9A227] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#aa861d]"
              >
                Add Language
              </button>

            </div>

            <div className="mt-4 flex flex-wrap gap-2">

              {formData.languages.length > 0 ? (
                formData.languages.map(
                  (language, index) => (
                    <span
                      key={index}
                      className="inline-flex max-w-full items-center gap-2 break-words rounded-full bg-[#C9A227]/10 px-4 py-2 text-xs font-semibold text-[#96751C]"
                    >
                      {language}

                      <button
                        type="button"
                        onClick={() =>
                          removeLanguage(index)
                        }
                        className="rounded-full hover:bg-[#C9A227]/20"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )
                )
              ) : (
                <p className="text-sm text-gray-500">
                  No languages added.
                </p>
              )}

            </div>
          </section>

          {/* =====================================================
              PRICING
          ====================================================== */}

          <section className="mt-5 w-full min-w-0 rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5 sm:mt-6 sm:p-6">
            <SectionHeader
              icon={DollarSign}
              title="Pricing"
              color="gold"
            />

            <div className="grid gap-5 sm:grid-cols-2">

              <EditableField
                icon={DollarSign}
                label="Session Price"
                value={formData.pricing.sessionPrice}
                onChange={(value) =>
                  handleNestedChange(
                    "pricing",
                    "sessionPrice",
                    value
                  )
                }
              />

            </div>
          </section>

          {/* =====================================================
              DOCUMENTS
          ====================================================== */}

          <section className="mt-5 w-full min-w-0 rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5 sm:mt-6 sm:p-6">
            <SectionHeader
              icon={ShieldCheck}
              title="Uploaded Documents"
              color="gold"
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              <DocumentCard
                label="Resume"
                path={mentor.resume}
                getFileUrl={getFileUrl}
              />

              <DocumentCard
                label="Government ID"
                path={mentor.governmentId}
                getFileUrl={getFileUrl}
              />

              <DocumentCard
                label="Degree Certificate"
                path={mentor.degreeCertificate}
                getFileUrl={getFileUrl}
              />

            </div>
          </section>

          {/* =====================================================
              BOTTOM ACTIONS
          ====================================================== */}

          <div className="mt-6 flex w-full flex-col gap-3 pb-8 sm:flex-row sm:justify-end">

            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
            >
              <X size={18} />
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0c5f58] disabled:opacity-60 sm:w-auto"
            >
              {saving ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Save size={18} />
              )}

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </main>
      </div>
    </>
  );
};

/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = ({
  icon: Icon,
  title,
  color = "teal",
}) => {
  const colors = {
    teal: "text-[#0F766E]",
    gold: "text-[#C9A227]",
  };

  return (
    <div className="mb-6 flex min-w-0 items-center gap-3">
      <Icon
        size={22}
        className={`shrink-0 ${colors[color]}`}
      />

      <h2 className="font-display break-words text-xl font-semibold text-gray-800 sm:text-2xl">
        {title}
      </h2>
    </div>
  );
};

/* =========================================================
   EDITABLE FIELD
========================================================= */

const EditableField = ({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder = "",
}) => (
  <div className="min-w-0">
    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
      <Icon
        size={17}
        className="shrink-0 text-[#0F766E]"
      />

      <span>{label}</span>
    </label>

    <input
      type="text"
      value={value ?? ""}
      onChange={(e) =>
        onChange(e.target.value)
      }
      placeholder={placeholder}
      className="w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#0F766E] focus:bg-white focus:ring-2 focus:ring-[#0F766E]/20"
    />
  </div>
);

/* =========================================================
   TEXT AREA
========================================================= */

const TextAreaField = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
}) => (
  <div className="min-w-0">
    <label className="mb-2 block text-sm font-semibold text-gray-700">
      {label}
    </label>

    <textarea
      value={value ?? ""}
      onChange={(e) =>
        onChange(e.target.value)
      }
      placeholder={placeholder}
      rows={rows}
      className="w-full min-w-0 resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#0F766E] focus:bg-white focus:ring-2 focus:ring-[#0F766E]/20"
    />
  </div>
);

/* =========================================================
   DOCUMENT CARD
========================================================= */

const DocumentCard = ({
  label,
  path,
  getFileUrl,
}) => (
  <div className="min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-4">
    <h3 className="break-words text-sm font-semibold text-gray-800">
      {label}
    </h3>

    {path ? (
      <a
        href={getFileUrl(path)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-[#14213D] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1B2B4A] sm:w-auto"
      >
        View Document
      </a>
    ) : (
      <p className="mt-3 text-sm text-gray-500">
        Not Uploaded
      </p>
    )}
  </div>
);

export default EditMentorProfile;
