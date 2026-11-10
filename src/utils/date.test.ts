import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ageFromIso, isoToDisplay, isoToHelsinkiIsoDate } from './date';

describe('isoToDisplay', () => {
  it('formats an ISO date for display', () => {
    expect(isoToDisplay('2026-03-05')).toBe('5.3.2026');
  });

  it('returns an empty string for missing or invalid input', () => {
    expect(isoToDisplay(null)).toBe('');
    expect(isoToDisplay('not-a-date')).toBe('');
  });
});

describe('isoToHelsinkiIsoDate', () => {
  it('converts a UTC timestamp to the Helsinki calendar date', () => {
    expect(isoToHelsinkiIsoDate('2026-10-20T22:30:00Z')).toBe('2026-10-21');
  });
});

describe('ageFromIso', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Local time, to match parseISO which reads date-only strings as local midnight.
    vi.setSystemTime(new Date(2026, 10, 9, 12, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns full years and months', () => {
    expect(ageFromIso('2024-03-09')).toEqual({ years: 2, months: 8 });
  });

  it('counts only completed months', () => {
    expect(ageFromIso('2024-03-10')).toEqual({ years: 2, months: 7 });
  });

  it('returns whole years on the birthday', () => {
    expect(ageFromIso('2020-11-09')).toEqual({ years: 6, months: 0 });
  });

  it('returns zeros for less than a month', () => {
    expect(ageFromIso('2026-10-20')).toEqual({ years: 0, months: 0 });
  });

  it('returns undefined for missing or invalid input', () => {
    expect(ageFromIso(undefined)).toBeUndefined();
    expect(ageFromIso(null)).toBeUndefined();
    expect(ageFromIso('')).toBeUndefined();
    expect(ageFromIso('not-a-date')).toBeUndefined();
  });
});
