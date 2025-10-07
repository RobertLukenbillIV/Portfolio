import { Request, Response } from 'express'
import { login as svcLogin, getUserFromToken } from '../services/auth.service'
import { COOKIE_NAME, cookieOptions } from '../utils/cookie'

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string }
  const { user, token } = await svcLogin(email, password)

  // 👇 Set the cookie here (controller layer)
  res.cookie(COOKIE_NAME, token, cookieOptions(req))
  res.json({ user })
}

export async function me(req: Request, res: Response) {
  const token = req.cookies?.[COOKIE_NAME]
  if (!token) return res.sendStatus(401)
  const user = await getUserFromToken(token)
  if (!user) return res.sendStatus(401)
  res.json({ user })
}

export function logout(req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, cookieOptions(req))
  res.sendStatus(204)
}
