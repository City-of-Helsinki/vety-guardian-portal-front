import './App.css';
import { useTranslation } from 'react-i18next';
import { Footer, Header, Logo, logoFi, logoSv } from 'hds-react';

function App() {
  const { t, i18n } = useTranslation();

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
        defaultLanguage={i18n.language}
      >
        <Header.ActionBar
          className=""
          frontPageLabel="test"
          title="test"
          titleHref="#"
          logo={
            <Logo src={i18n.language === 'sv' ? logoSv : logoFi} alt="asd" />
          }
        >
          <Header.LanguageSelector />
        </Header.ActionBar>
      </Header>
      <section style={{ flexGrow: 1 }}>
        <h1>{t('title')}</h1>
      </section>
      <Footer></Footer>
    </>
  );
}

export default App;
