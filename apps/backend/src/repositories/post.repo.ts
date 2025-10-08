// Post repository layer - handles direct database operations for posts
// Contains pure data access logic without business rules
// Connected to: services/post.service.ts, lib/db.ts (could use shared prisma instance)

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()                    // Local Prisma instance (could use shared from lib/db.ts)

// Fetch all posts ordered by creation date (newest first)
// Used by admin dashboard to manage all content
export const findAll = ()=> prisma.post.findMany({ 
  orderBy:{createdAt:'desc'} 
})

// Fetch only published posts for public consumption
// Used by Projects page and featured posts display
export const findPublic = ()=> prisma.post.findMany({ 
  where:{published:true}, 
  orderBy:{createdAt:'desc'} 
})

// Create new post with provided data
// Data includes: title, excerpt, content, coverUrl, authorId, published status
export const create = (data:any)=> prisma.post.create({ data })

// Update existing post with provided data
// Data can include: title, excerpt, content, coverUrl, published status
export const update = (id:string, data:any)=> prisma.post.update({ 
  where:{ id }, 
  data 
})

// Find individual post by ID for public viewing
// Returns published post or null if not found/unpublished
export const findByIdPublic = (id:string)=> prisma.post.findFirst({ 
  where:{ id, published:true } 
})

// Find individual post by ID for admin access
// Returns post regardless of published status
export const findById = (id:string)=> prisma.post.findUnique({ where:{ id } })

// Hard delete post by ID
// Consider implementing soft delete in the future for data recovery
export const remove = (id:string)=> prisma.post.delete({ where:{ id } })