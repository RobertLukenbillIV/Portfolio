// @ts-nocheck
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

/** Usage: pnpm run change-password you@example.com "NewStrongPass!" */
async function main() {
  const [,, email, password] = process.argv
  if (!email || !password) {
    console.error('Usage: pnpm run change-password <email> <password>')
    process.exit(1)
  }
  if (password.length < 12) {
    console.error('Password must be at least 12 characters.')
    process.exit(1)
  }
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.error('No user found with', email)
    process.exit(1)
  }
  const hashed = await bcrypt.hash(password, 10)
  await prisma.user.update({ where: { email }, data: { password: hashed } })
  console.log('Password updated for', email)
}
main().finally(() => prisma.$disconnect())
