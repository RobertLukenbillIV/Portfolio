// Main Express application configuration and setup
// This file orchestrates the entire backend application including middleware,
// CORS configuration, route mounting, and error handling

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import path from 'path'
import fs from 'fs'
// Route imports - each handles a specific domain of functionality
import pagesRoutes from './routes/pages.routes'     // Handles dynamic pages (About, Links)
import settingsRoutes from './routes/settings.routes' // Handles site-wide settings
import postsRoutes from './routes/posts.routes'     // Handles blog posts/projects
import { attachUser } from './middleware/auth'      // Middleware to attach user to requests
import 'dotenv/config'                              // Load environment variables

const app = express()
const isProd = process.env.NODE_ENV === 'production'

// Configure Express to trust proxies (required for Render deployment)
// This ensures correct client IP detection and secure cookie handling
app.set('trust proxy', 1)

// Security middleware - adds various HTTP headers for security
app.use(helmet())

// Parse cookies from request headers - needed for JWT authentication
app.use(cookieParser())
// Parse CORS origins from environment variables
// Supports both CORS_ORIGINS and CORS_ORIGIN for flexibility
const csv = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || ''
const allowlist = csv.split(',').map(s => s.trim()).filter(Boolean)

// Default allowed origins for development and current production deployment
// These are hardcoded fallbacks when environment variables are not set
const defaultOrigins = [
  'http://localhost:3000',      // Common React development port
  'http://localhost:5173',      // Vite development server default port
  'https://portfolio-frontend-eight-sooty.vercel.app', // Current Vercel deployment
  'https://portfolio-frontend-git-main-robertlukenbilliv.vercel.app', // Git-based deployment
  'https://portfolio-frontend-robertlukenbilliv.vercel.app' // User-based deployment
]

// Helper function to validate if an origin is allowed
function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return true // Allow server-to-server requests
  
  try {
    const host = new URL(origin).hostname
    
    // Multi-layered origin validation:
    // 1. Explicit allowlist from environment variables
    // 2. Hardcoded default origins (development + current production)
    // 3. All Vercel preview deployments (*.vercel.app)
    // 4. Localhost (any port) for development
    // 5. Local network IPs for development (127.0.0.1, 192.168.x.x)
    const allowed = 
      allowlist.includes(origin) ||
      defaultOrigins.includes(origin) ||
      host.endsWith('.vercel.app') ||
      host.includes('vercel') || // Extra safety for Vercel domains
      (host === 'localhost') ||
      (!isProd && (host === '127.0.0.1' || host.startsWith('192.168.')))
    
    return allowed
  } catch (err) {
    console.error(`Origin validation error for ${origin}:`, err)
    return false
  }
}

// CORS (Cross-Origin Resource Sharing) configuration
// This is critical for allowing the frontend (on Vercel) to communicate with backend (on Render)
const corsOptions: cors.CorsOptions = {
  origin(origin, cb) {
    const allowed = isOriginAllowed(origin)
    
    // Log CORS decisions for debugging production issues
    console.log(`CORS check: ${origin} -> ${allowed ? 'ALLOWED' : 'BLOCKED'}`)
    
    return allowed ? cb(null, true) : cb(new Error(`CORS blocked: ${origin}`))
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}
// Apply CORS configuration - MUST come before routes
app.use(cors(corsOptions))

// Parse JSON request bodies (with 5MB limit for image uploads)
app.use(express.json())

// Explicit OPTIONS handler for image uploads
app.options('/uploads/images/:filename', (req, res) => {
  const origin = req.get('Origin')
  console.log(`OPTIONS preflight for image: ${req.params.filename} from origin: ${origin}`)
  
  // Set comprehensive CORS headers for preflight
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin)
  } else {
    res.header('Access-Control-Allow-Origin', '*')
  }
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Max-Age', '86400')
  
  res.status(200).end()
})

// Debug endpoint to check request origin and CORS setup
app.get('/debug/cors', (req, res) => {
  const origin = req.get('Origin')
  const referer = req.get('Referer')
  const userAgent = req.get('User-Agent')
  
  res.header('Access-Control-Allow-Origin', origin || '*')
  res.header('Access-Control-Allow-Credentials', 'true')
  
  res.json({
    origin,
    referer,
    userAgent,
    headers: req.headers,
    isOriginAllowed: isOriginAllowed(origin),
    defaultOrigins,
    allowlist
  })
})

