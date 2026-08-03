import { useEffect, useState } from "react";

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
  Camera,
  Loader2,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EDITABLE_FIELDS = [
  "phone",
  "headline",
  "about",
  "teachingStyle",
  "linkedin",
];

const MentorProfile = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // =========================================================
  // AUTH HEADERS
  // =========================================================

  const authHeaders = () => {
    const token = localStorage.getItem("MentorToken");

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  // =========================================================
  // FILE URL
  // =========================================================

  const getFileUrl = (filePath) => {
    if (!filePath) return "";

    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }

    return `${API_BASE_URL}/${filePath.replace(/^\/+/, "")}`;
  };

  // =========================================================
  // AVATAR FALLBACK
  // =========================================================

  const getAvatarUrl = () => {
    const name = `${mentor?.firstName || "Mentor"} ${
      mentor?.lastName || ""
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

      const token = localStorage.getItem("MentorToken");

      if (!token) {
        console.error("MentorToken not found");
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

      setMentor(data.mentor);
      setFormData(data.mentor);
    } catch (error) {
      console.error("Error fetching mentor profile:", error);
    } finally {
      setLoading(false);
    }
  };


  const fetchMentorReviews = async () => {
    try {
      setReviewsLoading(true);

      const token = localStorage.getItem("MentorToken");

      if (!token) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/mentor/reviews`, {
        method: "GET",
        headers: authHeaders(),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch mentor reviews");
      }

      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error fetching mentor reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchMentorProfile();
    fetchMentorReviews();
  }, []);

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const handleCancel = () => {
    setFormData(mentor);
    setSaveError("");
    setIsEditing(false);
  };

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError("");

      const payload = EDITABLE_FIELDS.reduce((acc, field) => {
        acc[field] = formData[field] ?? "";
        return acc;
      }, {});

      const response = await fetch(`${API_BASE_URL}/api/mentor/profile`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not save changes.");
      }

      setMentor(data.mentor);
      setFormData(data.mentor);
      setIsEditing(false);
      setSaveError("");
    } catch (error) {
      console.error("Error saving profile:", error);

      setSaveError(error.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] w-full min-w-0 items-center justify-center overflow-x-hidden bg-[#F6F5F2] px-4">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#0F766E]" />

          <p className="mt-4 text-sm font-medium text-gray-600">
            Loading mentor profile...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // PROFILE NOT FOUND
  // =========================================================

  if (!mentor) {
    return (
      <div className="flex min-h-[70vh] w-full min-w-0 items-center justify-center overflow-x-hidden bg-[#F6F5F2] px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-lg sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <User className="text-red-500" size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-800 sm:text-2xl">
            Mentor profile not found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            We could not load your mentor profile.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // RATING
  // =========================================================

  const rating = Number(mentor.averageRating || 0);

  const ratingPct = Math.max(0, Math.min(1, rating / 5));

  const RING_R = 46;
  const RING_C = 2 * Math.PI * RING_R;

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .font-display {
          font-family: 'Fraunces', serif;
        }

        .font-mono-ui {
          font-family: 'IBM Plex Mono', monospace;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D8D5CE;
          border-radius: 999px;
        }
      `}</style>

      {/* =====================================================
          OUTER RESPONSIVE CONTAINER

          MentorSidebar:
          - fixed
          - desktop width = 256px
          - lg:w-64

          MentorLayout is NOT changed.

          This container reserves the sidebar width on desktop.
          On mobile/tablet below lg, no margin is applied because
          the sidebar becomes a mobile drawer.
      ====================================================== */}

      <div className="min-h-full w-full min-w-0 max-w-full overflow-x-hidden bg-[#F6F5F2] lg:ml-64 lg:w-[calc(100%-16rem)]">
        {/* =====================================================
            PROFILE CONTENT CONTAINER
        ====================================================== */}

        <div className="mx-auto w-full max-w-7xl min-w-0 px-3 py-4 sm:px-5 sm:py-6 lg:px-6 lg:py-6 xl:px-8">
          {/* =====================================================
              HERO
          ====================================================== */}

          <section className="relative w-full min-w-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#14213D] to-[#1B2B4A] shadow-xl sm:rounded-3xl">
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#C9A227]/10 blur-3xl sm:h-72 sm:w-72" />

            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#0F766E]/20 blur-3xl sm:h-60 sm:w-60" />

            <div className="relative w-full p-4 sm:p-6 md:p-8">
              {/* TOP HEADER */}

              <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-[#C9A227] sm:text-[11px]">
                    Mentor Dashboard
                  </p>

                  <h1 className="font-display mt-1 text-2xl font-semibold text-white sm:text-3xl">
                    Your Profile
                  </h1>
                </div>

                {!isEditing ? (
                  <button
                    onClick={() => navigate("/mentor/Editprofile")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#14213D] shadow-md transition hover:bg-gray-100 sm:w-auto"
                  >
                    <Edit3 size={18} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    {saveError && (
                      <div className="max-w-full break-words rounded-xl bg-rose-500/20 px-3 py-2 text-xs font-medium text-rose-100">
                        {saveError}
                      </div>
                    )}

                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0c5f58] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {saving ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Save size={18} />
                      )}

                      {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/20 disabled:opacity-60 sm:w-auto"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* HERO CONTENT */}

              <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
                {/* IDENTITY */}

                <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
                  <div className="relative mx-auto shrink-0 sm:mx-0">
                    <img
                      src={
                        mentor.profileImage
                          ? getFileUrl(mentor.profileImage)
                          : getAvatarUrl()
                      }
                      alt={`${mentor.firstName} ${mentor.lastName}`}
                      className="h-24 w-24 rounded-full border-4 border-[#C9A227] object-cover shadow-xl sm:h-28 sm:w-28"
                      onError={(e) => {
                        e.currentTarget.src = getAvatarUrl();
                      }}
                    />

                    <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md">
                      <Camera size={14} className="text-[#14213D]" />
                    </div>
                  </div>

                  <div className="min-w-0 text-center sm:text-left">
                    <h1 className="font-display break-words text-2xl font-semibold text-white sm:text-3xl">
                      {mentor.firstName} {mentor.lastName}
                    </h1>

                    <p className="mt-1 break-words text-base text-[#C9A227] sm:text-lg">
                      {mentor.profession || "Mentor"}
                    </p>

                    <p className="mx-auto mt-2 max-w-xl break-words text-sm leading-6 text-white/80 sm:mx-0">
                      {mentor.headline || "No headline available."}
                    </p>

                    <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                      {[
                        mentor.industry,
                        mentor.experience ? `${mentor.experience} Years` : null,
                        mentor.category,
                      ]
                        .filter(Boolean)
                        .map((tag, index) => (
                          <span
                            key={index}
                            className="font-mono-ui max-w-full break-words rounded-full bg-white/10 px-3 py-1 text-[10px] text-white ring-1 ring-white/20 sm:px-4 sm:text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                {/* RATING */}

                <div className="flex w-full min-w-0 flex-col items-center gap-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-5 backdrop-blur-lg sm:flex-row sm:justify-center sm:px-6 xl:w-auto xl:min-w-[300px]">
                  <div className="relative flex h-24 w-24 shrink-0 items-center justify-center sm:h-28 sm:w-28">
                    <svg
                      viewBox="0 0 100 100"
                      className="h-24 w-24 -rotate-90 sm:h-28 sm:w-28"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r={RING_R}
                        fill="none"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="7"
                      />

                      <circle
                        cx="50"
                        cy="50"
                        r={RING_R}
                        fill="none"
                        stroke="#C9A227"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray={RING_C}
                        strokeDashoffset={RING_C * (1 - ratingPct)}
                      />
                    </svg>

                    <div className="absolute flex flex-col items-center">
                      <span className="font-display text-2xl font-semibold text-white">
                        {rating.toFixed(1)}
                      </span>

                      <Star
                        size={12}
                        className="fill-[#C9A227] text-[#C9A227]"
                      />
                    </div>
                  </div>

                  <div className="grid w-full grid-cols-2 gap-4 text-center sm:w-auto sm:text-left">
                    <div>
                      <p className="font-mono-ui text-[10px] uppercase tracking-wide text-white/60">
                        Reviews
                      </p>

                      <p className="font-display mt-1 text-xl font-semibold text-white">
                        {mentor.totalReviews ?? reviews.length}
                      </p>
                    </div>

                    <div>
                      <p className="font-mono-ui text-[10px] uppercase tracking-wide text-white/60">
                        Verification
                      </p>

                      <span className="mt-1 inline-flex max-w-full break-words rounded-full bg-[#0F766E]/30 px-3 py-1 text-xs font-semibold text-[#8FE3D3]">
                        {mentor.verificationStatus || "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              BASIC INFORMATION
          ====================================================== */}

          <section className="mt-5 w-full min-w-0 rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5 sm:mt-8 sm:rounded-3xl sm:p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3 sm:mb-8">
              <User className="shrink-0 text-[#0F766E]" size={22} />

              <h2 className="font-display text-xl font-semibold text-gray-800 sm:text-2xl">
                Basic Information
              </h2>
            </div>

            <div className="grid min-w-0 gap-6 sm:gap-8 md:grid-cols-2">
              <InfoRow icon={User} color="teal" label="Full Name">
                {mentor.firstName} {mentor.lastName}
              </InfoRow>

              <InfoRow icon={Mail} color="gold" label="Email Address">
                <span className="break-all">{mentor.email || "-"}</span>
              </InfoRow>

              <InfoRow icon={Phone} color="teal" label="Phone Number">
                {isEditing ? (
                  <TextInput
                    value={formData.phone || ""}
                    onChange={(value) => handleFieldChange("phone", value)}
                  />
                ) : (
                  mentor.phone || "-"
                )}
              </InfoRow>

              <InfoRow icon={MapPin} color="gold" label="Location">
                <span className="break-words">
                  {mentor.location?.city || "-"}
                  {mentor.location?.state ? `, ${mentor.location.state}` : ""}
                  {mentor.location?.country
                    ? `, ${mentor.location.country}`
                    : ""}
                </span>
              </InfoRow>
            </div>
          </section>

          {/* =====================================================
              PROFESSIONAL + PERSONAL
          ====================================================== */}

          <div className="mt-5 grid min-w-0 gap-5 lg:mt-6 lg:grid-cols-2">
            <Card
              icon={Briefcase}
              iconColor="text-[#0F766E]"
              title="Professional Information"
            >
              <StatLine label="Profession" value={mentor.profession} />

              <StatLine label="Company" value={mentor.company} />

              <StatLine label="Industry" value={mentor.industry} />

              <StatLine
                label="Experience"
                value={mentor.experience ? `${mentor.experience} Years` : "-"}
              />

              <StatLine label="Skill Level" value={mentor.skillLevel} accent />

              <StatLine
                label="Skill Experience"
                value={
                  mentor.skillExperience
                    ? `${mentor.skillExperience} Years`
                    : "-"
                }
                last
              />
            </Card>

            <Card
              icon={Building2}
              iconColor="text-[#C9A227]"
              title="Personal Details"
            >
              <StatLine label="Gender" value={mentor.gender} />

              <StatLine
                label="Date of Birth"
                value={
                  mentor.dob ? new Date(mentor.dob).toLocaleDateString() : "-"
                }
              />

              <StatLine label="Category" value={mentor.category} />

              <div className="flex flex-col gap-2 border-b border-gray-100 py-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="shrink-0 text-sm text-gray-500">LinkedIn</span>

                {isEditing ? (
                  <TextInput
                    value={formData.linkedin || ""}
                    onChange={(value) => handleFieldChange("linkedin", value)}
                    align="right"
                  />
                ) : mentor.linkedin ? (
                  <a
                    href={mentor.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-sm font-semibold text-[#0F766E] hover:underline sm:text-right"
                  >
                    View Profile
                  </a>
                ) : (
                  <span className="text-sm font-semibold text-gray-800">-</span>
                )}
              </div>

              <StatLine
                label="Joined"
                value={
                  mentor.createdAt
                    ? new Date(mentor.createdAt).toLocaleDateString()
                    : "-"
                }
                last
              />
            </Card>
          </div>

          {/* =====================================================
              ABOUT MENTOR
          ====================================================== */}

          <section className="mt-5 w-full min-w-0 rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5 sm:mt-6 sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <BadgeCheck className="shrink-0 text-[#0F766E]" size={22} />

              <h2 className="font-display text-xl font-semibold text-gray-800">
                About Mentor
              </h2>
            </div>

            <EditableBlock
              label="Headline"
              value={isEditing ? formData.headline : mentor.headline}
              isEditing={isEditing}
              onChange={(value) => handleFieldChange("headline", value)}
              tone="teal"
            />

            <EditableBlock
              label="About"
              value={isEditing ? formData.about : mentor.about}
              isEditing={isEditing}
              onChange={(value) => handleFieldChange("about", value)}
              tone="neutral"
              scroll
              placeholder="No description available."
            />

            <EditableBlock
              label="Teaching Style"
              value={isEditing ? formData.teachingStyle : mentor.teachingStyle}
              isEditing={isEditing}
              onChange={(value) => handleFieldChange("teachingStyle", value)}
              tone="gold"
              scroll
            />
          </section>

          {/* =====================================================
              SKILLS + LANGUAGES
          ====================================================== */}

          <div className="mt-5 grid min-w-0 gap-5 lg:mt-6 lg:grid-cols-2">
            <Card
              icon={BadgeCheck}
              iconColor="text-[#0F766E]"
              title="Primary Skills"
            >
              {mentor.primarySkill?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {mentor.primarySkill.map((skill, index) => (
                    <span
                      key={index}
                      className="max-w-full break-words rounded-full bg-[#0F766E]/10 px-4 py-1.5 text-xs font-semibold text-[#0F766E]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No skills added.</p>
              )}
            </Card>

            <Card
              icon={ShieldCheck}
              iconColor="text-[#C9A227]"
              title="Languages"
            >
              {mentor.languages?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {mentor.languages.map((language, index) => (
                    <span
                      key={index}
                      className="max-w-full break-words rounded-full bg-[#C9A227]/10 px-4 py-1.5 text-xs font-semibold text-[#96751C]"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No languages added.</p>
              )}
            </Card>
          </div>

          {/* =====================================================
              EDUCATION
          ====================================================== */}

          <section className="mt-5 w-full min-w-0 rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5 sm:mt-6 sm:p-6">
            <div className="mb-6 flex items-center gap-2">
              <CalendarDays className="text-[#0F766E]" size={22} />

              <h2 className="font-display text-xl font-semibold text-gray-800">
                Education
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <EduTile label="Degree" value={mentor.education?.degree} />

              <EduTile label="College" value={mentor.education?.college} />

              <EduTile
                label="Graduation Year"
                value={mentor.education?.graduationYear}
              />

              <EduTile label="CGPA / Grade" value={mentor.education?.cgpa} />
            </div>
          </section>

          {/* =====================================================
              CERTIFICATIONS
          ====================================================== */}

          <section className="mt-5 w-full min-w-0 rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5 sm:mt-6 sm:p-6">
            <div className="mb-6 flex items-center gap-2">
              <ShieldCheck className="text-[#C9A227]" size={22} />

              <h2 className="font-display text-xl font-semibold text-gray-800">
                Certifications
              </h2>
            </div>

            {mentor.certifications?.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {mentor.certifications
                  .flatMap((cert) => {
                    try {
                      const parsed = JSON.parse(cert);

                      return parsed.flatMap((item) =>
                        item
                          .split("\n")
                          .map((c) => c.trim())
                          .filter(Boolean)
                      );
                    } catch {
                      return cert
                        .split("\n")
                        .map((c) => c.trim())
                        .filter(Boolean);
                    }
                  })
                  .map((certificate, index) => (
                    <div
                      key={index}
                      className="flex min-w-0 items-start gap-3 rounded-xl border border-[#C9A227]/30 bg-[#C9A227]/5 p-4"
                    >
                      <BadgeCheck
                        size={18}
                        className="mt-0.5 shrink-0 text-[#96751C]"
                      />

                      <span className="break-words text-sm font-medium text-gray-800">
                        {certificate}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 p-5 text-center">
                <p className="text-sm text-gray-500">
                  No certifications available.
                </p>
              </div>
            )}
          </section>

          {/* =====================================================
              AVAILABILITY + PRICING
          ====================================================== */}

          <div className="mt-5 grid min-w-0 gap-5 lg:mt-6 lg:grid-cols-2">
            <Card
              icon={CalendarDays}
              iconColor="text-[#0F766E]"
              title="Availability"
            >
              <StatLine
                label="Available Days"
                value={
                  mentor.availability?.availableDays?.length
                    ? mentor.availability.availableDays.join(", ")
                    : "-"
                }
              />

              <StatLine
                label="Preferred Time"
                value={mentor.availability?.preferredTime}
              />

              <StatLine
                label="Start Time"
                value={mentor.availability?.startTime}
              />

              <StatLine label="End Time" value={mentor.availability?.endTime} />

              <StatLine
                label="Duration"
                value={
                  mentor.availability?.sessionDuration
                    ? `${mentor.availability.sessionDuration} mins`
                    : "-"
                }
              />

              <StatLine
                label="Timezone"
                value={mentor.availability?.timezone}
                last
              />
            </Card>

            <Card
              icon={Star}
              iconColor="text-[#C9A227]"
              title="Session Pricing"
            >
              <StatLine
                label="Session Type"
                value={mentor.pricing?.sessionType}
              />

              <div className="flex items-center justify-between border-b border-gray-100 py-3">
                <span className="text-sm text-gray-500">Price</span>

                <span className="font-display text-lg font-bold text-[#0F766E]">
                  ₹{mentor.pricing?.sessionPrice ?? 0}
                </span>
              </div>

              <StatLine label="Currency" value={mentor.pricing?.currency} />

              <div className="flex items-center justify-between border-b border-gray-100 py-3">
                <span className="text-sm text-gray-500">Free Trial</span>

                <span
                  className={`text-sm font-semibold ${
                    mentor.pricing?.freeTrial
                      ? "text-[#0F766E]"
                      : "text-rose-600"
                  }`}
                >
                  {mentor.pricing?.freeTrial ? "Available" : "No"}
                </span>
              </div>

              <div className="pt-3">
                <p className="mb-2 text-sm font-medium text-gray-500">
                  Pricing Note
                </p>

                <div className="custom-scrollbar h-24 overflow-y-auto rounded-xl bg-gray-50 p-3 text-sm leading-6 text-gray-700">
                  {mentor.pricing?.pricingNote || "No pricing notes available."}
                </div>
              </div>
            </Card>
          </div>

          {/* =====================================================
              STATUS
          ====================================================== */}

          <div className="mt-5 grid gap-5 lg:mt-6 lg:grid-cols-3">
            <StatusCard
              title="Verification Status"
              value={mentor.verificationStatus || "Pending"}
              tone={
                mentor.verificationStatus === "Approved"
                  ? "good"
                  : mentor.verificationStatus === "Rejected"
                  ? "bad"
                  : "pending"
              }
            />

            <StatusCard
              title="Account Status"
              value={mentor.accountStatus || "Unknown"}
              tone={mentor.accountStatus === "Active" ? "good" : "bad"}
            />

            <StatusCard
              title="Agreement"
              value={mentor.agreement ? "Accepted" : "Not Accepted"}
              tone={mentor.agreement ? "good" : "bad"}
            />
          </div>

          {/* =====================================================
              DOCUMENTS
          ====================================================== */}

          <section className="mt-5 w-full min-w-0 rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5 sm:mt-6 sm:p-6">
            <h2 className="font-display mb-6 text-xl font-semibold text-gray-800">
              Uploaded Documents
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DocTile
                label="Resume"
                path={mentor.resume}
                getFileUrl={getFileUrl}
              />

              <DocTile
                label="Government ID"
                path={mentor.governmentId}
                getFileUrl={getFileUrl}
              />

              <DocTile
                label="Degree Certificate"
                path={mentor.degreeCertificate}
                getFileUrl={getFileUrl}
              />
            </div>
          </section>

          {/* BOTTOM SPACING */}

          <div className="h-6 sm:h-8" />
        </div>
      </div>
    </>
  );
};

/* =========================================================
   COLOR MAP
========================================================= */

const COLOR_MAP = {
  teal: {
    bg: "bg-[#0F766E]/10",
    text: "text-[#0F766E]",
  },

  gold: {
    bg: "bg-[#C9A227]/10",
    text: "text-[#96751C]",
  },
};

/* =========================================================
   INFO ROW
========================================================= */

const InfoRow = ({ icon: Icon, color, label, children }) => (
  <div className="flex min-w-0 items-start gap-3 sm:gap-4">
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${COLOR_MAP[color].bg}`}
    >
      <Icon className={COLOR_MAP[color].text} size={21} />
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-gray-500">{label}</p>

      <div className="mt-1 break-words text-base font-semibold text-gray-800 sm:text-lg">
        {children}
      </div>
    </div>
  </div>
);

/* =========================================================
   CARD
========================================================= */

const Card = ({ icon: Icon, iconColor, title, children }) => (
  <div className="min-w-0 w-full rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5 sm:p-6">
    <div className="mb-5 flex items-center gap-2">
      <Icon className={`shrink-0 ${iconColor}`} size={22} />

      <h2 className="font-display min-w-0 break-words text-xl font-semibold text-gray-800">
        {title}
      </h2>
    </div>

    <div className="min-w-0 space-y-1">{children}</div>
  </div>
);

/* =========================================================
   STAT LINE
========================================================= */

const StatLine = ({ label, value, accent, last }) => (
  <div
    className={`flex min-w-0 flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between ${
      last ? "" : "border-b border-gray-100"
    }`}
  >
    <span className="shrink-0 text-sm text-gray-500">{label}</span>

    <span
      className={`break-words text-sm font-semibold sm:max-w-[65%] sm:text-right ${
        accent ? "text-[#0F766E]" : "text-gray-800"
      }`}
    >
      {value || "-"}
    </span>
  </div>
);

/* =========================================================
   TEXT INPUT
========================================================= */

const TextInput = ({ value, onChange, align = "left" }) => (
  <input
    type="text"
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full min-w-0 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 sm:max-w-[300px] ${
      align === "right" ? "sm:text-right" : ""
    }`}
  />
);

/* =========================================================
   EDITABLE BLOCK
========================================================= */

const EditableBlock = ({
  label,
  value,
  isEditing,
  onChange,
  tone,
  scroll,
  placeholder,
}) => {
  const toneClasses = {
    teal: "border-[#0F766E]/20 bg-[#0F766E]/5",

    gold: "border-[#C9A227]/30 bg-[#C9A227]/5",

    neutral: "border-gray-100 bg-gray-50",
  }[tone];

  return (
    <div
      className={`mt-4 min-w-0 w-full rounded-xl border p-4 first:mt-0 ${toneClasses}`}
    >
      <h3 className="text-base font-semibold text-gray-800">{label}</h3>

      {isEditing ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={scroll ? 5 : 3}
          className="mt-2 w-full min-w-0 resize-y rounded-lg border border-gray-200 bg-white p-3 text-sm leading-6 text-gray-700 outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20"
        />
      ) : (
        <div
          className={
            scroll
              ? "custom-scrollbar mt-2 max-h-32 overflow-y-auto pr-2"
              : "mt-2"
          }
        >
          <p className="whitespace-pre-line break-words text-sm leading-6 text-gray-700">
            {value || placeholder || "-"}
          </p>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   EDUCATION TILE
========================================================= */

const EduTile = ({ label, value }) => (
  <div className="min-w-0 w-full rounded-xl border border-gray-100 bg-gray-50 p-4">
    <p className="font-mono-ui text-xs uppercase tracking-wide text-gray-500">
      {label}
    </p>

    <h3 className="mt-1 break-words text-base font-semibold text-gray-800">
      {value || "-"}
    </h3>
  </div>
);

/* =========================================================
   STATUS TONES
========================================================= */

const STATUS_TONE = {
  good: "bg-[#0F766E]/10 text-[#0F766E]",

  bad: "bg-rose-100 text-rose-700",

  pending: "bg-[#C9A227]/10 text-[#96751C]",
};

/* =========================================================
   STATUS CARD
========================================================= */

const StatusCard = ({ title, value, tone }) => (
  <div className="min-w-0 w-full rounded-2xl bg-white p-5 shadow-md ring-1 ring-black/5 sm:p-6">
    <h3 className="mb-4 break-words text-base font-semibold text-gray-800 sm:text-lg">
      {title}
    </h3>

    <span
      className={`inline-flex max-w-full break-words rounded-full px-4 py-1.5 text-sm font-semibold ${STATUS_TONE[tone]}`}
    >
      {value}
    </span>
  </div>
);

/* =========================================================
   DOCUMENT TILE
========================================================= */

const DocTile = ({ label, path, getFileUrl }) => (
  <div className="min-w-0 w-full rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-[#0F766E]/40 hover:shadow-md">
    <h3 className="break-words text-base font-semibold text-[#0F766E]">
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
      <p className="mt-3 text-sm text-gray-500">Not Uploaded</p>
    )}
  </div>
);

export default MentorProfile;
