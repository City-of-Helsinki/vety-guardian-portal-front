import { TextInput, Fieldset } from 'hds-react';
import { useFormContext } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import type { FormValues } from '../../../types';
import { useTranslation } from 'react-i18next';
import { useApplicationData } from '../ApplicationDataContext';
import { LabelValue } from '../../summary/LabelValue';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s\-()]{5,20}$/;

export const Yhteystiedot = ({}) => {
  const { t } = useTranslation('lomake');
  const {
    register,
    trigger,
    getFieldState,
    getValues,
    formState: { errors },
  } = useFormContext<FormValues>();
  // A guardian can enter the other guardian's contact details until that guardian has saved their own.
  const application = useApplicationData();
  const isLocked = (guardian: 'h1' | 'h2') =>
    application.currentGuardian !== guardian &&
    application[`${guardian}YhteystiedotTallennettu`];
  const renderLocked = (guardian: 'h1' | 'h2') => (
    <>
      <LabelValue
        data-testid={`${guardian}-sahkoposti`}
        label={t('yhteystiedot.emailLabel')}
        value={getValues(`${guardian}Sahkoposti`)}
      />
      <LabelValue
        data-testid={`${guardian}-puhelinnumero`}
        label={t('yhteystiedot.phoneLabel')}
        value={getValues(`${guardian}Puhelinnumero`)}
      />
    </>
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
        {isLocked('h1') ? (
          renderLocked('h1')
        ) : (
          <>
            <TextInput
              id="h1-sahkoposti"
              data-testid="input-h1-sahkoposti"
              label={t('yhteystiedot.emailLabel')}
              type="email"
              {...register('h1Sahkoposti', {
                required: t('errors.required'),
                pattern: {
                  value: EMAIL_PATTERN,
                  message: t('errors.emailInvalid'),
                },
                onChange: validateConfirm('h1SahkopostiConfirm'),
              })}
              invalid={!!errors.h1Sahkoposti}
              errorText={errors.h1Sahkoposti?.message}
            />
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
            <TextInput
              id="h1-puhelinnumero"
              data-testid="input-h1-puhelinnumero"
              label={t('yhteystiedot.phoneLabel')}
              type="tel"
              {...register('h1Puhelinnumero', {
                required: t('errors.required'),
                pattern: {
                  value: PHONE_PATTERN,
                  message: t('errors.phoneInvalid'),
                },
              })}
              invalid={!!errors.h1Puhelinnumero}
              errorText={errors.h1Puhelinnumero?.message}
            />
          </>
        )}
      </Fieldset>
      <Fieldset
        heading={t('yhteystiedot.h2ContactsTitle')}
        data-testid="fieldset-h2-yhteystiedot"
      >
        {isLocked('h2') ? (
          renderLocked('h2')
        ) : (
          <>
            <TextInput
              id="h2-sahkoposti"
              data-testid="input-h2-sahkoposti"
              label={t('yhteystiedot.emailLabel')}
              type="email"
              {...register('h2Sahkoposti', {
                pattern: {
                  value: EMAIL_PATTERN,
                  message: t('errors.emailInvalid'),
                },
                onChange: validateConfirm('h2SahkopostiConfirm'),
              })}
              invalid={!!errors.h2Sahkoposti}
              errorText={errors.h2Sahkoposti?.message}
            />
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
            <TextInput
              id="h2-puhelinnumero"
              data-testid="input-h2-puhelinnumero"
              label={t('yhteystiedot.phoneLabel')}
              type="tel"
              {...register('h2Puhelinnumero', {
                pattern: {
                  value: PHONE_PATTERN,
                  message: t('errors.phoneInvalid'),
                },
              })}
              invalid={!!errors.h2Puhelinnumero}
              errorText={errors.h2Puhelinnumero?.message}
            />
          </>
        )}
      </Fieldset>
    </ApplicationFormStep>
  );
};
