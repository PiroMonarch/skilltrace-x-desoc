const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    provider: { type: String, enum: ['GITHUB', 'LEETCODE'], required: true },
    providerEventId: { type: String, required: true },
    type: {
      type: String,
      enum: ['COMMIT', 'PR', 'ISSUE', 'LC_SOLVED'],
      required: true,
    },
    timestamp: { type: Date, index: true },
    metadata: {
      repoName: String,
      repoOwner: String,
      commitMessage: String,
      filesChanged: Number,
      addedLines: Number,
      deletedLines: Number,
      languages: [String],
      prMerged: Boolean,
      // LeetCode:
      problemSlug: String,
      difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'] },
      topics: [String],
    },
    processed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

activitySchema.index(
  { provider: 1, providerEventId: 1 },
  { unique: true }
);

module.exports = mongoose.model('Activity', activitySchema);
