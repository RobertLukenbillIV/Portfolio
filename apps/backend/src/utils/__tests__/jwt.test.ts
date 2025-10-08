// Tests for JWT utility functions
import * as jwt from '../jwt'

describe('JWT Utilities', () => {
  const testPayload = { id: '123', email: 'test@example.com', role: 'USER' }

  describe('sign', () => {
    it('should create a valid JWT token', () => {
      const token = jwt.sign(testPayload)
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
    })

    it('should create different tokens for different payloads', () => {
      const token1 = jwt.sign(testPayload)
      const token2 = jwt.sign({ ...testPayload, id: '456' })
      expect(token1).not.toBe(token2)
    })
  })

  describe('verify', () => {
    it('should verify a valid token and return payload', () => {
      const token = jwt.sign(testPayload)
      const decoded = jwt.verify(token)
      
      expect(decoded.id).toBe(testPayload.id)
      expect(decoded.email).toBe(testPayload.email)
      expect(decoded.role).toBe(testPayload.role)
    })

    it('should throw error for invalid token', () => {
      expect(() => {
        jwt.verify('invalid.token.here')
      }).toThrow()
    })

    it('should throw error for empty token', () => {
      expect(() => {
        jwt.verify('')
      }).toThrow()
    })

    it('should throw error for malformed token', () => {
      expect(() => {
        jwt.verify('not-a-jwt')
      }).toThrow()
    })
  })

  describe('token expiration', () => {
    it('should include expiration in token', () => {
      const token = jwt.sign(testPayload)
      const decoded = jwt.verify(token)
      
      expect(decoded.exp).toBeDefined()
      expect(typeof decoded.exp).toBe('number')
      expect(decoded.exp).toBeGreaterThan(Date.now() / 1000)
    })
  })

  describe('error handling', () => {
    it('should handle undefined payload', () => {
      expect(() => {
        jwt.sign(undefined as any)
      }).toThrow()
    })

    it('should handle null payload', () => {
      expect(() => {
        jwt.sign(null as any)
      }).toThrow()
    })
  })
})