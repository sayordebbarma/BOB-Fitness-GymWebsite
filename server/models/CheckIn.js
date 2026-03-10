import mongoose from 'mongoose';

const checkInSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    pointsEarned: {
      type: Number,
      default: 10,
    },
    bonusReason: {
      type: String, // '7-day streak bonus'
      default: null,
    },
    streakAtCheckIn: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);

// One check-in per user/day
checkInSchema.index({ user: 1, date: 1 }, { unique: true });

const CheckIn = mongoose.model('CheckIn', checkInSchema);
export default CheckIn;
