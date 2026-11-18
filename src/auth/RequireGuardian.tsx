import { LoadingSpinner, Notification, useAuthenticatedUser } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { Navigate, Outlet } from 'react-router';
import { useGuardianIdentity } from './useGuardianIdentity';

// Route element for the pages that need a logged-in guardian with a verified identity.
export const RequireGuardian = () => {
  const { t } = useTranslation('common');
  const user = useAuthenticatedUser();
  const { identity, apiTokensError } = useGuardianIdentity();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (apiTokensError || identity.isError) {
    const code = identity.error?.code;
    const unknownError = t(
      'errors.unknown',
      'Tapahtui virhe. Yritä myöhemmin uudelleen.',
    );
    return (
      <Notification
        type="error"
        label={t('login.identityError', 'Tunnistautuminen epäonnistui')}
        data-testid="notification-identity-error"
      >
        {code ? t(`errors.${code}`, unknownError) : unknownError}
      </Notification>
    );
  }

  if (!identity.isSuccess) {
    return <LoadingSpinner data-testid="loading-spinner" />;
  }

  return <Outlet />;
};
