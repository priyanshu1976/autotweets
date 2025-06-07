import express from 'express'
import {
  checkAuth,
  login,
  logout,
  signup,
} from '../controllers/auth.controller'
import { protectRoute } from '../middleware/auth.middleware'

const router = express.Router()

//@ts-ignore
router.post('/signup', signup)
//@ts-ignore
router.post('/login', login)
//@ts-ignore
router.post('/logout', logout)

//@ts-ignore
router.get('/check', protectRoute, checkAuth)

export default router
