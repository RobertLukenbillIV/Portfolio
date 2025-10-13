// Tests for image upload routes and functionality
// Focus on testing upload logic, file validation, and static serving

import request from 'supertest'
import fs from 'fs'
import path from 'path'

// Mock the authentication middleware for testing
jest.mock('../../middleware/auth', () => ({
  attachUser: (req: any, res: any, next: any) => {
    req.user = { id: 'test-user-id', role: 'ADMIN' }
    next()
  },
  requireAuth: (req: any, res: any, next: any) => {
    req.user = { id: 'test-user-id', role: 'ADMIN' }
    next()
  },
  requireAdmin: (req: any, res: any, next: any) => {
    req.user = { id: 'test-user-id', role: 'ADMIN' }
    next()
  }
}))

// Mock the pages controller to avoid undefined function issues
jest.mock('../../controllers/pages.controller', () => ({
  getPage: (req: any, res: any) => res.json({ page: { slug: 'test', title: 'Test', content: 'Test content' } }),
  upsertPage: (req: any, res: any) => res.json({ page: { slug: 'test', title: 'Test', content: 'Test content' } })
}))

// Import app after mocking middleware
import app from '../../app'

describe('Upload Routes', () => {
  const uploadsDir = path.join(process.cwd(), 'uploads', 'images')

  beforeAll(() => {
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }
  })

  afterEach(() => {
    // Clean up test files after each test
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir)
      files.forEach(file => {
        if (file.startsWith('test-')) {
          fs.unlinkSync(path.join(uploadsDir, file))
        }
      })
    }
  })

  describe('POST /api/upload/image', () => {
    it('should upload a valid image file', async () => {
      // Create a simple test image buffer (1x1 pixel PNG)
      const testImageBuffer = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
        0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
        0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
        0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00,
        0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01,
        0xE2, 0x21, 0xBC, 0x33, 0x00, 0x00, 0x00, 0x00,
        0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
      ])

      const response = await request(app)
        .post('/api/upload/image')
        .attach('image', testImageBuffer, 'test.png')

      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        success: true,
        url: expect.stringMatching(/^https?:\/\/.*\/uploads\/images\/.*\.png$/),
        filename: expect.any(String),
        originalName: 'test.png',
        size: testImageBuffer.length
      })

      // Verify file was actually created
      const filename = response.body.filename
      const filePath = path.join(uploadsDir, filename)
      expect(fs.existsSync(filePath)).toBe(true)
    })

    it('should reject non-image files', async () => {
      const textBuffer = Buffer.from('This is not an image')

      const response = await request(app)
        .post('/api/upload/image')
        .attach('image', textBuffer, 'test.txt')

      expect(response.status).toBe(400)
      expect(response.body).toMatchObject({
        error: expect.stringContaining('image files are allowed')
      })
    })

    it('should reject requests without file', async () => {
      const response = await request(app)
        .post('/api/upload/image')

      expect(response.status).toBe(400)
      expect(response.body).toMatchObject({
        error: 'No file uploaded'
      })
    })
  })

  describe('GET /api/upload/images', () => {
    let uploadedFilename: string

    beforeEach(async () => {
      // Upload a test image
      const testImageBuffer = Buffer.from('fake image')
      const response = await request(app)
        .post('/api/upload/image')
        .attach('image', testImageBuffer, 'list-test.png')
      
      uploadedFilename = response.body.filename
    })

    it('should list uploaded images', async () => {
      const response = await request(app)
        .get('/api/upload/images')

      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        images: expect.arrayContaining([
          expect.objectContaining({
            filename: uploadedFilename,
            url: expect.stringMatching(/^https?:\/\/.*\/uploads\/images\/.*$/),
            size: expect.any(Number),
            createdAt: expect.any(String),
            modifiedAt: expect.any(String)
          })
        ])
      })
    })
  })

  describe('DELETE /api/upload/image/:filename', () => {
    let uploadedFilename: string

    beforeEach(async () => {
      // Upload a test image
      const testImageBuffer = Buffer.from('fake image for deletion')
      const response = await request(app)
        .post('/api/upload/image')
        .attach('image', testImageBuffer, 'delete-test.png')
      
      uploadedFilename = response.body.filename
    })

    it('should delete an uploaded image', async () => {
      const response = await request(app)
        .delete(`/api/upload/image/${uploadedFilename}`)

      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        success: true,
        message: 'File deleted successfully'
      })

      // Verify file was actually deleted
      const filePath = path.join(uploadsDir, uploadedFilename)
      expect(fs.existsSync(filePath)).toBe(false)
    })

    it('should return 404 for non-existent files', async () => {
      const response = await request(app)
        .delete('/api/upload/image/nonexistent.png')

      expect(response.status).toBe(404)
      expect(response.body).toMatchObject({
        error: 'File not found'
      })
    })

    it('should reject invalid filenames', async () => {
      // Test multiple invalid filename patterns
      const invalidFilenames = [
        '../../../etc/passwd',
        '..\\..\\windows\\system32',
        '.env',
        'test/../other.jpg'
      ]

      for (const filename of invalidFilenames) {
        const response = await request(app)
          .delete(`/api/upload/image/${encodeURIComponent(filename)}`)

        // Should either reject as invalid (400) or not found (404)
        expect([400, 404]).toContain(response.status)
        
        if (response.status === 400) {
          expect(response.body).toMatchObject({
            error: 'Invalid filename'
          })
        }
      }
    })
  })

  describe('Static file serving', () => {
    let uploadedUrl: string

    beforeEach(async () => {
      // Upload a test image
      const testImageBuffer = Buffer.from('static serving test')
      const response = await request(app)
        .post('/api/upload/image')
        .attach('image', testImageBuffer, 'static-test.png')
      
      uploadedUrl = response.body.url
    })

    it('should serve uploaded images statically', async () => {
      // uploadedUrl is absolute, extract the path for supertest
      const urlObj = new URL(uploadedUrl)
      const response = await request(app)
        .get(urlObj.pathname)

      expect(response.status).toBe(200)
      expect(response.body.toString()).toBe('static serving test')
    })
  })
})