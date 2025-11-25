import express from 'express'
import SkillScore from '../models/SkillScore.js'
import User from '../models/User.js'

const router = express.Router()

router.post('/blockchain', async (req, res) => {
  try {
    const { scoreId, txHash, walletAddress } = req.body

    const skillScore = await SkillScore.findByIdAndUpdate(
      scoreId,
      {
        blockchainTxHash: txHash,
        isBlockchainVerified: true
      },
      { new: true }
    )

    await User.findByIdAndUpdate(skillScore.user, {
      isVerified: true,
      lastVerifiedAt: new Date(),
      walletAddress: walletAddress.toLowerCase(),
      $inc: { totalVerifications: 1 }
    })

    res.json({ 
      message: 'Verification recorded',
      skillScore 
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
