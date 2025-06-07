import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { Request, Response, NextFunction } from 'express'

const prisma = new PrismaClient()

interface JwtPayload {
  userId: string
}

interface RequestWithUser extends Request {
  user?: any
}

export const protectRoute = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized - No Token Provided' })
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: 'Unauthorized - Invalid Token' })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    req.user = user
    next()
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in protectRoute middleware:', error.message)
    }
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
