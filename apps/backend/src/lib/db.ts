// Database configuration and Prisma client initialization
// Provides a single Prisma client instance for the entire application
// Connected to: PostgreSQL database (Neon DB in production)
// Used by: all controllers, services, and repositories for database operations

import { PrismaClient } from '@prisma/client'

// Single Prisma client instance for the entire application
// Reused across all database operations to optimize connection pooling
// Connects to DATABASE_URL environment variable (PostgreSQL connection string)
export const prisma = new PrismaClient()
