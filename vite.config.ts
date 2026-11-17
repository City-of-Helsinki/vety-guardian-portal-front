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
  };
});
