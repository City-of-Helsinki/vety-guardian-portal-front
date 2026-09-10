import { client } from './generated/client.gen';

client.setConfig({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8001',
  credentials: 'include', // send/receive the sessionid cookie cross-origin
});

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'TRACE']);

client.interceptors.request.use((request) => {
  if (!SAFE_METHODS.has(request.method)) {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      request.headers.set('X-CSRFToken', csrfToken);
    }
  }
  return request;
});
