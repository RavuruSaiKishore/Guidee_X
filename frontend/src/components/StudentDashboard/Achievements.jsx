import { Award, CalendarDays } from "lucide-react";

const Achievements = ({ achievements = [] }) => {
  if (achievements.length === 0) {
    return (
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <Award className="mx-auto text-gray-300" size={44} />

          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Your Achievements
          </h2>

          <p className="mt-2 text-gray-500">
            Complete mentorship sessions to unlock your first achievement.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
          Milestones
        </p>

        <h2 className="mt-1 text-3xl font-bold text-gray-900">
          Your Achievements
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {achievements
          .slice()
          .reverse()
          .slice(0, 6)
          .map((achievement, index) => (
            <div
              key={`${achievement.badgeId}-${index}`}
              className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
                <Award size={28} className="text-amber-600" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                {achievement.title}
              </h3>

              {achievement.unlockedAt && (
                <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <CalendarDays size={15} />
                  Unlocked{" "}
                  {new Date(achievement.unlockedAt).toLocaleDateString("en-IN")}
                </p>
              )}
            </div>
          ))}
      </div>
    </section>
  );
};

export default Achievements;
