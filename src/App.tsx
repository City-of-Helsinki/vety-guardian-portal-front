import './App.css';
import { useTranslation } from 'react-i18next';
import {
  Footer,
  Header,
  IconSignout,
  IconUser,
  Logo,
  logoFi,
  logoSv,
  SessionEndedHandler,
  useAuthenticatedUser,
  useOidcClientTracking,
  WithAuthenticatedUser,
  WithoutAuthenticatedUser,
} from 'hds-react';
import { Outlet } from 'react-router';
import { toLanguage } from './i18n/i18n';

function App() {
  const { t, i18n } = useTranslation();
  const language = toLanguage(i18n.resolvedLanguage);
  // useAuthenticatedUser() and With(out)AuthenticatedUser only read the current user;
  // useOidcClientTracking re-renders the header when the login state changes (e.g. right after the login callback).
  useOidcClientTracking();
  const user = useAuthenticatedUser();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const languages = [
    { label: 'Suomi', value: 'fi', isPrimary: true },
    { label: 'Svenska', value: 'sv', isPrimary: true },
    { label: 'English', value: 'en', isPrimary: true },
  ];

  return (
    <>
      <Header
        languages={languages}
        onDidChangeLanguage={(newLanguage) => changeLanguage(newLanguage)}
        defaultLanguage={language}
      >
        <Header.ActionBar
          className=""
          frontPageLabel="test"
          title="test"
          titleHref="/"
          logoHref="/"
          logo={<Logo src={language === 'sv' ? logoSv : logoFi} alt="asd" />}
        >
          <Header.LanguageSelector />
          <WithAuthenticatedUser>
            <Header.ActionBarItem
              id="action-bar-user"
              label={user?.profile.given_name}
              icon={<IconUser />}
              fixedRightPosition
            >
              <Header.LogoutSubmenuButton
                id="btn-logout"
                label={t('login.logout', 'Kirjaudu ulos')}
                icon={<IconSignout />}
                errorLabel={t(
                  'login.logoutError',
                  'Uloskirjautuminen epäonnistui',
                )}
                errorText={t(
                  'login.logoutError',
                  'Uloskirjautuminen epäonnistui',
                )}
                errorCloseAriaLabel={t('common.close', 'Sulje')}
                loggingOutText={t('login.loggingOut', 'Kirjaudutaan ulos')}
                redirectWithLanguage
              />
            </Header.ActionBarItem>
          </WithAuthenticatedUser>
          <WithoutAuthenticatedUser>
            <Header.LoginButton
              id="btn-header-login"
              label={t('login.button', 'Kirjaudu sisään')}
              errorLabel={t('login.error', 'Kirjautuminen epäonnistui')}
              errorText={t('login.error', 'Kirjautuminen epäonnistui')}
              errorCloseAriaLabel={t('common.close', 'Sulje')}
              loggingInText={t('login.loggingIn', 'Kirjaudutaan sisään')}
              redirectWithLanguage
              fixedRightPosition
            />
          </WithoutAuthenticatedUser>
        </Header.ActionBar>
      </Header>
      <SessionEndedHandler
        content={{
          title: t('login.sessionEndedTitle', 'Istunto on päättynyt'),
          text: t(
            'login.sessionEndedText',
            'Olet kirjautunut ulos. Kirjaudu uudelleen jatkaaksesi.',
          ),
          buttonText: t('login.logout', 'Kirjaudu ulos'),
          closeButtonLabelText: t('common.close', 'Sulje'),
        }}
      />
      <section className="main-container">
        <div className="main-content">
          <Outlet />
        </div>
      </section>
      <Footer></Footer>
    </>
  );
}

export default App;
