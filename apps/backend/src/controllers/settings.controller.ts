// Settings controller - manages site-wide configuration
// Handles homepage hero image and intro text that admins can customize
// Connected to: routes/settings.routes.ts, frontend Home component

import { Request, Response } from 'express'
import { prisma } from '../lib/db'                    // Database client

// GET /api/settings - Retrieve site-wide settings
// Called by: frontend Home component to display hero image and intro text
// Returns: settings object with homeHeroUrl and homeIntro
export async function getSettings(_req: Request, res: Response) {
  // Settings uses singleton pattern (always id: 1)
  const settings = await prisma.settings.findUnique({ where: { id: 1 } })
  res.json({ settings })
}

// PUT /api/settings - Update site-wide settings
// Protected by requireAdmin middleware in routes
// Called by: frontend admin dashboard for homepage customization
export async function updateSettings(req: Request, res: Response) {
  const { homeHeroUrl, homeIntro } = req.body        // New hero image URL and intro text
  
  // Upsert to handle first-time setup or updates
  const settings = await prisma.settings.upsert({
    where: { id: 1 },                                // Singleton record
    update: { homeHeroUrl, homeIntro },              // Update existing settings
    create: { id: 1, homeHeroUrl, homeIntro },       // Create if not exists
  })
  res.json({ settings })
}
