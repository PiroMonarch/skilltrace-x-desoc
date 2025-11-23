import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import githubRoutes from './routes/github.js'
import userRoutes from './routes/user.js'
import verificationRoutes from './routes/verification.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/github', githubRoutes)
app.use('/api/users', userRoutes)
app.use('/api/verify', verificationRoutes)

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'SkillTrace API running',
    timestamp: new Date().toISOString()
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 Health: http://localhost:${PORT}/health`)
})
