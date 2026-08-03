import { Zap, Flame, Trophy, Award } from "lucide-react";

const LearningSnapshot = ({ student, learningStats, achievements = [] }) => {
  const cards = [
    {
      title: "Current Level",
      value: learningStats?.level || 1,
      label: "Learning Level",
      icon: Trophy,
      bg: "bg-violet-50",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    {
      title: "Total XP",
      value: (learningStats?.xp || 0).toLocaleString(),
      label: "Experience Points",
      icon: Zap,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Current Streak",
      value: `${learningStats?.currentStreak || 0}`,
      label: "Days Active",
      icon: Flame,
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Achievements",
      value: achievements.length,
      label: "Badges Unlocked",
      icon: Award,
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
          Learning Activity
        </p>

        <h2 className="mt-1 text-3xl font-bold text-gray-900">
          Your Learning Snapshot
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`rounded-3xl border border-gray-200 ${card.bg} p-6`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg}`}
              >
                <Icon size={24} className={card.iconColor} />
              </div>

              <p className="mt-5 text-sm text-gray-500">{card.title}</p>

              <h3 className="mt-1 text-3xl font-bold text-gray-900">
                {card.value}
              </h3>

              <p className="mt-1 text-sm text-gray-500">{card.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LearningSnapshot;
