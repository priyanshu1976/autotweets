import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cron from 'node-cron'
import generateDevTweets from './db/utils'
import tweetsRouter from './routes/tweets.route'
import authRoutes from './routes/auth.route'
import { deletePostedTweets } from './controllers/tweet.controller'
import cookieParser from 'cookie-parser'
import { geminiAPI } from './db/utils'
import postAllTweets from './db/posttweet'
import profileRoutes from './routes/profile.route'
import path from 'path'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieParser())

app.use('/api/tweets', tweetsRouter)
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)

// todo schedule cron to create tweet in 10am in the morning
cron.schedule('0 10 * * *', async () => {
  console.log('Running scheduled tweet generation at 10 AM')
  await generateDevTweets()
})

// todo post cron to create tweet in 5pm in the morning
cron.schedule('0 17 * * *', async () => {
  console.log('posting scheduled tweet generation at 5 pm')
  await postAllTweets()
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
