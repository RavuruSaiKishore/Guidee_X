import {
  GraduationCap,
  Users,
  Video,
  Award,
  Briefcase,
  BookOpen,
  ShieldCheck,
  Clock,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Industry Expert Mentors",
    description:
      "Learn directly from professionals working at Google, Microsoft, Amazon, Meta and top startups.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Video,
    title: "Live 1:1 Mentorship",
    description:
      "Book personalized video sessions, mock interviews and career guidance anytime.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: BookOpen,
    title: "Project-Based Learning",
    description:
      "Master skills by building real-world projects that strengthen your portfolio.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Award,
    title: "Certificates",
    description:
      "Earn certificates after completing courses and showcase your achievements.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Briefcase,
    title: "Placement Support",
    description:
      "Resume reviews, mock interviews, referrals and complete placement preparation.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Users,
    title: "Community Learning",
    description:
      "Join thousands of students, mentors and professionals learning together.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Platform",
    description:
      "Secure payments, verified mentors and high-quality learning resources.",
    color: "from-indigo-500 to-violet-500",
  },
  {
    icon: Clock,
    title: "Flexible Schedule",
    description:
      "Learn at your own pace with recorded sessions and flexible mentor availability.",
    color: "from-yellow-500 to-orange-500",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}

        <div className="text-center mb-16">
          <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold">
            Why GuideX
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mt-5">
            Why Students Choose
            <span className="text-blue-600"> GuideX</span>
          </h2>

          <p className="mt-5 text-gray-600 max-w-3xl mx-auto text-lg">
            GuideX combines expert mentorship, practical learning, career
            guidance and placement support to help students achieve their dream
            jobs and higher education goals.
          </p>
        </div>

        {/* Feature Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-lg`}
                >
                  <Icon size={30} />
                </div>

                <h3 className="text-xl font-bold mt-6">{feature.title}</h3>

                <p className="text-gray-600 mt-4 leading-relaxed">
                  {feature.description}
                </p>

                <button className="mt-6 flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                  Learn More
                  <ArrowRight size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}

        <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h3 className="text-4xl font-bold">
            Start Your Success Journey Today 🚀
          </h3>

          <p className="mt-5 text-blue-100 text-lg max-w-3xl mx-auto">
            Join thousands of learners who are transforming their careers
            through expert mentorship, live sessions, practical projects and
            placement assistance.
          </p>

          <button className="mt-8 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:scale-105 transition duration-300">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
