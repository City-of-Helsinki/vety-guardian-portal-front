import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-locize-backend';

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
    backend: {
      projectId: import.meta.env.VITE_LOCIZE_PROJECT_ID,
      cdnType: 'standard',
    },
  });

export default i18n;
