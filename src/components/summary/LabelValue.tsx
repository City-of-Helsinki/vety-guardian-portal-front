import styles from './Summary.module.css';

interface LabelValueProps {
  label: string;
  value?: string | string[] | null;
}

const EMPTY_VALUE = '–';

export const LabelValue = ({ label, value }: LabelValueProps) => {
  const values = (Array.isArray(value) ? value : [value]).filter(Boolean);

  return (
    <div className={styles['label-value']}>
      <span className={styles.label}>{label}</span>
      {values.length === 0 ? (
        <span>{EMPTY_VALUE}</span>
      ) : (
        values.map((line, index) => <span key={index}>{line}</span>)
      )}
    </div>
  );
};
