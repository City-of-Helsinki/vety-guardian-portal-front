import { DependantList } from '../components/dependant-list';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router';
import { Divider } from '../components/divider';
import { useGuardian } from '../auth/guardianContext';

export const Landing = ({}) => {
  const { t } = useTranslation();
  const { ssn } = useGuardian();

  if (!ssn) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <h1>{t('landing.title')}</h1>
      <Divider />
      <DependantList guardianSsn={ssn} />
    </>
  );
};
