import { DependantList } from '../components/dependant-list';
import { useTranslation } from 'react-i18next';
import { Divider } from '../components/divider';

export const Landing = () => {
  const { t } = useTranslation('landing');

  return (
    <>
      <h1 data-testid="title-landing">{t('title')}</h1>
      <Divider />
      <DependantList />
    </>
  );
};
