// Page controller - handles dynamic content pages (About, Links)
// Manages CRUD operations for editable site pages with slug-based routing
// Connected to: routes/pages.routes.ts, frontend SinglePage component

import { Request, Response } from 'express'
import { prisma } from '../lib/db'                    // Database client

// GET /api/pages/:slug - Retrieve page content by slug
// Called by: frontend SinglePage component for About/Links pages
// Returns: page object with title and HTML content
export async function getPage(req: Request, res: Response) {
  const { slug } = req.params                        // Extract slug from URL (about/links)
  const page = await prisma.page.findUnique({ where: { slug } })
  
  if (!page) return res.status(404).json({ message: 'Page not found' })
  res.json({ page })
}

// PUT /api/pages/:slug - Create or update page content
// Protected by requireAdmin middleware in routes
// Called by: frontend admin page editing functionality
// Supports both creating new pages and updating existing ones
export async function upsertPage(req: Request, res: Response) {
  const { slug } = req.params                        // Page identifier (about/links)
  const { title, content } = req.body               // HTML content from rich text editor
  
  // Upsert: update if exists, create if doesn't exist
  const page = await prisma.page.upsert({
    where: { slug },
    update: { title, content },                      // Update existing page
    create: { slug, title: title || slug, content: content || '' }, // Create new page
  })
  res.json({ page })
}
