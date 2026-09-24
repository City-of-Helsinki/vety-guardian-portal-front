import { Button, ButtonVariant } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { MOCK_GUARDIANS, useGuardian } from '../auth/guardianContext';

export const Home = ({}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useGuardian();

  const loginAs = (ssn: string) => {
    login(ssn);
    navigate('/landing');
  };

  return (
    <>
      <h1>{t('title')}</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {MOCK_GUARDIANS.map((guardian) => (
          <Button
            key={guardian.ssn}
            variant={ButtonVariant.Primary}
            onClick={() => loginAs(guardian.ssn)}
          >
            {`Login: ${guardian.label} (${guardian.ssn})`}
            {/*
            {t('login.asGuardian', {
              name: guardian.label,
              ssn: guardian.ssn,
            })}
            */}
          </Button>
        ))}
      </div>
    </>
  );
};
