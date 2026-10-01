import type React from 'react';
import { Divider } from '../divider';
import styles from './Summary.module.css';

interface SummarySectionProps {
  title: string;
  sectionLink?: React.ReactNode;
  children: React.ReactNode;
  'data-testid'?: string;
}

export const SummarySection = ({
  title,
  sectionLink,
  children,
  'data-testid': dataTestId,
}: SummarySectionProps) => {
  return (
    <section className={styles.section} data-testid={dataTestId}>
      <div className={styles['section-title']}>
        <h3 data-testid={dataTestId && `${dataTestId}-title`}>{title}</h3>
        {sectionLink && (
          <div className={styles['section-link']}>{sectionLink}</div>
        )}
      </div>
      {children}
      <Divider />
    </section>
  );
};
