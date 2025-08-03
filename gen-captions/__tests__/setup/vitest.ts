// Vitest setup file
import { vi } from 'vitest'

// Mock environment variables
process.env.POSTGRES_PRISMA_URL = 'postgresql://test:test@localhost:5432/test'
process.env.POSTGRES_URL_NON_POOLING = 'postgresql://test:test@localhost:5432/test'
process.env.JWT_SECRET = 'test-secret-key'

// Mock console.error to clean up test output
global.console = {
  ...console,
  error: vi.fn(),
}