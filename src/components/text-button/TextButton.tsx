import styles from './TextButton.module.css';

interface TextButtonProps {
  label: string;
  onClick: () => void;
  'data-testid'?: string;
}

export const TextButton = ({
  label,
  onClick,
  'data-testid': dataTestId,
}: TextButtonProps) => {
  return (
    <div
      onClick={onClick}
      className={styles['text-button']}
      data-testid={dataTestId}
    >
      <span>{label}</span>
    </div>
  );
};
