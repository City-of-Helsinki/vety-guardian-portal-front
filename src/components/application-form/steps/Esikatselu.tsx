import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import { useApplicationData } from '../ApplicationDataContext';
import { Link, Notification } from 'hds-react';
import { Divider } from '../../divider';
import { LabelValue, LabelValueWrapper, SummarySection } from '../../summary';
import type { FormValues } from '../../../types';

export const Esikatselu = ({}) => {
  const { t } = useTranslation('lomake');
  const application = useApplicationData();
  const values = useFormContext<FormValues>().getValues();

  return (
    <ApplicationFormStep title={t('esikatselu.title')}>
      {application.status === 'submitted' && (
        <Notification type="info" label={t('esikatselu.alreadySubmitted')} />
      )}
      <Divider />
      <SummarySection title={t('esikatselu.lapsenTiedotTitle')}>
        <p>{t('esikatselu.lapsenTiedotText')}</p>
        <Link external href="">
          {t('esikatselu.digiJaVaestoAnchor')}
        </Link>
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

      <h3>{t('esikatselu.ilmoittautuminenTitle')}</h3>
      <p>{t('esikatselu.ilmoittautuminenText')}</p>
      <Divider />
    </ApplicationFormStep>
  );
};
