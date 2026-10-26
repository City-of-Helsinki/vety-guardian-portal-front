import { DependantItem } from '../dependant-item';
import styles from './DependantList.module.css';
import { LoadingSpinner, Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';

import { useQuery } from '@tanstack/react-query';

import {
  vtjIsProtectedFamilyRetrieveOptions,
  vtjDependantsRetrieveOptions,
} from '../../api/generated/@tanstack/react-query.gen';

// Fetches the logged-in guardian's family from VTJ and saves it to the backend DB, so it is not refetched automatically.
function useFamilyProtectionStatus() {
  return useQuery({
    ...vtjIsProtectedFamilyRetrieveOptions(),
    staleTime: Infinity,
    // Every VTJ query is logged. A failure is shown instead of retried.
    retry: false,
  });
}

// Reads the dependants saved by the family sync above, so it must run after it.
function useGuardianDependants(enabled: boolean) {
  return useQuery({
    ...vtjDependantsRetrieveOptions(),
    enabled,
  });
}

export const DependantList = () => {
  const { t } = useTranslation(['landing', 'errors']);

  const familyProtection = useFamilyProtectionStatus();
  const dependants = useGuardianDependants(familyProtection.data !== undefined);

  if (familyProtection.isError || dependants.isError) {
    // The backend's `code` (e.g. "vtj_person_not_found") is translated in Locize; `error` is only for developers.
    const code = (familyProtection.error ?? dependants.error)?.code;
    const unknownError = t(
      'errors.unknown',
      'Tapahtui virhe. Yritä myöhemmin uudelleen.',
    );
    return (
      <Notification
        type="error"
        label={t('error')}
        data-testid="notification-landing-error"
      >
        {code ? t(`errors.${code}`, unknownError) : unknownError}
      </Notification>
    );
  }

  if (familyProtection.isPending || dependants.isPending) {
    return <LoadingSpinner data-testid="loading-spinner" />;
  }

  const isProtectedFamily = familyProtection.data.isProtectedFamily;
  const items = dependants.data.dependants;

  return (
    <div className={styles.items} data-testid="dependant-list">
      {isProtectedFamily && (
        <Notification
          type="alert"
          label={t('turvakieltoTitle')}
          data-testid="notification-turvakielto"
        >
          {t('turvakieltoText')}
        </Notification>
      )}
      {items.length === 0 && (
        <p data-testid="text-no-dependants">{t('noDependants')}</p>
      )}
      {items.map((item, index) => (
        <DependantItem
          key={item.id}
          item={item}
          index={index}
          canApply={!isProtectedFamily}
        />
      ))}
    </div>
  );
};
