import jwt from 'jsonwebtoken'
import { Response } from 'express'

export const generateToken = (userId: string, res: Response): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })

  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  })

  return token
}
