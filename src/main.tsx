import './instrument';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router';
import './index.css';
import App from './App.tsx';
import { Home, Landing, Application, LoginCallback } from './pages/index.ts';
import './i18n/i18n';
import './api/client.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginProvider } from 'hds-react';
import { loginProviderProps } from './auth/loginProviderProps';
import { RequireGuardian } from './auth/RequireGuardian';

const queryClient = new QueryClient();

const SentryRoutes = Sentry.wrapReactRouterRouting(Routes);

createRoot(document.getElementById('root')!, {
  onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
    console.warn('Uncaught error', error, errorInfo.componentStack);
  }),
  onCaughtError: Sentry.reactErrorHandler(),
  onRecoverableError: Sentry.reactErrorHandler(),
}).render(
  // LoginProvider stays outside StrictMode: StrictMode's double render in development
  // leaves its API tokens client disconnected, so the API tokens are never fetched.
  <LoginProvider {...loginProviderProps}>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <SentryRoutes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
              <Route path="auth/helsinki/return" element={<LoginCallback />} />
              {/* Helsinki-profiili redirects here after logout (post_logout_redirect_uri). */}
              <Route
                path="auth/helsinki/logout"
                element={<Navigate to="/" replace />}
              />
              <Route element={<RequireGuardian />}>
                <Route path="landing" element={<Landing />} />
                <Route
                  path="application/:applicationId"
                  element={<Application />}
                />
              </Route>
            </Route>
          </SentryRoutes>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  </LoginProvider>,
);
