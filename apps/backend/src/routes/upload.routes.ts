// Upload routes - handles file uploads for images
// Supports both Cloudinary (production) and local filesystem (development)
// Uses multer for multipart form data processing

import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { Request, Response } from 'express'
import { requireAuth } from '../middleware/auth'
import cloudinary, { validateCloudinaryConfig } from '../config/cloudinary'

// Extend Express Request to include file property
interface MulterRequest extends Request {
  file?: Express.Multer.File
}

const router = Router()

// Check if Cloudinary is configured
const useCloudinary = validateCloudinaryConfig()

// Ensure uploads directory exists (for local storage fallback)
const uploadsDir = path.join(process.cwd(), 'uploads', 'images')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer storage based on environment
let upload: multer.Multer

if (useCloudinary) {
  // Cloudinary storage (production) - images persist across deployments
  const { CloudinaryStorage } = require('multer-storage-cloudinary')
  
  const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'portfolio', // Organize images in a folder
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }] // Optimize images
    }
  })
  
  upload = multer({
    storage: cloudinaryStorage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
      files: 1
    }
  })
  
  console.log('✓ Using Cloudinary for image storage')
} else {
  // Local filesystem storage (development) - images lost on deployment
  const storage = multer.diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
      cb(null, uploadsDir)
    },
    filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const ext = path.extname(file.originalname)
      const name = path.basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .replace(/_{2,}/g, '_')
        .replace(/^_|_$/g, '')
      cb(null, `${uniqueSuffix}-${name}${ext}`)
    }
  })
  
  const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
  
  upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
      files: 1
    }
  })
  
  console.log('⚠️  Using local filesystem for image storage (not recommended for production)')
}

// POST /api/upload/image - Upload single image
// Protected route - requires authentication
// Returns: { url: string } - URL to uploaded file (Cloudinary or local)
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
      return res.status(400).json({ error: err.message })
    }

    if (!req.file) {
      console.log('No file in request')
      return res.status(400).json({ error: 'No file uploaded' })
    }

    console.log('File uploaded successfully:', req.file.filename || req.file.path)
    
    let imageUrl: string
    
    if (useCloudinary && (req.file as any).path) {
      // Cloudinary storage - use the secure URL from Cloudinary
      imageUrl = (req.file as any).path // Cloudinary provides the full HTTPS URL
    } else {
      // Local storage - construct URL
      const protocol = req.protocol
      const host = req.get('host')
      imageUrl = `${protocol}://${host}/uploads/images/${req.file.filename}`
    }
    
    res.json({ 
      success: true,
      url: imageUrl,
      filename: req.file.filename || (req.file as any).filename,
      originalName: req.file.originalname,
      size: req.file.size,
      storage: useCloudinary ? 'cloudinary' : 'local'
    })
  })
})

// DELETE /api/upload/image/:filename - Delete uploaded image
// Protected route - requires authentication
// Removes file from Cloudinary or filesystem
router.delete('/image/:filename', requireAuth, async (req: Request, res: Response) => {
  try {
    const { filename } = req.params
    
    if (useCloudinary) {
      // Extract public_id from Cloudinary URL or use filename
      // Cloudinary public_id format: portfolio/filename (without extension)
      let publicId = filename
      
      // If it's a full Cloudinary URL, extract the public_id
      if (filename.includes('cloudinary.com')) {
        const urlParts = filename.split('/')
        const uploadIndex = urlParts.indexOf('upload')
        if (uploadIndex !== -1) {
          // Get everything after version (v1234567890)
          const pathAfterVersion = urlParts.slice(uploadIndex + 2).join('/')
          // Remove file extension
          publicId = pathAfterVersion.replace(/\.[^/.]+$/, '')
        }
      } else if (!filename.includes('/')) {
        // If just filename, add portfolio folder prefix and remove extension
        publicId = `portfolio/${filename.replace(/\.[^/.]+$/, '')}`
      }
      
      console.log('Deleting from Cloudinary:', publicId)
      
      const result = await cloudinary.uploader.destroy(publicId)
      
      if (result.result === 'ok' || result.result === 'not found') {
        return res.json({ 
          success: true, 
          message: 'File deleted successfully',
          result: result.result
        })
      } else {
        return res.status(500).json({ error: 'Delete failed', details: result })
      }
    } else {
      // Local filesystem deletion
      // Validate filename (prevent path traversal)
      if (filename.includes('/') || filename.includes('\\') || filename.startsWith('.') || filename.includes('..')) {
        return res.status(400).json({ error: 'Invalid filename' })
      }

      const filePath = path.join(uploadsDir, filename)
      
      // Security check - ensure resolved path is within uploads directory
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
    }
  } catch (error) {
    console.error('Delete error:', error)
    res.status(500).json({ error: 'Delete failed', details: (error as Error).message })
  }
})

// Catch-all route for invalid paths - this handles path traversal attempts
router.delete('/image/*', requireAuth, (req: Request, res: Response) => {
  return res.status(400).json({ error: 'Invalid filename' })
})

// GET /api/upload/images - List uploaded images
// Protected route - requires authentication
// Returns: array of image metadata from Cloudinary or local storage
router.get('/images', requireAuth, async (req: Request, res: Response) => {
  try {
    if (useCloudinary) {
      // List images from Cloudinary
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'portfolio/', // Only images in the portfolio folder
        max_results: 500,
        resource_type: 'image'
      })
      
      const images = result.resources.map((resource: any) => ({
        filename: resource.public_id.split('/').pop() + '.' + resource.format,
        url: resource.secure_url,
        size: resource.bytes,
        createdAt: new Date(resource.created_at),
        modifiedAt: new Date(resource.created_at),
        publicId: resource.public_id,
        format: resource.format,
        width: resource.width,
        height: resource.height
      }))
      .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())
      
      return res.json({ images, storage: 'cloudinary', count: images.length })
    } else {
      // List images from local filesystem
      const files = fs.readdirSync(uploadsDir)
      
      const images = files
        .filter(file => {
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
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      res.json({ images, storage: 'local', count: images.length })
    }
  } catch (error) {
    console.error('List images error:', error)
    res.status(500).json({ error: 'Failed to list images', details: (error as Error).message })
  }
})

export default router