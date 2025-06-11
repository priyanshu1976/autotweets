import jwt from 'jsonwebtoken'
import { Response } from 'express'
import crypto from 'crypto'
const algorithm = 'aes-256-cbc'
const secretKey = process.env.ENCRYPTION_SECRET_KEY! // 32 bytes
const iv = crypto.randomBytes(16) // 16 bytes IV
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

export const encrypt = (text: string) => {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export const decrypt = (text: string) => {
  const [ivHex, encryptedData] = text.split(':')
  const ivBuffer = Buffer.from(ivHex, 'hex')
  const encryptedBuffer = Buffer.from(encryptedData, 'hex')
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    ivBuffer
  )
  let decrypted = decipher.update(encryptedBuffer)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}
