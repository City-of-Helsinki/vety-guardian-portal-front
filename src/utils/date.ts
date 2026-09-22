// date-fns is a direct dependency here so this import doesn't rely on hds-react's
// transitive copy, but it's pinned to 2.30.0 to match hds-react's own dependency
// (see hds-react/package.json) — a newer major here would install a second, separate
// copy of date-fns alongside the one hds-react already bundles for DateInput.
import { format, isValid, parseISO } from 'date-fns';

export const ISO_DATE_FORMAT = 'yyyy-MM-dd';
export const DISPLAY_DATE_FORMAT = 'd.M.yyyy';

export const isValidDate = isValid;

export const dateToIso = (date: Date): string => format(date, ISO_DATE_FORMAT);

export const isoToDisplay = (iso?: string | null): string => {
  if (!iso) {
    return '';
  }
  const parsed = parseISO(iso);
  return isValid(parsed) ? format(parsed, DISPLAY_DATE_FORMAT) : '';
};
