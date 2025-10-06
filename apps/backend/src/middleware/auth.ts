import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthUser { id: string; role: 'ADMIN' | 'USER'; email: string; name?: string | null }
export interface AuthRequest extends Request { user?: AuthUser }

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token
  if (!token) return res.sendStatus(401)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any
    req.user = { id: payload.sub, role: payload.role, email: payload.email, name: payload.name }
    next()
  } catch {
    res.sendStatus(401)
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'ADMIN') return res.sendStatus(403)
  next()
}