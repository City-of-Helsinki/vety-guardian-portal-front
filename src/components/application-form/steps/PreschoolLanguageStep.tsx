import { SelectionGroup, RadioButton } from 'hds-react';
import { Controller, useFormContext } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import type { FormValues } from '../../../types';

export const PreschoolLanguageStep = ({}) => {
  const { control } = useFormContext<FormValues>();

  return (
    <ApplicationFormStep title="Esiopetuksen kieli">
      <Controller
        //name="preschoolLanguage"
        name="kieli"
        control={control}
        rules={{ required: 'Valitse esiopetuksen kieli' }}
        render={({ field, fieldState }) => (
          <SelectionGroup>
            <RadioButton
              id="esiopetuksen-kieli-fi"
              name={field.name}
              value="fi"
              label="Suomi"
              checked={field.value === 'fi'}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
            <RadioButton
              id="esiopetuksen-kieli-sv"
              name={field.name}
              value="sv"
              label="Ruotsi"
              checked={field.value === 'sv'}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          </SelectionGroup>
        )}
      ></Controller>
    </ApplicationFormStep>
  );
};
