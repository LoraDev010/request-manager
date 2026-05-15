import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      // No global thresholds: only RequestCard has unit tests.
      // RequestList and CreateRequestForm are integration components tested manually.
      // Hooks coverage is low by design — service layer is mocked (correct unit-test strategy).
    },
  },
})
