import { Controller, useFormContext } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import { Checkbox, SelectionGroup } from 'hds-react';
import type { FormValues } from '../../../types';

export const TukiJaLaakehoito = ({}) => {
  const { control } = useFormContext<FormValues>();

  return (
    <ApplicationFormStep title="Erityisen tuen ja lääkehoidon tarve">
      <SelectionGroup>
        <Controller
          name="erityisenTuenTarve"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="erityisen-tuen-tarve"
              label="Lapsella on erityisen tuen tarve"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              onBlur={field.onBlur}
            />
          )}
        />
        <Controller
          name="laakehoidonTarve"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="laakehoidon-tarve"
              label="Lapsella on todettu vaativan lääkehoidon tarve"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              onBlur={field.onBlur}
            />
          )}
        />
      </SelectionGroup>
    </ApplicationFormStep>
  );
};
