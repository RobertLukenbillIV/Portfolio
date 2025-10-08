// Post/Project routes - handles blog posts and portfolio project endpoints
// Mounted at /api/posts in app.ts
// Connected to: controllers/post.controller.ts, middleware/auth.ts

import * as ctrl from '../controllers/post.controller'  // Post operation handlers
import { requireAuth } from '../middleware/auth'         // Authentication middleware
import { Router } from 'express'
import { requireAdmin } from '../middleware/auth'        // Admin-only middleware
import { setFeatured, listFeatured } from '../controllers/post.controller'

const r = Router()

// Public routes - no authentication required
// GET /api/posts/featured - Get featured posts for homepage display
// Used by: Home component to show featured project cards
r.get('/featured', listFeatured)

// GET /api/posts/public - Get all published posts for projects page
// Used by: Projects component to display portfolio grid
r.get('/public', ctrl.listPublic)

// GET /api/posts/:id - Get individual post (public access)
// Used by: PostDetail component to display individual project pages
r.get('/:id', ctrl.getById)

// Admin routes - require authentication
// GET /api/posts - List all posts (including unpublished) for admin management
r.get('/', requireAuth, ctrl.list)

// GET /api/posts/:id/admin - Get individual post (admin access)
// Used by: PostEditor component when editing existing posts
r.get('/:id/admin', requireAuth, ctrl.getByIdAdmin)

// POST /api/posts - Create new post/project
// Automatically associates with authenticated user as author
r.post('/', requireAuth, ctrl.create)

// PUT /api/posts/:id - Update existing post/project
// Used by: PostEditor component when saving changes to existing posts
r.put('/:id', requireAuth, ctrl.update)

// DELETE /api/posts/:id - Remove post/project
r.delete('/:id', requireAuth, ctrl.remove)

// Admin-only routes - require admin role
// PUT /api/posts/:id/featured - Toggle featured status for homepage
// Used by: Admin dashboard to select which posts appear on homepage
r.put('/:id/featured', requireAdmin, setFeatured)

export default r