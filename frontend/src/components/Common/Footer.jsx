import { GraduationCap, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-14 lg:grid-cols-4">
          {/* Brand */}

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xl font-bold text-white">
                G
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">GuideX</h2>

                <p className="text-sm text-slate-400">Learn • Mentor • Grow</p>
              </div>
            </div>

            <p className="mt-6 leading-8 text-slate-400">
              GuideX connects ambitious students with experienced industry
              professionals through personalized mentorship, career guidance,
              interview preparation and skill development.
            </p>

            <div className="mt-8 flex gap-4">
              {["F", "X", "L", "I"].map((item) => (
                <div
                  key={item}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl bg-slate-900 transition hover:bg-blue-600 hover:text-white"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}

          <div>
            <h3 className="mb-6 text-xl font-bold text-white">Quick Links</h3>

            <div className="space-y-4">
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
                  className="block transition hover:translate-x-1 hover:text-blue-400"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Mentor */}

          <div>
            <h3 className="mb-6 text-xl font-bold text-white">Mentors</h3>

            <div className="space-y-4">
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
                  className="block transition hover:translate-x-1 hover:text-blue-400"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}

          <div>
            <h3 className="mb-6 text-xl font-bold text-white">Stay Updated</h3>

            <p className="leading-7 text-slate-400">
              Subscribe to receive updates about GuideX, mentorship
              opportunities and platform news.
            </p>

            <div className="mt-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none transition focus:border-blue-500"
              />

              <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white transition hover:shadow-xl">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}

        <div className="mt-20 grid gap-6 rounded-[32px] border border-slate-800 bg-slate-900 p-10 md:grid-cols-4">
          <div className="text-center">
            <h2 className="text-4xl font-black text-blue-400">5000+</h2>

            <p className="mt-2 text-slate-400">Students</p>
          </div>

          <div className="text-center">
            <h2 className="text-4xl font-black text-blue-400">250+</h2>

            <p className="mt-2 text-slate-400">Mentors</p>
          </div>

          <div className="text-center">
            <h2 className="text-4xl font-black text-blue-400">1200+</h2>

            <p className="mt-2 text-slate-400">Sessions</p>
          </div>

          <div className="text-center">
            <h2 className="text-4xl font-black text-blue-400">4.9★</h2>

            <p className="mt-2 text-slate-400">Rating</p>
          </div>
        </div>

        {/* Bottom */}

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-slate-800 pt-8 lg:flex-row">
          <p className="text-slate-500">
            © {new Date().getFullYear()} GuideX. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-8">
            <a href="#" className="transition hover:text-blue-400">
              Privacy Policy
            </a>

            <a href="#" className="transition hover:text-blue-400">
              Terms & Conditions
            </a>

            <a href="#" className="transition hover:text-blue-400">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
