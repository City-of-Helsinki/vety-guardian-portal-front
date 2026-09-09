import type React from 'react';
import styles from './ApplicationForm.module.css';

interface ApplicationFormStepProps {
  title: string;
  children: React.ReactNode;
}

export const ApplicationFormStep = ({
  title,
  children,
}: ApplicationFormStepProps) => {
  return (
    <div className={styles['step-container']}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};
