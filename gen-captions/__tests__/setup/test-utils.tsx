import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AuthProvider } from '@/app/contexts/AuthContext'
import ThemeRegistry from '@/app/ThemeRegistry'

// テスト用のプロバイダーラッパー
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeRegistry>
      <AuthProvider>{children}</AuthProvider>
    </ThemeRegistry>
  )
}

// カスタムrender関数
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }