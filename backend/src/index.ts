import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cron from 'node-cron'
import generateDevTweets from './db/utils'
import tweetsRouter from './routes/tweets.route'
import {
  deletePostedTweets,
  postScheduledTweets,
} from './controllers/tweet.controller'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/tweets', tweetsRouter)

const hello = ''

cron.schedule('0 10 * * *', async () => {
  console.log('🕙 Generating morning tweets...')
  await generateDevTweets(5, 'morning')
  await postScheduledTweets()
  await deletePostedTweets()
})

// generateDevTweets(2, 'morning')
//postScheduledTweets()

cron.schedule('0 13 * * *', async () => {
  console.log('🕐 Generating afternoon tweets...')
  await generateDevTweets(5, 'afternoon')
  await postScheduledTweets()
  await deletePostedTweets()
})

cron.schedule('0 17 * * *', async () => {
  console.log('🕔 Generating evening tweets...')
  await generateDevTweets(5, 'evening')
  await postScheduledTweets()
  await deletePostedTweets()
})

cron.schedule('0 18 * * *', async () => {
  console.log('🕗 Generating night tweets...')
  await generateDevTweets(2, 'night')
  await postScheduledTweets()
  await deletePostedTweets()
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
