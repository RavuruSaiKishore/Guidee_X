import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Star,
  MapPin,
  Briefcase,
  ArrowRight,
  X,
  SlidersHorizontal,
  CheckCircle,
  Code2,
  Brain,
  Database,
  Palette,
  ShieldCheck,
  Cloud,
  Target,
  FileText,
  Video,
  Users,
  Award,
  CalendarCheck,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const QUICK_FILTERS = [
  "Software Engineer",
  "AI/ML",
  "Data Engineer",
  "Product Manager",
  "UI/UX Designer",
];

const EXPERTISE = [
  {
    title: "Software Engineering",
    icon: Code2,
    color: "blue",
    keywords: ["software", "developer", "engineering", "frontend", "backend"],
  },
  {
    title: "AI & Machine Learning",
    icon: Brain,
    color: "purple",
    keywords: ["ai", "machine learning", "ml", "artificial intelligence"],
  },
  {
    title: "Data & Analytics",
    icon: Database,
    color: "emerald",
    keywords: ["data", "analytics", "data engineer", "data scientist"],
  },
  {
    title: "UI/UX Design",
    icon: Palette,
    color: "pink",
    keywords: ["ui", "ux", "design", "designer"],
  },
  {
    title: "Cyber Security",
    icon: ShieldCheck,
    color: "red",
    keywords: ["security", "cyber", "cyber security"],
  },
  {
    title: "Cloud & DevOps",
    icon: Cloud,
    color: "cyan",
    keywords: ["cloud", "devops", "aws", "azure", "devops engineer"],
  },
];

const EXPERIENCE_FILTERS = [
  {
    title: "Early Career",
    subtitle: "0–3 Years",
    value: "3",
    icon: "🌱",
  },
  {
    title: "Mid Career",
    subtitle: "3–7 Years",
    value: "7",
    icon: "🚀",
  },
  {
    title: "Senior Experts",
    subtitle: "7+ Years",
    value: "8",
    icon: "🏆",
  },
];

