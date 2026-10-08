import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-locize-backend';
import { config } from '../config';

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'fi',
    supportedLngs: ['fi', 'en', 'sv'],
    ns: ['etusivu', 'lomake'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: [
        'querystring',
        'cookie',
        'localStorage',
        'sessionStorage',
        'navigator',
      ],
      convertDetectedLanguage: (lng) => lng.split('-')[0],
    },
    backend: {
      projectId: config.locizeProjectId,
      cdnType: 'standard',
    },
  });

export default i18n;
