import type React from 'react';
import styles from './ApplicationForm.module.css';

interface ApplicationFormStepProps {
  title: string;
  headingId?: string;
  children: React.ReactNode;
  'data-testid'?: string;
}

export const ApplicationFormStep = ({
  title,
  headingId,
  children,
  'data-testid': dataTestId,
}: ApplicationFormStepProps) => {
  return (
    <div className={styles['step-container']} data-testid={dataTestId}>
      <h2
        id={headingId}
        tabIndex={-1}
        data-step-heading
        data-testid={dataTestId && `${dataTestId}-title`}
      >
        {title}
      </h2>
      {children}
    </div>
  );
};
