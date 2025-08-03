import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

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
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
})