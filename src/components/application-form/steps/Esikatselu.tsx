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
    <ApplicationFormStep title={t('esikatselu.title')}>
      {application.status === 'submitted' && (
        <Notification type="info" label={t('esikatselu.alreadySubmitted')} />
      )}
      <Divider />
      <SummarySection title={t('esikatselu.lapsenTiedotTitle')}>
        <MarkdownContent>{t('esikatselu.lapsenTiedotText')}</MarkdownContent>
        <LabelValueWrapper>
          <LabelValue
            label={t('esikatselu.lapsenNimi')}
            value={application.nimi}
          />
        </LabelValueWrapper>
        <LabelValueWrapper>
          <LabelValue
            label={t('esikatselu.henkilotunnus')}
            value={application.henkilotunnus}
          />
          <LabelValue
            label={t('esikatselu.syntymavuosi')}
            value={String(application.syntymavuosi ?? '')}
          />
          <LabelValue
            label={t('esikatselu.karttaosoite')}
            value={application.karttaosoite}
          />
        </LabelValueWrapper>
      </SummarySection>
      <h3>{t('esikatselu.ilmoittautuminenTitle')}</h3>
      <MarkdownContent>{t('esikatselu.ilmoittautuminenText')}</MarkdownContent>
      <Divider />
      <LabelValueWrapper>
        <LabelValue
          label={t('esikatselu.esiopetusAlkaa')}
          value={t('esiopetusAlkaa')}
        />
      </LabelValueWrapper>
      <Divider />
      <SummarySection
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
              <p>{t('tukiJaLaakehoito.laakehoitoLabel')}</p>
            )}
            {values.laakehoidonTarve && (
              <p>{t('tukiJaLaakehoito.erityinenTukiLabel')}</p>
            )}
          </div>
        )}
      </SummarySection>
      <SummarySection
        title={t('esikatselu.varhaiskasvatus')}
        sectionLink={
          application.status !== 'submitted' ? (
            <TextButton
              label={t('edit')}
              onClick={() => goToStep('taydentava')}
            />
          ) : null
        }
      >
        <LabelValueWrapper>
          <LabelValue
            label={t('esikatselu.taydentavaAlkaa')}
            value={isoToDisplay(values.taydentavaVarhaiskasvatusAloitus)}
          />
          <LabelValue
            label={t('esikatselu.taydentavaLaajuus')}
            value={laajuus}
          />
        </LabelValueWrapper>
      </SummarySection>
      <SummarySection title={t('esikatselu.huoltajanTiedotTitle')}>
        <LabelValueWrapper>
          <LabelValue
            label={t('esikatselu.huoltajanNimi')}
            value={application.h1Nimi}
          />
        </LabelValueWrapper>
        <LabelValueWrapper>
          <LabelValue
            label={t('esikatselu.osoite')}
            value={application.h1Osoite}
          />
        </LabelValueWrapper>
        <LabelValueWrapper>
          <LabelValue
            label={t('esikatselu.puhelinnumero')}
            value={values.h1Puhelinnumero}
          />
          <LabelValue
            label={t('esikatselu.sahkoposti')}
            value={values.h1Sahkoposti}
          />
        </LabelValueWrapper>
      </SummarySection>

      {application.h2Nimi && (
        <SummarySection title={t('esikatselu.muutHuoltajatTitle')}>
          <p>{t('esikatselu.muutHuoltajatText')}</p>
          <LabelValueWrapper>
            <LabelValue
              label={t('esikatselu.huoltajanNimi')}
              value={[application.h2Nimi]}
            />
          </LabelValueWrapper>
          <LabelValueWrapper>
            <LabelValue
              label={t('esikatselu.osoite')}
              value={application.h2Osoite}
            />
            <LabelValue
              label={t('esikatselu.sahkoposti')}
              value={values.h2Sahkoposti}
            />
          </LabelValueWrapper>
        </SummarySection>
      )}
    </ApplicationFormStep>
  );
};
