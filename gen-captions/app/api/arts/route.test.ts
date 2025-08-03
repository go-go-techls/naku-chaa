import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from './route'

// モックを作成
vi.mock('@/lib/prisma', () => ({
  prisma: {
    art: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock('@/lib/auth', () => ({
  getUserFromRequest: vi.fn(),
}))

// モックされたモジュールをインポート
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

describe('/api/arts', () => {
  let mockGetRequest: NextRequest
  let mockPostRequest: NextRequest

  beforeAll(() => {
    // console出力のモック化（テスト実行時の不要な出力を抑制）
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  beforeEach(() => {
    vi.clearAllMocks()
    
    // GET用のNextRequestモック
    mockGetRequest = new NextRequest('http://localhost:3000/api/arts?page=1&pageSize=10', {
      method: 'GET',
    })
    
    // POST用のNextRequestモック
    mockPostRequest = new NextRequest('http://localhost:3000/api/arts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'テスト作品',
        feature: 'テスト特徴',
        advantage: 'テスト優位性',
        advice: 'テストアドバイス',
        image: 'data:image/jpeg;base64,test',
        rating: 4,
        comment: 'テストコメント',
        character: 'テストキャラクター',
        is_public_allowed: false,
      }),
    })
  })

  describe('GET /api/arts', () => {
    describe('認証テスト', () => {
      it('未認証ユーザーの場合は401を返す', async () => {
        vi.mocked(getUserFromRequest).mockResolvedValue(null)

        const response = await GET(mockGetRequest)
        const data = await response.json()

        expect(response.status).toBe(401)
        expect(data.error).toBe('認証が必要です。')
      })
    })

    describe('作品一覧取得テスト', () => {
      it('一般ユーザーは自分の作品のみ取得できる', async () => {
        const mockUser = {
          userId: 'user-123',
          email: 'user@example.com',
          role: 'user',
        }
        const mockArt = {
          id: 1,
          title: 'テスト作品',
          feature: 'テスト特徴',
          advantage: 'テスト優位性',
          advice: 'テストアドバイス',
          image: 'data:image/jpeg;base64,test',
          rating: 4,
          comment: 'テストコメント',
          character: 'テストキャラクター',
          is_public_allowed: false,
          userId: 'user-123',
          createdAt: new Date('2023-01-01'),
        }

        vi.mocked(getUserFromRequest).mockResolvedValue(mockUser)
        vi.mocked(prisma.art.findMany).mockResolvedValue([mockArt])
        vi.mocked(prisma.art.count).mockResolvedValue(1)

        const response = await GET(mockGetRequest)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.data).toHaveLength(1)
        expect(data.total).toBe(1)
        expect(data.page).toBe(1)
        expect(data.pageSize).toBe(10)
        
        expect(prisma.art.findMany).toHaveBeenCalledWith({
          where: { userId: 'user-123' },
          skip: 0,
          take: 10,
          orderBy: { id: 'desc' },
          include: undefined,
        })
      })

      it('管理者は全作品を取得できる', async () => {
        const mockAdmin = {
          userId: 'admin-123',
          email: 'admin@example.com',
          role: 'admin',
        }
        const mockArt = {
          id: 1,
          title: 'テスト作品',
          feature: 'テスト特徴',
          advantage: 'テスト優位性',
          advice: 'テストアドバイス',
          image: 'data:image/jpeg;base64,test',
          rating: 4,
          comment: 'テストコメント',
          character: 'テストキャラクター',
          is_public_allowed: false,
          userId: 'user-456',
          createdAt: new Date('2023-01-01'),
        }

        vi.mocked(getUserFromRequest).mockResolvedValue(mockAdmin)
        vi.mocked(prisma.art.findMany).mockResolvedValue([mockArt])
        vi.mocked(prisma.art.count).mockResolvedValue(5)

        const response = await GET(mockGetRequest)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.data).toHaveLength(1)
        expect(data.total).toBe(5)
        
        expect(prisma.art.findMany).toHaveBeenCalledWith({
          where: {},
          skip: 0,
          take: 10,
          orderBy: { id: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        })
      })

      it('ページネーション機能が正常に動作する', async () => {
        const requestWithPagination = new NextRequest('http://localhost:3000/api/arts?page=2&pageSize=5', {
          method: 'GET',
        })

        const mockUser = {
          userId: 'user-123',
          email: 'user@example.com',
          role: 'user',
        }

        vi.mocked(getUserFromRequest).mockResolvedValue(mockUser)
        vi.mocked(prisma.art.findMany).mockResolvedValue([])
        vi.mocked(prisma.art.count).mockResolvedValue(0)

        const response = await GET(requestWithPagination)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.page).toBe(2)
        expect(data.pageSize).toBe(5)
        
        expect(prisma.art.findMany).toHaveBeenCalledWith({
          where: { userId: 'user-123' },
          skip: 5, // (page - 1) * pageSize = (2 - 1) * 5
          take: 5,
          orderBy: { id: 'desc' },
          include: undefined,
        })
      })

      it('デフォルトのページネーション値が適用される', async () => {
        const requestWithoutParams = new NextRequest('http://localhost:3000/api/arts', {
          method: 'GET',
        })

        const mockUser = {
          userId: 'user-123',
          email: 'user@example.com',
          role: 'user',
        }

        vi.mocked(getUserFromRequest).mockResolvedValue(mockUser)
        vi.mocked(prisma.art.findMany).mockResolvedValue([])
        vi.mocked(prisma.art.count).mockResolvedValue(0)

        const response = await GET(requestWithoutParams)
        const data = await response.json()

        expect(data.page).toBe(1)
        expect(data.pageSize).toBe(10)
      })
    })

    describe('キャッシュヘッダーテスト', () => {
      it('キャッシュ無効化ヘッダーが設定されている', async () => {
        const mockUser = {
          userId: 'user-123',
          email: 'user@example.com',
          role: 'user',
        }

        vi.mocked(getUserFromRequest).mockResolvedValue(mockUser)
        vi.mocked(prisma.art.findMany).mockResolvedValue([])
        vi.mocked(prisma.art.count).mockResolvedValue(0)

        const response = await GET(mockGetRequest)

        expect(response.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate')
        expect(response.headers.get('Pragma')).toBe('no-cache')
        expect(response.headers.get('Expires')).toBe('0')
      })
    })

    describe('エラーハンドリングテスト', () => {
      it('データベースエラーの場合は500を返す', async () => {
        const mockUser = {
          userId: 'user-123',
          email: 'user@example.com',
          role: 'user',
        }

        vi.mocked(getUserFromRequest).mockResolvedValue(mockUser)
        vi.mocked(prisma.art.findMany).mockRejectedValue(new Error('Database error'))

        const response = await GET(mockGetRequest)
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data.error).toBe('作品の取得に失敗しました。')
      })
    })
  })

  describe('POST /api/arts', () => {
    describe('認証テスト', () => {
      it('未認証ユーザーの場合は401を返す', async () => {
        vi.mocked(getUserFromRequest).mockResolvedValue(null)

        const response = await POST(mockPostRequest)
        const data = await response.json()

        expect(response.status).toBe(401)
        expect(data.error).toBe('認証が必要です。')
      })
    })

    describe('作品作成テスト', () => {
      it('正常な作品データで作成できる', async () => {
        const mockUser = {
          userId: 'user-123',
          email: 'user@example.com',
          role: 'user',
        }
        const newArt = {
          id: 2,
          title: 'テスト作品',
          feature: 'テスト特徴',
          advantage: 'テスト優位性',
          advice: 'テストアドバイス',
          image: 'data:image/jpeg;base64,test',
          rating: 4,
          comment: 'テストコメント',
          character: 'テストキャラクター',
          is_public_allowed: false,
          userId: 'user-123',
          createdAt: new Date('2023-01-01'),
        }

        vi.mocked(getUserFromRequest).mockResolvedValue(mockUser)
        vi.mocked(prisma.art.create).mockResolvedValue(newArt)

        const response = await POST(mockPostRequest)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.id).toBe(2)
        expect(data.title).toBe('テスト作品')
        
        expect(prisma.art.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            title: 'テスト作品',
            userId: 'user-123',
          }),
        })
      })

      it('作成成功時に適切なヘッダーが設定される', async () => {
        const mockUser = {
          userId: 'user-123',
          email: 'user@example.com',
          role: 'user',
        }
        const mockArt = {
          id: 1,
          title: 'テスト作品',
          feature: 'テスト特徴',
          advantage: 'テスト優位性',
          advice: 'テストアドバイス',
          image: 'data:image/jpeg;base64,test',
          rating: 4,
          comment: 'テストコメント',
          character: 'テストキャラクター',
          is_public_allowed: false,
          userId: 'user-123',
          createdAt: new Date('2023-01-01'),
        }

        vi.mocked(getUserFromRequest).mockResolvedValue(mockUser)
        vi.mocked(prisma.art.create).mockResolvedValue(mockArt)

        const response = await POST(mockPostRequest)

        expect(response.headers.get('X-New-Art-Created')).toBe('true')
        expect(response.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate')
        expect(response.headers.get('Pragma')).toBe('no-cache')
        expect(response.headers.get('Expires')).toBe('0')
      })
    })

    describe('エラーハンドリングテスト', () => {
      it('不正なJSONの場合はエラーを返す', async () => {
        const invalidRequest = new NextRequest('http://localhost:3000/api/arts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: 'invalid json',
        })

        const mockUser = {
          userId: 'user-123',
          email: 'user@example.com',
          role: 'user',
        }

        vi.mocked(getUserFromRequest).mockResolvedValue(mockUser)

        const response = await POST(invalidRequest)
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data.error).toBe('作品の作成に失敗しました。')
      })

      it('データベースエラーの場合は500を返す', async () => {
        const mockUser = {
          userId: 'user-123',
          email: 'user@example.com',
          role: 'user',
        }

        vi.mocked(getUserFromRequest).mockResolvedValue(mockUser)
        vi.mocked(prisma.art.create).mockRejectedValue(new Error('Database constraint violation'))

        const response = await POST(mockPostRequest)
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data.error).toBe('作品の作成に失敗しました。')
        expect(data.details).toBe('Database constraint violation')
      })
    })
  })

  describe('レスポンス形式テスト', () => {
    it('GET: 正常なレスポンス構造を返す', async () => {
      const mockUser = {
        userId: 'user-123',
        email: 'user@example.com',
        role: 'user',
      }
      const mockArt = {
        id: 1,
        title: 'テスト作品',
        feature: 'テスト特徴',
        advantage: 'テスト優位性',
        advice: 'テストアドバイス',
        image: 'data:image/jpeg;base64,test',
        rating: 4,
        comment: 'テストコメント',
        character: 'テストキャラクター',
        is_public_allowed: false,
        userId: 'user-123',
        createdAt: new Date('2023-01-01'),
      }

      vi.mocked(getUserFromRequest).mockResolvedValue(mockUser)
      vi.mocked(prisma.art.findMany).mockResolvedValue([mockArt])
      vi.mocked(prisma.art.count).mockResolvedValue(1)

      const response = await GET(mockGetRequest)
      const data = await response.json()

      expect(data).toHaveProperty('data')
      expect(data).toHaveProperty('total')
      expect(data).toHaveProperty('page')
      expect(data).toHaveProperty('pageSize')
      expect(Array.isArray(data.data)).toBe(true)
      expect(typeof data.total).toBe('number')
      expect(typeof data.page).toBe('number')
      expect(typeof data.pageSize).toBe('number')
    })

    it('POST: 作成された作品データを返す', async () => {
      const mockUser = {
        userId: 'user-123',
        email: 'user@example.com',
        role: 'user',
      }
      const mockArt = {
        id: 1,
        title: 'テスト作品',
        feature: 'テスト特徴',
        advantage: 'テスト優位性',
        advice: 'テストアドバイス',
        image: 'data:image/jpeg;base64,test',
        rating: 4,
        comment: 'テストコメント',
        character: 'テストキャラクター',
        is_public_allowed: false,
        userId: 'user-123',
        createdAt: new Date('2023-01-01'),
      }

      vi.mocked(getUserFromRequest).mockResolvedValue(mockUser)
      vi.mocked(prisma.art.create).mockResolvedValue(mockArt)

      const response = await POST(mockPostRequest)
      const data = await response.json()

      expect(data).toHaveProperty('id')
      expect(data).toHaveProperty('title')
      expect(data).toHaveProperty('userId')
      expect(data.userId).toBe('user-123')
    })
  })
})