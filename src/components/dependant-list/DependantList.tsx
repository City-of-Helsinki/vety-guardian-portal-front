import { DependantItem } from '../dependant-item';
import styles from './DependantList.module.css';
import { LoadingSpinner, Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';

import { useQuery } from '@tanstack/react-query';

import {
  vtjIsProtectedFamilyRetrieveOptions,
  vtjDependantsRetrieveOptions,
} from '../../api/generated/@tanstack/react-query.gen';

// Fetches the family from VTJ and saves it to the backend DB, so it is not refetched automatically.
function useFamilyProtectionStatus(guardianSsn: string) {
  return useQuery({
    ...vtjIsProtectedFamilyRetrieveOptions({
      query: { ssn: guardianSsn },
    }),
    staleTime: Infinity,
  });
}

// Reads the dependants saved by the family sync above, so it must run after it.
function useGuardianDependants(guardianSsn: string, enabled: boolean) {
  return useQuery({
    ...vtjDependantsRetrieveOptions({
      query: { ssn: guardianSsn },
    }),
    enabled,
  });
}

interface DependantListProps {
  guardianSsn: string;
}

export const DependantList = ({ guardianSsn }: DependantListProps) => {
  const { t } = useTranslation();

  const familyProtection = useFamilyProtectionStatus(guardianSsn);
  const dependants = useGuardianDependants(
    guardianSsn,
    familyProtection.data !== undefined,
  );

  if (familyProtection.isError || dependants.isError) {
    return (
      <Notification type="error" label={t('landing.error')}>
        {String((familyProtection.error ?? dependants.error)?.error ?? '')}
      </Notification>
    );
  }

  if (familyProtection.isPending || dependants.isPending) {
    return <LoadingSpinner />;
  }

  const isProtectedFamily = familyProtection.data.isProtectedFamily;
  const items = dependants.data.dependants;

  return (
    <div className={styles.items}>
      {isProtectedFamily && (
        <Notification type="alert" label={t('landing.turvakieltoTitle')}>
          {t('landing.turvakieltoText')}
        </Notification>
      )}
      {items.length === 0 && <p>{t('landing.noDependants')}</p>}
      {items.map((item) => (
        <DependantItem
          key={item.id}
          item={item}
          guardianSsn={guardianSsn}
          canApply={!isProtectedFamily}
        />
      ))}
    </div>
  );
};
