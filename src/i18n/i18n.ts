import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-locize-backend';
import { config } from '../config';

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
    backend: {
      projectId: config.locizeProjectId,
      cdnType: 'standard',
    },
  });

export default i18n;
