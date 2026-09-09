import { Link } from 'hds-react';
import { useTranslation } from 'react-i18next';

export const Home = ({}) => {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t('title')}</h1>
      <Link useButtonStyles href="/landing">
        "Login"
      </Link>
    </>
  );
};
