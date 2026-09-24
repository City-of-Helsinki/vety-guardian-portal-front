import type React from 'react';
import { Divider } from '../divider';
import styles from './Summary.module.css';

interface SummarySectionProps {
  title: string;
  children: React.ReactNode;
}

export const SummarySection = ({ title, children }: SummarySectionProps) => {
  return (
    <section className={styles.section}>
      <h3>{title}</h3>
      {children}
      <Divider />
    </section>
  );
};