// Debug endpoint to check what files exist (temporary)
app.get('/debug/uploads', (req, res) => {
  const origin = req.get('Origin')
  res.header('Access-Control-Allow-Origin', origin || '*')
  res.header('Access-Control-Allow-Credentials', 'true')
  
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads', 'images')
    console.log('Debug: uploads directory path:', uploadsDir)
    
    if (!fs.existsSync(uploadsDir)) {
      return res.json({ 
        error: 'Uploads directory does not exist', 
        path: uploadsDir,
        cwd: process.cwd(),
        origin
      })
    }
    
    const files = fs.readdirSync(uploadsDir)
    return res.json({ 
      uploadsDir, 
      files, 
      count: files.length,
      cwd: process.cwd(),
      origin
    })
  } catch (error: any) {
    return res.json({ error: error.message, origin })
  }
})

// Custom handler for uploaded files with explicit CORS headers
app.get('/uploads/images/:filename', (req, res) => {
  const origin = req.get('Origin')
  console.log(`Image request: ${req.params.filename} from origin: ${origin}`)
  
  // Set explicit CORS headers for image requests - force allow all origins
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Max-Age', '86400')
  
  // Note: Cannot use credentials with wildcard origin, but images don't need credentials
  console.log(`CORS headers set for image request from: ${origin}`)
  
  // Handle preflight OPTIONS for this specific route
  if (req.method === 'OPTIONS') {
    console.log(`OPTIONS preflight for image from: ${origin}`)
    return res.status(200).end()
  }
  
  try {
    // Try both URL-decoded and original filename
    const filename = req.params.filename
    const decodedFilename = decodeURIComponent(filename)
    
    const uploadsDir = path.join(process.cwd(), 'uploads', 'images')
    let filePath = path.join(uploadsDir, filename)
    
    // Check if original filename exists
    if (!fs.existsSync(filePath) && filename !== decodedFilename) {
      // Try URL-decoded version
      filePath = path.join(uploadsDir, decodedFilename)
      console.log(`Trying decoded filename: ${decodedFilename}`)
    }
    
    if (fs.existsSync(filePath)) {
      console.log(`Serving file: ${filePath}`)
      // Ensure CORS headers are set right before sending file
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
      return res.sendFile(filePath)
    } else {
      console.log(`File not found: ${filename} (also tried: ${decodedFilename})`)
      // List available files for debugging
      const availableFiles = fs.readdirSync(uploadsDir)
      console.log(`Available files:`, availableFiles)
      return res.status(404).json({ error: 'File not found', requested: filename, available: availableFiles })
    }
  } catch (error) {
    console.error('Error serving image:', error)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Serve other uploaded files statically with CORS headers
app.use('/uploads', (req, res, next) => {
  const origin = req.get('Origin')
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', origin || '*')
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Max-Age', '86400')
    return res.status(200).end()
  }
  
  // Apply CORS headers for actual requests
  res.header('Access-Control-Allow-Origin', origin || '*')
  res.header('Access-Control-Allow-Credentials', 'true')
  
  next()
}, express.static(path.join(process.cwd(), 'uploads')))

// Global error handler for CORS violations
// Provides better debugging info when CORS issues occur
app.use((err: any, req: any, res: any, next: any) => {
  if (err && err.message && err.message.includes('CORS')) {
    console.error('CORS Error:', err.message, 'Origin:', req.headers.origin)
    return res.status(403).json({ error: 'CORS policy violation' })
  }
  next(err)
})

// Attach user information to all requests (if JWT cookie present)
// This middleware runs before all routes and populates req.user
app.use(attachUser)

// Mount API routes - order matters for middleware application
import authRoutes from './routes/auth.routes'      // Authentication (login/logout/me)
import uploadRoutes from './routes/upload.routes'  // File upload handling
app.use('/api/auth', authRoutes)
app.use('/api/pages', pagesRoutes)                 // Dynamic pages (about/links)
app.use('/api/settings', settingsRoutes)           // Site settings  
app.use('/api/posts', postsRoutes)                 // Blog posts/projects
app.use('/api/upload', uploadRoutes)               // Image uploads

// Health check endpoint for monitoring and debugging
// Returns server status and configuration info
app.get('/api/health', (_req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,                    // Production vs development
    cors: !!process.env.CORS_ORIGINS             // Whether CORS env vars are set
  })
})

// Simple connectivity test endpoint (useful for Render health checks)
app.get('/ping', (_req, res) => res.send('pong'))

export default app
