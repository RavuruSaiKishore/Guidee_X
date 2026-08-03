import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  BriefcaseBusiness,
  Building2,
  MapPin,
  GraduationCap,
  CalendarDays,
  BadgeCheck,
  Clock3,
  Eye,
  CheckCircle,
  XCircle,
  ClipboardCheck,
  Search,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

const MentorRequests = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("AdminToken");

  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [deleteMentor, setDeleteMentor] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [approvedMentorsCount, setApprovedMentorsCount] = useState(0);

  // ===========================
  // FETCH PENDING MENTORS
  // ===========================

  const fetchPendingMentors = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/admin/pendingmentors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to load mentor requests.");
        return;
      }

      setMentors(data.mentors || []);
      setFilteredMentors(data.mentors || []);
      setApprovedMentorsCount(data.approvedMentorsCount || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load mentor requests.");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // APPROVE MENTOR
  // ===========================

  const handleApproveMentor = async (mentorId) => {
    try {
      setApprovingId(mentorId);

      const res = await fetch(
        `${API_BASE_URL}/api/admin/approve-mentor/${mentorId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to approve mentor.");
        return;
      }

      toast.success("Mentor Approved Successfully");

      setMentors((prev) => prev.filter((mentor) => mentor._id !== mentorId));

      setFilteredMentors((prev) =>
        prev.filter((mentor) => mentor._id !== mentorId)
      );

      if (selectedMentor?._id === mentorId) {
        setSelectedMentor(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setApprovingId(null);
    }
  };

  // ===========================
  // REJECT MENTOR
  // ===========================

  const handleRejectMentor = async () => {
    if (!deleteMentor) return;

    try {
      setDeleting(true);

      const res = await fetch(
        `${API_BASE_URL}/api/admin/mentor/${deleteMentor._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to reject mentor.");
        return;
      }

      toast.success("Mentor Request Rejected");

      setMentors((prev) =>
        prev.filter((mentor) => mentor._id !== deleteMentor._id)
      );

      setFilteredMentors((prev) =>
        prev.filter((mentor) => mentor._id !== deleteMentor._id)
      );

      setDeleteMentor(null);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setDeleting(false);
    }
  };

  // ===========================
  // INITIAL FETCH
  // ===========================

  useEffect(() => {
    fetchPendingMentors();
  }, []);

  // ===========================
  // SEARCH FILTER
  // ===========================

  useEffect(() => {
    let temp = [...mentors];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      temp = temp.filter((mentor) => {
        const name = `${mentor.firstName || ""} ${
          mentor.lastName || ""
        }`.toLowerCase();

        const email = (mentor.email || "").toLowerCase();

        return name.includes(search) || email.includes(search);
      });
    }

    setFilteredMentors(temp);
  }, [searchTerm, mentors]);

  // ===========================
  // LOADING
  // ===========================

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col justify-center items-center px-4">
        <div className="relative">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-4 border-emerald-100"></div>

          <div className="absolute inset-0 h-14 w-14 sm:h-16 sm:w-16 rounded-full border-4 border-transparent border-t-emerald-600 animate-spin"></div>
        </div>

        <p className="mt-6 text-base sm:text-lg font-semibold text-gray-700 text-center">
          Loading Mentor's Request data...!
        </p>

        <p className="text-sm text-gray-400 mt-1 text-center">
          Please wait while we fetch your schedule.
        </p>
      </div>
    );
  }

  // ===========================
  // INFO CARD
  // ===========================

  const InfoCard = ({ title, value }) => {
    return (
      <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200 hover:shadow-md transition min-w-0">
        <p className="text-sm text-gray-500">{title}</p>

        <p className="font-semibold mt-2 break-words text-gray-800">
          {value || "N/A"}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
      <ToastContainer />

      {/* =====================================================
          HEADER / HERO
      ====================================================== */}

      <div className="mb-5 sm:mb-6">
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 shadow-xl">
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 lg:gap-6">
            {/* LEFT */}
            <div className="flex items-start sm:items-center gap-3 sm:gap-5 min-w-0">
              <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  Mentor Approval Requests
                </h1>

                <p className="mt-2 text-sm sm:text-base text-green-100 max-w-xl leading-6">
                  Review mentor applications, verify submitted documents, and
                  approve qualified mentors to join the GuideX platform.
                </p>
              </div>
            </div>

            {/* SEARCH */}
            <div className="relative w-full xl:w-80 shrink-0">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search mentors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 sm:h-12 pl-11 pr-4 rounded-xl bg-white text-gray-700 shadow-lg border border-white/20 focus:ring-2 focus:ring-white/40 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        {/* Pending */}
        <div className="bg-white rounded-xl sm:rounded-2xl border p-4 sm:p-5 lg:p-6">
          <p className="text-gray-500 text-xs sm:text-sm">Pending Requests</p>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">
            {mentors.length}
          </h2>
        </div>

        {/* Verified */}
        <div className="bg-white rounded-xl sm:rounded-2xl border p-4 sm:p-5 lg:p-6">
          <p className="text-gray-500 text-xs sm:text-sm">Verified Documents</p>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mt-2">
            {approvedMentorsCount}
          </h2>
        </div>

        {/* Unverified */}
        <div className="bg-white rounded-xl sm:rounded-2xl border p-4 sm:p-5 lg:p-6">
          <p className="text-gray-500 text-xs sm:text-sm">Unverified</p>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600 mt-2">
            {mentors.filter((m) => !m.isVerified).length}
          </h2>
        </div>

        {/* Average Experience */}
        <div className="bg-white rounded-xl sm:rounded-2xl border p-4 sm:p-5 lg:p-6">
          <p className="text-gray-500 text-xs sm:text-sm">Avg Experience</p>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mt-2">
            {mentors.length
              ? (
                  mentors.reduce(
                    (acc, mentor) => acc + (mentor.experience || 0),
                    0
                  ) / mentors.length
                ).toFixed(1)
              : 0}
            <span className="text-sm sm:text-base lg:text-lg ml-1">yrs</span>
          </h2>
        </div>
      </div>

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {filteredMentors.length === 0 ? (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200 py-16 sm:py-24 px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <img
              src="/empty-state.svg"
              alt=""
              className="w-32 sm:w-44 mb-6"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-700">
              No Pending Requests
            </h2>

            <p className="text-gray-500 mt-3 text-sm sm:text-base">
              There are no mentor approval requests.
            </p>
          </div>
        </div>
      ) : (
        /* =====================================================
            MENTOR CARDS
        ====================================================== */

        <div className="space-y-5 sm:space-y-8">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor._id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="p-4 sm:p-5 md:p-6 lg:p-8">
                {/* TOP SECTION */}

                <div className="flex flex-col xl:flex-row justify-between gap-6 lg:gap-8">
                  {/* PROFILE */}

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 min-w-0">
                    <img
                      src={
                        mentor.profileImage
                          ? `${API_BASE_URL}/${mentor.profileImage}`
                          : "/default-avatar.png"
                      }
                      alt=""
                      className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl object-cover border-4 border-green-100 shrink-0"
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />

                    <div className="min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 break-words">
                        {mentor.firstName} {mentor.lastName}
                      </h2>

                      <p className="text-base sm:text-lg text-gray-500 mt-1 break-words">
                        {mentor.profession || "Profession Not Provided"}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-3 sm:px-4 py-1 rounded-full bg-amber-100 text-amber-700 text-xs sm:text-sm font-semibold">
                          Pending Approval
                        </span>

                        {mentor.isVerified ? (
                          <span className="px-3 sm:px-4 py-1 rounded-full bg-green-100 text-green-700 text-xs sm:text-sm font-semibold">
                            Documents Verified
                          </span>
                        ) : (
                          <span className="px-3 sm:px-4 py-1 rounded-full bg-red-100 text-red-700 text-xs sm:text-sm font-semibold">
                            Documents Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* EXPERIENCE / INDUSTRY */}

                  <div className="grid grid-cols-2 gap-3 w-full xl:w-auto xl:min-w-[280px]">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 sm:px-4 py-3">
                      <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                        <Clock3 size={16} />
                        <span>Experience</span>
                      </div>

                      <p className="text-base sm:text-lg font-semibold text-gray-900 mt-1">
                        {mentor.experience || 0} Years
                      </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 sm:px-4 py-3 min-w-0">
                      <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                        <Building2 size={16} />
                        <span>Industry</span>
                      </div>

                      <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1 truncate">
                        {mentor.industry || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CONTACT INFO */}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5 mt-6 sm:mt-8">
                  <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-3 sm:p-4 min-w-0">
                    <Mail className="text-blue-600 shrink-0" />

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Email</p>

                      <p className="font-medium text-sm break-all">
                        {mentor.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-3 sm:p-4 min-w-0">
                    <Phone className="text-green-600 shrink-0" />

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Phone</p>

                      <p className="font-medium break-words">
                        {mentor.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-3 sm:p-4 min-w-0">
                    <BriefcaseBusiness className="text-purple-600 shrink-0" />

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Profession</p>

                      <p className="font-medium break-words">
                        {mentor.profession || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* DETAILS GRID */}

                <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
                  <div className="bg-gray-50 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <GraduationCap size={18} />
                      <span className="text-sm">Education</span>
                    </div>

                    <p className="font-medium break-words">
                      {mentor.education
                        ? `${mentor.education.degree || "N/A"} - ${
                            mentor.education.college || "N/A"
                          }`
                        : "Not Provided"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <MapPin size={18} />
                      <span className="text-sm">Location</span>
                    </div>

                    <p className="font-medium break-words">
                      {mentor.location
                        ? `${mentor.location.city || ""}, ${
                            mentor.location.state || ""
                          }, ${mentor.location.country || ""}`
                        : "Not Provided"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <CalendarDays size={18} />
                      <span className="text-sm">Joined</span>
                    </div>

                    <p className="font-semibold text-gray-800">
                      {mentor.createdAt
                        ? new Date(mentor.createdAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <BadgeCheck size={18} />
                      <span className="text-sm">Verification</span>
                    </div>

                    <p
                      className={`font-semibold ${
                        mentor.isVerified ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {mentor.isVerified ? "Verified" : "Pending"}
                    </p>
                  </div>
                </div>

                {/* DOCUMENT STATUS */}

                <div className="mt-6 sm:mt-8 border rounded-2xl p-4 sm:p-6 bg-gray-50">
                  <h3 className="font-bold text-lg mb-5">
                    Submitted Documents
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* Profile Photo */}

                    <div
                      onClick={() =>
                        mentor.profileImage &&
                        window.open(
                          `${API_BASE_URL}/${mentor.profileImage}`,
                          "_blank"
                        )
                      }
                      className={`flex items-center gap-3 bg-white rounded-xl p-3 sm:p-4 border transition min-w-0 ${
                        mentor.profileImage
                          ? "hover:border-green-500 hover:shadow-md cursor-pointer"
                          : "cursor-not-allowed opacity-60"
                      }`}
                    >
                      {mentor.profileImage ? (
                        <CheckCircle
                          className="text-green-600 shrink-0"
                          size={20}
                        />
                      ) : (
                        <XCircle className="text-red-500 shrink-0" size={20} />
                      )}

                      <span className="text-sm font-medium break-words">
                        Profile Photo
                      </span>
                    </div>

                    {/* Resume */}

                    <div
                      onClick={() =>
                        mentor.resume &&
                        window.open(
                          `${API_BASE_URL}/${mentor.resume}`,
                          "_blank"
                        )
                      }
                      className={`flex items-center gap-3 bg-white rounded-xl p-3 sm:p-4 border transition min-w-0 ${
                        mentor.resume
                          ? "hover:border-green-500 hover:shadow-md cursor-pointer"
                          : "cursor-not-allowed opacity-60"
                      }`}
                    >
                      {mentor.resume ? (
                        <CheckCircle
                          className="text-green-600 shrink-0"
                          size={20}
                        />
                      ) : (
                        <XCircle className="text-red-500 shrink-0" size={20} />
                      )}

                      <span className="text-sm font-medium break-words">
                        Resume
                      </span>
                    </div>

                    {/* Degree Certificate */}

                    <div
                      onClick={() =>
                        mentor.degreeCertificate &&
                        window.open(
                          `${API_BASE_URL}/${mentor.degreeCertificate}`,
                          "_blank"
                        )
                      }
                      className={`flex items-center gap-3 bg-white rounded-xl p-3 sm:p-4 border transition min-w-0 ${
                        mentor.degreeCertificate
                          ? "hover:border-green-500 hover:shadow-md cursor-pointer"
                          : "cursor-not-allowed opacity-60"
                      }`}
                    >
                      {mentor.degreeCertificate ? (
                        <CheckCircle
                          className="text-green-600 shrink-0"
                          size={20}
                        />
                      ) : (
                        <XCircle className="text-red-500 shrink-0" size={20} />
                      )}

                      <span className="text-sm font-medium break-words">
                        Degree Certificate
                      </span>
                    </div>

                    {/* Government ID */}

                    <div
                      onClick={() =>
                        mentor.governmentId &&
                        window.open(
                          `${API_BASE_URL}/${mentor.governmentId}`,
                          "_blank"
                        )
                      }
                      className={`flex items-center gap-3 bg-white rounded-xl p-3 sm:p-4 border transition min-w-0 ${
                        mentor.governmentId
                          ? "hover:border-green-500 hover:shadow-md cursor-pointer"
                          : "cursor-not-allowed opacity-60"
                      }`}
                    >
                      {mentor.governmentId ? (
                        <CheckCircle
                          className="text-green-600 shrink-0"
                          size={20}
                        />
                      ) : (
                        <XCircle className="text-red-500 shrink-0" size={20} />
                      )}

                      <span className="text-sm font-medium break-words">
                        Government ID
                      </span>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}

                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap sm:justify-end gap-3 sm:gap-4 border-t pt-5 sm:pt-6">
                  <button
                    onClick={() => setSelectedMentor(mentor)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                  >
                    <Eye size={18} />
                    View Profile
                  </button>

                  <button
                    onClick={() => handleApproveMentor(mentor._id)}
                    disabled={approvingId === mentor._id}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition disabled:opacity-60"
                  >
                    <CheckCircle size={18} />

                    {approvingId === mentor._id ? "Approving..." : "Approve"}
                  </button>

                  <button
                    onClick={() => setDeleteMentor(mentor)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =====================================================
          VIEW MENTOR PROFILE MODAL
      ====================================================== */}

      {selectedMentor && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto p-2 sm:p-4 md:p-6 lg:py-10">
          <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
            {/* MODAL HEADER */}

            <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-5 sm:p-6 lg:p-8 text-white">
              <div className="flex flex-col lg:flex-row lg:items-center gap-5 sm:gap-6">
                <img
                  src={
                    selectedMentor.profileImage
                      ? `${API_BASE_URL}/${selectedMentor.profileImage}`
                      : "/default-avatar.png"
                  }
                  alt=""
                  className="w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-2xl sm:rounded-3xl object-cover border-4 border-white shrink-0"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />

                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold break-words">
                    {selectedMentor.firstName} {selectedMentor.lastName}
                  </h2>

                  <p className="text-green-100 text-base sm:text-lg mt-2">
                    {selectedMentor.profession || "Profession Not Provided"}
                  </p>

                  <p className="text-green-50 mt-2 italic break-words">
                    {selectedMentor.headline || "No headline available."}
                  </p>

                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-5">
                    <span className="px-3 sm:px-4 py-2 rounded-full bg-white/20 text-xs sm:text-sm">
                      ⭐ {selectedMentor.averageRating || 0} Rating
                    </span>

                    <span className="px-3 sm:px-4 py-2 rounded-full bg-white/20 text-xs sm:text-sm">
                      {selectedMentor.experience || 0} Years Experience
                    </span>

                    <span className="px-3 sm:px-4 py-2 rounded-full bg-blue-500 text-white text-xs sm:text-sm">
                      {selectedMentor.category || "General"}
                    </span>

                    <span
                      className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold ${
                        selectedMentor.verificationStatus === "Approved"
                          ? "bg-green-200 text-green-900"
                          : selectedMentor.verificationStatus === "Rejected"
                          ? "bg-red-200 text-red-900"
                          : "bg-yellow-300 text-yellow-900"
                      }`}
                    >
                      {selectedMentor.verificationStatus || "Pending"}
                    </span>

                    <span
                      className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold ${
                        selectedMentor.isVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedMentor.isVerified ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL BODY */}

            <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
              {/* PERSONAL INFORMATION */}

              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
                  <InfoCard
                    title="First Name"
                    value={selectedMentor.firstName}
                  />

                  <InfoCard title="Last Name" value={selectedMentor.lastName} />

                  <InfoCard title="Email" value={selectedMentor.email} />

                  <InfoCard title="Phone" value={selectedMentor.phone} />

                  <InfoCard title="Gender" value={selectedMentor.gender} />

                  <InfoCard
                    title="Date of Birth"
                    value={
                      selectedMentor.dob
                        ? new Date(selectedMentor.dob).toLocaleDateString()
                        : "N/A"
                    }
                  />

                  <InfoCard
                    title="City"
                    value={selectedMentor.location?.city}
                  />

                  <InfoCard
                    title="State"
                    value={selectedMentor.location?.state}
                  />

                  <InfoCard
                    title="Country"
                    value={selectedMentor.location?.country}
                  />

                  <InfoCard
                    title="Verification Status"
                    value={selectedMentor.verificationStatus}
                  />

                  <InfoCard
                    title="Account Verified"
                    value={selectedMentor.isVerified ? "Yes" : "No"}
                  />

                  <InfoCard
                    title="Agreement Accepted"
                    value={selectedMentor.agreement ? "Yes" : "No"}
                  />
                </div>
              </div>

              {/* PROFESSIONAL DETAILS */}

              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
                  Professional Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
                  <InfoCard
                    title="Profession"
                    value={selectedMentor.profession}
                  />

                  <InfoCard title="Company" value={selectedMentor.company} />

                  <InfoCard title="Industry" value={selectedMentor.industry} />

                  <InfoCard title="Category" value={selectedMentor.category} />

                  <InfoCard
                    title="Experience"
                    value={`${selectedMentor.experience || 0} Years`}
                  />

                  <InfoCard
                    title="Skill Level"
                    value={selectedMentor.skillLevel}
                  />

                  <InfoCard
                    title="Skill Experience"
                    value={`${selectedMentor.skillExperience || 0} Years`}
                  />

                  <InfoCard
                    title="Average Rating"
                    value={selectedMentor.averageRating}
                  />
                </div>
              </div>

              {/* EDUCATION */}

              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
                  Education
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
                  <InfoCard
                    title="Degree"
                    value={selectedMentor.education?.degree}
                  />

                  <InfoCard
                    title="College"
                    value={selectedMentor.education?.college}
                  />

                  <InfoCard
                    title="CGPA"
                    value={selectedMentor.education?.cgpa}
                  />

                  <InfoCard
                    title="Graduation Year"
                    value={selectedMentor.education?.graduationYear}
                  />
                </div>
              </div>

              {/* HEADLINE */}

              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
                  Professional Headline
                </h3>

                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-gray-700 italic break-words">
                    "{selectedMentor.headline || "No headline available."}"
                  </p>
                </div>
              </div>

              {/* ABOUT */}

              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
                  About Mentor
                </h3>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 max-h-48 overflow-y-auto">
                  <p className="text-sm sm:text-base text-gray-700 leading-7 whitespace-pre-wrap break-words">
                    {selectedMentor.about || "No description available."}
                  </p>
                </div>
              </div>

              {/* SKILLS */}

              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
                  Skills
                </h3>

                <div className="mb-5">
                  <p className="text-sm font-medium text-gray-500 mb-3">
                    Primary Skills
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {selectedMentor.primarySkill?.length ? (
                      selectedMentor.primarySkill.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 rounded-full border border-gray-300 bg-white text-gray-700 text-sm font-medium break-words"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">
                        No Skills Added
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                    <span className="text-sm text-gray-500">Skill Level</span>

                    <span className="font-semibold text-gray-800 text-right">
                      {selectedMentor.skillLevel || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                    <span className="text-sm text-gray-500">Experience</span>

                    <span className="font-semibold text-gray-800 text-right">
                      {selectedMentor.skillExperience || 0} Years
                    </span>
                  </div>
                </div>
              </div>

              {/* LANGUAGES */}

              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
                  Languages Known
                </h3>

                <div className="flex flex-wrap gap-2">
                  {selectedMentor.languages?.length > 0 ? (
                    selectedMentor.languages.flatMap((lang, index) => {
                      try {
                        const parsed = JSON.parse(lang);

                        return parsed.map((language, i) => (
                          <span
                            key={`${index}-${i}`}
                            className="px-3 py-1.5 rounded-full border border-gray-300 bg-white text-gray-700 text-sm font-medium"
                          >
                            {language}
                          </span>
                        ));
                      } catch {
                        return (
                          <span
                            key={index}
                            className="px-3 py-1.5 rounded-full border border-gray-300 bg-white text-gray-700 text-sm font-medium"
                          >
                            {lang}
                          </span>
                        );
                      }
                    })
                  ) : (
                    <span className="text-sm text-gray-500">
                      No Languages Added
                    </span>
                  )}
                </div>
              </div>

              {/* CERTIFICATIONS */}

              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
                  Certifications
                </h3>

                <div className="flex flex-wrap gap-2">
                  {selectedMentor.certifications?.length > 0 ? (
                    selectedMentor.certifications.flatMap((cert, index) => {
                      try {
                        const parsed = JSON.parse(cert);

                        return parsed.map((certificate, i) => (
                          <span
                            key={`${index}-${i}`}
                            className="px-3 py-1.5 rounded-full border border-gray-300 bg-white text-gray-700 text-sm font-medium"
                          >
                            {certificate}
                          </span>
                        ));
                      } catch {
                        return (
                          <span
                            key={index}
                            className="px-3 py-1.5 rounded-full border border-gray-300 bg-white text-gray-700 text-sm font-medium"
                          >
                            {cert}
                          </span>
                        );
                      }
                    })
                  ) : (
                    <span className="text-sm text-gray-500">
                      No Certifications Uploaded
                    </span>
                  )}
                </div>
              </div>

              {/* TEACHING STYLE */}

              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
                  Teaching Style
                </h3>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 max-h-48 overflow-y-auto">
                  <p className="text-sm sm:text-base text-gray-700 leading-7 whitespace-pre-wrap break-words">
                    {selectedMentor.teachingStyle || "No teaching style added."}
                  </p>
                </div>
              </div>

              {/* PRICING */}

              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
                  Pricing Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
                  <InfoCard
                    title="Session Type"
                    value={selectedMentor.pricing?.sessionType}
                  />

                  <InfoCard
                    title="Session Price"
                    value={
                      selectedMentor.pricing?.sessionPrice
                        ? `₹${selectedMentor.pricing.sessionPrice}`
                        : "N/A"
                    }
                  />

                  <InfoCard
                    title="Currency"
                    value={selectedMentor.pricing?.currency}
                  />

                  <InfoCard
                    title="Free Trial"
                    value={
                      selectedMentor.pricing?.freeTrial
                        ? "Available"
                        : "Not Available"
                    }
                  />
                </div>

                <div className="mt-4 sm:mt-5 bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6">
                  <h4 className="font-semibold text-lg mb-3">Pricing Note</h4>

                  <p className="text-gray-700 leading-7 sm:leading-8 whitespace-pre-wrap break-words">
                    {selectedMentor.pricing?.pricingNote ||
                      "No pricing note available."}
                  </p>
                </div>
              </div>

              {/* AVAILABILITY */}

              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
                  Availability
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
                  <InfoCard
                    title="Available Days"
                    value={selectedMentor.availability?.availableDays}
                  />

                  <InfoCard
                    title="Preferred Time"
                    value={selectedMentor.availability?.preferredTime}
                  />

                  <InfoCard
                    title="Start Time"
                    value={selectedMentor.availability?.startTime}
                  />

                  <InfoCard
                    title="End Time"
                    value={selectedMentor.availability?.endTime}
                  />

                  <InfoCard
                    title="Session Duration"
                    value={
                      selectedMentor.availability?.sessionDuration
                        ? `${selectedMentor.availability.sessionDuration} Minutes`
                        : "N/A"
                    }
                  />

                  <InfoCard
                    title="Timezone"
                    value={selectedMentor.availability?.timezone}
                  />
                </div>
              </div>

              {/* DOCUMENTS */}

              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
                  Verification Documents
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {/* Resume */}

                  <a
                    href={
                      selectedMentor.resume
                        ? `${API_BASE_URL}/${selectedMentor.resume}`
                        : "#"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className={`border rounded-xl p-4 sm:p-5 transition ${
                      selectedMentor.resume
                        ? "hover:shadow-md hover:border-green-500 cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      if (!selectedMentor.resume) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-lg bg-blue-100 flex items-center justify-center text-xl sm:text-2xl">
                        📄
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900">Resume</h4>

                        <p className="text-sm text-gray-500 break-words">
                          {selectedMentor.resume
                            ? "Click to view document"
                            : "Not Uploaded"}
                        </p>
                      </div>
                    </div>
                  </a>

                  {/* Degree Certificate */}

                  <a
                    href={
                      selectedMentor.degreeCertificate
                        ? `${API_BASE_URL}/${selectedMentor.degreeCertificate}`
                        : "#"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className={`border rounded-xl p-4 sm:p-5 transition ${
                      selectedMentor.degreeCertificate
                        ? "hover:shadow-md hover:border-green-500 cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      if (!selectedMentor.degreeCertificate) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-lg bg-green-100 flex items-center justify-center text-xl sm:text-2xl">
                        🎓
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900">
                          Degree Certificate
                        </h4>

                        <p className="text-sm text-gray-500 break-words">
                          {selectedMentor.degreeCertificate
                            ? "Click to view document"
                            : "Not Uploaded"}
                        </p>
                      </div>
                    </div>
                  </a>

                  {/* Government ID */}

                  <a
                    href={
                      selectedMentor.governmentId
                        ? `${API_BASE_URL}/${selectedMentor.governmentId}`
                        : "#"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className={`border rounded-xl p-4 sm:p-5 transition ${
                      selectedMentor.governmentId
                        ? "hover:shadow-md hover:border-green-500 cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      if (!selectedMentor.governmentId) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-lg bg-orange-100 flex items-center justify-center text-xl sm:text-2xl">
                        🪪
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900">
                          Government ID
                        </h4>

                        <p className="text-sm text-gray-500 break-words">
                          {selectedMentor.governmentId
                            ? "Click to view document"
                            : "Not Uploaded"}
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* LINKEDIN */}

              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
                  Professional Profile
                </h3>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                  <p className="text-gray-600 mb-3">LinkedIn Profile</p>

                  {selectedMentor.linkedin ? (
                    <a
                      href={selectedMentor.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 font-semibold underline break-all"
                    >
                      {selectedMentor.linkedin}
                    </a>
                  ) : (
                    <p>No LinkedIn profile added.</p>
                  )}
                </div>
              </div>

              {/* ACCOUNT DETAILS */}

              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
                  Account Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
                  <InfoCard
                    title="Created At"
                    value={
                      selectedMentor.createdAt
                        ? new Date(selectedMentor.createdAt).toLocaleString()
                        : "N/A"
                    }
                  />

                  <InfoCard
                    title="Updated At"
                    value={
                      selectedMentor.updatedAt
                        ? new Date(selectedMentor.updatedAt).toLocaleString()
                        : "N/A"
                    }
                  />

                  <InfoCard
                    title="Approved At"
                    value={
                      selectedMentor.approvedAt
                        ? new Date(selectedMentor.approvedAt).toLocaleString()
                        : "Pending"
                    }
                  />

                  <InfoCard
                    title="Approved By"
                    value={selectedMentor.approvedBy || "Not Assigned"}
                  />
                </div>
              </div>

              {/* MODAL FOOTER */}

              <div className="border-t pt-6 sm:pt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
                <button
                  onClick={() => setSelectedMentor(null)}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 font-semibold transition"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    setSelectedMentor(null);
                    handleApproveMentor(selectedMentor._id);
                  }}
                  disabled={approvingId === selectedMentor._id}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition disabled:opacity-60"
                >
                  {approvingId === selectedMentor._id
                    ? "Approving..."
                    : "✅ Approve Mentor"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          REJECT CONFIRMATION MODAL
      ====================================================== */}

      {deleteMentor && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* HEADER */}

            <div className="bg-red-600 text-white p-5 sm:p-8 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto">
                <XCircle size={36} className="sm:hidden" />
                <XCircle size={42} className="hidden sm:block" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold mt-5">
                Reject Mentor Request?
              </h2>
            </div>

            {/* BODY */}

            <div className="p-5 sm:p-8">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <img
                  src={
                    deleteMentor.profileImage
                      ? `${API_BASE_URL}/${deleteMentor.profileImage}`
                      : "/default-avatar.png"
                  }
                  alt=""
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />

                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold break-words">
                    {deleteMentor.firstName} {deleteMentor.lastName}
                  </h3>

                  <p className="text-gray-500 break-all text-sm">
                    {deleteMentor.email}
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 text-sm sm:text-base">
                  Are you sure you want to reject this mentor request?
                </p>

                <p className="text-sm text-red-500 mt-2">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
                <button
                  onClick={() => setDeleteMentor(null)}
                  disabled={deleting}
                  className="w-full sm:flex-1 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 font-semibold transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleRejectMentor}
                  disabled={deleting}
                  className="w-full sm:flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition disabled:opacity-60"
                >
                  {deleting ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorRequests;
