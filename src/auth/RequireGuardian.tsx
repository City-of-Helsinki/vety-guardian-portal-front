import { LoadingSpinner, Notification, useAuthenticatedUser } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { Navigate, Outlet } from 'react-router';
import { useGuardianIdentity } from './useGuardianIdentity';

// Route element for the pages that need a logged-in guardian with a verified identity.
export const RequireGuardian = () => {
  const { t } = useTranslation();
  const user = useAuthenticatedUser();
  const { identity, apiTokensError } = useGuardianIdentity();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (apiTokensError || identity.isError) {
    return (
      <Notification
        type="error"
        label={t('login.identityError', 'Tunnistautuminen epäonnistui')}
        data-testid="notification-identity-error"
      >
        {identity.error?.error ?? apiTokensError?.message}
      </Notification>
    );
  }

  if (!identity.isSuccess) {
    return <LoadingSpinner data-testid="loading-spinner" />;
  }

  return <Outlet />;
};
