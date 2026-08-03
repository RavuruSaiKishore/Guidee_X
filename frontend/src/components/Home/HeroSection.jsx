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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    students: 0,
    mentors: 0,
    sessions: 0,
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("UserToken");

        const res = await fetch(`${API_BASE_URL}/api/user/platform-stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        console.log(data);

        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching platform stats:", error);
      }
    };

    fetchStats();
  }, [API_BASE_URL]);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-violet-100">
      {/* ================================================= */}
      {/* COLORFUL BACKGROUND DECORATIONS */}
      {/* ================================================= */}

      {/* Blue Glow */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-400/25 blur-3xl sm:h-[450px] sm:w-[450px]" />

      {/* Purple Glow */}

      <div className="pointer-events-none absolute right-[-150px] top-20 h-[400px] w-[400px] rounded-full bg-purple-400/25 blur-3xl sm:h-[550px] sm:w-[550px]" />

      {/* Pink Glow */}

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-pink-300/20 blur-3xl" />

      {/* Cyan Glow */}

      <div className="pointer-events-none absolute right-1/3 top-1/3 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />

      {/* ================================================= */}
      {/* COLORFUL GRID BACKGROUND */}
      {/* ================================================= */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right,#4f46e5 1px,transparent 1px),linear-gradient(to bottom,#4f46e5 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ================================================= */}
      {/* DECORATIVE BLUR CIRCLES */}
      {/* ================================================= */}

      <div className="pointer-events-none absolute left-[10%] top-[20%] h-3 w-3 animate-pulse rounded-full bg-blue-500" />

      <div className="pointer-events-none absolute left-[45%] top-[15%] h-2 w-2 animate-ping rounded-full bg-purple-500" />

      <div className="pointer-events-none absolute right-[20%] top-[25%] h-3 w-3 animate-pulse rounded-full bg-pink-500" />

      <div className="pointer-events-none absolute bottom-[20%] left-[20%] h-2 w-2 animate-ping rounded-full bg-cyan-500" />

      {/* ================================================= */}
      {/* MAIN CONTAINER */}
      {/* ================================================= */}

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-10 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          {/* ================================================= */}
          {/* LEFT CONTENT */}
          {/* ================================================= */}

          <div className="min-w-0 text-center lg:text-left">
            {/* ================================================= */}
            {/* BADGE */}
            {/* ================================================= */}

            <span className="inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-xs font-bold text-indigo-700 shadow-lg shadow-indigo-100 backdrop-blur-xl sm:px-5 sm:text-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <Rocket size={13} />
              </span>

              <span>India's AI Powered Mentorship Platform</span>

              <Sparkles size={15} className="text-purple-500" />
            </span>

            {/* ================================================= */}
            {/* HEADING */}
            {/* ================================================= */}

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.15] tracking-tight text-gray-900 sm:mt-6 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              Learn from{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Industry Experts
                </span>

                <span className="absolute -bottom-2 left-0 h-1 w-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-70" />
              </span>{" "}
              and Build Your{" "}
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                Dream Career.
              </span>
            </h1>

            {/* ================================================= */}
            {/* DESCRIPTION */}
            {/* ================================================= */}

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
              Book{" "}
              <span className="font-semibold text-blue-600">
                1:1 mentorship sessions
              </span>
              , learn through structured courses, prepare for placements, crack
              interviews, and get guidance from professionals working at
              <span className="font-semibold text-indigo-600">
                {" "}
                Google, Microsoft, Amazon, IITs
              </span>{" "}
              and many more.
            </p>

            {/* ================================================= */}
            {/* SEARCH */}
            {/* ================================================= */}

            <div className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-white/80 bg-white/90 p-2 shadow-xl shadow-blue-100/70 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100 sm:flex-row sm:items-center lg:mx-0">
              <div className="flex min-w-0 flex-1 items-center">
                <div className="ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200 sm:ml-2 sm:h-11 sm:w-11">
                  <Search className="text-white" size={20} />
                </div>

                <input
                  type="text"
                  placeholder="Search mentors, courses, careers..."
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 sm:px-5 sm:py-4 sm:text-base"
                />
              </div>

              <button className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-200 sm:w-auto sm:px-8 sm:py-4">
                Search
              </button>
            </div>

            {/* ================================================= */}
            {/* ACTION BUTTONS */}
            {/* ================================================= */}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4 lg:justify-start">
              <button
                onClick={() => navigate("/courses")}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-200 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
              >
                Explore Courses
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={() => navigate("/mentors")}
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-7 py-3.5 text-sm font-bold text-indigo-700 shadow-lg shadow-indigo-50 transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-xl sm:w-auto sm:px-8 sm:py-4 sm:text-base"
              >
                Find Mentors
                <Users
                  size={18}
                  className="transition-transform group-hover:scale-110"
                />
              </button>
            </div>

            {/* ================================================= */}
            {/* STATS */}
            {/* ================================================= */}

            <div className="mt-10 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4 lg:mt-14 lg:gap-5">
              {/* STUDENTS */}

              <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-4 shadow-lg shadow-blue-100/50 transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-200/60 sm:p-5 lg:p-6">
                <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-blue-200/30 blur-2xl" />

                <div className="relative flex items-center justify-center sm:justify-start">
                  <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-2.5 shadow-lg shadow-blue-200">
                    <Users className="text-white" size={20} />
                  </div>
                </div>

                <h2 className="relative mt-3 text-2xl font-black text-blue-600 sm:text-3xl">
                  {stats.students.toLocaleString()}+
                </h2>

                <p className="relative mt-1 text-sm font-medium text-gray-500">
                  Students Learning
                </p>
              </div>

              {/* MENTORS */}

              <div className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-white to-purple-50 p-4 shadow-lg shadow-purple-100/50 transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-200/60 sm:p-5 lg:p-6">
                <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-purple-200/30 blur-2xl" />

                <div className="relative flex items-center justify-center sm:justify-start">
                  <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 shadow-lg shadow-purple-200">
                    <GraduationCap className="text-white" size={20} />
                  </div>
                </div>

                <h2 className="relative mt-3 text-2xl font-black text-purple-600 sm:text-3xl">
                  {stats.mentors.toLocaleString()}+
                </h2>

                <p className="relative mt-1 text-sm font-medium text-gray-500">
                  Expert Mentors
                </p>
              </div>

              {/* SESSIONS */}

              <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-4 shadow-lg shadow-emerald-100/50 transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-200/60 sm:p-5 lg:p-6">
                <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-emerald-200/30 blur-2xl" />

                <div className="relative flex items-center justify-center sm:justify-start">
                  <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 shadow-lg shadow-emerald-200">
                    <CalendarCheck className="text-white" size={20} />
                  </div>
                </div>

                <h2 className="relative mt-3 text-2xl font-black text-emerald-600 sm:text-3xl">
                  {stats.sessions.toLocaleString()}+
                </h2>

                <p className="relative mt-1 text-sm font-medium text-gray-500">
                  Sessions Completed
                </p>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* RIGHT SIDE */}
          {/* ================================================= */}

          <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
            {/* ================================================= */}
            {/* COLORFUL DECORATIVE CIRCLES */}
            {/* ================================================= */}

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[260px] w-[260px] rounded-full border-2 border-blue-200/60 sm:h-[360px] sm:w-[360px] md:h-[420px] md:w-[420px]" />

              <div className="absolute h-[210px] w-[210px] rounded-full border-2 border-purple-200/60 sm:h-[280px] sm:w-[280px] md:h-[320px] md:w-[320px]" />

              <div className="absolute h-[330px] w-[330px] rounded-full border border-pink-200/50 sm:h-[450px] sm:w-[450px] md:h-[520px] md:w-[520px]" />
            </div>

            {/* ================================================= */}
            {/* COLORFUL GLOW BEHIND IMAGE */}
            {/* ================================================= */}

            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 blur-3xl" />

            {/* ================================================= */}
            {/* HERO IMAGE */}
            {/* ================================================= */}

            <div className="relative z-10 mx-4 overflow-hidden rounded-[28px] border border-white/80 bg-gradient-to-br from-white via-blue-50 to-purple-50 p-5 shadow-2xl shadow-indigo-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl hover:shadow-purple-200/60 sm:mx-8 sm:rounded-[32px] sm:p-8 lg:mx-0">
              {/* Top Color Line */}

              <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

              <img
                src="https://illustrations.popsy.co/blue/remote-work.svg"
                alt="GuideX Hero"
                className="mx-auto w-full max-w-xl object-contain"
              />

              {/* Bottom Badge */}

              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/70 bg-white/90 px-4 py-2 text-xs font-bold text-indigo-700 shadow-lg backdrop-blur-md sm:bottom-7 sm:px-5 sm:py-2.5 sm:text-sm">
                <Star size={15} className="fill-yellow-400 text-yellow-400" />
                Learn • Grow • Succeed
              </div>
            </div>

            {/* ================================================= */}
            {/* FLOATING CARD 1 - MENTORS */}
            {/* ================================================= */}

            <div className="absolute -left-1 top-3 z-20 rounded-2xl border border-blue-100 bg-white/95 p-3 shadow-xl shadow-blue-100/70 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl sm:-left-3 sm:top-8 sm:p-5 md:-left-6">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200 sm:h-12 sm:w-12">
                  <Users className="text-white" size={18} />
                </div>

                <div>
                  <h2 className="text-lg font-black text-indigo-600 sm:text-3xl">
                    {stats.mentors.toLocaleString()}+
                  </h2>

                  <p className="text-[10px] font-medium text-gray-500 sm:text-sm">
                    Top Industry Experts
                  </p>
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* FLOATING CARD 2 - COURSES */}
            {/* ================================================= */}

            <div className="absolute -bottom-5 left-0 z-20 rounded-2xl border border-purple-100 bg-white/95 p-3 shadow-xl shadow-purple-100/70 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl sm:bottom-8 sm:-left-3 sm:p-5 md:-left-10">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-200 sm:h-12 sm:w-12">
                  <GraduationCap className="text-white" size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-black text-gray-800 sm:text-base">
                    200+ Courses
                  </h3>

                  <p className="text-[10px] font-medium text-gray-500 sm:text-sm">
                    Beginner to Advanced
                  </p>
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* FLOATING CARD 3 - LIVE SESSIONS */}
            {/* ================================================= */}

            <div className="absolute -bottom-12 right-0 z-20 rounded-2xl border border-emerald-100 bg-white/95 p-3 shadow-xl shadow-emerald-100/70 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl sm:bottom-3 sm:-right-3 sm:p-5 md:right-0">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-200 sm:h-12 sm:w-12">
                  <Video className="text-white" size={18} />

                  <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full border-2 border-white bg-red-500" />
                </div>

                <div>
                  <h3 className="text-sm font-black text-gray-800 sm:text-base">
                    Live Sessions
                  </h3>

                  <p className="text-[10px] font-medium text-gray-500 sm:text-sm">
                    Daily Mentorship Calls
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* BOTTOM COLOR FADE */}
      {/* ================================================= */}

      <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-white via-white/70 to-transparent sm:h-28" />
    </section>
  );
};

export default HeroSection;
