import { Button, ButtonVariant, IconDownload, Notification } from 'hds-react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { preschoolApplicationFormPdfRetrieve } from '../../api/generated';
import type { PreschoolApplication } from '../../api/generated';
import { toLanguage } from '../../i18n/i18n';
import { isoToHelsinkiIsoDate } from '../../utils/date';
import styles from './PdfDownloadButton.module.css';

// Max length of the file name without ".pdf", in characters (Unicode code points, not UTF-16 units).
const FILENAME_MAX_LENGTH = 100;

// Control characters (tab, newline...) count as spaces, invisible format characters (bidi overrides,
// zero-width characters...) and characters not allowed in file names are dropped, spaces become underscores.
const filenamePart = (text: string) =>
  text
    .replace(/\p{Cc}/gu, ' ')
    .replace(/\p{Cf}/gu, '')
    .replace(/[\\/:*?"<>|]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .join('_');

// E.g. "esiopetusilmoittautuminen_2026-10-20_Testi_Lapsi.pdf": the submission date in Helsinki time and the child's name,
// cut to FILENAME_MAX_LENGTH characters before ".pdf".
// Keep in sync with application_pdf_filename in vety-guardian-portal-back/guardian/pdf.py
const pdfFilename = (application: PreschoolApplication) => {
  const filename = [
    'esiopetusilmoittautuminen',
    isoToHelsinkiIsoDate(application.submittedAt),
    filenamePart(application.nimi),
  ]
    .filter(Boolean)
    .join('_');
  // Array.from splits by code point, so an emoji isn't cut in half.
  return `${Array.from(filename).slice(0, FILENAME_MAX_LENGTH).join('').replace(/_+$/, '')}.pdf`;
};

const saveFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

interface PdfDownloadButtonProps {
  // A submitted application; the backend returns 404 for drafts.
  application: PreschoolApplication;
  // The button's data-testid; the error notification gets `${data-testid}-error`.
  'data-testid'?: string;
}

/** Downloads the application as a PDF, rendered by the backend in the current UI language. */
export const PdfDownloadButton = ({
  application,
  'data-testid': dataTestId,
}: PdfDownloadButtonProps) => {
  const { t, i18n } = useTranslation('lomake');

  const downloadPdf = useMutation({
    mutationFn: async () => {
      const { data } = await preschoolApplicationFormPdfRetrieve({
        path: { uuid: application.id },
        query: { lang: toLanguage(i18n.resolvedLanguage) },
        parseAs: 'blob',
        throwOnError: true,
      });
      saveFile(data, pdfFilename(application));
    },
  });

  return (
    <div className={styles.container}>
      <Button
        type="button"
        variant={ButtonVariant.Secondary}
        iconStart={<IconDownload />}
        data-testid={dataTestId}
        disabled={downloadPdf.isPending}
        onClick={() => downloadPdf.mutate()}
      >
        {t('esikatselu.lataaPdf')}
      </Button>
      {downloadPdf.isError && (
        <Notification
          type="error"
          label={t('esikatselu.pdfError')}
          data-testid={dataTestId && `${dataTestId}-error`}
        />
      )}
    </div>
  );
};
