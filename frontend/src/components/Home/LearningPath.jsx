import {
  Code2,
  Brain,
  Shield,
  Cloud,
  Database,
  Settings,
  Briefcase,
  HeartPulse,
  GraduationCap,
  Laptop,
  ArrowRight,
} from "lucide-react";

const sessions = [
  {
    icon: Code2,
    title: "Software Development",
    description:
      "Learn frontend, backend, full-stack development, APIs, databases, and real-world projects.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Brain,
    title: "Artificial Intelligence",
    description:
      "Master AI concepts, LLMs, Generative AI, prompt engineering, and intelligent applications.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Database,
    title: "Machine Learning",
    description:
      "Build predictive models using Python, TensorFlow, Scikit-Learn, and real datasets.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Shield,
    title: "Cyber Security",
    description:
      "Learn ethical hacking, penetration testing, networking, and security best practices.",
    color: "from-red-500 to-orange-500",
  },
  {
    icon: Cloud,
    title: "Cloud Computing",
    description:
      "Gain expertise in AWS, Azure, Google Cloud, serverless architecture, and deployment.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Settings,
    title: "DevOps",
    description:
      "Understand Docker, Kubernetes, CI/CD pipelines, automation, and infrastructure.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Database,
    title: "Data Science",
    description:
      "Analyze data, create dashboards, build predictive analytics, and visualization projects.",
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: Briefcase,
    title: "Finance",
    description:
      "Learn financial analysis, investment strategies, fintech, and business analytics.",
    color: "from-yellow-500 to-amber-500",
  },
  {
    icon: HeartPulse,
    title: "Healthcare",
    description:
      "Explore healthcare technology, medical data analysis, and digital health solutions.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description:
      "Develop teaching skills, educational technology knowledge, and learning methodologies.",
    color: "from-indigo-500 to-violet-500",
  },
];

const LearningPath = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 via-white to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}

        <div className="text-center mb-16">
          <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold">
            Mentor Sessions
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mt-5">
            Explore Our
            <span className="text-blue-600"> Session Categories</span>
          </h2>

          <p className="text-gray-500 mt-5 max-w-3xl mx-auto text-lg">
            Learn from experienced mentors across multiple domains. Choose a
            session that matches your interests and accelerate your career with
            personalized guidance.
          </p>
        </div>

        {/* Timeline */}

        <div className="grid lg:grid-cols-4 gap-8 relative">
          {sessions.map((session, index) => {
            const Icon = session.icon;

            return (
              <div
                key={index}
                className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-8 border border-gray-100"
              >
                {/* Number */}

                <div className="absolute -top-5 left-8 bg-white border-4 border-blue-100 rounded-full w-10 h-10 flex items-center justify-center font-bold text-blue-600">
                  {index + 1}
                </div>

                {/* Icon */}

                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${session.color} flex items-center justify-center text-white shadow-lg mt-4`}
                >
                  <Icon size={36} />
                </div>

                {/* Content */}

                <h3 className="text-2xl font-bold mt-6">{session.title}</h3>

                <p className="text-gray-600 mt-4 leading-relaxed">
                  {session.description}
                </p>

                <button className="mt-8 flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all">
                  Learn More
                  <ArrowRight size={18} />
                </button>

                {/* Connector */}

                {index !== sessions.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-8">
                    <ArrowRight size={40} className="text-blue-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}

        <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 text-center text-white shadow-2xl">
          <h3 className="text-3xl font-bold">
            Start Your Learning Journey Today 🚀
          </h3>

          <p className="mt-4 text-blue-100 text-lg max-w-3xl mx-auto">
            Join thousands of students learning from top mentors working at
            Google, Microsoft, Amazon, Meta and many leading startups.
          </p>

          <button className="mt-8 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:scale-105 transition">
            Explore Learning Paths
          </button>
        </div>
      </div>
    </section>
  );
};

export default LearningPath;
