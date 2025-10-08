// Global test setup and configuration
// Configures Prisma mocking and test environment for all tests

// Set test environment variables first
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-secret-key-for-testing'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db'

// Global test setup hooks
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks()
})

afterAll(() => {
  // Cleanup after all tests
  jest.clearAllMocks()
})