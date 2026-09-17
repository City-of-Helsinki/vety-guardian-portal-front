import { Checkbox, SelectionGroup } from 'hds-react';
import { useFormContext, Controller } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import type { FormValues } from '../../../types';

export const Alku = ({}) => {
  const { control } = useFormContext<FormValues>();

  return (
    <ApplicationFormStep title="Esiopetus">
      <Controller
        name="hakenutEnsisijaisestiYksityiseen"
        control={control}
        render={({ field }) => (
          <SelectionGroup>
            <Checkbox
              id="applied-to-private-preschool"
              label="Olemme hakeneet esiopetusta ensisijaisesti yksityisestä päiväkodista"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              onBlur={field.onBlur}
            />
          </SelectionGroup>
        )}
      />
    </ApplicationFormStep>
  );
};
