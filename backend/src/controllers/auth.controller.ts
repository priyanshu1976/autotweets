import { PrismaClient } from '@prisma/client'
import { generateToken } from '../lib/utils'
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser)
      return res.status(400).json({ message: 'Email already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        Password: hashedPassword,
      },
    })

    generateToken(newUser.id, res)

    return res.status(201).json({
      _id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log('Error in signup controller:', error.message)
    }
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const isPasswordCorrect = await bcrypt.compare(password, user.Password)
    if (!isPasswordCorrect)
      return res.status(400).json({ message: 'Invalid credentials' })

    generateToken(user.id, res)

    return res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log('Error in login controller:', error.message)
    }
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const logout = (req: Request, res: Response) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 })
    return res.status(200).json({ message: 'Logged out successfully' })
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log('Error in logout controller:', error.message)
    }
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const checkAuth = (req: Request, res: Response) => {
  try {
    //@ts-ignore
    return res.status(200).json(req.user)
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log('Error in checkAuth controller:', error.message)
    }
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
