import { createContext, useContext } from 'react';

// NOTE: Mock login until Suomi.fi authentication exists. The SSNs are the adults in the backend VTJ mock server.
export const MOCK_GUARDIANS = [
  { ssn: '010101-0101', label: 'OtherParent Example' },
  { ssn: '010170-999X', label: 'Parent Example' },
  { ssn: '010101-0102', label: 'Person Protected' },
];

interface GuardianContextValue {
  ssn?: string;
  login: (ssn: string) => void;
  logout: () => void;
}

export const GuardianContext = createContext<GuardianContextValue | undefined>(
  undefined,
);

export const useGuardian = () => {
  const context = useContext(GuardianContext);
  if (!context) {
    throw new Error('useGuardian must be used within a GuardianProvider');
  }
  return context;
};
