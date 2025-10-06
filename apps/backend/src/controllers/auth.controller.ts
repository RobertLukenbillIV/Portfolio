import { Request, Response } from 'express'
import { prisma } from '../lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { AuthRequest } from '../middleware/auth'

const isProd = process.env.NODE_ENV === 'production'

export async function login(req: Request, res: Response) {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

  const token = jwt.sign(
    { sub: user.id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  )

  // ✅ set the login cookie here
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,                         // required with SameSite=None on HTTPS
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 3600 * 1000,
    // If you later use a custom domain for both API & app, you can optionally set:
    // domain: '.yourdomain.com',
    // path: '/', // default
  })

  return res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role }
  })
}

export function logout(_req: Request, res: Response) {
  // ✅ clear cookie on logout (repeat same flags you used when setting it)
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    // domain: '.yourdomain.com', // if you set it on login, set it here too
  })
  res.status(204).end()
}

export function me(req: AuthRequest, res: Response) {
  res.json({ user: req.user })
}
