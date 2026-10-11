import { DependantList } from '../components/dependant-list';
import { useTranslation } from 'react-i18next';
import { Divider } from '../components/divider';

export const Landing = ({}) => {
  const { t } = useTranslation();

  return (
    <>
      <h1 data-testid="title-landing">{t('landing.title')}</h1>
      <Divider />
      <DependantList />
    </>
  );
};
