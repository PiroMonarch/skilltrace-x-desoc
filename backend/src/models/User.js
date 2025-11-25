const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String }, // <-- allow null for GitHub-only users
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, index: true },
    phone: { type: String },
    role: {
      type: String,
      enum: ["DEVELOPER", "RECRUITER", "ADMIN"],
      default: "DEVELOPER",
    },
    avatarUrl: { type: String },

    // 🔥 Onboarding flags
    isOnboardedStep1: { type: Boolean, default: false },
    isOnboarded: { type: Boolean, default: false },

    // 🔗 External identities
    githubUsername: { type: String, unique: true, sparse: true },
    github_access_token: { type: String, select: false },

    leetcodeHandle: { type: String },
    resumeUrl: { type: String },

    // Optional structured profile
    profile: {
      avatar: String,
      links: {
        github: String,
        leetcode: String,
      },
    },

    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (plain) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.statics.hashPassword = async function (plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

module.exports = mongoose.model("User", userSchema);
