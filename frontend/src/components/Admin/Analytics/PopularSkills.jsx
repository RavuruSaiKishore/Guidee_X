import { Code2, Flame } from "lucide-react";

const gradients = [
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-green-500",
  "from-violet-500 to-purple-500",
  "from-pink-500 to-rose-500",
  "from-orange-500 to-red-500",
  "from-indigo-500 to-blue-500",
  "from-teal-500 to-cyan-500",
  "from-yellow-500 to-orange-500",
];

export default function PopularSkills({ skills = [] }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
      {/* Header */}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Popular Skills</h2>

          <p className="text-gray-500 mt-1">Most common mentor expertise</p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-cyan-100 flex items-center justify-center">
          <Code2 size={28} className="text-cyan-600" />
        </div>
      </div>

      {/* Top Skill */}

      {skills.length > 0 && (
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 p-5 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Most Popular Skill</p>

              <h2 className="text-3xl font-bold mt-2">{skills[0].name}</h2>

              <p className="mt-2 opacity-90">{skills[0].count} Mentors</p>
            </div>

            <Flame size={44} />
          </div>
        </div>
      )}

      {/* Skills */}

      <div className="flex flex-wrap gap-4">
        {skills.map((skill, index) => (
          <div
            key={skill.name}
            className={`
              bg-gradient-to-r
              ${gradients[index % gradients.length]}
              text-white
              rounded-2xl
              px-5
              py-4
              shadow-md
              hover:scale-105
              transition
              cursor-pointer
              min-w-[160px]
            `}
          >
            <h3 className="font-semibold text-lg">{skill.name}</h3>

            <p className="text-sm opacity-90 mt-2">{skill.count} Mentors</p>
          </div>
        ))}
      </div>
    </div>
  );
}
