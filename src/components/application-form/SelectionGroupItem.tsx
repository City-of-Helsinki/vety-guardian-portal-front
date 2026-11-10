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

  // The click handler is only a mouse/touch convenience that enlarges the hit
  // area of the inner radio/checkbox. Keyboard and screen reader users interact
  // with the inner input directly, so the wrapper needs no role or key handlers.
  // NOSONAR suppresses S6848 / S1082 (click handler on a non-interactive element).
  return (
    <div // NOSONAR
      {...props}
      className={[styles['selection-group-item'], className]
        .filter(Boolean)
        .join(' ')}
      onClick={handleClick}
    />
  );
};
