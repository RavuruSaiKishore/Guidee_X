import { GraduationCap, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 font-sans border-t border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        {/* Main Footer Grid */}
        <div className="grid gap-10 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-base font-black text-white shadow-sm">
                G
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  GuideX
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">
                  Learn • Mentor • Grow
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              GuideX connects ambitious students with experienced industry
              professionals through personalized mentorship and skill
              development.
            </p>

            <div className="flex gap-2.5 pt-1">
              {["F", "X", "L", "I"].map((item) => (
                <div
                  key={item}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 transition hover:bg-blue-600 hover:border-blue-600 hover:text-white"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h3>
            <div className="space-y-2.5 text-xs">
              {[
                "Home",
                "Find Mentors",
                "Become Mentor",
                "Courses",
                "Pricing",
                "Contact",
              ].map((item) => (
                <a
                  href="#"
                  key={item}
                  className="block text-slate-400 transition hover:translate-x-1 hover:text-white"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Mentor Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Mentors
            </h3>
            <div className="space-y-2.5 text-xs">
              {[
                "Become a Mentor",
                "Mentor Guidelines",
                "Community",
                "Dashboard",
                "Payments",
                "Support",
              ].map((item) => (
                <a
                  href="#"
                  key={item}
                  className="block text-slate-400 transition hover:translate-x-1 hover:text-white"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Stay Updated
            </h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Subscribe to receive updates about GuideX, mentorship
              opportunities and platform news.
            </p>

            <div className="mt-4 space-y-2.5">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white outline-none transition focus:border-blue-500 placeholder:text-slate-500"
              />

              <button className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white transition hover:bg-blue-500 shadow-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-12 grid grid-cols-2 gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:grid-cols-4 text-center">
          <div>
            <h4 className="text-2xl font-black text-blue-400">5000+</h4>
            <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
              Students
            </p>
          </div>

          <div>
            <h4 className="text-2xl font-black text-blue-400">250+</h4>
            <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
              Mentors
            </p>
          </div>

          <div>
            <h4 className="text-2xl font-black text-blue-400">1200+</h4>
            <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
              Sessions
            </p>
          </div>

          <div>
            <h4 className="text-2xl font-black text-blue-400">4.9★</h4>
            <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
              Rating
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-900 pt-6 text-xs lg:flex-row">
          <p className="text-slate-500">
            © {new Date().getFullYear()} GuideX. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <a href="#" className="transition hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:text-white">
              Terms & Conditions
            </a>
            <a href="#" className="transition hover:text-white">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
