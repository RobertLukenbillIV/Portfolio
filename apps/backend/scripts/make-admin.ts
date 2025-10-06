// @ts-nocheck
import 'dotenv/config'
import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

/**
 * Usage:
 * pnpm run make-admin you@example.com "StrongPass123!" "Optional Name"
 */
async function main() {
  const [,, email, password, name] = process.argv
  if (!email || !password) {
    console.error('Usage: pnpm run make-admin <email> <password> [name]')
    process.exit(1)
  }
  if (password.length < 12) {
    console.error('Password must be at least 12 characters.')
    process.exit(1)
  }

  const hashed = await bcrypt.hash(password, 10)
  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    const user = await prisma.user.update({
      where: { email },
      data: { role: Role.ADMIN, password: hashed, name: name ?? existing.name }
    })
    console.log('Promoted/updated admin:', user.email)
  } else {
    const user = await prisma.user.create({
      data: { email, password: hashed, name: name ?? null, role: Role.ADMIN }
    })
    console.log('Created admin:', user.email)
  }
}

main().finally(() => prisma.$disconnect())
