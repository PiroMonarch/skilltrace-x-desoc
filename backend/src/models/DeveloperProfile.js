const mongoose = require('mongoose');

const developerProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    headline: String,
    bio: String,
    location: String,
    yearsOfExperience: Number,
    skills: [String],
    visibility: {
      profilePublic: { type: Boolean, default: true },
      activityPublic: { type: Boolean, default: true },
      scoresPublic: { type: Boolean, default: true },
    },
    links: {
      github: String,
      leetcode: String,
      linkedin: String,
      portfolio: String,
      blog: String,
    },
    resumeFileUrl: String, // optional for now
    parsedResume: {
      education: [
        {
          institution: String,
          degree: String,
          startYear: Number,
          endYear: Number,
        },
      ],
      experiences: [
        {
          company: String,
          role: String,
          startDate: Date,
          endDate: Date,
          description: String,
        },
      ],
      projects: [
        {
          name: String,
          description: String,
          link: String,
        },
      ],
      skills: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DeveloperProfile', developerProfileSchema);
