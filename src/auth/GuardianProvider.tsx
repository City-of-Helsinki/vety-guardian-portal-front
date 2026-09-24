import { useState } from 'react';
import type React from 'react';
import { GuardianContext } from './guardianContext';

const STORAGE_KEY = 'mockGuardianSsn';

const readStoredSsn = (): string | undefined => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) ?? undefined;
  } catch {
    return undefined;
  }
};

const storeSsn = (ssn: string | undefined) => {
  try {
    if (ssn) {
      sessionStorage.setItem(STORAGE_KEY, ssn);
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage unavailable: the login lasts until page reload.
  }
};

// NOTE: Mock login until Suomi.fi authentication exists.
export const GuardianProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ssn, setSsn] = useState(readStoredSsn);

  const login = (newSsn: string) => {
    storeSsn(newSsn);
    setSsn(newSsn);
  };

  const logout = () => {
    storeSsn(undefined);
    setSsn(undefined);
  };

  return (
    <GuardianContext.Provider value={{ ssn, login, logout }}>
      {children}
    </GuardianContext.Provider>
  );
};
