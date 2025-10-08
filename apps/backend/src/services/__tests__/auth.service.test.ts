// Tests for authentication service
import type { User } from '@prisma/client'

// Mock the external dependencies first
jest.mock('../../lib/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}))

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
  TokenExpiredError: class extends Error {
    constructor(message: string, expiredAt: Date) {
      super(message)
      this.name = 'TokenExpiredError'
    }
  },
  JsonWebTokenError: class extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'JsonWebTokenError'
    }
  },
}))

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}))

// Now import the service and mocked dependencies
import * as authService from '../auth.service'
import { prisma } from '../../lib/db'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'

// Cast to access mock methods
const mockPrismaUser = prisma.user as jest.Mocked<typeof prisma.user>
const mockJwt = jwt as jest.Mocked<typeof jwt>
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

describe('Auth Service', () => {
  const testUser: User = {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashed-password',
    role: 'ADMIN',
    createdAt: new Date(),
  }

  const testUserPayload = {
    sub: testUser.id,
    role: testUser.role,
    email: testUser.email,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Set test environment variables to match setup.ts
    process.env.JWT_SECRET = 'test-secret-key-for-testing'
    process.env.JWT_EXPIRES = '7d'
  })

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      // Mock database user lookup
      mockPrismaUser.findUnique.mockResolvedValue(testUser)
      
      // Mock password comparison
      mockBcrypt.compare.mockResolvedValue(true as never)
      
      // Mock JWT signing
      const testToken = 'test-jwt-token'
      mockJwt.sign.mockReturnValue(testToken as never)

      const result = await authService.login('test@example.com', 'password123')

      // Verify database query
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      })

      // Verify password check
      expect(mockBcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password')

      // Verify JWT creation
      expect(mockJwt.sign).toHaveBeenCalledWith(
        testUserPayload,
        'test-secret-key-for-testing',
        { expiresIn: '7d' }
      )

      // Verify result structure
      expect(result).toEqual({
        user: {
          id: testUser.id,
          email: testUser.email,
          name: testUser.name,
          role: testUser.role,
          createdAt: testUser.createdAt,
        },
        token: testToken
      })

      // Ensure password is not included in result
      expect(result.user).not.toHaveProperty('password')
    })

    it('should throw error if user not found', async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null)

      await expect(
        authService.login('nonexistent@example.com', 'password123')
      ).rejects.toThrow('INVALID_CREDENTIALS')

      expect(mockBcrypt.compare).not.toHaveBeenCalled()
      expect(mockJwt.sign).not.toHaveBeenCalled()
    })

    it('should throw error if password is incorrect', async () => {
      mockPrismaUser.findUnique.mockResolvedValue(testUser)
      mockBcrypt.compare.mockResolvedValue(false as never)

      await expect(
        authService.login('test@example.com', 'wrong-password')
      ).rejects.toThrow('INVALID_CREDENTIALS')

      expect(mockBcrypt.compare).toHaveBeenCalledWith('wrong-password', 'hashed-password')
      expect(mockJwt.sign).not.toHaveBeenCalled()
    })

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection failed')
      mockPrismaUser.findUnique.mockRejectedValue(dbError)

      await expect(
        authService.login('test@example.com', 'password123')
      ).rejects.toThrow('Database connection failed')
    })

    it('should handle bcrypt errors', async () => {
      mockPrismaUser.findUnique.mockResolvedValue(testUser)
      const bcryptError = new Error('Bcrypt error')
      mockBcrypt.compare.mockRejectedValue(bcryptError as never)

      await expect(
        authService.login('test@example.com', 'password123')
      ).rejects.toThrow('Bcrypt error')
    })
  })

  describe('verifyToken', () => {
    it('should successfully verify valid token', () => {
      const testToken = 'valid-jwt-token'
      mockJwt.verify.mockReturnValue(testUserPayload as never)

      const result = authService.verifyToken(testToken)

      expect(mockJwt.verify).toHaveBeenCalledWith(testToken, 'test-secret-key-for-testing')
      expect(result).toEqual(testUserPayload)
    })

    it('should throw error for invalid token', () => {
      const testToken = 'invalid-jwt-token'
      const jwtError = new Error('Invalid token')
      mockJwt.verify.mockImplementation(() => {
        throw jwtError
      })

      expect(() => authService.verifyToken(testToken)).toThrow('Invalid token')
      expect(mockJwt.verify).toHaveBeenCalledWith(testToken, 'test-secret-key-for-testing')
    })

    it('should throw error for expired token', () => {
      const testToken = 'expired-jwt-token'
      const expiredError = new mockJwt.TokenExpiredError('Token expired', new Date())
      mockJwt.verify.mockImplementation(() => {
        throw expiredError
      })

      expect(() => authService.verifyToken(testToken)).toThrow('Token expired')
    })

    it('should handle malformed tokens', () => {
      const testToken = 'malformed.jwt.token'
      const malformedError = new mockJwt.JsonWebTokenError('Malformed token')
      mockJwt.verify.mockImplementation(() => {
        throw malformedError
      })

      expect(() => authService.verifyToken(testToken)).toThrow('Malformed token')
    })
  })

  describe('environment configuration', () => {
    it('should use default expiration if JWT_EXPIRES not set', async () => {
      delete process.env.JWT_EXPIRES
      
      mockPrismaUser.findUnique.mockResolvedValue(testUser)
      mockBcrypt.compare.mockResolvedValue(true as never)
      mockJwt.sign.mockReturnValue('test-token' as never)

      await authService.login('test@example.com', 'password123')

      // Should use default '7d' when JWT_EXPIRES is not set
      expect(mockJwt.sign).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(String),
        { expiresIn: '7d' }
      )
    })
  })
})