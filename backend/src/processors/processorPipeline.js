const Activity = require('../models/Activity');
const SkillSnapshot = require('../models/SkillSnapshot');

async function processorPipeline(userId, rawActivities) {
  try {
    // rawActivities = array of GitHub/LeetCode activity objects
    // backend is responsible for fetching data & passing it here

    // STEP 1 — insert raw activities into DB
    for (const act of rawActivities) {
      await Activity.findOneAndUpdate(
        { provider: act.provider, providerEventId: act.providerEventId },
        {
          $set: {
            userId,
            provider: act.provider,
            providerEventId: act.providerEventId,
            type: act.type,
            timestamp: act.timestamp,
            metadata: act.metadata
          }
        },
        { upsert: true }
      );
    }

    // STEP 2 — re-score all user activities
    const activities = await Activity.find({ userId });

    let totalScore = 0;
    const perSkillScores = {};
    const perProviderStats = {
      github: { commits: 0, prsMerged: 0, reposContributed: 0 },
      leetcode: { solvedTotal: 0, solvedEasy: 0, solvedMedium: 0, solvedHard: 0 }
    };

    const repoSet = new Set();

    for (const act of activities) {
      let score = 0;
      let skillTags = [];

      if (act.provider === "GITHUB") {
        const lines = (act.metadata.addedLines || 0) - (act.metadata.deletedLines || 0);
        score = Math.max(1, Math.min(20, Math.floor(lines / 10)));
        skillTags.push("github");
        if (act.metadata.languages?.includes("Python")) skillTags.push("python");

        if (act.type === "COMMIT") perProviderStats.github.commits++;
        if (act.metadata.repoName) repoSet.add(act.metadata.repoName);
      }

      if (act.provider === "LEETCODE") {
        score =
          act.metadata.difficulty === "HARD" ? 10 :
          act.metadata.difficulty === "MEDIUM" ? 6 : 3;
        skillTags.push("dsa");

        perProviderStats.leetcode.solvedTotal++;
        if (act.metadata.difficulty === "EASY") perProviderStats.leetcode.solvedEasy++;
        if (act.metadata.difficulty === "MEDIUM") perProviderStats.leetcode.solvedMedium++;
        if (act.metadata.difficulty === "HARD") perProviderStats.leetcode.solvedHard++;
      }

      totalScore += score;
      skillTags.forEach((tag) => {
        perSkillScores[tag] = (perSkillScores[tag] || 0) + score;
      });
    }

    perProviderStats.github.reposContributed = repoSet.size;

    // STEP 3 — update snapshot
    await SkillSnapshot.findOneAndUpdate(
      { userId },
      {
        $set: {
          totalScore,
          perSkillScores,
          perProviderStats,
          lastCalculatedAt: new Date()
        }
      },
      { upsert: true }
    );

    return { success: true };
  } catch (error) {
    console.error("ProcessorPipeline error:", error);
    return { success: false, error: error.message };
  }
}

module.exports = processorPipeline;
