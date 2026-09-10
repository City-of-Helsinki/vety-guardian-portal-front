import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './index.css';
import App from './App.tsx';
import { Home, Landing, Application } from './pages';
import './i18n/i18n';
import './api/client.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="landing" element={<Landing />} />
          <Route path="application" element={<Application />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
