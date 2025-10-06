// apps/backend/src/lib/db.ts
import { PrismaClient } from '@prisma/client'

// create one Prisma client for the whole process
export const prisma = new PrismaClient()
