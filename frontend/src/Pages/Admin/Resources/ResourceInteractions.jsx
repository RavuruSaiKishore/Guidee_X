import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Heart,
  Download,
  Bookmark,
  Eye,
  RefreshCw,
  AlertCircle,
  Users,
  Mail,
  Calendar,
  Phone,
  X,
  BadgeCheck,
  IdCard,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// =====================================================
// AUTH & HELPERS
// =====================================================

const getToken = () => {
  return (
    localStorage.getItem("AdminToken") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token")
  );
};

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getImageUrl = (imageObj) => {
  if (!imageObj) return "";
  const path = typeof imageObj === "string" ? imageObj : imageObj.url;
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function ResourceInteractions() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("liked");
  const [search, setSearch] = useState("");

  // =====================================================
  // FETCH DATA
  // =====================================================

  const fetchInteractions = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();
      const response = await fetch(
        `${API_BASE_URL}/api/resources/${id}/interactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "Failed to fetch interaction data");
      }

      setData(resData);
    } catch (err) {
      console.error("Fetch interactions error:", err);
      setError(err.message || "Failed to load interactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchInteractions();
  }, [id]);

  // Active interaction list selector
  const currentList = useMemo(() => {
    if (!data?.interactions) return [];
    switch (activeTab) {
      case "liked":
        return data.interactions.likedBy || [];
      case "downloaded":
        return data.interactions.downloadedBy || [];
      case "saved":
        return data.interactions.savedBy || [];
      case "viewed":
        return data.interactions.viewedBy || [];
      default:
        return [];
    }
  }, [data, activeTab]);

  // Search filtering
  const filteredStudents = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return currentList;

    return currentList.filter((student) => {
      const name = `${student.firstName || ""} ${
        student.lastName || ""
      }`.toLowerCase();
      const email = (student.email || "").toLowerCase();
      const phone = (student.phone || "").toLowerCase();
      return (
        name.includes(term) || email.includes(term) || phone.includes(term)
      );
    });
  }, [currentList, search]);

  // Navigation handler to full student profile
  const handleStudentClick = (studentId) => {
    if (!studentId) return;
    navigate(`/admin/students/${studentId}`);
  };

  // =====================================================
  // LOADING / ERROR STATES
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={32} className="animate-spin text-indigo-600" />
          <p className="text-sm font-semibold text-slate-600">
            Loading interaction analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-xl">
          <button
            onClick={() => navigate(`/admin/careerResources/${id}`)}
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft size={18} /> Back to Resource Details
          </button>

          <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <AlertCircle size={36} className="mx-auto text-red-600" />
            <h2 className="mt-3 text-lg font-bold text-slate-900">
              Failed to Load Interactions
            </h2>
            <p className="mt-1 text-sm text-slate-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* =====================================================
          GRADIENT HEADER
      ===================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 py-6 text-white shadow-md sm:py-8">
        {/* LIGHTING ACCENTS */}
        <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* TOP NAV BAR */}
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => navigate(`/admin/careerResources/details/${id}`)}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-1.5 text-xs font-bold text-slate-200 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft size={15} /> Back to Resource
            </button>

            <button
              onClick={fetchInteractions}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              <RefreshCw size={14} /> Sync Analytics
            </button>
          </div>

          <div className="max-w-3xl">
            {/* BADGES */}
            <div className="mb-2 inline-flex items-center gap-2">
              <span className="rounded-full border border-indigo-400/30 bg-indigo-500/20 px-3 py-0.5 text-xs font-bold text-indigo-300 backdrop-blur-md">
                {data.category || "General"}
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-0.5 text-xs font-bold text-slate-300 backdrop-blur-md">
                {data.resourceType || "Resource"}
              </span>
            </div>

            {/* TITLE */}
            <h1 className="text-xl font-black tracking-tight text-white sm:text-3xl">
              {data.resourceTitle}
            </h1>

            <p className="mt-1 text-xs text-slate-300 font-normal leading-relaxed sm:text-sm">
              Real-time student engagement directory detailing likes, downloads,
              bookmarks, and views.
            </p>
          </div>

          {/* STATS TILES ROW */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 border-t border-white/10 pt-4">
            <StatBox
              icon={Heart}
              label="Liked By"
              count={data.interactions?.likedBy?.length || 0}
              color="text-rose-400 bg-rose-500/10 border-rose-500/20"
              active={activeTab === "liked"}
              onClick={() => setActiveTab("liked")}
            />
            <StatBox
              icon={Download}
              label="Downloaded By"
              count={data.interactions?.downloadedBy?.length || 0}
              color="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
              active={activeTab === "downloaded"}
              onClick={() => setActiveTab("downloaded")}
            />
            <StatBox
              icon={Bookmark}
              label="Bookmarked By"
              count={data.interactions?.savedBy?.length || 0}
              color="text-amber-400 bg-amber-500/10 border-amber-500/20"
              active={activeTab === "saved"}
              onClick={() => setActiveTab("saved")}
            />
            <StatBox
              icon={Eye}
              label="Viewed By"
              count={data.interactions?.viewedBy?.length || 0}
              color="text-blue-400 bg-blue-500/10 border-blue-500/20"
              active={activeTab === "viewed"}
              onClick={() => setActiveTab("viewed")}
            />
          </div>
        </div>
      </section>
      {/* =====================================================
          MAIN CONTENT AREA
      ===================================================== */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* CONTROLS & SEARCH BAR */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* TAB SWITCHER */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "liked", label: "Liked", icon: Heart },
              { id: "downloaded", label: "Downloaded", icon: Download },
              { id: "saved", label: "Bookmarked", icon: Bookmark },
              { id: "viewed", label: "Viewed", icon: Eye },
            ].map((tab) => {
              const Icon = tab.icon;
              const count = data.interactions?.[`${tab.id}By`]?.length || 0;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                  }`}
                >
                  <Icon size={15} />
                  {tab.label} ({count})
                </button>
              );
            })}
          </div>

          {/* SEARCH FIELD */}
          <div className="relative min-w-[280px]">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student name, email, or phone..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-xs outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* RESULTS SUMMARY */}
        <div className="mb-4 flex items-center justify-between text-xs font-semibold text-slate-500">
          <p>
            Showing{" "}
            <span className="font-bold text-slate-900">
              {filteredStudents.length}
            </span>{" "}
            student profile{filteredStudents.length !== 1 ? "s" : ""}
          </p>

          {search && (
            <button
              onClick={() => setSearch("")}
              className="font-bold text-indigo-600 hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* =====================================================
            FULL HORIZONTAL CARDS LIST
        ===================================================== */}
        {filteredStudents.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <Users size={36} className="mx-auto text-slate-300" />
            <h3 className="mt-4 text-base font-bold text-slate-900">
              No Student Interactions
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {search
                ? "No students match your search criteria."
                : `No students have ${activeTab} this resource yet.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredStudents.map((student, idx) => {
              const avatar = getImageUrl(student.profileImage);
              const fullName =
                `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
                "Registered Student";

              return (
                <div
                  key={student._id || idx}
                  onClick={() => handleStudentClick(student._id)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md cursor-pointer sm:flex-row sm:items-center sm:gap-6"
                >
                  {/* LEFT INFO: AVATAR & NAME */}
                  <div className="flex items-center gap-4 min-w-[240px]">
                    <div className="relative">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={fullName}
                          className="h-14 w-14 shrink-0 rounded-2xl object-cover border border-slate-100 shadow-xs"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 font-extrabold text-indigo-600 text-lg border border-indigo-100">
                          {fullName.charAt(0)}
                        </div>
                      )}
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {fullName}
                        </h4>
                        <BadgeCheck
                          size={16}
                          className="text-indigo-500 shrink-0"
                        />
                      </div>

                      {student._id && (
                        <p className="mt-0.5 flex items-center gap-1 font-mono text-[11px] text-slate-400">
                          <IdCard size={12} /> ID: {student._id.slice(-8)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* MIDDLE INFO: METADATA GRID */}
                  <div className="mt-4 grid flex-1 grid-cols-1 gap-3 border-t border-slate-100 pt-3 sm:mt-0 sm:grid-cols-3 sm:border-t-0 sm:pt-0">
                    {/* EMAIL */}
                    <div className="flex items-center gap-2.5 rounded-xl bg-slate-50/80 p-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-xs">
                        <Mail size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Email
                        </p>
                        <p className="truncate text-xs font-semibold text-slate-700">
                          {student.email || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* PHONE */}
                    <div className="flex items-center gap-2.5 rounded-xl bg-slate-50/80 p-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-xs">
                        <Phone size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Phone
                        </p>
                        <p className="truncate text-xs font-semibold text-slate-700">
                          {student.phone || "Not Provided"}
                        </p>
                      </div>
                    </div>

                    {/* JOIN DATE */}
                    <div className="flex items-center gap-2.5 rounded-xl bg-slate-50/80 p-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-xs">
                        <Calendar size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Registered
                        </p>
                        <p className="truncate text-xs font-semibold text-slate-700">
                          {formatDate(student.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT ACTION: NAVIGATE TO PROFILE BUTTON */}
                  <div className="mt-3 flex items-center justify-end sm:mt-0 sm:pl-4">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xs">
                      <span>View Profile</span>
                      <ChevronRight size={15} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

// UI TILE COMPONENT FOR STATS
function StatBox({ icon: Icon, label, count, color, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3.5 rounded-2xl p-4 text-left backdrop-blur-md transition-all ${
        active
          ? "border-2 border-indigo-400 bg-indigo-500/20 shadow-lg shadow-indigo-500/10"
          : "border border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${color}`}
      >
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-300">{label}</p>
        <p className="text-xl font-black text-white">{count}</p>
      </div>
    </button>
  );
}
