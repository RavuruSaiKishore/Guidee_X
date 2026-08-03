import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  Sparkles,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const WelcomeBanner = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const highlights = [
    {
      icon: Users,
      value: "500+",
      label: "Expert Mentors",
      color: "text-cyan-300",
    },
    {
      icon: BookOpen,
      value: "150+",
      label: "Learning Paths",
      color: "text-emerald-300",
    },
    {
      icon: Award,
      value: "98%",
      label: "Success Rate",
      color: "text-amber-300",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 shadow-xl mt-9">
      <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative z-10 grid items-center gap-8 px-6 py-7 sm:px-8 sm:py-9 lg:grid-cols-2 lg:px-12 lg:py-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-blue-100 backdrop-blur-md">
            <CalendarDays size={16} />
            {today}
          </div>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Welcome back,
            <br />
            <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
              {user?.firstName || "Student"} 👋
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
            Continue your learning journey with expert mentors, gain real-world
            insights, and build the skills needed to achieve your career goals.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/mentors")}
              className="group flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Find a Mentor
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

            <button
              onClick={() => navigate("/courses")}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              <BookOpen size={17} />
              Explore Courses
            </button>
          </div>

          <div className="mt-7 grid max-w-xl grid-cols-3 gap-3">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-lg sm:p-4"
                >
                  <Icon size={22} className={`mb-2 ${item.color}`} />

                  <h3 className="text-xl font-bold text-white sm:text-2xl">
                    {item.value}
                  </h3>

                  <p className="text-[11px] text-blue-100 sm:text-xs">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden justify-end lg:flex">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-white/10 blur-2xl" />

            <div className="relative rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
              <img
                src="https://illustrations.popsy.co/white/student-with-laptop.svg"
                alt="Student learning"
                className="w-[360px] xl:w-[400px]"
              />

              <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-2 text-xs font-bold text-white shadow-lg">
                <Sparkles size={14} />
                Learning Streak 🔥
              </div>

              <div className="absolute bottom-4 left-4 max-w-[230px] rounded-2xl bg-white p-4 shadow-xl">
                <p className="text-xs text-gray-500">Keep learning</p>

                <h3 className="mt-1 text-sm font-bold text-gray-800">
                  Your next milestone awaits
                </h3>

                <p className="mt-1 text-xs text-blue-600">
                  Continue your mentorship journey
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeBanner;
