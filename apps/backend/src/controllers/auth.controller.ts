// Authentication controller - handles login, logout, and user info endpoints
// Implements JWT-based authentication with httpOnly cookies for security
// Connected to: services/auth.service.ts, utils/cookie.ts, middleware/auth.ts

import { Request, Response } from 'express'
import { login as svcLogin } from '../services/auth.service' // Business logic for authentication
import { COOKIE_NAME, cookieOptions } from '../utils/cookie'  // Cookie configuration
import type { AuthRequest } from '../middleware/auth'          // Type for authenticated requests

// POST /api/auth/login - Authenticate user and set JWT cookie
// Called by: frontend Login component when user submits credentials
// Returns: user info (password excluded) and sets httpOnly cookie
export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string }
  
  // Delegate authentication logic to service layer
  const { user, token } = await svcLogin(email, password)

  // Set JWT as httpOnly cookie (more secure than localStorage)
  // Cookie options handle secure/sameSite settings based on environment
  res.cookie(COOKIE_NAME, token, cookieOptions(req))
  res.json({ user }) // Return user info to frontend
}

// GET /api/auth/me - Get current user info from JWT
// Protected by requireAuth middleware in routes/auth.routes.ts
// Used by: frontend AuthContext to check authentication status
export async function me(req: AuthRequest, res: Response) {
  if (!req.user) return res.sendStatus(401)
  res.json(req.user) // User attached by attachUser middleware
}

// POST /api/auth/logout - Clear JWT cookie and end session
// Called by: frontend Navbar logout button
export function logout(req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, cookieOptions(req))
  res.sendStatus(204) // No content response
}
