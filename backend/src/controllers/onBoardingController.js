const User = require("../models/User");

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
};

exports.updateStep1 = async (req, res) => {
  const { name, phone } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = name || user.name;
  user.phone = phone || user.phone;
  user.isOnboardedStep1 = true;

  await user.save();
  res.json({ user });
};

exports.updateStep2 = async (req, res) => {
  const { leetcodeHandle } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (leetcodeHandle) {
    user.leetcodeUsername = leetcodeHandle;
    user.profile = user.profile || {};
    user.profile.links = user.profile.links || {};
    user.profile.links.leetcode = leetcodeHandle;
  }

  user.isOnboardedStep2 = true;
  user.isOnboarded = true;

  await user.save();
  res.json({ user });
};
