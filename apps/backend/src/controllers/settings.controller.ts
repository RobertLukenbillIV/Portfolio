// Settings controller - manages site-wide configuration
// Handles homepage hero image and intro text that admins can customize
// Connected to: routes/settings.routes.ts, frontend Home component

import { Request, Response } from 'express'
import { prisma } from '../lib/db'                    // Database client

// GET /api/settings - Retrieve site-wide settings
// Called by: frontend Home component to display hero image and intro text
// Returns: settings object with all hero images and configuration
export async function getSettings(_req: Request, res: Response) {
  // Settings uses singleton pattern (always id: 1)
  const settings = await prisma.settings.findUnique({ where: { id: 1 } })
  
  if (settings) {
    // Parse JSON arrays for hero images
    const settingsAny = settings as any
    const parsedSettings = {
      ...settings,
      homeHeroUrls: settingsAny.homeHeroUrls ? JSON.parse(settingsAny.homeHeroUrls) : [],
      projectsHeroUrls: settingsAny.projectsHeroUrls ? JSON.parse(settingsAny.projectsHeroUrls) : [],
      adminHeroUrls: settingsAny.adminHeroUrls ? JSON.parse(settingsAny.adminHeroUrls) : [],
      aboutHeroUrls: settingsAny.aboutHeroUrls ? JSON.parse(settingsAny.aboutHeroUrls) : []
    }
    res.json({ settings: parsedSettings })
  } else {
    res.json({ settings: null })
  }
}

// PUT /api/settings - Update site-wide settings
// Protected by requireAdmin middleware in routes
// Called by: frontend admin dashboard for all settings including hero images and social media
export async function updateSettings(req: Request, res: Response) {
  const { 
    homeHeroUrl, homeIntro, githubUrl, linkedinUrl,
    homeHeroUrls, projectsHeroUrls, adminHeroUrls, aboutHeroUrls,
    homeImageMode, projectsImageMode, adminImageMode, aboutImageMode
  } = req.body
  
  // Prepare data with JSON serialization for array fields
  const updateData: any = {
    homeHeroUrl, 
    homeIntro, 
    githubUrl, 
    linkedinUrl,
    homeImageMode, 
    projectsImageMode, 
    adminImageMode, 
    aboutImageMode
  }
  
  // Serialize arrays to JSON strings
  if (homeHeroUrls) updateData.homeHeroUrls = JSON.stringify(homeHeroUrls)
  if (projectsHeroUrls) updateData.projectsHeroUrls = JSON.stringify(projectsHeroUrls)
  if (adminHeroUrls) updateData.adminHeroUrls = JSON.stringify(adminHeroUrls)
  if (aboutHeroUrls) updateData.aboutHeroUrls = JSON.stringify(aboutHeroUrls)
  
  // Upsert to handle first-time setup or updates
  const settings = await prisma.settings.upsert({
    where: { id: 1 },                                // Singleton record
    update: updateData,                              // Update existing settings
    create: { id: 1, ...updateData },              // Create if not exists
  })
  
  // Return with parsed arrays
  const settingsResult = settings as any
  const parsedSettings = {
    ...settings,
    homeHeroUrls: settingsResult.homeHeroUrls ? JSON.parse(settingsResult.homeHeroUrls) : [],
    projectsHeroUrls: settingsResult.projectsHeroUrls ? JSON.parse(settingsResult.projectsHeroUrls) : [],
    adminHeroUrls: settingsResult.adminHeroUrls ? JSON.parse(settingsResult.adminHeroUrls) : [],
    aboutHeroUrls: settingsResult.aboutHeroUrls ? JSON.parse(settingsResult.aboutHeroUrls) : []
  }
  
  res.json({ settings: parsedSettings })
}
