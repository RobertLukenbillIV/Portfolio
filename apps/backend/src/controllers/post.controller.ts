// Post controller - handles blog posts and project portfolio items
// Manages CRUD operations, featuring system, and public/admin access control
// Connected to: services/post.service.ts, routes/posts.routes.ts, frontend Projects/Home components

import * as svc from '../services/post.service'      // Business logic layer
import { Request, Response } from 'express'
import { prisma } from '../lib/db'                    // Database client

// GET /api/posts - List all posts (admin only)
// Protected by requireAuth middleware in routes
// Called by: admin dashboard for content management
export async function list(_req:Request,res:Response){ 
  res.json(await svc.list()) 
}

// GET /api/posts/public - List published posts (public access)
// Called by: frontend Projects page to display portfolio items
export async function listPublic(_req:Request,res:Response){ 
  res.json(await svc.listPublic()) 
}

// POST /api/posts - Create new post
// Protected by requireAuth middleware - associates post with authenticated user
// Called by: frontend PostEditor component in create mode
export async function create(req:Request,res:Response){
  const user=(req as any).user                       // User attached by auth middleware
  const created = await svc.create({...req.body, authorId:user.id})
  res.status(201).json(created)
}

// GET /api/posts/:id - Get individual post (public access)
// No authentication required - only returns published posts
// Called by: frontend PostDetail component to display individual project
export async function getById(req:Request,res:Response){ 
  const post = await svc.getById(req.params.id)
  if (!post) return res.status(404).json({ error: 'Post not found' })
  res.json(post)
}

// GET /api/posts/:id/admin - Get individual post (admin access)
// Protected by requireAuth middleware - returns any post regardless of publish status
// Called by: admin PostEditor component when editing existing posts
export async function getByIdAdmin(req:Request,res:Response){ 
  const post = await svc.getByIdAdmin(req.params.id)
  if (!post) return res.status(404).json({ error: 'Post not found' })
  res.json(post)
}

// DELETE /api/posts/:id - Remove post
// Protected by requireAuth middleware in routes
// Called by: admin dashboard delete functionality
export async function remove(req:Request,res:Response){ 
  await svc.remove(req.params.id)
  res.status(204).end()                              // No content response
}

// PUT /api/posts/:id/featured - Toggle featured status for homepage
// Protected by requireAdmin middleware in routes
// Called by: admin dashboard to select homepage featured posts
export async function setFeatured(req: Request, res: Response) {
  const { id } = req.params                          // Post ID from URL
  const { featured } = req.body as { featured: boolean }
  
  const post = await prisma.post.update({ 
    where: { id }, 
    data: { featured: !!featured }                   // Ensure boolean value
  })
  res.json({ post })
}

// GET /api/posts/featured - Get featured posts for homepage
// Public access - no authentication required
// Called by: frontend Home component to display featured project cards
export async function listFeatured(req: Request, res: Response) {
  const limit = Math.min(Number(req.query.limit ?? 3), 6) // Max 6, default 3
  
  const posts = await prisma.post.findMany({
    where: { published: true, featured: true },      // Only published and featured
    orderBy: { updatedAt: 'desc' },                  // Most recently updated first
    take: limit,                                     // Limit number of results
    select: { 
      id: true, title: true, excerpt: true, 
      coverUrl: true, updatedAt: true                // Only fields needed for cards
    },
  })
  res.json({ posts })
}