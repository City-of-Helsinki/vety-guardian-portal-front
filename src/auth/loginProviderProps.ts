import type { LoginProviderProps } from 'hds-react';
import { config } from '../config';

const { authority, clientId, scope, apiAudience, profileApiAudience } =
  config.oidc;
const origin = window.location.origin;

// HDS login with Helsinki-profiili (Helsinki Tunnistus / Keycloak): https://hds.hel.fi/components/login/
export const loginProviderProps: LoginProviderProps = {
  userManagerSettings: {
    authority,
    client_id: clientId,
    scope,
    redirect_uri: `${origin}/auth/helsinki/return`,
    post_logout_redirect_uri: `${origin}/auth/helsinki/logout`,
  },
  // Exchanges the user's access token for API tokens: one for our backend and one
  // for Helsinki-profiili, which the backend uses to read the guardian's henkilötunnus.
  apiTokensClientSettings: {
    url: `${authority}/protocol/openid-connect/token`,
    queryProps: {
      grantType: 'urn:ietf:params:oauth:grant-type:uma-ticket',
      permission: '#access',
    },
    audiences: [apiAudience, profileApiAudience],
  },
  // Notices when the session has ended elsewhere (e.g. logout in another service).
  sessionPollerSettings: { pollIntervalInMs: 60_000 },
};
