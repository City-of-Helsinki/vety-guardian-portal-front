import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './index.css';
import App from './App.tsx';
import { Home, Landing, Application } from './pages/index.ts';
import './i18n/i18n';
import './api/client.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GuardianProvider } from './auth/GuardianProvider';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GuardianProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
              <Route path="landing" element={<Landing />} />
              <Route
                path="application/:applicationId"
                element={<Application />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </GuardianProvider>
    </QueryClientProvider>
  </StrictMode>,
);
