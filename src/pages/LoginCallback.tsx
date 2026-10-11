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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState<OidcClientError>();

  return (
    <LoginCallbackHandler
      onSuccess={() => navigate('/landing', { replace: true })}
      onError={(error) => {
        // LoginCallbackHandler handles the callback on every render; a re-render while
        // the first one is still in progress reports this error, which is not a failure.
        if (error && !isHandlingLoginCallbackError(error)) setError(error);
      }}
    >
      {error ? (
        <Notification
          type="error"
          label={t('login.error', 'Kirjautuminen epäonnistui')}
          data-testid="notification-login-error"
        >
          <p>{error.message}</p>
          <Link to="/">{t('login.backToHome', 'Palaa etusivulle')}</Link>
        </Notification>
      ) : (
        <LoadingSpinner data-testid="loading-spinner" />
      )}
    </LoginCallbackHandler>
  );
};
