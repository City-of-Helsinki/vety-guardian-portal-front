import { useQuery } from '@tanstack/react-query';
import {
  useApiTokens,
  useApiTokensClientTracking,
  useAuthenticatedUser,
} from 'hds-react';
import {
  authIdentityCreate,
  type ErrorResponse,
  type IdentityResponse,
} from '../api/generated';
import { config } from '../config';

// Has the backend read the logged-in guardian's henkilötunnus from Helsinki-profiili
// (POST /auth/identity/). The VTJ and application endpoints refuse requests until it has.
export const useGuardianIdentity = () => {
  const user = useAuthenticatedUser();
  // Re-renders when the API tokens are fetched or renewed.
  useApiTokensClientTracking();
  const [apiTokensError, apiTokens] = useApiTokens().getStoredApiTokens();
  const profileApiToken = apiTokens?.[config.oidc.profileApiAudience];
  const hasApiToken = !!apiTokens?.[config.oidc.apiAudience];

  // throwOnError throws the response body, i.e. ErrorResponse for the documented errors.
  const identity = useQuery<IdentityResponse, ErrorResponse>({
    queryKey: ['guardianIdentity', user?.profile.sub],
    queryFn: async () => {
      const { data } = await authIdentityCreate({
        body: { profileApiToken: profileApiToken ?? '' },
        throwOnError: true,
      });
      return data;
    },
    enabled: !!user && hasApiToken && !!profileApiToken,
    staleTime: Infinity,
    retry: false,
  });

  return { identity, apiTokensError };
};
