import express from 'express'
import {
  postScheduledTweets,
  scheduleTweets,
} from '../controllers/tweet.controller'

const router = express.Router()

//@ts-ignore
router.post('/getScheduleTweets', scheduleTweets)

//@ts-ignore
router.post('/postScheduledTweets', postScheduledTweets)

export default router
