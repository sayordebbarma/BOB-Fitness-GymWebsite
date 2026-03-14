import crypto from 'crypto';
import razorpay from '../utils/razorpay.js';
import Membership from '../models/Membership.js';
import User from '../models/User.js';

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { membershipId } = req.body;

    const membership = await Membership.findById(membershipId);
    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership plan not found'
      });
    }

    // Razorpay amount is in paise (1 INR = 100 paise)
    const order = await razorpay.orders.create({
      amount: membership.price * 100,
      currency: 'INR',
      receipt: `receipt_${req.user.id}_${Date.now()}`,
      notes: {
        userId: req.user.id,
        membershipId: membership._id.toString(),
        membershipName: membership.name,
      }
    });

    res.status(200).json({
      success: true,
      order,
      membership: {
        name: membership.name,
        price: membership.price,
      },
      user: {
        name: req.user.name,
        email: req.user.email,
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      membershipId,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed — invalid signature'
      });
    }

    // Signature valid, activate membership
    const membership = await Membership.findById(membershipId);
    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership not found'
      });
    }

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + membership.duration);

    await User.findByIdAndUpdate(req.user.id, {
      membershipPlan: membershipId,
      membershipExpiry: expiry,
      membershipStatus: 'active',
      $inc: { points: 50 },
    });

    res.status(200).json({
      success: true,
      message: `${membership.name} membership activated successfully!`,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};