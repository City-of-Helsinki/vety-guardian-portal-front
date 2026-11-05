import type { HTMLAttributes, MouseEvent } from 'react';
import styles from './ApplicationForm.module.css';

const INTERACTIVE_SELECTOR = 'a, button, input, label, select, textarea';

export const SelectionGroupItem = ({
  className,
  onClick,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    if ((event.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) return;

    const input = event.currentTarget.querySelector<HTMLInputElement>(
      'input[type="radio"], input[type="checkbox"]',
    );
    if (input && !input.disabled) {
      input.click();
      input.focus();
    }
  };

  return (
    <div
      {...props}
      className={[styles['selection-group-item'], className]
        .filter(Boolean)
        .join(' ')}
      onClick={handleClick}
    />
  );
};
