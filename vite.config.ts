/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['src/api/generated/**'],
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    css: false,
    coverage: {
      provider: 'v8',
      exclude: [
        'src/api/generated/**',
        'src/test/**',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/main.tsx',
      ],
      reporter: ['text', 'html', 'lcov'],
    },
  },
});
