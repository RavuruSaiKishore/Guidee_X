import {
  Briefcase,
  Users,
  IndianRupee,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BecomeMentorCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700">
      {/* Background Blur */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-indigo-400/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div>
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm font-semibold">
              <GraduationCap size={18} />
              Become a Mentor
            </span>

            <h2 className="mt-8 text-5xl md:text-6xl font-bold text-white leading-tight">
              Inspire Students.
              <br />
              Build Your
              <span className="text-yellow-300"> Personal Brand.</span>
            </h2>

            <p className="mt-8 text-blue-100 text-lg leading-8 max-w-xl">
              Share your experience, guide ambitious students, conduct
              one-on-one mentorship sessions, and earn while making a real
              impact.
            </p>

            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-300 mt-1" />
                <div>
                  <h4 className="font-semibold text-white">
                    Flexible Schedule
                  </h4>
                  <p className="text-blue-100 text-sm">
                    Mentor whenever you're available.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-300 mt-1" />
                <div>
                  <h4 className="font-semibold text-white">
                    Verified Students
                  </h4>
                  <p className="text-blue-100 text-sm">
                    Connect with genuine learners.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-300 mt-1" />
                <div>
                  <h4 className="font-semibold text-white">Earn Online</h4>
                  <p className="text-blue-100 text-sm">
                    Get paid for every mentorship session.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-300 mt-1" />
                <div>
                  <h4 className="font-semibold text-white">Build Reputation</h4>
                  <p className="text-blue-100 text-sm">
                    Grow your professional profile.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("mentor/register")}
              className="group mt-12 bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 hover:scale-105 transition-all shadow-2xl"
            >
              Apply to Become a Mentor
              <ArrowRight
                className="group-hover:translate-x-1 transition"
                size={20}
              />
            </button>
          </div>

          {/* RIGHT */}

          <div className="relative">
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <h3 className="text-3xl font-bold text-gray-800">
                Why Mentor on GuideX?
              </h3>

              <div className="mt-10 space-y-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Users className="text-blue-700" />
                  </div>

                  <div>
                    <h4 className="font-bold text-lg">Reach Thousands</h4>

                    <p className="text-gray-500">
                      Mentor students across India.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                    <IndianRupee className="text-green-700" />
                  </div>

                  <div>
                    <h4 className="font-bold text-lg">Earn Per Session</h4>

                    <p className="text-gray-500">Set your own pricing.</p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Calendar className="text-purple-700" />
                  </div>

                  <div>
                    <h4 className="font-bold text-lg">Flexible Availability</h4>

                    <p className="text-gray-500">Manage your own schedule.</p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Briefcase className="text-orange-600" />
                  </div>

                  <div>
                    <h4 className="font-bold text-lg">Career Growth</h4>

                    <p className="text-gray-500">
                      Showcase your expertise to recruiters.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-5 mt-12">
                <div className="text-center bg-blue-50 rounded-xl py-5">
                  <h2 className="text-3xl font-bold text-blue-700">10K+</h2>

                  <p className="text-sm text-gray-600 mt-1">Students</p>
                </div>

                <div className="text-center bg-green-50 rounded-xl py-5">
                  <h2 className="text-3xl font-bold text-green-700">500+</h2>

                  <p className="text-sm text-gray-600 mt-1">Mentors</p>
                </div>

                <div className="text-center bg-purple-50 rounded-xl py-5">
                  <h2 className="text-3xl font-bold text-purple-700">4.9★</h2>

                  <p className="text-sm text-gray-600 mt-1">Rating</p>
                </div>
              </div>
            </div>

            {/* Floating Card */}

            <div className="hidden lg:flex absolute -top-8 -right-8 bg-white rounded-2xl shadow-xl px-6 py-4 items-center gap-4 animate-bounce">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                🎉
              </div>

              <div>
                <h4 className="font-bold text-gray-800">Applications Open</h4>

                <p className="text-sm text-gray-500">
                  Join our mentor community today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeMentorCTA;
