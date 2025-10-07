// Authentication service - contains business logic for user authentication
// Handles password verification, JWT token generation and validation
// Connected to: lib/db.ts (Prisma), controllers/auth.controller.ts, middleware/auth.ts

import jwt, { type Secret, type SignOptions } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'                    // For password hashing/comparison
import { prisma } from '../lib/db'               // Database client
import type { Role } from '@prisma/client'       // Generated Prisma types

// JWT payload structure - contains user identification and role info
export type AuthTokenPayload = { sub: string; role: Role; email: string }

// JWT configuration - secret key from environment variables
const JWT_SECRET: Secret = process.env.JWT_SECRET as string
if (!JWT_SECRET) throw new Error('Missing JWT_SECRET')

// JWT expiration configuration (default 7 days)
// Supports human-readable format like "7d", "24h", "60m"
const EXPIRES_ENV = process.env.JWT_EXPIRES ?? '7d'
const signOptions: SignOptions = {
  expiresIn: EXPIRES_ENV as unknown as SignOptions['expiresIn'],
}

// Authenticate user with email and password
// Called by: controllers/auth.controller.ts login function
// Returns: user object (without password) and JWT token
export async function login(email: string, password: string) {
  // Find user by email in database
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('INVALID_CREDENTIALS')

  // Verify password against stored hash using bcrypt
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) throw new Error('INVALID_CREDENTIALS')

  // Create JWT payload with user identification info
  const payload: AuthTokenPayload = { sub: user.id, role: user.role, email: user.email }
  const token = jwt.sign(payload, JWT_SECRET, signOptions)

  // Return user without password field for security
  const { password: _pw, ...safe } = user
  return { user: safe, token }
}

// Verify and decode JWT token
// Called by: middleware/auth.ts attachUser function
// Returns: decoded payload with user info
// Throws: JWT verification errors if token is invalid/expired
export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload
}
