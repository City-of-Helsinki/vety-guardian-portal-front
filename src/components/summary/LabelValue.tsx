import styles from './Summary.module.css';

interface LabelValueProps {
  label: string;
  value?: string | string[] | null;
  'data-testid'?: string;
}

const EMPTY_VALUE = '–';

export const LabelValue = ({
  label,
  value,
  'data-testid': dataTestId,
}: LabelValueProps) => {
  const values = (Array.isArray(value) ? value : [value]).filter(Boolean);
  const valueTestId = dataTestId && `${dataTestId}-value`;

  return (
    <div className={styles['label-value']} data-testid={dataTestId}>
      <span
        className={styles.label}
        data-testid={dataTestId && `${dataTestId}-label`}
      >
        {label}
      </span>
      {values.length === 0 ? (
        <span data-testid={valueTestId}>{EMPTY_VALUE}</span>
      ) : (
        values.map((line, index) => (
          <span key={index} data-testid={valueTestId}>
            {line}
          </span>
        ))
      )}
    </div>
  );
};
