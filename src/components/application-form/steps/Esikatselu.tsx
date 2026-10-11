import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import { useApplicationData } from '../ApplicationDataContext';
import { Notification } from 'hds-react';
import { Divider } from '../../divider';
import { LabelValue, LabelValueWrapper, SummarySection } from '../../summary';
import { TextButton } from '../../text-button';
import type { FormValues } from '../../../types';
import { MarkdownContent } from '../../markdown-content';
import { useSteps } from '../StepsContext';
import { isoToDisplay } from '../../../utils/date';

export const Esikatselu = ({}) => {
  const { t } = useTranslation('lomake');
  const application = useApplicationData();
  const values = useFormContext<FormValues>().getValues();

  const { goToStep } = useSteps();

  const laajuus = [];
  if (values.hoidonTarve) {
    laajuus.push(t(`taydentava.options.${values.hoidonTarve}`));
  }
  if (values.palvelunTarve) {
    laajuus.push(t(`taydentava.options.${values.palvelunTarve}`));
  }

  return (
    <ApplicationFormStep
      data-testid="step-esikatselu"
      title={t('esikatselu.title')}
    >
      {application.status === 'submitted' && (
        <Notification
          type="info"
          label={t('esikatselu.alreadySubmitted')}
          data-testid="notification-already-submitted"
        />
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
                {t('tukiJaLaakehoito.laakehoitoLabel')}
              </p>
            )}
            {values.laakehoidonTarve && (
              <p data-testid="summary-laakehoito">
                {t('tukiJaLaakehoito.erityinenTukiLabel')}
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
