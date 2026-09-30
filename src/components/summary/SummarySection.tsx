import type React from 'react';
import { Divider } from '../divider';
import styles from './Summary.module.css';

interface SummarySectionProps {
  title: string;
  sectionLink?: React.ReactNode;
  children: React.ReactNode;
}

export const SummarySection = ({
  title,
  sectionLink,
  children,
}: SummarySectionProps) => {
  return (
    <section className={styles.section}>
      <div className={styles['section-title']}>
        <h3>{title}</h3>
        {sectionLink && (
          <div className={styles['section-link']}>{sectionLink}</div>
        )}
      </div>
      {children}
      <Divider />
    </section>
  );
};
