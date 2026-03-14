import User from '../models/User.js';
import Membership from '../models/Membership.js';

// GET ALL MEMBERS
export const getAllMembers = async (req, res) => {
  try {
    const members = await User.find({ role: 'member' })
      .populate('membershipPlan', 'name price')
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE MEMBER
export const getMember = async (req, res) => {
  try {
    const member = await User.findById(req.params.id)
      .populate('membershipPlan', 'name price features')
      .select('-password');

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: 'Member not found' });
    }

    res.status(200).json({ success: true, member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE MEMBER
export const updateMember = async (req, res) => {
  try {
    // Prevent role escalation from this route
    const { password, ...updateData } = req.body;

    const member = await User.findByIdAndUpdate(req.params.id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    }).select('-password');

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: 'Member not found' });
    }

    res.status(200).json({ success: true, member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE MEMBER
export const deleteMember = async (req, res) => {
  try {
    const member = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: false } },
      { new: true }
    );

    if (!member)
      return res
        .status(404)
        .json({ success: false, message: 'Member not found' });

    res
      .status(200)
      .json({ success: true, message: 'Member deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DASHBOARD STATS
export const getDashboardStats = async (req, res) => {
  try {
    const totalMembers = await User.countDocuments({ role: 'member' });
    const activeMembers = await User.countDocuments({
      role: 'member',
      membershipStatus: 'active',
    });
    const expiredMembers = await User.countDocuments({
      role: 'member',
      membershipStatus: 'expired',
    });
    const noMembership = await User.countDocuments({
      role: 'member',
      membershipStatus: 'none',
    });

    // Members per plan breakdown
    const planBreakdown = await User.aggregate([
      { $match: { role: 'member', membershipStatus: 'active' } },
      { $group: { _id: '$membershipPlan', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'memberships',
          localField: '_id',
          foreignField: '_id',
          as: 'plan',
        },
      },
      { $unwind: { path: '$plan', preserveNullAndEmptyArrays: true } },
      { $project: { planName: '$plan.name', count: 1, _id: 0 } },
    ]);

    // New members in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newMembersThisMonth = await User.countDocuments({
      role: 'member',
      createdAt: { $gte: thirtyDaysAgo },
    });

    res.status(200).json({
      success: true,
      stats: {
        totalMembers,
        activeMembers,
        expiredMembers,
        noMembership,
        newMembersThisMonth,
        planBreakdown,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// MANUALLY ASSIGN MEMBERSHIP
export const assignMembership = async (req, res) => {
  try {
    const { membershipId } = req.body;

    const membership = await Membership.findById(membershipId);
    if (!membership) {
      return res
        .status(404)
        .json({ success: false, message: 'Membership plan not found' });
    }

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + membership.duration);

    const member = await User.findByIdAndUpdate(
      req.params.id,
      {
        membershipPlan: membershipId,
        membershipExpiry: expiry,
        membershipStatus: 'active',
      },
      { returnDocument: 'after' },
    ).populate('membershipPlan', 'name price');

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: 'Member not found' });
    }

    res.status(200).json({
      success: true,
      message: `${membership.name} plan assigned to ${member.name}`,
      member,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// REACTIVATE MEMBER
export const reactivateMember = async (req, res) => {
  try {
    const member = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { returnDocument: 'after' }
    );

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    res.status(200).json({ success: true, message: 'Member reactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
