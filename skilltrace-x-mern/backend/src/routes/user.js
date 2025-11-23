import express from 'express'
import User from '../models/User.js'
import SkillScore from '../models/SkillScore.js'

const router = express.Router()

router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ 
      githubUsername: req.params.username.toLowerCase() 
    })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const latestScore = await SkillScore.findOne({ user: user._id })
      .sort({ createdAt: -1 })

    res.json({ user, latestScore })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.patch('/:username/wallet', async (req, res) => {
  try {
    const { walletAddress } = req.body
    
    const user = await User.findOneAndUpdate(
      { githubUsername: req.params.username.toLowerCase() },
      { walletAddress: walletAddress.toLowerCase() },
      { new: true }
    )

    res.json({ user })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
