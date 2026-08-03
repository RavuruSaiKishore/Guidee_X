import { ArrowRight, Rocket, Users, GraduationCap, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700">
      {/* Background Blur */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-400 opacity-20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Main Card */}

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-10 md:p-16 shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}

            <div>
              <span className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
                <Rocket size={16} />
                Your Future Starts Here
              </span>

              <h2 className="mt-6 text-5xl font-bold leading-tight text-white">
                Ready to Build Your
                <span className="text-yellow-300"> Dream Career?</span>
              </h2>

              <p className="mt-6 text-blue-100 text-lg leading-relaxed">
                Learn from top mentors working at Google, Microsoft, Amazon,
                Meta and leading startups.
                <br />
                Gain practical skills, build projects, prepare for interviews
                and land your dream job.
              </p>

              <button
                onClick={() => navigate("/login")}
                className="mt-10 inline-flex items-center gap-3 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition"
              >
                Start Learning Today
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Right */}

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/15 rounded-2xl p-6 text-center">
                <Users className="mx-auto mb-3 text-yellow-300" size={40} />

                <h3 className="text-3xl font-bold text-white">10K+</h3>

                <p className="text-blue-100 mt-2">Active Students</p>
              </div>

              <div className="bg-white/15 rounded-2xl p-6 text-center">
                <GraduationCap
                  className="mx-auto mb-3 text-yellow-300"
                  size={40}
                />

                <h3 className="text-3xl font-bold text-white">500+</h3>

                <p className="text-blue-100 mt-2">Expert Mentors</p>
              </div>

              <div className="bg-white/15 rounded-2xl p-6 text-center">
                <Rocket className="mx-auto mb-3 text-yellow-300" size={40} />

                <h3 className="text-3xl font-bold text-white">150+</h3>

                <p className="text-blue-100 mt-2">Career Courses</p>
              </div>

              <div className="bg-white/15 rounded-2xl p-6 text-center">
                <Star className="mx-auto mb-3 text-yellow-300" size={40} />

                <h3 className="text-3xl font-bold text-white">4.9★</h3>

                <p className="text-blue-100 mt-2">Student Rating</p>
              </div>
            </div>
          </div>

          {/* Bottom */}

          <div className="mt-14 border-t border-white/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-blue-100 text-lg">
              ✔ Lifetime Learning Access
              <span className="mx-4">•</span>✔ Live Mentorship
              <span className="mx-4">•</span>✔ Placement Support
            </div>

            <button
              onClick={() => navigate("/pricing")}
              className="border border-white px-8 py-3 rounded-xl text-white font-semibold hover:bg-white hover:text-blue-700 transition"
            >
              View Pricing
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
