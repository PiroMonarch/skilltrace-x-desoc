const path = require("path");
const fs = require("fs");
const User = require("../models/User");

exports.uploadResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  // For MVP, store local path; production → S3
  user.resumeUrl = `/uploads/resumes/${req.file.filename}`;
  await user.save();

  res.json({ user, resumeUrl: user.resumeUrl });
};
