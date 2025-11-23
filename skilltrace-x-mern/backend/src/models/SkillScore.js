import mongoose from 'mongoose'

const skillScoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  githubUsername: {
    type: String,
    required: true
  },
  overallScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  grade: {
    type: String,
    enum: ['S', 'A', 'B', 'C', 'D']
  },
  breakdown: {
    commits: Number,
    consistency: Number,
    languages: Number,
    quality: Number
  },
  stats: {
    totalCommits: Number,
    activeDays: Number,
    repoCount: Number,
    stars: Number,
    languages: [{
      name: String,
      percentage: Number
    }]
  },
  blockchainTxHash: String,
  isBlockchainVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export default mongoose.model('SkillScore', skillScoreSchema)
