const RecruiterProfile = require('../models/RecruiterProfile');
const SkillSnapshot = require('../models/SkillSnapshot');
const DeveloperProfile = require('../models/DeveloperProfile');
const User = require('../models/User');

exports.getMyProfile = async (req, res, next) => {
  try {
    const profile = await RecruiterProfile.findOne({ userId: req.user.id });
    res.json({ profile });
  } catch (err) {
    next(err);
  }
};

exports.updateMyProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const profile = await RecruiterProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updates },
      { new: true }
    );
    res.json({ profile });
  } catch (err) {
    next(err);
  }
};

// basic search by skills + minScore
exports.searchDevelopers = async (req, res, next) => {
  try {
    const { skills = [], minTotalScore = 0 } = req.body;

    const snapshotQuery = {
      totalScore: { $gte: minTotalScore },
    };

    if (skills.length > 0) {
      // At least one of the skills has some score
      snapshotQuery[`perSkillScores.${skills[0]}`] = { $gt: 0 };
      // you can improve this to $or for multiple skills
    }

    const snapshots = await SkillSnapshot.find(snapshotQuery).limit(50);
    const userIds = snapshots.map((s) => s.userId);

    const devProfiles = await DeveloperProfile.find({
      userId: { $in: userIds },
      'visibility.profilePublic': true,
    });

    const users = await User.find({ _id: { $in: userIds } }).select(
      '_id username name'
    );

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const results = devProfiles.map((p) => {
      const uid = p.userId.toString();
      const snapshot = snapshots.find((s) => s.userId.toString() === uid);
      const user = userMap.get(uid);
      return {
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
        },
        profile: p,
        snapshot,
      };
    });

    res.json({ results });
  } catch (err) {
    next(err);
  }
};
