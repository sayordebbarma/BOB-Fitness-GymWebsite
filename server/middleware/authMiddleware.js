import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// PROTECT - must be logged in
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token)
      return res
        .status(401)
        .json({ success: false, message: 'Not authorized, please log in' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user)
      return res
        .status(401)
        .json({ success: false, message: 'User no longer exists' });

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: 'Token invalid or expired' });
  }
};

// REQUIRE ROLE - restrict to specific roles
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`,
      });
    }
    next();
  };
};
