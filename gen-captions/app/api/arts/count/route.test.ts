import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from './route'

// モックを作成
vi.mock('@/lib/prisma', () => ({
  prisma: {
    art: {
      count: vi.fn(),
    },
  },
}))

vi.mock('@/lib/auth', () => ({
  getUserFromRequest: vi.fn(),
}))

// モックされたモジュールをインポート
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

describe('/api/arts/count', () => {
  let mockRequest: NextRequest

  beforeAll(() => {
    // console出力のモック化（テスト実行時の不要な出力を抑制）
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  beforeEach(() => {
    vi.clearAllMocks()
    
    // NextRequestのモックを作成
    mockRequest = new NextRequest('http://localhost:3000/api/arts/count', {
      method: 'GET',
    })
  })

  describe('認証テスト', () => {
    it('未認証ユーザーの場合は401を返す', async () => {
      // 未認証状態をモック
      vi.mocked(getUserFromRequest).mockResolvedValue(null)

      const response = await GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('認証が必要です。')
    })
  })

  describe('作品数取得テスト', () => {
    it('一般ユーザーは自分の作品数のみ取得できる', async () => {
      // 一般ユーザーをモック
      const mockUser = {
        userId: 'user-123',
        email: 'user@example.com',
        role: 'user',
      }
      vi.mocked(getUserFromRequest).mockResolvedValue(mockUser)
      vi.mocked(prisma.art.count).mockResolvedValue(5)

      const response = await GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.count).toBe(5)
      expect(prisma.art.count).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
      })
    })

    it('管理者は全作品数を取得できる', async () => {
      // 管理者ユーザーをモック
      const mockAdmin = {
        userId: 'admin-123',
        email: 'admin@example.com',
        role: 'admin',
      }
      vi.mocked(getUserFromRequest).mockResolvedValue(mockAdmin)
      vi.mocked(prisma.art.count).mockResolvedValue(100)

      const response = await GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.count).toBe(100)
      expect(prisma.art.count).toHaveBeenCalledWith({
        where: {},
      })
    })

    it('キャッシュ無効化ヘッダーが設定されている', async () => {
      // 認証済みユーザーをモック
      const mockUser = {
        userId: 'user-123',
        email: 'user@example.com',
        role: 'user',
      }
      vi.mocked(getUserFromRequest).mockResolvedValue(mockUser)
      vi.mocked(prisma.art.count).mockResolvedValue(5)

      const response = await GET(mockRequest)

      expect(response.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate')
      expect(response.headers.get('Pragma')).toBe('no-cache')
      expect(response.headers.get('Expires')).toBe('0')
    })
  })

  describe('エラーハンドリングテスト', () => {
    it('データベースエラーの場合は500を返す', async () => {
      // 認証済みユーザーをモック
      const mockUser = {
        userId: 'user-123',
        email: 'user@example.com',
        role: 'user',
      }
      vi.mocked(getUserFromRequest).mockResolvedValue(mockUser)
      
      // データベースエラーをモック
      vi.mocked(prisma.art.count).mockRejectedValue(new Error('Database connection failed'))

      const response = await GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('作品数の取得に失敗しました。')
    })

    it('認証処理でエラーが発生した場合はエラーがthrowされる', async () => {
      // 認証処理でエラーが発生
      vi.mocked(getUserFromRequest).mockRejectedValue(new Error('Auth error'))

      // エラーがそのままthrowされる（現在の実装）
      await expect(GET(mockRequest)).rejects.toThrow('Auth error')
    })
  })

  describe('role別テスト', () => {
    it.each([
      ['user', { userId: 'user-123' }],
      ['admin', {}],
      ['moderator', { userId: 'mod-123' }], // adminでない場合
    ])('role=%sの場合、適切なwhere条件が設定される', async (role, expectedWhere) => {
      const mockUser = {
        userId: role === 'moderator' ? 'mod-123' : 'user-123',
        email: `${role}@example.com`,
        role: role,
      }
      vi.mocked(getUserFromRequest).mockResolvedValue(mockUser)
      vi.mocked(prisma.art.count).mockResolvedValue(10)

      await GET(mockRequest)

      expect(prisma.art.count).toHaveBeenCalledWith({
        where: expectedWhere,
      })
    })
  })

  describe('レスポンス形式テスト', () => {
    it('正常なレスポンス形式を返す', async () => {
      const mockUser = {
        userId: 'user-123',
        email: 'user@example.com',
        role: 'user',
      }
      vi.mocked(getUserFromRequest).mockResolvedValue(mockUser)
      vi.mocked(prisma.art.count).mockResolvedValue(42)

      const response = await GET(mockRequest)
      const data = await response.json()

      expect(data).toEqual({ count: 42 })
      expect(typeof data.count).toBe('number')
    })

    it('count=0の場合も正常に処理される', async () => {
      const mockUser = {
        userId: 'user-123',
        email: 'user@example.com',
        role: 'user',
      }
      vi.mocked(getUserFromRequest).mockResolvedValue(mockUser)
      vi.mocked(prisma.art.count).mockResolvedValue(0)

      const response = await GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.count).toBe(0)
    })
  })
})