import { SelectionGroup, RadioButton } from 'hds-react';
import { Controller, useFormContext } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import type { FormValues } from '../../../types';
import styles from '../ApplicationForm.module.css';

export const Kieli = ({}) => {
  const { control } = useFormContext<FormValues>();

  return (
    <ApplicationFormStep title="Esiopetuksen kieli">
      <Controller
        name="kieli"
        control={control}
        rules={{ required: 'Valitse esiopetuksen kieli' }}
        render={({ field, fieldState }) => (
          <SelectionGroup className={styles['selection-group']}>
            <div className={styles['selection-group-item']}>
              <RadioButton
                id="esiopetuksen-kieli-fi"
                name={field.name}
                value="fi"
                label="Suomi"
                checked={field.value === 'fi'}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            </div>
            <div className={styles['selection-group-item']}>
              <RadioButton
                id="esiopetuksen-kieli-sv"
                name={field.name}
                value="sv"
                label="Ruotsi"
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
