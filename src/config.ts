type RuntimeEnv = Partial<
  Record<'VITE_API_BASE_URL' | 'VITE_LOCIZE_PROJECT_ID', string>
>;

declare global {
  interface Window {
    __ENV__?: RuntimeEnv;
  }
}

// Values from /env-config.js (set at container start) take precedence over
// build-time values from import.meta.env (.env files in local development).
const runtimeEnv = window.__ENV__ ?? {};

export const config = {
  apiBaseUrl:
    runtimeEnv.VITE_API_BASE_URL ||
    (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8001'),
  locizeProjectId:
    runtimeEnv.VITE_LOCIZE_PROJECT_ID || import.meta.env.VITE_LOCIZE_PROJECT_ID,
};
