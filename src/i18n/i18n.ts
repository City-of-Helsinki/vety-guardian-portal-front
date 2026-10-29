import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-locize-backend';
import { config } from '../config';

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});
export const SUPPORTED_LANGUAGES = ['fi', 'en', 'sv'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const toLanguage = (lng?: string): Language =>
  SUPPORTED_LANGUAGES.find((supported) => supported === lng) ?? 'fi';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'fi',
    supportedLngs: [...SUPPORTED_LANGUAGES],
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
      // Must match the project's CDN type in Locize: 'standard' loads from https://api.lite.locize.app,
      // 'pro' from https://api.locize.app. If you change it, change LOCIZE_CDN_URL in
      // vety-guardian-portal-back too (it reads the same translations for the application PDF).
      cdnType: 'standard',
    },
  });

export default i18n;
