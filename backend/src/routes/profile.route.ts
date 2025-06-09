import express from 'express'
import { protectRoute } from '../middleware/auth.middleware'
import {
  updateSettings,
  fetchUserSettings,
} from '../controllers/profile.controller'

const router = express.Router()

//@ts-ignore
router.post('/setting', protectRoute, updateSettings)
//@ts-ignore
router.get('/setting', protectRoute, fetchUserSettings)

export default router
