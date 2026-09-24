import { SelectionGroup, RadioButton } from 'hds-react';
import { Controller, useFormContext } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import type { FormValues } from '../../../types';
import styles from '../ApplicationForm.module.css';
import { useTranslation } from 'react-i18next';

export const Kieli = ({}) => {
  const { control } = useFormContext<FormValues>();
  const { t } = useTranslation('lomake');

  return (
    <ApplicationFormStep title={t('kieli.title')}>
      <p>{t('kieli.kieliText')}</p>
      <Controller
        name="kieli"
        control={control}
        rules={{ required: 'Valitse esiopetuksen kieli' }}
        render={({ field, fieldState }) => (
          <SelectionGroup
            className={styles['selection-group']}
            errorText={fieldState.error?.message}
          >
            <div className={styles['selection-group-item']}>
              <RadioButton
                id="esiopetuksen-kieli-fi"
                data-testid="rb-eo-kieli-fi"
                name={field.name}
                value="fi"
                label={t('kieli.fi')}
                checked={field.value === 'fi'}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            </div>
            <div className={styles['selection-group-item']}>
              <RadioButton
                id="esiopetuksen-kieli-sv"
                data-testid="rb-eo-kieli-sv"
                name={field.name}
                value="sv"
                label={t('kieli.sv')}
                checked={field.value === 'sv'}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            </div>
          </SelectionGroup>
        )}
      />
    </ApplicationFormStep>
  );
};
