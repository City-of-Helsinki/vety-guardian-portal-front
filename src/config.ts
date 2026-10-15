// Keep in sync with docker/nginx-start/env-config.sh
type RuntimeEnvName =
  | 'VITE_API_BASE_URL'
  | 'VITE_LOCIZE_PROJECT_ID'
  | 'VITE_OIDC_AUTHORITY'
  | 'VITE_OIDC_CLIENT_ID'
  | 'VITE_OIDC_SCOPE'
  | 'VITE_OIDC_API_AUDIENCE'
  | 'VITE_OIDC_PROFILE_API_AUDIENCE';

type RuntimeEnv = Partial<Record<RuntimeEnvName, string>>;

declare global {
  interface Window {
    __ENV__?: RuntimeEnv;
  }
}

// Values from /env-config.js (set at container start) take precedence over
// build-time values from import.meta.env (.env files in local development).
const runtimeEnv = window.__ENV__ ?? {};

const env = (name: RuntimeEnvName): string | undefined =>
  runtimeEnv[name] || import.meta.env[name];

export const config = {
  apiBaseUrl: env('VITE_API_BASE_URL') ?? 'http://localhost:8001',
  locizeProjectId: env('VITE_LOCIZE_PROJECT_ID'),
  // Helsinki-profiili login (Helsinki Tunnistus / Keycloak), see src/auth/loginProviderProps.ts
  oidc: {
    // e.g. https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus
    authority: env('VITE_OIDC_AUTHORITY') ?? '',
    clientId: env('VITE_OIDC_CLIENT_ID') ?? '',
    scope: env('VITE_OIDC_SCOPE') ?? 'openid profile',
    // API token audience (Tunnistus client id) of vety-guardian-portal-back
    apiAudience: env('VITE_OIDC_API_AUDIENCE') ?? '',
    // API token audience of Helsinki-profiili; the backend reads the henkilötunnus with it
    profileApiAudience: env('VITE_OIDC_PROFILE_API_AUDIENCE') ?? '',
  },
};
