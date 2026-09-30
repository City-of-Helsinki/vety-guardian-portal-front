import { createContext, useContext } from 'react';

interface StepsCtx {
  goToStep: (id: string) => void;
  currentId: string;
}

const StepsContext = createContext<StepsCtx | null>(null);

export const StepsContextProvider = StepsContext.Provider;

export const useSteps = () => {
  const ctx = useContext(StepsContext);
  if (!ctx)
    throw new Error('useSteps must be used inside ApplicationFormSteps');

  return ctx;
};
