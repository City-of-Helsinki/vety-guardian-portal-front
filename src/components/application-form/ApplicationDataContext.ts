import { createContext, useContext } from 'react';
import type { PreschoolApplication } from '../../api/generated';

// The loaded application, including the read-only VTJ fields that are not part of the form state.
export const ApplicationDataContext = createContext<
  PreschoolApplication | undefined
>(undefined);

export const useApplicationData = () => {
  const application = useContext(ApplicationDataContext);
  if (!application) {
    throw new Error(
      'useApplicationData must be used within ApplicationDataContext',
    );
  }
  return application;
};
