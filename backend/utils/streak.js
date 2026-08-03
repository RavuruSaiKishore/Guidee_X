export const updateStreak = (student) => {
  const today = new Date();

  const todayOnly = new Date(today);
  todayOnly.setHours(0, 0, 0, 0);

  const lastActivity = student.learningStats.streak.lastActivity;

  if (!lastActivity) {
    student.learningStats.streak.current = 1;
  } else {
    const last = new Date(lastActivity);
    last.setHours(0, 0, 0, 0);

    const diff = (todayOnly.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      student.learningStats.streak.current += 1;
    } else if (diff > 1) {
      student.learningStats.streak.current = 1;
    }
    // diff === 0 -> same day, don't increase streak
  }

  student.learningStats.streak.longest = Math.max(
    student.learningStats.streak.longest,
    student.learningStats.streak.current
  );

  student.learningStats.streak.lastActivity = today;
};