const SESSION_TYPES = [
  {
    title: "Career Guidance",
    description: "Get personalized advice for your career journey.",
    icon: Target,
  },
  {
    title: "Mock Interview",
    description: "Practice interviews with experienced professionals.",
    icon: Video,
  },
  {
    title: "Resume Review",
    description: "Improve your resume and stand out to recruiters.",
    icon: FileText,
  },
  {
    title: "Project Mentoring",
    description: "Get practical guidance on your real-world projects.",
    icon: Code2,
  },
];

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
  const [experienceFilter, setExperienceFilter] = useState("");

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("UserToken");

      const res = await fetch(`${API_BASE_URL}/api/mentor/allMentors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log(data);

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

  // =========================
  // HELPERS
  // =========================

  const getSkills = (mentor) => {
    if (Array.isArray(mentor.primarySkill)) {
      return mentor.primarySkill;
    }

    return mentor.primarySkill ? [mentor.primarySkill] : [];
  };

  const getMentorImage = (mentor) => {
    if (mentor.profileImage) {
      return mentor.profileImage.startsWith("http")
        ? mentor.profileImage
        : `${API_BASE_URL}/${mentor.profileImage.replace(/^\/+/, "")}`;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${mentor.firstName || ""} ${mentor.lastName || ""}`
    )}&background=4f46e5&color=ffffff&size=200`;
  };

  const getSearchText = (mentor) => {
    const skills = getSkills(mentor).join(" ");

    const location =
      typeof mentor.location === "object"
        ? `${mentor.location?.city || ""} ${mentor.location?.state || ""}`
        : mentor.location || "";

    return `
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
  };

  // =========================
  // FILTERING
  // =========================

  const filteredMentors = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return mentors.filter((mentor) => {
      const matchesSearch = !keyword || getSearchText(mentor).includes(keyword);

      const experience = Number(mentor.experience) || 0;

      let matchesExperience = true;

      if (experienceFilter === "3") {
        matchesExperience = experience <= 3;
      }

      if (experienceFilter === "7") {
        matchesExperience = experience >= 3 && experience <= 7;
      }

      if (experienceFilter === "8") {
        matchesExperience = experience >= 7;
      }

      return matchesSearch && matchesExperience;
    });
  }, [mentors, search, experienceFilter]);

  // =========================
  // TOP MENTORS
  // =========================

  const topMentors = useMemo(() => {
    return [...mentors]
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 4);
  }, [mentors]);

  // =========================
  // ACTIONS
  // =========================

  const handleExpertise = (expertise) => {
    setSearch(expertise.title);
    setExperienceFilter("");

    document
      .getElementById("discover-mentors")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleExperience = (value) => {
    setExperienceFilter(value);

    document
      .getElementById("discover-mentors")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearch("");
    setExperienceFilter("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              India's Growing Mentorship Community
            </span>

            <h1 className="mt-7 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Find the right mentor
              <span className="block text-indigo-400">
                for your next big step.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Connect with experienced professionals, get personalized guidance,
              and build the skills you need to achieve your career goals.
            </p>

            {/* Search */}
            <div className="mt-10 max-w-2xl">
              <div className="flex overflow-hidden rounded-2xl bg-white shadow-2xl">
                <Search
                  size={21}
                  className="ml-5 mt-4 shrink-0 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search by name, skill, company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="min-w-0 flex-1 px-4 py-4 text-sm text-slate-800 outline-none"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="mr-2 text-slate-400 hover:text-slate-700"
                  >
                    <X size={18} />
                  </button>
                )}

                <button
                  onClick={() =>
                    document
                      .getElementById("discover-mentors")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="m-1.5 rounded-xl bg-indigo-600 px-7 font-semibold text-white hover:bg-indigo-500"
                >
                  Search
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <SlidersHorizontal size={13} />
                  Popular:
                </span>

                {QUICK_FILTERS.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSearch(filter)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* STATS */}
      {/* ================================================= */}

      <section className="relative z-20 -mt-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 divide-x divide-slate-100 overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-4">
            <div className="p-6 text-center">
              <Users className="mx-auto text-indigo-600" size={24} />
              <h3 className="mt-2 text-2xl font-bold">{mentors.length}+</h3>
              <p className="text-sm text-slate-500">Expert Mentors</p>
            </div>

            <div className="p-6 text-center">
              <CalendarCheck className="mx-auto text-emerald-600" size={24} />
              <h3 className="mt-2 text-2xl font-bold">50K+</h3>
              <p className="text-sm text-slate-500">Sessions</p>
            </div>

            <div className="p-6 text-center">
              <Award className="mx-auto text-purple-600" size={24} />
              <h3 className="mt-2 text-2xl font-bold">150+</h3>
              <p className="text-sm text-slate-500">Companies</p>
            </div>

            <div className="p-6 text-center">
              <Star
                className="mx-auto fill-yellow-400 text-yellow-400"
                size={24}
              />
              <h3 className="mt-2 text-2xl font-bold">4.9</h3>
              <p className="text-sm text-slate-500">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* EXPERTISE */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10">
          <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Explore Expertise
          </span>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Find mentors by expertise
          </h2>

          <p className="mt-2 text-slate-500">
            Explore experienced mentors across popular career fields.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERTISE.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                onClick={() => handleExpertise(item)}
                className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-100 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                    <Icon size={23} className="text-indigo-600" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Find experienced professionals
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={19}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* ================================================= */}
      {/* TOP MENTORS */}
      {/* ================================================= */}

      {!loading && topMentors.length > 0 && (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                  Community Favorites
                </span>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  Top Rated Mentors
                </h2>

                <p className="mt-2 text-slate-500">
                  Learn from mentors loved by our community.
                </p>
              </div>

              <button
                onClick={() =>
                  document
                    .getElementById("discover-mentors")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="hidden items-center gap-2 text-sm font-semibold text-indigo-600 md:flex"
              >
                View All
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {topMentors.map((mentor) => (
                <MentorCard
                  key={mentor._id}
                  mentor={mentor}
                  navigate={navigate}
                  API_BASE_URL={API_BASE_URL}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================= */}
      {/* EXPERIENCE */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Find Your Match
          </span>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Choose a mentor for your career stage
          </h2>

          <p className="mt-3 text-slate-500">
            Whether you're starting out or growing into leadership, find someone
            who's been there before.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {EXPERIENCE_FILTERS.map((item) => (
            <button
              key={item.title}
              onClick={() => handleExperience(item.value)}
              className={`rounded-3xl border p-8 text-center transition hover:-translate-y-1 hover:shadow-xl ${
                experienceFilter === item.value
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-100 bg-white"
              }`}
            >
              <div className="text-4xl">{item.icon}</div>

              <h3 className="mt-4 text-xl font-bold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {item.subtitle} of experience
              </p>

              <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
                Explore Mentors
                <ArrowRight size={15} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ================================================= */}
      {/* ALL MENTORS */}
      {/* ================================================= */}

      <section id="discover-mentors" className="scroll-mt-4 bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                Mentor Directory
              </span>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Discover Mentors
              </h2>

              <p className="mt-2 text-slate-500">
                Showing{" "}
                <span className="font-semibold text-indigo-600">
                  {filteredMentors.length}
                </span>{" "}
                mentors
              </p>
            </div>

            {(search || experienceFilter) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
              >
                <X size={15} />
                Clear Filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-96 animate-pulse rounded-3xl bg-white"
                />
              ))}
            </div>
          ) : filteredMentors.length === 0 ? (
            <div className="rounded-3xl bg-white py-20 text-center">
              <Search size={40} className="mx-auto text-slate-300" />

              <h3 className="mt-4 text-xl font-bold text-slate-900">
                No mentors found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or filters.
              </p>

              <button
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white"
              >
                View All Mentors
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </section>

      {/* ================================================= */}
      {/* SESSION TYPES */}
      {/* ================================================= */}

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              What Can You Learn?
            </span>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Book the right mentorship session
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-500">
              Choose the type of guidance you need and connect with mentors who
              can help.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SESSION_TYPES.map((session) => {
              const Icon = session.icon;

              return (
                <div
                  key={session.title}
                  className="rounded-3xl border border-slate-100 bg-slate-50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                    <Icon size={22} className="text-indigo-600" />
                  </div>

                  <h3 className="mt-5 font-bold text-slate-900">
                    {session.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {session.description}
                  </p>

                  <button
                    onClick={() => setSearch(session.title)}
                    className="mt-5 flex items-center gap-1 text-sm font-semibold text-indigo-600"
                  >
                    Find Mentors
                    <ArrowRight size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* WHY GUIDEX */}
      {/* ================================================= */}

      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
                Why GuideX?
              </span>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                More than advice.
                <span className="block text-indigo-400">
                  Real guidance for real growth.
                </span>
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-400">
                Get personalized support from professionals who understand your
                challenges and can help you take your next step with confidence.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Verified Professionals", CheckCircle],
                ["One-on-One Sessions", Users],
                ["Flexible Scheduling", CalendarCheck],
                ["Real-World Experience", Briefcase],
              ].map(([title, Icon]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <Icon size={22} className="text-indigo-400" />

                  <h3 className="mt-4 font-semibold">{title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* FINAL CTA */}
      {/* ================================================= */}

      <section className="bg-gradient-to-r from-indigo-600 to-blue-600 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to find your mentor?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-indigo-100">
            Your next career breakthrough could start with one conversation.
          </p>

          <button
            onClick={() =>
              document
                .getElementById("discover-mentors")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-indigo-600 shadow-xl transition hover:bg-indigo-50"
          >
            Find My Mentor
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
};

// =====================================================
// MENTOR CARD
// =====================================================

const MentorCard = ({ mentor, navigate, API_BASE_URL }) => {
  const getSkills = () => {
    if (Array.isArray(mentor.primarySkill)) {
      return mentor.primarySkill;
    }

    return mentor.primarySkill ? [mentor.primarySkill] : [];
  };

  const image = mentor.profileImage
    ? mentor.profileImage.startsWith("http")
      ? mentor.profileImage
      : `${API_BASE_URL}/${mentor.profileImage.replace(/^\/+/, "")}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${mentor.firstName || ""} ${mentor.lastName || ""}`
      )}&background=4f46e5&color=ffffff&size=200`;

  const status = getStatusStyle(mentor.accountStatus);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={image}
              alt={`${mentor.firstName} ${mentor.lastName}`}
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-100"
            />

            {mentor.isVerified && (
              <div className="absolute -bottom-1 -right-1 rounded-full bg-indigo-600 p-1 text-white">
                <CheckCircle size={13} />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-lg font-bold text-slate-900">
                  {mentor.firstName} {mentor.lastName}
                </h3>

                <p className="truncate text-sm text-slate-500">
                  {mentor.profession ||
                    mentor.designation ||
                    "Industry Professional"}
                </p>
              </div>

              {/* ACCOUNT STATUS */}
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.bg} ${status.text}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />

                {mentor.accountStatus || "Unknown"}
              </span>
            </div>

            {/* RATING */}
            <div className="mt-2 flex items-center gap-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />

              <span className="text-sm font-semibold">
                {mentor.averageRating?.toFixed(1) || "0.0"}
              </span>

              <span className="text-xs text-slate-400">
                ({mentor.totalReviews || 0} reviews)
              </span>
            </div>
          </div>
        </div>
        {/* ========================================= */}
        {/* COMPANY */}
        {/* ========================================= */}
        <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
          <Briefcase size={15} />

          <span className="truncate">
            {mentor.company || "Independent Professional"}
          </span>
        </div>
        {/* ========================================= */}
        {/* SKILLS */}
        {/* ========================================= */}
        <div className="mt-3 flex flex-wrap gap-2">
          {getSkills()
            .slice(0, 2)
            .map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
              >
                {skill}
              </span>
            ))}

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {mentor.experience || 0}+ Years
          </span>
        </div>
        {/* ========================================= */}
        {/* LOCATION */}
        {/* ========================================= */}
        {mentor.location && (
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin size={13} />

            <span>
              {typeof mentor.location === "object"
                ? `${mentor.location.city || ""}${
                    mentor.location.state ? `, ${mentor.location.state}` : ""
                  }`
                : mentor.location}
            </span>
          </div>
        )}
        {/* ========================================= */}
        {/* ABOUT */}
        {/* ========================================= */}
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
          {mentor.about ||
            "Helping students and professionals grow through personalized mentorship and real-world guidance."}
        </p>
      </div>
      
      <div className="mt-auto flex min-h-[90px] items-center justify-between border-t border-slate-100 bg-slate-50/60 px-6 py-4">
        <div>
          <p className="text-xs text-slate-400">Starting from</p>

          <p className="text-lg font-bold text-indigo-600">
            {mentor.pricing?.sessionPrice
              ? `₹${mentor.pricing.sessionPrice}`
              : "Free"}
          </p>
        </div>
        <div className="flex gap-2">
          {/* PROFILE */}
          <button
            onClick={() => navigate(`/mentor/profile/${mentor._id}`)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-200 hover:text-indigo-600"
          >
            Profile
          </button>

          {/* BOOK */}
          <button
            onClick={() => navigate(`/mentor/booking/${mentor._id}`)}
            disabled={mentor.accountStatus === "Suspended"}
            className={`flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold ${
              mentor.accountStatus === "Suspended"
                ? "cursor-not-allowed bg-slate-200 text-slate-400"
                : "bg-indigo-600 text-white hover:bg-indigo-500"
            }`}
          >
            {mentor.accountStatus === "Suspended" ? "Unavailable" : "Book"}

            {mentor.accountStatus !== "Suspended" && <ArrowRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mentors;
