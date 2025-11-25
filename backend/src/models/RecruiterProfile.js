const mongoose = require('mongoose');

const recruiterProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    companyName: String,
    companyWebsite: String,
    position: String,
    preferences: {
      techStacks: [String],
      locations: [String],
      minExperience: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RecruiterProfile', recruiterProfileSchema);
