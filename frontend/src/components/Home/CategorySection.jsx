// src/components/Home/CategorySection.jsx

import {
  Code2,
  BrainCircuit,
  Database,
  Binary,
  Cloud,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    title: "Web Development",
    courses: "120+ Courses",
    icon: Code2,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "AI & Machine Learning",
    courses: "85+ Courses",
    icon: BrainCircuit,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Data Science",
    courses: "70+ Courses",
    icon: Database,
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Data Structures",
    courses: "95+ Courses",
    icon: Binary,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Cloud Computing",
    courses: "60+ Courses",
    icon: Cloud,
    color: "from-sky-500 to-blue-500",
  },
  {
    title: "Cyber Security",
    courses: "55+ Courses",
    icon: ShieldCheck,
    color: "from-gray-700 to-gray-900",
  },
];

const CategorySection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}

        <div className="text-center mb-14">
          <span className="text-blue-600 font-semibold uppercase tracking-widest">
            Categories
          </span>

          <h2 className="text-4xl font-bold mt-3 text-gray-900">
            Explore Learning Categories
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Choose your career path and start learning from industry experts
            through structured courses and mentorship.
          </p>
        </div>

        {/* Cards */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {categories.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition duration-300 hover:-translate-y-2 cursor-pointer border border-gray-100"
              >
                {/* Icon */}

                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition`}
                >
                  <Icon size={32} />
                </div>

                {/* Title */}

                <h3 className="text-2xl font-bold text-gray-800">
                  {item.title}
                </h3>

                {/* Courses */}

                <p className="mt-3 text-gray-500">{item.courses}</p>

                {/* Description */}

                <p className="mt-4 text-gray-600 leading-7">
                  Learn with structured roadmaps, real-world projects,
                  assignments, live mentorship, and interview preparation.
                </p>

                {/* Explore */}

                <div className="mt-8 flex items-center text-blue-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                  Explore
                  <ArrowRight size={18} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
