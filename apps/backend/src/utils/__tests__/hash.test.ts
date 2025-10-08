// Tests for password hashing utilities
import * as hash from '../hash'

describe('Hash Utilities', () => {
  const testPassword = 'testPassword123!'
  const anotherPassword = 'differentPassword456@'

  describe('hash', () => {
    it('should hash a password successfully', async () => {
      const hashedPassword = await hash.hash(testPassword)
      
      expect(hashedPassword).toBeDefined()
      expect(typeof hashedPassword).toBe('string')
      expect(hashedPassword).not.toBe(testPassword)
      expect(hashedPassword.length).toBeGreaterThan(20)
    })

    it('should generate different hashes for same password', async () => {
      const hash1 = await hash.hash(testPassword)
      const hash2 = await hash.hash(testPassword)
      
      expect(hash1).not.toBe(hash2) // Due to salt
    })

    it('should handle empty password', async () => {
      // bcryptjs actually allows empty passwords and returns a valid hash
      const result = await hash.hash('')
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle undefined password', async () => {
      await expect(hash.hash(undefined as any)).rejects.toThrow()
    })
  })

  describe('compare', () => {
    it('should return true for correct password', async () => {
      const hashedPassword = await hash.hash(testPassword)
      const isValid = await hash.compare(testPassword, hashedPassword)
      
      expect(isValid).toBe(true)
    })

    it('should return false for incorrect password', async () => {
      const hashedPassword = await hash.hash(testPassword)
      const isValid = await hash.compare(anotherPassword, hashedPassword)
      
      expect(isValid).toBe(false)
    })

    it('should return false for empty password', async () => {
      const hashedPassword = await hash.hash(testPassword)
      const isValid = await hash.compare('', hashedPassword)
      
      expect(isValid).toBe(false)
    })

    it('should handle malformed hash', async () => {
      // bcryptjs returns false for invalid hashes instead of throwing
      const result = await hash.compare(testPassword, 'invalid-hash')
      expect(result).toBe(false)
    })

    it('should be case sensitive', async () => {
      const hashedPassword = await hash.hash('TestPassword')
      const isValid = await hash.compare('testpassword', hashedPassword)
      
      expect(isValid).toBe(false)
    })
  })

  describe('integration tests', () => {
    it('should work with special characters', async () => {
      const specialPassword = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const hashedPassword = await hash.hash(specialPassword)
      const isValid = await hash.compare(specialPassword, hashedPassword)
      
      expect(isValid).toBe(true)
    })

    it('should work with long passwords', async () => {
      const longPassword = 'a'.repeat(100)
      const hashedPassword = await hash.hash(longPassword)
      const isValid = await hash.compare(longPassword, hashedPassword)
      
      expect(isValid).toBe(true)
    })

    it('should work with unicode characters', async () => {
      const unicodePassword = '密码测试🔐'
      const hashedPassword = await hash.hash(unicodePassword)
      const isValid = await hash.compare(unicodePassword, hashedPassword)
      
      expect(isValid).toBe(true)
    })
  })
})