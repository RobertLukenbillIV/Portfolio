// apps/backend/src/utils/cookies.ts
import type { Request } from 'express'
import type { CookieOptions } from 'express'

export const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'token'

export function cookieOptions(_req: Request): CookieOptions {
  const isProd = process.env.NODE_ENV === 'production'

  // Narrow the literal type so TS knows it's not just `string`
  const sameSite: CookieOptions['sameSite'] = isProd ? 'none' : 'lax'

  const opts: CookieOptions = {
    httpOnly: true,
    secure: isProd,   // must be true when sameSite === 'none'
    sameSite,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  }

  return opts
}
