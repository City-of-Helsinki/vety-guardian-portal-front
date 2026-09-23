import { useTranslation } from 'react-i18next';
import { ApplicationFormStep } from '../ApplicationFormStep';
import { Link } from 'hds-react';
import { Divider } from '../../divider';

export const Esikatselu = ({}) => {
  const { t } = useTranslation('lomake');
  return (
    <ApplicationFormStep title={t('esikatselu.title')}>
      <Divider />
      <p>{t('esikatselu.lapsenTiedotText')}</p>
      <Link external href="">
        {t('esikatselu.digiJaVaestoAnchor')}
      </Link>
      <h3>{t('esikatselu.lapsenTiedotTitle')}</h3>
      <p>...</p>
      <Divider />
      <h3>{t('esikatselu.ilmoittautuminenTitle')}</h3>
      <p>{t('esikatselu.ilmoittautuminenText')}</p>
      <Divider />
    </ApplicationFormStep>
  );
};
