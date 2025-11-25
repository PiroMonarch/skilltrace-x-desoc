const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const token = header.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid user' });
    }

    req.user = { id: user._id, role: user.role };
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

module.exports = { requireAuth, requireRole };
