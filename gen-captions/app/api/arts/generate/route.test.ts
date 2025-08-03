import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from './route'

// モックを作成
vi.mock('@/app/api/_utils/openai', () => ({
  generate: vi.fn(),
}))

// モックされたモジュールをインポート
import { generate } from '@/app/api/_utils/openai'

describe('/api/arts/generate', () => {
  let mockRequest: NextRequest

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
    
    // POSTリクエストのモック
    mockRequest = new NextRequest('http://localhost:3000/api/arts/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'この画像について説明してください',
        images: ['base64encodedimage123'],
      }),
    })
  })

  describe('正常系テスト', () => {
    it('正常なリクエストでストリームレスポンスを返す', async () => {
      // ReadableStreamのモック
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('data: {"content": "テスト応答"}\n\n'))
          controller.close()
        }
      })

      const mockResponse = {
        ok: true,
        body: mockStream,
        headers: new Headers({
          'Content-Type': 'text/event-stream',
        }),
      }

      vi.mocked(generate).mockResolvedValue(mockResponse as Response)

      const response = await POST(mockRequest)

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toBe('text/event-stream')
      expect(response.headers.get('Transfer-Encoding')).toBe('chunked')
      
      expect(generate).toHaveBeenCalledWith(
        'この画像について説明してください',
        ['base64encodedimage123']
      )
    })

    it('画像なしのリクエストでも正常に処理される', async () => {
      const requestWithoutImages = new NextRequest('http://localhost:3000/api/arts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'テキストのみのプロンプト',
          images: [],
        }),
      })

      const mockStream = new ReadableStream()
      const mockResponse = {
        ok: true,
        body: mockStream,
        headers: new Headers({
          'Content-Type': 'text/event-stream',
        }),
      }

      vi.mocked(generate).mockResolvedValue(mockResponse as Response)

      const response = await POST(requestWithoutImages)

      expect(response.status).toBe(200)
      expect(generate).toHaveBeenCalledWith('テキストのみのプロンプト', [])
    })
  })

  describe('エラーハンドリングテスト', () => {
    it('外部API（OpenAI）がエラーを返した場合', async () => {
      const mockErrorResponse = {
        ok: false,
        status: 401,
        body: null,
      }

      vi.mocked(generate).mockResolvedValue(mockErrorResponse as Response)

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Failed to fetch from external API')
    })

    it('外部APIからストリームが取得できない場合', async () => {
      const mockResponse = {
        ok: true,
        body: null, // ストリームがnull
        headers: new Headers(),
      }

      vi.mocked(generate).mockResolvedValue(mockResponse as Response)

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('No stream available from external API')
    })

    it('不正なJSONリクエストの場合', async () => {
      const invalidRequest = new NextRequest('http://localhost:3000/api/arts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json',
      })

      const response = await POST(invalidRequest)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal Server Error')
      expect(data.details).toBeDefined()
    })

    it('generate関数が例外を投げた場合', async () => {
      vi.mocked(generate).mockRejectedValue(new Error('OpenAI API connection failed'))

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal Server Error')
      expect(data.details).toBe('OpenAI API connection failed')
    })
  })

  describe('リクエストボディのバリデーションテスト', () => {
    it('promptが空文字列でも処理される', async () => {
      const requestWithEmptyPrompt = new NextRequest('http://localhost:3000/api/arts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: '',
          images: ['base64image'],
        }),
      })

      const mockStream = new ReadableStream()
      const mockResponse = {
        ok: true,
        body: mockStream,
        headers: new Headers({ 'Content-Type': 'text/event-stream' }),
      }

      vi.mocked(generate).mockResolvedValue(mockResponse as Response)

      const response = await POST(requestWithEmptyPrompt)

      expect(response.status).toBe(200)
      expect(generate).toHaveBeenCalledWith('', ['base64image'])
    })

    it('promptが未定義の場合はエラーになる', async () => {
      const requestWithoutPrompt = new NextRequest('http://localhost:3000/api/arts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: ['base64image'],
        }),
      })

      vi.mocked(generate).mockImplementation(() => {
        throw new Error('prompt is required')
      })

      const response = await POST(requestWithoutPrompt)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal Server Error')
    })
  })

  describe('レスポンスヘッダーテスト', () => {
    it('適切なヘッダーが設定される', async () => {
      const mockStream = new ReadableStream()
      const mockResponse = {
        ok: true,
        body: mockStream,
        headers: new Headers({
          'Content-Type': 'application/json',
          'Custom-Header': 'test-value',
        }),
      }

      vi.mocked(generate).mockResolvedValue(mockResponse as Response)

      const response = await POST(mockRequest)

      expect(response.headers.get('Content-Type')).toBe('application/json')
      expect(response.headers.get('Transfer-Encoding')).toBe('chunked')
      // カスタムヘッダーは転送されない（Content-Typeのみ転送）
      expect(response.headers.get('Custom-Header')).toBeNull()
    })

    it('Content-Typeヘッダーがない場合でもエラーにならない', async () => {
      const mockStream = new ReadableStream()
      const mockResponse = {
        ok: true,
        body: mockStream,
        headers: new Headers(), // Content-Typeなし
      }

      vi.mocked(generate).mockResolvedValue(mockResponse as Response)

      const response = await POST(mockRequest)

      expect(response.status).toBe(200)
      expect(response.headers.get('Transfer-Encoding')).toBe('chunked')
    })
  })
})