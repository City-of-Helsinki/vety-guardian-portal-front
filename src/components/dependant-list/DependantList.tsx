import type { Dependant } from '../../types';
import { DependantItem } from '../dependant-item';
import styles from './DependantList.module.css';

import { useQuery } from '@tanstack/react-query';

import {
  vtjIsProtectedFamilyRetrieveOptions,
  vtjDependantsRetrieveOptions,
  vtjGuardiansRetrieveOptions,
} from '../../api/generated/@tanstack/react-query.gen';

function useFamilyProtectionStatus(guardianSsn: string) {
  return useQuery(
    vtjIsProtectedFamilyRetrieveOptions({
      query: { ssn: guardianSsn },
    }),
  );
}

function useGuardianDependants(guardianSsn: string) {
  return useQuery(
    vtjDependantsRetrieveOptions({
      query: { ssn: guardianSsn },
    }),
  );
}

function useDependantGuardians(dependantId: string | undefined) {
  return useQuery({
    ...vtjGuardiansRetrieveOptions({
      path: { dependant_id: dependantId! },
    }),
    enabled: dependantId !== undefined,
  });
}

const mock: Dependant[] = [
  { id: 1, nimi: 'Testi 1' },
  { id: 2, nimi: 'Testi 2' },
  { id: 3, nimi: 'Testi 3' },
];

export const DependantList = ({ items = mock }) => {
  // NOTE: Testing Backend calls
  const hardcodedGuardianSsn: string = '010170-999X'; // NOTE: Hardcoded value from VTJ mock server

  const { data: familyProtection, isLoading: loadingProtection } =
    useFamilyProtectionStatus(hardcodedGuardianSsn);

  const { data: dependants, isLoading: loadingDependants } =
    useGuardianDependants(hardcodedGuardianSsn);

  console.log('hardcodedGuardianSsn', hardcodedGuardianSsn);
  console.log('familyProtection', familyProtection);
  console.log('dependants', dependants);
  //const { data: guardians, isLoading: loadingGuardians } = useDependantGuardians(selectedDependantId);

  return (
    <div className={styles.items}>
      {items.map((item, index) => (
        <DependantItem key={index} item={item} />
      ))}
    </div>
  );
};
