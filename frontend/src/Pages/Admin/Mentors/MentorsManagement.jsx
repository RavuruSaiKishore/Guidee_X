import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  Search,
  RotateCcw,
  Activity,
  CalendarDays,
  GraduationCap,
  UserPlus,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MentorManagement = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("AdminToken");
  const navigate = useNavigate();

  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [deleteMentor, setDeleteMentor] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/allmentors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log(data);

      if (data.success) {
        setMentors(data.mentors || []);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch mentors");
    } finally {
      setLoading(false);
    }
  };

  const filteredMentors = mentors.filter((mentor) => {
    const name = `${mentor.firstName || ""} ${
      mentor.lastName || ""
    }`.toLowerCase();

    const email = (mentor.email || "").toLowerCase();

    const search = searchTerm.toLowerCase();

    const matchesSearch = name.includes(search) || email.includes(search);

    if (statusFilter === "Active") {
      return matchesSearch && mentor.accountStatus === "Active";
    }

    if (statusFilter === "Suspended") {
      return matchesSearch && mentor.accountStatus === "Suspended";
    }

    return matchesSearch;
  });

  const handleDeleteMentor = async () => {
    if (!deleteMentor) return;

    try {
      setDeleting(true);

      const res = await fetch(
        `${API_BASE_URL}/api/admin/mentors/${deleteMentor._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      setMentors((prev) =>
        prev.filter((mentor) => mentor._id !== deleteMentor._id)
      );

      toast.success("Mentor deleted successfully.");

      setDeleteMentor(null);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (mentor) => {
    try {
      const endpoint =
        mentor.accountStatus === "Active"
          ? `${API_BASE_URL}/api/admin/mentors/${mentor._id}/suspend`
          : `${API_BASE_URL}/api/admin/mentors/${mentor._id}/activate`;

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body:
          mentor.accountStatus === "Active"
            ? JSON.stringify({
                reason: "Suspended by Admin",
              })
            : JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMentors((prev) =>
        prev.map((m) =>
          m._id === mentor._id
            ? {
                ...m,
                accountStatus:
                  mentor.accountStatus === "Active" ? "Suspended" : "Active",
              }
            : m
        )
      );

      setOpenDropdown(null);

      toast.success(
        mentor.accountStatus === "Active"
          ? "Mentor suspended successfully."
          : "Mentor activated successfully."
      );
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update mentor status.");
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All Status");
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col justify-center items-center px-4">
        <div className="relative">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-4 border-emerald-100"></div>

          <div className="absolute inset-0 h-14 w-14 sm:h-16 sm:w-16 rounded-full border-4 border-transparent border-t-emerald-600 animate-spin"></div>
        </div>

        <p className="mt-6 text-base sm:text-lg font-semibold text-gray-700 text-center">
          Loading your mentor's data...!
        </p>

        <p className="text-sm text-gray-400 mt-1 text-center">
          Please wait while we fetch your schedule.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-5 lg:p-6">
      <ToastContainer />

      {/* ===================== HEADER ===================== */}

      <div className="mb-5 sm:mb-6">
        {/* ================= HERO BANNER ================= */}

        <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-xl">
          <div className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
              {/* LEFT CONTENT */}

              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 w-full">
                {/* ICON */}

                <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>

                {/* TEXT */}

                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                    Mentor Management
                  </h1>

                  <p className="mt-2 text-sm sm:text-base text-teal-100 max-w-2xl leading-6">
                    Manage mentors, monitor their account status, review
                    profiles, and control mentor access across the platform.
                  </p>

                  {/* STATS */}

                  <div className="flex flex-col sm:flex-row sm:flex-wrap items-start gap-2 sm:gap-3 mt-4 sm:mt-5">
                    <div className="w-full sm:w-auto flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl sm:rounded-full bg-white/15 border border-white/20 text-white text-xs sm:text-sm">
                      <Activity size={15} />

                      <span>Showing</span>

                      <span className="font-semibold">
                        {filteredMentors.length}
                      </span>

                      <span>of</span>

                      <span className="font-semibold">{mentors.length}</span>

                      <span>Mentors</span>
                    </div>

                    <div className="w-full sm:w-auto flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl sm:rounded-full bg-white/15 border border-white/20 text-white text-xs sm:text-sm">
                      <CalendarDays size={15} />

                      {new Date().toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT STATISTICS */}

              <div className="w-full xl:w-auto">
                <div className="bg-white rounded-xl sm:rounded-2xl px-5 py-4 sm:px-6 sm:py-5 shadow-lg w-full xl:min-w-[220px]">
                  <p className="text-gray-500 text-sm">Total Mentors</p>

                  <h2 className="text-3xl sm:text-4xl font-bold text-teal-600 mt-1">
                    {mentors.length}
                  </h2>

                  <p className="text-green-600 text-sm mt-2">
                    Registered on Platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= TOOLBAR ================= */}

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border mt-4 sm:mt-5 px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* SEARCH */}

            <div className="relative w-full lg:flex-1 lg:max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search mentors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 sm:h-12 pl-11 pr-4 rounded-xl border border-gray-300 bg-gray-50 text-sm sm:text-base focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            {/* ACTIONS */}

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex items-stretch gap-3 w-full lg:w-auto">
              {/* FILTER */}

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 sm:h-12 w-full lg:w-auto rounded-xl border border-gray-300 bg-gray-50 px-4 sm:px-5 text-sm sm:text-base outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>

              {/* CLEAR */}

              <button
                onClick={handleClearFilters}
                className="h-11 sm:h-12 px-4 sm:px-5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base font-medium flex items-center justify-center gap-2 transition"
              >
                <RotateCcw size={17} />
                <span>Clear</span>
              </button>

              {/* ADD MENTOR */}

              <button
                onClick={() => navigate("/admin/mentors/add")}
                className="h-11 sm:h-12 px-5 sm:px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-2 shadow-lg transition"
              >
                <UserPlus size={18} />
                <span>Add Mentor</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= EMPTY STATE ================= */}

      {filteredMentors.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-14 sm:py-20">
          <div className="flex flex-col items-center justify-center text-center px-5 sm:px-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5V4H2v16h5m10 0v-4a3 3 0 00-3-3H10a3 3 0 00-3 3v4m10 0H7m10-12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>

            <h2 className="mt-5 text-xl sm:text-2xl font-bold text-gray-800">
              No Mentors Found
            </h2>

            <p className="mt-3 max-w-lg text-sm sm:text-base text-gray-500 leading-6">
              There are currently no mentor applications available. Once users
              apply to become mentors, their applications will appear here for
              review and approval.
            </p>

            <button
              onClick={handleClearFilters}
              className="mt-7 sm:mt-8 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
            >
              Refresh
            </button>
          </div>
        </div>
      ) : (
        /* ================= MENTOR LIST ================= */

        <div className="bg-white rounded-xl shadow overflow-visible">
          <div className="space-y-3 sm:space-y-4">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor._id}
                className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                <div className="p-4 sm:p-5 lg:p-6">
                  {/* ================= TOP SECTION ================= */}

                  <div className="flex flex-col gap-5">
                    {/* PROFILE AREA */}

                    <div className="flex flex-col sm:flex-row justify-between gap-5">
                      {/* LEFT */}

                      <div className="flex flex-col xs:flex-row sm:flex-row gap-4 min-w-0">
                        {/* PROFILE IMAGE */}

                        <img
                          src={
                            mentor.profileImage
                              ? mentor.profileImage.startsWith("http")
                                ? mentor.profileImage
                                : `${API_BASE_URL}${
                                    mentor.profileImage.startsWith("/")
                                      ? ""
                                      : "/"
                                  }${mentor.profileImage}`
                              : "/default-avatar.png"
                          }
                          alt={`${mentor.firstName || ""} ${
                            mentor.lastName || ""
                          }`}
                          className="h-20 w-20 sm:h-20 sm:w-20 shrink-0 rounded-xl border-4 border-blue-100 object-cover shadow"
                          onError={(e) => {
                            console.error(
                              "Profile image failed:",
                              e.target.src
                            );
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/default-avatar.png";
                          }}
                        />

                        {/* DETAILS */}

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-lg sm:text-xl font-bold text-slate-800 break-words">
                              {mentor.firstName} {mentor.lastName}
                            </h2>

                            <span
                              className={`rounded-full px-3 py-1 text-[11px] sm:text-xs font-semibold ${
                                mentor.verificationStatus === "Approved"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              ✓ {mentor.verificationStatus}
                            </span>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                            <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
                              {mentor.profession || "Profession"}
                            </span>

                            <span className="hidden sm:inline text-slate-400">
                              •
                            </span>

                            <span className="rounded-full bg-violet-50 px-3 py-1 font-medium text-violet-700">
                              {mentor.company || "Company"}
                            </span>
                          </div>

                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                            {mentor.headline || "No headline available."}
                          </p>
                        </div>
                      </div>

                      {/* RIGHT SIDE */}

                      <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                        {/* STATUS DROPDOWN */}

                        <div className="relative w-full sm:w-auto">
                          <button
                            onClick={() =>
                              setOpenDropdown(
                                openDropdown === mentor._id ? null : mentor._id
                              )
                            }
                            className={`w-full sm:min-w-[150px] flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                              mentor.accountStatus === "Active"
                                ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                                : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`h-2.5 w-2.5 rounded-full ${
                                  mentor.accountStatus === "Active"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              />

                              {mentor.accountStatus}
                            </div>

                            <ChevronDown size={16} />
                          </button>

                          {openDropdown === mentor._id && (
                            <div className="absolute right-0 top-12 z-50 w-full sm:w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                              {mentor.accountStatus === "Active" ? (
                                <button
                                  onClick={() => handleToggleStatus(mentor)}
                                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-amber-700 transition hover:bg-amber-50"
                                >
                                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                                  Suspend
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleToggleStatus(mentor)}
                                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-green-700 transition hover:bg-green-50"
                                >
                                  <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
                                  Activate
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* STATS */}

                        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
                          <div className="rounded-lg bg-yellow-50 px-2 sm:px-4 py-2 text-center">
                            <p className="text-[10px] sm:text-[11px] text-yellow-700">
                              Rating
                            </p>

                            <p className="font-bold text-sm sm:text-base text-yellow-600">
                              ⭐ {mentor.averageRating || 0}
                            </p>
                          </div>

                          <div className="rounded-lg bg-cyan-50 px-2 sm:px-4 py-2 text-center">
                            <p className="text-[10px] sm:text-[11px] text-cyan-700">
                              Experience
                            </p>

                            <p className="font-bold text-sm sm:text-base text-cyan-600">
                              {mentor.experience || 0} Yrs
                            </p>
                          </div>

                          <div className="rounded-lg bg-emerald-50 px-2 sm:px-4 py-2 text-center">
                            <p className="text-[10px] sm:text-[11px] text-emerald-700">
                              Fee
                            </p>

                            <p className="font-bold text-sm sm:text-base text-emerald-600">
                              ₹{mentor.pricing?.sessionPrice || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DIVIDER */}

                    <div className="border-t border-slate-200"></div>

                    {/* CONTACT */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {/* EMAIL */}

                      <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                          📧
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-slate-400">Email</p>

                          <p className="truncate text-sm font-medium text-slate-700">
                            {mentor.email || "Not available"}
                          </p>
                        </div>
                      </div>

                      {/* PHONE */}

                      <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100">
                          📱
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-slate-400">Phone</p>

                          <p className="truncate text-sm font-medium text-slate-700">
                            {mentor.phone || "Not available"}
                          </p>
                        </div>
                      </div>

                      {/* LOCATION */}

                      <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100">
                          📍
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-slate-400">Location</p>

                          <p className="truncate text-sm font-medium text-slate-700">
                            {mentor.location?.city || "N/A"},{" "}
                            {mentor.location?.state || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* SKILLS */}

                    {mentor.primarySkill?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {mentor.primarySkill.map((skill, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* ABOUT */}

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-700">
                        About
                      </h3>

                      <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                        {mentor.about ||
                          "No information available about this mentor."}
                      </p>
                    </div>

                    {/* ACTIONS */}

                    <div className="flex flex-col sm:flex-row justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/mentors/${mentor._id}`)}
                        className="w-full sm:w-auto rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                      >
                        View Profile
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/admin/mentors/${mentor._id}/edit`)
                        }
                        className="w-full sm:w-auto rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-600"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}

      {deleteMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-gray-200">
            {/* BODY */}

            <div className="p-5 sm:p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-7 w-7 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  />
                </svg>
              </div>

              <h2 className="mt-5 text-xl font-semibold text-gray-800">
                Delete Mentor?
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                You are about to permanently delete
              </p>

              <p className="mt-1 font-semibold text-gray-800 break-words">
                {deleteMentor.firstName} {deleteMentor.lastName}
              </p>

              <p className="text-sm text-gray-500 break-all">
                {deleteMentor.email}
              </p>

              <p className="mt-5 text-sm text-red-500">
                This action cannot be undone.
              </p>
            </div>

            {/* FOOTER */}

            <div className="flex border-t">
              <button
                onClick={() => setDeleteMentor(null)}
                disabled={deleting}
                className="w-1/2 py-3 font-medium text-gray-600 hover:bg-gray-50 rounded-bl-2xl transition disabled:opacity-50"
              >
                Cancel
              </button>

              <div className="w-px bg-gray-200"></div>

              <button
                onClick={handleDeleteMentor}
                disabled={deleting}
                className="w-1/2 py-3 font-semibold text-red-600 hover:bg-red-50 rounded-br-2xl transition disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorManagement;
