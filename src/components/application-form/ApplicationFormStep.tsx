import type React from 'react';
import styles from './ApplicationForm.module.css';

interface ApplicationFormStepProps {
  title: string;
  children: React.ReactNode;
  'data-testid'?: string;
}

export const ApplicationFormStep = ({
  title,
  children,
  'data-testid': dataTestId,
}: ApplicationFormStepProps) => {
  return (
    <div className={styles['step-container']} data-testid={dataTestId}>
      <h2 data-testid={dataTestId && `${dataTestId}-title`}>{title}</h2>
      {children}
    </div>
  );
};
