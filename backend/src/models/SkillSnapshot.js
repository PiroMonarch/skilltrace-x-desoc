const mongoose = require('mongoose');

const skillSnapshotSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    totalScore: { type: Number, default: 0 },
    perSkillScores: {
      type: Map,
      of: Number,
      default: {},
    },
    perProviderStats: {
      github: {
        commits: { type: Number, default: 0 },
        prsMerged: { type: Number, default: 0 },
        reposContributed: { type: Number, default: 0 },
      },
      leetcode: {
        solvedTotal: { type: Number, default: 0 },
        solvedEasy: { type: Number, default: 0 },
        solvedMedium: { type: Number, default: 0 },
        solvedHard: { type: Number, default: 0 },
        lastSolvedAt: Date,
      },
    },
    lastCalculatedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('SkillSnapshot', skillSnapshotSchema);
