const DeveloperProfile = require('../models/DeveloperProfile');
const SkillSnapshot = require('../models/SkillSnapshot');
const User = require('../models/User');

exports.getMyProfile = async (req, res, next) => {
  try {
    const profile = await DeveloperProfile.findOne({ userId: req.user.id });
    res.json({ profile });
  } catch (err) {
    next(err);
  }
};

exports.updateMyProfile = async (req, res, next) => {
  try {
    const updates = req.body; // validate in real app
    const profile = await DeveloperProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updates },
      { new: true }
    );
    res.json({ profile });
  } catch (err) {
    next(err);
  }
};

exports.getMySkillSnapshot = async (req, res, next) => {
  try {
    const snapshot = await SkillSnapshot.findOne({ userId: req.user.id });
    res.json({ snapshot });
  } catch (err) {
    next(err);
  }
};

// public profile by username (for recruiters / shared links)
exports.getPublicProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const profile = await DeveloperProfile.findOne({ userId: user._id });
    if (!profile || !profile.visibility.profilePublic) {
      return res.status(404).json({ message: 'Profile not public' });
    }

    const snapshot = await SkillSnapshot.findOne({ userId: user._id });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
      },
      profile,
      snapshot: profile.visibility.scoresPublic ? snapshot : null,
    });
  } catch (err) {
    next(err);
  }
};
