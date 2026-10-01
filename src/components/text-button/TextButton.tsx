import styles from './TextButton.module.css';

interface TextButtonProps {
  label: string;
  onClick: () => void;
}

export const TextButton = ({ label, onClick }: TextButtonProps) => {
  return (
    <div onClick={onClick} className={styles['text-button']}>
      <span>{label}</span>
    </div>
  );
};
