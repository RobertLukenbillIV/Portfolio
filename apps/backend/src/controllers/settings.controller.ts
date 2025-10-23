// Settings controller - manages site-wide configuration
// Handles homepage hero image and intro text that admins can customize
// Connected to: routes/settings.routes.ts, frontend Home component

import { Request, Response } from 'express'
import { prisma } from '../lib/db'                    // Database client

// GET /api/settings - Retrieve site-wide settings
// Called by: frontend Home component to display hero image and intro text
// Returns: settings object with all hero images and configuration
export async function getSettings(_req: Request, res: Response) {
  try {
    // Settings uses singleton pattern (always id: 1)
    const settings = await prisma.settings.findUnique({ where: { id: 1 } })
    
    if (settings) {
      // Parse JSON arrays for hero images with safe parsing
      const settingsAny = settings as any
      const parsedSettings = {
        ...settings,
        homeHeroUrls: safeJsonParse(settingsAny.homeHeroUrls, []),
        projectsHeroUrls: safeJsonParse(settingsAny.projectsHeroUrls, []),
        adminHeroUrls: safeJsonParse(settingsAny.adminHeroUrls, []),
        aboutHeroUrls: safeJsonParse(settingsAny.aboutHeroUrls, [])
      }
      res.json({ settings: parsedSettings })
    } else {
      res.json({ settings: null })
    }
  } catch (error) {
    console.error('Error fetching settings:', error)
    res.status(500).json({ error: 'Failed to fetch settings' })
  }
}

// Helper function to safely parse JSON with fallback
function safeJsonParse(jsonString: string | null | undefined, fallback: any[] = []) {
  if (!jsonString) return fallback
  try {
    const parsed = JSON.parse(jsonString)
    return Array.isArray(parsed) ? parsed : fallback
  } catch (error) {
    console.error('Error parsing JSON:', error, 'Input:', jsonString)
    return fallback
  }
}

// PUT /api/settings - Update site-wide settings
// Protected by requireAdmin middleware in routes
// Called by: frontend admin dashboard for all settings including hero images and social media
export async function updateSettings(req: Request, res: Response) {
  const { 
    homeHeroUrl, homeIntro, githubUrl, linkedinUrl,
    homeHeroUrls, projectsHeroUrls, adminHeroUrls, aboutHeroUrls,
    homeImageMode, projectsImageMode, adminImageMode, aboutImageMode,
    homeDescription, projectsDescription, aboutDescription,
    socialLinks
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
    aboutImageMode,
    homeDescription,
    projectsDescription,
    aboutDescription
  }
  
  // Serialize arrays to JSON strings with validation
  if (homeHeroUrls && Array.isArray(homeHeroUrls)) {
    updateData.homeHeroUrls = JSON.stringify(homeHeroUrls.filter(url => url && url.trim()))
  }
  if (projectsHeroUrls && Array.isArray(projectsHeroUrls)) {
    updateData.projectsHeroUrls = JSON.stringify(projectsHeroUrls.filter(url => url && url.trim()))
  }
  if (adminHeroUrls && Array.isArray(adminHeroUrls)) {
    updateData.adminHeroUrls = JSON.stringify(adminHeroUrls.filter(url => url && url.trim()))
  }
  if (aboutHeroUrls && Array.isArray(aboutHeroUrls)) {
    updateData.aboutHeroUrls = JSON.stringify(aboutHeroUrls.filter(url => url && url.trim()))
  }
  
  // Handle socialLinks - can be string or object
  if (socialLinks) {
    updateData.socialLinks = typeof socialLinks === 'string' ? socialLinks : JSON.stringify(socialLinks)
  }
  
  // Upsert to handle first-time setup or updates
  const settings = await prisma.settings.upsert({
    where: { id: 1 },                                // Singleton record
    update: updateData,                              // Update existing settings
    create: { id: 1, ...updateData },              // Create if not exists
  })
  
  // Return with parsed arrays using safe parsing
  const settingsResult = settings as any
  const parsedSettings = {
    ...settings,
    homeHeroUrls: safeJsonParse(settingsResult.homeHeroUrls, []),
    projectsHeroUrls: safeJsonParse(settingsResult.projectsHeroUrls, []),
    adminHeroUrls: safeJsonParse(settingsResult.adminHeroUrls, []),
    aboutHeroUrls: safeJsonParse(settingsResult.aboutHeroUrls, [])
  }
  
  res.json({ settings: parsedSettings })
}
