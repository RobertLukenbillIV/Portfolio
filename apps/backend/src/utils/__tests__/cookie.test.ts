// Tests for cookie configuration utilities
import { COOKIE_NAME, cookieOptions } from '../cookie'

describe('Cookie Utilities', () => {
  const originalEnv = process.env.NODE_ENV
  const mockRequest = {} as any // Mock Express request

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
  })

  describe('COOKIE_NAME', () => {
    it('should be defined as a string', () => {
      expect(COOKIE_NAME).toBeDefined()
      expect(typeof COOKIE_NAME).toBe('string')
      expect(COOKIE_NAME.length).toBeGreaterThan(0)
    })

    it('should use default value if AUTH_COOKIE_NAME not set', () => {
      expect(COOKIE_NAME).toBe('token')
    })
  })

  describe('cookieOptions', () => {
    describe('in production environment', () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'production'
      })

      it('should return secure configuration', () => {
        const config = cookieOptions(mockRequest)
        
        expect(config.httpOnly).toBe(true)
        expect(config.secure).toBe(true)
        expect(config.sameSite).toBe('none')
        expect(config.path).toBe('/')
        expect(config.maxAge).toBeGreaterThan(0)
      })

      it('should set appropriate maxAge', () => {
        const config = cookieOptions(mockRequest)
        const expectedMaxAge = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        
        expect(config.maxAge).toBe(expectedMaxAge)
      })
    })

    describe('in development environment', () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'development'
      })

      it('should return development configuration', () => {
        const config = cookieOptions(mockRequest)
        
        expect(config.httpOnly).toBe(true)
        expect(config.secure).toBe(false)
        expect(config.sameSite).toBe('lax')
        expect(config.path).toBe('/')
        expect(config.maxAge).toBeGreaterThan(0)
      })
    })

    describe('security properties', () => {
      it('should always set httpOnly to true', () => {
        process.env.NODE_ENV = 'production'
        expect(cookieOptions(mockRequest).httpOnly).toBe(true)
        
        process.env.NODE_ENV = 'development'
        expect(cookieOptions(mockRequest).httpOnly).toBe(true)
      })

      it('should have consistent maxAge across environments', () => {
        process.env.NODE_ENV = 'production'
        const prodConfig = cookieOptions(mockRequest)
        
        process.env.NODE_ENV = 'development'
        const devConfig = cookieOptions(mockRequest)
        
        expect(prodConfig.maxAge).toBe(devConfig.maxAge)
      })
    })
  })
})
