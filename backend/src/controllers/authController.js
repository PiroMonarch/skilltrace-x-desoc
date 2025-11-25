const User = require('../models/User');
const DeveloperProfile = require('../models/DeveloperProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const { signToken } = require('../utils/jwt');

exports.signup = async (req, res, next) => {
  try {
    const { email, password, name, username, phone, role } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ message: 'Email or username already used' });
    }

    const passwordHash = await User.hashPassword(password);

    const user = await User.create({
      email,
      passwordHash,
      name,
      username,
      phone,
      role: role === 'RECRUITER' ? 'RECRUITER' : 'DEVELOPER',
    });

    if (user.role === 'DEVELOPER') {
      await DeveloperProfile.create({ userId: user._id });
    } else if (user.role === 'RECRUITER') {
      await RecruiterProfile.create({ userId: user._id });
    }

    const token = signToken({ userId: user._id, role: user.role });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      $or: [{ email }, { username: email }],
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken({ userId: user._id, role: user.role });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json({ user });
  } catch (err) {
    next(err);
  }
};
