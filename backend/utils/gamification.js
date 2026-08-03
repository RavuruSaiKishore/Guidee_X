import { updateStreak } from "./streak.js";

export const rewardCompletedSession = (student) => {
  const earnedXP = 100;

  // ================= XP =================

  student.learningStats.xp += earnedXP;

  // Level (500 XP = 1 Level)
  student.learningStats.level = Math.floor(student.learningStats.xp / 500) + 1;

  // ================= STREAK =================

  updateStreak(student);

  student.xpHistory.push({
    reason: "Completed mentorship session",
    xp: earnedXP,
    createdAt: new Date(),
  });

  // ================= BADGES =================

  const unlockBadge = (badgeId, title) => {
    const exists = student.achievementHistory.some(
      (badge) => badge.badgeId === badgeId
    );

    if (!exists) {
      student.achievementHistory.push({
        badgeId,
        title,
        unlockedAt: new Date(),
      });
    }
  };

  // XP Badges
  if (student.learningStats.xp >= 100) {
    unlockBadge(1, "First Session");
  }

  if (student.learningStats.xp >= 500) {
    unlockBadge(2, "Learning Explorer");
  }

  if (student.learningStats.xp >= 1000) {
    unlockBadge(3, "Knowledge Seeker");
  }

  if (student.learningStats.xp >= 2500) {
    unlockBadge(4, "GuideX Champion");
  }

  // Streak Badges
  const streak = student.learningStats.streak.current;

  if (streak >= 3) {
    unlockBadge(10, "3 Day Streak");
  }

  if (streak >= 7) {
    unlockBadge(11, "7 Day Streak");
  }

  if (streak >= 30) {
    unlockBadge(12, "30 Day Streak");
  }
};
