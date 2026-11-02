// Chrome and Edge don't hyphenate Finnish with CSS `hyphens: auto`, so long words are
// given soft hyphens (U+00AD) here instead. English is left to the browser.
import hyphenFi from 'hyphen/fi';
import hyphenSv from 'hyphen/sv';
import type { Language } from '../i18n/i18n';

const hyphenators: Partial<Record<Language, (text: string) => string>> = {
  fi: hyphenFi.hyphenateSync,
  sv: hyphenSv.hyphenateSync,
};

export const hyphenate = (text: string, language: Language): string =>
  hyphenators[language]?.(text) ?? text;
