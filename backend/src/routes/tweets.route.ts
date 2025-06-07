import express from 'express'
import {
  postScheduledTweets,
  scheduleTweets,
  setPrompt,
} from '../controllers/tweet.controller'
import { protectRoute } from '../middleware/auth.middleware'

const router = express.Router()

//@ts-ignore
router.post('/getScheduleTweets', scheduleTweets)

//@ts-ignore
router.post('/postScheduledTweets', postScheduledTweets)

//@ts-ignore
router.post('/setprompt', protectRoute, setPrompt)

export default router
