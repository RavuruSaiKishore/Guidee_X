import {
  Search,
  ArrowRight,
  Users,
  GraduationCap,
  Video,
  CalendarCheck,
  Sparkles,
  Rocket,
  Star,
  CheckCircle2,
  ShieldCheck,
  Award,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    students: 12500,
    mentors: 450,
    sessions: 35000,
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("UserToken");
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/api/user/platform-stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success && data.stats) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching platform stats:", error);
      }
    };

    fetchStats();
  }, [API_BASE_URL]);

  return (
    <section className="relative w-full overflow-hidden bg-white font-sans text-slate-900">
      {/* ================================================= */}
      {/* CLEAN MINIMAL LIGHT BACKGROUND GLOW */}
      {/* ================================================= */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-600/5 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-100px] top-10 h-96 w-96 rounded-full bg-blue-600/5 blur-[140px]" />

      {/* ================================================= */}
      {/* MAIN CONTAINER */}
      {/* ================================================= */}
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-10 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ================================================= */}
          {/* LEFT CONTENT (7 Columns) */}
          {/* ================================================= */}
          <div className="min-w-0 text-center lg:text-left lg:col-span-7">
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-800">
              <Rocket size={13} className="text-blue-600" />
              <span>
                India's{" "}
                <span className="text-slate-900 font-bold">AI-Powered</span>{" "}
                Mentorship Network
              </span>
            </div>

            {/* HEADING (Reduced font size & limited to blue + slate colors) */}
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-4xl xl:text-5xl leading-[1.18]">
              Accelerate Your Career with{" "}
              <span className="text-blue-600">World-Class Experts</span>
            </h1>

            {/* DESCRIPTION */}
            <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm lg:mx-0 font-normal">
              Connect{" "}
              <span className="font-bold text-blue-600 bg-blue-50 px-1 py-0.5 rounded">
                1-on-1
              </span>{" "}
              with senior engineers, product managers, and leaders from{" "}
              <span className="font-semibold text-slate-900 underline decoration-blue-500 decoration-1">
                Google, Microsoft, Amazon, and top IITs
              </span>{" "}
              for mock interviews, career roadmaps, and resume reviews.
            </p>

            {/* SEARCH / QUICK DISCOVERY BOX */}
            <div className="mx-auto mt-6 flex w-full max-w-lg flex-col gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-blue-100/50 sm:flex-row sm:items-center lg:mx-0">
              <div className="flex min-w-0 flex-1 items-center px-2">
                <Search className="text-slate-400 shrink-0 ml-1" size={17} />
                <input
                  type="text"
                  placeholder="Search mentors by skill, role, or company..."
                  className="min-w-0 flex-1 bg-transparent px-2.5 py-2.5 text-xs text-slate-900 outline-none placeholder:text-slate-400 font-medium"
                />
              </div>

              <button
                onClick={() => navigate("/mentors")}
                className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 sm:w-auto sm:px-6"
              >
                Search
              </button>
            </div>

            {/* TRUST PILLS */}
            <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-[11px] font-medium text-slate-600">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-blue-600" /> Verified
                Experts
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-blue-600" /> 100% Secure
                Bookings
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-blue-600" /> Free Trial
                Available
              </span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center sm:gap-3 lg:justify-start">
              <button
                onClick={() => navigate("/mentors")}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 sm:w-auto sm:px-6"
              >
                Explore Mentors
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={() => navigate("/courses")}
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-6 py-3 text-xs font-bold text-slate-700 transition-all hover:bg-slate-100 sm:w-auto sm:px-6"
              >
                Browse Courses
                <Users size={14} className="text-blue-600" />
              </button>
            </div>

            {/* STATS STRIP */}
            <div className="mt-10 grid grid-cols-3 gap-3 pt-6 border-t border-slate-200">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {stats.students.toLocaleString()}+
                </h3>
                <p className="text-[11px] font-semibold text-blue-600 mt-0.5">
                  Active Learners
                </p>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {stats.mentors.toLocaleString()}+
                </h3>
                <p className="text-[11px] font-semibold text-blue-600 mt-0.5">
                  Expert Mentors
                </p>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {stats.sessions.toLocaleString()}+
                </h3>
                <p className="text-[11px] font-semibold text-blue-600 mt-0.5">
                  Sessions Done
                </p>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* RIGHT SIDE (5 Columns - Visual Card Stack) */}
          {/* ================================================= */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none lg:col-span-5">
            {/* Ambient Back Glow */}
            <div className="absolute inset-0 bg-blue-500/5 rounded-3xl blur-2xl" />

            {/* MAIN HERO CARD CONTAINER */}
            <div className="relative z-10 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-100">
              {/* Card Header Profile mockup */}
              <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
                <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center text-white font-bold text-base justify-center shadow-sm">
                  🚀
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    Top <span className="text-blue-600">Industry Leaders</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Google • Microsoft • Amazon • Flipkart
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-amber-700 text-[11px] font-bold">
                  <Star size={11} className="fill-amber-400 text-amber-400" />{" "}
                  4.9
                </div>
              </div>

              {/* Feature Highlights inside Hero Card */}
              <div className="mt-4 space-y-2.5">
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3 transition hover:bg-blue-50/50">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <Video size={16} />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-900">
                      1-on-1{" "}
                      <span className="text-blue-600">
                        Live Mock Interviews
                      </span>
                    </h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Real-time feedback from hiring managers
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3 transition hover:bg-blue-50/50">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <Award size={16} />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-900">
                      Tailored{" "}
                      <span className="text-blue-600">Career Roadmaps</span>
                    </h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Custom guidance aligned with your goals
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3 transition hover:bg-blue-50/50">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-900">
                      Verified{" "}
                      <span className="text-blue-600">Resume & Portfolio</span>{" "}
                      Review
                    </h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Stand out to top recruiters instantly
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Action inside Card */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center -space-x-2">
                  <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-blue-600 text-[9px] font-bold flex items-center justify-center text-white">
                    AS
                  </span>
                  <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-slate-700 text-[9px] font-bold flex items-center justify-center text-white">
                    RK
                  </span>
                  <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-blue-500 text-[9px] font-bold flex items-center justify-center text-white">
                    PM
                  </span>
                  <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-slate-600 text-[9px] font-bold flex items-center justify-center text-white">
                    +
                  </span>
                </div>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  Available Today
                </span>
              </div>
            </div>

            {/* FLOATING BADGE 1 */}
            <div className="absolute -left-3 top-5 z-20 rounded-xl border border-slate-200 bg-white p-2.5 shadow-lg backdrop-blur-md hidden sm:flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <CalendarCheck size={15} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-900">
                  Instant <span className="text-blue-600">Booking</span>
                </p>
                <p className="text-[9px] text-slate-500">Slots open 24/7</p>
              </div>
            </div>

            {/* FLOATING BADGE 2 */}
            <div className="absolute -bottom-5 -right-3 z-20 rounded-xl border border-slate-200 bg-white p-2.5 shadow-lg backdrop-blur-md hidden sm:flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Users size={15} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-900">
                  <span className="text-blue-600">100% Placement</span> Support
                </p>
                <p className="text-[9px] text-slate-500">
                  Referrals & guidance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
