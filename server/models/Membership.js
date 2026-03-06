import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Membership name is required'],
    enum: ['Basic', 'Pro', 'Elite'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  duration: {
    type: Number,
    required: true,
    default: 30,
  },
  features: [String],
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

const Membership = mongoose.model('Membership', membershipSchema);
export default Membership;