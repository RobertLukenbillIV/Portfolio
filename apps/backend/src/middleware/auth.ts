// Authentication middleware for Express routes
// Handles JWT token verification and user attachment to requests
// Provides role-based access control for admin-only routes

import type { NextFunction, Response } from 'express'
import type { Request } from 'express'
import type { Role } from '@prisma/client'
import { COOKIE_NAME } from '../utils/cookie'        // Cookie configuration utilities
import { verifyToken } from '../services/auth.service' // JWT verification service

// Extended Request interface that includes user information
// Used throughout the app to access authenticated user data
export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: Role; name?: string | null }
}

// Middleware that runs on EVERY request to attach user info if JWT cookie exists
// This is non-blocking - requests continue even without valid tokens
// Connected to: utils/cookie.ts (COOKIE_NAME), services/auth.service.ts (verifyToken)
export function attachUser(req: AuthRequest, _res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME]
  if (token) {
    try {
      const p = verifyToken(token) // Verify and decode JWT
      req.user = { id: p.sub, email: p.email, role: p.role }
    } catch { 
      // Silently ignore invalid/expired tokens - user remains undefined
    }
  }
  next() // Always continue to next middleware
}

// Middleware for routes that require authentication
// Returns 401 Unauthorized if no user is attached to request
// Used by: most admin routes, user-specific operations
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) return res.sendStatus(401)
  next()
}

// Middleware for admin-only routes (content management, user management)
// Returns 403 Forbidden if user is not admin role
// Used by: admin dashboard, content editing, user management routes
export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'ADMIN') return res.sendStatus(403)
  next()
}
