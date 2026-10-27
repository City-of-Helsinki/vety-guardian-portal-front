import { LoginButton, useAuthenticatedUser } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router';

export const Home = () => {
  const { t, i18n } = useTranslation();
  const user = useAuthenticatedUser();

  if (user) {
    return <Navigate to="/landing" replace />;
  }

  return (
    <>
      <h1 data-testid="title-home">{t('title')}</h1>
      <LoginButton
        data-testid="btn-login"
        errorText={t('login.error', 'Kirjautuminen epäonnistui')}
        loggingInText={t('login.loggingIn', 'Kirjaudutaan sisään')}
        redirectionProps={{ language: i18n.resolvedLanguage }}
      >
        {t('login.button', 'Kirjaudu sisään')}
      </LoginButton>
    </>
  );
};
