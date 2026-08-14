import { Search, Calendar, Rocket, ArrowRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Find Your Expert",
      description:
        "Browse through our vetted list of industry leaders, engineers, and product managers by skill or company.",
      icon: Search,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      number: "02",
      title: "Book a Session",
      description:
        "Pick an available time slot for 1-on-1 mentorship, mock interviews, or comprehensive resume reviews.",
      icon: Calendar,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      number: "03",
      title: "Accelerate Career",
      description:
        "Connect via live video call, get tactical real-world feedback, and fast-track your professional growth.",
      icon: Rocket,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
  ];

  return (
    <section className="bg-slate-50/50 py-16 sm:py-20 lg:py-24 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold tracking-wider text-blue-600 uppercase bg-blue-50 px-3 py-1.5 rounded-full">
            SIMPLE & SEAMLESS PROCESS
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            How GuideX Works in{" "}
            <span className="text-blue-600">3 Easy Steps</span>
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            Get personalized career guidance without the guesswork.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${step.color}`}
                    >
                      <Icon size={22} />
                    </div>
                    <span className="text-3xl font-black text-slate-200">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-blue-600">
                  <span>Step {step.number}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
