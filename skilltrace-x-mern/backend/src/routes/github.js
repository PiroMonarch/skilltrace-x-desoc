import express from 'express'
import { fetchGitHubStats } from '../utils/githubService.js'
import { calculateScore } from '../utils/scoreCalculator.js'
import User from '../models/User.js'
import SkillScore from '../models/SkillScore.js'

const router = express.Router()

router.get('/stats/:username', async (req, res) => {
  try {
    const { username } = req.params
    
    const githubData = await fetchGitHubStats(username)
    const score = calculateScore(githubData.stats)

    let user = await User.findOne({ githubUsername: username.toLowerCase() })
    
    if (!user) {
      user = await User.create({
        githubUsername: username.toLowerCase(),
        githubId: githubData.user.githubId,
        name: githubData.user.name,
        avatar: githubData.user.avatar,
        bio: githubData.user.bio
      })
    }

    const skillScore = await SkillScore.create({
      user: user._id,
      githubUsername: username.toLowerCase(),
      overallScore: score.overallScore,
      grade: score.grade,
      breakdown: score.breakdown,
      stats: githubData.stats
    })

    res.json({
      user: githubData.user,
      stats: githubData.stats,
      score,
      scoreId: skillScore._id
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
