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
    <section className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20 font-sans">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* MAIN WRAPPER CARD (Clean Minimalist White Card UI matching previous sections) */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 lg:p-16 shadow-sm">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* LEFT CONTENT (7 Columns) */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700">
                <GraduationCap size={15} className="text-blue-600" />
                <span>BECOME A MENTOR</span>
              </div>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl leading-tight">
                Inspire Students & Build Your{" "}
                <span className="text-blue-600">Personal Brand</span>
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base font-normal max-w-xl">
                Share your experience, guide ambitious learners, conduct 1-on-1
                mentorship sessions, and earn while making a real impact.
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <CheckCircle
                    className="text-blue-600 mt-0.5 shrink-0"
                    size={18}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Flexible Schedule
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Mentor whenever you're available.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <CheckCircle
                    className="text-blue-600 mt-0.5 shrink-0"
                    size={18}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Verified Students
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Connect with genuine learners.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <CheckCircle
                    className="text-blue-600 mt-0.5 shrink-0"
                    size={18}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Earn Online
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Get paid for every session.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <CheckCircle
                    className="text-blue-600 mt-0.5 shrink-0"
                    size={18}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Build Reputation
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Grow your professional profile.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => navigate("/mentor/register")}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-slate-800"
                >
                  Apply to Become a Mentor
                  <ArrowRight
                    className="transition-transform group-hover:translate-x-1"
                    size={15}
                  />
                </button>
              </div>
            </div>

            {/* RIGHT BENEFITS & STATS (5 Columns) */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 sm:p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6">
                  Why Mentor on GuideX?
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <Users size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Reach Thousands
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Mentor students across India.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <IndianRupee size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Earn Per Session
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Set your own pricing.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Flexible Availability
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Manage your own schedule.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Career Growth
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Showcase expertise to top recruiters.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-slate-200 text-center">
                  <div className="bg-white rounded-xl py-3 border border-slate-100 shadow-sm">
                    <h4 className="text-base font-black text-slate-900">
                      10K+
                    </h4>
                    <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                      Students
                    </p>
                  </div>

                  <div className="bg-white rounded-xl py-3 border border-slate-100 shadow-sm">
                    <h4 className="text-base font-black text-slate-900">
                      500+
                    </h4>
                    <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                      Mentors
                    </p>
                  </div>

                  <div className="bg-white rounded-xl py-3 border border-slate-100 shadow-sm">
                    <h4 className="text-base font-black text-slate-900">
                      4.9★
                    </h4>
                    <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                      Rating
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeMentorCTA;
