import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./__tests__/setup/vitest.ts'],
    include: [
      '**/*.{test,spec}.{js,ts,tsx}',
      'app/**/*.test.{js,ts,tsx}',
      'components/**/*.test.{js,ts,tsx}',
      'lib/**/*.test.{js,ts,tsx}',
      '__tests__/**/*.{test,spec}.{js,ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        '__tests__/**',
        'coverage/**',
        '.next/**',
        '*.config.*',
        '**/*.d.ts',
        'prisma/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
})