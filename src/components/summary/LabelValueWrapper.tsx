import type React from 'react';
import styles from './Summary.module.css';

export const LabelValueWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className={styles.wrapper}>{children}</div>;
};
