import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonVariant,
  Dialog,
  IconInfoCircle,
  IconCheckCircle,
  IconSize,
} from 'hds-react';
import styles from './ApplicationForm.module.css';

interface SubmitConfirmDialogProps {
  isOpen: boolean;
  isSent: boolean;
  isSubmitting: boolean;
  onConfirm: () => void;
  onClose: () => void;
  onGoHome: () => void;
  focusAfterCloseRef: React.RefObject<HTMLElement>;
}

const ConfirmContent = ({
  isSubmitting,
  onConfirm,
  onClose,
}: Pick<
  SubmitConfirmDialogProps,
  'isSubmitting' | 'onConfirm' | 'onClose'
>) => {
  const { t } = useTranslation('lomake');
  return (
    <>
      <Dialog.Content>
        <p id="submit-confirm-dialog-description">
          {t('submitConfirmDescription')}
        </p>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <Button
          variant={ButtonVariant.Primary}
          onClick={onConfirm}
          disabled={isSubmitting}
          data-testid="btn-submit-confirm"
        >
          {t('submitConfirmSend')}
        </Button>
        <Button
          variant={ButtonVariant.Secondary}
          onClick={onClose}
          disabled={isSubmitting}
          data-testid="btn-submit-cancel"
        >
          {t('submitConfirmCancel')}
        </Button>
      </Dialog.ActionButtons>
    </>
  );
};

const SentContent = ({
  onGoHome,
}: Pick<SubmitConfirmDialogProps, 'onGoHome'>) => {
  const { t } = useTranslation('lomake');
  return (
    <>
      <Dialog.Content className={styles['sent-confirmation']}>
        <IconCheckCircle size={IconSize.ExtraLarge} aria-hidden />
        <p id="submit-confirm-dialog-description">
          {t('submitSentDescription')}
        </p>
      </Dialog.Content>
      <Dialog.ActionButtons className={styles['sent-actions']}>
        <Button
          variant={ButtonVariant.Secondary}
          onClick={onGoHome}
          data-testid="btn-submit-sent-close"
        >
          {t('submitSentClose')}
        </Button>
      </Dialog.ActionButtons>
    </>
  );
};

export const SubmitConfirmDialog = ({
  isOpen,
  isSent,
  isSubmitting,
  onConfirm,
  onClose,
  onGoHome,
  focusAfterCloseRef,
}: SubmitConfirmDialogProps) => {
  const { t } = useTranslation('lomake');
  return (
    <Dialog
      id="submit-confirm-dialog"
      aria-labelledby="submit-confirm-dialog-title"
      aria-describedby="submit-confirm-dialog-description"
      isOpen={isOpen}
      close={isSent ? onGoHome : onClose}
      closeButtonLabelText={t('submitConfirmClose')}
      focusAfterCloseRef={focusAfterCloseRef}
    >
      <Dialog.Header
        key={isSent ? 'sent' : 'confirm'}
        id="submit-confirm-dialog-title"
        title={t('submitConfirmTitle')}
        iconStart={<IconInfoCircle />}
        className={styles['confirm-header']}
      />
      {isSent ? (
        <SentContent onGoHome={onGoHome} />
      ) : (
        <ConfirmContent
          isSubmitting={isSubmitting}
          onConfirm={onConfirm}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
};
