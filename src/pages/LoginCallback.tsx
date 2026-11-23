import { useState } from 'react';
import {
  isHandlingLoginCallbackError,
  LoadingSpinner,
  LoginCallbackHandler,
  Notification,
  type OidcClientError,
} from 'hds-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';

// Helsinki-profiili redirects here after login (redirect_uri in src/auth/loginProviderProps.ts).
export const LoginCallback = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [error, setError] = useState<OidcClientError>();

  if (error) {
    return (
      <Notification
        type="error"
        label={t('login.error', 'Kirjautuminen epäonnistui')}
        data-testid="notification-login-error"
      >
        <p>
          {t(
            'login.errorText',
            'Kirjautuminen epäonnistui. Yritä myöhemmin uudelleen.',
          )}
        </p>
        <Link to="/">{t('login.backToHome', 'Palaa etusivulle')}</Link>
      </Notification>
    );
  }

  return (
    <LoginCallbackHandler
      onSuccess={() => navigate('/landing', { replace: true })}
      onError={(callbackError) => {
        // A re-render while the first callback is still in progress reports this
        // error, which is not a failure.
        if (callbackError && !isHandlingLoginCallbackError(callbackError)) {
          setError((current) => current ?? callbackError);
        }
      }}
    >
      <LoadingSpinner data-testid="loading-spinner" />
    </LoginCallbackHandler>
  );
};
