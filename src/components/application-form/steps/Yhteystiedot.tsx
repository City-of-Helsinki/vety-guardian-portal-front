import { TextInput, Fieldset, Notification } from 'hds-react';
import { useFormContext } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import type { FormValues } from '../../../types';
import { useTranslation } from 'react-i18next';
import { useGuardianIdentity } from '../../../auth/useGuardianIdentity';
import { useApplicationData } from '../ApplicationDataContext';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s\-()]{5,20}$/;

export const Yhteystiedot = ({}) => {
  const { t } = useTranslation('lomake');
  const {
    register,
    trigger,
    getFieldState,
    formState: { errors },
  } = useFormContext<FormValues>();
  // Guardians can only edit their own contact details (the backend ignores the other guardian's),
  // and the ones from Helsinki-profiili can only be changed there (pre-filled in toFormValues).
  const { currentGuardian } = useApplicationData();
  const { identity } = useGuardianIdentity();
  const isOwn = (guardian: 'h1' | 'h2') => currentGuardian === guardian;
  const isProfileEmail = (guardian: 'h1' | 'h2') =>
    isOwn(guardian) && !!identity.data?.email;
  const isProfilePhone = (guardian: 'h1' | 'h2') =>
    isOwn(guardian) && !!identity.data?.phone;
  const isEmailLocked = (guardian: 'h1' | 'h2') =>
    !isOwn(guardian) || isProfileEmail(guardian);
  const isPhoneLocked = (guardian: 'h1' | 'h2') =>
    !isOwn(guardian) || isProfilePhone(guardian);
  // The other guardian's fields aren't validated: the logged-in guardian can't fix them.
  const ownRules = <T extends object>(guardian: 'h1' | 'h2', rules: T) =>
    isOwn(guardian) ? rules : {};
  const renderProfileInfo = (guardian: 'h1' | 'h2') =>
    (isProfileEmail(guardian) || isProfilePhone(guardian)) && (
      <Notification
        type="info"
        data-testid={`notification-${guardian}-helsinki-profiili`}
      >
        {t('yhteystiedot.helsinkiProfiiliInfo')}
      </Notification>
    );

  const validateConfirm =
    (field: 'h1SahkopostiConfirm' | 'h2SahkopostiConfirm') => () => {
      if (getFieldState(field).isTouched) trigger(field);
    };

  return (
    <ApplicationFormStep
      data-testid="step-yhteystiedot"
      title={t('yhteystiedot.yhteystiedotTitle')}
    >
      <Fieldset
        heading={t('yhteystiedot.h1ContactsTitle')}
        data-testid="fieldset-h1-yhteystiedot"
      >
        {renderProfileInfo('h1')}
        <TextInput
          id="h1-sahkoposti"
          data-testid="input-h1-sahkoposti"
          label={t('yhteystiedot.emailLabel')}
          type="email"
          {...register(
            'h1Sahkoposti',
            ownRules('h1', {
              required: t('errors.required'),
              pattern: {
                value: EMAIL_PATTERN,
                message: t('errors.emailInvalid'),
              },
              onChange: validateConfirm('h1SahkopostiConfirm'),
            }),
          )}
          readOnly={isEmailLocked('h1')}
          invalid={!!errors.h1Sahkoposti}
          errorText={errors.h1Sahkoposti?.message}
        />
        {!isEmailLocked('h1') && (
          <TextInput
            id="h1-sahkoposti-confirm"
            data-testid="input-h1-sahkoposti-confirm"
            label={t('yhteystiedot.emailConfirmLabel')}
            type="email"
            {...register('h1SahkopostiConfirm', {
              required: t('errors.required'),
              validate: (value, values) =>
                value === values.h1Sahkoposti || t('errors.emailNotMatching'),
            })}
            invalid={!!errors.h1SahkopostiConfirm}
            errorText={errors.h1SahkopostiConfirm?.message}
          />
        )}
        <TextInput
          id="h1-puhelinnumero"
          data-testid="input-h1-puhelinnumero"
          label={t('yhteystiedot.phoneLabel')}
          type="tel"
          {...register(
            'h1Puhelinnumero',
            ownRules('h1', {
              required: t('errors.required'),
              pattern: {
                value: PHONE_PATTERN,
                message: t('errors.phoneInvalid'),
              },
            }),
          )}
          readOnly={isPhoneLocked('h1')}
          invalid={!!errors.h1Puhelinnumero}
          errorText={errors.h1Puhelinnumero?.message}
        />
      </Fieldset>
      <Fieldset
        heading={t('yhteystiedot.h2ContactsTitle')}
        data-testid="fieldset-h2-yhteystiedot"
      >
        {renderProfileInfo('h2')}
        <TextInput
          id="h2-sahkoposti"
          data-testid="input-h2-sahkoposti"
          label={t('yhteystiedot.emailLabel')}
          type="email"
          {...register(
            'h2Sahkoposti',
            ownRules('h2', {
              pattern: {
                value: EMAIL_PATTERN,
                message: t('errors.emailInvalid'),
              },
              onChange: validateConfirm('h2SahkopostiConfirm'),
            }),
          )}
          readOnly={isEmailLocked('h2')}
          invalid={!!errors.h2Sahkoposti}
          errorText={errors.h2Sahkoposti?.message}
        />
        {!isEmailLocked('h2') && (
          <TextInput
            id="h2-sahkoposti-confirm"
            data-testid="input-h2-sahkoposti-confirm"
            label={t('yhteystiedot.emailConfirmLabel')}
            type="email"
            {...register('h2SahkopostiConfirm', {
              validate: (value, values) =>
                (value ?? '') === (values.h2Sahkoposti ?? '') ||
                t('errors.emailNotMatching'),
            })}
            invalid={!!errors.h2SahkopostiConfirm}
            errorText={errors.h2SahkopostiConfirm?.message}
          />
        )}
        <TextInput
          id="h2-puhelinnumero"
          data-testid="input-h2-puhelinnumero"
          label={t('yhteystiedot.phoneLabel')}
          type="tel"
          {...register(
            'h2Puhelinnumero',
            ownRules('h2', {
              pattern: {
                value: PHONE_PATTERN,
                message: t('errors.phoneInvalid'),
              },
            }),
          )}
          readOnly={isPhoneLocked('h2')}
          invalid={!!errors.h2Puhelinnumero}
          errorText={errors.h2Puhelinnumero?.message}
        />
      </Fieldset>
    </ApplicationFormStep>
  );
};
