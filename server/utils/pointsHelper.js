// Streak bonus based on current streak
export const getStreakBonus = (streak) => {
  if (streak === 30) return { bonus: 100, reason: '30-day streak bonus 🔥' };
  if (streak === 7) return { bonus: 30, reason: '7-day streak bonus 💪' };
  if (streak === 3) return { bonus: 15, reason: '3-day streak bonus ⚡' };
  return null;
};

// Get today's date as YYYY-MM-DD in IST
export const getTodayIST = () => {
  return new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Kolkata',
  });
};

// Get yesterday's date string
export const getYesterdayIST = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString('en-CA', {
    timeZone: 'Asia/Kolkata',
  });
};
