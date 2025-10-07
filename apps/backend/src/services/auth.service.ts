// apps/backend/src/services/auth.service.ts
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/db'
import type { Role } from '@prisma/client'

export type AuthTokenPayload = { sub: string; role: Role; email: string }

const JWT_SECRET: Secret = process.env.JWT_SECRET as string
if (!JWT_SECRET) throw new Error('Missing JWT_SECRET')

// Accept "7d", "1h", etc. or a number; cast exactly to the SignOptions property type
const EXPIRES_ENV = process.env.JWT_EXPIRES ?? '7d'
const signOptions: SignOptions = {
  expiresIn: EXPIRES_ENV as unknown as SignOptions['expiresIn'],
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('INVALID_CREDENTIALS')

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) throw new Error('INVALID_CREDENTIALS')

  const payload: AuthTokenPayload = { sub: user.id, role: user.role, email: user.email }
  const token = jwt.sign(payload, JWT_SECRET, signOptions)

  const { password: _pw, ...safe } = user
  return { user: safe, token }
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload
}
