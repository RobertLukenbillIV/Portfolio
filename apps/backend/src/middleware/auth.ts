import type { NextFunction, Response } from 'express'
import type { Request } from 'express'
import type { Role } from '@prisma/client'
import { COOKIE_NAME } from '../utils/cookie'
import { verifyToken } from '../services/auth.service'

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: Role; name?: string | null }
}

export function attachUser(req: AuthRequest, _res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME]
  if (token) {
    try {
      const p = verifyToken(token)
      req.user = { id: p.sub, email: p.email, role: p.role }
    } catch { /* ignore invalid token */ }
  }
  next()
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) return res.sendStatus(401)
  next()
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'ADMIN') return res.sendStatus(403)
  next()
}
