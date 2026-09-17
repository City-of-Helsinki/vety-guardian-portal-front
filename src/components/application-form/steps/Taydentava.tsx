import { SelectionGroup, RadioButton } from 'hds-react';
import { Controller, useFormContext } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import type { FormValues } from '../../../types';
import styles from '../ApplicationForm.module.css';

export const Taydentava = ({}) => {
  const { control } = useFormContext<FormValues>();

  return (
    <ApplicationFormStep title="Täydentävän varhaiskasvatuksen tarve">
      <Controller
        name="taydentavaVarhaiskasvatus"
        control={control}
        rules={{
          validate: (v) =>
            typeof v === 'boolean' ||
            'Valitse täydentävän varhaiskasvatuksen tarve',
        }}
        render={({ field, fieldState }) => (
          <SelectionGroup className={styles['selection-group']}>
            <div className={styles['selection-group-item']}>
              <RadioButton
                id="needs-extended-care"
                name={field.name}
                label="Kyllä, lapsi tarvitsee esiopetuksen lisäksi täydentävää varhaiskasvatusta."
                checked={field.value === true}
                onChange={() => field.onChange(true)}
                onBlur={field.onBlur}
              />
            </div>
            <div className={styles['selection-group-item']}>
              <RadioButton
                id="no-extended-care"
                name={field.name}
                label="Ei, lapsi ei tarvitse esiopetuksen lisäksi täydentävää varhaiskasvatusta."
                checked={field.value === false}
                onChange={() => field.onChange(false)}
                onBlur={field.onBlur}
              />
            </div>
          </SelectionGroup>
        )}
      />
    </ApplicationFormStep>
  );
};
