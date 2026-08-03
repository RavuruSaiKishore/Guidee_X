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
  MessageCircle,
  ChevronDown,
  Globe,
  Quote,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const TABS = ["About", "Skills", "Experience", "Education"];

const MentorProfile = () => {
  const { id } = useParams();

  const [mentor, setMentor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState({ average: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showResume, setShowResume] = useState(false);
  const [activeTab, setActiveTab] = useState("About");
  const [showAvailability, setShowAvailability] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMentor();
  }, []);

  const fetchMentor = async () => {
    try {
      const token = localStorage.getItem("UserToken");

      const res = await fetch(`${API_BASE_URL}/api/mentor/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log(data);

      setMentor(data.mentor);
      setReviews(data.reviews || []);
      setRatingSummary(data.ratingSummary || { average: 0, total: 0 });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-3xl shadow-xl px-10 py-8 flex flex-col items-center">
          {/* Spinner */}
          <div className="w-14 h-14 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>

          {/* Text */}
          <h2 className="mt-6 text-xl font-bold text-gray-800">
            Loading Bookings
          </h2>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return <div className="text-center py-20">Mentor not found.</div>;
  }

  const resume = mentor.resume
    ? `${API_BASE_URL}/${mentor.resume.replace(/^\/+/, "")}`
    : null;

  const image = mentor.profileImage
    ? mentor.profileImage.startsWith("http")
      ? mentor.profileImage
      : `${API_BASE_URL}/${mentor.profileImage.replace(/^\/+/, "")}`
    : `https://ui-avatars.com/api/?name=${mentor.firstName}+${mentor.lastName}&background=2563eb&color=ffffff`;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner */}
      <div className="h-56 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-end relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.15),transparent_40%)]" />

        <div className="relative max-w-7xl mx-auto px-6 pb-8 w-full">
          <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest">
            Mentor Profile
          </p>

          <h1 className="text-white text-3xl md:text-4xl font-bold mt-2">
            Learn from experience. Build your future.
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-25">
        {/* HEADER CARD */}
        <div className="-mt-24 bg-white rounded-3xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={image}
              alt=""
              className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${mentor.firstName}+${mentor.lastName}`;
              }}
            />
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-4xl font-bold text-gray-800">
                      {mentor.firstName} {mentor.lastName}
                    </h1>
                    <BadgeCheck
                      size={24}
                      className="text-blue-600 fill-blue-100"
                    />
                  </div>

                  <p className="text-xl text-gray-600 mt-2">
                    {mentor.profession}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-5 text-gray-500">
                    <div className="flex items-center gap-2">
                      <Briefcase size={18} />
                      {mentor.company || "Freelancer"}
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={18} />
                      {mentor.location?.city}, {mentor.location?.state}
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail size={18} />
                      {mentor.email}
                    </div>
                  </div>
                </div>

                {/* Quick action buttons live near identity, not buried below */}
                <div className="flex gap-3">
                  {resume && (
                    <button
                      onClick={() => setShowResume(true)}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition"
                    >
                      <FileText size={18} />
                      Resume
                    </button>
                  )}
                  {/* <button className="flex items-center gap-2 px-5 py-3 rounded-xl border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition">
                    <MessageCircle size={18} />
                    Message
                  </button> */}
                </div>
              </div>

              {/* Stat strip */}
              <div className="flex flex-wrap gap-8 mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Star className="fill-yellow-400 text-yellow-400" size={20} />
                  <span className="font-semibold">
                    {ratingSummary.total > 0 ? ratingSummary.average : "—"}
                  </span>
                  <span className="text-gray-500">
                    ({ratingSummary.total} Reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Award size={20} className="text-yellow-500" />
                  <span className="font-semibold">
                    {mentor.experience || 0}+
                  </span>
                  <span className="text-gray-500">Years Experience</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-blue-600" />
                  <span className="text-gray-500">60 Minutes Session</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BODY: content + sidebar */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* LEFT: tabbed content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg p-8">
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4 mb-6">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 rounded-full font-semibold transition ${
                      activeTab === tab
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {activeTab === "About" && (
                <div>
                  <h2 className="text-2xl font-bold mb-5">About</h2>
                  <p className="text-gray-600 leading-8">
                    {mentor.about || "No description available."}
                  </p>
                </div>
              )}

              {activeTab === "Skills" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Skills</h2>
                  <div className="flex flex-wrap gap-3">
                    {mentor.primarySkill && (
                      <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
                        {mentor.primarySkill}
                      </span>
                    )}

                    {mentor.secondarySkills?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gray-100 rounded-full text-gray-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Experience" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Experience</h2>
                  <div className="border-l-4 border-blue-600 pl-6">
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold">
                        {mentor.profession}
                      </h3>
                      <p className="text-blue-600 font-medium mt-1">
                        {mentor.company || "Freelancer"}
                      </p>
                      <p className="text-gray-500 mt-2">
                        {mentor.experience || 0}+ Years Experience
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Education" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Education</h2>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <GraduationCap size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {mentor.education?.degree || "Degree"}
                      </h3>
                      <p className="text-gray-600 mt-2">
                        {mentor.education?.college ||
                          mentor.education?.university ||
                          "Education details not available"}
                      </p>
                      <p className="text-gray-500 mt-2">
                        {mentor.education?.year}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reviews now full-width under the tabs, not squeezed beside the sidebar */}
            <div className="bg-white rounded-3xl shadow-lg p-8 mt-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Reviews</h2>
                <div className="flex items-center gap-2">
                  <Star className="fill-yellow-400 text-yellow-400" size={20} />
                  <span className="font-semibold text-lg">
                    {ratingSummary.total > 0 ? ratingSummary.average : "—"}
                  </span>
                  <span className="text-gray-500">
                    ({ratingSummary.total} Reviews)
                  </span>
                </div>
              </div>

              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No reviews yet.
                </p>
              ) : (
                <div className="space-y-5">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="rounded-2xl border border-gray-100 bg-gray-50/60 p-6 hover:border-blue-100 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between gap-4">
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
                                  }+${review.studentId?.lastName || ""}`
                            }
                            alt=""
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-sm shrink-0"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {review.studentId
                                ? `${review.studentId.firstName} ${review.studentId.lastName}`
                                : "Anonymous Student"}
                            </h4>
                            {review.createdAt && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {new Date(review.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Rating badge */}
                        <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-100 rounded-full px-3 py-1 shrink-0">
                          <Star
                            size={13}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          <span className="text-xs font-semibold text-yellow-700">
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      {review.review && (
                        <div className="flex gap-2 mt-4">
                          <Quote
                            size={16}
                            className="text-blue-200 shrink-0 mt-1 -scale-x-100"
                          />
                          <p className="text-gray-600 leading-7">
                            {review.review}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR: booking stays sticky and is the only thing here now */}
          <div>
            <div className="bg-white rounded-3xl shadow-lg sticky top-8 overflow-hidden mb-6">
              {/* Accent header strip */}
              <div className="h-2 bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600" />

              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Book a Session
                </h2>

                {/* Price highlight box */}
                <div className="mt-5 rounded-2xl bg-blue-50 border border-blue-100 px-5 py-4">
                  <p className="text-sm text-gray-500">Session Price</p>
                  <h2 className="text-4xl font-bold text-blue-600 mt-1">
                    {mentor.pricing?.sessionPrice
                      ? `₹${mentor.pricing.sessionPrice}`
                      : "Free"}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    per session, all inclusive
                  </p>
                </div>

                {/* Feature list with icon chips */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <Clock size={16} className="text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      {mentor.availability?.sessionDuration || 60} Minutes
                      Session
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                      <Calendar size={16} className="text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      Flexible Schedule
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
                      <Award size={16} className="text-yellow-500" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      {mentor.experience || 0}+ Years Experience
                    </span>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-100" />

                <button
                  onClick={() => navigate(`/mentor/booking/${mentor._id}`)}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5"
                >
                  Book Now
                </button>

                <button
                  onClick={() => setShowAvailability((prev) => !prev)}
                  className="w-full mt-3 flex items-center justify-center gap-2 border border-blue-600 text-blue-600 py-4 rounded-xl font-semibold hover:bg-blue-50 transition"
                >
                  <Calendar size={18} />
                  Check Availability
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      showAvailability ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showAvailability && (
                  <div className="mt-3 rounded-2xl bg-gray-50 border border-gray-100 p-5 animate-in fade-in slide-in-from-top-2 duration-200">
                    {mentor.availability?.availableDays?.length > 0 ? (
                      <div className="space-y-5">
                        {/* Available days as chips */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Calendar size={14} className="text-blue-600" />
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Available Days
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {mentor.availability.availableDays.map(
                              (day, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-700"
                                >
                                  {day}
                                </span>
                              )
                            )}
                          </div>
                        </div>

                        <div className="border-t border-gray-200" />

                        {/* Time window */}
                        {(mentor.availability.startTime ||
                          mentor.availability.endTime) && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                              <Clock size={14} className="text-blue-600" />
                            </div>
                            <div className="flex-1 flex items-center justify-between">
                              <span className="text-sm text-gray-500">
                                Session Window
                              </span>
                              <span className="text-sm text-gray-800 font-semibold">
                                {mentor.availability.startTime || "—"} –{" "}
                                {mentor.availability.endTime || "—"}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Preferred time, if the mentor set one */}
                        {mentor.availability.preferredTime && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                              <Star size={14} className="text-green-600" />
                            </div>
                            <div className="flex-1 flex items-center justify-between">
                              <span className="text-sm text-gray-500">
                                Preferred Time
                              </span>
                              <span className="text-sm text-gray-800 font-semibold">
                                {mentor.availability.preferredTime}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Timezone */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
                            <Globe size={14} className="text-yellow-600" />
                          </div>
                          <div className="flex-1 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              Timezone
                            </span>
                            <span className="text-sm text-gray-800 font-semibold">
                              {mentor.availability.timezone || "Asia/Kolkata"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-2">
                        No fixed availability listed — pick a time on the
                        booking page and the mentor will confirm.
                      </p>
                    )}
                  </div>
                )}

                <p className="text-center text-xs text-gray-400 mt-4">
                  No charge until the mentor confirms your session
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative bg-white rounded-2xl shadow-2xl w-[95%] md:w-[80%] lg:w-[70%] h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Resume</h2>
              <button
                onClick={() => setShowResume(false)}
                className="text-2xl font-bold text-gray-500 hover:text-red-600"
              >
                ✕
              </button>
            </div>

            {/* PDF Viewer */}
            <iframe src={resume} title="Resume" className="w-full h-full" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorProfile;
