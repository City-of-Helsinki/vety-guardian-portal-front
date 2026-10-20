import { getApiTokenFromStorage } from 'hds-react';
import { config } from '../config';
import { client } from './generated/client.gen';

client.setConfig({
  baseUrl: config.apiBaseUrl,
  // Bearer token for the operations the schema marks as secured. The HDS LoginProvider
  // keeps the API tokens in sessionStorage and renews them.
  auth: () => getApiTokenFromStorage(config.oidc.apiAudience),
});
