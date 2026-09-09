import type { Dependant } from '../../types';
import { DependantIcon } from '../dependant-icon';
import styles from './DependantItem.module.css';
import { Link } from 'hds-react';
import { useTranslation } from 'react-i18next';

interface DependantItemProps {
  item: Dependant;
}

export const DependantItem = ({ item }: DependantItemProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.item}>
      <div className={styles['dependant-card']}>
        <div className={styles['dependant-icon']}>
          <DependantIcon />
        </div>
        <div className={styles['basic-info']}>
          <span className={styles['age-text']}>12.12.2024 - 1v 8kk</span>
          <h2 className={styles['dependant-name']}>{item.nimi}</h2>
        </div>
      </div>
      {item?.id > 1 && (
        <div className={styles['application-card']}>
          <div className={styles['application-card-content']}>
            <h3>{t('landing.applicationTitle')}</h3>
            <p>{t('landing.applicationDescription')}</p>
            <Link useButtonStyles href="/application">
              {t('landing.applicationLink')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
