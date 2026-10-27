import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import { useApplicationData } from '../ApplicationDataContext';
import { Button, ButtonVariant, IconDownload, Notification } from 'hds-react';
import { useMutation } from '@tanstack/react-query';
import { Divider } from '../../divider';
import { LabelValue, LabelValueWrapper, SummarySection } from '../../summary';
import { TextButton } from '../../text-button';
import type { FormValues } from '../../../types';
import { MarkdownContent } from '../../markdown-content';
import { useSteps } from '../StepsContext';
import { isoToDisplay, isoToHelsinkiIsoDate } from '../../../utils/date';
import { preschoolApplicationFormPdfRetrieve } from '../../../api/generated';
import type { PreschoolApplication } from '../../../api/generated';
import { toLanguage } from '../../../i18n/i18n';

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

// The PDF version of this view is rendered by the backend:
// vety-guardian-portal-back/guardian/templates/guardian/application_pdf.html — keep in sync.
export const Esikatselu = () => {
  const { t, i18n } = useTranslation('lomake');
  const application = useApplicationData();
  const values = useFormContext<FormValues>().getValues();

  const { goToStep } = useSteps();

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

  const laajuus = [];
  if (values.hoidonTarve) {
    laajuus.push(t(`vakaOptions.${values.hoidonTarve}`));
  }
  if (values.palvelunTarve) {
    laajuus.push(t(`vakaOptions.${values.palvelunTarve}`));
  }

  return (
    <ApplicationFormStep
      data-testid="step-esikatselu"
      title={t('esikatselu.title')}
    >
      {application.status === 'submitted' && (
        <>
          <Notification
            type="info"
            label={t('esikatselu.alreadySubmitted')}
            data-testid="notification-already-submitted"
          />
          <Button
            type="button"
            variant={ButtonVariant.Secondary}
            iconStart={<IconDownload />}
            data-testid="button-lataa-pdf"
            disabled={downloadPdf.isPending}
            onClick={() => downloadPdf.mutate()}
            style={{ marginTop: '1rem', width: 'fit-content' }}
          >
            {t('esikatselu.lataaPdf')}
          </Button>
          {downloadPdf.isError && (
            <Notification
              type="error"
              label={t('esikatselu.pdfError')}
              data-testid="notification-pdf-error"
              style={{ marginTop: '1rem' }}
            />
          )}
        </>
      )}
      <Divider />
      <SummarySection
        data-testid="section-lapsen-tiedot"
        title={t('esikatselu.lapsenTiedotTitle')}
      >
        <MarkdownContent data-testid="text-lapsen-tiedot">
          {t('esikatselu.lapsenTiedotText')}
        </MarkdownContent>
        <LabelValueWrapper>
          <LabelValue
            data-testid="summary-lapsi-nimi"
            label={t('esikatselu.lapsenNimi')}
            value={application.nimi}
          />
        </LabelValueWrapper>
        <LabelValueWrapper>
          <LabelValue
            data-testid="summary-lapsi-henkilotunnus"
            label={t('esikatselu.henkilotunnus')}
            value={application.henkilotunnus}
          />
          <LabelValue
            data-testid="summary-lapsi-syntymavuosi"
            label={t('esikatselu.syntymavuosi')}
            value={String(application.syntymavuosi ?? '')}
          />
          <LabelValue
            data-testid="summary-lapsi-karttaosoite"
            label={t('esikatselu.karttaosoite')}
            value={application.karttaosoite}
          />
        </LabelValueWrapper>
      </SummarySection>
      <h3 data-testid="title-ilmoittautuminen">
        {t('esikatselu.ilmoittautuminenTitle')}
      </h3>
      <MarkdownContent data-testid="text-ilmoittautuminen">
        {t('esikatselu.ilmoittautuminenText')}
      </MarkdownContent>
      <Divider />
      <LabelValueWrapper>
        <LabelValue
          data-testid="summary-esiopetus-alkaa"
          label={t('esikatselu.esiopetusAlkaa')}
          value={t('esiopetusAlkaa')}
        />
      </LabelValueWrapper>
      <Divider />
      <SummarySection
        data-testid="section-kieli"
        title={t('esikatselu.kieli')}
        sectionLink={
          application.status !== 'submitted' ? (
            <TextButton
              data-testid="go-to-kieli"
              label={t('edit')}
              aria-label={`${t('edit')}: ${t('esikatselu.kieli')}`}
              onClick={() => goToStep('kieli')}
            />
          ) : null
        }
      >
        {t(`language.${values.kieli}`)}
      </SummarySection>
      <SummarySection
        data-testid="section-tuki-ja-laakehoito"
        title={t('esikatselu.tukiJaLaakehoito')}
        sectionLink={
          application.status !== 'submitted' ? (
            <TextButton
              data-testid="go-to-tuki-ja-laakehoito"
              label={t('edit')}
              aria-label={`${t('edit')}: ${t('esikatselu.tukiJaLaakehoito')}`}
              onClick={() => goToStep('tuki-ja-laakehoito')}
            />
          ) : null
        }
      >
        {!values.erityisenTuenTarve && !values.laakehoidonTarve ? (
          t('esikatselu.eiTuenTaiLaakehoidonTarvetta')
        ) : (
          <div>
            {values.erityisenTuenTarve && (
              <p data-testid="summary-erityinen-tuki">
                {t('tukiJaLaakehoito.erityinenTukiLabel')}
              </p>
            )}
            {values.laakehoidonTarve && (
              <p data-testid="summary-laakehoito">
                {t('tukiJaLaakehoito.laakehoitoLabel')}
              </p>
            )}
          </div>
        )}
      </SummarySection>
      <SummarySection
        data-testid="section-varhaiskasvatus"
        title={t('esikatselu.varhaiskasvatus')}
        sectionLink={
          application.status !== 'submitted' ? (
            <TextButton
              data-testid="go-to-taydentava"
              label={t('edit')}
              aria-label={`${t('edit')}: ${t('esikatselu.varhaiskasvatus')}`}
              onClick={() => goToStep('taydentava')}
            />
          ) : null
        }
      >
        <LabelValueWrapper>
          <LabelValue
            data-testid="summary-taydentava-alkaa"
            label={t('esikatselu.taydentavaAlkaa')}
            value={isoToDisplay(values.taydentavaVarhaiskasvatusAloitus)}
          />
          <LabelValue
            data-testid="summary-taydentava-laajuus"
            label={t('esikatselu.taydentavaLaajuus')}
            value={laajuus}
          />
        </LabelValueWrapper>
        <LabelValueWrapper>
          <LabelValue
            data-testid="summary-arkipoissaolot"
            label={t('esikatselu.arkipoissaolot')}
            value={
              values.taydentavaVarhaiskasvatus
                ? values.arkipoissaolotLkm?.toString()
                : null
            }
          />
        </LabelValueWrapper>
      </SummarySection>
      <SummarySection
        data-testid="section-huoltajan-tiedot"
        title={t('esikatselu.huoltajanTiedotTitle')}
      >
        <LabelValueWrapper>
          <LabelValue
            data-testid="summary-h1-nimi"
            label={t('esikatselu.huoltajanNimi')}
            value={application.h1Nimi}
          />
          <LabelValue
            data-testid="summary-h1-henkilotunnus"
            label={t('esikatselu.henkilotunnus')}
            value={application.h1Henkilotunnus}
          />
        </LabelValueWrapper>
        <LabelValueWrapper>
          <LabelValue
            data-testid="summary-h1-osoite"
            label={t('esikatselu.osoite')}
            value={application.h1Osoite}
          />
        </LabelValueWrapper>
        <LabelValueWrapper>
          <LabelValue
            data-testid="summary-h1-puhelinnumero"
            label={t('esikatselu.puhelinnumero')}
            value={values.h1Puhelinnumero}
          />
          <LabelValue
            data-testid="summary-h1-sahkoposti"
            label={t('esikatselu.sahkoposti')}
            value={values.h1Sahkoposti}
          />
        </LabelValueWrapper>
      </SummarySection>

      {application.h2Nimi && (
        <SummarySection
          data-testid="section-muut-huoltajat"
          title={t('esikatselu.muutHuoltajatTitle')}
        >
          <p data-testid="text-muut-huoltajat">
            {t('esikatselu.muutHuoltajatText')}
          </p>
          <LabelValueWrapper>
            <LabelValue
              data-testid="summary-h2-nimi"
              label={t('esikatselu.huoltajanNimi')}
              value={[application.h2Nimi]}
            />
            <LabelValue
              data-testid="summary-h2-henkilotunnus"
              label={t('esikatselu.henkilotunnus')}
              value={application.h2Henkilotunnus}
            />
          </LabelValueWrapper>
          <LabelValueWrapper>
            <LabelValue
              data-testid="summary-h2-osoite"
              label={t('esikatselu.osoite')}
              value={application.h2Osoite}
            />
          </LabelValueWrapper>
          <LabelValueWrapper>
            <LabelValue
              data-testid="summary-h2-puhelinnumero"
              label={t('esikatselu.puhelinnumero')}
              value={values.h2Puhelinnumero}
            />
            <LabelValue
              data-testid="summary-h2-sahkoposti"
              label={t('esikatselu.sahkoposti')}
              value={values.h2Sahkoposti}
            />
          </LabelValueWrapper>
        </SummarySection>
      )}
    </ApplicationFormStep>
  );
};
