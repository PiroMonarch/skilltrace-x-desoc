import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  githubUsername: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  githubId: String,
  name: String,
  email: String,
  avatar: String,
  bio: String,
  walletAddress: {
    type: String,
    lowercase: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastVerifiedAt: Date,
  totalVerifications: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

export default mongoose.model('User', userSchema)
