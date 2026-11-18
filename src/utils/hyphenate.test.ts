import { describe, expect, it } from 'vitest';
import { hyphenate } from './hyphenate';

const SOFT_HYPHEN = '­';
const showBreaks = (text: string) => text.replaceAll(SOFT_HYPHEN, '|');

describe('hyphenate', () => {
  it('adds soft hyphens to Finnish words', () => {
    expect(showBreaks(hyphenate('varhaiskasvatushakemus', 'fi'))).toBe(
      'var|hais|kas|va|tus|ha|ke|mus',
    );
  });

  it('hyphenates each word in a Finnish phrase and keeps spaces', () => {
    expect(showBreaks(hyphenate('Hakemuksen tiedot', 'fi'))).toBe(
      'Ha|ke|muk|sen tie|dot',
    );
  });

  it('adds soft hyphens to Swedish words', () => {
    expect(showBreaks(hyphenate('förskoleansökan', 'sv'))).toBe(
      'för|sko|le|an|sö|kan',
    );
  });

  it('leaves English text to the browser', () => {
    expect(hyphenate('applicationinformation', 'en')).toBe(
      'applicationinformation',
    );
  });

  it('leaves short words unchanged', () => {
    expect(hyphenate('talo', 'fi')).toBe('talo');
    expect(hyphenate('hus', 'sv')).toBe('hus');
  });

  it('only inserts soft hyphens, never changes the text itself', () => {
    const text = 'Varhaiskasvatuksen palveluseteli';
    expect(hyphenate(text, 'fi').replaceAll(SOFT_HYPHEN, '')).toBe(text);
  });

  it('returns an empty string unchanged', () => {
    expect(hyphenate('', 'fi')).toBe('');
  });
});
