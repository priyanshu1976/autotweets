import express from 'express'
import {
  scheduleTweets,
  setPrompt,
  setToken,
  getPrompt,
} from '../controllers/tweet.controller'
import { protectRoute } from '../middleware/auth.middleware'

const router = express.Router()

//@ts-ignore
router.get('/getScheduleTweets', protectRoute, scheduleTweets)

//@ts-ignore
router.post('/setprompt', protectRoute, setPrompt)

//@ts-ignore
router.get('/getprompt', protectRoute, getPrompt)
//@ts-ignore
router.post('/tokentwitter', protectRoute, setToken)

export default router
