/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { sentryVitePlugin } from '@sentry/bundler-plugins/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    build: {
      sourcemap: 'hidden',
    },
    plugins: [
      react(),
      // Put the Sentry Vite plugin after all other plugins
      sentryVitePlugin({
        project: env.SENTRY_PROJECT,
        authToken: env.SENTRY_AUTH_TOKEN,

        sourcemaps: {
          filesToDeleteAfterUpload: ['./dist/**/*.map'],
        },
      }),
    ],
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
          'src/instrument.ts',
        ],
        reporter: ['text', 'html', 'lcov'],
      },
    },
  };
});
