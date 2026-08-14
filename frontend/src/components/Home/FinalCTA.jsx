import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-12 sm:py-16 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 sm:p-12 lg:p-16 text-white shadow-2xl">
          {/* Background Ambient Glows */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-black/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold backdrop-blur-md mb-6">
              <Sparkles size={14} /> Start Your Journey Today
            </span>

            <h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
              Ready to Accelerate Your Career?
            </h2>

            <p className="mt-4 text-xs sm:text-sm text-blue-100 leading-relaxed">
              Connect with top industry veterans, schedule mock interviews, and
              get the personalized roadmap you need to succeed.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate("/mentors")}
                className="w-full sm:w-auto rounded-xl bg-white px-7 py-3.5 text-xs font-bold text-blue-600 shadow-lg transition-all hover:bg-slate-100 flex items-center justify-center gap-2"
              >
                Find a Mentor
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => navigate("/landingPage")}
                className="w-full sm:w-auto rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
              >
                Become a Mentor
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
