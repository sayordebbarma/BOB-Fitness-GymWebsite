import Membership from '../models/Membership.js';
import User from '../models/User.js';

// GET ALL PLANS (public) 
export const getMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find({ isActive: true });
    res.status(200).json({ success: true, memberships });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE PLAN 
export const getMembership = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);
    if (!membership) {
      return res.status(404).json({ success: false, message: 'Membership plan not found' });
    }
    res.status(200).json({ success: true, membership });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// SUBSCRIBE TO A PLAN (member) 
export const subscribeMembership = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);
    if (!membership) {
      return res.status(404).json({ success: false, message: 'Membership plan not found' });
    }

    // Calculate expiry date
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + membership.duration);

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        membershipPlan: membership._id,
        membershipExpiry: expiry,
        membershipStatus: 'active',
      },
      { new: true }
    ).populate('membershipPlan');

    res.status(200).json({
      success: true,
      message: `Subscribed to ${membership.name} plan`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN: CREATE PLAN 
export const createMembership = async (req, res) => {
  try {
    const membership = await Membership.create(req.body);
    res.status(201).json({ success: true, membership });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── ADMIN: DELETE PLAN ──────────────────────────────────
export const deleteMembership = async (req, res) => {
  try {
    await Membership.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(200).json({ success: true, message: 'Membership plan deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};