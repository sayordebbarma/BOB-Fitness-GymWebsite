import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: 'Email already registered' });

    const user = await User.create({
      name,
      email,
      password,
      role,
      ...(role !== 'admin' && { points: 20, badges: ['welcome'] }),
    });

    generateToken(res, user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: 'Please provide email and password' });

    const user = await User.findOne({ email }).select('+password');
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });

    generateToken(res, user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// GET CURRENT USER
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      'membershipPlan',
      'name price features duration',
    );
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
