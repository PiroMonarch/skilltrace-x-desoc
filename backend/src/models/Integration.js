const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    provider: { type: String, enum: ['GITHUB', 'LEETCODE'], required: true },
    username: { type: String, required: true },
    oauthToken: { type: String }, // if you do OAuth; keep encrypted if real
    status: {
      type: String,
      enum: ['CONNECTED', 'DISCONNECTED', 'ERROR'],
      default: 'CONNECTED',
    },
    lastSyncedAt: { type: Date },
    errorMessage: String,
  },
  { timestamps: true }
);

integrationSchema.index({ userId: 1, provider: 1 }, { unique: true });

module.exports = mongoose.model('Integration', integrationSchema);
