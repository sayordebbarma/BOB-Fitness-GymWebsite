import User from '../models/User.js';
import CheckIn from '../models/CheckIn.js';
import {
  getStreakBonus,
  getTodayIST,
  getYesterdayIST,
} from '../utils/pointsHelper.js';

// DAILY CHECK-IN
export const checkIn = async (req, res) => {
  try {
    const today = getTodayIST();
    const yesterday = getYesterdayIST();
    const userId = req.user.id;

    // Check if already checked in today
    const alreadyCheckedIn = await CheckIn.findOne({
      user: userId,
      date: today,
    });
    if (alreadyCheckedIn) {
      return res.status(400).json({
        success: false,
        message: 'Already checked in today! Come back tomorrow.',
        alreadyCheckedIn: true,
      });
    }
    const user = await User.findById(userId);

    // Calculate new streak
    const checkedInYesterday = await CheckIn.findOne({
      user: userId,
      date: yesterday,
    });
    const newStreak = checkedInYesterday ? user.streak + 1 : 1;

    // Base points
    let totalPointsEarned = 10;
    let bonusReason = null;

    // Streak bonus
    const streakBonus = getStreakBonus(newStreak);
    if (streakBonus) {
      totalPointsEarned += streakBonus.bonus;
      bonusReason = streakBonus.reason;
    }

    // Check for new badges
    const newBadges = [...user.badges];
    if (!newBadges.includes('first_checkin')) {
      newBadges.push('first_checkin');
    }
    if (newStreak >= 7 && !newBadges.includes('week_warrior')) {
      newBadges.push('week_warrior');
    }
    if (newStreak >= 30 && !newBadges.includes('monthly_legend')) {
      newBadges.push('monthly_legend');
    }

    // Create check-in record
    const checkInRecord = await CheckIn.create({
      user: userId,
      date: today,
      pointsEarned: totalPointsEarned,
      bonusReason,
      streakAtCheckIn: newStreak,
    });

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $inc: { points: totalPointsEarned, totalCheckIns: 1 },
        streak: newStreak,
        lastCheckIn: new Date(),
        longestStreak: Math.max(user.longestStreak, newStreak),
        badges: newBadges,
      },
      { returnDocument: 'after' },
    );

    res.status(200).json({
      success: true,
      message: bonusReason
        ? `Check-in successful! +${totalPointsEarned} pts — ${bonusReason}`
        : `Check-in successful! +${totalPointsEarned} pts`,
      pointsEarned: totalPointsEarned,
      bonusReason,
      newStreak,
      totalPoints: updatedUser.points,
      newBadges: newBadges.filter((b) => !user.badges.includes(b)),
    });
  } catch (error) {
    // Duplicate key = already checked in
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Already checked in today!',
        alreadyCheckedIn: true,
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET MY STATS
export const getMyStats = async (req, res) => {
  try {
    const today = getTodayIST();
    const userId = req.user.id;

    const user = await User.findById(userId).select(
      'name points streak longestStreak totalCheckIns badges lastCheckIn',
    );

    // Check if checked in today
    const checkedInToday = await CheckIn.findOne({ user: userId, date: today });

    // Recent check-in history (last 7 days)
    const recentCheckIns = await CheckIn.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(7)
      .select('date pointsEarned bonusReason streakAtCheckIn createdAt');

    res.status(200).json({
      success: true,
      stats: {
        points: user.points,
        streak: user.streak,
        longestStreak: user.longestStreak,
        totalCheckIns: user.totalCheckIns,
        badges: user.badges,
        checkedInToday: !!checkedInToday,
        lastCheckIn: user.lastCheckIn,
        recentCheckIns,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// LEADERBOARD
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({
      role: 'member',
      isActive: true,
      points: { $gt: 0 },
    })
      .select('name points streak longestStreak totalCheckIns badges')
      .sort({ points: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN: AWARD POINTS
export const awardPoints = async (req, res) => {
  try {
    const { memberId, points, reason } = req.body;

    if (!memberId || !points || !reason) {
      return res.status(400).json({
        success: false,
        message: 'memberId, points, and reason are required',
      });
    }

    const user = await User.findByIdAndUpdate(
      memberId,
      { $inc: { points } },
      { returnDocument: 'after' },
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Member not found' });
    }

    res.status(200).json({
      success: true,
      message: `Awarded ${points} points to ${user.name} for: ${reason}`,
      newTotal: user.points,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
