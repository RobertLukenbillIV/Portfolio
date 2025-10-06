/// <reference types="node" />
import 'dotenv/config'
import { PrismaClient, Role } from '@prisma/client'
// @ts-expect-error
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function must(name: string) {
  const v = process.env[name]
  if (!v) throw new Error(`Missing required env: ${name}`)
  return v
}

async function main() {
  const isProd = process.env.NODE_ENV === 'production'

  // In prod, require explicit opt-in
  if (isProd && process.env.ALLOW_SEED !== 'true') {
    throw new Error('Refusing to seed in production without ALLOW_SEED=true')
  }

  // In dev you can keep defaults; in prod require explicit values
  const email =
    !isProd ? (process.env.SEED_ADMIN_EMAIL || 'admin@example.com')
            : must('SEED_ADMIN_EMAIL')

  const password =
    !isProd ? (process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!')
            : must('SEED_ADMIN_PASSWORD')

  if (password.length < 12) {
    throw new Error('SEED_ADMIN_PASSWORD must be at least 12 characters')
  }

  const hashed = await bcrypt.hash(password, 10)

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    // choose behavior; here we promote + update password only if explicitly allowed
    if (process.env.ALLOW_SEED_UPDATE === 'true') {
      await prisma.user.update({
        where: { email },
        data: { role: Role.ADMIN, password: hashed },
      })
      console.log(`Updated existing admin: ${email}`)
    } else {
      console.log(`User exists, no changes: ${email}`)
    }
  } else {
    await prisma.user.create({
      data: { email, password: hashed, role: Role.ADMIN, name: 'Admin' },
    })
    console.log(`Created admin: ${email}`)
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
