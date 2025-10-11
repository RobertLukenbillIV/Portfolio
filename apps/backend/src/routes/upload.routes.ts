// Upload routes - handles file uploads for images
// Supports both post cover images and general site images (hero, etc.)
// Uses multer for multipart form data processing and file system storage

import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { Request, Response } from 'express'
import { requireAuth } from '../middleware/auth'

// Extend Express Request to include file property
interface MulterRequest extends Request {
  file?: Express.Multer.File
}

const router = Router()

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads', 'images')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadsDir)
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    // Generate unique filename: timestamp-random-sanitized-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    const name = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars and spaces with underscores
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    cb(null, `${uniqueSuffix}-${name}${ext}`)
  }
})

// File filter - only allow image files
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed'))
  }
}

// Configure multer with options
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Single file upload
  }
})

// POST /api/upload/image - Upload single image
// Protected route - requires authentication
// Returns: { url: string } - relative URL to uploaded file
router.post('/image', requireAuth, (req: MulterRequest, res: Response) => {
  console.log('Upload request received')
  upload.single('image')(req, res, (err: any) => {
    if (err) {
      console.error('Upload error:', err)
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File too large' })
        }
        return res.status(400).json({ error: err.message })
      }
      // File filter error (e.g., "Only image files are allowed")
      return res.status(400).json({ error: err.message })
    }

    if (!req.file) {
      console.log('No file in request')
      return res.status(400).json({ error: 'No file uploaded' })
    }

    console.log('File uploaded successfully:', req.file.filename)
    
    // Return full URL including host for cross-origin access
    const protocol = req.protocol
    const host = req.get('host') 
    const imageUrl = `${protocol}://${host}/uploads/images/${req.file.filename}`
    
    res.json({ 
      success: true,
      url: imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    })
  })
})

// DELETE /api/upload/image/:filename - Delete uploaded image
// Protected route - requires authentication
// Removes file from filesystem
router.delete('/image/:filename', requireAuth, (req: Request, res: Response) => {
  try {
    const { filename } = req.params
    
    // Validate filename (prevent path traversal)
    if (filename.includes('/') || filename.includes('\\') || filename.startsWith('.') || filename.includes('..')) {
      return res.status(400).json({ error: 'Invalid filename' })
    }

    const filePath = path.join(uploadsDir, filename)
    
    // Additional security check - ensure resolved path is within uploads directory
    const resolvedPath = path.resolve(filePath)
    const uploadsPath = path.resolve(uploadsDir)
    if (!resolvedPath.startsWith(uploadsPath)) {
      return res.status(400).json({ error: 'Invalid filename' })
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' })
    }

    // Delete file
    fs.unlinkSync(filePath)
    
    res.json({ success: true, message: 'File deleted successfully' })
  } catch (error) {
    console.error('Delete error:', error)
    res.status(500).json({ error: 'Delete failed' })
  }
})

// Catch-all route for invalid paths - this handles path traversal attempts
router.delete('/image/*', requireAuth, (req: Request, res: Response) => {
  return res.status(400).json({ error: 'Invalid filename' })
})

// GET /api/upload/images - List uploaded images
// Protected route - requires authentication
// Returns: array of image metadata
router.get('/images', requireAuth, (req: Request, res: Response) => {
  try {
    const files = fs.readdirSync(uploadsDir)
    
    const images = files
      .filter(file => {
        // Only include image files
        const ext = path.extname(file).toLowerCase()
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)
      })
      .map(file => {
        const filePath = path.join(uploadsDir, file)
        const stats = fs.statSync(filePath)
        
        return {
          filename: file,
          url: `${req.protocol}://${req.get('host')}/uploads/images/${file}`,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        }
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // Newest first

    res.json({ images })
  } catch (error) {
    console.error('List images error:', error)
    res.status(500).json({ error: 'Failed to list images' })
  }
})

export default router