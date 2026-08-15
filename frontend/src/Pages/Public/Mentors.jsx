import { useEffect, useMemo, useState } from "react";
import {
  Search,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Zap,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const STATUS_STYLES = {
  Active: {
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  Suspended: {
    dot: "bg-rose-500",
    text: "text-rose-700",
    bg: "bg-rose-50",
  },
};

const getStatusStyle = (status) =>
  STATUS_STYLES[status] || {
    dot: "bg-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
  };

const Mentors = () => {
  const navigate = useNavigate();

  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Fetch mentors dynamically from the backend based on selected category query
  useEffect(() => {
    fetchMentors(selectedCategory);
  }, [selectedCategory]);

  const fetchMentors = async (category) => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("UserToken") || localStorage.getItem("token");

      let url = `${API_BASE_URL}/api/mentor/allMentors`;
      if (category && category !== "All Categories") {
        url += `?category=${encodeURIComponent(category)}`;
      }

      const res = await fetch(url, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await res.json();

      if (res.ok) {
        setMentors(data.mentors || []);
      } else {
        setMentors([]);
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  // State to hold all unique categories dynamically derived from database records
  const [allCategories, setAllCategories] = useState(["All Categories"]);

  // Fetch all categories once on mount to populate the left sidebar dynamically
  useEffect(() => {
    const fetchCategoriesList = async () => {
      try {
        const token =
          localStorage.getItem("UserToken") || localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/mentor/allMentors`, {
          headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        });
        const data = await res.json();
        if (res.ok && data.mentors) {
          const categoriesSet = new Set(["All Categories"]);
          data.mentors.forEach((m) => {
            if (m.category) categoriesSet.add(m.category);
          });
          setAllCategories(Array.from(categoriesSet));
        }
      } catch (err) {
        console.error("Failed to load categories list", err);
      }
    };
    fetchCategoriesList();
  }, []);

  // Client-side instant keyword search filter on top of fetched mentors
  const filteredMentors = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return mentors;

    return mentors.filter((mentor) => {
      const skills = Array.isArray(mentor.primarySkill)
        ? mentor.primarySkill.join(" ")
        : mentor.primarySkill || "";
      const location =
        typeof mentor.location === "object"
          ? `${mentor.location?.city || ""} ${mentor.location?.state || ""}`
          : mentor.location || "";

      const searchableText = `
        ${mentor.firstName || ""}
        ${mentor.lastName || ""}
        ${mentor.profession || ""}
        ${mentor.designation || ""}
        ${mentor.company || ""}
        ${mentor.category || ""}
        ${mentor.about || ""}
        ${skills}
        ${location}
      `.toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [mentors, search]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ================================================= */}
      {/* HERO SECTION */}
      {/* ================================================= */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-16 px-6">
        <div className="absolute -right-40 -top-40 h-[400px] w-[400px] rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-7xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Expert Mentorship Network
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Find Mentors by Expertise
          </h1>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Explore industry leaders and book 1-on-1 sessions to accelerate your
            career.
          </p>
        </div>
      </section>

      {/* ================================================= */}
      {/* MAIN CONTENT LAYOUT (Sidebar Left, Mentors Right) */}
      {/* ================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDEBAR: DYNAMIC EXPERTISE CATEGORIES + INSTITUTIONS/COMPANIES BANNER BELOW */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            {/* Category Box */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm">
              <div className="px-4 py-3 border-b border-slate-100 mb-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Filter By
                </h2>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  Expertise Categories
                </h3>
              </div>

              <div className="space-y-1 max-h-[460px] overflow-y-auto pr-1">
                {allCategories.map((catName) => {
                  const isSelected = selectedCategory === catName;
                  const IconComponent =
                    catName === "All Categories" ? Zap : Target;

                  return (
                    <button
                      key={catName}
                      onClick={() => {
                        setSelectedCategory(catName);
                        setSearch("");
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-left text-sm font-semibold transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                          : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <IconComponent
                          size={18}
                          className={
                            isSelected
                              ? "text-white shrink-0"
                              : "text-slate-500 shrink-0"
                          }
                        />
                        <span className="truncate">{catName}</span>
                      </div>
                      <ChevronRight
                        size={15}
                        className={
                          isSelected
                            ? "text-white shrink-0"
                            : "text-slate-400 shrink-0"
                        }
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PRESTIGIOUS UNIVERSITIES / INSTITUTIONS CARD */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                EARN CERTIFICATES FROM
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1 leading-snug">
                Prestigious universities
              </h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                We partner with world-renowned universities so you earn
                certificates recognised by organisations across the globe.
              </p>

              {/* Company Logo Badge Grid */}
              <div className="mt-6 grid grid-cols-2 gap-3 items-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center font-bold text-xs text-slate-700 tracking-tight">
                  Google
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center font-bold text-xs text-slate-700 tracking-tight">
                  Microsoft
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center font-bold text-xs text-slate-700 tracking-tight">
                  Amazon
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center font-bold text-xs text-slate-700 tracking-tight">
                  IIT Bombay
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory("All Categories");
                  setSearch("");
                }}
                className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-200 hover:bg-blue-700 transition"
              >
                VIEW ALL UNIVERSITIES →
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: MENTOR CARDS LISTING */}
          <div className="lg:col-span-8">
            {/* Search and Header bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-full sm:w-72 relative">
                <Search
                  size={16}
                  className="absolute left-3.5 top-3.5 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search mentor name, skill..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <div className="text-xs font-semibold text-slate-500 w-full sm:w-auto text-right">
                Showing{" "}
                <span className="text-blue-600 font-bold">
                  {filteredMentors.length}
                </span>{" "}
                mentors in{" "}
                <span className="text-slate-900 font-bold">
                  {selectedCategory}
                </span>
              </div>
            </div>

            {/* Mentors Grid */}
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-96 animate-pulse rounded-3xl bg-white border border-slate-200"
                  />
                ))}
              </div>
            ) : filteredMentors.length === 0 ? (
              <div className="rounded-3xl bg-white border border-slate-200 py-20 text-center px-4">
                <Search size={36} className="mx-auto text-slate-300" />
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  No mentors found
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  No mentors found for "{selectedCategory}". Try choosing
                  another category or clearing your search.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("All Categories");
                    setSearch("");
                  }}
                  className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {filteredMentors.map((mentor) => (
                  <MentorCard
                    key={mentor._id}
                    mentor={mentor}
                    navigate={navigate}
                    API_BASE_URL={API_BASE_URL}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

// =====================================================
// MENTOR CARD (Clean Minimalist UI matching style)
// =====================================================

const MentorCard = ({ mentor, navigate, API_BASE_URL }) => {
  const image = mentor.profileImage
    ? mentor.profileImage.startsWith("http")
      ? mentor.profileImage
      : `${API_BASE_URL}/${mentor.profileImage.replace(/^\/+/, "")}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${mentor.firstName || ""} ${mentor.lastName || ""}`
      )}&background=f1f5f9&color=0f172a&size=200`;

  // 🔐 Protected Navigation Handler for Mentor Profile & Booking Clicks
  const handleProtectedAction = (e, targetPath) => {
    const token =
      localStorage.getItem("UserToken") || localStorage.getItem("token");

    if (!token) {
      e.preventDefault();
      navigate(`/login?redirect=${encodeURIComponent(targetPath)}`);
    } else {
      navigate(targetPath);
    }
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-center">
      <div>
        {/* Profile Image */}
        <div className="mx-auto flex justify-center pt-2">
          <div className="relative">
            <img
              src={image}
              alt={`${mentor.firstName || ""} ${mentor.lastName || ""}`}
              className="h-20 w-20 rounded-full border-2 border-slate-100 object-cover shadow-sm"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=User&background=f1f5f9&color=0f172a&size=200`;
              }}
            />
            {mentor.isVerified && (
              <span className="absolute bottom-0 right-0 rounded-full bg-slate-900 text-white p-0.5">
                <CheckCircle size={12} />
              </span>
            )}
          </div>
        </div>

        {/* Name & Primary Designation */}
        <div className="mt-4">
          <h3 className="text-base font-bold text-slate-900 truncate">
            {mentor.firstName} {mentor.lastName}
          </h3>
          <p className="mt-1 text-xs font-medium text-slate-500 truncate">
            {mentor.profession || mentor.designation || "Industry Expert"}
          </p>
        </div>

        {/* Company & Role */}
        <div className="mt-5 space-y-1 py-3 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-800 truncate">
            {mentor.designation || mentor.profession || "Senior Specialist"}
          </p>
          <p className="text-xs font-semibold text-slate-500 truncate">
            {mentor.company || "Leading Tech Firm"}
          </p>
        </div>

        {/* Arrow Indicator */}
        <div className="my-2 flex justify-center text-slate-400">
          <div className="flex flex-col items-center">
            <div className="w-1.5 h-1.5 bg-slate-400 rotate-45 mb-[-3px]" />
            <div className="w-1.5 h-1.5 bg-slate-400 rotate-45 mb-[-3px]" />
            <div className="w-1.5 h-1.5 bg-slate-400 rotate-45" />
          </div>
        </div>

        {/* Headline / Location Summary */}
        <div className="py-1">
          <p className="text-xs font-bold text-slate-900 truncate">
            {mentor.headline
              ? mentor.headline.slice(0, 35) + "..."
              : "Expert Mentorship & Guidance"}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {typeof mentor.location === "object"
              ? `${mentor.location?.city || "India"}`
              : mentor.location || "India"}
          </p>
        </div>
      </div>

      {/* Action Buttons with Authentication Guard */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={(e) =>
            handleProtectedAction(e, `/mentor/profile/${mentor._id}`)
          }
          className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
        >
          Profile
        </button>

        <button
          onClick={(e) =>
            handleProtectedAction(e, `/mentor/booking/${mentor._id}`)
          }
          disabled={mentor.accountStatus === "Suspended"}
          className={`flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-xs font-bold text-white shadow-sm transition ${
            mentor.accountStatus === "Suspended"
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 hover:bg-slate-800 cursor-pointer"
          }`}
        >
          {mentor.accountStatus === "Suspended" ? "Unavailable" : "Book"}
          {mentor.accountStatus !== "Suspended" && <ArrowRight size={13} />}
        </button>
      </div>
    </div>
  );
};

export default Mentors;
