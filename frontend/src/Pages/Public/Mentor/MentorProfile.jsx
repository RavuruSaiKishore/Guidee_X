import { useEffect, useState } from "react";
import {
  MapPin,
  Briefcase,
  Star,
  Calendar,
  Clock,
  Award,
  FileText,
  Mail,
  GraduationCap,
  BadgeCheck,
  ChevronDown,
  Globe,
  Quote,
  MessageSquare,
  Heart,
  MoreHorizontal,
  Sparkles,
  ShieldCheck,
  Video,
  Languages,
  ArrowUpRight,
  CheckCircle,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const TABS = ["Overview", "Reviews", "Skills & Experience", "Education"];

const MentorProfile = () => {
  const { id } = useParams();

  const [mentor, setMentor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState({ average: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showResume, setShowResume] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [showAvailability, setShowAvailability] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMentor();
  }, []);

  const fetchMentor = async () => {
    try {
      const token =
        localStorage.getItem("UserToken") || localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/mentor/${id}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await res.json();
      setMentor(data.mentor);
      setReviews(data.reviews || []);
      setRatingSummary(data.ratingSummary || { average: 0, total: 0 });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProtectedAction = (targetPath) => {
    const token =
      localStorage.getItem("UserToken") || localStorage.getItem("token");

    if (!token) {
      navigate(`/login?redirect=${encodeURIComponent(targetPath)}`);
    } else {
      navigate(targetPath);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans text-xs">
        <div className="bg-white border border-slate-100 rounded-3xl shadow-2xl px-12 py-10 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <h2 className="mt-5 text-xs font-bold text-slate-700 tracking-wider uppercase">
            Loading Mentor Profile...
          </h2>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans text-xs font-bold text-slate-500 uppercase tracking-widest">
        Mentor profile not found.
      </div>
    );
  }

  const resume = mentor.resume
    ? `${API_BASE_URL}/${mentor.resume.replace(/^\/+/, "")}`
    : null;

  const image = mentor.profileImage
    ? mentor.profileImage.startsWith("http")
      ? mentor.profileImage
      : `${API_BASE_URL}/${mentor.profileImage.replace(/^\/+/, "")}`
    : `https://ui-avatars.com/api/?name=${mentor.firstName}+${mentor.lastName}&background=2563eb&color=ffffff&size=200`;

  return (
    <div
      className="min-h-screen bg-slate-50/60 text-slate-900 pb-32 text-xs"
      style={{
        fontFamily:
          "'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Refined Modern Header Banner with Subtle Gradient and Mesh Accent */}
      <div className="h-56 sm:h-64 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 flex items-end relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.25),transparent_50%)]" />
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pb-6 w-full flex items-center justify-between">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-blue-200 text-xs font-semibold backdrop-blur-md shadow-sm">
            <Sparkles size={14} className="text-blue-400" /> Verified Expert
            Mentor at GuideX
          </span>
          <span className="hidden sm:inline-block text-slate-300 text-xs font-medium">
            Member since{" "}
            {new Date(mentor.createdAt || Date.now()).getFullYear()}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP PROFILE CARD */}
        <div className="-mt-20 bg-white rounded-3xl border border-slate-200/70 shadow-xl shadow-slate-200/40 p-6 sm:p-8 relative z-10 transition-all">
          <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start w-full">
              <img
                src={image}
                alt=""
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md shrink-0 -mt-12 md:-mt-16 bg-slate-100 ring-1 ring-slate-200"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${mentor.firstName}+${mentor.lastName}&background=2563eb&color=ffffff&size=200`;
                }}
              />
              <div className="text-center md:text-left space-y-2 flex-1">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    {mentor.firstName} {mentor.lastName}
                  </h1>
                  <BadgeCheck
                    size={22}
                    className="text-blue-600 fill-blue-50"
                  />
                </div>

                <p className="text-xs sm:text-sm font-semibold text-blue-600">
                  {mentor.profession || "Industry Specialist"}{" "}
                  {mentor.company ? `at ${mentor.company}` : ""}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-slate-500 text-xs font-medium">
                  {mentor.location?.city && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-slate-400" />{" "}
                      {mentor.location.city}, {mentor.location.state}
                    </span>
                  )}
                  {mentor.industry && (
                    <span className="flex items-center gap-1.5">
                      <Briefcase size={14} className="text-slate-400" />{" "}
                      {mentor.industry}
                    </span>
                  )}
                  {mentor.languages?.length > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Languages size={14} className="text-slate-400" />{" "}
                      {mentor.languages.join(", ")}
                    </span>
                  )}
                </div>

                {/* Pricing Cards Row Inside Header */}
                <div className="flex flex-wrap gap-3 pt-3">
                  <div className="px-4 py-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-left shadow-2xs">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Per 1-1 session
                    </p>
                    <p className="text-sm font-bold text-blue-600 mt-0.5">
                      {mentor.pricing?.sessionPrice
                        ? `₹${mentor.pricing.sessionPrice}`
                        : "Free"}
                    </p>
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-left shadow-2xs">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Session Duration
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">
                      {mentor.availability?.sessionDuration || 60} mins
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Icon Buttons */}
            <div className="flex items-center gap-2 self-center md:self-start shrink-0">
              <button
                title="Message Mentor"
                className="p-2.5 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition cursor-pointer shadow-2xs"
              >
                <MessageSquare size={16} />
              </button>
              <button
                title="Save Profile"
                className="p-2.5 rounded-2xl border border-slate-200 bg-white text-slate-400 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition cursor-pointer shadow-2xs"
              >
                <Heart size={16} />
              </button>
              <button
                title="More Options"
                className="p-2.5 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-8 mt-8 border-b border-slate-200 text-xs sm:text-sm font-semibold">
            {TABS.map((tab) => {
              const count = tab === "Reviews" ? ratingSummary.total : null;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3.5 relative transition cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? "text-blue-600 font-bold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab}
                  {count !== null && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* BODY: Content and Sticky Booking Sidebar */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* LEFT CONTENT AREA */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === "Overview" && (
              <div className="bg-white rounded-3xl border border-slate-200/70 shadow-xl shadow-slate-200/30 p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Biography & About
                  </h2>
                  <p className="text-slate-600 leading-relaxed font-normal text-xs sm:text-sm">
                    {mentor.about ||
                      mentor.headline ||
                      "Dedicated industry professional focused on accelerating careers, conducting rigorous reviews, and providing actionable roadmap guidance to aspiring learners."}
                  </p>
                </div>

                {mentor.teachingStyle && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1.5">
                    <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} className="text-blue-600" /> Teaching
                      Philosophy
                    </h3>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {mentor.teachingStyle}
                    </p>
                  </div>
                )}

                {/* Profile Insights */}
                <div className="pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Mentor Quality & Trust
                    </h3>
                    <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      <ShieldCheck size={14} /> Verified Profile
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                        <CheckCircle size={15} /> High Response Rate
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        Responds consistently to session requests and messages
                        within 24 hours.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center gap-2 text-amber-600 font-bold text-xs">
                        <Award size={15} /> Industry Expert
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        {mentor.experience || 0}+ years of proven professional
                        domain background.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Certifications if available */}
                {mentor.certifications?.length > 0 && (
                  <div className="pt-6 border-t border-slate-100 space-y-3">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Certifications & Credentials
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {mentor.certifications.map((cert, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Reviews" && (
              <div className="bg-white rounded-3xl border border-slate-200/70 shadow-xl shadow-slate-200/30 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Student Testimonials & Ratings
                  </h2>
                  <div className="flex items-center gap-2 font-bold bg-amber-50 border border-amber-200/60 px-3.5 py-1.5 rounded-full">
                    <Star className="fill-amber-400 text-amber-400" size={15} />
                    <span className="text-slate-900 text-sm">
                      {ratingSummary.total > 0 ? ratingSummary.average : "—"}
                    </span>
                    <span className="text-slate-500 font-normal text-xs">
                      ({ratingSummary.total} reviews)
                    </span>
                  </div>
                </div>

                {reviews.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 text-xs font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    No reviews written for this mentor yet. Book a session to
                    leave the first review!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 space-y-3 shadow-2xs hover:border-blue-200 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                review.studentId?.profileImage
                                  ? review.studentId.profileImage.startsWith(
                                      "http"
                                    )
                                    ? review.studentId.profileImage
                                    : `${API_BASE_URL}/${review.studentId.profileImage.replace(
                                        /^\/+/,
                                        ""
                                      )}`
                                  : `https://ui-avatars.com/api/?name=${
                                      review.studentId?.firstName || "Student"
                                    }+${
                                      review.studentId?.lastName || ""
                                    }&background=2563eb&color=ffffff`
                              }
                              alt=""
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
                            />
                            <div>
                              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                                {review.studentId
                                  ? `${review.studentId.firstName} ${review.studentId.lastName}`
                                  : "Student"}
                              </h4>
                              {review.createdAt && (
                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
                            <Star
                              size={12}
                              className="fill-amber-400 text-amber-400"
                            />
                            <span className="text-xs font-bold text-amber-800">
                              {review.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        {review.review && (
                          <div className="pl-13 text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                            {review.review}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "Skills & Experience" && (
              <div className="bg-white rounded-3xl border border-slate-200/70 shadow-xl shadow-slate-200/30 p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Primary & Secondary Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {mentor.primarySkill && (
                      <span className="px-3.5 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-xl border border-blue-200 text-xs shadow-2xs">
                        {mentor.primarySkill}
                      </span>
                    )}
                    {mentor.secondarySkills?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 bg-slate-100 border border-slate-200/80 text-slate-700 font-semibold rounded-xl text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Professional Background
                  </h3>
                  <div className="border-l-3 border-blue-600 pl-4 py-1 space-y-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {mentor.profession}
                    </h4>
                    <p className="text-blue-600 font-bold text-xs">
                      {mentor.company || "Independent Practitioner"}
                    </p>
                    <p className="text-slate-500 text-xs font-medium">
                      {mentor.experience || 0}+ Years of Professional Industry
                      Experience
                    </p>
                    {mentor.industry && (
                      <p className="text-slate-400 text-[11px] pt-1">
                        Industry Domain:{" "}
                        <span className="font-semibold text-slate-700">
                          {mentor.industry}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Education" && (
              <div className="bg-white rounded-3xl border border-slate-200/70 shadow-xl shadow-slate-200/30 p-6 sm:p-8 space-y-6">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Educational Qualification
                </h3>
                {mentor.education ? (
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-2xs">
                      <GraduationCap size={22} className="text-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {mentor.education.degree || "Degree Qualification"}
                      </h4>
                      <p className="text-slate-600 text-xs font-semibold">
                        {mentor.education.college ||
                          mentor.education.university ||
                          "University Institution"}
                      </p>
                      <p className="text-slate-400 text-[11px]">
                        Graduation Year:{" "}
                        <span className="font-semibold text-slate-700">
                          {mentor.education.graduationYear ||
                            mentor.education.year ||
                            "N/A"}
                        </span>{" "}
                        {mentor.education.cgpa
                          ? `• CGPA/Percentage: ${mentor.education.cgpa}`
                          : ""}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    No formal education details listed.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR: COMMUNITY STATS & BOOKING */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 sm:p-7 space-y-6 sticky top-6">
              <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 -mt-6 sm:-mt-7 -mx-6 sm:-mx-7 mb-4 rounded-t-3xl" />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Session Price
                  </h3>
                  <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
                    {mentor.pricing?.sessionPrice
                      ? `₹${mentor.pricing.sessionPrice}`
                      : "Free"}
                  </h2>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  All Inclusive
                </span>
              </div>

              {/* Feature summary list */}
              <div className="space-y-3.5 pt-2 text-slate-700 text-xs font-semibold border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                    <Clock size={15} />
                  </div>
                  <span>
                    {mentor.availability?.sessionDuration || 60} Minutes Video
                    Call
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                    <Video size={15} />
                  </div>
                  <span>Interactive 1-on-1 Personalized Guidance</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                    <Award size={15} />
                  </div>
                  <span>
                    {mentor.experience || 0}+ Years Verified Professional
                    Expertise
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  onClick={() =>
                    handleProtectedAction(`/mentor/booking/${mentor._id}`)
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 cursor-pointer flex items-center justify-center gap-2"
                >
                  Book Session Now <ArrowUpRight size={16} />
                </button>

                <button
                  onClick={() => setShowAvailability((prev) => !prev)}
                  className="w-full flex items-center justify-center gap-2 border border-slate-200 bg-slate-50/80 text-slate-700 py-3.5 rounded-2xl font-bold hover:bg-slate-100 transition cursor-pointer shadow-2xs"
                >
                  <Calendar size={15} className="text-blue-600" /> Check
                  Availability Schedule
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      showAvailability ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {showAvailability && (
                <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-3.5 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
                  {mentor.availability?.availableDays?.length > 0 ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Available Days
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {mentor.availability.availableDays.map((day, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl font-bold text-[10px]"
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="border-t border-slate-200/80 pt-3 flex justify-between text-slate-600 font-medium">
                        <span className="text-slate-400">Time Window:</span>
                        <span className="text-slate-900 font-bold">
                          {mentor.availability.startTime || "Flexible"} –{" "}
                          {mentor.availability.endTime || "Flexible"}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 font-medium">
                        <span className="text-slate-400">Timezone:</span>
                        <span className="text-slate-900 font-bold">
                          {mentor.availability.timezone || "Asia/Kolkata"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center font-medium py-1">
                      Flexible slots open upon booking request.
                    </p>
                  )}
                </div>
              )}

              {resume && (
                <button
                  onClick={() => setShowResume(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                >
                  <FileText size={15} className="text-blue-600" /> View Detailed
                  Resume PDF
                </button>
              )}

              <p className="text-center text-[11px] text-slate-400 font-medium pt-1">
                🔒 Safe booking. No charge until session confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Modal */}
      {showResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Mentor Resume Viewer
              </h2>
              <button
                onClick={() => setShowResume(false)}
                className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer text-sm transition"
              >
                ✕
              </button>
            </div>
            <iframe
              src={resume}
              title="Resume"
              className="w-full flex-1 bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorProfile;
