import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Activity,
  GraduationCap,
  Edit3,
  Award,
  Calendar,
  Clock,
  IndianRupee,
  ShieldCheck,
  Star,
  FileCheck,
  FileText,
  User,
  Globe,
  CheckCircle,
  Users,
  Video,
  CalendarCheck,
  Search,
  XCircle,
  BookOpen,
  Languages,
  ExternalLink,
} from "lucide-react";

// =====================================================
// API BASE URL
// =====================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// =====================================================
// MAIN COMPONENT
// =====================================================

const MentorDetails = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [mentor, setMentor] = useState(null);

  const [reviews, setReviews] = useState([]);

  const [students, setStudents] = useState([]);

  const [bookings, setBookings] = useState([]);

  const [meetings, setMeetings] = useState([]);

  const [statistics, setStatistics] = useState({});

  const [activeTab, setActiveTab] = useState("overview");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [bookingSearch, setBookingSearch] = useState("");

  const [studentSearch, setStudentSearch] = useState("");

  // =====================================================
  // FETCH MENTOR DETAILS
  // =====================================================

  useEffect(() => {
    const fetchMentorDetails = async () => {
      if (!mentorId) {
        setError("Mentor ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("AdminToken");

        if (!token) {
          throw new Error("Admin authentication token not found");
        }

        const response = await fetch(
          `${API_BASE_URL}/api/admin/mentors/${mentorId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        console.log("Mentor Details API Response:", data);

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch mentor details");
        }

        // =====================================================
        // HANDLE API RESPONSE
        // =====================================================

        setMentor(data.mentor || null);

        setStudents(Array.isArray(data.students) ? data.students : []);

        setBookings(Array.isArray(data.bookings) ? data.bookings : []);

        setMeetings(Array.isArray(data.meetings) ? data.meetings : []);

        setReviews(Array.isArray(data.reviews) ? data.reviews : []);

        setStatistics(data.statistics || {});
      } catch (err) {
        console.error("Fetch mentor details error:", err);

        setError(err.message || "Failed to load mentor details");
      } finally {
        setLoading(false);
      }
    };

    fetchMentorDetails();
  }, [mentorId]);

  // =====================================================
  // FILTER BOOKINGS
  // =====================================================

  const filteredBookings = bookings.filter((booking) => {
    const search = bookingSearch.trim().toLowerCase();

    if (!search) return true;

    const studentName = `${booking.student?.firstName || ""} ${
      booking.student?.lastName || ""
    }`.toLowerCase();

    const studentEmail = booking.student?.email?.toLowerCase() || "";

    const sessionType = booking.sessionType?.toLowerCase() || "";

    const status = booking.bookingStatus?.toLowerCase() || "";

    return (
      studentName.includes(search) ||
      studentEmail.includes(search) ||
      sessionType.includes(search) ||
      status.includes(search)
    );
  });

  // =====================================================
  // FILTER STUDENTS
  // =====================================================

  const filteredStudents = students.filter((student) => {
    const search = studentSearch.trim().toLowerCase();

    if (!search) return true;

    const name = `${student.firstName || ""} ${
      student.lastName || ""
    }`.toLowerCase();

    const email = student.email?.toLowerCase() || "";

    return name.includes(search) || email.includes(search);
  });

  // =====================================================
  // LOCATION
  // =====================================================

  const location = [
    mentor?.location?.city,
    mentor?.location?.state,
    mentor?.location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  // =====================================================
  // TABS
  // =====================================================

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: User,
    },
    {
      id: "students",
      label: "Students",
      icon: Users,
      count: students.length,
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: CalendarCheck,
      count: bookings.length,
    },
    {
      id: "meetings",
      label: "Meetings",
      icon: Video,
      count: meetings.length,
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: Star,
      count: reviews.length,
    },
    {
      id: "documents",
      label: "Documents",
      icon: FileCheck,
    },
  ];

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

          <p className="text-sm font-medium text-gray-500">
            Loading mentor details...
          </p>
        </div>
      </div>
    );
  }

  const getImageUrl = (image) => {
    if (!image) return null;

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
  };

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !mentor) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 rounded-xl px-3 py-2 font-medium text-gray-600 transition hover:bg-white hover:text-blue-600"
        >
          <ArrowLeft size={19} />
          Back to Mentors
        </button>

        <div className="mx-auto max-w-3xl rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <XCircle size={28} className="text-red-500" />
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            Unable to Load Mentor
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error || "Mentor not found"}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const profileImage = mentor?.profileImage
    ? `${API_BASE_URL}/${mentor.profileImage.replace(/^\/+/, "")}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${mentor?.firstName || ""} ${mentor?.lastName || ""}`
      )}&background=4f46e5&color=fff&size=200`;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* =====================================================
          BACK BUTTON
      ===================================================== */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 rounded-xl px-3 py-2 font-medium text-gray-600 transition hover:bg-white hover:text-blue-600 sm:mb-3"
      >
        <ArrowLeft size={19} />
        Back to Mentors
      </button>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* =====================================================
      MAIN PROFILE HEADER
  ====================================================== */}
        <div className="relative bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 px-6 py-7 md:px-8 md:py-9">
          {/* Decorative Background */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />

          {/* TOP ACTIONS */}
          <div className="relative mb-7 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
                Mentor Management
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Mentor profile overview
              </p>
            </div>

            {/* EDIT BUTTON */}
            <button
              type="button"
              onClick={() => navigate(`/admin/mentors/${mentor._id}/edit`)}
              className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              <Edit3
                size={16}
                className="transition-transform group-hover:rotate-12"
              />
              Edit Mentor
            </button>
          </div>

          {/* PROFILE CONTENT */}
          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            {/* LEFT PROFILE */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {/* IMAGE */}
              <div className="relative shrink-0">
                <div className="rounded-3xl bg-white/10 p-1.5 backdrop-blur-sm">
                  <img
                    src={profileImage}
                    alt={`${mentor.firstName || ""} ${mentor.lastName || ""}`}
                    onError={(e) => {
                      e.currentTarget.onerror = null;

                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        `${mentor.firstName || ""} ${mentor.lastName || ""}`
                      )}&background=4f46e5&color=fff&size=200`;
                    }}
                    className="h-28 w-28 rounded-2xl object-cover shadow-xl sm:h-32 sm:w-32"
                  />
                </div>

                {/* VERIFIED */}
                {mentor.isVerified && (
                  <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-indigo-950 bg-emerald-500 text-white shadow-lg">
                    <CheckCircle size={16} />
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className="min-w-0">
                {/* LABELS */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs font-semibold text-indigo-200">
                    Mentor Profile
                  </span>

                  <span className="text-xs text-slate-500">
                    ID: {mentor._id?.slice(-8)}
                  </span>
                </div>

                {/* NAME */}
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {mentor.firstName || ""} {mentor.lastName || ""}
                </h1>

                {/* HEADLINE */}
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                  {mentor.headline ||
                    mentor.profession ||
                    "Professional Mentor"}
                </p>

                {/* LOCATION + COMPANY */}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                  {(mentor.location?.city || mentor.location?.state) && (
                    <div className="flex items-center gap-2">
                      <MapPin size={15} className="text-indigo-300" />

                      <span>
                        {[mentor.location?.city, mentor.location?.state]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}

                  {mentor.company && (
                    <div className="flex items-center gap-2">
                      <Briefcase size={15} className="text-indigo-300" />

                      <span>{mentor.company}</span>
                    </div>
                  )}
                </div>

                {/* STATUS */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      mentor.verificationStatus === "Approved"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : mentor.verificationStatus === "Rejected"
                        ? "bg-red-500/15 text-red-300"
                        : "bg-amber-500/15 text-amber-300"
                    }`}
                  >
                    <ShieldCheck size={14} />
                    {mentor.verificationStatus || "Pending"}
                  </span>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      mentor.accountStatus === "Active"
                        ? "bg-blue-500/15 text-blue-300"
                        : "bg-red-500/15 text-red-300"
                    }`}
                  >
                    <Activity size={14} />
                    {mentor.accountStatus || "Active"}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT STATS */}
            <div className="grid grid-cols-2 gap-3 sm:flex">
              {/* RATING */}
              <div className="min-w-[145px] rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400/10">
                    <Star
                      size={19}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  </div>

                  <div>
                    <p className="text-lg font-bold text-white">
                      {Number(
                        statistics.averageRating ?? mentor.averageRating ?? 0
                      ).toFixed(1)}
                    </p>

                    <p className="text-xs text-slate-400">
                      {statistics.totalReviews ??
                        mentor.totalReviews ??
                        reviews.length ??
                        0}{" "}
                      Reviews
                    </p>
                  </div>
                </div>
              </div>

              {/* VERIFIED */}
              <div className="min-w-[145px] rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      mentor.isVerified ? "bg-emerald-400/10" : "bg-white/10"
                    }`}
                  >
                    {mentor.isVerified ? (
                      <CheckCircle size={19} className="text-emerald-400" />
                    ) : (
                      <ShieldCheck size={19} className="text-slate-400" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      {mentor.isVerified ? "Verified" : "Unverified"}
                    </p>

                    <p className="text-xs text-slate-400">Account Status</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
      CONTACT INFORMATION
  ====================================================== */}
        <div className="border-t border-slate-100 bg-white">
          <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {/* EMAIL */}
            <div className="flex items-center gap-4 px-6 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Mail size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">
                  Email Address
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-slate-700">
                  {mentor.email || "Not available"}
                </p>
              </div>
            </div>

            {/* PHONE */}
            <div className="flex items-center gap-4 px-6 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Phone size={18} />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">
                  Phone Number
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {mentor.phone || "Not available"}
                </p>
              </div>
            </div>

            {/* EXPERIENCE */}
            <div className="flex items-center gap-4 px-6 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Briefcase size={18} />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">Experience</p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {mentor.experience || 0} Years
                </p>
              </div>
            </div>

            {/* CATEGORY */}
            <div className="flex items-center gap-4 px-6 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Award size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">Category</p>

                <p className="mt-1 truncate text-sm font-semibold text-slate-700">
                  {mentor.category || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          STATISTICS
      ===================================================== */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          icon={<Users size={20} />}
          label="Students"
          value={statistics.totalStudents ?? students.length}
        />

        <StatCard
          icon={<CalendarCheck size={20} />}
          label="Bookings"
          value={statistics.totalBookings ?? bookings.length}
        />

        <StatCard
          icon={<CheckCircle size={20} />}
          label="Completed"
          value={
            statistics.completedBookings ??
            bookings.filter((b) => b.bookingStatus === "Completed").length
          }
        />

        <StatCard
          icon={<Video size={20} />}
          label="Meetings"
          value={statistics.totalMeetings ?? meetings.length}
        />

        <StatCard
          icon={<Star size={20} />}
          label="Reviews"
          value={statistics.totalReviews ?? reviews.length}
        />

        <StatCard
          icon={<IndianRupee size={20} />}
          label="Revenue"
          value={`₹${Number(statistics.totalRevenue || 0).toLocaleString(
            "en-IN"
          )}`}
        />
      </div>
      {/* =====================================================
          TABS
      ===================================================== */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <Icon size={18} />

                {tab.label}

                {tab.count !== undefined && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      {/* =====================================================
          TAB CONTENT
      ===================================================== */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <OverviewTab mentor={mentor} location={location} />
        )}

        {activeTab === "students" && (
          <StudentsTab
            students={filteredStudents}
            search={studentSearch}
            setSearch={setStudentSearch}
            API_BASE_URL={API_BASE_URL}
          />
        )}

        {activeTab === "bookings" && (
          <BookingsTab
            bookings={filteredBookings}
            search={bookingSearch}
            setSearch={setBookingSearch}
          />
        )}

        {activeTab === "meetings" && <MeetingsTab meetings={meetings} />}

        {activeTab === "reviews" && (
          <ReviewsTab reviews={reviews} statistics={statistics} />
        )}
        {activeTab === "documents" && (
          <DocumentsTab mentor={mentor} API_BASE_URL={API_BASE_URL} />
        )}
      </div>
    </div>
  );
};

// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <p className="text-sm font-medium text-gray-500">{label}</p>

      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

// =====================================================
// STATUS BADGE
// =====================================================

const StatusBadge = ({ icon, label, value }) => {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700">
      {icon}
      {label}: {value}
    </span>
  );
};

// =====================================================
// OVERVIEW TAB
// =====================================================

const OverviewTab = ({ mentor, location }) => {
  return (
    <div className="space-y-6">
      {/* =====================================================
          ABOUT + CONTACT
      ===================================================== */}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ABOUT */}

        <div className="lg:col-span-2 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <User size={20} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">About Mentor</h2>

              <p className="text-sm text-gray-500">Professional information</p>
            </div>
          </div>

          <p className="whitespace-pre-line leading-7 text-gray-600">
            {mentor.about ||
              mentor.bio ||
              mentor.description ||
              "No mentor description available."}
          </p>

          {/* =====================================================
              TEACHING STYLE
          ===================================================== */}

          {mentor.teachingStyle && (
            <div className="mt-7">
              <div className="mb-3 flex items-center gap-2">
                <BookOpen size={18} className="text-blue-600" />

                <h3 className="font-semibold text-gray-900">Teaching Style</h3>
              </div>

              <p className="whitespace-pre-line leading-7 text-gray-600">
                {mentor.teachingStyle}
              </p>
            </div>
          )}

          {/* =====================================================
              PRIMARY SKILLS
          ===================================================== */}

          {Array.isArray(mentor.primarySkill) &&
            mentor.primarySkill.length > 0 && (
              <div className="mt-7">
                <div className="mb-3 flex items-center gap-2">
                  <Award size={18} className="text-blue-600" />

                  <h3 className="font-semibold text-gray-900">
                    Primary Skills
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {mentor.primarySkill.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                    >
                      {typeof skill === "string"
                        ? skill
                        : skill?.name || "Unknown Skill"}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* =====================================================
              SKILLS
          ===================================================== */}

          {Array.isArray(mentor.skills) && mentor.skills.length > 0 && (
            <div className="mt-7">
              <div className="mb-3 flex items-center gap-2">
                <BookOpen size={18} className="text-indigo-600" />

                <h3 className="font-semibold text-gray-900">Skills</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {mentor.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700"
                  >
                    {typeof skill === "string"
                      ? skill
                      : skill?.name || skill?.title || "Unknown Skill"}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* =====================================================
            CONTACT DETAILS
        ===================================================== */}

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FileText size={20} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">Contact Details</h2>

              <p className="text-sm text-gray-500">
                Mentor contact information
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <InfoRow
              icon={<Mail size={18} />}
              label="Email"
              value={mentor.email}
            />

            <InfoRow
              icon={<Phone size={18} />}
              label="Phone"
              value={mentor.phone}
            />

            <InfoRow
              icon={<MapPin size={18} />}
              label="Location"
              value={location}
            />

            <InfoRow
              icon={<Briefcase size={18} />}
              label="Profession"
              value={mentor.profession}
            />

            <InfoRow
              icon={<Briefcase size={18} />}
              label="Company"
              value={mentor.company}
            />

            <InfoRow
              icon={<Globe size={18} />}
              label="Industry"
              value={mentor.industry}
            />

            {mentor.linkedin && (
              <a
                href={mentor.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <ExternalLink size={18} />
                LinkedIn Profile
              </a>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          EDUCATION
      ===================================================== */}

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <GraduationCap size={20} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">Education</h2>

            <p className="text-sm text-gray-500">Academic background</p>
          </div>
        </div>

        {mentor.education && typeof mentor.education === "object" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailBox
              icon={<GraduationCap size={18} />}
              title="Degree"
              value={mentor.education.degree || "Not available"}
            />

            <DetailBox
              icon={<BookOpen size={18} />}
              title="College"
              value={mentor.education.college || "Not available"}
            />

            <DetailBox
              icon={<Calendar size={18} />}
              title="Graduation Year"
              value={mentor.education.graduationYear || "Not available"}
            />

            <DetailBox
              icon={<Award size={18} />}
              title="CGPA"
              value={mentor.education.cgpa || "Not available"}
            />
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Education details not available.
          </p>
        )}
      </div>

      {/* =====================================================
          PROFESSIONAL EXPERIENCE
      ===================================================== */}

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Briefcase size={20} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">
              Professional Information
            </h2>

            <p className="text-sm text-gray-500">Experience and expertise</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DetailBox
            icon={<Briefcase size={18} />}
            title="Experience"
            value={
              mentor.experience ? `${mentor.experience} years` : "Not available"
            }
          />

          <DetailBox
            icon={<Award size={18} />}
            title="Skill Experience"
            value={
              mentor.skillExperience
                ? `${mentor.skillExperience} years`
                : "Not available"
            }
          />

          <DetailBox
            icon={<ShieldCheck size={18} />}
            title="Skill Level"
            value={mentor.skillLevel || "Not available"}
          />

          <DetailBox
            icon={<Briefcase size={18} />}
            title="Category"
            value={mentor.category || "Not available"}
          />
        </div>
      </div>

      {/* =====================================================
          CERTIFICATIONS + LANGUAGES
      ===================================================== */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* CERTIFICATIONS */}

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
              <Award size={20} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">Certifications</h2>

              <p className="text-sm text-gray-500">
                Professional certifications
              </p>
            </div>
          </div>

          {Array.isArray(mentor.certifications) &&
          mentor.certifications.length > 0 ? (
            <div className="space-y-3">
              {mentor.certifications.map((certificate, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl bg-gray-50 p-4"
                >
                  <CheckCircle size={18} className="text-emerald-600" />

                  <span className="text-sm font-medium text-gray-700">
                    {typeof certificate === "string"
                      ? certificate
                      : certificate?.name || "Certification"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No certifications available.
            </p>
          )}
        </div>

        {/* LANGUAGES */}

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Languages size={20} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">Languages</h2>

              <p className="text-sm text-gray-500">
                Languages spoken by mentor
              </p>
            </div>
          </div>

          {Array.isArray(mentor.languages) && mentor.languages.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {mentor.languages.map((language, index) => (
                <span
                  key={index}
                  className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                >
                  {typeof language === "string"
                    ? language
                    : language?.name || "Language"}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No languages available.</p>
          )}
        </div>
      </div>

      {/* =====================================================
          PRICING + AVAILABILITY
      ===================================================== */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* PRICING */}

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <IndianRupee size={20} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">Pricing</h2>

              <p className="text-sm text-gray-500">Mentor session pricing</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DetailBox
              icon={<IndianRupee size={18} />}
              title="Session Price"
              value={
                mentor.pricing?.sessionPrice
                  ? `₹${mentor.pricing.sessionPrice}`
                  : "Not available"
              }
            />

            <DetailBox
              icon={<CheckCircle size={18} />}
              title="Free Trial"
              value={mentor.pricing?.freeTrial ? "Available" : "Not available"}
            />
          </div>

          {mentor.pricing?.pricingNote && (
            <div className="mt-5 rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Pricing Note
              </p>

              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
                {mentor.pricing.pricingNote}
              </p>
            </div>
          )}
        </div>

        {/* AVAILABILITY */}

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Calendar size={20} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">Availability</h2>

              <p className="text-sm text-gray-500">
                Mentor session availability
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DetailBox
              icon={<Clock size={18} />}
              title="Preferred Time"
              value={mentor.availability?.preferredTime || "Not available"}
            />

            <DetailBox
              icon={<Globe size={18} />}
              title="Timezone"
              value={mentor.availability?.timezone || "Not available"}
            />

            <DetailBox
              icon={<Clock size={18} />}
              title="Start Time"
              value={mentor.availability?.startTime || "Not available"}
            />

            <DetailBox
              icon={<Clock size={18} />}
              title="End Time"
              value={mentor.availability?.endTime || "Not available"}
            />
          </div>

          {Array.isArray(mentor.availability?.availableDays) &&
            mentor.availability.availableDays.length > 0 && (
              <div className="mt-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Available Days
                </p>

                <div className="flex flex-wrap gap-2">
                  {mentor.availability.availableDays.map((day, index) => (
                    <span
                      key={index}
                      className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

// =====================================================
// STUDENTS TAB
// =====================================================

const StudentsTab = ({ students, search, setSearch, API_BASE_URL }) => {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Students</h2>

          <p className="mt-1 text-sm text-gray-500">
            Students connected with this mentor
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {/* EMPTY */}

      {students.length === 0 ? (
        <EmptyState
          icon={<Users size={28} />}
          title="No Students Found"
          description="No students are currently connected with this mentor."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {students.map((student) => {
            const image = student.profileImage
              ? student.profileImage.startsWith("http")
                ? student.profileImage
                : `${API_BASE_URL}${student.profileImage}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  `${student.firstName || ""} ${student.lastName || ""}`
                )}&background=6366f1&color=fff`;

            return (
              <div
                key={student._id}
                className="rounded-2xl border border-gray-100 p-5 transition hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={image}
                    alt={student.firstName}
                    className="h-14 w-14 rounded-xl object-cover"
                  />

                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-gray-900">
                      {student.firstName} {student.lastName}
                    </h3>

                    <p className="truncate text-sm text-gray-500">
                      {student.email || "No email"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  {student.phone && (
                    <p className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={15} />
                      {student.phone}
                    </p>
                  )}

                  {student.createdAt && (
                    <p className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={15} />
                      Joined {formatDate(student.createdAt)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// =====================================================
// BOOKINGS TAB
// =====================================================

const BookingsTab = ({ bookings, search, setSearch }) => {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bookings</h2>

          <p className="mt-1 text-sm text-gray-500">
            All sessions booked with this mentor
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={<CalendarCheck size={28} />}
          title="No Bookings Found"
          description="This mentor does not have any bookings yet."
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const studentName = `${booking.student?.firstName || ""} ${
              booking.student?.lastName || ""
            }`.trim();

            return (
              <div
                key={booking._id}
                className="rounded-2xl border border-gray-100 p-5 transition hover:shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {studentName || "Unknown Student"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {booking.student?.email || "No email"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <StatusPill value={booking.bookingStatus || "Unknown"} />

                    {booking.sessionType && (
                      <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                        {booking.sessionType}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoRow
                    icon={<Calendar size={16} />}
                    label="Date"
                    value={formatDate(booking.sessionDate)}
                  />

                  <InfoRow
                    icon={<Clock size={16} />}
                    label="Time"
                    value={
                      booking.startTime
                        ? `${booking.startTime}${
                            booking.endTime ? ` - ${booking.endTime}` : ""
                          }`
                        : "Not available"
                    }
                  />

                  <InfoRow
                    icon={<IndianRupee size={16} />}
                    label="Amount"
                    value={`₹${Number(booking.amount || 0).toLocaleString(
                      "en-IN"
                    )}`}
                  />

                  <InfoRow
                    icon={<Clock size={16} />}
                    label="Duration"
                    value={
                      booking.duration
                        ? `${booking.duration} minutes`
                        : "Not available"
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// =====================================================
// MEETINGS TAB
// =====================================================

const MeetingsTab = ({ meetings }) => {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Meetings</h2>

        <p className="mt-1 text-sm text-gray-500">
          Meeting sessions associated with this mentor
        </p>
      </div>

      {meetings.length === 0 ? (
        <EmptyState
          icon={<Video size={28} />}
          title="No Meetings Found"
          description="No meeting records are available for this mentor."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {meetings.map((meeting) => (
            <div
              key={meeting._id}
              className="rounded-2xl border border-gray-100 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Video size={20} />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">Meeting Session</h3>

                    <p className="text-xs text-gray-500">
                      Room: {meeting.roomId || "Not available"}
                    </p>
                  </div>
                </div>

                <StatusPill value={meeting.status || "Scheduled"} />
              </div>

              <div className="mt-5 space-y-3">
                <InfoRow
                  icon={<Calendar size={16} />}
                  label="Date"
                  value={formatDate(meeting.createdAt)}
                />

                <InfoRow
                  icon={<Clock size={16} />}
                  label="Time"
                  value={meeting.scheduledStartTime || "Not available"}
                />

                <InfoRow
                  icon={<Clock size={16} />}
                  label="Duration"
                  value={
                    meeting.duration
                      ? `${meeting.duration} minutes`
                      : "Not available"
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// =====================================================
// REVIEWS TAB
// =====================================================

// =====================================================
// PROFILE IMAGE URL HELPER
// =====================================================

const getProfileImageUrl = (image, name, API_BASE_URL) => {
  const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "Student"
  )}&background=6366f1&color=fff&size=200`;

  // No image
  if (!image || typeof image !== "string") {
    return fallbackImage;
  }

  // Remove unnecessary spaces
  const cleanImage = image.trim();

  // Empty image after trim
  if (!cleanImage) {
    return fallbackImage;
  }

  // Already a complete URL
  if (cleanImage.startsWith("http://") || cleanImage.startsWith("https://")) {
    return cleanImage;
  }

  // If API_BASE_URL is missing, use fallback
  if (!API_BASE_URL) {
    return fallbackImage;
  }

  // Safely remove trailing slash from API URL
  const baseUrl = API_BASE_URL.replace(/\/+$/, "");

  // Safely remove leading slash from image path
  const imagePath = cleanImage.replace(/^\/+/, "");

  return `${baseUrl}/${imagePath}`;
};

// =====================================================
// DOCUMENTS TAB
// =====================================================

const DocumentsTab = ({ mentor, API_BASE_URL }) => {
  const getDocumentUrl = (documentPath) => {
    if (!documentPath) return null;

    if (
      documentPath.startsWith("http://") ||
      documentPath.startsWith("https://")
    ) {
      return documentPath;
    }

    const baseUrl = API_BASE_URL.replace(/\/+$/, "");
    const cleanPath = documentPath.replace(/^\/+/, "");

    return `${baseUrl}/${cleanPath}`;
  };

  const documents = [
    {
      title: "Government ID",
      description: "Government-issued identity verification document",
      file: mentor?.governmentId,
      icon: ShieldCheck,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      type: "image",
    },
    {
      title: "Resume",
      description: "Mentor professional resume",
      file: mentor?.resume,
      icon: FileText,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      type: "pdf",
    },
    {
      title: "Degree Certificate",
      description: "Academic degree verification document",
      file: mentor?.degreeCertificate,
      icon: GraduationCap,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      type: "pdf",
    },
  ];

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <FileCheck size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Verification Documents
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Documents submitted by the mentor for verification
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          DOCUMENT CARDS
      ===================================================== */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {documents.map((document) => {
          const Icon = document.icon;
          const documentUrl = getDocumentUrl(document.file);

          return (
            <div
              key={document.title}
              className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* DOCUMENT PREVIEW */}

              <div className="flex h-52 items-center justify-center bg-gray-50">
                {documentUrl ? (
                  document.type === "image" ? (
                    <img
                      src={documentUrl}
                      alt={document.title}
                      className="h-full w-full object-contain p-4"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                        <FileText size={38} />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-gray-600">
                        PDF Document
                      </p>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                      <Icon size={36} />
                    </div>

                    <p className="mt-3 text-sm font-medium text-gray-400">
                      Document Not Available
                    </p>
                  </div>
                )}
              </div>

              {/* DOCUMENT INFORMATION */}

              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${document.iconBg} ${document.iconColor}`}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900">
                      {document.title}
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-gray-500">
                      {document.description}
                    </p>
                  </div>
                </div>

                {/* FILE STATUS */}

                <div className="mt-5 flex items-center gap-2">
                  {documentUrl ? (
                    <>
                      <CheckCircle size={16} className="text-emerald-500" />

                      <span className="text-xs font-semibold text-emerald-600">
                        Document Available
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} className="text-red-500" />

                      <span className="text-xs font-semibold text-red-600">
                        Document Not Uploaded
                      </span>
                    </>
                  )}
                </div>

                {/* ACTION */}

                {documentUrl && (
                  <a
                    href={documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    <ExternalLink size={16} />
                    Open Document
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// =====================================================
// REVIEWS TAB
// =====================================================

const ReviewsTab = ({ reviews = [], statistics = {}, API_BASE_URL }) => {
  return (
    <div className="space-y-6">
      {/* =====================================================
          REVIEW SUMMARY
      ===================================================== */}

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          {/* RATING */}

          <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-2xl bg-yellow-50">
            <Star size={24} className="fill-yellow-400 text-yellow-400" />

            <p className="mt-1 text-xl font-bold text-gray-900">
              {Number(statistics.averageRating || 0).toFixed(1)}
            </p>
          </div>

          {/* SUMMARY */}

          <div>
            <h2 className="text-xl font-bold text-gray-900">Mentor Reviews</h2>

            <p className="mt-1 text-sm text-gray-500">
              Based on {statistics.totalReviews ?? reviews.length} student
              reviews
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          REVIEWS LIST
      ===================================================== */}

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        {/* NO REVIEWS */}

        {reviews.length === 0 ? (
          <EmptyState
            icon={<Star size={28} />}
            title="No Reviews Yet"
            description="This mentor has not received any reviews yet."
          />
        ) : (
          /* REVIEWS */

          <div className="space-y-5">
            {reviews.map((review) => {
              // =================================================
              // STUDENT
              // API RESPONSE:
              // review.studentId = populated student object
              // =================================================

              const student = review?.studentId || null;

              // =================================================
              // STUDENT NAME
              // =================================================

              const studentName = [student?.firstName, student?.lastName]
                .filter(Boolean)
                .join(" ")
                .trim();

              // =================================================
              // STUDENT IMAGE
              // =================================================

              const studentImage = getProfileImageUrl(
                student?.profileImage,
                studentName,
                API_BASE_URL
              );

              // =================================================
              // DEBUG
              // =================================================

              console.log("Review:", review);

              console.log("Student:", student);

              console.log("Original Profile Image:", student?.profileImage);

              console.log("Final Profile Image URL:", studentImage);

              return (
                <div
                  key={review?._id}
                  className="rounded-2xl border border-gray-100 p-5 transition hover:shadow-sm"
                >
                  {/* =================================================
                      REVIEW HEADER
                  ================================================= */}

                  <div className="flex items-start justify-between gap-4">
                    {/* =================================================
                        STUDENT INFORMATION
                    ================================================= */}

                    <div className="flex min-w-0 items-center gap-3">
                      {/* PROFILE IMAGE */}

                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                        <img
                          src={studentImage}
                          alt={studentName || "Student"}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            console.error(
                              "Failed to load student profile image:",
                              e.currentTarget.src
                            );

                            e.currentTarget.onerror = null;

                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              studentName || "Student"
                            )}&background=6366f1&color=fff&size=200`;
                          }}
                        />
                      </div>

                      {/* STUDENT DETAILS */}

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-gray-900">
                          {studentName || "Student"}
                        </h3>

                        {/* EMAIL */}

                        {student?.email && (
                          <p className="truncate text-xs text-gray-500">
                            {student.email}
                          </p>
                        )}

                        {/* REVIEW DATE */}

                        <p className="text-xs text-gray-400">
                          {formatDate(review?.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* =================================================
                        RATING
                    ================================================== */}

                    <div className="flex shrink-0 items-center gap-1 rounded-lg bg-yellow-50 px-2.5 py-1.5">
                      <Star
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />

                      <span className="text-sm font-bold text-gray-900">
                        {review?.rating || 0}.0
                      </span>
                    </div>
                  </div>

                  {/* =================================================
                      REVIEW CONTENT
                  ================================================= */}

                  <div className="mt-4 rounded-xl bg-gray-50 p-4">
                    <p className="leading-6 text-gray-600">
                      {review?.review ||
                        review?.comment ||
                        "No review comment provided."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================================
// INFO ROW
// =====================================================

const InfoRow = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-400">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p className="mt-0.5 break-words text-sm font-medium text-gray-700">
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
};

// =====================================================
// DETAIL BOX
// =====================================================

const DetailBox = ({ icon, title, value }) => {
  return (
    <div className="rounded-2xl bg-gray-50 p-5">
      <div className="flex items-center gap-3">
        <div className="text-blue-600">{icon}</div>

        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>

      <p className="mt-3 text-sm leading-6 text-gray-600">{value}</p>
    </div>
  );
};

// =====================================================
// STATUS PILL
// =====================================================

const StatusPill = ({ value }) => {
  const status = String(value || "").toLowerCase();

  let classes = "bg-gray-100 text-gray-700";

  if (
    status.includes("completed") ||
    status.includes("approved") ||
    status.includes("confirmed") ||
    status.includes("active")
  ) {
    classes = "bg-emerald-50 text-emerald-700";
  }

  if (
    status.includes("pending") ||
    status.includes("waiting") ||
    status.includes("scheduled")
  ) {
    classes = "bg-yellow-50 text-yellow-700";
  }

  if (
    status.includes("cancelled") ||
    status.includes("rejected") ||
    status.includes("expired")
  ) {
    classes = "bg-red-50 text-red-700";
  }

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${classes}`}
    >
      {value || "Unknown"}
    </span>
  );
};

// =====================================================
// EMPTY STATE
// =====================================================

const EmptyState = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-gray-900">{title}</h3>

      <p className="mt-2 max-w-md text-sm text-gray-500">{description}</p>
    </div>
  );
};

// =====================================================
// DATE FORMATTER
// =====================================================

const formatDate = (date) => {
  if (!date) {
    return "Not available";
  }

  try {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Not available";
  }
};

export default MentorDetails;
