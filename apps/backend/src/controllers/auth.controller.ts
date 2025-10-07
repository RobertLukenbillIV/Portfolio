import { Request, Response } from 'express'
import { login as svcLogin } from '../services/auth.service'
import { COOKIE_NAME, cookieOptions } from '../utils/cookie'
import type { AuthRequest } from '../middleware/auth'

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string }
  const { user, token } = await svcLogin(email, password)

  // 👇 Set the cookie here (controller layer)
  res.cookie(COOKIE_NAME, token, cookieOptions(req))
  res.json({ user })
}

export async function me(req: AuthRequest, res: Response) {
  if (!req.user) return res.sendStatus(401)
  res.json(req.user)
}

export function logout(req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, cookieOptions(req))
  res.sendStatus(204)
}
