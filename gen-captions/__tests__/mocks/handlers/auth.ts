import { vi } from 'vitest'

// 認証関連のモックハンドラー
export const createAuthMocks = () => {
  const mockGetUserFromRequest = vi.fn()
  const mockVerifyToken = vi.fn()
  const mockGenerateToken = vi.fn()

  return {
    mockGetUserFromRequest,
    mockVerifyToken,
    mockGenerateToken,
    
    // よく使うモックの設定
    setupAuthenticatedUser: (user: any) => {
      mockGetUserFromRequest.mockResolvedValue(user)
    },
    
    setupUnauthenticatedUser: () => {
      mockGetUserFromRequest.mockResolvedValue(null)
    },
    
    setupAuthError: (error: Error) => {
      mockGetUserFromRequest.mockRejectedValue(error)
    },
    
    reset: () => {
      mockGetUserFromRequest.mockReset()
      mockVerifyToken.mockReset()
      mockGenerateToken.mockReset()
    },
  }
}