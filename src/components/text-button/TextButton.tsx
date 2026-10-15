import styles from './TextButton.module.css';

interface TextButtonProps {
  label: string;
  onClick: () => void;
  'aria-label'?: string;
  'data-testid'?: string;
}

export const TextButton = ({
  label,
  onClick,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
}: TextButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={styles['text-button']}
      aria-label={ariaLabel}
      data-testid={dataTestId}
    >
      {label}
    </button>
  );
};
