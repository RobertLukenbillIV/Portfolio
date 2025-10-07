// Cookie configuration utilities for JWT authentication
// Handles secure cookie settings for both development and production environments
// Critical for cross-origin authentication between Vercel frontend and Render backend

import type { Request } from 'express'
import type { CookieOptions } from 'express'

// Cookie name for storing JWT token (configurable via environment)
export const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'token'

// Generate cookie options based on environment and security requirements
// Called by: controllers/auth.controller.ts for login/logout operations
export function cookieOptions(_req: Request): CookieOptions {
  const isProd = process.env.NODE_ENV === 'production'

  // Production requires 'none' for cross-origin (Vercel <-> Render)
  // Development uses 'lax' for same-origin requests
  const sameSite: CookieOptions['sameSite'] = isProd ? 'none' : 'lax'

  const opts: CookieOptions = {
    httpOnly: true,     // Prevent JavaScript access (XSS protection)
    secure: isProd,     // HTTPS only in production (required for sameSite: 'none')
    sameSite,          // CSRF protection and cross-origin handling
    path: '/',         // Available to all routes
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  }

  return opts
}
