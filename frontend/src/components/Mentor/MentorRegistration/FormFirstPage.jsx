import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle,
  Users,
  IndianRupee,
  Star,
  Calendar,
  Briefcase,
  Sparkles,
  PlayCircle,
  ShieldCheck,
  Clock3,
  BadgeCheck,
  TrendingUp,
  GraduationCap,
  Video,
  Wallet,
  UserCheck,
  BarChart3,
  Award,
  MessageCircle,
  Building2,
  Target,
  FileCheck,
  Rocket,
  ChevronRight,
  Loader2,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const MentorRegistraionLandingPage = () => {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [stats, setStats] = useState({
    totalMentors: 0,
    activeMentors: 0,
    verifiedMentors: 0,
    totalStudents: 0,
    totalBookings: 0,
    completedSessions: 0,
    averageRating: 0,
    totalReviews: 0,
    totalCompanies: 0,
    totalCategories: 0,
  });

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH REGISTRATION PAGE DATA
  // =====================================================

  useEffect(() => {
    fetchRegistrationStats();
  }, []);

  const fetchRegistrationStats = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/user/registration-stats`
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch mentor registration statistics"
        );
      }

      setStats({
        totalMentors: data.stats?.totalMentors || 0,
        activeMentors: data.stats?.activeMentors || 0,
        verifiedMentors: data.stats?.verifiedMentors || 0,
        totalStudents: data.stats?.totalStudents || 0,
        totalBookings: data.stats?.totalBookings || 0,
        completedSessions: data.stats?.completedSessions || 0,
        averageRating: data.stats?.averageRating || 0,
        totalReviews: data.stats?.totalReviews || 0,
        totalCompanies: data.stats?.totalCompanies || 0,
        totalCategories: data.stats?.totalCategories || 0,
      });

      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching mentor registration statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FORMAT NUMBERS
  // =====================================================

  const formatNumber = (number) => {
    if (!number) return "0";

    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M+`;
    }

    if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}K+`;
    }

    return number.toLocaleString("en-IN");
  };

  // =====================================================
  // DYNAMIC STATS
  // =====================================================

  const platformStats = useMemo(
    () => [
      {
        icon: Users,
        number: formatNumber(stats.totalStudents),
        label: "Students on GuideX",
        description: "Students looking for career guidance",
      },
      {
        icon: Briefcase,
        number: formatNumber(stats.totalMentors),
        label: "Professional Mentors",
        description: "Professionals sharing their expertise",
      },
      {
        icon: Calendar,
        number: formatNumber(stats.completedSessions),
        label: "Completed Sessions",
        description: "Successful mentorship sessions",
      },
      {
        icon: Star,
        number: stats.averageRating
          ? `${Number(stats.averageRating).toFixed(1)}`
          : "0",
        label: "Average Rating",
        description: "Community mentor satisfaction",
      },
    ],
    [stats]
  );

  // =====================================================
  // BENEFITS
  // =====================================================

  const benefits = [
    {
      title: "Earn Additional Income",
      description:
        "Set your own session pricing and earn from every successful mentorship session.",
      icon: Wallet,
    },
    {
      title: "Flexible Schedule",
      description:
        "Choose your availability and accept mentorship bookings according to your schedule.",
      icon: Clock3,
    },
    {
      title: "Build Your Professional Brand",
      description:
        "Showcase your expertise, experience, skills, and achievements to ambitious students.",
      icon: TrendingUp,
    },
    {
      title: "Make a Real Impact",
      description:
        "Help students with career decisions, interviews, projects, skills, and professional growth.",
      icon: Target,
    },
    {
      title: "Verified Mentor Profile",
      description:
        "Build credibility through a structured mentor profile and verification process.",
      icon: BadgeCheck,
    },
    {
      title: "Manage Everything in One Place",
      description:
        "Manage sessions, bookings, reviews, availability, pricing, and your mentorship journey.",
      icon: BarChart3,
    },
  ];

  // =====================================================
  // MENTORING AREAS
  // =====================================================

  const defaultCategories = [
    {
      title: "Software Engineering",
      icon: "💻",
    },
    {
      title: "Data Science",
      icon: "📊",
    },
    {
      title: "Artificial Intelligence",
      icon: "🤖",
    },
    {
      title: "Cyber Security",
      icon: "🔐",
    },
    {
      title: "Cloud & DevOps",
      icon: "☁️",
    },
    {
      title: "UI/UX Design",
      icon: "🎨",
    },
    {
      title: "Product Management",
      icon: "🚀",
    },
    {
      title: "Career Guidance",
      icon: "🎯",
    },
  ];

  // =====================================================
  // REQUIREMENTS
  // =====================================================

  const requirements = [
    {
      title: "Professional Experience",
      description:
        "Ideally have at least 2+ years of relevant professional or industry experience.",
      icon: Briefcase,
    },
    {
      title: "Strong Communication",
      description:
        "Be able to explain concepts clearly and communicate effectively with students.",
      icon: MessageCircle,
    },
    {
      title: "Passion for Mentoring",
      description:
        "Be genuinely interested in helping students learn, grow, and achieve their goals.",
      icon: GraduationCap,
    },
    {
      title: "Verified Information",
      description:
        "Provide accurate professional, educational, and identity information during verification.",
      icon: FileCheck,
    },
    {
      title: "Quality Commitment",
      description:
        "Deliver professional, respectful, and valuable mentorship experiences.",
      icon: ShieldCheck,
    },
    {
      title: "Online Availability",
      description:
        "Have availability for online one-on-one or other supported mentorship sessions.",
      icon: Video,
    },
  ];

  // =====================================================
  // HOW IT WORKS
  // =====================================================

  const steps = [
    {
      step: "01",
      title: "Create Your Application",
      description:
        "Submit your personal, professional, educational, and expertise information.",
      icon: FileCheck,
    },
    {
      step: "02",
      title: "Profile Verification",
      description:
        "GuideX reviews your submitted information and professional documents.",
      icon: ShieldCheck,
    },
    {
      step: "03",
      title: "Get Approved",
      description:
        "Once approved, your mentor account becomes eligible to complete your profile.",
      icon: UserCheck,
    },
    {
      step: "04",
      title: "Set Up Your Profile",
      description:
        "Add your skills, availability, session types, pricing, and mentorship details.",
      icon: Briefcase,
    },
    {
      step: "05",
      title: "Start Mentoring",
      description:
        "Students can discover your profile and book sessions based on your availability.",
      icon: Rocket,
    },
  ];

  // =====================================================
  // SESSION TYPES
  // =====================================================

  const sessionTypes = [
    {
      title: "One-on-One Mentorship",
      description:
        "Provide personalized guidance based on a student's goals and challenges.",
      icon: Users,
    },
    {
      title: "Career Guidance",
      description:
        "Help students understand career paths, opportunities, and professional growth.",
      icon: Target,
    },
    {
      title: "Mock Interviews",
      description:
        "Help students prepare for technical, behavioral, and professional interviews.",
      icon: Video,
    },
    {
      title: "Project Mentoring",
      description:
        "Guide students while they build practical projects and strengthen their skills.",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="relative overflow-hidden bg-slate-950 text-white">
        {/* Background */}

        <div className="absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-3xl" />

          <div className="absolute right-0 top-20 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="absolute bottom-0 left-1/2 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* LEFT */}

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-300">
                <Sparkles size={17} />
                Join the GuideX Mentor Community
              </div>

              <h1 className="mt-7 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                Turn your experience into
                <span className="block text-blue-400">
                  someone else's success.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                Become a GuideX mentor and help students build stronger careers
                through personalized guidance, real-world experience, and
                meaningful mentorship.
              </p>

              {/* CTA */}

              <div className="mt-9 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/mentor/register")}
                  className="group flex items-center gap-3 rounded-2xl bg-blue-600 px-7 py-4 font-semibold text-white shadow-xl transition hover:-translate-y-1 hover:bg-blue-500"
                >
                  Become a Mentor
                  <ArrowRight
                    size={19}
                    className="transition group-hover:translate-x-1"
                  />
                </button>

                <button
                  onClick={() =>
                    document
                      .getElementById("how-it-works")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-7 py-4 font-semibold text-white transition hover:bg-white/10"
                >
                  <PlayCircle size={20} />
                  How It Works
                </button>
              </div>

              {/* TRUST */}

              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-4 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle size={17} className="text-emerald-400" />
                  Flexible Availability
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle size={17} className="text-emerald-400" />
                  Set Your Pricing
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle size={17} className="text-emerald-400" />
                  Build Your Brand
                </div>
              </div>
            </div>

            {/* RIGHT DASHBOARD PREVIEW */}

            <div className="relative">
              <div className="rounded-[32px] border border-white/10 bg-white/10 p-7 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      GuideX Mentor Community
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">Grow With Us</h2>
                  </div>

                  <div className="rounded-xl bg-emerald-500/20 p-3 text-emerald-400">
                    <ShieldCheck size={25} />
                  </div>
                </div>

                {/* Dashboard cards */}

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <Users className="text-blue-400" size={22} />

                    <p className="mt-4 text-3xl font-bold">
                      {loading ? "..." : formatNumber(stats.totalMentors)}
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Professional Mentors
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <GraduationCap className="text-purple-400" size={22} />

                    <p className="mt-4 text-3xl font-bold">
                      {loading ? "..." : formatNumber(stats.totalStudents)}
                    </p>

                    <p className="mt-1 text-sm text-slate-400">Students</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <Calendar className="text-emerald-400" size={22} />

                    <p className="mt-4 text-3xl font-bold">
                      {loading ? "..." : formatNumber(stats.completedSessions)}
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Completed Sessions
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <Star
                      className="fill-yellow-400 text-yellow-400"
                      size={22}
                    />

                    <p className="mt-4 text-3xl font-bold">
                      {loading ? "..." : Number(stats.averageRating).toFixed(1)}
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Average Rating
                    </p>
                  </div>
                </div>

                {/* Verification */}

                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-emerald-500/10 p-4">
                  <BadgeCheck className="text-emerald-400" size={22} />

                  <div>
                    <p className="font-semibold text-emerald-300">
                      Verified Mentor Community
                    </p>

                    <p className="text-xs text-slate-400">
                      Connect with students looking for real guidance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating card */}

              <div className="absolute -left-5 top-16 hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <TrendingUp size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Completed Sessions</p>

                    <p className="font-bold text-slate-900">
                      {loading ? "..." : formatNumber(stats.completedSessions)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -right-5 hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-yellow-50 p-3 text-yellow-500">
                    <Star size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Community Rating</p>

                    <p className="font-bold text-slate-900">
                      {loading
                        ? "..."
                        : `${Number(stats.averageRating).toFixed(1)} / 5`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* LIVE PLATFORM STATS */}
      {/* ================================================= */}

      <section className="relative z-10 -mt-10 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl sm:grid-cols-2 lg:grid-cols-4">
            {platformStats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="border-b border-slate-100 p-7 text-center transition hover:bg-slate-50 lg:border-b-0 lg:border-r last:border-r-0"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-4 text-3xl font-black text-slate-900">
                    {loading ? (
                      <span className="inline-flex">
                        <Loader2 size={25} className="animate-spin" />
                      </span>
                    ) : (
                      item.number
                    )}
                  </h3>

                  <p className="mt-1 font-semibold text-slate-800">
                    {item.label}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* WHY GUIDEX */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700">
            Why Become a GuideX Mentor?
          </span>

          <h2 className="mt-6 text-3xl font-black text-slate-900 sm:text-4xl">
            Your knowledge can change someone's career.
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-500">
            GuideX gives professionals the tools and platform to share
            knowledge, connect with students, and grow their professional
            presence.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl"
              >
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-blue-50 p-3 text-blue-600 transition group-hover:scale-110">
                  <Icon size={25} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================= */}
      {/* MENTORING AREAS */}
      {/* ================================================= */}

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
                Your Expertise Matters
              </span>

              <h2 className="mt-3 text-3xl font-black text-slate-900">
                Mentor students in your area of expertise.
              </h2>

              <p className="mt-3 max-w-2xl text-slate-500">
                GuideX supports mentors across different professional
                backgrounds and career domains.
              </p>
            </div>

            {categories.length > 0 && (
              <div className="rounded-2xl bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700">
                {stats.totalCategories}+ Expertise Categories
              </div>
            )}
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(categories.length > 0 ? categories : defaultCategories).map(
              (category, index) => (
                <div
                  key={category._id || category.title || index}
                  className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">
                      {defaultCategories[index % defaultCategories.length]
                        ?.icon || "🎓"}
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        {category._id || category.title}
                      </h3>

                      {category.count !== undefined && (
                        <p className="mt-1 text-xs text-slate-500">
                          {category.count} mentors
                        </p>
                      )}
                    </div>
                  </div>

                  <ChevronRight
                    size={18}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                  />
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* SESSION TYPES */}
      {/* ================================================= */}

      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Flexible Mentorship
            </span>

            <h2 className="mt-3 text-3xl font-black text-slate-900">
              Choose how you want to mentor.
            </h2>

            <p className="mt-4 text-slate-500">
              Your mentor profile can support different session types based on
              your skills and availability.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {sessionTypes.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-5 font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* HOW IT WORKS */}
      {/* ================================================= */}

      <section
        id="how-it-works"
        className="scroll-mt-10 bg-slate-950 py-24 text-white"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-300">
              Simple Onboarding
            </span>

            <h2 className="mt-6 text-3xl font-black sm:text-4xl">
              Start your mentorship journey in 5 steps.
            </h2>

            <p className="mt-5 text-slate-400">
              A simple process designed to help you get started quickly.
            </p>
          </div>

          <div className="mt-16 grid gap-5 lg:grid-cols-5">
            {steps.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.step}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-black text-blue-400">
                      {item.step}
                    </span>

                    <Icon className="text-slate-400" size={22} />
                  </div>

                  <h3 className="mt-7 text-xl font-bold">{item.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* REQUIREMENTS */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700">
              Mentor Requirements
            </span>

            <h2 className="mt-6 text-3xl font-black text-slate-900 sm:text-4xl">
              Are you ready to become a mentor?
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-500">
              If you have professional experience and want to help students
              grow, GuideX provides a platform to share your knowledge and
              experience.
            </p>

            <button
              onClick={() => navigate("/mentor/register")}
              className="mt-8 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Check Your Eligibility
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid gap-4">
            {requirements.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={21} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">{item.title}</h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* COMMUNITY INSIGHTS */}
      {/* ================================================= */}

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-slate-950 p-7 text-white">
              <Users size={25} className="text-blue-400" />

              <p className="mt-6 text-4xl font-black">
                {formatNumber(stats.activeMentors)}
              </p>

              <p className="mt-2 font-semibold">Active Mentors</p>

              <p className="mt-2 text-sm text-slate-400">
                Professionals currently available in the GuideX mentor
                community.
              </p>
            </div>

            <div className="rounded-3xl bg-blue-600 p-7 text-white">
              <MessageCircle size={25} />

              <p className="mt-6 text-4xl font-black">
                {formatNumber(stats.totalReviews)}
              </p>

              <p className="mt-2 font-semibold">Mentor Reviews</p>

              <p className="mt-2 text-sm text-blue-100">
                Feedback shared by students after their mentorship experiences.
              </p>
            </div>

            <div className="rounded-3xl bg-indigo-600 p-7 text-white">
              <Building2 size={25} />

              <p className="mt-6 text-4xl font-black">
                {formatNumber(stats.totalCompanies)}
              </p>

              <p className="mt-2 font-semibold">Companies Represented</p>

              <p className="mt-2 text-sm text-indigo-100">
                Professionals bringing experience from different organizations
                and industries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* FINAL CTA */}
      {/* ================================================= */}

      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 py-24 text-white">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
            <Rocket size={30} />
          </div>

          <h2 className="mt-7 text-3xl font-black sm:text-5xl">
            Your experience can shape someone's future.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Join the GuideX mentor community, share what you've learned, and
            help the next generation make better career decisions.
          </p>

          <button
            onClick={() => navigate("/mentor/register")}
            className="group mt-9 inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-bold text-blue-600 shadow-2xl transition hover:-translate-y-1 hover:bg-blue-50"
          >
            Become a GuideX Mentor
            <ArrowRight
              size={20}
              className="transition group-hover:translate-x-1"
            />
          </button>

          <div className="mt-7 flex flex-wrap justify-center gap-5 text-sm text-blue-100">
            <span className="flex items-center gap-2">
              <CheckCircle size={16} />
              Simple Application
            </span>

            <span className="flex items-center gap-2">
              <CheckCircle size={16} />
              Profile Verification
            </span>

            <span className="flex items-center gap-2">
              <CheckCircle size={16} />
              Start Mentoring
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MentorRegistraionLandingPage;
