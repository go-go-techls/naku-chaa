import { vi } from 'vitest'

// Prisma関連のモックハンドラー
export const createPrismaMocks = () => {
  const mockPrisma = {
    art: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    feedback: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  }

  return {
    mockPrisma,
    
    // よく使うモックの設定
    setupArtCount: (count: number) => {
      mockPrisma.art.count.mockResolvedValue(count)
    },
    
    setupDatabaseError: (error: Error) => {
      mockPrisma.art.count.mockRejectedValue(error)
      mockPrisma.art.findMany.mockRejectedValue(error)
    },
    
    reset: () => {
      Object.values(mockPrisma).forEach(model => {
        Object.values(model).forEach(method => {
          if (vi.isMockFunction(method)) {
            method.mockReset()
          }
        })
      })
    },
  }
}