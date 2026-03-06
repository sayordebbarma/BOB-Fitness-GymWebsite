import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Membership from './models/Membership.js';
import User from './models/User.js';

dotenv.config();

const memberships = [
  {
    name: 'Basic',
    price: 1499,
    duration: 30,
    features: [
      'Access to gym floor',
      'Locker room access',
      'Free parking',
    ],
  },
  {
    name: 'Pro',
    price: 2999,
    duration: 30,
    features: [
      'Everything in Basic',
      'Unlimited group classes',
      'Access to sauna & pool',
      '1 free PT session/month',
    ],
  },
  {
    name: 'Elite',
    price: 5999,
    duration: 30,
    features: [
      'Everything in Pro',
      '4 PT sessions/month',
      'Nutrition consultation',
      'Priority booking',
      '24/7 gym access',
    ],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Clear existing
    await Membership.deleteMany();
    console.log('Old memberships cleared');

    // Insert fresh
    await Membership.insertMany(memberships);
    console.log('Memberships seeded');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();